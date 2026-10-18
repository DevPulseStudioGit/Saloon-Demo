import React, { useEffect, useState } from 'react';
import { Users, Calendar, Clock, Plus, Check, Edit2, Shield, X, MapPin } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Staff, WorkingShift } from '../../types';

export const AdminStaff: React.FC = () => {
  const { staff, branches, updateStaffMember, createStaffMember } = useSalon();

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(staff[0] || null);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Senior Stylist');
  const [newStaffBranch, setNewStaffBranch] = useState(branches[0]?.id || '');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  useEffect(() => {
    if (!selectedStaff && staff[0]) setSelectedStaff(staff[0]);
  }, [staff, selectedStaff]);
  const [scheduleEditorOpen, setScheduleEditorOpen] = useState(false);
  const [timeOffDate, setTimeOffDate] = useState('');
  const [timeOffReason, setTimeOffReason] = useState('');

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const createDefaultSchedule = () =>
    daysOfWeek.reduce<Record<number, WorkingShift>>((schedule, _, index) => {
      schedule[index] = {
        isWorking: index !== 1,
        start: '10:30',
        end: '19:30',
        breaks: [{ start: '14:00', end: '15:00' }]
      };
      return schedule;
    }, {});

  const handleCreateStaff = (event: React.FormEvent) => {
    event.preventDefault();
    const name = newStaffName.trim();
    if (!name || !newStaffBranch) return;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    createStaffMember({
      id: `staff-${Date.now()}`,
      name,
      slug,
      role: newStaffRole,
      bio: newStaffEmail ? `Contact: ${newStaffEmail}` : 'New Luma Atelier team member.',
      photo: '/assets/images/service_hair_styling_1792040701711.jpg',
      specialties: [],
      servicesSupported: [],
      branches: [newStaffBranch],
      weeklySchedule: createDefaultSchedule(),
      timeOff: [],
      maxDailyAppointments: 6,
      active: true,
      displayOrder: staff.length + 1
    });
    setNewStaffName('');
    setNewStaffEmail('');
    setAddStaffOpen(false);
  };

  if (!selectedStaff) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">Team & Staff</h1>
        <button onClick={() => setAddStaffOpen(true)} className="px-4 py-2 bg-[#26231E] text-white rounded text-xs font-semibold">+ Add Staff Member</button>
        {addStaffOpen && <StaffForm onSubmit={handleCreateStaff} name={newStaffName} setName={setNewStaffName} role={newStaffRole} setRole={setNewStaffRole} branch={newStaffBranch} setBranch={setNewStaffBranch} email={newStaffEmail} setEmail={setNewStaffEmail} branches={branches} onClose={() => setAddStaffOpen(false)} />}
      </div>
    );
  }

  // Toggle shift working status
  const handleToggleDayWorking = (dayIndex: number) => {
    const currentShift = selectedStaff.weeklySchedule[dayIndex] || {
      isWorking: false,
      start: '10:30',
      end: '19:30',
      breaks: []
    };

    const updatedSchedule = {
      ...selectedStaff.weeklySchedule,
      [dayIndex]: {
        ...currentShift,
        isWorking: !currentShift.isWorking
      }
    };

    const updatedStaff = { ...selectedStaff, weeklySchedule: updatedSchedule };
    setSelectedStaff(updatedStaff);
    updateStaffMember(updatedStaff);
  };

  // Update shift times
  const handleShiftTimeChange = (dayIndex: number, field: 'start' | 'end', val: string) => {
    const currentShift = selectedStaff.weeklySchedule[dayIndex];
    if (!currentShift) return;

    const updatedSchedule = {
      ...selectedStaff.weeklySchedule,
      [dayIndex]: {
        ...currentShift,
        [field]: val
      }
    };

    const updatedStaff = { ...selectedStaff, weeklySchedule: updatedSchedule };
    setSelectedStaff(updatedStaff);
    updateStaffMember(updatedStaff);
  };

  // Add time-off record
  const handleAddTimeOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeOffDate) return;

    const newTimeOff = {
      id: `to-${Date.now()}`,
      date: timeOffDate,
      reason: timeOffReason || 'Scheduled Personal Leave',
      approved: true
    };

    const updated = {
      ...selectedStaff,
      timeOff: [...selectedStaff.timeOff, newTimeOff]
    };
    setSelectedStaff(updated);
    updateStaffMember(updated);
    setTimeOffDate('');
    setTimeOffReason('');
  };

  const handleRemoveTimeOff = (id: string) => {
    const updated = {
      ...selectedStaff,
      timeOff: selectedStaff.timeOff.filter((to) => to.id !== id)
    };
    setSelectedStaff(updated);
    updateStaffMember(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Stylists & Working Shifts
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Configure weekly schedules, breaks, time-off leave, and branch assignments.
          </p>
        </div>
        <button onClick={() => setAddStaffOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#26231E] text-white rounded-lg text-xs font-semibold hover:bg-[#3D3730]">
          <Plus className="w-3.5 h-3.5" /> Add Staff Member
        </button>
      </div>

      {addStaffOpen && <StaffForm onSubmit={handleCreateStaff} name={newStaffName} setName={setNewStaffName} role={newStaffRole} setRole={setNewStaffRole} branch={newStaffBranch} setBranch={setNewStaffBranch} email={newStaffEmail} setEmail={setNewStaffEmail} branches={branches} onClose={() => setAddStaffOpen(false)} />}

      {/* Staff Picker Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {staff.map((artist) => {
          const isSelected = selectedStaff.id === artist.id;
          return (
            <div
              key={artist.id}
              onClick={() => setSelectedStaff(artist)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                isSelected
                  ? 'bg-white border-[#26231E] shadow-sm'
                  : 'bg-white/70 border-[#E7E0D8] hover:border-[#A77A7E]'
              }`}
            >
              <img
                src={artist.photo}
                alt={artist.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-[#E7E0D8]"
              />
              <div className="overflow-hidden">
                <div className="font-semibold text-xs text-[#26231E] truncate">
                  {artist.name}
                </div>
                <div className="text-[10px] text-[#A77A7E] truncate">
                  {artist.role.split('&')[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Profile & Schedule Grid for Selected Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Weekly Shift Editor */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-3">
            <div>
              <h2 className="text-lg font-serif-title font-semibold text-[#26231E]">
                Weekly Working Hours — {selectedStaff.name}
              </h2>
              <span className="text-xs text-[#77716C]">
                Changes instantly update the customer reservation availability engine.
              </span>
            </div>
            <span className="text-xs font-semibold text-[#A77A7E] bg-[#F7F4EF] px-2.5 py-1 rounded">
              Max {selectedStaff.maxDailyAppointments} Daily Appointments
            </span>
          </div>

          <div className="space-y-3">
            {daysOfWeek.map((dayName, dayIndex) => {
              const shift: WorkingShift = selectedStaff.weeklySchedule[dayIndex] || {
                isWorking: false,
                start: '10:30',
                end: '19:30',
                breaks: []
              };

              return (
                <div
                  key={dayName}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                    shift.isWorking ? 'bg-[#FAF8F4] border-[#E7E0D8]' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 w-36">
                    <button
                      onClick={() => handleToggleDayWorking(dayIndex)}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        shift.isWorking
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {shift.isWorking ? 'On Duty' : 'Day Off'}
                    </button>
                    <span className="font-semibold text-[#26231E]">{dayName}</span>
                  </div>

                  {shift.isWorking ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#77716C]">Shift:</span>
                        <input
                          type="time"
                          value={shift.start}
                          onChange={(e) => handleShiftTimeChange(dayIndex, 'start', e.target.value)}
                          className="px-2 py-1 bg-white border border-[#E7E0D8] rounded font-mono text-xs focus:outline-none"
                        />
                        <span className="text-[#77716C]">to</span>
                        <input
                          type="time"
                          value={shift.end}
                          onChange={(e) => handleShiftTimeChange(dayIndex, 'end', e.target.value)}
                          className="px-2 py-1 bg-white border border-[#E7E0D8] rounded font-mono text-xs focus:outline-none"
                        />
                      </div>

                      {shift.breaks.length > 0 && (
                        <span className="text-[11px] text-[#A77A7E] hidden md:inline">
                          Break: {shift.breaks[0].start} – {shift.breaks[0].end}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#77716C] italic text-[11px]">
                      Atelier station closed on this day
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Time-Off Leave & Branches */}
        <div className="lg:col-span-4 space-y-6">
          {/* Time Off Card */}
          <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-serif-title font-semibold text-[#26231E] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#A77A7E]" />
              <span>Time-Off & Leave Dates</span>
            </h3>

            <form onSubmit={handleAddTimeOff} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#77716C]">Select Date</label>
                <input
                  type="date"
                  required
                  value={timeOffDate}
                  onChange={(e) => setTimeOffDate(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#77716C]">Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Masterclass, Personal"
                  value={timeOffReason}
                  onChange={(e) => setTimeOffReason(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#26231E] text-white font-semibold rounded hover:bg-[#3D3730] text-xs uppercase tracking-wider"
              >
                + Register Leave Date
              </button>
            </form>

            <div className="space-y-2 pt-2 border-t border-[#E7E0D8]">
              <span className="font-semibold text-[#77716C] block text-[11px] uppercase tracking-wider">
                Approved Leave Records ({selectedStaff.timeOff.length})
              </span>
              {selectedStaff.timeOff.length === 0 ? (
                <div className="text-[#77716C] italic py-2">No upcoming leave scheduled.</div>
              ) : (
                <div className="space-y-1.5">
                  {selectedStaff.timeOff.map((to) => (
                    <div
                      key={to.id}
                      className="p-2 bg-[#FAF8F4] rounded border border-[#E7E0D8] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#26231E]">{to.date}</div>
                        <div className="text-[10px] text-[#77716C]">{to.reason}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveTimeOff(to.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assigned Branches */}
          <div className="bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-xs space-y-3 text-xs">
            <h3 className="text-base font-serif-title font-semibold text-[#26231E] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#A77A7E]" />
              <span>Assigned Karachi Studios</span>
            </h3>

            <div className="space-y-2">
              {branches.map((b) => {
                const isAssigned = selectedStaff.branches.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      const next = isAssigned
                        ? selectedStaff.branches.filter((id) => id !== b.id)
                        : [...selectedStaff.branches, b.id];
                      const updated = { ...selectedStaff, branches: next };
                      setSelectedStaff(updated);
                      updateStaffMember(updated);
                    }}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                      isAssigned ? 'bg-[#F7F4EF] border-[#26231E]' : 'bg-white border-[#E7E0D8]'
                    }`}
                  >
                    <span>{b.name} ({b.area})</span>
                    {isAssigned && <Check className="w-4 h-4 text-[#A77A7E]" />}
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

interface StaffFormProps {
  onSubmit: (event: React.FormEvent) => void;
  name: string;
  setName: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  branch: string;
  setBranch: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  branches: { id: string; name: string }[];
  onClose: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({
  onSubmit,
  name,
  setName,
  role,
  setRole,
  branch,
  setBranch,
  email,
  setEmail,
  branches,
  onClose
}) => (
  <div className="bg-white rounded-2xl border border-[#E7E0D8] p-5 shadow-xs">
    <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
      <label className="text-xs font-semibold text-[#77716C]">
        Name
        <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded font-normal" placeholder="e.g. Hira Khan" />
      </label>
      <label className="text-xs font-semibold text-[#77716C]">
        Role / specialty
        <input required value={role} onChange={(event) => setRole(event.target.value)} className="mt-1 w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded font-normal" placeholder="e.g. Skin Specialist" />
      </label>
      <label className="text-xs font-semibold text-[#77716C]">
        Contact email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded font-normal" placeholder="Optional" />
      </label>
      <label className="text-xs font-semibold text-[#77716C]">
        Primary branch
        <select required value={branch} onChange={(event) => setBranch(event.target.value)} className="mt-1 w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded font-normal">
          {branches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 py-2 bg-[#26231E] text-white rounded text-xs font-semibold">Create</button>
        <button type="button" onClick={onClose} className="px-3 py-2 border border-[#E7E0D8] rounded text-xs font-semibold">Cancel</button>
      </div>
    </form>
  </div>
);
