import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, ExternalLink, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { MODEL_PRESETS } from '../../data/modelPresets';
import { ModelPreset } from '../../types';

interface Step1ModelProps {
  modelUrl: string;
  setModelUrl: (url: string) => void;
  modelName: string;
  setModelName: (name: string) => void;
  onSelectPreset: (preset: ModelPreset) => void;
}

export const Step1Model: React.FC<Step1ModelProps> = ({
  modelUrl,
  setModelUrl,
  modelName,
  setModelName,
  onSelectPreset,
}) => {
  const [isValidMakerWorld, setIsValidMakerWorld] = useState<boolean>(false);

  // Auto-validate URL
  useEffect(() => {
    if (!modelUrl.trim()) {
      setIsValidMakerWorld(false);
      return;
    }
    const isMw = modelUrl.toLowerCase().includes('makerworld.com') || modelUrl.toLowerCase().includes('http');
    setIsValidMakerWorld(isMw);

    // Auto guess model name if empty
    if (!modelName.trim()) {
      try {
        const parts = modelUrl.split('/').filter(Boolean);
        const last = parts[parts.length - 1];
        if (last && !last.startsWith('http')) {
          const cleanName = decodeURIComponent(last).replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
          if (cleanName.length > 2) {
            setModelName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
          }
        }
      } catch {
        // ignore
      }
    }
  }, [modelUrl, modelName, setModelName]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setModelUrl(text.trim());
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Step Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <span>STEP 01</span>
          <span>•</span>
          <span>MODEL SELECTION</span>
        </div>
        
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
          เลือกโมเดลที่ต้องการพิมพ์
        </h2>
        
        <p className="text-sm text-slate-600">
          เลือกโมเดล 3D จาก MakerWorld หรือแหล่งอื่นๆ แล้วนำลิงก์มาวางในช่องด้านล่าง
        </p>
      </div>

      {/* MakerWorld Link Input Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-blue-600" />
            <span>MakerWorld Link</span>
          </label>
          
          <button
            type="button"
            onClick={handlePaste}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer"
          >
            วางจากคลิปบอร์ด
          </button>
        </div>

        {/* Input field */}
        <div className="relative">
          <input
            type="url"
            value={modelUrl}
            onChange={(e) => setModelUrl(e.target.value)}
            placeholder="วางลิงก์ MakerWorld เช่น https://makerworld.com/models/..."
            className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 text-slate-900 text-sm sm:text-base rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400 focus:bg-white shadow-inner"
          />
        </div>

        {/* Validated Link Card */}
        {modelUrl.trim().length > 0 && (
          <div className={`p-4 rounded-2xl border-2 transition-all duration-300 animate-in zoom-in-95 ${
            isValidMakerWorld
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <span>MODEL LINK</span>
                  {isValidMakerWorld ? (
                    <span className="bg-emerald-600 text-white px-2 py-0.2 rounded-full font-bold text-[10px]">
                      VERIFIED
                    </span>
                  ) : (
                    <span className="bg-amber-600 text-white px-2 py-0.2 rounded-full font-bold text-[10px]">
                      CUSTOM URL
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono truncate text-slate-700 font-semibold">
                  {modelUrl}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold pt-1">
                  {isValidMakerWorld ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-800">ลิงก์ถูกต้อง พร้อมสำหรับการประเมินและสั่งพิมพ์</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-800">ลิงก์ภายนอก ร้านจะตรวจสอบโครงสร้างไฟล์เพิ่มเติม</span>
                    </>
                  )}
                </div>
              </div>

              <a
                href={modelUrl.startsWith('http') ? modelUrl : `https://${modelUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm flex-shrink-0"
                title="เปิดลิงก์"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Model Name Input */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="text-xs font-bold text-slate-700">
            ชื่อโมเดล:
          </label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="เช่น Articulated Dragon / Desk Organizer"
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
          />
        </div>

        {/* Go to MakerWorld Button */}
        <div className="pt-1">
          <a
            href="https://makerworld.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-3d-secondary py-3 rounded-xl text-amber-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ค้นหาโมเดลบน MakerWorld</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Preset Model Pills */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>หรือลองเลือกลิงก์ตัวอย่างยอดนิยม:</span>
        </span>

        <div className="flex flex-wrap gap-2">
          {MODEL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-blue-50 hover:border-blue-400 border border-slate-200 text-slate-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{preset.nameTh}</span>
              <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-100">
                {preset.colorCount} สี
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
