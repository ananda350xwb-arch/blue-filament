import React, { useState } from 'react';
import { Palette, Check, Info } from 'lucide-react';
import { COLOR_CATEGORIES } from '../../data/filamentColors';
import { FilamentColor } from '../../types';
import { PlasticBadge } from '../common/PlasticBadge';

interface FilamentMaterialLabProps {
  filaments?: FilamentColor[];
  onOpenOrderFlow: () => void;
}

export const FilamentMaterialLab: React.FC<FilamentMaterialLabProps> = ({
  filaments = [],
  onOpenOrderFlow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeColorId, setActiveColorId] = useState<string>(filaments[0]?.id || '');

  const activeColor = filaments.find(f => f.id === activeColorId) || filaments[0];

  const filteredColors = filaments.filter(color => {
    if (selectedCategory === 'all') return true;
    return color.category === selectedCategory;
  });

  if (!activeColor) return null;

  return (
    <section id="color-lab" className="relative py-16 sm:py-24 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-y border-slate-200/80 overflow-hidden">
      
      {/* Background glow orb */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700 -z-10"
        style={{ background: activeColor.hex }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14">
          <PlasticBadge variant="pink" size="md" icon={<Palette className="w-4 h-4" />}>
            FILAMENT COLOR LAB
          </PlasticBadge>
          
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
            คลังสีและวัสดุฟิลาเมนต์
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-lg">
            เราคัดสรร Filament เกรดคุณภาพสูง ให้สีสดแน่น ผิวเนียน ละเอียด ไม่เปราะแตกง่าย
          </p>
        </div>

        {/* Category Filters - Horizontal swipe on mobile, wrap on desktop */}
        <div className="flex overflow-x-auto no-scrollbar py-1.5 px-1 items-center gap-2 sm:flex-wrap sm:justify-center mb-8 sm:mb-12">
          {COLOR_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex-shrink-0 min-h-[40px] flex items-center justify-center ${
                selectedCategory === cat.id
                  ? 'btn-3d-blue text-white shadow-3d-blue scale-105'
                  : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Active Color Highlight Card */}
          <div className="lg:col-span-5">
            <div 
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 relative overflow-hidden transition-all duration-500 shadow-xl"
              style={{
                borderColor: `${activeColor.hex}90`,
                boxShadow: `0 20px 40px -10px ${activeColor.hex}25`
              }}
            >
              {/* Top status */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  SELECTED FILAMENT
                </span>
                {activeColor.badge && (
                  <PlasticBadge variant="yellow" size="sm">
                    {activeColor.badge}
                  </PlasticBadge>
                )}
              </div>

              {/* 3D Toy Sphere Preview */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto my-4 flex items-center justify-center">
                {/* Outer glow ring */}
                <div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-500"
                  style={{ background: activeColor.hex }}
                />
                
                {/* 3D Glossy Ball */}
                <div 
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full relative shadow-2xl border-4 border-white transition-all duration-500 transform hover:scale-105"
                  style={{
                    background: activeColor.secondaryHex 
                      ? `linear-gradient(135deg, ${activeColor.hex} 0%, ${activeColor.secondaryHex} 100%)`
                      : `radial-gradient(circle at 35% 30%, ${activeColor.hex} 0%, #000000 130%)`,
                    boxShadow: `0 20px 40px -10px ${activeColor.hex}60, inset 0 6px 12px rgba(255, 255, 255, 0.9), inset 0 -6px 12px rgba(0, 0, 0, 0.4)`
                  }}
                >
                  {/* Glossy top highlight */}
                  <div className="absolute top-4 left-6 w-14 h-8 bg-white/80 rounded-full filter blur-[2px] transform -rotate-30" />
                  <div className="absolute top-10 left-16 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>

              {/* Color Details */}
              <div className="text-center space-y-2 mt-6">
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                  {activeColor.nameTh}
                </h3>
                <p className="text-sm font-bold text-blue-600">
                  {activeColor.name} • <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">{activeColor.material}</span>
                </p>
                {activeColor.descriptionTh && (
                  <p className="text-xs sm:text-sm text-slate-600 pt-1">
                    {activeColor.descriptionTh}
                  </p>
                )}
              </div>

              {/* Action Button inside card */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  activeColor.inStock ? 'text-emerald-700' : 'text-red-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${activeColor.inStock ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
                  <span>{activeColor.inStock ? 'มีสินค้าพร้อมพิมพ์' : 'สินค้าหมดชั่วคราว'}</span>
                </div>
                <button
                  onClick={onOpenOrderFlow}
                  disabled={!activeColor.inStock}
                  className="btn-3d-blue disabled:opacity-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-3d-blue cursor-pointer disabled:cursor-not-allowed"
                >
                  {activeColor.inStock ? 'เลือกใช้สีนี้ →' : 'ของหมด'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Swatches Shelf */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                แตะเพื่อดูตัวอย่างเนื้อสีและเฉดสี
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {filteredColors.length} COLORS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-h-[480px] overflow-y-auto pr-1">
              {filteredColors.map(color => {
                const isSelected = activeColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => setActiveColorId(color.id)}
                    className={`bg-white rounded-2xl p-3 text-left transition-all duration-200 border-2 cursor-pointer relative group flex flex-col justify-between shadow-sm ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    } ${!color.inStock ? 'opacity-60' : ''}`}
                  >
                    {/* Swatch Blob & Material Pill */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-white relative flex-shrink-0 transition-transform group-hover:scale-110 shadow-md"
                        style={{
                          background: color.secondaryHex 
                            ? `linear-gradient(135deg, ${color.hex} 0%, ${color.secondaryHex} 100%)`
                            : color.hex,
                          boxShadow: `0 4px 10px ${color.hex}50, inset 0 2px 3px rgba(255, 255, 255, 0.8)`
                        }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {color.material}
                      </span>
                    </div>

                    {/* Color Info */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {color.nameTh}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <span className="truncate">{color.name}</span>
                        {!color.inStock && <span className="text-red-600 font-bold ml-1">หมด</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
