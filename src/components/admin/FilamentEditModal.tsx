import React, { useState, useEffect } from 'react';
import { X, Palette, Check } from 'lucide-react';
import { FilamentColor, MaterialType } from '../../types';

interface FilamentEditModalProps {
  isOpen: boolean;
  filament: FilamentColor | null; // null for new
  onClose: () => void;
  onSave: (filament: FilamentColor) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

const MATERIAL_OPTIONS: MaterialType[] = [
  'PLA+',
  'Matte PLA',
  'Silk Glossy',
  'Dual Silk',
  'PETG',
  'Glow PLA',
  'TPU Flex',
  'Wood PLA',
  'Carbon Fiber'
];

export const FilamentEditModal: React.FC<FilamentEditModalProps> = ({
  isOpen,
  filament,
  onClose,
  onSave,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [hex, setHex] = useState('#2563EB');
  const [secondaryHex, setSecondaryHex] = useState('');
  const [material, setMaterial] = useState<MaterialType>('PLA+');
  const [category, setCategory] = useState<'basic' | 'pastel' | 'neon' | 'silk' | 'special'>('basic');
  const [inStock, setInStock] = useState(true);
  const [badge, setBadge] = useState('');
  const [descriptionTh, setDescriptionTh] = useState('');
  const [remainingGrams, setRemainingGrams] = useState<number>(1000);

  useEffect(() => {
    if (filament) {
      setName(filament.name);
      setNameTh(filament.nameTh);
      setHex(filament.hex);
      setSecondaryHex(filament.secondaryHex || '');
      setMaterial(filament.material);
      setCategory(filament.category);
      setInStock(filament.inStock);
      setBadge(filament.badge || '');
      setDescriptionTh(filament.descriptionTh || '');
      setRemainingGrams(filament.remainingGrams || 1000);
    } else {
      // New filament default
      const randomId = Math.floor(100 + Math.random() * 900);
      setName(`Filament Color #${randomId}`);
      setNameTh(`สีฟิลาเมนต์ใหม่ #${randomId}`);
      setHex('#3B82F6');
      setSecondaryHex('');
      setMaterial('PLA+');
      setCategory('basic');
      setInStock(true);
      setBadge('New');
      setDescriptionTh('เส้นฟิลาเมนต์คุณภาพสูง สีคมชัด');
      setRemainingGrams(1000);
    }
  }, [filament, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim() || !nameTh.trim()) {
      onShowToast('กรุณากรอกชื่อสีให้ครบถ้วน', undefined, 'error');
      return;
    }

    const newFilament: FilamentColor = {
      id: filament?.id || `fil-${Date.now()}`,
      name: name.trim(),
      nameTh: nameTh.trim(),
      hex: hex.trim(),
      secondaryHex: secondaryHex.trim() || undefined,
      material,
      category,
      inStock,
      badge: badge.trim() || undefined,
      descriptionTh: descriptionTh.trim() || undefined,
      remainingGrams: remainingGrams
    };

    onSave(newFilament);
    onShowToast('บันทึกข้อมูลเส้นฟิลาเมนต์สำเร็จ!', newFilament.nameTh, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900 space-y-5 relative max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-slate-900">
                {filament ? 'แก้ไขข้อมูลสี Filament' : 'เพิ่มสี Filament ใหม่'}
              </h3>
              <p className="text-xs text-slate-500">
                จัดการเฉดสี วัสดุ และสถานะสต็อกสินค้าในร้าน
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Color Ball Preview */}
        <div className="flex items-center justify-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div
            className="w-16 h-16 rounded-full border-4 border-white shadow-xl relative transition-transform transform hover:scale-105"
            style={{
              background: secondaryHex
                ? `linear-gradient(135deg, ${hex} 0%, ${secondaryHex} 100%)`
                : `radial-gradient(circle at 35% 30%, ${hex} 0%, #000000 130%)`,
              boxShadow: `0 10px 25px -4px ${hex}70, inset 0 4px 6px rgba(255,255,255,0.8)`
            }}
          >
            <div className="absolute top-2 left-3 w-5 h-3 bg-white/70 rounded-full filter blur-[1px] transform -rotate-30" />
          </div>

          <div>
            <div className="font-display font-black text-base text-slate-900">{nameTh || 'ตัวอย่างสี'}</div>
            <div className="text-xs text-blue-600 font-bold">{name || 'Color Name'} • {material}</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              HEX: {hex} {secondaryHex ? `| ${secondaryHex}` : ''}
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name Thai */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ชื่อภาษาไทย (Name TH):</label>
              <input
                type="text"
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
                placeholder="เช่น น้ำเงินอิเล็คทริค"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none focus:border-blue-600"
              />
            </div>

            {/* Name English */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ชื่อภาษาอังกฤษ (Name EN):</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น Electric Blue"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Hex Picker */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">รหัสสีหลัก (Primary Hex):</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Secondary Hex (For Dual-Color) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">สีที่สอง (ทูโทน Dual-Color):</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryHex || '#A855F7'}
                  onChange={(e) => setSecondaryHex(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={secondaryHex}
                  onChange={(e) => setSecondaryHex(e.target.value)}
                  placeholder="เว้นว่างถ้าเป็นสีเดี่ยว"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 uppercase outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Material */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ประเภทวัสดุ (Material):</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value as MaterialType)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
              >
                {MATERIAL_OPTIONS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">หมวดหมู่สี (Category):</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="basic">สีมาตรฐาน Basic</option>
                <option value="pastel">พาสเทล Pastel</option>
                <option value="silk">ซิลค์เงา Silk</option>
                <option value="neon">นีออน Neon</option>
                <option value="special">พิเศษ Special / Glow</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Remaining Spool Weight */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">น้ำหนักคงเหลือในม้วน (g):</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={remainingGrams}
                onChange={(e) => setRemainingGrams(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
              />
            </div>

            {/* Badge Tag */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ป้ายกำกับ Badge (Optional):</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="เช่น Signature, Popular, New"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">คำอธิบายสี (Description):</label>
            <input
              type="text"
              value={descriptionTh}
              onChange={(e) => setDescriptionTh(e.target.value)}
              placeholder="เช่น สีน้ำเงินสดใส มันเงา สวยคมชัด"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          {/* Stock Toggle Switch */}
          <div className="pt-2 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">สถานะสต็อก (In-Stock Status):</span>
              <span className="text-[11px] text-slate-500">
                {inStock ? '🟢 มีสินค้าพร้อมให้ลูกค้าเลือกสั่งพิมพ์' : '🔴 สินค้าหมด (ปิดการเลือกในหน้าเว็บ)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                inStock ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                inStock ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="btn-3d-blue px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-3d-blue cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกข้อมูลสี</span>
          </button>
        </div>

      </div>
    </div>
  );
};
