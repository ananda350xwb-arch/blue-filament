import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, RotateCcw, ShieldCheck, Megaphone, DollarSign, MessageCircle, Cloud, Database, CheckCircle2, AlertCircle, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { StoreSettings } from '../../types';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, testSupabaseConnection } from '../../lib/supabase';

interface AdminSettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => void;
  onExportData: () => string;
  onImportData: (json: string) => { success: boolean; message: string };
  onClearAllOrders?: () => Promise<void> | void;
  onResetDefaults: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onClearAllOrders,
  onResetDefaults,
  onShowToast,
}) => {
  const [form, setForm] = useState<StoreSettings>(settings);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  // Cloud Supabase State
  const [cloudConfig, setCloudConfig] = useState(getSupabaseConfig());
  const [supabaseUrl, setSupabaseUrl] = useState(cloudConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(cloudConfig.anonKey);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    setCloudConfig(getSupabaseConfig());
  }, []);

  const handleSave = () => {
    onUpdateSettings(form);
    onShowToast('บันทึกการตั้งค่าร้านค้าเรียบร้อย!', undefined, 'success');
  };

  const handleConnectCloud = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      onShowToast('กรุณากรอก Supabase URL และ Anon Key ให้ครบถ้วน', undefined, 'error');
      return;
    }

    setIsTestingCloud(true);
    const result = await testSupabaseConnection(supabaseUrl.trim(), supabaseAnonKey.trim());
    setIsTestingCloud(false);

    if (result.success) {
      saveSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
      setCloudConfig({ url: supabaseUrl.trim(), anonKey: supabaseAnonKey.trim(), connected: true });
      onShowToast('เชื่อมต่อ Cloud Database สำเร็จ!', result.message, 'success');
    } else {
      onShowToast('การเชื่อมต่อล้มเหลว', result.message, 'error');
    }
  };

  const handleDisconnectCloud = () => {
    if (window.confirm('คุณต้องการยกเลิกการเชื่อมต่อ Cloud Database และกลับไปใช้ LocalStorage ใช่หรือไม่?')) {
      clearSupabaseConfig();
      setCloudConfig({ url: '', anonKey: '', connected: false });
      setSupabaseUrl('');
      setSupabaseAnonKey('');
      onShowToast('ยกเลิกการเชื่อมต่อ Cloud แล้ว', 'ระบบกลับมาใช้ LocalStorage ในเครื่อง', 'info');
    }
  };

  const handleCopySqlSchema = () => {
    const sqlSchema = `-- ==============================================================================
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

-- 3. Create STORE_SETTINGS table
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

-- Enable Realtime
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
END $$;`;

    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    onShowToast('คัดลอกโค้ด SQL สำเร็จ!', 'นำไปวางใน SQL Editor บนเว็บ Supabase แล้วกด RUN ได้ทันที', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleExport = () => {
    const jsonStr = onExportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blue-filament-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('ดาวน์โหลดไฟล์สำรองข้อมูล JSON สำเร็จ!', undefined, 'success');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      onShowToast('กรุณาวางเนื้อหา JSON ที่ต้องการนำเข้า', undefined, 'error');
      return;
    }
    const res = onImportData(importJsonText);
    if (res.success) {
      onShowToast(res.message, undefined, 'success');
      setShowImportBox(false);
      setImportJsonText('');
      window.location.reload();
    } else {
      onShowToast(res.message, undefined, 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            ตั้งค่าร้านค้า & ระบบ Cloud Database
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ปรับแต่งข้อมูลติดต่อ อัตราคำนวณราคา ข้อความประกาศ และเชื่อมต่อฐานข้อมูลออนไลน์
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="btn-3d-blue px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-3d-blue flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>บันทึกการเปลี่ยนแปลง</span>
        </button>
      </div>

      {/* CLOUD DATABASE (SUPABASE) CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border-2 border-indigo-500/30 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg sm:text-xl text-white">
                  ระบบฐานข้อมูลออนไลน์ (Supabase Cloud)
                </h3>
                {cloudConfig.connected ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ออนไลน์ Real-time
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> โหมด LocalStorage
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                ให้ออเดอร์ที่ลูกค้าสั่งจากมือถือบน Vercel ส่งเข้าหลังบ้านร้านข้ามเครื่องอัตโนมัติ
              </p>
            </div>
          </div>

          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-300 hover:text-white inline-flex items-center gap-1.5 self-start sm:self-auto bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
          >
            <span>เปิดเว็บ Supabase</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Setup Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Supabase URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>Supabase Project URL:</span>
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzabcdefg.supabase.co"
                className="w-full bg-white/10 border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Anon Key */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">
                Supabase anon public key:
              </label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full bg-white/10 border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleConnectCloud}
              disabled={isTestingCloud}
              className="btn-3d-blue px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-3d-blue flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              <span>{isTestingCloud ? 'กำลังทดสอบเชื่อมต่อ...' : 'ทดสอบและบันทึกเชื่อมต่อ Cloud'}</span>
            </button>

            {/* Copy SQL Schema Button */}
            <button
              type="button"
              onClick={handleCopySqlSchema}
              className="bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-300" />
              <span>{copiedSql ? '✓ คัดลอกโค้ด SQL แล้ว!' : 'คัดลอก SQL สร้างตาราง (SQL Editor)'}</span>
            </button>

            {cloudConfig.connected && (
              <button
                type="button"
                onClick={handleDisconnectCloud}
                className="text-xs text-red-300 hover:text-red-200 hover:underline cursor-pointer ml-auto"
              >
                ยกเลิกการเชื่อมต่อ Cloud
              </button>
            )}
          </div>
        </div>

        {/* 3 Step Simple Guide */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
          <span className="font-bold text-white block">💡 วิธีสร้าง Cloud Database ฟรีบน Supabase ใน 1 นาที:</span>
          <ol className="list-decimal list-inside space-y-1 leading-relaxed text-slate-300">
            <li>เปิดเว็บ <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline font-bold">supabase.com</a> ล็อกอินด้วย GitHub แล้วกด <strong>"New Project"</strong> (ฟรี)</li>
            <li>ไปที่เมนู <strong>SQL Editor</strong> ➔ กดปุ่ม <strong>"คัดลอก SQL สร้างตาราง"</strong> ด้านบนไปวางแล้วกด <strong>RUN</strong></li>
            <li>ไปที่ <strong>Project Settings ➔ API</strong> คัดลอก <strong>Project URL</strong> และ <strong>anon public key</strong> มาใส่ในช่องด้านบน แล้วกดเชื่อมต่อได้ทันทีครับ!</li>
          </ol>
        </div>

      </div>

      {/* Form Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Store & Contact Info */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-display font-bold text-base text-slate-900">ข้อมูลติดต่อร้าน & LINE</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ชื่อร้าน (Store Name):</label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">LINE Official Account ID:</label>
              <input
                type="text"
                value={form.lineId}
                onChange={(e) => setForm({ ...form, lineId: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">เบอร์โทรศัพท์ (Phone):</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* 2. Pricing Calculator Rates */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <h3 className="font-display font-bold text-base text-slate-900">อัตราคำนวณราคาอัตโนมัติ</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ราคาค่า Filament ต่อกรัม (บาท/g):</label>
              <input
                type="number"
                step="0.1"
                value={form.basePricePerGram}
                onChange={(e) => setForm({ ...form, basePricePerGram: Number(e.target.value) })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ค่าสลับสี AMS ต่อสีเพิ่มเติม (บาท/สี):</label>
              <input
                type="number"
                value={form.amsColorChangeFee}
                onChange={(e) => setForm({ ...form, amsColorChangeFee: Number(e.target.value) })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ค่าจัดส่งพัสดุเหมาจ่าย (บาท):</label>
              <input
                type="number"
                value={form.shippingFlatRate}
                onChange={(e) => setForm({ ...form, shippingFlatRate: Number(e.target.value) })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

      </div>

      {/* 3. Announcement & License */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Megaphone className="w-5 h-5 text-pink-600" />
          <h3 className="font-display font-bold text-base text-slate-900">ประกาศร้านค้า & เงื่อนไขลิขสิทธิ์</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">ข้อความประกาศบนแถบหัวเว็บ:</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, announcementActive: !form.announcementActive })}
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full cursor-pointer ${
                  form.announcementActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {form.announcementActive ? '🟢 กำลังแสดงประกาศ' : '⚪ ปิดประกาศ'}
              </button>
            </div>
            <input
              type="text"
              value={form.announcementText}
              onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>ข้อความ License Notice (ข้อกำหนดลิขสิทธิ์):</span>
            </label>
            <textarea
              rows={2}
              value={form.licenseNotice}
              onChange={(e) => setForm({ ...form, licenseNotice: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 4. Backup, Export, Import & Factory Reset */}
      <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-display font-black text-base text-slate-900">สำรอง & จัดการฐานข้อมูล (JSON Database)</h3>
            <p className="text-xs text-slate-500">บันทึกหรือย้ายข้อมูลออเดอร์ สีฟิลาเมนต์ และการตั้งค่าทั้งหมด</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            className="btn-3d-secondary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>ส่งออกข้อมูล (Export JSON)</span>
          </button>

          {/* Import */}
          <button
            type="button"
            onClick={() => setShowImportBox(!showImportBox)}
            className="btn-3d-secondary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-purple-600" />
            <span>นำเข้าข้อมูล (Import JSON)</span>
          </button>

          {/* Clear All Orders */}
          {onClearAllOrders && (
            <button
              type="button"
              onClick={async () => {
                if (window.confirm('คุณต้องการลบรายการออเดอร์ทั้งหมดในระบบเพื่อเตรียมเปิดใช้งานจริงใช่หรือไม่?\n\n(ออเดอร์ในเครื่องและบน Supabase Cloud จะถูกเคลียร์ทั้งหมด)')) {
                  await onClearAllOrders();
                  onShowToast('ลบรายการออเดอร์ทั้งหมดสำเร็จ!', 'ระบบพร้อมรับออเดอร์จริงจากลูกค้า 100%', 'success');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              title="ลบออเดอร์ทั้งหมดเพื่อเตรียมเปิดร้านจริง"
            >
              <Trash2 className="w-4 h-4 text-amber-600" />
              <span>ล้างออเดอร์ทั้งหมด (Clear All Orders)</span>
            </button>
          )}

          {/* Factory Reset */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('คำเตือน: คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นสำหรับใช้งานจริงใช่หรือไม่?')) {
                onResetDefaults();
                onShowToast('รีเซ็ตข้อมูลระบบกลับสู่ค่าเริ่มต้นเรียบร้อย!', undefined, 'info');
                window.location.reload();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>รีเซ็ตค่าเริ่มต้น (Factory Reset)</span>
          </button>
        </div>

        {/* Import JSON Box */}
        {showImportBox && (
          <div className="p-4 bg-white rounded-2xl border-2 border-purple-200 space-y-3 animate-in zoom-in-95">
            <label className="text-xs font-bold text-purple-900 block">
              วางเนื้อหา JSON ที่คัดลอกมาจากไฟล์สำรอง:
            </label>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"version":"1.0.0", "orders":[...], "filaments":[...]}'
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="btn-3d-blue px-4 py-1.5 rounded-lg text-xs font-bold text-white"
              >
                ยืนยันการนำเข้า
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
