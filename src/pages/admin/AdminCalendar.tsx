import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, MapPin } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Appointment } from '../../types';
import { timeToMinutes } from '../../services/scheduler';

export const AdminCalendar: React.FC = () => {
  const { appointments, staff, branches, services } = useSalon();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStylist, setSelectedStylist] = useState<string>('all');
  const [activeView, setActiveView] = useState<'day' | 'week'>('day');
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null);

  const dateStr = currentDate.toISOString().split('T')[0];

  // Helper to shift date
  const changeDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d);
  };

  // Operating hours: 10:30 to 20:00 (half-hour increments)
  const timeHours = [
    '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  // Week days
  const weekDays: { dateStr: string; label: string; isToday: boolean }[] = [];
  const startOfWeek = new Date(currentDate);
  // Normalize to Monday or current
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];
    weekDays.push({
      dateStr: dStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      isToday: dStr === todayStr
    });
  }

  // Filtered staff columns for Day View
  const displayStaff = staff.filter((s) => s.active && (selectedStylist === 'all' || s.id === selectedStylist));

  // Day appointments
  const dayAppointments = appointments.filter((a) => {
    if (a.status === 'cancelled') return false;
    const matchDate = a.date === dateStr;
    const matchBranch = selectedBranch === 'all' || a.branchId === selectedBranch;
    const matchStylist = selectedStylist === 'all' || a.stylistId === selectedStylist;
    return matchDate && matchBranch && matchStylist;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Atelier Schedule Calendar
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Visual station planner and master artist schedule grid.
          </p>
        </div>

        {/* Date Selector Controls */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E7E0D8]">
          <button
            onClick={() => changeDate(activeView === 'day' ? -1 : -7)}
            className="p-1 hover:bg-[#FAF8F4] rounded text-[#26231E]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-xs text-[#26231E] min-w-[130px] text-center">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <button
            onClick={() => changeDate(activeView === 'day' ? 1 : 7)}
            className="p-1 hover:bg-[#FAF8F4] rounded text-[#26231E]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="ml-2 px-2 py-0.5 text-[11px] font-semibold bg-[#F7F4EF] text-[#26231E] rounded hover:bg-[#E7E0D8]"
          >
            Today
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white border border-[#E7E0D8] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#77716C]">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2 py-1 bg-[#FAF8F4] border border-[#E7E0D8] rounded font-medium focus:outline-none"
            >
              <option value="all">All Karachi Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#77716C]">Artist:</span>
            <select
              value={selectedStylist}
              onChange={(e) => setSelectedStylist(e.target.value)}
              className="px-2 py-1 bg-[#FAF8F4] border border-[#E7E0D8] rounded font-medium focus:outline-none"
            >
              <option value="all">All Artists</option>
              {staff.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-0.5 bg-[#FAF8F4] rounded-lg border border-[#E7E0D8]">
          <button
            onClick={() => setActiveView('day')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              activeView === 'day' ? 'bg-[#26231E] text-white' : 'text-[#77716C]'
            }`}
          >
            Day Grid
          </button>
          <button
            onClick={() => setActiveView('week')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              activeView === 'week' ? 'bg-[#26231E] text-white' : 'text-[#77716C]'
            }`}
          >
            7-Day Week
          </button>
        </div>
      </div>

      {/* Calendar Grid Canvas */}
      {activeView === 'day' ? (
        /* DAY VIEW BY STYLIST COLUMNS */
        <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Header row with stylists */}
              <div className="grid grid-cols-12 border-b border-[#E7E0D8] bg-[#FAF8F4] text-xs font-semibold text-[#26231E]">
                <div className="col-span-2 p-3 text-[#77716C] border-r border-[#E7E0D8]">
                  Time Slot
                </div>
                <div className="col-span-10 grid grid-cols-4 divide-x divide-[#E7E0D8]">
                  {displayStaff.slice(0, 4).map((st) => (
                    <div key={st.id} className="p-3 flex items-center gap-2">
                      <img
                        src={st.photo}
                        alt={st.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="truncate">{st.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time rows */}
              <div className="divide-y divide-[#FAF8F4] text-xs">
                {timeHours.map((timeStr) => {
                  return (
                    <div key={timeStr} className="grid grid-cols-12 min-h-[50px] items-stretch">
                      <div className="col-span-2 p-3 text-[#77716C] font-mono border-r border-[#E7E0D8] bg-[#FAF8F4]/50">
                        {timeStr}
                      </div>

                      <div className="col-span-10 grid grid-cols-4 divide-x divide-[#E7E0D8]">
                        {displayStaff.slice(0, 4).map((st) => {
                          const slotMin = timeToMinutes(timeStr);
                          // Find appointment overlapping with slot
                          const matched = dayAppointments.find((a) => {
                            if (a.stylistId !== st.id) return false;
                            const sMin = timeToMinutes(a.startTime);
                            const eMin = timeToMinutes(a.endTime);
                            return slotMin >= sMin && slotMin < eMin;
                          });

                          const isStartSlot = matched && matched.startTime === timeStr;

                          return (
                            <div key={st.id} className="p-1 min-h-[46px] relative">
                              {matched && isStartSlot && (
                                <div
                                  onClick={() => setModalAppt(matched)}
                                  className="p-2 rounded-lg bg-[#26231E] text-white text-[11px] cursor-pointer hover:bg-[#3D3730] transition-colors shadow-xs space-y-0.5"
                                >
                                  <div className="font-bold flex items-center justify-between">
                                    <span className="truncate">{matched.customer.name}</span>
                                    <span className="text-[10px] text-[#C8A96A] font-mono">
                                      {matched.startTime}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-white/70 truncate">
                                    {matched.reference} · {matched.totalDurationMinutes}m
                                  </div>
                                </div>
                              )}
                              {matched && !isStartSlot && (
                                <div className="h-full rounded bg-[#26231E]/10 border-l-2 border-[#26231E]" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 7-DAY WEEK VIEW */
        <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] grid grid-cols-7 divide-x divide-[#E7E0D8]">
              {weekDays.map((wd) => {
                const dayAppts = appointments.filter(
                  (a) => a.date === wd.dateStr && a.status !== 'cancelled'
                );

                return (
                  <div key={wd.dateStr} className="min-h-[500px] flex flex-col">
                    <div
                      className={`p-3 text-center border-b border-[#E7E0D8] ${
                        wd.isToday ? 'bg-[#F7F4EF] font-bold text-[#26231E]' : 'bg-[#FAF8F4] text-[#77716C]'
                      }`}
                    >
                      <div className="text-xs uppercase">{wd.label}</div>
                      <div className="text-[10px] text-[#A77A7E] font-medium pt-0.5">
                        {dayAppts.length} appointments
                      </div>
                    </div>

                    <div className="p-2 space-y-2 flex-1">
                      {dayAppts.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => setModalAppt(a)}
                          className="p-2 rounded-lg bg-[#F7F4EF] border border-[#E7E0D8] text-[11px] cursor-pointer hover:border-[#26231E] transition-colors space-y-0.5"
                        >
                          <div className="font-semibold text-[#26231E] flex justify-between">
                            <span className="truncate">{a.customer.name}</span>
                            <span className="text-[#A77A7E] font-mono text-[10px]">{a.startTime}</span>
                          </div>
                          <div className="text-[10px] text-[#77716C] truncate">
                            {staff.find((st) => st.id === a.stylistId)?.name.split(' ')[0]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Appointment Quick Modal */}
      {modalAppt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#E7E0D8] shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-3">
              <div>
                <span className="text-[10px] text-[#77716C] uppercase font-semibold">Reference</span>
                <div className="font-serif-title font-bold text-lg text-[#26231E]">
                  {modalAppt.reference}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 uppercase">
                {modalAppt.status}
              </span>
            </div>

            <div className="space-y-1.5">
              <div>Client: <strong>{modalAppt.customer.name}</strong> ({modalAppt.customer.phone})</div>
              <div>Schedule: <strong>{modalAppt.date}</strong> at {modalAppt.startTime} – {modalAppt.endTime}</div>
              <div>Artist: <strong>{staff.find((s) => s.id === modalAppt.stylistId)?.name}</strong></div>
              <div>Studio: {branches.find((b) => b.id === modalAppt.branchId)?.name}</div>
              <div>Total: <strong>Rs. {modalAppt.pricing.total.toLocaleString()}</strong></div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalAppt(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
