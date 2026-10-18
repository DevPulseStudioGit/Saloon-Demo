import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, Check, Scissors, AlertCircle, X } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Service, ServiceAddon } from '../../types';

export const AdminServices: React.FC = () => {
  const { services, categories, staff, createService, updateService, deleteService } = useSalon();

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'hair-craft');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [bufferMinutes, setBufferMinutes] = useState(15);
  const [basePrice, setBasePrice] = useState(5000);
  const [isStartingPrice, setIsStartingPrice] = useState(false);
  const [depositRequired, setDepositRequired] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]);
  const [image, setImage] = useState('/assets/images/service_hair_styling_1792040701711.jpg');

  const filtered = selectedCat === 'all'
    ? services
    : services.filter((s) => s.categoryId === selectedCat);

  const openCreateModal = () => {
    setEditingService(null);
    setName('');
    setCategoryId(categories[0]?.id || 'hair-craft');
    setDescription('');
    setDurationMinutes(60);
    setBufferMinutes(15);
    setBasePrice(5000);
    setIsStartingPrice(false);
    setDepositRequired(false);
    setDepositAmount(0);
    setAssignedStaffIds(staff.map((s) => s.id));
    setImage('/assets/images/service_hair_styling_1792040701711.jpg');
    setModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setCategoryId(s.categoryId);
    setDescription(s.description);
    setDurationMinutes(s.durationMinutes);
    setBufferMinutes(s.bufferMinutes);
    setBasePrice(s.basePrice);
    setIsStartingPrice(s.isStartingPrice);
    setDepositRequired(s.depositRequired);
    setDepositAmount(s.depositAmount);
    setAssignedStaffIds(s.assignedStaffIds);
    setImage(s.image);
    setModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingService) {
      const updated: Service = {
        ...editingService,
        name,
        categoryId,
        description,
        durationMinutes,
        bufferMinutes,
        basePrice,
        isStartingPrice,
        depositRequired,
        depositAmount,
        assignedStaffIds,
        image
      };
      updateService(updated);
    } else {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newSrv: Service = {
        id: `srv-${Date.now()}`,
        name,
        slug,
        categoryId,
        description,
        durationMinutes,
        preparationMinutes: 5,
        bufferMinutes,
        basePrice,
        isStartingPrice,
        depositRequired,
        depositAmount,
        assignedStaffIds,
        branchIds: ['clifton', 'dha'],
        image,
        active: true,
        isOnlineBookable: true,
        addons: []
      };
      createService(newSrv);
    }

    setModalOpen(false);
  };

  const toggleStaffAssignment = (staffId: string) => {
    setAssignedStaffIds((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Services & Pricing Management
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Configure treatments, pricing in PKR, durations, and eligible specialists.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E7E0D8]">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            selectedCat === 'all'
              ? 'bg-[#26231E] text-white'
              : 'bg-white border border-[#E7E0D8] text-[#77716C]'
          }`}
        >
          All Services ({services.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 ${
              selectedCat === c.id
                ? 'bg-[#26231E] text-white'
                : 'bg-white border border-[#E7E0D8] text-[#77716C]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F4] text-[#77716C] border-b border-[#E7E0D8] uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Treatment</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Duration & Buffer</th>
              <th className="py-3 px-4">Base Price</th>
              <th className="py-3 px-4">Assigned Staff</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF8F4]">
            {filtered.map((service) => {
              const cat = categories.find((c) => c.id === service.categoryId);
              return (
                <tr key={service.id} className="hover:bg-[#FAF8F4] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={service.image}
                        alt={service.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover border border-[#E7E0D8] shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-[#26231E]">{service.name}</div>
                        <div className="text-[11px] text-[#77716C] line-clamp-1 max-w-xs">
                          {service.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#77716C]">
                    {cat?.name}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#26231E]">
                      {service.durationMinutes} mins
                    </div>
                    <div className="text-[10px] text-[#77716C]">
                      +{service.bufferMinutes} min buffer
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#26231E]">
                      Rs. {service.basePrice.toLocaleString()}
                    </div>
                    {service.depositRequired && (
                      <span className="text-[10px] text-[#A77A7E] font-medium block">
                        Deposit: Rs. {service.depositAmount.toLocaleString()}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[#77716C]">
                      {service.assignedStaffIds.length} artist{service.assignedStaffIds.length > 1 ? 's' : ''}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() =>
                        updateService({ ...service, active: !service.active })
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        service.active
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {service.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-1.5 text-[#77716C] hover:text-[#26231E] rounded hover:bg-[#FAF8F4]"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete treatment ${service.name}?`)) {
                          deleteService(service.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                      title="Delete Service"
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

      {/* Create / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto border border-[#E7E0D8] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-3">
              <h2 className="text-xl font-serif-title font-semibold text-[#26231E]">
                {editingService ? 'Edit Treatment' : 'Add New Atelier Treatment'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#77716C] hover:text-[#26231E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Treatment Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#26231E]">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#26231E]">Base Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={500}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#26231E]">Treatment Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    min={15}
                    step={15}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#26231E]">Post-Treatment Buffer (Mins)</label>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={bufferMinutes}
                    onChange={(e) => setBufferMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                />
              </div>

              {/* Eligible Artists Assignment */}
              <div className="space-y-1.5 pt-1">
                <label className="font-semibold text-[#26231E] block">
                  Eligible Master Specialists:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {staff.map((st) => {
                    const isAssigned = assignedStaffIds.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleStaffAssignment(st.id)}
                        className={`p-2 rounded border cursor-pointer flex items-center justify-between ${
                          isAssigned ? 'bg-[#F7F4EF] border-[#26231E]' : 'bg-white border-[#E7E0D8]'
                        }`}
                      >
                        <span>{st.name}</span>
                        {isAssigned && <Check className="w-3.5 h-3.5 text-[#A77A7E]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deposit Requirements */}
              <div className="p-3 bg-[#FAF8F4] rounded-xl border border-[#E7E0D8] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#26231E]">
                  <input
                    type="checkbox"
                    checked={depositRequired}
                    onChange={(e) => setDepositRequired(e.target.checked)}
                    className="rounded border-[#E7E0D8]"
                  />
                  <span>Require advance deposit for this treatment</span>
                </label>
                {depositRequired && (
                  <div className="space-y-1 pt-1">
                    <label className="text-[#77716C]">Deposit Amount (PKR)</label>
                    <input
                      type="number"
                      min={0}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-[#E7E0D8] rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E0D8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#77716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
                >
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
