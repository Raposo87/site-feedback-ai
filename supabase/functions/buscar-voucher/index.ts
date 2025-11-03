import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const url = new URL(req.url);
    const voucherId = url.searchParams.get("id");

    if (!voucherId) {
      return new Response(
        JSON.stringify({ error: "ID do voucher é obrigatório" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: voucher, error } = await supabaseClient
      .from("vouchers")
      .select("*")
      .eq("id", voucherId)
      .eq("disponivel", true)
      .single();

    if (error) {
      console.error("Erro ao buscar voucher:", error);
      throw error;
    }

    if (!voucher) {
      return new Response(
        JSON.stringify({ error: "Voucher não encontrado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    console.log("Voucher encontrado:", voucher.id);

    return new Response(JSON.stringify({ voucher }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro na função buscar-voucher:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
