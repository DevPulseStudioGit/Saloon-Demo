import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Category } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { Plus, Edit3, Trash2, Check, X } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { showToast } = useRestaurant();
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [active, setActive] = useState(true);

  const refresh = () => setCategories(StorageService.getCategories());

  const handleOpenAdd = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setDisplayOrder(categories.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setDisplayOrder(cat.displayOrder);
    setActive(cat.active);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Delete category "${catName}"?`)) {
      StorageService.deleteCategory(id);
      refresh();
      showToast(`Deleted "${catName}".`, 'info');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      id: editingCat ? editingCat.id : `cat-${Date.now()}`,
      slug: editingCat ? editingCat.slug : slug,
      name: name.trim(),
      description: description.trim() || undefined,
      displayOrder: Number(displayOrder),
      active,
    };
    StorageService.saveCategory(newCat);
    refresh();
    setIsModalOpen(false);
    showToast(`Saved category "${newCat.name}".`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Taxonomy
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
            Category Management ({categories.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-[#E8E2DA] p-5 space-y-3 flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#77736D] uppercase">
                  Order: #{cat.displayOrder}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    cat.active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {cat.active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#25231F] mt-1">
                {cat.name}
              </h3>
              <p className="text-xs text-[#77736D] line-clamp-2 mt-1">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#FAF8F4] flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 text-[#77736D] hover:text-[#25231F] rounded-lg hover:bg-[#FAF8F4]"
                title="Edit category"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 text-[#77736D] hover:text-rose-600 rounded-lg hover:bg-rose-50"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E8E2DA] p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2DA]">
              <h3 className="font-serif font-bold text-xl text-[#25231F]">
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#77736D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-2.5 text-[#25231F] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase block">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-[#B64E35]"
                />
                <label htmlFor="cat-active" className="text-xs text-[#25231F]">
                  Active in menu navigation
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
