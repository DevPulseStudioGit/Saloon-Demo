import React, { useState } from 'react';
import { Save, Check, RefreshCw, Palette, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { SalonSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSalon();
  const [form, setForm] = useState<SalonSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleFeature = (key: keyof SalonSettings['features']) => {
    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key]
      }
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Business Settings & Brand Customizer
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Customize branding, booking rules, and deposit parameters for any salon deployment.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* Salon Identity */}
        <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-serif-title font-semibold text-[#26231E] border-b border-[#E7E0D8] pb-2">
            Salon Brand Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Salon Name</label>
              <input
                type="text"
                required
                value={form.salonName}
                onChange={(e) => setForm({ ...form, salonName: e.target.value })}
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-[#26231E]">Hero Main Headline</label>
              <input
                type="text"
                value={form.heroHeading}
                onChange={(e) => setForm({ ...form, heroHeading: e.target.value })}
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-[#26231E]">Hero Supporting Subtitle</label>
              <textarea
                rows={2}
                value={form.heroSubheading}
                onChange={(e) => setForm({ ...form, heroSubheading: e.target.value })}
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Concierge */}
        <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-serif-title font-semibold text-[#26231E] border-b border-[#E7E0D8] pb-2">
            Contact & Concierge Coordinates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">WhatsApp Concierge</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Salon Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Concierge Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Booking & Cancellation Rules */}
        <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-serif-title font-semibold text-[#26231E] border-b border-[#E7E0D8] pb-2">
            Scheduling & Cancellation Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Advance Booking Window (Days)</label>
              <input
                type="number"
                min={7}
                max={90}
                value={form.bookingRules.advanceBookingDays}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bookingRules: { ...form.bookingRules, advanceBookingDays: Number(e.target.value) }
                  })
                }
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Minimum Notice (Hours)</label>
              <input
                type="number"
                min={0}
                max={24}
                value={form.bookingRules.minNoticeHours}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bookingRules: { ...form.bookingRules, minNoticeHours: Number(e.target.value) }
                  })
                }
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Buffer Between Services (Mins)</label>
              <input
                type="number"
                min={0}
                step={5}
                value={form.bookingRules.bufferTimeBetweenServices}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bookingRules: { ...form.bookingRules, bufferTimeBetweenServices: Number(e.target.value) }
                  })
                }
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-3">
              <label className="font-semibold text-[#26231E]">Cancellation Policy Text</label>
              <textarea
                rows={3}
                value={form.cancellationPolicy}
                onChange={(e) => setForm({ ...form, cancellationPolicy: e.target.value })}
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Deposit Policy */}
        <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
            <h2 className="text-base font-serif-title font-semibold text-[#26231E]">
              Advance Deposit Settings
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.depositPolicy.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    depositPolicy: { ...form.depositPolicy, enabled: e.target.checked }
                  })
                }
                className="rounded"
              />
              <span className="font-semibold">Enable Advance Deposits</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Standard Deposit Percentage (%)</label>
              <input
                type="number"
                min={10}
                max={50}
                value={form.depositPolicy.percentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    depositPolicy: { ...form.depositPolicy, percentage: Number(e.target.value) }
                  })
                }
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Bridal Suite Fixed Deposit (PKR)</label>
              <input
                type="number"
                min={0}
                step={1000}
                value={form.depositPolicy.fixedAmountForBridal}
                onChange={(e) =>
                  setForm({
                    ...form,
                    depositPolicy: { ...form.depositPolicy, fixedAmountForBridal: Number(e.target.value) }
                  })
                }
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#26231E]">Apply Deposit on Orders Over (PKR)</label>
              <input
                type="number"
                min={0}
                step={1000}
                value={form.depositPolicy.requireForTotalOver}
                onChange={(e) =>
                  setForm({
                    ...form,
                    depositPolicy: { ...form.depositPolicy, requireForTotalOver: Number(e.target.value) }
                  })
                }
                className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-serif-title font-semibold text-[#26231E] border-b border-[#E7E0D8] pb-2">
            Module Enablement (Digital Agency Configuration)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => toggleFeature('packages')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                form.features.packages ? 'bg-[#F7F4EF] border-[#26231E]' : 'bg-white border-[#E7E0D8]'
              }`}
            >
              <div className="font-semibold">Packages & Bundles</div>
              <div className="text-[10px] text-[#77716C]">{form.features.packages ? 'Enabled' : 'Disabled'}</div>
            </div>

            <div
              onClick={() => toggleFeature('giftCards')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                form.features.giftCards ? 'bg-[#F7F4EF] border-[#26231E]' : 'bg-white border-[#E7E0D8]'
              }`}
            >
              <div className="font-semibold">Digital Gift Vouchers</div>
              <div className="text-[10px] text-[#77716C]">{form.features.giftCards ? 'Enabled' : 'Disabled'}</div>
            </div>

            <div
              onClick={() => toggleFeature('retailProducts')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                form.features.retailProducts ? 'bg-[#F7F4EF] border-[#26231E]' : 'bg-white border-[#E7E0D8]'
              }`}
            >
              <div className="font-semibold">Retail Apothecary Shop</div>
              <div className="text-[10px] text-[#77716C]">{form.features.retailProducts ? 'Enabled' : 'Disabled'}</div>
            </div>

            <div
              onClick={() => toggleFeature('branchSelection')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                form.features.branchSelection ? 'bg-[#F7F4EF] border-[#26231E]' : 'bg-white border-[#E7E0D8]'
              }`}
            >
              <div className="font-semibold">Multi-Branch Mode</div>
              <div className="text-[10px] text-[#77716C]">{form.features.branchSelection ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Salon Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
