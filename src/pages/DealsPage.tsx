import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService } from '../services/storage';
import { ProductCustomizerModal } from '../components/menu/ProductCustomizerModal';
import { Deal } from '../types';
import { Sparkles, Check, ArrowRight, Tag, SlidersHorizontal, Plus } from 'lucide-react';

export const DealsPage: React.FC = () => {
  const { config, addToCart, navigateTo } = useRestaurant();
  const deals = StorageService.getDeals().filter((d) => d.isAvailable);

  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const handleDealAction = (deal: Deal) => {
    if (deal.optionGroups && deal.optionGroups.length > 0) {
      setActiveDeal(deal);
    } else {
      addToCart({
        productOrDeal: deal,
        isDeal: true,
        quantity: 1,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Curated Feasts
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#25231F]">
          Deals & Dastarkhwan Combos
        </h1>
        <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed">
          Complete celebratory meals designed by our head chef to share with family, colleagues, or loved ones with complimentary breads and sweets.
        </p>
      </div>

      {/* Deals Grid */}
      {deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => {
            const hasOptions = deal.optionGroups && deal.optionGroups.length > 0;
            const savings = deal.originalPrice - deal.price;

            return (
              <div
                key={deal.id}
                className="bg-white rounded-3xl border border-[#E8E2DA] overflow-hidden hover:border-[#B64E35]/40 transition-all duration-200 flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-60 w-full overflow-hidden bg-[#FAF8F4]">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {deal.badge && (
                      <div className="absolute top-3 left-3 bg-[#B64E35] text-white text-[11px] font-bold px-3 py-1 rounded-md shadow-xs">
                        {deal.badge}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs text-white/80">Bundled Value</div>
                      <div className="text-xl font-serif font-bold drop-shadow-xs">
                        {deal.name}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed">
                      {deal.description}
                    </p>

                    {/* Included items summary */}
                    <div className="space-y-2 pt-2 border-t border-[#FAF8F4]">
                      <span className="text-[11px] font-semibold text-[#B64E35] uppercase tracking-wider block">
                        Included in this Feast:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#25231F]">
                        {deal.includedItemsSummary.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B64E35] shrink-0 mt-1.5" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-6 pt-4 border-t border-[#FAF8F4] bg-[#FAF8F4]/50 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold font-sans text-[#25231F]">
                        Rs. {deal.price.toLocaleString()}
                      </span>
                      {deal.originalPrice > deal.price && (
                        <span className="text-xs text-[#77736D] line-through">
                          Rs. {deal.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <span className="text-[11px] text-emerald-700 font-semibold block">
                        Save Rs. {savings.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDealAction(deal)}
                    className="inline-flex items-center gap-1.5 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    {hasOptions ? (
                      <>
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Customize Deal
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add to Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2DA] max-w-md mx-auto space-y-4">
          <Tag className="w-10 h-10 text-[#77736D] mx-auto" />
          <h3 className="font-serif font-bold text-xl text-[#25231F]">
            No Active Deals at This Moment
          </h3>
          <p className="text-xs sm:text-sm text-[#77736D]">
            Please explore our à la carte menu for fresh specialty karahis, charcoal kebabs, and authentic biryanis.
          </p>
          <button
            onClick={() => navigateTo('/menu')}
            className="bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Browse Full Menu
          </button>
        </div>
      )}

      {/* Active Deal Customizer */}
      {activeDeal && (
        <ProductCustomizerModal
          item={activeDeal}
          isDeal={true}
          onClose={() => setActiveDeal(null)}
        />
      )}
    </div>
  );
};
