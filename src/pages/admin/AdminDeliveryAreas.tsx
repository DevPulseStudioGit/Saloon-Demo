import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { DeliveryArea, Branch } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { Plus, Edit3, Trash2, X, MapPin, Truck } from 'lucide-react';

export const AdminDeliveryAreas: React.FC = () => {
  const { showToast } = useRestaurant();
  const [areas, setAreas] = useState<DeliveryArea[]>(() => StorageService.getDeliveryAreas());
  const branches = StorageService.getBranches();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<DeliveryArea | null>(null);

  const [name, setName] = useState('');
  const [assignedBranchId, setAssignedBranchId] = useState(branches[0]?.id || '');
  const [deliveryFee, setDeliveryFee] = useState(150);
  const [minOrder, setMinOrder] = useState(800);
  const [estMinutes, setEstMinutes] = useState('35 - 45 mins');
  const [active, setActive] = useState(true);

  const refresh = () => setAreas(StorageService.getDeliveryAreas());

  const handleOpenAdd = () => {
    setEditingArea(null);
    setName('');
    setAssignedBranchId(branches[0]?.id || '');
    setDeliveryFee(150);
    setMinOrder(800);
    setEstMinutes('35 - 45 mins');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: DeliveryArea) => {
    setEditingArea(a);
    setName(a.name);
    setAssignedBranchId(a.assignedBranchId);
    setDeliveryFee(a.deliveryFee);
    setMinOrder(a.minOrder);
    setEstMinutes(a.estMinutes);
    setActive(a.active);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, areaName: string) => {
    if (confirm(`Delete delivery zone "${areaName}"?`)) {
      StorageService.deleteDeliveryArea(id);
      refresh();
      showToast(`Deleted zone "${areaName}".`, 'info');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newArea: DeliveryArea = {
      id: editingArea ? editingArea.id : `area-${Date.now()}`,
      name: name.trim(),
      city: 'Karachi',
      assignedBranchId,
      deliveryFee: Number(deliveryFee),
      minOrder: Number(minOrder),
      estMinutes: estMinutes.trim(),
      active,
    };
    StorageService.saveDeliveryArea(newArea);
    refresh();
    setIsModalOpen(false);
    showToast(`Saved area "${newArea.name}".`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Karachi Neighborhoods
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
            Delivery Areas Management ({areas.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Delivery Zone</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E2DA] overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF8F4] border-b border-[#E8E2DA] text-[#77736D] uppercase tracking-wider font-semibold">
              <th className="p-4">Neighborhood Zone</th>
              <th className="p-4">Assigned Kitchen Branch</th>
              <th className="p-4">Delivery Fee</th>
              <th className="p-4">Min. Order</th>
              <th className="p-4">Est. Delivery Time</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF8F4]">
            {areas.map((a) => {
              const branch = branches.find((b) => b.id === a.assignedBranchId);
              return (
                <tr key={a.id} className="hover:bg-[#FAF8F4]/50 transition-colors">
                  <td className="p-4 font-bold text-sm text-[#25231F]">{a.name}</td>
                  <td className="p-4 font-medium text-[#25231F]">{branch?.name || a.assignedBranchId}</td>
                  <td className="p-4 font-bold text-[#25231F]">Rs. {a.deliveryFee}</td>
                  <td className="p-4 text-[#77736D]">Rs. {a.minOrder}</td>
                  <td className="p-4 text-[#77736D]">{a.estMinutes}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        a.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {a.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(a)}
                      className="p-1.5 text-[#77736D] hover:text-[#25231F] rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.name)}
                      className="p-1.5 text-[#77736D] hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E2DA]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2DA]">
              <h3 className="font-serif font-bold text-xl text-[#25231F]">
                {editingArea ? 'Edit Delivery Zone' : 'Add Delivery Zone'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#77736D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Neighborhood Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. DHA Phase 1-8"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Assigned Serving Branch</label>
                <select
                  value={assignedBranchId}
                  onChange={(e) => setAssignedBranchId(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.area})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase block">Fee (PKR)</label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase block">Min. Order (PKR)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Estimated Minutes</label>
                <input
                  type="text"
                  value={estMinutes}
                  onChange={(e) => setEstMinutes(e.target.value)}
                  placeholder="30 - 45 mins"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="a-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-[#B64E35]"
                />
                <label htmlFor="a-active" className="text-xs text-[#25231F]">
                  Zone active for delivery
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E2DA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#77736D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#B64E35] text-white text-xs font-semibold px-5 py-2 rounded-xl"
                >
                  Save Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
