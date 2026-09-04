import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { PlasticBadge } from '../common/PlasticBadge';

interface ModelGalleryProps {
  modelPresets?: any[];
  onSelectPreset?: (preset: any) => void;
}

export const ModelInspirationGallery: React.FC<ModelGalleryProps> = () => {
  const galleryItems = [
    {
      id: 1,
      image: '/gallery/model-11.jpg',
      alt: 'Pastel Cute 3D Print Keychains and Clips Flatlay',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[4/5]'
    },
    {
      id: 2,
      image: '/gallery/model-10.jpg',
      alt: 'Cute Heart Fidget Keychain in Hand',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-square'
    },
    {
      id: 3,
      image: '/gallery/model-16.jpg',
      alt: 'Two-tone Stethoscope Keychain',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[3/4]'
    },
    {
      id: 4,
      image: '/gallery/model-18.jpg',
      alt: 'Mini Mighty 120dB Pocket Whistle',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[16/11]'
    },
    {
      id: 5,
      image: '/gallery/model-15.jpg',
      alt: 'Rugged Waterproof Hinged Storage Boxes',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[4/3]'
    },
    {
      id: 6,
      image: '/gallery/model-14.jpg',
      alt: 'Smiley Sphere Screw Top Containers',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-square'
    },
    {
      id: 7,
      image: '/gallery/model-8.jpg',
      alt: 'Personalized 3D Printed Name Pencils',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[3/4]'
    },
    {
      id: 8,
      image: '/gallery/model-17.jpg',
      alt: 'Ergonomic Grocery Bag Handle Holder',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[4/5]'
    },
    {
      id: 9,
      image: '/gallery/model-19.jpg',
      alt: 'Yellow Heart Chopsticks Helper',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-square'
    },
    {
      id: 10,
      image: '/gallery/model-4.jpg',
      alt: 'Articulated Mini Sharks 3D Print',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[16/10]'
    },
    {
      id: 11,
      image: '/gallery/model-12.jpg',
      alt: 'Print in Place Keychain Boxes',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[4/3]'
    },
    {
      id: 12,
      image: '/gallery/model-9.jpg',
      alt: 'Multi-use Bottle and Can Opener',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[3/4]'
    },
    {
      id: 13,
      image: '/gallery/model-13.jpg',
      alt: 'Locking Carabiners on Fabric',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[4/5]'
    },
    {
      id: 14,
      image: '/gallery/model-2.jpg',
      alt: 'Smiley Multi-Color 3D Print Box',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-square'
    },
    {
      id: 15,
      image: '/gallery/model-1.jpg',
      alt: 'Pastel Miniature Jars in Hand',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[3/4]'
    },
    {
      id: 16,
      image: '/gallery/model-7.jpg',
      alt: 'Utility Carabiner multi-color print',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[4/3]'
    },
    {
      id: 17,
      image: '/gallery/model-20.jpg',
      alt: '3D Printed Flexible Chain Links and Rings',
      url: 'https://makerworld.com/',
      aspectRatio: 'aspect-[16/10]'
    }
  ];

  return (
    <section id="model-gallery" className="relative py-12 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Top Header & MakerWorld Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PlasticBadge variant="yellow" size="md" icon={<Sparkles className="w-4 h-4 text-amber-950" />}>
                MAKERWORLD SHOWCASE
              </PlasticBadge>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
              รวมโมเดลสวยๆ จาก MakerWorld
            </h2>
          </div>

          <a
            href="https://makerworld.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-blue h-12 sm:h-14 px-6 sm:px-8 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-3d-blue self-start sm:self-auto cursor-pointer group"
          >
            <span>ดูโมเดลอีกเป็นล้านอัน</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Artistic Pinterest / Dynamic Varied-Size Masonry Mosaic */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 md:gap-5 [column-fill:_balance]">
          {galleryItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all duration-300 group cursor-pointer bg-slate-100 block mb-3 sm:mb-4 md:mb-5 break-inside-avoid ${item.aspectRatio}`}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Subtle glass hover overlay with quick indicator */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5 sm:p-5">
                <span className="text-white text-xs sm:text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5 shadow-sm">
                  <span>ค้นหาบน MakerWorld</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
