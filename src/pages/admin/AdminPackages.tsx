import React, { useState } from 'react';
import { Sparkles, Plus, Edit2, Trash2 } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { PackageDeal } from '../../types';

export const AdminPackages: React.FC = () => {
  const { packages, services } = useSalon();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Packages & Offers
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Configure bridal bundles and multi-treatment celebratory promotions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const includedList = services.filter((s) => pkg.includedServices.includes(s.id));

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#A77A7E] font-semibold">
                    {pkg.subtitle}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 uppercase">
                    {pkg.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h2 className="text-xl font-serif-title font-semibold text-[#26231E]">
                  {pkg.title}
                </h2>
                <p className="text-xs text-[#77716C] leading-relaxed">
                  {pkg.description}
                </p>

                <div className="space-y-1 pt-2 border-t border-[#E7E0D8] text-xs">
                  <span className="font-semibold text-[#26231E] block">Included Treatments:</span>
                  <ul className="text-[#77716C] list-disc list-inside space-y-0.5">
                    {includedList.map((s) => (
                      <li key={s.id}>{s.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E0D8] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#77716C] line-through block">
                    Rs. {pkg.originalPrice.toLocaleString()}
                  </span>
                  <span className="font-serif-title font-bold text-lg text-[#26231E]">
                    Rs. {pkg.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
