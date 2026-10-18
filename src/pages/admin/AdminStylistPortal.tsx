import React, { useMemo } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSalon } from '../../context/SalonContext';

export const AdminStylistPortal: React.FC = () => {
  const { currentUser } = useAdminAuth();
  const { appointments, staff, services, branches } = useSalon();
  const assignedStaff = staff.find((member) => member.id === currentUser?.stylistId);
  const ownAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.stylistId === currentUser?.stylistId && appointment.status !== 'cancelled')
        .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)),
    [appointments, currentUser?.stylistId]
  );

  if (!assignedStaff) {
    return <div className="bg-white rounded-2xl border border-[#E7E0D8] p-8 text-sm text-[#77716C]">No staff profile is assigned to this login yet.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">My Calendar & Clients</h1>
        <p className="text-xs text-[#77716C] pt-0.5">{assignedStaff.name} · {assignedStaff.role}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E7E0D8] rounded-xl p-4"><div className="text-xs text-[#77716C]">Upcoming appointments</div><strong className="text-2xl">{ownAppointments.length}</strong></div>
        <div className="bg-white border border-[#E7E0D8] rounded-xl p-4"><div className="text-xs text-[#77716C]">Assigned branches</div><strong className="text-2xl">{assignedStaff.branches.length}</strong></div>
        <div className="bg-white border border-[#E7E0D8] rounded-xl p-4"><div className="text-xs text-[#77716C]">Daily capacity</div><strong className="text-2xl">{assignedStaff.maxDailyAppointments}</strong></div>
      </div>
      <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden">
        <div className="p-4 border-b border-[#E7E0D8] font-semibold text-sm">My schedule</div>
        {ownAppointments.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#77716C]">No appointments are assigned to you.</div>
        ) : ownAppointments.map((appointment) => (
          <div key={appointment.id} className="p-4 border-b border-[#F0ECE1] last:border-0 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#A77A7E]" /><strong>{appointment.date}</strong></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#A77A7E]" />{appointment.startTime} - {appointment.endTime}</div>
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-[#A77A7E]" />{appointment.customer.name}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#A77A7E]" />{branches.find((branch) => branch.id === appointment.branchId)?.name || 'Branch'} · {appointment.serviceIds.map((id) => services.find((service) => service.id === id)?.name || id).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
