import React from 'react';
import { Award } from 'lucide-react';

export const BrandTrustBar: React.FC = () => {
  const brands = [
    {
      name: 'Panchroma by Polymaker',
      logo: '/logos/panchroma.png',
      alt: 'Panchroma by Polymaker'
    },
    {
      name: 'eSUN',
      logo: '/logos/esun.png',
      alt: 'eSUN 3D Filament'
    },
    {
      name: 'SUNLU',
      logo: '/logos/sunlu.png',
      alt: 'SUNLU 3D Filament'
    }
  ];

  return (
    <section className="relative py-3 sm:py-6 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-8 shadow-sm">
        
        {/* Clean Header */}
        <div className="flex flex-col items-center justify-center text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-1.5 sm:mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>World-Class Materials</span>
          </div>
          <h3 className="font-display font-bold text-slate-800 text-sm sm:text-xl">
            เลือกใช้วัสดุและเส้น Filament มาตรฐานระดับโลก
          </h3>
        </div>

        {/* Clean Logos Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-8 items-center">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="bg-white/70 hover:bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/70 hover:border-slate-300 p-2.5 sm:p-6 h-18 sm:h-32 flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <img
                src={brand.logo}
                alt={brand.alt}
                className="max-h-10 sm:max-h-20 max-w-[90%] object-contain filter group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

