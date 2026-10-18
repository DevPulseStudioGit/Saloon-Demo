import React from 'react';
import {
  Calendar,
  Clock,
  TrendingUp,
  CreditCard,
  Users,
  CheckCircle2,
  AlertCircle,
  Scissors,
  ArrowRight
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

interface AdminOverviewProps {
  onSelectTab: (tab: string) => void;
  onSelectAppointment: (id: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onSelectTab,
  onSelectAppointment
}) => {
  const { appointments, services, staff, branches, updateAppointmentStatus } = useSalon();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculated metrics
  const todayAppts = appointments.filter((a) => a.date === todayStr);
  const pendingAppts = appointments.filter((a) => a.status === 'pending');
  const confirmedUpcoming = appointments.filter((a) => a.status === 'confirmed');
  const completedAppts = appointments.filter((a) => a.status === 'completed');
  const cancelledAppts = appointments.filter((a) => a.status === 'cancelled');

  // Revenue metrics from actual data
  const totalGrossBookingValue = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (a.pricing?.total || 0), 0);

  const totalCollectedDepositsAndPayments = appointments.reduce((sum, a) => {
    if (a.payment.status === 'fully_paid') return sum + (a.pricing?.total || 0);
    if (a.payment.status === 'deposit_paid') return sum + (a.pricing?.depositPaid || 0);
    return sum;
  }, 0);

  const totalOutstandingDue = appointments
    .filter((a) => a.status !== 'cancelled' && a.status !== 'completed')
    .reduce((sum, a) => sum + (a.pricing?.remainingDue || 0), 0);

  // Popular services breakdown
  const servicePopularity: { [serviceId: string]: number } = {};
  appointments.forEach((appt) => {
    appt.serviceIds.forEach((sId) => {
      servicePopularity[sId] = (servicePopularity[sId] || 0) + 1;
    });
  });

  const popularServicesList = Object.entries(servicePopularity)
    .map(([sId, count]) => {
      const s = services.find((srv) => srv.id === sId);
      return {
        id: sId,
        name: s?.name || sId,
        count,
        price: s?.basePrice || 0
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Executive Atelier Dashboard
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Real-time schedule operations, financial tallies, and stylist allocation across Karachi.
          </p>
        </div>

        <div className="text-xs text-[#77716C] flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E7E0D8]">
          <Calendar className="w-3.5 h-3.5 text-[#A77A7E]" />
          <span>Today: <strong>{todayStr}</strong> (Asia/Karachi)</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E7E0D8] shadow-xs space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-[#77716C] font-semibold block">
            Today's Bookings
          </span>
          <div className="font-serif-title text-3xl font-bold text-[#26231E]">
            {todayAppts.length}
          </div>
          <span className="text-[11px] text-[#A77A7E] font-medium block">
            {todayAppts.filter((a) => a.status === 'confirmed').length} active today
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E7E0D8] shadow-xs space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-[#77716C] font-semibold block">
            Upcoming Confirmed
          </span>
          <div className="font-serif-title text-3xl font-bold text-[#26231E]">
            {confirmedUpcoming.length}
          </div>
          <span className="text-[11px] text-emerald-800 font-medium block">
            Guaranteed slots
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E7E0D8] shadow-xs space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-[#77716C] font-semibold block">
            Collected Revenue
          </span>
          <div className="font-serif-title text-2xl font-bold text-[#26231E]">
            Rs. {totalCollectedDepositsAndPayments.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-800 font-medium block">
            Verified deposits & settled
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E7E0D8] shadow-xs space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-[#77716C] font-semibold block">
            Outstanding Due
          </span>
          <div className="font-serif-title text-2xl font-bold text-[#26231E]">
            Rs. {totalOutstandingDue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#77716C] font-medium block">
            Receivable at salon desk
          </span>
        </div>
      </div>

      {/* Main Split: Today's Appointments & Popular Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Today's & Recent Appointments List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-3">
            <h2 className="text-lg font-serif-title font-semibold text-[#26231E] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#A77A7E]" />
              <span>Recent & Upcoming Appointments</span>
            </h2>
            <button
              onClick={() => onSelectTab('appointments')}
              className="text-xs font-semibold text-[#A77A7E] hover:underline"
            >
              View All ({appointments.length}) →
            </button>
          </div>

          <div className="divide-y divide-[#FAF8F4] overflow-x-auto">
            {appointments.slice(0, 6).map((appt) => {
              const bookedSrv = services.filter((s) => appt.serviceIds.includes(s.id));
              const stylist = staff.find((st) => st.id === appt.stylistId);
              const branch = branches.find((b) => b.id === appt.branchId);

              return (
                <div
                  key={appt.id}
                  className="py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-[#FAF8F4] px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#26231E]">
                        {appt.reference}
                      </span>
                      <span className="text-[#77716C]">·</span>
                      <span className="font-semibold text-[#26231E]">
                        {appt.customer.name}
                      </span>
                      <span className="text-[#77716C]">({branch?.area})</span>
                    </div>
                    <div className="text-[11px] text-[#77716C]">
                      {bookedSrv.map((s) => s.name).join(', ')} · Artist: <strong>{stylist?.name.split(' ')[0]}</strong>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="font-medium text-[#26231E]">
                      {appt.date} at {appt.startTime}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        appt.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800'
                          : appt.status === 'completed'
                          ? 'bg-blue-50 text-blue-800'
                          : appt.status === 'cancelled'
                          ? 'bg-red-50 text-red-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Services & Stylists Workload */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4">
            <h3 className="text-base font-serif-title font-semibold text-[#26231E] flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#A77A7E]" />
              <span>Most Booked Treatments</span>
            </h3>

            <div className="space-y-3 text-xs">
              {popularServicesList.map((srv, index) => (
                <div key={srv.id} className="flex items-center justify-between pb-2 border-b border-[#FAF8F4]">
                  <div>
                    <div className="font-semibold text-[#26231E]">
                      {index + 1}. {srv.name}
                    </div>
                    <div className="text-[11px] text-[#77716C]">
                      Rs. {srv.price.toLocaleString()}
                    </div>
                  </div>
                  <span className="font-bold text-[#A77A7E] bg-[#F7F4EF] px-2 py-0.5 rounded">
                    {srv.count} booking{srv.count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4">
            <h3 className="text-base font-serif-title font-semibold text-[#26231E] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#A77A7E]" />
              <span>Stylist Allocation</span>
            </h3>

            <div className="space-y-3 text-xs">
              {staff.map((st) => {
                const count = appointments.filter(
                  (a) => a.stylistId === st.id && a.status !== 'cancelled'
                ).length;
                return (
                  <div key={st.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={st.photo}
                        alt={st.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-[#E7E0D8]"
                      />
                      <span className="font-semibold text-[#26231E]">{st.name}</span>
                    </div>
                    <span className="text-[#77716C] font-mono">{count} appts</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
