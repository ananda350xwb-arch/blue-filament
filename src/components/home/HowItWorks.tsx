import React from 'react';
import { Search, Link as LinkIcon, Palette, PackageCheck, Sparkles, ArrowRight } from 'lucide-react';
import { PlasticBadge } from '../common/PlasticBadge';

interface HowItWorksProps {
  onOpenOrderFlow: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOrderFlow }) => {
  const steps = [
    {
      num: '01',
      title: 'เลือก',
      tagline: 'หาโมเดลที่คุณชอบจาก MakerWorld',
      desc: 'เข้าเว็บ MakerWorld มีโมเดลของเล่น ฟิกเกอร์ และของแต่งบ้านฟรีให้เลือกนับล้านชิ้น',
      badge: 'Step 1',
      badgeVariant: 'blue' as const,
      icon: <Search className="w-7 h-7 text-blue-600" />,
      colorGrad: 'from-blue-500/15 via-blue-500/5 to-transparent',
      borderColor: 'border-blue-200 group-hover:border-blue-400',
      accentColor: 'text-blue-600',
      visual: (
        <div className="relative w-full h-28 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200/80 flex items-center justify-center p-3 overflow-hidden">
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-blue-200 text-xs font-mono text-blue-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>makerworld.com/models</span>
          </div>
        </div>
      )
    },
    {
      num: '02',
      title: 'ส่งลิงก์',
      tagline: 'Copy Link แล้วนำมาใส่ในเว็บไซต์',
      desc: 'กดคัดลอก URL หน้าโมเดลที่ต้องการ แล้วนำมาวางในฟอร์มสั่งพิมพ์ของเราได้ทันที',
      badge: 'Step 2',
      badgeVariant: 'pink' as const,
      icon: <LinkIcon className="w-7 h-7 text-pink-600" />,
      colorGrad: 'from-pink-500/15 via-purple-500/5 to-transparent',
      borderColor: 'border-pink-200 group-hover:border-pink-400',
      accentColor: 'text-pink-600',
      visual: (
        <div className="relative w-full h-28 bg-gradient-to-br from-pink-50 to-purple-50/50 rounded-2xl border border-pink-200/80 flex flex-col items-center justify-center p-3 gap-2 overflow-hidden">
          <div className="w-full bg-white rounded-xl p-2 flex items-center justify-between text-[11px] font-mono border border-pink-200/80 shadow-sm">
            <span className="text-slate-700 truncate max-w-[170px]">makerworld.com/...</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-sans font-bold">พร้อมพิมพ์</span>
          </div>
          <div className="text-xs text-pink-700 font-semibold">ตรวจสอบความสมบูรณ์ไฟล์</div>
        </div>
      )
    },
    {
      num: '03',
      title: 'เลือกสี',
      tagline: 'จับคู่สีโมเดลกับสี Filament ที่ร้านมี',
      desc: 'ปรับจำนวนสี 1-8 สี และเลือกเฉดสีที่ถูกใจ ทั้งสีสดใส พาสเทล และซิลค์เงาพรีเมียม',
      badge: 'Step 3',
      badgeVariant: 'yellow' as const,
      icon: <Palette className="w-7 h-7 text-amber-600" />,
      colorGrad: 'from-yellow-500/15 via-orange-500/5 to-transparent',
      borderColor: 'border-amber-200 group-hover:border-amber-400',
      accentColor: 'text-amber-600',
      visual: (
        <div className="relative w-full h-28 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80 flex items-center justify-center gap-2 p-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-blue-600 shadow-[0_4px_10px_rgba(37,99,235,0.4)] border-2 border-white transform -rotate-6" />
          <div className="w-8 h-8 rounded-full bg-cyan-400 shadow-[0_4px_10px_rgba(6,182,212,0.4)] border-2 border-white transform rotate-3" />
          <div className="w-8 h-8 rounded-full bg-pink-500 shadow-[0_4px_10px_rgba(236,72,153,0.4)] border-2 border-white transform -rotate-12" />
          <div className="w-8 h-8 rounded-full bg-yellow-400 shadow-[0_4px_10px_rgba(250,204,21,0.4)] border-2 border-white transform rotate-6" />
        </div>
      )
    },
    {
      num: '04',
      title: 'รับของ',
      tagline: 'เราพิมพ์ให้ แล้วจัดส่งถึงคุณ',
      desc: 'ร้านพิมพ์ด้วยความแม่นยำสูง แพ็คกันกระแทกอย่างดี แล้วส่งตรงถึงบ้านคุณ',
      badge: 'Step 4',
      badgeVariant: 'green' as const,
      icon: <PackageCheck className="w-7 h-7 text-emerald-600" />,
      colorGrad: 'from-emerald-500/15 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-200 group-hover:border-emerald-400',
      accentColor: 'text-emerald-600',
      visual: (
        <div className="relative w-full h-28 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200/80 flex items-center justify-center p-3 gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-emerald-800">Express Delivery</div>
            <div className="text-[11px] font-semibold text-slate-600">จัดส่งภายใน 1-3 วันทำการ</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <PlasticBadge variant="blue" size="md" icon={<Sparkles className="w-4 h-4" />}>
            HOW IT WORKS
          </PlasticBadge>
          
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
            ขั้นตอนการสั่งพิมพ์
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-lg">
            4 ขั้นตอนง่ายๆ เปลี่ยนโมเดล 3 มิติจากหน้าจอให้กลายเป็นชิ้นงานจริงที่คุณจับต้องได้
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`group bg-white rounded-3xl p-6 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between relative overflow-hidden ${step.borderColor}`}
              style={{
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0,0,0,0.02)'
              }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-b ${step.colorGrad} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              {/* Card Top: Number & Icon */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`font-display font-black text-3xl sm:text-4xl ${step.accentColor}`}>
                    {step.num}
                  </span>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    {step.icon}
                  </div>
                </div>

                {/* Visual Area */}
                {step.visual}

                {/* Content */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                      {step.title}
                    </h3>
                  </div>
                  <h4 className="text-sm font-bold text-blue-700 leading-snug">
                    “{step.tagline}”
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                <span>Step {step.num} of 04</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick CTA below how it works */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenOrderFlow}
            className="btn-3d-blue px-8 py-3.5 rounded-2xl font-bold text-white text-base inline-flex items-center gap-2.5 shadow-3d-blue cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>เริ่มต้นสั่งพิมพ์ตอนนี้เลย →</span>
          </button>
        </div>

      </div>
    </section>
  );
};
