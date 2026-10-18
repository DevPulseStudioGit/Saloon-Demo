import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Check,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { Service, AvailableTimeSlot, PaymentMethod } from '../types';
import { calculateBookingDuration, calculateBookingPrice } from '../services/scheduler';

interface BookingPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ navigateTo }) => {
  const {
    settings,
    branches,
    categories,
    services,
    staff,
    bookingDraft,
    updateBookingDraft,
    getAvailableSlots,
    submitBooking
  } = useSalon();

  // Active step: 1 (Services), 2 (Location), 3 (Stylist), 4 (Date & Slot), 5 (Customer Info), 6 (Review & Pay)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(true);

  // Available slots for selected date
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);

  // Set default date to today or tomorrow if empty
  useEffect(() => {
    if (!bookingDraft.date) {
      const today = new Date().toISOString().split('T')[0];
      updateBookingDraft({ date: today });
    }
  }, []);

  // Recalculate available slots whenever date, branch, services, or stylist selection changes
  useEffect(() => {
    if (bookingDraft.date && bookingDraft.serviceIds.length > 0) {
      setIsSlotsLoading(true);
      try {
        const slots = getAvailableSlots(bookingDraft.date);
        setAvailableSlots(slots);
        // If current selected time is no longer available, clear it
        if (bookingDraft.startTime && !slots.some((s) => s.time === bookingDraft.startTime)) {
          updateBookingDraft({ startTime: '' });
        }
      } finally {
        setIsSlotsLoading(false);
      }
    }
  }, [bookingDraft.date, bookingDraft.branchId, bookingDraft.serviceIds, bookingDraft.stylistId]);

  // Selected services objects
  const selectedServices = services.filter((s) => bookingDraft.serviceIds.includes(s.id));
  const selectedBranch = branches.find((b) => b.id === bookingDraft.branchId) || branches[0];
  const selectedStylist = staff.find((s) => s.id === bookingDraft.stylistId);

  // Duration & Pricing
  const totalDuration = calculateBookingDuration(
    selectedServices,
    bookingDraft.selectedAddons,
    settings.bookingRules.bufferTimeBetweenServices
  );

  const pricing = calculateBookingPrice(
    selectedServices,
    bookingDraft.selectedAddons,
    settings.depositPolicy,
    settings.currency
  );

  // Service toggle handler
  const handleToggleService = (serviceId: string) => {
    const isAlreadySelected = bookingDraft.serviceIds.includes(serviceId);
    let nextIds: string[];
    if (isAlreadySelected) {
      nextIds = bookingDraft.serviceIds.filter((id) => id !== serviceId);
    } else {
      nextIds = [...bookingDraft.serviceIds, serviceId];
    }
    updateBookingDraft({ serviceIds: nextIds });
  };

  // Add-on toggle handler
  const handleToggleAddon = (serviceId: string, addonId: string) => {
    const currentAddons = bookingDraft.selectedAddons[serviceId] || [];
    const isSelected = currentAddons.includes(addonId);
    const nextAddons = isSelected
      ? currentAddons.filter((id) => id !== addonId)
      : [...currentAddons, addonId];

    updateBookingDraft({
      selectedAddons: {
        ...bookingDraft.selectedAddons,
        [serviceId]: nextAddons
      }
    });
  };

  // Eligible stylists for selected services and branch
  const eligibleStaff = staff.filter((st) => {
    if (!st.active) return false;
    if (!st.branches.includes(bookingDraft.branchId)) return false;
    return bookingDraft.serviceIds.every((sId) => st.servicesSupported.includes(sId));
  });

  // Step validation
  const canProceedFromStep1 = bookingDraft.serviceIds.length > 0;
  const canProceedFromStep2 = !!bookingDraft.branchId;
  const canProceedFromStep3 = !!bookingDraft.stylistId;
  const canProceedFromStep4 = !!bookingDraft.date && !!bookingDraft.startTime;
  const canProceedFromStep5 =
    bookingDraft.customer.name.trim().length >= 2 &&
    bookingDraft.customer.phone.trim().length >= 8;

  // Final booking submit
  const handleConfirmBooking = async () => {
    if (!policyAccepted) {
      setBookingError('Please accept the booking and cancellation policy to proceed.');
      return;
    }
    setLoadingSubmission(true);
    setBookingError(null);

    try {
      const res = await submitBooking();
      if (res.success && res.appointment) {
        navigateTo('booking-confirmation', res.appointment.reference);
      } else {
        setBookingError(res.error || 'Unable to confirm appointment. Please choose another time.');
      }
    } catch (err: any) {
      setBookingError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoadingSubmission(false);
    }
  };

  // Generate date options for the next 45 days
  const dateOptions: { label: string; dateStr: string; dayName: string }[] = [];
  const today = new Date();
  for (let i = 0; i < Math.min(settings.bookingRules.advanceBookingDays, 30); i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateOptions.push({ label, dateStr, dayName });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Step Indicator Header */}
      <div className="space-y-4">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Online Reservations
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
          Schedule Your Atelier Experience
        </h1>

        {/* Stepper bar */}
        <div className="grid grid-cols-6 gap-2 pt-2 text-xs">
          {[
            { step: 1, label: 'Services' },
            { step: 2, label: 'Location' },
            { step: 3, label: 'Artist' },
            { step: 4, label: 'Date & Time' },
            { step: 5, label: 'Details' },
            { step: 6, label: 'Confirm' }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
              disabled={item.step > currentStep}
              className={`text-left p-2 rounded border transition-colors ${
                currentStep === item.step
                  ? 'bg-[#26231E] text-white border-[#26231E] font-medium'
                  : item.step < currentStep
                  ? 'bg-white text-[#26231E] border-[#E7E0D8] hover:border-[#A77A7E]'
                  : 'bg-[#FAF8F4] text-[#77716C]/60 border-transparent cursor-not-allowed'
              }`}
            >
              <div className="text-[10px] text-inherit opacity-75">0{item.step}</div>
              <div className="font-semibold truncate">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {bookingError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{bookingError}</span>
        </div>
      )}

      {/* Main Container Split: Active Step (Left) & Live Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Panels Container */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E0D8] shadow-xs space-y-6">
          {/* STEP 1: SELECT SERVICES */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                  01. Select Treatments
                </h2>
                <p className="text-xs text-[#77716C] pt-1">
                  You can select multiple treatments to create your personalized atelier package.
                </p>
              </div>

              <div className="space-y-6">
                {categories.map((cat) => {
                  const catServices = services.filter((s) => s.categoryId === cat.id && s.active);
                  if (catServices.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-3">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-[#A77A7E] border-b border-[#E7E0D8] pb-1.5">
                        {cat.name}
                      </h3>

                      <div className="space-y-2">
                        {catServices.map((service) => {
                          const isSelected = bookingDraft.serviceIds.includes(service.id);
                          const activeAddons = bookingDraft.selectedAddons[service.id] || [];

                          return (
                            <div
                              key={service.id}
                              className={`p-4 rounded-xl border transition-all ${
                                isSelected
                                  ? 'bg-[#F7F4EF] border-[#26231E]'
                                  : 'bg-white border-[#E7E0D8] hover:border-[#A77A7E]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-semibold text-[#26231E]">
                                      {service.name}
                                    </h4>
                                    <span className="text-[11px] text-[#77716C]">
                                      · {service.durationMinutes} min
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#77716C] leading-relaxed max-w-lg">
                                    {service.description}
                                  </p>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="font-serif-title font-bold text-base text-[#26231E]">
                                    Rs. {service.basePrice.toLocaleString()}
                                  </div>
                                  <button
                                    onClick={() => handleToggleService(service.id)}
                                    className={`mt-2 px-3 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-colors ${
                                      isSelected
                                        ? 'bg-[#26231E] text-white'
                                        : 'bg-white border border-[#26231E] text-[#26231E] hover:bg-[#26231E] hover:text-white'
                                    }`}
                                  >
                                    {isSelected ? 'Selected' : 'Select'}
                                  </button>
                                </div>
                              </div>

                              {/* Addons if service is selected */}
                              {isSelected && service.addons && service.addons.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-[#E7E0D8] space-y-2">
                                  <span className="text-[11px] font-semibold text-[#26231E] block">
                                    Recommended Enhancements:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {service.addons.map((addon) => {
                                      const isAddonActive = activeAddons.includes(addon.id);
                                      return (
                                        <div
                                          key={addon.id}
                                          onClick={() => handleToggleAddon(service.id, addon.id)}
                                          className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between ${
                                            isAddonActive
                                              ? 'bg-white border-[#A77A7E] text-[#26231E]'
                                              : 'bg-[#FAF8F4] border-[#E7E0D8] text-[#77716C]'
                                          }`}
                                        >
                                          <div>
                                            <div className="font-medium">{addon.name}</div>
                                            <div className="text-[10px] text-[#77716C]">+{addon.durationMinutes} min</div>
                                          </div>
                                          <div className="font-semibold text-[#26231E]">
                                            +Rs. {addon.price.toLocaleString()}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  disabled={!canProceedFromStep1}
                  onClick={() => setCurrentStep(2)}
                  className={`px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white rounded-md transition-colors ${
                    canProceedFromStep1
                      ? 'bg-[#26231E] hover:bg-[#3D3730]'
                      : 'bg-[#77716C]/40 cursor-not-allowed'
                  }`}
                >
                  Continue to Location →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT KARACHI BRANCH */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                  02. Choose Karachi Studio
                </h2>
                <p className="text-xs text-[#77716C] pt-1">
                  Select your preferred salon destination in Karachi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branches.map((b) => {
                  const isSelected = bookingDraft.branchId === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => updateBookingDraft({ branchId: b.id })}
                      className={`p-5 rounded-xl border cursor-pointer transition-all space-y-3 ${
                        isSelected
                          ? 'bg-[#F7F4EF] border-[#26231E] shadow-xs'
                          : 'bg-white border-[#E7E0D8] hover:border-[#A77A7E]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif-title font-semibold text-lg text-[#26231E]">
                          {b.name}
                        </span>
                        {isSelected && <Check className="w-5 h-5 text-[#A77A7E]" />}
                      </div>

                      <p className="text-xs text-[#77716C] leading-relaxed">
                        {b.address}
                      </p>

                      <div className="text-[11px] text-[#26231E] space-y-0.5 pt-1">
                        <div>Hours: {b.hours}</div>
                        <div>Phone: {b.phone}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#77716C] hover:text-[#26231E]"
                >
                  ← Back to Services
                </button>
                <button
                  disabled={!canProceedFromStep2}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730]"
                >
                  Continue to Artist →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT STYLIST */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                  03. Choose Master Artist
                </h2>
                <p className="text-xs text-[#77716C] pt-1">
                  Choose a specialist or select "Any Available Artist" for optimal availability.
                </p>
              </div>

              <div className="space-y-3">
                {/* Any Available Option */}
                <div
                  onClick={() => updateBookingDraft({ stylistId: 'any' })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    bookingDraft.stylistId === 'any'
                      ? 'bg-[#F7F4EF] border-[#26231E] shadow-xs'
                      : 'bg-white border-[#E7E0D8] hover:border-[#A77A7E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E9DADA] flex items-center justify-center text-[#26231E] font-semibold text-xs">
                      ANY
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#26231E]">
                        Any Available Master Artist
                      </div>
                      <div className="text-xs text-[#77716C]">
                        Gives you the widest selection of date & time slots
                      </div>
                    </div>
                  </div>
                  {bookingDraft.stylistId === 'any' && <Check className="w-5 h-5 text-[#A77A7E]" />}
                </div>

                {/* Specific Stylists */}
                {eligibleStaff.map((artist) => {
                  const isSelected = bookingDraft.stylistId === artist.id;

                  return (
                    <div
                      key={artist.id}
                      onClick={() => updateBookingDraft({ stylistId: artist.id })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F7F4EF] border-[#26231E] shadow-xs'
                          : 'bg-white border-[#E7E0D8] hover:border-[#A77A7E]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={artist.photo}
                          alt={artist.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-[#E7E0D8]"
                        />
                        <div>
                          <div className="text-sm font-semibold text-[#26231E]">
                            {artist.name}
                          </div>
                          <div className="text-xs text-[#A77A7E] font-medium">
                            {artist.role}
                          </div>
                          <div className="text-[11px] text-[#77716C] pt-0.5">
                            Specialties: {artist.specialties.slice(0, 2).join(' · ')}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#A77A7E]" />}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#77716C] hover:text-[#26231E]"
                >
                  ← Back to Location
                </button>
                <button
                  disabled={!canProceedFromStep3}
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730]"
                >
                  Continue to Date & Time →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SELECT DATE & TIME SLOT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                  04. Select Date & Time Slot
                </h2>
                <p className="text-xs text-[#77716C] pt-1">
                  Availability is calculated live in Asia/Karachi time zone with conflict prevention.
                </p>
              </div>

              {/* Horizontal Date Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#77716C] block">
                  Select Date
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {dateOptions.map((opt) => {
                    const isSelected = bookingDraft.date === opt.dateStr;
                    return (
                      <button
                        key={opt.dateStr}
                        onClick={() => updateBookingDraft({ date: opt.dateStr })}
                        className={`p-3 rounded-xl border text-center transition-all shrink-0 min-w-[76px] ${
                          isSelected
                            ? 'bg-[#26231E] text-white border-[#26231E] shadow-sm'
                            : 'bg-white border-[#E7E0D8] text-[#26231E] hover:border-[#A77A7E]'
                        }`}
                      >
                        <div className="text-[11px] uppercase opacity-75">{opt.dayName}</div>
                        <div className="text-sm font-bold pt-0.5">{opt.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#77716C]">
                    Available Slots ({availableSlots.length})
                  </label>
                  <span className="text-[11px] text-[#77716C]">
                    Treatment Duration: {totalDuration} min
                  </span>
                </div>

                {isSlotsLoading ? (
                  <div className="py-12 text-center text-xs text-[#77716C]">
                    Calculating availability...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#FAF8F4] border border-[#E7E0D8] text-center space-y-2">
                    <p className="text-xs font-semibold text-[#26231E]">
                      No available slots for this date with selected criteria.
                    </p>
                    <p className="text-[11px] text-[#77716C]">
                      Please choose another date or switch artist to "Any Available Master Artist".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = bookingDraft.startTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          onClick={() => updateBookingDraft({ startTime: slot.time })}
                          className={`py-3 px-2 rounded-lg border text-center transition-all ${
                            isSelected
                              ? 'bg-[#26231E] text-white border-[#26231E] font-bold shadow-xs'
                              : 'bg-white border-[#E7E0D8] text-[#26231E] hover:border-[#A77A7E] font-medium'
                          }`}
                        >
                          <div className="text-xs">{slot.time}</div>
                          {slot.stylistName && bookingDraft.stylistId === 'any' && (
                            <div className="text-[10px] opacity-75 truncate">
                              {slot.stylistName.split(' ')[0]}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#77716C] hover:text-[#26231E]"
                >
                  ← Back to Artist
                </button>
                <button
                  disabled={!canProceedFromStep4}
                  onClick={() => setCurrentStep(5)}
                  className={`px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white rounded-md ${
                    canProceedFromStep4 ? 'bg-[#26231E] hover:bg-[#3D3730]' : 'bg-[#77716C]/40 cursor-not-allowed'
                  }`}
                >
                  Continue to Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CUSTOMER INFORMATION */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                  05. Client Information
                </h2>
                <p className="text-xs text-[#77716C] pt-1">
                  We will send your confirmation and reminder to your WhatsApp / Phone.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#26231E]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahnoor Khan"
                    value={bookingDraft.customer.name}
                    onChange={(e) =>
                      updateBookingDraft({
                        customer: { ...bookingDraft.customer, name: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E0D8] rounded-md focus:outline-none focus:border-[#26231E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#26231E]">
                    Mobile / WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567"
                    value={bookingDraft.customer.phone}
                    onChange={(e) =>
                      updateBookingDraft({
                        customer: { ...bookingDraft.customer, phone: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E0D8] rounded-md focus:outline-none focus:border-[#26231E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#26231E]">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={bookingDraft.customer.email}
                    onChange={(e) =>
                      updateBookingDraft({
                        customer: { ...bookingDraft.customer, email: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E0D8] rounded-md focus:outline-none focus:border-[#26231E]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#26231E]">
                    Special Requests or Hair/Skin Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Bridal event date, hair coloring history, or allergies..."
                    value={bookingDraft.customer.notes || ''}
                    onChange={(e) =>
                      updateBookingDraft({
                        customer: { ...bookingDraft.customer, notes: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#E7E0D8] rounded-md focus:outline-none focus:border-[#26231E]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#77716C] hover:text-[#26231E]"
                >
                  ← Back to Time Slot
                </button>
                <button
                  disabled={!canProceedFromStep5}
                  onClick={() => setCurrentStep(6)}
                  className={`px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white rounded-md ${
                    canProceedFromStep5 ? 'bg-[#26231E] hover:bg-[#3D3730]' : 'bg-[#77716C]/40 cursor-not-allowed'
                  }`}
                >
                  Review & Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW AND PAYMENT CONFIRMATION */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                  06. Review & Payment Method
                </h2>
                <p className="text-xs text-[#77716C] pt-1">
                  Verify your appointment details and select your preferred payment mode.
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E0D8] space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#E7E0D8]">
                  <div>
                    <span className="text-[#77716C] block">Location</span>
                    <span className="font-semibold text-[#26231E]">{selectedBranch.name}</span>
                    <div className="text-[11px] text-[#77716C]">{selectedBranch.address}</div>
                  </div>
                  <div>
                    <span className="text-[#77716C] block">Schedule</span>
                    <span className="font-semibold text-[#26231E]">
                      {bookingDraft.date} at {bookingDraft.startTime}
                    </span>
                    <div className="text-[11px] text-[#77716C]">{totalDuration} min duration</div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[#77716C] block font-semibold uppercase text-[10px] tracking-wider">
                    Selected Treatments
                  </span>
                  {selectedServices.map((s) => (
                    <div key={s.id} className="flex justify-between items-center text-xs">
                      <span className="text-[#26231E] font-medium">{s.name}</span>
                      <span className="font-semibold">Rs. {s.basePrice.toLocaleString()}</span>
                    </div>
                  ))}
                  {pricing.addonsTotal > 0 && (
                    <div className="flex justify-between items-center text-xs text-[#77716C]">
                      <span>Treatment Add-ons</span>
                      <span>+Rs. {pricing.addonsTotal.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E7E0D8] space-y-1">
                  <div className="flex justify-between text-sm font-bold text-[#26231E]">
                    <span>Total Treatment Investment</span>
                    <span>Rs. {pricing.total.toLocaleString()}</span>
                  </div>

                  {pricing.depositRequired > 0 && (
                    <div className="flex justify-between text-xs text-[#A77A7E] font-semibold pt-1">
                      <span>Advance Deposit Required</span>
                      <span>Rs. {pricing.depositRequired.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#26231E] block">
                  Select Payment Option
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => updateBookingDraft({ paymentMethod: 'salon' })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      bookingDraft.paymentMethod === 'salon'
                        ? 'bg-[#F7F4EF] border-[#26231E] shadow-2xs'
                        : 'bg-white border-[#E7E0D8]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#26231E]">Pay at Salon</div>
                    <div className="text-[11px] text-[#77716C] pt-0.5">Cash or Card at desk</div>
                  </button>

                  {pricing.depositRequired > 0 && (
                    <button
                      onClick={() => updateBookingDraft({ paymentMethod: 'deposit_online' })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        bookingDraft.paymentMethod === 'deposit_online'
                          ? 'bg-[#F7F4EF] border-[#26231E] shadow-2xs'
                          : 'bg-white border-[#E7E0D8]'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#26231E]">Pay Deposit Now</div>
                      <div className="text-[11px] text-[#A77A7E] pt-0.5">
                        Rs. {pricing.depositRequired.toLocaleString()} online
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => updateBookingDraft({ paymentMethod: 'full_online' })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      bookingDraft.paymentMethod === 'full_online'
                        ? 'bg-[#F7F4EF] border-[#26231E] shadow-2xs'
                        : 'bg-white border-[#E7E0D8]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#26231E]">Prepay Full</div>
                    <div className="text-[11px] text-[#77716C] pt-0.5">JazzCash / Card</div>
                  </button>
                </div>
              </div>

              {/* Policy Checkbox */}
              <div className="p-4 rounded-xl bg-white border border-[#E7E0D8] space-y-2">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-[#77716C]">
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-[#E7E0D8] text-[#26231E] focus:ring-0"
                  />
                  <span>
                    I accept the <strong className="text-[#26231E]">Luma Atelier Cancellation & Booking Policy</strong>. I understand complimentary cancellation is available up to 24 hours prior.
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#77716C] hover:text-[#26231E]"
                >
                  ← Edit Client Info
                </button>
                <button
                  disabled={loadingSubmission}
                  onClick={handleConfirmBooking}
                  className="px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors shadow-md flex items-center gap-2"
                >
                  {loadingSubmission ? (
                    <span>Securing Slot...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Book Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Right-Hand Order Summary Drawer */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E7E0D8] shadow-sm space-y-5 lg:sticky lg:top-24">
          <div className="border-b border-[#E7E0D8] pb-3">
            <h3 className="text-base font-serif-title font-semibold text-[#26231E]">
              Appointment Summary
            </h3>
            <span className="text-[11px] text-[#77716C]">
              {selectedBranch.name}
            </span>
          </div>

          {selectedServices.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#77716C]">
              No treatments selected yet.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="space-y-2.5">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-[#26231E]">{service.name}</div>
                      <div className="text-[11px] text-[#77716C]">{service.durationMinutes} min</div>
                    </div>
                    <div className="font-medium text-[#26231E]">
                      Rs. {service.basePrice.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E7E0D8] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#77716C]">
                  <span>Total Duration</span>
                  <span className="font-medium text-[#26231E]">{totalDuration} Minutes</span>
                </div>
                <div className="flex justify-between text-[#77716C]">
                  <span>Subtotal</span>
                  <span>Rs. {pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#26231E] pt-2 border-t border-[#E7E0D8]">
                  <span>Total</span>
                  <span>Rs. {pricing.total.toLocaleString()}</span>
                </div>
                {pricing.depositRequired > 0 && (
                  <div className="flex justify-between text-xs text-[#A77A7E] font-semibold">
                    <span>Deposit Due</span>
                    <span>Rs. {pricing.depositRequired.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {bookingDraft.date && (
                <div className="p-3 rounded-lg bg-[#FAF8F4] border border-[#E7E0D8] space-y-1 text-[11px]">
                  <div className="text-[#77716C]">Date: <strong className="text-[#26231E]">{bookingDraft.date}</strong></div>
                  {bookingDraft.startTime && (
                    <div className="text-[#77716C]">Time: <strong className="text-[#26231E]">{bookingDraft.startTime}</strong></div>
                  )}
                  {selectedStylist && (
                    <div className="text-[#77716C]">Artist: <strong className="text-[#26231E]">{selectedStylist.name}</strong></div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
