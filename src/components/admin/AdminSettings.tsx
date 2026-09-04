import React, { useState } from 'react';
import { Save, Download, Upload, RotateCcw, ShieldCheck, Megaphone, DollarSign, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../../types';

interface AdminSettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => void;
  onExportData: () => string;
  onImportData: (json: string) => { success: boolean; message: string };
  onResetDefaults: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onResetDefaults,
  onShowToast,
}) => {
  const [form, setForm] = useState<StoreSettings>(settings);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleSave = () => {
    onUpdateSettings(form);
    onShowToast('บันทึกการตั้งค่าร้านค้าเรียบร้อย!', undefined, 'success');
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
            ตั้งค่าร้านค้า & สำรองข้อมูล
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ปรับแต่งข้อมูลติดต่อ อัตราคำนวณราคา ข้อความประกาศ และจัดการฐานข้อมูล
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

          {/* Factory Reset */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('คำเตือน: คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นใช่หรือไม่?')) {
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
