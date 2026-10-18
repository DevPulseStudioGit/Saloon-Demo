import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  MapPin,
  Check,
  X,
  AlertCircle,
  CreditCard,
  History,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Appointment, AppointmentStatus, AvailableTimeSlot } from '../../types';
import { getAvailableSlotsForDate } from '../../services/scheduler';

export const AdminAppointments: React.FC = () => {
  const {
    appointments,
    services,
    staff,
    branches,
    settings,
    updateAppointmentStatus,
    cancelAppointment,
    rescheduleAppointment
  } = useSalon();
  const { currentUser } = useAdminAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [stylistFilter, setStylistFilter] = useState<string>('all');

  // Selected appointment for detail modal
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  // Status change note state
  const [statusNote, setStatusNote] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const filteredAppointments = appointments.filter((appt) => {
    const isStylistAppointment =
      currentUser?.role !== 'stylist' || appt.stylistId === currentUser.stylistId;
    if (!isStylistAppointment) return false;

    // Search match
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      q === '' ||
      appt.reference.toLowerCase().includes(q) ||
      appt.customer.name.toLowerCase().includes(q) ||
      appt.customer.phone.includes(q);

    // Status match
    const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
    // Branch match
    const matchesBranch = branchFilter === 'all' || appt.branchId === branchFilter;
    // Stylist match
    const matchesStylist = stylistFilter === 'all' || appt.stylistId === stylistFilter;

    return matchesSearch && matchesStatus && matchesBranch && matchesStylist;
  });

  const handleUpdateStatus = (
    newStatus: AppointmentStatus,
    note?: string,
    paymentStatus?: Appointment['payment']['status']
  ) => {
    if (!selectedAppt) return;
    const author = currentUser?.name || 'Staff';
    updateAppointmentStatus(selectedAppt.id, newStatus, note || `Status set to ${newStatus}`, author, paymentStatus);

    // Update local modal state
    setSelectedAppt((prev) =>
      prev ? { ...prev, status: newStatus, payment: { ...prev.payment, status: paymentStatus || prev.payment.status } } : null
    );
  };

  const handleConfirmCancel = () => {
    if (!selectedAppt) return;
    const author = currentUser?.name || 'Staff';
    cancelAppointment(selectedAppt.id, cancelReason || 'Cancelled by salon administration', author);
    setCancelModalOpen(false);
    setSelectedAppt(null);
  };

  const handleDateChangeForReschedule = (dateStr: string) => {
    setNewDate(dateStr);
    if (!selectedAppt) return;

    const bookedServices = services.filter((s) => selectedAppt.serviceIds.includes(s.id));
    const slots = getAvailableSlotsForDate({
      dateStr,
      branchId: selectedAppt.branchId,
      services: bookedServices,
      selectedAddons: selectedAppt.serviceAddons || {},
      stylistId: selectedAppt.stylistId,
      allAppointments: appointments,
      allStaff: staff,
      allBranches: branches,
      settings
    });
    setAvailableSlots(slots);
  };

  const handleConfirmReschedule = () => {
    if (!selectedAppt || !newDate || !newTime) return;
    setRescheduleError(null);

    const author = currentUser?.name || 'Staff';
    const res = rescheduleAppointment(selectedAppt.id, newDate, newTime, author);
    if (res.success) {
      setRescheduleModalOpen(false);
      setSelectedAppt((prev) => (prev ? { ...prev, date: newDate, startTime: newTime } : null));
    } else {
      setRescheduleError(res.error || 'Failed to reschedule slot.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Appointments Management
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            View, verify, reschedule, and manage statuses across all salon bookings.
          </p>
        </div>

        <div className="text-xs font-semibold text-[#77716C]">
          Total Bookings: <strong>{appointments.length}</strong>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#E7E0D8] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716C]" />
            <input
              type="text"
              placeholder="Search reference, client, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="pending">Pending Requests</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_service">In Service</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
          >
            <option value="all">All Karachi Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Stylist Filter */}
          <select
            value={stylistFilter}
            onChange={(e) => setStylistFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
          >
            <option value="all">All Master Artists</option>
            {staff.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden shadow-xs">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#77716C]">
            No appointments match the selected search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F4] text-[#77716C] border-b border-[#E7E0D8] uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Ref & Client</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Treatments</th>
                  <th className="py-3 px-4">Artist</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F4]">
                {filteredAppointments.map((appt) => {
                  const bookedSrv = services.filter((s) => appt.serviceIds.includes(s.id));
                  const stylist = staff.find((s) => s.id === appt.stylistId);
                  const branch = branches.find((b) => b.id === appt.branchId);

                  return (
                    <tr
                      key={appt.id}
                      onClick={() => setSelectedAppt(appt)}
                      className="hover:bg-[#FAF8F4] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#26231E]">
                          {appt.reference}
                        </div>
                        <div className="font-semibold text-[#26231E] pt-0.5">
                          {appt.customer.name}
                        </div>
                        <div className="text-[11px] text-[#77716C]">
                          {appt.customer.phone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#26231E]">{appt.date}</div>
                        <div className="text-[#77716C] text-[11px]">
                          {appt.startTime} – {appt.endTime}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-medium text-[#26231E] truncate">
                          {bookedSrv.map((s) => s.name).join(', ')}
                        </div>
                        <div className="text-[11px] text-[#77716C]">
                          {appt.totalDurationMinutes} min duration
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-[#26231E]">
                          {stylist?.name.split(' ')[0] || 'Unassigned'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[#77716C]">{branch?.area}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            appt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800'
                              : appt.status === 'completed'
                              ? 'bg-blue-50 text-blue-800'
                              : appt.status === 'cancelled'
                              ? 'bg-red-50 text-red-800'
                              : appt.status === 'in_service'
                              ? 'bg-purple-50 text-purple-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#26231E]">
                          Rs. {appt.pricing?.total.toLocaleString()}
                        </div>
                        <span
                          className={`text-[10px] font-medium ${
                            appt.payment?.status === 'fully_paid'
                              ? 'text-emerald-800'
                              : appt.payment?.status === 'deposit_paid'
                              ? 'text-amber-800'
                              : 'text-[#77716C]'
                          }`}
                        >
                          {appt.payment?.status === 'fully_paid'
                            ? 'Settled'
                            : appt.payment?.status === 'deposit_paid'
                            ? 'Deposit Paid'
                            : 'Unpaid at desk'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppt(appt);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#26231E] border border-[#E7E0D8] rounded hover:border-[#26231E]"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Detail Drawer / Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#E7E0D8] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E0D8]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#77716C] block">
                  Reservation Management
                </span>
                <h2 className="text-2xl font-serif-title font-bold text-[#26231E]">
                  {selectedAppt.reference} — {selectedAppt.customer.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                className="p-1 text-[#77716C] hover:text-[#26231E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client & Booking Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAF8F4] p-4 rounded-xl border border-[#E7E0D8]">
              <div>
                <span className="text-[#77716C] block">Phone / WhatsApp</span>
                <a href={`tel:${selectedAppt.customer.phone}`} className="font-semibold text-[#26231E]">
                  {selectedAppt.customer.phone}
                </a>
              </div>
              <div>
                <span className="text-[#77716C] block">Email</span>
                <span className="font-semibold text-[#26231E]">
                  {selectedAppt.customer.email || 'None provided'}
                </span>
              </div>
              <div>
                <span className="text-[#77716C] block">Schedule</span>
                <span className="font-semibold text-[#26231E]">
                  {selectedAppt.date} ({selectedAppt.startTime} – {selectedAppt.endTime})
                </span>
              </div>
              <div>
                <span className="text-[#77716C] block">Studio</span>
                <span className="font-semibold text-[#26231E]">
                  {branches.find((b) => b.id === selectedAppt.branchId)?.name}
                </span>
              </div>
            </div>

            {selectedAppt.customer.notes && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                <span className="font-semibold block">Client Special Instructions:</span>
                {selectedAppt.customer.notes}
              </div>
            )}

            {/* Financial Status */}
            <div className="p-4 rounded-xl border border-[#E7E0D8] space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold text-sm text-[#26231E]">
                <span>Total Invoice: Rs. {selectedAppt.pricing?.total.toLocaleString()}</span>
                <span className="uppercase text-[11px] tracking-wider text-[#A77A7E]">
                  Payment: {selectedAppt.payment?.status}
                </span>
              </div>
              {selectedAppt.payment?.transactionId && (
                <div className="text-[11px] text-[#77716C]">
                  Txn ID: {selectedAppt.payment.transactionId}
                </div>
              )}
            </div>

            {/* Status Transition Actions */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#77716C] block">
                Workflow Actions:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedAppt.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus('confirmed', 'Confirmed by reception')}
                    className="px-3 py-2 bg-emerald-700 text-white font-semibold rounded hover:bg-emerald-800"
                  >
                    Confirm Booking
                  </button>
                )}

                {selectedAppt.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus('in_service', 'Client checked in and seated')}
                    className="px-3 py-2 bg-purple-700 text-white font-semibold rounded hover:bg-purple-800"
                  >
                    Check-in (In Service)
                  </button>
                )}

                {selectedAppt.status === 'in_service' && (
                  <button
                    onClick={() => handleUpdateStatus('completed', 'Treatment completed at station', 'fully_paid')}
                    className="px-3 py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800"
                  >
                    Mark Completed & Settle Payment
                  </button>
                )}

                {selectedAppt.payment.status !== 'fully_paid' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAppt.status, 'Payment settled in full at desk', 'fully_paid')}
                    className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold rounded"
                  >
                    Record Balance Paid (Rs. {selectedAppt.pricing?.remainingDue.toLocaleString()})
                  </button>
                )}

                {selectedAppt.status !== 'cancelled' && selectedAppt.status !== 'completed' && (
                  <>
                    <button
                      onClick={() => {
                        setRescheduleModalOpen(true);
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        handleDateChangeForReschedule(tomorrow.toISOString().split('T')[0]);
                      }}
                      className="px-3 py-2 bg-white text-[#26231E] border border-[#E7E0D8] font-semibold rounded hover:border-[#26231E]"
                    >
                      Reschedule Slot
                    </button>

                    <button
                      onClick={() => setCancelModalOpen(true)}
                      className="px-3 py-2 bg-white text-red-700 border border-red-300 font-semibold rounded hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="space-y-2 pt-2 border-t border-[#E7E0D8]">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#77716C] block flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Audit Status Timeline</span>
              </span>
              <div className="space-y-1.5 text-[11px] text-[#77716C] max-h-36 overflow-y-auto">
                {selectedAppt.statusHistory?.map((h, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 bg-[#FAF8F4] p-2 rounded">
                    <div>
                      <strong className="text-[#26231E] uppercase">{h.status}:</strong> {h.note}
                    </div>
                    <div className="text-[10px] text-[#77716C] shrink-0">
                      {h.changedBy} · {h.timestamp.split('T')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-red-900">
              Cancel Appointment {selectedAppt?.reference}?
            </h3>
            <textarea
              rows={3}
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#77716C]"
              >
                Keep
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 text-xs uppercase font-semibold text-white bg-red-700 rounded hover:bg-red-800"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-[#26231E]">
              Reschedule {selectedAppt?.reference}
            </h3>

            {rescheduleError && (
              <div className="p-2.5 rounded bg-red-50 text-red-800 text-xs">
                {rescheduleError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77716C]">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => handleDateChangeForReschedule(e.target.value)}
                className="w-full p-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77716C]">
                Available Slots ({availableSlots.length})
              </label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded"
              >
                <option value="">-- Choose Slot --</option>
                {availableSlots.map((s) => (
                  <option key={s.time} value={s.time}>
                    {s.time}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#77716C]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-1.5 text-xs uppercase font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
              >
                Save New Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
