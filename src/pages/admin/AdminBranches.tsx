import React, { useState } from 'react';
import { MapPin, Phone, Clock, Edit2, Check, X } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Branch } from '../../types';

export const AdminBranches: React.FC = () => {
  const { branches, updateBranch } = useSalon();
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');

  const openEdit = (b: Branch) => {
    setEditingBranch(b);
    setName(b.name);
    setAddress(b.address);
    setPhone(b.phone);
    setHours(b.hours);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    updateBranch({
      ...editingBranch,
      name,
      address,
      phone,
      hours
    });
    setEditingBranch(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
          Karachi Studio Branches
        </h1>
        <p className="text-xs text-[#77716C] pt-0.5">
          Manage operational locations, studio contact details, and open hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div
            key={b.id}
            className="p-6 rounded-2xl bg-white border border-[#E7E0D8] shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif-title font-semibold text-[#26231E]">
                  {b.name}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    b.active ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {b.active ? 'Operational' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#77716C]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#A77A7E] shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#A77A7E] shrink-0" />
                  <span className="font-semibold text-[#26231E]">{b.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#A77A7E] shrink-0" />
                  <span>{b.hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E0D8] flex justify-end">
              <button
                onClick={() => openEdit(b)}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#26231E] border border-[#E7E0D8] rounded hover:border-[#26231E] flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Branch Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
              <h3 className="text-base font-serif-title font-semibold text-[#26231E]">
                Edit Branch — {editingBranch.name}
              </h3>
              <button onClick={() => setEditingBranch(null)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Studio Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Physical Address</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Reception Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Operating Hours</label>
                <input
                  type="text"
                  required
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-3 py-1.5 text-xs text-[#77716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs uppercase font-semibold text-white bg-[#26231E] rounded"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
