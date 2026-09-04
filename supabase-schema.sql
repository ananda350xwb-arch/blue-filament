-- ==============================================================================
-- BLUE FILAMENT 3D STUDIO - SUPABASE DATABASE SCHEMA
-- Copy and paste this into Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Create ORDERS table
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Policies
ALTER TABLE public.bf_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to bf_orders" ON public.bf_orders;
CREATE POLICY "Allow public read access to bf_orders" ON public.bf_orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to bf_orders" ON public.bf_orders;
CREATE POLICY "Allow public insert access to bf_orders" ON public.bf_orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to bf_orders" ON public.bf_orders;
CREATE POLICY "Allow public update access to bf_orders" ON public.bf_orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access to bf_orders" ON public.bf_orders;
CREATE POLICY "Allow public delete access to bf_orders" ON public.bf_orders FOR DELETE USING (true);

-- 2. Create FILAMENTS table
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

-- 3. Create MODEL_PRESETS table
CREATE TABLE IF NOT EXISTS public.bf_presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  color_count INTEGER NOT NULL DEFAULT 4,
  default_colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  description_th TEXT,
  recommended_size TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bf_presets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on bf_presets" ON public.bf_presets;
CREATE POLICY "Allow public all on bf_presets" ON public.bf_presets FOR ALL USING (true);

-- 4. Create PRINTER_FLEET table
CREATE TABLE IF NOT EXISTS public.bf_printers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  has_ams BOOLEAN NOT NULL DEFAULT true,
  ams_slots INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'idle',
  current_order_id TEXT,
  current_order_name TEXT,
  progress_percent INTEGER DEFAULT 0,
  time_remaining_minutes INTEGER,
  temperature_nozzle INTEGER DEFAULT 220,
  temperature_bed INTEGER DEFAULT 55,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bf_printers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on bf_printers" ON public.bf_printers;
CREATE POLICY "Allow public all on bf_printers" ON public.bf_printers FOR ALL USING (true);

-- 5. Create STORE_SETTINGS table
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

-- Enable Realtime Broadcast for live syncing
ALTER PUBLICATION supabase_realtime ADD TABLE public.bf_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bf_filaments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bf_printers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bf_settings;
