import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    // Verificar assinatura do webhook (em produção, configure STRIPE_WEBHOOK_SECRET)
    let event;
    try {
      const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
      } else {
        event = JSON.parse(body);
        console.warn("ATENÇÃO: Webhook sem verificação de assinatura");
      }
    } catch (err) {
      console.error("Erro ao verificar webhook:", err);
      return new Response(
        JSON.stringify({ error: "Webhook signature verification failed" }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("Evento recebido:", event.type);

    // Processar apenas eventos de checkout completado
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Checkout completado:", session.id);

      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // Usar service role para bypass RLS
      );

      // Buscar o pedido
      const { data: pedido, error: pedidoError } = await supabaseClient
        .from("pedidos")
        .select("*, vouchers(*)")
        .eq("stripe_checkout_session_id", session.id)
        .single();

      if (pedidoError || !pedido) {
        console.error("Pedido não encontrado:", pedidoError);
        return new Response(
          JSON.stringify({ error: "Pedido não encontrado" }),
          { status: 404, headers: corsHeaders }
        );
      }

      console.log("Pedido encontrado:", pedido.id);

      // Gerar código único do voucher
      const codigoVoucher = `VOUCHER-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
      console.log("Código gerado:", codigoVoucher);

      // Atualizar pedido
      const { error: updateError } = await supabaseClient
        .from("pedidos")
        .update({
          status: "Pago",
          codigo_voucher_gerado: codigoVoucher,
          stripe_payment_intent_id: session.payment_intent,
        })
        .eq("id", pedido.id);

      if (updateError) {
        console.error("Erro ao atualizar pedido:", updateError);
        throw updateError;
      }

      console.log("Pedido atualizado para Pago");

      // Enviar email de confirmação
      try {
        const emailHtml = `
          <h1>Obrigado pela sua compra!</h1>
          <p>Olá,</p>
          <p>Seu voucher foi processado com sucesso!</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2>${pedido.vouchers.nome}</h2>
            <p><strong>Código do Voucher:</strong> <span style="font-size: 24px; color: #007bff; font-weight: bold;">${codigoVoucher}</span></p>
            <p><strong>Descrição:</strong> ${pedido.vouchers.descricao}</p>
            <p><strong>Valor pago:</strong> €${pedido.vouchers.preco}</p>
          </div>
          
          <p>Guarde este código com cuidado. Você precisará dele para resgatar sua experiência!</p>
          
          <p>Atenciosamente,<br>Equipe de Vouchers</p>
        `;

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
          },
          body: JSON.stringify({
            from: "Vouchers <onboarding@resend.dev>",
            to: [pedido.email_usuario],
            subject: "✅ Seu Voucher - Confirmação de Compra",
            html: emailHtml,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.text();
          console.error("Erro da API Resend:", errorData);
        } else {
          console.log("Email enviado para:", pedido.email_usuario);
        }
      } catch (emailError) {
        console.error("Erro ao enviar email:", emailError);
        // Não falhar a requisição se o email falhar
      }

      return new Response(
        JSON.stringify({ 
          received: true,
          pedido_id: pedido.id,
          codigo: codigoVoucher
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Outros tipos de eventos
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro no webhook:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
