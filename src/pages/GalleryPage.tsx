import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GalleryPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ navigateTo }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'hair' | 'skin' | 'bridal' | 'nails'>('all');

  const galleryItems = [
    {
      id: 'g-1',
      category: 'hair',
      title: 'French Dimensional Balayage',
      subtitle: 'Soft honey tones with root melt on wavy silk hair',
      image: '/assets/images/service_hair_styling_1792040701711.jpg',
      artist: 'Ayla Merchant'
    },
    {
      id: 'g-2',
      category: 'skin',
      title: 'Hydra-Radiance Lymphatic Lift',
      subtitle: 'Deep cellular hydration with rose quartz sculpting',
      image: '/assets/images/service_facial_treatment_1792040702413.jpg',
      artist: 'Zara Siddiqui'
    },
    {
      id: 'g-3',
      category: 'bridal',
      title: 'Couture Barat Bridal Complexion',
      subtitle: 'Luminous HD velvet finish with champagne gold accents',
      image: '/assets/images/service_bridal_makeup_1792040703146.jpg',
      artist: 'Maya Qureshi'
    },
    {
      id: 'g-4',
      category: 'nails',
      title: 'Minimalist Champagne Chrome BIAB',
      subtitle: 'Structured soft gel with micro-milled chrome tips',
      image: '/assets/images/service_nail_artistry_1792040703002.jpg',
      artist: 'Natasha Khan'
    },
    {
      id: 'g-5',
      category: 'hair',
      title: 'Architectural Atelier Space',
      subtitle: 'Custom travertine styling mirrors and fluted reception',
      image: '/assets/images/luma_hero_salon_1792040701867.jpg',
      artist: 'Atelier Interior'
    }
  ];

  const filtered = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Visual Portfolio
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Atelier Craft & Transformations
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          Explore recent hair transformations, luminous skin therapies, bespoke bridal suites, and editorial manicures created at our Karachi studios.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E7E0D8]">
        {[
          { id: 'all', label: 'All Portfolios' },
          { id: 'hair', label: 'Hair Craft & Colour' },
          { id: 'skin', label: 'Skincare & Facials' },
          { id: 'bridal', label: 'Bridal Couture' },
          { id: 'nails', label: 'Nails & Rituals' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeFilter === tab.id
                ? 'bg-[#26231E] text-white'
                : 'bg-white border border-[#E7E0D8] text-[#77716C] hover:text-[#26231E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden border border-[#E7E0D8] shadow-xs flex flex-col justify-between"
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <span className="text-xs text-white font-medium">
                  Crafted by {item.artist}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-1">
              <h3 className="text-lg font-serif-title font-semibold text-[#26231E]">
                {item.title}
              </h3>
              <p className="text-xs text-[#77716C] leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-2xl bg-[#F7F4EF] border border-[#E7E0D8] text-center space-y-4 max-w-xl mx-auto">
        <h3 className="text-2xl font-serif-title font-semibold text-[#26231E]">
          Ready for Your Personalized Transformation?
        </h3>
        <p className="text-xs text-[#77716C]">
          Schedule a consultation with our master colorists and aesthetic specialists.
        </p>
        <button
          onClick={() => navigateTo('booking')}
          className="px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors"
        >
          Book an Appointment
        </button>
      </div>
    </div>
  );
};
