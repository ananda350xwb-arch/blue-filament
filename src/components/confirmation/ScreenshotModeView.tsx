import React from 'react';
import { X, Camera, MessageCircle } from 'lucide-react';
import { Order } from '../../types';

interface ScreenshotModeViewProps {
  order: Order;
  onExit: () => void;
}

export const ScreenshotModeView: React.FC<ScreenshotModeViewProps> = ({ order, onExit }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
      
      {/* Top Floating Exit Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
          <Camera className="w-4 h-4 text-blue-600" />
          <span>โหมดบันทึกภาพหน้าจอ (Screenshot Mode)</span>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
        >
          <X className="w-3.5 h-3.5" />
          <span>ปิดหน้านี้</span>
        </button>
      </div>

      {/* Screen Shot Optimized Card Frame */}
      <div className="w-full max-w-md bg-white rounded-[2rem] border-2 border-blue-300 p-6 sm:p-8 shadow-[0_20px_50px_rgba(37,99,235,0.15)] text-slate-900 space-y-5 relative overflow-hidden">
        
        {/* Top Branding Banner */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-4">
          <div className="flex items-center">
            <img
              src="/logos/blue-filament-transparent.png"
              alt="Blue Filament"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 font-bold block">ORDER NO.</span>
            <span className="font-mono font-black text-sm text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 shadow-sm">
              {order.orderId}
            </span>
          </div>
        </div>

        {/* Model Section */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold">
            <span>MODEL DETAILS</span>
            <span className="text-blue-700 font-bold">{order.colorCount} COLORS</span>
          </div>

          <h3 className="font-display font-black text-xl text-slate-900">
            {order.modelName || 'MakerWorld 3D Model'}
          </h3>

          <p className="text-[11px] font-mono text-blue-600 font-semibold truncate">
            {order.modelUrl}
          </p>
        </div>

        {/* Mapped Colors List */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
            SELECTED FILAMENT COLORS
          </span>

          <div className="grid grid-cols-1 gap-2">
            {order.colors.map((c, i) => (
              <div
                key={i}
                className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0"
                    style={{ background: c.hex }}
                  />
                  <span className="text-slate-600 font-medium">
                    {c.originalColor}
                  </span>
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="font-bold text-slate-900">
                    {c.storeColor}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-bold">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block font-mono font-bold">QTY</span>
            <span className="font-bold text-slate-900 text-sm">{order.quantity} ชิ้น</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block font-mono font-bold">SCALE</span>
            <span className="font-bold text-blue-600 text-sm">{order.scale}%</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block font-mono font-bold">INFILL</span>
            <span className="font-bold text-emerald-700 text-sm capitalize">{order.infill || 'Standard'}</span>
          </div>
        </div>

        {/* Note */}
        {order.note && (
          <div className="bg-pink-50 border border-pink-200 p-3 rounded-xl text-xs space-y-0.5">
            <span className="font-bold text-pink-800">หมายเหตุ:</span>
            <p className="text-slate-700">{order.note}</p>
          </div>
        )}

        {/* Delivery Timeline Notice */}
        <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 font-medium">📦 เวลาจัดส่ง:</span>
          <span className="font-bold text-slate-800">จัดส่งภายใน 5 วัน (ดำเนินการจัดทำ)</span>
        </div>

        {/* Price Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3.5 rounded-2xl border-2 border-blue-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 font-bold block">STATUS</span>
            <span className="font-bold text-xs text-amber-800">PRICE: TO BE CONFIRMED</span>
          </div>
          <span className="font-display font-black text-sm text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
            รอตรวจสอบราคา
          </span>
        </div>

        {/* Bottom LINE Instruction Stamp */}
        <div className="text-center pt-2 border-t-2 border-dashed border-slate-200 space-y-1">
          <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>ส่งภาพนี้ให้ร้านทาง LINE: @bluefilament</span>
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            “เจอโมเดลที่ชอบ เราพิมพ์ให้”
          </p>
        </div>

      </div>

      <p className="text-xs font-semibold text-slate-600 mt-4 text-center">
        กดบันทึกภาพหน้าจอบนอุปกรณ์ของคุณ แล้วส่งภาพนี้ในแชท LINE เพื่อให้ร้านประเมินราคาได้ทันที
      </p>

    </div>
  );
};
