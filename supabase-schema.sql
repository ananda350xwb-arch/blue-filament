-- ==============================================================================
-- BLUE FILAMENT 3D STUDIO - SUPABASE DATABASE SCHEMA
-- Copy all lines below and paste into Supabase SQL Editor -> Click RUN
-- ==============================================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.bf_orders (
  order_id TEXT PRIMARY KEY,
  model_url TEXT NOT NULL,
  model_name TEXT NOT NULL,
  color_count INTEGER NOT NULL DEFAULT 1,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  quantity INTEGER NOT NULL DEFAULT 1,
  scale NUMERIC NOT NULL DEFAULT 100,
  infill TEXT NOT NULL DEFAULT 'standard',
  note TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  price_status TEXT NOT NULL DEFAULT 'TO BE CONFIRMED',
  quoted_price NUMERIC,
  estimated_grams NUMERIC,
  estimated_print_time_hours NUMERIC,
  assigned_printer_id TEXT,
  internal_notes TEXT,
  tracking_number TEXT,
  customer_name TEXT,
  customer_contact TEXT,
  payment_status TEXT NOT NULL DEFAULT 'UNPAID',
  paid_amount NUMERIC,
  payment_date TIMESTAMPTZ,
  payment_slip_url TEXT,
  payment_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Upgrade existing table if columns don't exist yet
ALTER TABLE public.bf_orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.bf_orders ADD COLUMN IF NOT EXISTS customer_contact TEXT;
ALTER TABLE public.bf_orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'UNPAID';
ALTER TABLE public.bf_orders ADD COLUMN IF NOT EXISTS paid_amount NUMERIC;
ALTER TABLE public.bf_orders ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;
ALTER TABLE public.bf_orders ADD COLUMN IF NOT EXISTS payment_slip_url TEXT;
ALTER TABLE public.bf_orders ADD COLUMN IF NOT EXISTS payment_note TEXT;

ALTER TABLE public.bf_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to bf_orders" ON public.bf_orders;
CREATE POLICY "Allow public read access to bf_orders" ON public.bf_orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to bf_orders" ON public.bf_orders;
CREATE POLICY "Allow public insert access to bf_orders" ON public.bf_orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to bf_orders" ON public.bf_orders;
CREATE POLICY "Allow public update access to bf_orders" ON public.bf_orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access to bf_orders" ON public.bf_orders;
CREATE POLICY "Allow public delete access to bf_orders" ON public.bf_orders FOR DELETE USING (true);


-- 2. FILAMENTS TABLE
CREATE TABLE IF NOT EXISTS public.bf_filaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  hex TEXT NOT NULL,
  secondary_hex TEXT,
  material TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'basic',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  popular BOOLEAN DEFAULT false,
  badge TEXT,
  description_th TEXT,
  remaining_grams NUMERIC DEFAULT 1000,
  price_per_gram NUMERIC DEFAULT 1.2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bf_filaments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on bf_filaments" ON public.bf_filaments;
CREATE POLICY "Allow public all on bf_filaments" ON public.bf_filaments FOR ALL USING (true);


-- 3. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.bf_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL DEFAULT 'Blue Filament 3D Studio',
  line_id TEXT NOT NULL DEFAULT '@bluefilament',
  phone TEXT NOT NULL DEFAULT '081-234-5678',
  announcement_text TEXT DEFAULT '',
  announcement_active BOOLEAN NOT NULL DEFAULT true,
  base_price_per_gram NUMERIC NOT NULL DEFAULT 1.2,
  ams_color_change_fee NUMERIC NOT NULL DEFAULT 25,
  shipping_flat_rate NUMERIC NOT NULL DEFAULT 45,
  license_notice TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bf_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on bf_settings" ON public.bf_settings;
CREATE POLICY "Allow public all on bf_settings" ON public.bf_settings FOR ALL USING (true);


-- 4. ENABLE REALTIME SYNC SAFELY
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bf_orders;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bf_filaments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bf_settings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
