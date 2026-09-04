import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck } from 'lucide-react';
import { FAQS } from '../../data/faqs';
import { PlasticBadge } from '../common/PlasticBadge';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14">
        <PlasticBadge variant="purple" size="md" icon={<HelpCircle className="w-4 h-4" />}>
          FAQ & LICENSE
        </PlasticBadge>

        <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          คำถามที่พบบ่อย
        </h2>

        <p className="text-slate-600 text-sm sm:text-base">
          ทุกข้อสงสัยเกี่ยวกับการสั่งพิมพ์ 3D สี และการคิดราคา
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 sm:space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-sm ${
                isOpen ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2.5">
                  <span className="text-blue-600 font-mono text-sm">0{idx + 1}.</span>
                  {faq.question}
                </span>
                <div className={`p-1.5 rounded-xl transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 whitespace-pre-line animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* License Notice Box */}
      <div className="mt-10 bg-blue-50/80 rounded-2xl p-4 sm:p-5 border-2 border-blue-200 flex items-start sm:items-center gap-3 text-slate-700 text-xs sm:text-sm shadow-sm">
        <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          <span className="font-bold text-blue-900">ข้อกำหนดด้านลิขสิทธิ์ (License Notice): </span>
          รับผลิตเฉพาะโมเดลที่อนุญาตให้ผลิตตามเงื่อนไขของเจ้าของผลงานและ License ที่เกี่ยวข้อง (เช่น Non-Commercial, CC-BY, หรือ Commercial Authorized)
        </div>
      </div>

    </section>
  );
};
