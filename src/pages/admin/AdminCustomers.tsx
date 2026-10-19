import React, { useEffect, useState } from 'react';
import { Search, User, Phone, Mail, Calendar, DollarSign, Edit2, Check, X } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { CustomerRecord } from '../../types';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>(StorageService.getCustomers());
  const [search, setSearch] = useState('');
  const [editingCust, setEditingCust] = useState<CustomerRecord | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');

  useEffect(() => {
    const refreshCustomers = () => setCustomers(StorageService.getCustomers());
    window.addEventListener('luma_data_updated', refreshCustomers);
    return () => window.removeEventListener('luma_data_updated', refreshCustomers);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (c: CustomerRecord) => {
    setEditingCust(c);
    setNotesInput(c.preferences || '');
    setAllergiesInput(c.allergiesOrSensitivities || '');
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCust) return;

    const updated = customers.map((c) =>
      c.id === editingCust.id
        ? { ...c, preferences: notesInput, allergiesOrSensitivities: allergiesInput }
        : c
    );
    setCustomers(updated);
    StorageService.saveCustomers(updated);
    setEditingCust(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Client Database & CRM
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Client visit histories, cumulative treatment spend, and personal preferences.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716C]" />
          <input
            type="text"
            placeholder="Search client name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E7E0D8] rounded focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F4] text-[#77716C] border-b border-[#E7E0D8] uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Contact Phone</th>
              <th className="py-3 px-4">Total Visits</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-4">Last Appointment</th>
              <th className="py-3 px-4">Notes & Sensitivities</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF8F4]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#FAF8F4] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#26231E]">{c.name}</div>
                  <div className="text-[11px] text-[#77716C]">{c.email || 'No email'}</div>
                </td>

                <td className="py-3.5 px-4 font-mono text-[#26231E]">
                  {c.phone}
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-semibold bg-[#F7F4EF] px-2 py-0.5 rounded text-[#26231E]">
                    {c.totalVisits} visit{c.totalVisits > 1 ? 's' : ''}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-bold text-[#26231E]">
                  Rs. {c.totalSpend.toLocaleString()}
                </td>

                <td className="py-3.5 px-4 text-[#77716C]">
                  {c.lastVisit || 'N/A'}
                </td>

                <td className="py-3.5 px-4 max-w-xs">
                  {c.allergiesOrSensitivities && (
                    <div className="text-[10px] text-red-700 font-semibold truncate">
                      ⚠️ {c.allergiesOrSensitivities}
                    </div>
                  )}
                  <div className="text-[11px] text-[#77716C] truncate">
                    {c.preferences || 'No special notes recorded.'}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 text-[#77716C] hover:text-[#26231E] rounded hover:bg-[#FAF8F4]"
                    title="Edit Notes"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCust && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-2">
              <h3 className="text-base font-serif-title font-semibold text-[#26231E]">
                Client Notes — {editingCust.name}
              </h3>
              <button onClick={() => setEditingCust(null)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Allergies & Sensitivities</label>
                <input
                  type="text"
                  placeholder="e.g. Bleach sensitivity, eucalyptus oil allergy..."
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Styling & Service Preferences</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prefers ash blonde, likes herbal tea..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCust(null)}
                  className="px-3 py-1.5 text-xs text-[#77716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs uppercase font-semibold text-white bg-[#26231E] rounded"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
