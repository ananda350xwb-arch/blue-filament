import React from 'react';
import { Minus, Plus, MessageSquare, Maximize2, Box } from 'lucide-react';

interface Step3DetailsProps {
  quantity: number;
  setQuantity: (q: number) => void;
  scaleMode: 'original' | 'custom';
  setScaleMode: (mode: 'original' | 'custom') => void;
  scale: number;
  setScale: (s: number) => void;
  infill: 'standard' | 'strong' | 'solid';
  setInfill: (inf: 'standard' | 'strong' | 'solid') => void;
  note: string;
  setNote: (note: string) => void;
}

export const Step3Details: React.FC<Step3DetailsProps> = ({
  quantity,
  setQuantity,
  scaleMode,
  setScaleMode,
  scale,
  setScale,
  infill,
  setInfill,
  note,
  setNote,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Step Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          <span>STEP 03</span>
          <span>•</span>
          <span>PRINT DETAILS</span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
          ระบุรายละเอียดการพิมพ์
        </h2>

        <p className="text-sm text-slate-600">
          กำหนดจำนวนชิ้น สัดส่วนขนาด ความหนาแน่น และความต้องการเพิ่มเติม
        </p>
      </div>

      {/* 1. Quantity Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            จำนวนชิ้นงาน (QUANTITY)
          </span>
          <span className="font-display font-bold text-xl text-slate-900">
            {quantity} ชิ้น (Pieces)
          </span>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border-2 border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-800 font-bold flex items-center justify-center transition-all cursor-pointer border border-slate-200 shadow-sm"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="font-display font-black text-2xl text-amber-600 min-w-[36px] text-center">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* 2. Size & Scale Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-blue-600" />
            <span>ขนาดของโมเดล (SCALE)</span>
          </label>
        </div>

        {/* Radio Tabs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setScaleMode('original');
              setScale(100);
            }}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              scaleMode === 'original'
                ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                scaleMode === 'original' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
              }`} />
              <span>Original Size (100%)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 pl-5">
              พิมพ์ตามสัดส่วนมาตรฐานของผู้ออกแบบ
            </p>
          </button>

          <button
            type="button"
            onClick={() => setScaleMode('custom')}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              scaleMode === 'custom'
                ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                scaleMode === 'custom' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
              }`} />
              <span>Custom Size ({scale}%)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 pl-5">
              ย่อหรือขยายขนาดตามต้องการ
            </p>
          </button>
        </div>

        {/* Custom Slider */}
        {scaleMode === 'custom' && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in zoom-in-95">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">ปรับขนาดสัดส่วน:</span>
              <span className="text-blue-700 font-mono text-base font-black px-2.5 py-0.5 rounded-lg bg-blue-100 border border-blue-200">
                {scale}%
              </span>
            </div>

            <input
              type="range"
              min="30"
              max="250"
              step="5"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30% (จิ๋วพกพา)</span>
              <span>100% (ปกติ)</span>
              <span>250% (จัมโบ้)</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Infill & Strength Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 space-y-3 shadow-sm">
        <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Box className="w-4 h-4 text-emerald-600" />
          <span>ความหนาแน่นภายใน (INFILL STRENGTH)</span>
        </label>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'standard', title: 'มาตรฐาน (15-20%)', subtitle: 'เหมาะกับของเล่น & ฟิกเกอร์' },
            { id: 'strong', title: 'แข็งแรง (40%)', subtitle: 'ของใช้ & ชิ้นส่วนรับน้ำหนัก' },
            { id: 'solid', title: 'ตันแน่น (100%)', subtitle: 'เนื้อตัน แข็งแกร่งสูงสุด' },
          ].map((inf) => (
            <button
              key={inf.id}
              type="button"
              onClick={() => setInfill(inf.id as any)}
              className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                infill === inf.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm text-emerald-950 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="text-xs font-bold leading-tight truncate">{inf.title}</div>
              <div className="text-[9px] text-slate-500 mt-0.5 truncate">{inf.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Notes Textarea */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 space-y-3 shadow-sm">
        <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-pink-600" />
          <span>อยากบอกอะไรกับเราเพิ่มเติมไหม? (NOTE)</span>
        </label>

        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="เช่น อยากได้สีพิเศษ / ใช้เป็นของขวัญ / ต้องการให้ชิ้นส่วนประกอบกัน / เจาะรูพวงกุญแจเพิ่ม"
          className="w-full bg-slate-50 border-2 border-slate-200 focus:border-pink-500 text-slate-900 text-sm rounded-2xl p-3.5 outline-none transition-all placeholder:text-slate-400 focus:bg-white shadow-inner"
        />
      </div>

    </div>
  );
};
