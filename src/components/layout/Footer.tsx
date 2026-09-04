import React from 'react';
import { ExternalLink, Heart, ShieldCheck, MessageCircle } from 'lucide-react';
import { PlasticBadge } from '../common/PlasticBadge';

export const Footer: React.FC<{ onOpenOrderFlow: () => void }> = ({ onOpenOrderFlow }) => {
  return (
    <footer className="relative bg-slate-900 border-t border-slate-800 pt-16 pb-12 overflow-hidden text-slate-300">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-40 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center">
                <img
                  src="/logos/blue-filament-logo.png"
                  alt="Blue Filament"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-black text-2xl text-white tracking-tight">
                Blue Filament
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              สตูดิโอบริการพิมพ์โมเดล 3 มิติคุณภาพสูงจาก MakerWorld และไฟล์คัสตอม ด้วยเส้นฟิลาเมนต์เกรดพรีเมียม พร้อมระบบ Multi-Color
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
              <PlasticBadge variant="cyan" size="sm">
                “เจอโมเดลที่ชอบ เราพิมพ์ให้”
              </PlasticBadge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-center md:text-left">
            <h4 className="font-display font-bold text-white text-base">
              เมนูลัด
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenOrderFlow}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  เริ่มต้นสั่งพิมพ์ 3D
                </button>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-cyan-300 transition-colors"
                >
                  ขั้นตอนและวิธีสั่งพิมพ์
                </a>
              </li>
              <li>
                <a
                  href="#color-lab"
                  className="hover:text-cyan-300 transition-colors"
                >
                  คลังสีและวัสดุฟิลาเมนต์
                </a>
              </li>
              <li>
                <a
                  href="#model-gallery"
                  className="hover:text-cyan-300 transition-colors"
                >
                  ไอเดียโมเดลยอดนิยม
                </a>
              </li>
              <li>
                <a
                  href="https://makerworld.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>คลังโมเดล MakerWorld</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="/admin"
                  className="text-xs text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>⚙️ ระบบหลังบ้าน (Admin)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & LINE */}
          <div className="md:col-span-4 space-y-3 text-center md:text-left">
            <h4 className="font-display font-bold text-white text-base">
              ติดต่อเรา & ส่งไฟล์
            </h4>
            
            <p className="text-xs text-slate-300">
              สอบถามราคาก่อนสั่งพิมพ์ได้ตลอดเวลา ทีมงานตอบแชทไวและให้คำแนะนำฟรี
            </p>

            <a
              href="https://line.me/R/ti/p/@bluefilament"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#06C755]/20 border border-[#06C755]/50 hover:bg-[#06C755]/30 text-white font-bold text-sm transition-all"
            >
              <MessageCircle className="w-5 h-5 text-[#06C755] fill-current" />
              <span>LINE Official: @bluefilament</span>
            </a>
          </div>

        </div>

        {/* License Notice Strip */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-3">
          <div className="flex items-start sm:items-center justify-center gap-2 text-center text-slate-400 bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>License Notice: </strong>
              รับผลิตเฉพาะโมเดลที่อนุญาตให้ผลิตตามเงื่อนไขของเจ้าของผลงานและ License ที่เกี่ยวข้อง (เช่น Non-Commercial, CC-BY, หรือ Commercial Authorized)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-2">
            <span>© {new Date().getFullYear()} Blue Filament 3D Studio. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-pink-500 fill-current" /> for 3D creators & toy collectors
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
