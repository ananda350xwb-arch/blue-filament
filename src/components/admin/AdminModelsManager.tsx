import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ExternalLink, X, Check } from 'lucide-react';
import { ModelPreset } from '../../types';

interface AdminModelsManagerProps {
  modelPresets: ModelPreset[];
  onAddModel: (preset: ModelPreset) => void;
  onUpdateModel: (id: string, preset: Partial<ModelPreset>) => void;
  onDeleteModel: (id: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminModelsManager: React.FC<AdminModelsManagerProps> = ({
  modelPresets,
  onAddModel,
  onUpdateModel,
  onDeleteModel,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelPreset | null>(null);

  const [nameTh, setNameTh] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Toys & Flexi');
  const [url, setUrl] = useState('');
  const [colorCount, setColorCount] = useState(4);
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('Toy, Multi-Color');
  const [descriptionTh, setDescriptionTh] = useState('');

  const openAdd = () => {
    setEditingModel(null);
    setNameTh('');
    setName('');
    setCategory('Toys & Flexi');
    setUrl('https://makerworld.com/en/models/');
    setColorCount(4);
    setImageUrl('https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80');
    setAuthor('MakerArtist');
    setTags('3D, Toy, Cute');
    setDescriptionTh('โมเดล 3D ยอดนิยม สีสันสดใส');
    setIsEditing(true);
  };

  const openEdit = (preset: ModelPreset) => {
    setEditingModel(preset);
    setNameTh(preset.nameTh || preset.name || '');
    setName(preset.name || '');
    setCategory(preset.category || 'Toys & Flexi');
    setUrl(preset.url || '');
    setColorCount(preset.colorCount || 4);
    setImageUrl(preset.imageUrl || '');
    setAuthor(preset.author || '');
    setTags(Array.isArray(preset.tags) ? preset.tags.join(', ') : (preset.tags || ''));
    setDescriptionTh(preset.descriptionTh || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!nameTh.trim() || !url.trim()) {
      onShowToast('กรุณากรอกชื่อโมเดลและ URL MakerWorld', undefined, 'error');
      return;
    }

    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingModel) {
      onUpdateModel(editingModel.id, {
        nameTh: nameTh.trim(),
        name: name.trim() || nameTh.trim(),
        category,
        url: url.trim(),
        colorCount,
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
        author: author.trim() || 'Designer',
        tags: tagList,
        descriptionTh: descriptionTh.trim()
      });
      onShowToast('อัปเดตโมเดลเรียบร้อย!', nameTh, 'success');
    } else {
      const newPreset: ModelPreset = {
        id: `model-${Date.now()}`,
        nameTh: nameTh.trim(),
        name: name.trim() || nameTh.trim(),
        category,
        url: url.trim(),
        colorCount,
        defaultColors: [
          { originalColor: 'Color 1', storeColorId: 'blue-electric' },
          { originalColor: 'Color 2', storeColorId: 'white-pure' }
        ],
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
        author: author.trim() || 'Designer',
        tags: tagList,
        descriptionTh: descriptionTh.trim()
      };
      onAddModel(newPreset);
      onShowToast('เพิ่มโมเดลตัวอย่างสำเร็จ!', nameTh, 'success');
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            จัดการไอเดียโมเดล MakerWorld ({modelPresets.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ปรับแต่งโมเดลแนะนำที่แสดงบนหน้าหลักเพื่อให้ลูกค้ากดสั่งพิมพ์ได้ง่ายขึ้น
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="btn-3d-blue px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-3d-blue flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>เพิ่มโมเดลแนะนำใหม่</span>
        </button>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(modelPresets) ? modelPresets : []).map(preset => (
          <div
            key={preset.id}
            className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 hover:border-blue-400 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Image & Category */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={preset.imageUrl || 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80'}
                  alt={preset.nameTh || preset.name || 'Model'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-900 shadow-sm border border-slate-200">
                    {preset.category || 'Toys'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white shadow-sm">
                    {preset.colorCount || 1} สี
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-display font-black text-base text-slate-900 truncate">
                  {preset.nameTh || preset.name || 'Model Name'}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {preset.descriptionTh || ''}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold pt-1">
                  <span className="truncate">{preset.url}</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">By {preset.author || 'Designer'}</span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(preset)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 transition-colors cursor-pointer"
                  title="แก้ไข"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`ยืนยันการลบโมเดล "${preset.nameTh}"?`)) {
                      onDeleteModel(preset.id);
                      onShowToast('ลบโมเดลแล้ว', preset.nameTh, 'info');
                    }
                  }}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                  title="ลบ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900 space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-display font-black text-xl">
                {editingModel ? 'แก้ไขโมเดลแนะนำ' : 'เพิ่มโมเดลแนะนำใหม่'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">ชื่อโมเดล (ภาษาไทย):</label>
                <input
                  type="text"
                  value={nameTh}
                  onChange={(e) => setNameTh(e.target.value)}
                  placeholder="เช่น มังกรดุ๊กดิ๊ก ดัดขยับได้"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">MakerWorld URL ลิงก์:</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://makerworld.com/en/models/..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">หมวดหมู่ (Category):</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="เช่น Toys & Flexi, Home Decor"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">จำนวนสี (Color Count):</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={colorCount}
                    onChange={(e) => setColorCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">รูปภาพหน้าปก URL (Cover Image):</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ชื่อผู้ออกแบบ (Author):</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="เช่น Cinderwing3D"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">แท็ก (คั่นด้วยจุลภาค):</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Toy, Flexi, Cute"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">คำอธิบายโมเดล:</label>
                <textarea
                  rows={2}
                  value={descriptionTh}
                  onChange={(e) => setDescriptionTh(e.target.value)}
                  placeholder="คำอธิบายสั้นๆ เกี่ยวกับโมเดล"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn-3d-blue px-6 py-2 rounded-xl text-xs font-bold text-white shadow-3d-blue flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกโมเดล</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
