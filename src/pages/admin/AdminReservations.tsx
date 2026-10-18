import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Reservation } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { Calendar, Users, Clock, Check, X, Phone, Mail } from 'lucide-react';

export const AdminReservations: React.FC = () => {
  const { showToast } = useRestaurant();
  const [reservations, setReservations] = useState<Reservation[]>(() => StorageService.getReservations());

  const refresh = () => setReservations(StorageService.getReservations());

  const handleUpdateStatus = (id: string, status: Reservation['status']) => {
    StorageService.updateReservationStatus(id, status);
    refresh();
    showToast(`Reservation marked as ${status}.`, 'info');
  };

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Pending Review</span>;
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Confirmed Table</span>;
      case 'seated':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Guests Seated</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Dining Floor Bookings
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
          Table Reservations ({reservations.length})
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E2DA] overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF8F4] border-b border-[#E8E2DA] text-[#77736D] uppercase tracking-wider font-semibold">
              <th className="p-4">Ref & Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Guests & Slot</th>
              <th className="p-4">Branch</th>
              <th className="p-4">Special Requests</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF8F4]">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-[#FAF8F4]/50 transition-colors">
                <td className="p-4 font-mono font-bold text-[#25231F]">
                  {r.referenceNumber}
                  <div className="text-[11px] font-sans font-medium text-[#77736D]">{r.date}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-[#25231F]">{r.customerName}</div>
                  <div className="text-[11px] text-[#77736D]">{r.customerPhone}</div>
                </td>
                <td className="p-4 font-medium text-[#25231F]">
                  <div>{r.guestCount} Guests</div>
                  <div className="text-[11px] text-[#77736D]">{r.timeSlot}</div>
                </td>
                <td className="p-4 text-[#25231F] font-medium">{r.branchName}</td>
                <td className="p-4 text-[#77736D] max-w-xs truncate">
                  {r.specialRequests || 'None'}
                </td>
                <td className="p-4">{getStatusBadge(r.status)}</td>
                <td className="p-4 text-right space-x-1.5">
                  {r.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'confirmed')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px]"
                    >
                      Confirm
                    </button>
                  )}
                  {r.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'seated')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px]"
                    >
                      Seat
                    </button>
                  )}
                  {r.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'cancelled')}
                      className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-1 rounded-lg text-[11px]"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
