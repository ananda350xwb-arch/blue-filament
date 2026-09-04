import React from 'react';
import { Sparkles, ArrowRight, Layers, ShieldCheck, Heart } from 'lucide-react';
import { PlasticBadge } from '../common/PlasticBadge';
import { ToyDragonCanvas } from '../3d/ToyDragonCanvas';
import { FloatingShapesCanvas } from '../3d/FloatingShapesCanvas';
import { FloatingFilamentStream } from '../common/FloatingFilamentStream';

interface HeroSectionProps {
  onOpenOrderFlow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenOrderFlow }) => {
  return (
    <section className="relative overflow-hidden pt-6 sm:pt-12 pb-16 sm:pb-24">
      {/* Background 3D Floating Geometry & Filament Waves */}
      <FloatingShapesCanvas className="opacity-30" />
      <FloatingFilamentStream />

      {/* Radiant Glow Pastel Orbs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-64 h-64 sm:w-80 sm:h-80 bg-pink-400/20 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Headline, Badges, CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left z-20 space-y-6 sm:space-y-8">
            
            {/* Top Playful Capsule Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2.5">
              <PlasticBadge variant="pink" size="sm" className="sm:text-sm sm:px-3.5 sm:py-1.5" icon={<Sparkles className="w-3.5 h-3.5" />} glow>
                3D Toy Store × Creative Studio
              </PlasticBadge>
              <PlasticBadge variant="blue" size="sm" className="sm:text-sm sm:px-3.5 sm:py-1.5" icon={<Layers className="w-3.5 h-3.5" />}>
                Multi-Color
              </PlasticBadge>
              <PlasticBadge variant="yellow" size="sm" className="sm:text-sm sm:px-3.5 sm:py-1.5" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                High Precision PLA+
              </PlasticBadge>
            </div>

            {/* Main Catchphrase Headline */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.12] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 drop-shadow-sm">
                เจอโมเดลที่ชอบ
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600">
                  ให้เราพิมพ์ให้
                </span>
              </h1>

              <p className="text-base sm:text-xl lg:text-2xl text-slate-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                โมเดล 3D ที่คุณเลือก เปลี่ยนให้กลายเป็นของจริงได้ง่ายๆ แค่คัดลอกลิงก์ MakerWorld มาใส่ เราจัดส่งชิ้นงานคุณภาพสูงถึงหน้าบ้านคุณ
              </p>
            </div>

            {/* Clean Inline Feature List (No Boxes) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 sm:gap-x-7 gap-y-2 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse flex-shrink-0" />
                <span>โมเดลฟรี 1,000,000+ รายการ</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Made to Order คุณภาพสูง</span>
              </div>
            </div>

            {/* Action Button (Unified Single Action) */}
            <div className="pt-2 sm:pt-4 flex items-center justify-center lg:justify-start">
              <button
                onClick={onOpenOrderFlow}
                className="btn-3d-blue w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 rounded-2xl text-white font-bold text-base sm:text-xl flex items-center justify-center gap-3 shadow-3d-blue cursor-pointer group"
              >
                <span>เลือกโมเดลจาก MakerWorld และพิมพ์</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

            {/* Micro trust note */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>ไม่มีค่าใช้จ่ายล่วงหน้า ร้านจะตรวจสอบไฟล์และคำนวณราคาก่อนยืนยันทาง LINE</span>
            </div>
          </div>

          {/* Right Column: 3D Toy Interactive Playground */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[380px] sm:max-w-[460px] lg:max-w-[500px]">
              
              {/* Decorative plastic ring backdrop */}
              <div className="absolute inset-4 rounded-full border-4 border-dashed border-blue-400/30 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-10 rounded-full border border-pink-400/30 pointer-events-none" />

              {/* Interactive 3D Toy Dragon Mascot Canvas */}
              <ToyDragonCanvas className="w-full h-full" />

              {/* Floating Badge 1 - Top Left */}
              <div className="absolute -top-2 left-2 sm:left-4 z-20 animate-float-slow">
                <PlasticBadge variant="blue" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  Articulated Model
                </PlasticBadge>
              </div>

              {/* Floating Badge 2 - Bottom Right */}
              <div className="absolute -bottom-2 right-2 sm:right-6 z-20 animate-float-reverse">
                <PlasticBadge variant="pink" size="md" icon={<Layers className="w-3.5 h-3.5" />}>
                  Multi-Color PLA+
                </PlasticBadge>
              </div>

              {/* Floating Badge 3 - Bottom Left */}
              <div className="absolute bottom-12 -left-2 sm:left-2 z-20 animate-float-slow">
                <PlasticBadge variant="yellow" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  Precision 0.12mm
                </PlasticBadge>
              </div>

              {/* Interaction Hint */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm backdrop-blur-md pointer-events-none">
                หมุนเพื่อดูโมเดล 3 มิติรอบทิศทาง
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
