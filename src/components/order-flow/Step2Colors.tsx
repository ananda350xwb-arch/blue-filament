import React, { useState } from 'react';
import { Minus, Plus, ArrowDown, ChevronDown, Check, Sparkles } from 'lucide-react';
import { ColorMapping, FilamentColor } from '../../types';
import { FILAMENT_COLORS } from '../../data/filamentColors';

interface Step2ColorsProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  colorMappings: ColorMapping[];
  availableFilaments?: FilamentColor[];
  onUpdateMapping: (index: number, storeColorId: string, customOriginalName?: string) => void;
  onUpdateOriginalName: (index: number, name: string) => void;
}

export const Step2Colors: React.FC<Step2ColorsProps> = ({
  colorCount,
  onColorCountChange,
  colorMappings,
  availableFilaments = FILAMENT_COLORS,
  onUpdateMapping,
  onUpdateOriginalName,
}) => {
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);

  const predefinedOriginalNames = [
    'Blue (น้ำเงิน)',
    'White (ขาว)',
    'Black (ดำ)',
    'Yellow (เหลือง)',
    'Red (แดง)',
    'Green (เขียว)',
    'Pink (ชมพู)',
    'Purple (ม่วง)',
    'Gray (เทา)',
    'Orange (ส้ม)'
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Step Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
          <span>STEP 02</span>
          <span>•</span>
          <span>COLOR MAPPING</span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
          กำหนดจำนวนสีและวัสดุ
        </h2>

        <p className="text-sm text-slate-600">
          ระบุจำนวนสีที่ต้องการพิมพ์ และเลือกเฉดสีของ Blue Filament ที่ต้องการจับคู่
        </p>
      </div>

      {/* Color Count Stepper Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            จำนวนสีทั้งหมด (COLOR COUNT)
          </span>
          <span className="font-display font-black text-xl text-slate-900">
            {colorCount === 1 ? '1 สี (สีเดียว Single Color)' : `${colorCount} สี (Multi-Color)`}
          </span>
        </div>

        {/* Big 3D Stepper */}
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border-2 border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => onColorCountChange(colorCount - 1)}
            disabled={colorCount <= 1}
            className="w-12 h-12 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-800 font-bold flex items-center justify-center transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed border border-slate-200 shadow-sm"
          >
            <Minus className="w-5 h-5" />
          </button>

          <span className="font-display font-black text-2xl sm:text-3xl text-blue-600 min-w-[40px] text-center">
            {colorCount}
          </span>

          <button
            type="button"
            onClick={() => onColorCountChange(colorCount + 1)}
            disabled={colorCount >= 8}
            className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white font-bold flex items-center justify-center shadow-3d-blue transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Store Color Mapping Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>จับคู่กับสีของเรา</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            เลือกสี Filament ของ Blue Filament ที่คุณต้องการให้พิมพ์ลงในแต่ละชิ้นส่วน
          </p>
        </div>

        {/* Color Mapping Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {colorMappings.slice(0, colorCount).map((mapping, idx) => {
            const isPickerOpen = activePickerIndex === idx;
            const currentFilament = availableFilaments.find(c => c.id === mapping.storeColorId) || availableFilaments[0] || FILAMENT_COLORS[0];

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 relative shadow-sm space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    COLOR 0{idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {currentFilament.material}
                  </span>
                </div>

                {/* Original Color Section */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    ต้นฉบับโมเดล (ORIGINAL)
                  </div>
                  <input
                    type="text"
                    value={mapping.originalColor}
                    onChange={(e) => onUpdateOriginalName(idx, e.target.value)}
                    placeholder={`เช่น ${predefinedOriginalNames[idx % predefinedOriginalNames.length]}`}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 border-b border-slate-300 focus:border-blue-600 outline-none pb-1"
                  />
                </div>

                {/* Down Arrow Indicator */}
                <div className="flex justify-center -my-1">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 border border-slate-200">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Blue Filament Color Dropdown / Selector Button */}
                <div className="space-y-1.5 relative">
                  <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                    สีเส้น BLUE FILAMENT
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePickerIndex(isPickerOpen ? null : idx)}
                    className="w-full bg-blue-50/70 hover:bg-blue-100/70 border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-2.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-sm"
                  >
                    {/* Swatch Preview */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md flex-shrink-0 relative"
                        style={{
                          background: currentFilament.secondaryHex
                            ? `linear-gradient(135deg, ${currentFilament.hex} 0%, ${currentFilament.secondaryHex} 100%)`
                            : currentFilament.hex,
                          boxShadow: `0 2px 8px ${currentFilament.hex}50, inset 0 1px 2px rgba(255,255,255,0.8)`
                        }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {currentFilament.nameTh}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate font-semibold">
                          {currentFilament.name} {!currentFilament.inStock && '(ของหมด)'}
                        </div>
                      </div>
                    </div>

                    <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Swatch Popover */}
                  {isPickerOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white border-2 border-blue-300 rounded-2xl p-3 shadow-2xl space-y-2 max-h-64 overflow-y-auto animate-in zoom-in-95">
                      <div className="text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-100 flex justify-between">
                        <span>เลือกสีที่ต้องการ:</span>
                        <span className="text-blue-600 font-bold">{availableFilaments.length} เฉดสี</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {availableFilaments.map((col) => {
                          const isSelected = col.id === mapping.storeColorId;
                          return (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => {
                                onUpdateMapping(idx, col.id);
                                setActivePickerIndex(null);
                              }}
                              className={`p-2 rounded-xl flex items-center justify-between text-left transition-all ${
                                isSelected ? 'bg-blue-50 border border-blue-300' : 'hover:bg-slate-50'
                              } ${!col.inStock ? 'opacity-60' : ''}`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-6 h-6 rounded-full border border-slate-300 flex-shrink-0 shadow-sm"
                                  style={{
                                    background: col.secondaryHex
                                      ? `linear-gradient(135deg, ${col.hex} 0%, ${col.secondaryHex} 100%)`
                                      : col.hex
                                  }}
                                />
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    {col.nameTh}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {col.material} {!col.inStock && '(ของหมด)'}
                                  </div>
                                </div>
                              </div>

                              {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0 stroke-[3]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
