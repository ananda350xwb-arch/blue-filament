import React from 'react';
import { Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { PlasticBadge } from '../common/PlasticBadge';

interface MainCTAProps {
  onOpenOrderFlow: () => void;
}

export const MainCTA: React.FC<MainCTAProps> = ({ onOpenOrderFlow }) => {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 3D Poster Container */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-blue-700 via-brand-blue to-cyan-600 p-8 sm:p-12 lg:p-16 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.6)] border-2 border-white/30 text-white">
        
        {/* Decorative 3D plastic highlights & elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-brand-pink/30 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          
          <PlasticBadge variant="yellow" size="md" icon={<Sparkles className="w-4 h-4 text-amber-950" />}>
            READY TO PRINT
          </PlasticBadge>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight drop-shadow-md">
            มีโมเดลในใจแล้ว?
            <span className="block text-yellow-300 text-glow-yellow">
              ส่งลิงก์มาให้เราได้ทันที
            </span>
          </h2>

          <p className="text-base sm:text-xl text-blue-50 font-normal leading-relaxed">
            ไม่ว่าจะเป็นของขวัญวันเกิด ฟิกเกอร์ตั้งโต๊ะ หรืออะไหล่ของแต่งบ้าน Blue Filament พร้อมพิมพ์ชิ้นงาน 3D สีสันสดใสให้คุณอย่างประณีต
          </p>

          {/* Feature checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm font-semibold text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <span>ตรวจเช็คความแข็งแรงของไฟล์ฟรี</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <span>ระบบ Multi-Color คมชัดทุกชั้น</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <span>แพ็คแน่นหนา จัดส่งทั่วประเทศ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <span>แจ้งราคาก่อนเริ่มพิมพ์จริงเสมอ</span>
            </div>
          </div>

          {/* Big CTA Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onOpenOrderFlow}
              className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-display font-black text-xl px-9 py-5 rounded-2xl shadow-[0_10px_0_#b45309,0_20px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:translate-y-2 active:shadow-[0_2px_0_#b45309] transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>สั่งพิมพ์เลย →</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
