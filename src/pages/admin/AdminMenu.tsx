import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Product, Category, DietaryTag } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { Plus, Edit3, Trash2, Check, X, Search, Flame, Image as ImageIcon } from 'lucide-react';

export const AdminMenu: React.FC = () => {
  const { showToast } = useRestaurant();
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const categories = StorageService.getCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || '');
  const [formPrice, setFormPrice] = useState(1500);
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPortion, setFormPortion] = useState('Serves 2');
  const [formSpiceLevel, setFormSpiceLevel] = useState<number>(1);
  const [formDietary, setFormDietary] = useState<DietaryTag[]>(['halal']);
  const [formIsAvailable, setFormIsAvailable] = useState(true);

  const refreshProducts = () => {
    setProducts(StorageService.getProducts());
  };

  const handleToggleAvailable = (product: Product) => {
    const updated = { ...product, isAvailable: !product.isAvailable };
    StorageService.saveProduct(updated);
    refreshProducts();
    showToast(`"${product.name}" marked as ${updated.isAvailable ? 'available' : 'sold out'}.`, 'info');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      StorageService.deleteProduct(id);
      refreshProducts();
      showToast(`Deleted "${name}".`, 'info');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || '');
    setFormPrice(1200);
    setFormImage('https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80');
    setFormDescription('');
    setFormPortion('Standard Portion');
    setFormSpiceLevel(2);
    setFormDietary(['halal']);
    setFormIsAvailable(true);
    setIsAddModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategoryId(prod.categoryId);
    setFormPrice(prod.price);
    setFormImage(prod.image);
    setFormDescription(prod.description);
    setFormPortion(prod.portionSize || '');
    setFormSpiceLevel(prod.spiceLevel !== undefined ? prod.spiceLevel : 1);
    setFormDietary(prod.dietary || ['halal']);
    setFormIsAvailable(prod.isAvailable);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = editingProduct ? editingProduct.id : `prod-${Date.now()}`;

    const newProduct: Product = {
      id,
      slug: editingProduct ? editingProduct.slug : slug,
      name: formName.trim(),
      categoryId: formCategoryId,
      price: Number(formPrice),
      image: formImage.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      description: formDescription.trim(),
      portionSize: formPortion.trim(),
      spiceLevel: formSpiceLevel as any,
      dietary: formDietary,
      isAvailable: formIsAvailable,
      optionGroups: editingProduct?.optionGroups,
    };

    StorageService.saveProduct(newProduct);
    refreshProducts();
    setIsAddModalOpen(false);
    showToast(`Saved "${newProduct.name}".`, 'success');
  };

  const toggleDietary = (tag: DietaryTag) => {
    setFormDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = products.filter((p) => {
    if (selectedCatId !== 'all' && p.categoryId !== selectedCatId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Culinary Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
            Menu Management ({products.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full bg-white border border-[#E8E2DA] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35] shadow-2xs"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="w-full bg-white border border-[#E8E2DA] rounded-xl px-3 py-2 text-xs text-[#25231F] font-medium focus:outline-none focus:border-[#B64E35] shadow-2xs"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const cat = categories.find((c) => c.id === product.categoryId);

          return (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border p-4 flex flex-col justify-between transition-all shadow-2xs ${
                product.isAvailable ? 'border-[#E8E2DA]' : 'border-rose-200 bg-rose-50/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-18 h-18 rounded-xl object-cover shrink-0 bg-[#FAF8F4]"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-[#B64E35] uppercase tracking-wider block truncate">
                    {cat?.name || 'Category'}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#25231F] truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#77736D] line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#FAF8F4] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#77736D] block">Price</span>
                  <span className="font-bold text-sm text-[#25231F]">
                    Rs. {product.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(product)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      product.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                  >
                    {product.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>

                  <button
                    onClick={() => openEditModal(product)}
                    className="p-1.5 text-[#77736D] hover:text-[#25231F] rounded-lg hover:bg-[#FAF8F4]"
                    title="Edit dish"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-1.5 text-[#77736D] hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Delete dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E8E2DA] flex flex-col max-h-[92vh]">
            <div className="p-6 border-b border-[#E8E2DA] flex items-center justify-between">
              <h3 className="font-serif font-black text-xl text-[#25231F]">
                {editingProduct ? 'Edit Menu Dish' : 'Add New Menu Dish'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#77736D] hover:text-[#25231F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Dish Name <span className="text-[#B64E35]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Peshawari Shinwari Mutton Karahi"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                    Category <span className="text-[#B64E35]">*</span>
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                    Price in PKR <span className="text-[#B64E35]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Appetizing description of ingredients and preparation..."
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-2.5 text-[#25231F] focus:outline-none focus:border-[#B64E35] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                    Portion Size Indicator
                  </label>
                  <input
                    type="text"
                    value={formPortion}
                    onChange={(e) => setFormPortion(e.target.value)}
                    placeholder="e.g. Serves 2, 4 Pieces, Single Plate"
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                    Spice Level
                  </label>
                  <select
                    value={formSpiceLevel}
                    onChange={(e) => setFormSpiceLevel(Number(e.target.value))}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                  >
                    <option value={0}>0 - No Spice</option>
                    <option value={1}>1 - Mild & Delicate</option>
                    <option value={2}>2 - Medium Karachi Heat</option>
                    <option value={3}>3 - Fiery Chillies</option>
                  </select>
                </div>
              </div>

              {/* Dietary Tags Checkboxes */}
              <div className="space-y-1.5 pt-2 border-t border-[#FAF8F4]">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Dietary & Highlighting Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['halal', 'chef-special', 'bestseller', 'vegetarian', 'spicy'] as DietaryTag[]).map((tag) => {
                    const isChecked = formDietary.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleDietary(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                          isChecked
                            ? 'bg-[#B64E35] text-white'
                            : 'bg-[#FAF8F4] text-[#77736D] border border-[#E8E2DA]'
                        }`}
                      >
                        {tag.replace(/-/g, ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="avail-check"
                  checked={formIsAvailable}
                  onChange={(e) => setFormIsAvailable(e.target.checked)}
                  className="rounded text-[#B64E35] focus:ring-[#B64E35] w-4 h-4"
                />
                <label htmlFor="avail-check" className="text-xs font-medium text-[#25231F] cursor-pointer">
                  In Stock & Available for Ordering
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8E2DA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#77736D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#B64E35] hover:bg-[#9B3F28] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
