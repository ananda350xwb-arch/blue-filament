import React, { useState } from 'react';
import { History, Menu, X, ExternalLink, Printer, Layers, Palette, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenOrderFlow: () => void;
  onOpenHistory: () => void;
  orderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOrderFlow,
  onOpenHistory,
  orderCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div 
          className="flex items-center cursor-pointer select-none group py-1" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Blue Filament - กลับสู่หน้าแรก"
        >
          <img
            src="/logos/blue-filament-transparent.png"
            alt="Blue Filament Official Store"
            className="h-9 sm:h-12 md:h-13 w-auto max-w-[155px] sm:max-w-[210px] object-contain transition-transform duration-200 group-hover:scale-105 flex-shrink-0"
          />
        </div>

        {/* Center: Modern Floating Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 shadow-inner">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="px-3.5 py-1.5 text-xs lg:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-xl transition-all hover:shadow-sm cursor-pointer"
          >
            วิธีสั่งพิมพ์
          </button>
          <button
            onClick={() => scrollToSection('color-lab')}
            className="px-3.5 py-1.5 text-xs lg:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-xl transition-all hover:shadow-sm cursor-pointer"
          >
            สีฟิลาเมนต์
          </button>
          <button
            onClick={() => scrollToSection('model-gallery')}
            className="px-3.5 py-1.5 text-xs lg:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-xl transition-all hover:shadow-sm cursor-pointer"
          >
            ไอเดียโมเดล
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="px-3.5 py-1.5 text-xs lg:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-xl transition-all hover:shadow-sm cursor-pointer"
          >
            คำถามที่พบบ่อย
          </button>
          <a
            href="https://makerworld.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs lg:text-sm font-semibold text-amber-700 hover:text-amber-800 hover:bg-white rounded-xl transition-all hover:shadow-sm flex items-center gap-1.5"
          >
            <span>MakerWorld</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History Button (shown if active order history exists) */}
          {orderCount > 0 && (
            <button
              onClick={onOpenHistory}
              title="ประวัติรายการที่เคยบันทึก"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
            >
              <History className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">ประวัติ</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                {orderCount}
              </span>
            </button>
          )}

          {/* Primary CTA Button */}
          <button
            onClick={onOpenOrderFlow}
            className="btn-3d-blue px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-3d-blue group cursor-pointer"
          >
            <Printer className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>สั่งพิมพ์</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-1.5 shadow-xl animate-in slide-in-from-top duration-200">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-slate-800 font-semibold hover:bg-slate-100 flex items-center gap-2.5 text-sm active:bg-slate-200 transition-colors"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>วิธีสั่งพิมพ์</span>
          </button>
          <button
            onClick={() => scrollToSection('color-lab')}
            className="w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-slate-800 font-semibold hover:bg-slate-100 flex items-center gap-2.5 text-sm active:bg-slate-200 transition-colors"
          >
            <Palette className="w-4 h-4 text-pink-500" />
            <span>สีฟิลาเมนต์</span>
          </button>
          <button
            onClick={() => scrollToSection('model-gallery')}
            className="w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-slate-800 font-semibold hover:bg-slate-100 flex items-center gap-2.5 text-sm active:bg-slate-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ไอเดียโมเดล</span>
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-slate-800 font-semibold hover:bg-slate-100 flex items-center gap-2.5 text-sm active:bg-slate-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>คำถามที่พบบ่อย</span>
          </button>
          <a
            href="https://makerworld.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-amber-700 font-semibold hover:bg-amber-50 flex items-center justify-between text-sm active:bg-amber-100 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-amber-600" />
              <span>ค้นหาโมเดลบน MakerWorld</span>
            </span>
          </a>
          
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderFlow();
              }}
              className="w-full btn-3d-blue min-h-[48px] py-3 rounded-xl text-white font-bold text-center flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>สั่งพิมพ์โมเดล</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

