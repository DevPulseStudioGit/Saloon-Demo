import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Deal } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { Plus, Edit3, Trash2, X, Tag } from 'lucide-react';

export const AdminDeals: React.FC = () => {
  const { showToast } = useRestaurant();
  const [deals, setDeals] = useState<Deal[]>(() => StorageService.getDeals());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(2500);
  const [originalPrice, setOriginalPrice] = useState(3000);
  const [image, setImage] = useState('');
  const [includedSummary, setIncludedSummary] = useState('');
  const [badge, setBadge] = useState('Family Special');
  const [isAvailable, setIsAvailable] = useState(true);

  const refresh = () => setDeals(StorageService.getDeals());

  const handleOpenAdd = () => {
    setEditingDeal(null);
    setName('');
    setDescription('');
    setPrice(2800);
    setOriginalPrice(3400);
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
    setIncludedSummary('1 Shinwari Mutton Karahi\n1 Chicken Dum Biryani\n2 Roghani Naans\n2 Karak Chais');
    setBadge('Special Deal');
    setIsAvailable(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setName(deal.name);
    setDescription(deal.description);
    setPrice(deal.price);
    setOriginalPrice(deal.originalPrice);
    setImage(deal.image);
    setIncludedSummary(deal.includedItemsSummary.join('\n'));
    setBadge(deal.badge || '');
    setIsAvailable(deal.isAvailable);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, dealName: string) => {
    if (confirm(`Delete deal "${dealName}"?`)) {
      StorageService.deleteDeal(id);
      refresh();
      showToast(`Deleted "${dealName}".`, 'info');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const items = includedSummary
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newDeal: Deal = {
      id: editingDeal ? editingDeal.id : `deal-${Date.now()}`,
      slug: editingDeal ? editingDeal.slug : slug,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: Number(originalPrice),
      image: image.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      includedItemsSummary: items,
      badge: badge.trim() || undefined,
      isAvailable,
      optionGroups: editingDeal?.optionGroups,
    };

    StorageService.saveDeal(newDeal);
    refresh();
    setIsModalOpen(false);
    showToast(`Saved deal "${newDeal.name}".`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Promotions & Combos
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
            Deals Management ({deals.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deal Combo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-3xl border border-[#E8E2DA] p-5 space-y-4 flex flex-col justify-between shadow-2xs"
          >
            <div className="space-y-3">
              <div className="relative h-40 rounded-xl overflow-hidden bg-[#FAF8F4]">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                {deal.badge && (
                  <span className="absolute top-2 left-2 bg-[#B64E35] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {deal.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-[#25231F]">{deal.name}</h3>
                <p className="text-xs text-[#77736D] line-clamp-2 mt-0.5">{deal.description}</p>
              </div>

              <div className="space-y-1 text-xs text-[#77736D]">
                <span className="text-[10px] font-semibold uppercase text-[#B64E35] block">Included Items:</span>
                {deal.includedItemsSummary.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 truncate">
                    <span className="w-1 h-1 rounded-full bg-[#B64E35]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#FAF8F4] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#25231F]">Rs. {deal.price.toLocaleString()}</span>
                {deal.originalPrice > deal.price && (
                  <span className="text-[11px] text-[#77736D] line-through ml-2">
                    Rs. {deal.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(deal)}
                  className="p-1.5 text-[#77736D] hover:text-[#25231F] rounded-lg"
                  title="Edit deal"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(deal.id, deal.name)}
                  className="p-1.5 text-[#77736D] hover:text-rose-600 rounded-lg"
                  title="Delete deal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2DA]">
              <h3 className="font-serif font-bold text-xl text-[#25231F]">
                {editingDeal ? 'Edit Deal' : 'Add New Combo Deal'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#77736D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Deal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase block">Combo Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase block">Original Value (PKR)</label>
                  <input
                    type="number"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Badge (e.g. Save Rs. 500)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-2.5 text-[#25231F] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">
                  Included Dishes (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={includedSummary}
                  onChange={(e) => setIncludedSummary(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-2.5 text-[#25231F] font-mono text-xs"
                />
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
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
