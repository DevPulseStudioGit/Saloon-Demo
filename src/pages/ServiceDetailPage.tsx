import React, { useState } from 'react';
import { ArrowLeft, Clock, ShieldCheck, Check, Sparkles, AlertCircle, Calendar } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface ServiceDetailPageProps {
  serviceId: string;
  navigateTo: (route: string, param?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceId, navigateTo }) => {
  const { services, categories, staff, updateBookingDraft } = useSalon();
  const service = services.find((s) => s.id === serviceId) || services[0];
  const category = categories.find((c) => c.id === service?.categoryId);

  // Selected add-ons on this page
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-lg font-semibold text-[#26231E]">Service not found.</p>
        <button
          onClick={() => navigateTo('services')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#26231E] rounded"
        >
          Return to Services
        </button>
      </div>
    );
  }

  const assignedStaff = staff.filter((st) => service.assignedStaffIds.includes(st.id));

  // Compute live duration & price with selected add-ons
  const addonsTotal = selectedAddons.reduce((acc, addonId) => {
    const addon = service.addons.find((a) => a.id === addonId);
    return acc + (addon ? addon.price : 0);
  }, 0);

  const addonsDuration = selectedAddons.reduce((acc, addonId) => {
    const addon = service.addons.find((a) => a.id === addonId);
    return acc + (addon ? addon.durationMinutes : 0);
  }, 0);

  const totalCalculatedPrice = service.basePrice + addonsTotal;
  const totalCalculatedDuration = service.durationMinutes + addonsDuration;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleProceedToBooking = () => {
    updateBookingDraft({
      serviceIds: [service.id],
      selectedAddons: { [service.id]: selectedAddons }
    });
    navigateTo('booking');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Back button */}
      <button
        onClick={() => navigateTo('services')}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#77716C] hover:text-[#26231E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services Catalogue</span>
      </button>

      {/* Main Showcase Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Gallery / Image */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7E0D8] shadow-sm relative">
            <img
              src={service.image}
              alt={service.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Included Work Details */}
          {service.includedItems && service.includedItems.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-[#E7E0D8] space-y-4">
              <h3 className="text-base font-serif-title font-semibold text-[#26231E]">
                What is Included in Your Treatment
              </h3>
              <ul className="space-y-2.5 text-xs text-[#77716C]">
                {service.includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#A77A7E] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preparation Instructions */}
          {service.prepInstructions && (
            <div className="bg-[#FAF8F4] rounded-xl p-6 border border-[#E7E0D8] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A96A]">
                <AlertCircle className="w-4 h-4" />
                <span>Pre-Appointment Preparation</span>
              </div>
              <p className="text-xs text-[#77716C] leading-relaxed">
                {service.prepInstructions}
              </p>
            </div>
          )}

          {/* Eligible Artists */}
          {assignedStaff.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-[#E7E0D8] space-y-4">
              <h3 className="text-base font-serif-title font-semibold text-[#26231E]">
                Master Artists Providing This Treatment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assignedStaff.map((artist) => (
                  <div key={artist.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F4EF]">
                    <img
                      src={artist.photo}
                      alt={artist.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-[#E7E0D8]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#26231E]">{artist.name}</div>
                      <div className="text-[11px] text-[#A77A7E]">{artist.role.split('&')[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Purchase Module */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl p-7 border border-[#E7E0D8] shadow-md space-y-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
                {category?.name}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#26231E]">
                {service.name}
              </h1>
              <p className="text-xs text-[#77716C] leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="pt-2 pb-4 border-y border-[#E7E0D8] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#77716C] block">Duration</span>
                <span className="text-sm font-semibold text-[#26231E] flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#A77A7E]" />
                  {totalCalculatedDuration} Minutes
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#77716C] block">Investment</span>
                <span className="font-serif-title font-bold text-2xl text-[#26231E]">
                  {service.isStartingPrice ? 'From ' : ''}Rs. {totalCalculatedPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Add-ons selection */}
            {service.addons && service.addons.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#26231E] block">
                  Enhance Your Treatment (Add-ons)
                </label>
                <div className="space-y-2">
                  {service.addons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-[#F7F4EF] border-[#26231E]'
                            : 'bg-white border-[#E7E0D8] hover:border-[#A77A7E]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#26231E]">{addon.name}</div>
                          <div className="text-[#77716C] text-[11px]">+{addon.durationMinutes} min</div>
                        </div>
                        <div className="text-right font-medium text-[#26231E]">
                          +Rs. {addon.price.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Deposit notice */}
            {service.depositRequired && (
              <div className="p-3 rounded-lg bg-[#F7F4EF] border border-[#E7E0D8] text-[11px] text-[#77716C] space-y-1">
                <span className="font-semibold text-[#26231E]">Deposit Policy:</span>
                <p>
                  Requires Rs. {service.depositAmount.toLocaleString()} advance deposit to secure your station and specialist.
                </p>
              </div>
            )}

            {/* Action CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleProceedToBooking}
                className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Appointment</span>
              </button>

              <p className="text-[11px] text-center text-[#77716C]">
                Free rescheduling or cancellation up to 24 hours prior
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
