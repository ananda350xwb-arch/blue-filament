import React from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { ColorMapping } from '../../types';

interface Step4SummaryProps {
  orderId: string;
  modelUrl: string;
  modelName: string;
  colorCount: number;
  colorMappings: ColorMapping[];
  quantity: number;
  scale: number;
  infill: string;
  note: string;
  onConfirmOrder: () => void;
}

export const Step4Summary: React.FC<Step4SummaryProps> = ({
  orderId,
  modelUrl,
  modelName,
  colorCount,
  colorMappings,
  quantity,
  scale,
  infill,
  note,
  onConfirmOrder,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Step Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <span>STEP 04</span>
          <span>•</span>
          <span>ORDER SUMMARY</span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
          สรุปรายการสั่งพิมพ์
        </h2>

        <p className="text-sm text-slate-600">
          ตรวจสอบความถูกต้องของรายการสั่งพิมพ์ของคุณด้านล่าง
        </p>
      </div>

      {/* Physical 3D Product Order Card */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-white border-2 border-blue-200 shadow-[0_15px_35px_rgba(37,99,235,0.08)] overflow-hidden space-y-6">
        
        {/* Decorative Ticket Perforation / Barcode accents */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block -mb-0.5">
                3D PRINT SPECIFICATION
              </span>
              <span className="font-display font-black text-sm text-blue-700">
                BLUE FILAMENT STUDIO
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 font-bold block">ORDER ID</span>
            <span className="font-mono font-black text-sm sm:text-base text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-sm">
              {orderId}
            </span>
          </div>
        </div>

        {/* Model Info Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">
              MODEL NAME
            </span>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {colorCount} COLORS
            </span>
          </div>

          <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            {modelName || 'MakerWorld 3D Model'}
          </h3>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-blue-700 font-bold flex-shrink-0">SOURCE:</span>
            <span className="truncate">{modelUrl || 'https://makerworld.com/'}</span>
          </div>
        </div>

        {/* Mapped Colors List */}
        <div className="space-y-2.5 pt-2">
          <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block">
            MAPPED FILAMENT COLORS ({colorCount})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {colorMappings.slice(0, colorCount).map((mapping, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white flex-shrink-0 shadow-md"
                    style={{
                      background: mapping.hex,
                      boxShadow: `0 2px 6px ${mapping.hex}50`
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {mapping.storeColorNameTh}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-semibold">
                      ต้นฉบับ: {mapping.originalColor}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specs: Quantity, Size, Infill */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center shadow-sm">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">QUANTITY</span>
            <span className="font-display font-black text-lg text-slate-900">{quantity} ชิ้น</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center shadow-sm">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">SCALE</span>
            <span className="font-display font-black text-lg text-blue-600">{scale}%</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center shadow-sm">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">INFILL</span>
            <span className="font-display font-bold text-xs sm:text-sm text-emerald-700 mt-1 block capitalize">
              {infill}
            </span>
          </div>
        </div>

        {/* Note if any */}
        {note.trim() && (
          <div className="bg-pink-50 border border-pink-200 p-3.5 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-pink-800">หมายเหตุเพิ่มเติม:</span>
            <p className="text-slate-700">{note}</p>
          </div>
        )}

        {/* Price Section */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 font-bold uppercase">PRICE STATUS:</span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-300 text-slate-950 shadow-sm">
                TO BE CONFIRMED
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ร้านจะตรวจสอบไฟล์และคำนวณราคาสุดท้ายก่อนยืนยันทาง LINE
            </p>
          </div>

          <div className="text-right sm:self-center">
            <span className="font-display font-black text-lg text-amber-800 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
              รอตรวจสอบราคา
            </span>
          </div>
        </div>

      </div>

      {/* Trust Notice */}
      <div className="text-center text-xs text-slate-600 font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>พร้อมส่งรายการให้ Blue Filament ทาง LINE ทันทีในขั้นตอนถัดไป</span>
      </div>

      {/* Big Confirm Button */}
      <button
        type="button"
        onClick={onConfirmOrder}
        className="w-full btn-3d-blue py-4 sm:py-5 rounded-2xl text-white font-display font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-3d-blue cursor-pointer group"
      >
        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        <span>ส่งรายการให้ Blue Filament →</span>
      </button>

    </div>
  );
};
