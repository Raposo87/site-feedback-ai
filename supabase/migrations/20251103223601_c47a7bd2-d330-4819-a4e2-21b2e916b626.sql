-- Criar tabela de vouchers (produtos)
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  imagem_url TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de pedidos (orders)
CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  email_usuario TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Pago', 'Falhou')),
  codigo_voucher_gerado TEXT UNIQUE,
  data_pedido TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para vouchers (público pode ler)
CREATE POLICY "Vouchers são visíveis publicamente"
  ON public.vouchers
  FOR SELECT
  USING (disponivel = true);

-- Políticas RLS para pedidos (usuários podem ver seus próprios pedidos)
CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON public.pedidos
  FOR SELECT
  USING (email_usuario = auth.jwt() ->> 'email');

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_pedidos_email ON public.pedidos(email_usuario);
CREATE INDEX IF NOT EXISTS idx_pedidos_stripe_payment_intent ON public.pedidos(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_stripe_checkout_session ON public.pedidos(stripe_checkout_session_id);