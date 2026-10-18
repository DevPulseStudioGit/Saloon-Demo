import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService } from '../services/storage';
import { Branch } from '../types';
import { MapPin, Phone, Clock, Bike, ShoppingBag, ExternalLink, ArrowRight, Check } from 'lucide-react';

export const LocationsPage: React.FC = () => {
  const { branches, selectedBranch, attemptChangeBranch, navigateTo } = useRestaurant();

  const handleOrderFromBranch = (branch: Branch) => {
    attemptChangeBranch(branch);
    navigateTo('/menu');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Karachi Kitchens
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#25231F]">
          Our Branches & Delivery Zones
        </h1>
        <p className="text-xs sm:text-sm text-[#77736D]">
          Strategically located across Karachi to guarantee maximum freshness, sizzling woks, and rapid delivery right to your door.
        </p>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {branches.map((branch) => {
          const isSelected = selectedBranch?.id === branch.id;

          return (
            <div
              key={branch.id}
              className={`bg-white rounded-3xl border overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-2xs ${
                isSelected
                  ? 'border-[#B64E35] ring-2 ring-[#B64E35]/10'
                  : 'border-[#E8E2DA] hover:border-[#77736D]/40'
              }`}
            >
              <div className="p-6 sm:p-8 space-y-6">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-[#B64E35] uppercase tracking-wider block">
                      {branch.area}
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-[#25231F] mt-1">
                      {branch.name}
                    </h3>
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                {/* Details List */}
                <div className="space-y-3.5 text-xs sm:text-sm text-[#25231F]">
                  <div className="flex items-start gap-3 text-[#77736D]">
                    <MapPin className="w-4 h-4 text-[#B64E35] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[#77736D]">
                    <Phone className="w-4 h-4 text-[#B64E35] shrink-0" />
                    <a href={`tel:${branch.phone}`} className="hover:text-[#25231F] font-medium">
                      {branch.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-[#77736D]">
                    <Clock className="w-4 h-4 text-[#B64E35] shrink-0" />
                    <span>{branch.hours}</span>
                  </div>
                </div>

                {/* Delivery Zones Covered */}
                <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] space-y-2">
                  <span className="text-[11px] font-semibold text-[#77736D] uppercase tracking-wider block">
                    Delivery Neighborhoods Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {branch.deliveryZones.map((zone, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium text-[#25231F] bg-white border border-[#E8E2DA] px-2.5 py-1 rounded-lg"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Service stats */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#FAF8F4] text-xs">
                  <div>
                    <span className="text-[#77736D] block">Min. Delivery Order</span>
                    <span className="font-bold text-[#25231F]">Rs. {branch.minOrder}</span>
                  </div>
                  <div>
                    <span className="text-[#77736D] block">Delivery Fee</span>
                    <span className="font-bold text-[#25231F]">Rs. {branch.deliveryFee}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Action */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => handleOrderFromBranch(branch)}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#B64E35] text-white hover:bg-[#9B3F28]'
                      : 'bg-[#26231F] text-white hover:bg-[#B64E35]'
                  }`}
                >
                  <span>Order from this Kitchen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(branch.address + ' ' + branch.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 text-center text-xs font-semibold text-[#77736D] hover:text-[#25231F] transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
