import React from 'react';
import { Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface PackagesPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ navigateTo }) => {
  const { packages, services, updateBookingDraft } = useSalon();

  const handleBookPackage = (pkgServices: string[]) => {
    updateBookingDraft({ serviceIds: pkgServices });
    navigateTo('booking');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Curated Rituals
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Packages & Bridal Suites
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          Comprehensive multi-treatment journeys harmoniously scheduled for weddings, editorial events, and restorative weekend pampering in Karachi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packages.map((pkg) => {
          const includedServicesList = services.filter((s) => pkg.includedServices.includes(s.id));
          const savings = pkg.originalPrice - pkg.price;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E7E0D8] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {pkg.badge && (
                    <div className="absolute top-4 left-4 bg-[#26231E] text-[#C8A96A] text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded">
                      {pkg.badge}
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-[#A77A7E] font-semibold">
                      {pkg.subtitle}
                    </span>
                    <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                      {pkg.title}
                    </h2>
                  </div>

                  <p className="text-xs text-[#77716C] leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#E7E0D8]">
                    <span className="text-[11px] uppercase tracking-wider text-[#26231E] font-semibold block">
                      Treatments Included:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#77716C]">
                      {includedServicesList.map((service) => (
                        <li key={service.id} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#A77A7E] shrink-0" />
                          <span>{service.name} ({service.durationMinutes} min)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 border-t border-[#F7F4EF] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif-title font-bold text-2xl text-[#26231E]">
                      Rs. {pkg.price.toLocaleString()}
                    </span>
                    <span className="text-xs line-through text-[#77716C]">
                      Rs. {pkg.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold block">
                    Save Rs. {savings.toLocaleString()} bundle privilege
                  </span>
                </div>

                <button
                  onClick={() => handleBookPackage(pkg.includedServices)}
                  className="px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730] transition-colors shadow-xs"
                >
                  Book Package
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
