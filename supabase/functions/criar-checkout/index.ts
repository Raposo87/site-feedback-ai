import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { voucher_id, email_usuario } = await req.json();

    if (!voucher_id || !email_usuario) {
      return new Response(
        JSON.stringify({ error: "voucher_id e email_usuario são obrigatórios" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Iniciando checkout para voucher:", voucher_id);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Buscar o voucher
    const { data: voucher, error: voucherError } = await supabaseClient
      .from("vouchers")
      .select("*")
      .eq("id", voucher_id)
      .eq("disponivel", true)
      .single();

    if (voucherError || !voucher) {
      console.error("Voucher não encontrado:", voucherError);
      return new Response(
        JSON.stringify({ error: "Voucher não encontrado ou indisponível" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    console.log("Voucher encontrado:", voucher.nome, "Preço:", voucher.preco);

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Verificar se cliente Stripe já existe
    const customers = await stripe.customers.list({ email: email_usuario, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Cliente Stripe existente:", customerId);
    } else {
      console.log("Novo cliente Stripe será criado");
    }

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email_usuario,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: voucher.nome,
              description: voucher.descricao,
              images: voucher.imagem_url ? [voucher.imagem_url] : [],
            },
            unit_amount: Math.round(parseFloat(voucher.preco) * 100), // Converter para centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        voucher_id: voucher.id,
        email_usuario: email_usuario,
      },
    });

    console.log("Sessão de checkout criada:", session.id);

    // Criar pedido pendente
    const { data: pedido, error: pedidoError } = await supabaseClient
      .from("pedidos")
      .insert({
        voucher_id: voucher.id,
        email_usuario: email_usuario,
        stripe_checkout_session_id: session.id,
        status: "Pendente",
      })
      .select()
      .single();

    if (pedidoError) {
      console.error("Erro ao criar pedido:", pedidoError);
      throw pedidoError;
    }

    console.log("Pedido criado:", pedido.id);

    return new Response(
      JSON.stringify({ 
        checkout_url: session.url,
        session_id: session.id,
        pedido_id: pedido.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro na função criar-checkout:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
