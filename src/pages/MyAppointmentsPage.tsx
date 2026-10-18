import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { Appointment, AvailableTimeSlot } from '../types';
import { getAvailableSlotsForDate } from '../services/scheduler';

interface MyAppointmentsPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const MyAppointmentsPage: React.FC<MyAppointmentsPageProps> = ({ navigateTo }) => {
  const {
    findAppointment,
    cancelAppointment,
    rescheduleAppointment,
    branches,
    services,
    staff,
    settings,
    appointments
  } = useSalon();

  const [referenceInput, setReferenceInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedAppointment, setSearchedAppointment] = useState<Appointment | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cancellation state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setActionMessage(null);
    setIsRescheduling(false);
    setIsCancelling(false);

    if (!referenceInput.trim()) {
      setSearchError('Please enter your appointment reference (e.g. LMA-8821).');
      return;
    }

    const appt = findAppointment(referenceInput, phoneInput);
    if (!appt) {
      setSearchError('No appointment found matching this reference code and phone number. Please verify and try again.');
      setSearchedAppointment(null);
    } else {
      setSearchedAppointment(appt);
      // Pre-set reschedule date to next available day
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setRescheduleDate(tomorrow.toISOString().split('T')[0]);
    }
  };

  // When opening reschedule modal or changing reschedule date, calculate available slots
  const handleDateChangeForReschedule = (newDate: string) => {
    setRescheduleDate(newDate);
    if (!searchedAppointment) return;

    const bookedServices = services.filter((s) => searchedAppointment.serviceIds.includes(s.id));
    const slots = getAvailableSlotsForDate({
      dateStr: newDate,
      branchId: searchedAppointment.branchId,
      services: bookedServices,
      selectedAddons: searchedAppointment.serviceAddons || {},
      stylistId: searchedAppointment.stylistId,
      allAppointments: appointments,
      allStaff: staff,
      allBranches: branches,
      settings
    });
    setAvailableSlots(slots);
  };

  const handleConfirmReschedule = () => {
    if (!searchedAppointment || !rescheduleDate || !rescheduleTime) {
      setActionMessage({ type: 'error', text: 'Please select both a new date and a time slot.' });
      return;
    }

    const result = rescheduleAppointment(
      searchedAppointment.id,
      rescheduleDate,
      rescheduleTime,
      `Client (${searchedAppointment.customer.name})`
    );

    if (result.success) {
      setActionMessage({
        type: 'success',
        text: `Your appointment has been successfully rescheduled to ${rescheduleDate} at ${rescheduleTime}.`
      });
      setIsRescheduling(false);
      // Refresh searched appointment
      const updated = appointments.find((a) => a.id === searchedAppointment.id);
      if (updated) setSearchedAppointment({ ...updated, date: rescheduleDate, startTime: rescheduleTime });
    } else {
      setActionMessage({ type: 'error', text: result.error || 'Unable to reschedule slot.' });
    }
  };

  const handleConfirmCancellation = () => {
    if (!searchedAppointment) return;
    if (!cancelReason.trim()) {
      setActionMessage({ type: 'error', text: 'Please provide a brief reason for cancellation.' });
      return;
    }

    const result = cancelAppointment(
      searchedAppointment.id,
      cancelReason,
      `Client (${searchedAppointment.customer.name})`
    );

    if (result.success) {
      setActionMessage({
        type: 'success',
        text: 'Your appointment has been successfully cancelled.'
      });
      setIsCancelling(false);
      // Update searched appt state
      setSearchedAppointment({ ...searchedAppointment, status: 'cancelled', cancellationReason: cancelReason });
    } else {
      setActionMessage({ type: 'error', text: result.error || 'Failed to cancel appointment.' });
    }
  };

  const branch = searchedAppointment
    ? branches.find((b) => b.id === searchedAppointment.branchId)
    : null;
  const stylist = searchedAppointment
    ? staff.find((s) => s.id === searchedAppointment.stylistId)
    : null;
  const bookedServices = searchedAppointment
    ? services.filter((s) => searchedAppointment.serviceIds.includes(s.id))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="space-y-3 text-center sm:text-left">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Client Self-Service Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
          Manage Your Reservation
        </h1>
        <p className="text-xs sm:text-sm text-[#77716C] max-w-xl">
          Enter your unique booking reference (e.g. <strong className="text-[#26231E]">LMA-8821</strong>) and contact phone number to view, reschedule, or cancel your appointment.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSearch}
        className="p-6 rounded-2xl bg-white border border-[#E7E0D8] shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#26231E]">
              Booking Reference *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. LMA-8821"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded-md focus:outline-none focus:border-[#26231E] uppercase font-mono tracking-wider"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#26231E]">
              Contact Phone Number (Optional / Recommended)
            </label>
            <input
              type="text"
              placeholder="e.g. +92 321 445 8891"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded-md focus:outline-none focus:border-[#26231E]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <span className="text-[11px] text-[#77716C]">
            Sample reference: <button type="button" onClick={() => { setReferenceInput('LMA-8821'); setPhoneInput('321'); }} className="text-[#A77A7E] underline">LMA-8821</button> or <button type="button" onClick={() => { setReferenceInput('LMA-8822'); setPhoneInput('300'); }} className="text-[#A77A7E] underline">LMA-8822</button>
          </span>

          <button
            type="submit"
            className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search Booking</span>
          </button>
        </div>
      </form>

      {searchError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{searchError}</span>
        </div>
      )}

      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Searched Appointment Result View */}
      {searchedAppointment && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E0D8] shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E0D8]">
            <div>
              <span className="text-[11px] text-[#77716C] uppercase tracking-wider">
                Reference
              </span>
              <h2 className="text-2xl font-serif-title font-bold text-[#26231E]">
                {searchedAppointment.reference}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                  searchedAppointment.status === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : searchedAppointment.status === 'completed'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : searchedAppointment.status === 'cancelled'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {searchedAppointment.status}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-[#77716C] uppercase text-[10px] tracking-wider font-semibold">
                Scheduled Slot
              </span>
              <div className="font-semibold text-sm text-[#26231E] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#A77A7E]" />
                {searchedAppointment.date}
              </div>
              <div className="text-[#77716C] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A77A7E]" />
                {searchedAppointment.startTime} – {searchedAppointment.endTime} ({searchedAppointment.totalDurationMinutes} min)
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[#77716C] uppercase text-[10px] tracking-wider font-semibold">
                Karachi Studio & Artist
              </span>
              <div className="font-semibold text-sm text-[#26231E] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#A77A7E]" />
                {branch?.name}
              </div>
              <div className="text-[#77716C] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#A77A7E]" />
                {stylist?.name || 'Assigned Specialist'}
              </div>
            </div>
          </div>

          {/* Treatments list */}
          <div className="pt-4 border-t border-[#E7E0D8] space-y-2 text-xs">
            <span className="font-semibold text-[#77716C] uppercase text-[10px] tracking-wider">
              Treatments
            </span>
            {bookedServices.map((s) => (
              <div key={s.id} className="flex justify-between items-center">
                <span className="font-medium text-[#26231E]">{s.name}</span>
                <span className="font-semibold">Rs. {s.basePrice.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Reschedule View */}
          {isRescheduling && (
            <div className="mt-6 p-5 rounded-xl bg-[#F7F4EF] border border-[#E7E0D8] space-y-4">
              <h3 className="text-sm font-semibold text-[#26231E]">
                Select a New Date & Time Slot
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77716C]">
                    New Appointment Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => handleDateChangeForReschedule(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E7E0D8] rounded-md focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77716C]">
                    Available Slots ({availableSlots.length})
                  </label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E7E0D8] rounded-md focus:outline-none"
                  >
                    <option value="">-- Choose Slot --</option>
                    {availableSlots.map((s) => (
                      <option key={s.time} value={s.time}>
                        {s.time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduling(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#77716C] hover:text-[#26231E]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          )}

          {/* Cancellation View */}
          {isCancelling && (
            <div className="mt-6 p-5 rounded-xl bg-red-50 border border-red-200 space-y-4 text-xs">
              <div className="font-semibold text-red-900">
                Cancel Appointment {searchedAppointment.reference}?
              </div>
              <p className="text-red-700 text-[11px]">
                Please review our policy: Complimentary cancellation is allowed up to 24 hours prior. For bridal suites or color deposits, deposits are non-refundable if cancelled within 24 hours.
              </p>

              <textarea
                rows={2}
                placeholder="Reason for cancellation (e.g. family schedule change)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 bg-white border border-red-300 rounded text-xs focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCancelling(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#77716C]"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancellation}
                  className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-red-700 rounded hover:bg-red-800"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          )}

          {/* Action Row */}
          {searchedAppointment.status !== 'cancelled' && searchedAppointment.status !== 'completed' && !isRescheduling && !isCancelling && (
            <div className="pt-4 border-t border-[#E7E0D8] flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setIsRescheduling(true);
                  if (rescheduleDate) handleDateChangeForReschedule(rescheduleDate);
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#26231E] border border-[#26231E] rounded hover:bg-[#26231E] hover:text-white transition-colors"
              >
                Reschedule Slot
              </button>

              <button
                onClick={() => setIsCancelling(true)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
              >
                Cancel Appointment
              </button>

              <button
                onClick={() => navigateTo('booking-confirmation', searchedAppointment.reference)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#77716C] hover:text-[#26231E]"
              >
                View Full Receipt →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
