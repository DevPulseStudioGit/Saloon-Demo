import React from 'react';
import { Clock, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface PricingPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ navigateTo }) => {
  const { categories, services, packages, updateBookingDraft } = useSalon();

  const handleBook = (serviceId: string) => {
    updateBookingDraft({ serviceIds: [serviceId] });
    navigateTo('booking');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Transparent Investment
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Atelier Treatment Menu & Pricing
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          We pride ourselves on transparent, honest salon pricing with zero hidden add-on surprises. Every treatment includes comprehensive consultation and European botanical products.
        </p>
      </div>

      {/* Categories Breakdown */}
      <div className="space-y-12">
        {categories.map((cat) => {
          const catServices = services.filter((s) => s.categoryId === cat.id && s.active);
          if (catServices.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-6">
              <div className="border-b border-[#E7E0D8] pb-3">
                <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                  {cat.name}
                </h2>
                <p className="text-xs text-[#77716C] pt-1">
                  {cat.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E7E0D8] divide-y divide-[#E7E0D8] overflow-hidden shadow-2xs">
                {catServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF8F4] transition-colors"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-[#26231E]">
                          {service.name}
                        </h3>
                        <span className="text-xs text-[#77716C] flex items-center gap-1">
                          · <Clock className="w-3 h-3 text-[#A77A7E]" /> {service.durationMinutes} min
                        </span>
                        {service.depositRequired && (
                          <span className="bg-[#FAF8F4] text-[#A77A7E] text-[10px] px-2 py-0.5 rounded border border-[#E7E0D8] uppercase tracking-wider font-semibold">
                            Deposit
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#77716C] leading-relaxed">
                        {service.description}
                      </p>
                      {service.addons && service.addons.length > 0 && (
                        <div className="text-[11px] text-[#A77A7E] pt-1">
                          Add-ons: {service.addons.map((a) => `${a.name} (+Rs. ${a.price.toLocaleString()})`).join(' · ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] uppercase tracking-wider text-[#77716C] block">
                          {service.isStartingPrice ? 'Starting At' : 'Investment'}
                        </span>
                        <span className="font-serif-title font-bold text-xl text-[#26231E]">
                          Rs. {service.basePrice.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleBook(service.id)}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#26231E] rounded hover:bg-[#3D3730] transition-colors"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Packages Section */}
      {packages.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="border-b border-[#E7E0D8] pb-3">
            <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
              Curated Packages & Bridal Suites
            </h2>
            <p className="text-xs text-[#77716C] pt-1">
              Multi-treatment experiences bundled at celebratory rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-6 rounded-2xl bg-white border border-[#E7E0D8] shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-[#C8A96A] font-semibold">
                    {pkg.subtitle}
                  </div>
                  <h3 className="text-xl font-serif-title font-semibold text-[#26231E]">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[#77716C] leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E7E0D8] flex items-center justify-between">
                  <div>
                    <span className="text-xs line-through text-[#77716C] block">
                      Rs. {pkg.originalPrice.toLocaleString()}
                    </span>
                    <span className="font-serif-title font-bold text-xl text-[#26231E]">
                      Rs. {pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => navigateTo('booking')}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
                  >
                    Reserve Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
