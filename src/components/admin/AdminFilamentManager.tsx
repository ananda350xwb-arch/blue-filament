import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { FilamentColor } from '../../types';

interface AdminFilamentManagerProps {
  filaments: FilamentColor[];
  onOpenEditFilament: (filament: FilamentColor | null) => void;
  onToggleStock: (id: string) => void;
  onDeleteFilament: (id: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminFilamentManager: React.FC<AdminFilamentManagerProps> = ({
  filaments,
  onOpenEditFilament,
  onToggleStock,
  onDeleteFilament,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFilaments = (filaments || []).filter(f => {
    if (!f) return false;
    if (selectedCategory !== 'all' && f.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.nameTh && f.nameTh.toLowerCase().includes(q)) ||
        (f.material && f.material.toLowerCase().includes(q)) ||
        (f.hex && f.hex.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            จัดการสี & วัสดุ Filament ({filaments.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            เพิ่มสีใหม่ แก้ไขเฉดสี และเปิด/ปิดสต็อกสินค้าที่แสดงบนหน้าเว็บทันที
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenEditFilament(null)}
          className="btn-3d-blue px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-3d-blue flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>เพิ่มสี Filament ใหม่</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'basic', label: 'PLA+ มาตรฐาน' },
            { id: 'pastel', label: 'Matte พาสเทล' },
            { id: 'silk', label: 'Silk เงา' },
            { id: 'special', label: 'ทูโทน & เรืองแสง' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อสี หรือ รหัสสี HEX..."
            className="w-full bg-white border-2 border-slate-200 focus:border-blue-600 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none shadow-sm"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Filament Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFilaments.map(filament => (
          <div
            key={filament.id}
            className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-sm flex flex-col justify-between space-y-4 ${
              filament.inStock ? 'border-slate-200 hover:border-blue-400' : 'border-red-200 bg-red-50/20 opacity-75'
            }`}
          >
            {/* Card Top: Swatch, Names, Material */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                
                {/* 3D Color Ball */}
                <div
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md flex-shrink-0 relative transform hover:scale-110 transition-transform"
                  style={{
                    background: filament.secondaryHex
                      ? `linear-gradient(135deg, ${filament.hex} 0%, ${filament.secondaryHex} 100%)`
                      : `radial-gradient(circle at 35% 30%, ${filament.hex} 0%, #000000 130%)`,
                    boxShadow: `0 6px 16px -2px ${filament.hex}60, inset 0 2px 4px rgba(255,255,255,0.8)`
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-black text-base text-slate-900 truncate">
                      {filament.nameTh}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-semibold">
                    {filament.name}
                  </p>
                </div>

                {/* Badge if any */}
                {filament.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {filament.badge}
                  </span>
                )}
              </div>

              {/* Material & Hex Tag */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100 font-bold">
                  {filament.material}
                </span>
                <span className="text-slate-500 font-semibold uppercase">
                  {filament.hex} {filament.secondaryHex ? `| ${filament.secondaryHex}` : ''}
                </span>
              </div>

              {filament.descriptionTh && (
                <p className="text-xs text-slate-600 line-clamp-2">
                  {filament.descriptionTh}
                </p>
              )}

              {/* Spool remaining grams bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>ม้วนคงเหลือ:</span>
                  <span className="font-bold text-slate-800">{filament.remainingGrams || 1000}g / 1000g</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, ((filament.remainingGrams || 1000) / 1000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions: Stock Switch + Edit/Delete */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              
              {/* Stock Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  onToggleStock(filament.id);
                  onShowToast(
                    filament.inStock ? 'เปลี่ยนเป็น: สินค้าหมด' : 'เปลี่ยนเป็น: มีสินค้าพร้อมใช้',
                    filament.nameTh,
                    'info'
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  filament.inStock
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                }`}
              >
                {filament.inStock ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{filament.inStock ? 'มีสินค้า' : 'ของหมด'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {/* Edit */}
                <button
                  type="button"
                  onClick={() => onOpenEditFilament(filament)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 transition-colors cursor-pointer"
                  title="แก้ไขข้อมูลสี"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`ยืนยันการลบสี "${filament.nameTh}"?`)) {
                      onDeleteFilament(filament.id);
                      onShowToast('ลบสีฟิลาเมนต์แล้ว', filament.nameTh, 'info');
                    }
                  }}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                  title="ลบสีนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
