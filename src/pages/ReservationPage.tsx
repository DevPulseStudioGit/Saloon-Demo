import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService } from '../services/storage';
import { Reservation } from '../types';
import { Calendar, Users, Clock, MapPin, CheckCircle2, Phone, AlertCircle, Sparkles } from 'lucide-react';

export const ReservationPage: React.FC = () => {
  const { config, branches, showToast } = useRestaurant();

  const todayStr = new Date().toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('08:30 PM');
  const [guestCount, setGuestCount] = useState(4);
  const [specialRequests, setSpecialRequests] = useState('');

  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '01:00 PM',
    '02:00 PM',
    '07:00 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
    '09:30 PM',
    '10:30 PM',
    '11:30 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find((b) => b.id === branchId) || branches[0];

    setIsSubmitting(true);

    setTimeout(() => {
      const randomRef = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        referenceNumber: randomRef,
        branchId: branch.id,
        branchName: branch.name,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        date,
        timeSlot,
        guestCount,
        specialRequests: specialRequests.trim() || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      StorageService.createReservation(newReservation);
      setSubmittedReservation(newReservation);
      setIsSubmitting(false);
      showToast(`Reservation request ${randomRef} recorded!`, 'success');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Courtyard & Private Dining
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#25231F]">
          Table Reservation
        </h1>
        <p className="text-xs sm:text-sm text-[#77736D]">
          Reserve your dining experience at {config.name}. Our concierge will prepare your table with traditional welcome drinks.
        </p>
      </div>

      {submittedReservation ? (
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B64E35]">
              Request Received
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#25231F]">
              Reservation Ref: {submittedReservation.referenceNumber}
            </h2>
            <p className="text-xs sm:text-sm text-[#77736D] max-w-md mx-auto pt-2">
              Thank you, {submittedReservation.customerName}. Your table for {submittedReservation.guestCount} guests on{' '}
              <strong>{submittedReservation.date}</strong> at <strong>{submittedReservation.timeSlot}</strong> has been logged for{' '}
              <strong>{submittedReservation.branchName}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] text-xs text-[#77736D] space-y-1">
            <div>Our dining floor captain will confirm via WhatsApp or call at:</div>
            <div className="font-bold text-sm text-[#25231F]">{submittedReservation.customerPhone}</div>
          </div>

          <button
            onClick={() => setSubmittedReservation(null)}
            className="bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Make Another Reservation
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Branch Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                Choose Branch / Location <span className="text-[#B64E35]">*</span>
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] font-medium focus:outline-none focus:border-[#B64E35]"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.area})
                  </option>
                ))}
              </select>
            </div>

            {/* Date, Time, Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Date <span className="text-[#B64E35]">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Time Slot <span className="text-[#B64E35]">*</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-3 text-xs sm:text-sm text-[#25231F] font-medium focus:outline-none focus:border-[#B64E35]"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Guests <span className="text-[#B64E35]">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={40}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#FAF8F4]">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Your Full Name <span className="text-[#B64E35]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Asadullah Khan"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Phone Number <span className="text-[#B64E35]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300 8941234"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Quiet booth, anniversary decor, high chair for child, courtyard table..."
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold py-4 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Table Reservation Request'}
            </button>

            <div className="text-[11px] text-center text-[#77736D]">
              Note: Submissions are logged immediately. Our team confirms table allocation within 15 minutes.
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
