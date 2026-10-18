import React, { useState, useMemo, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService } from '../services/storage';
import { ProductCard } from '../components/menu/ProductCard';
import { ProductCustomizerModal } from '../components/menu/ProductCustomizerModal';
import { Product, Deal } from '../types';
import {
  Search,
  X,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  MapPin,
  UtensilsCrossed,
  RotateCcw
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const {
    config,
    orderType,
    selectedBranch,
    selectedDeliveryArea,
    openBranchModal,
  } = useRestaurant();

  const categories = StorageService.getCategories().filter((c) => c.active);
  const products = StorageService.getProducts();

  // Read URL query params if any
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'all';
  });

  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [spiceFilter, setSpiceFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'recommended' | 'price-asc' | 'price-desc' | 'name'>('recommended');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Customizer modal state
  const [activeCustomizerProduct, setActiveCustomizerProduct] = useState<Product | null>(null);

  // Sync category or search when window location changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategorySlug(cat);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Availability
      if (!product.isAvailable) return false;

      // 2. Branch restriction if specified
      if (product.branchIds && product.branchIds.length > 0 && selectedBranch) {
        if (!product.branchIds.includes(selectedBranch.id)) return false;
      }

      // 3. Category match
      if (selectedCategorySlug !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategorySlug);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cat = categories.find((c) => c.id === product.categoryId);
        const inName = product.name.toLowerCase().includes(q);
        const inDesc = product.description.toLowerCase().includes(q);
        const inCat = cat ? cat.name.toLowerCase().includes(q) : false;
        if (!inName && !inDesc && !inCat) return false;
      }

      // 5. Dietary filter
      if (dietaryFilter !== 'all') {
        if (!product.dietary.includes(dietaryFilter as any)) return false;
      }

      // 6. Spice filter
      if (spiceFilter !== 'all') {
        const level = parseInt(spiceFilter, 10);
        if (product.spiceLevel !== level) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return 0; // recommended order
    });
  }, [
    products,
    categories,
    selectedCategorySlug,
    searchQuery,
    dietaryFilter,
    spiceFilter,
    sortOption,
    selectedBranch,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategorySlug('all');
    setDietaryFilter('all');
    setSpiceFilter('all');
    setSortOption('recommended');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategorySlug !== 'all' ||
    dietaryFilter !== 'all' ||
    spiceFilter !== 'all' ||
    sortOption !== 'recommended';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Page Header & Location Context Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E2DA]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Handcrafted Flavors
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#25231F] mt-1">
            Order Online Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#77736D] mt-1 max-w-xl">
            Live prices, authentic woks, charcoal grill cuts, and tandoor breads prepared fresh to order.
          </p>
        </div>

        {/* Selected Branch Indicator & Change Trigger */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E8E2DA] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#F5E9E2] flex items-center justify-center text-[#B64E35] shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="text-[#77736D]">
              <strong className="capitalize text-[#B64E35]">{orderType}:</strong>{' '}
              {orderType === 'delivery' && selectedDeliveryArea
                ? selectedDeliveryArea.name
                : selectedBranch?.name}
            </div>
            <div className="text-[11px] text-[#77736D]/80">
              {orderType === 'delivery'
                ? `Fee: Rs. ${selectedDeliveryArea?.deliveryFee || selectedBranch?.deliveryFee} · Min: Rs. ${selectedDeliveryArea?.minOrder || selectedBranch?.minOrder}`
                : `Ready in ~${selectedBranch?.estPickupTimeMinutes}`}
            </div>
          </div>
          <button
            type="button"
            onClick={openBranchModal}
            className="text-xs font-semibold text-[#B64E35] hover:text-[#9B3F28] px-2.5 py-1.5 rounded-lg hover:bg-[#FAF8F4] transition-colors ml-1"
          >
            Change
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, or cooking styles..."
              className="w-full bg-white border border-[#E8E2DA] rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#25231F] placeholder:text-[#77736D]/60 focus:outline-none focus:border-[#B64E35] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77736D] hover:text-[#25231F]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full bg-white border border-[#E8E2DA] rounded-xl px-3.5 py-2.5 text-xs text-[#25231F] font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#B64E35] shadow-2xs"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#77736D] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Toggle Filters Button */}
          <button
            type="button"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs shrink-0 ${
              showFiltersPanel || dietaryFilter !== 'all' || spiceFilter !== 'all'
                ? 'bg-[#B64E35] text-white border-[#B64E35]'
                : 'bg-white text-[#25231F] border-[#E8E2DA] hover:border-[#77736D]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        {showFiltersPanel && (
          <div className="p-4 sm:p-5 bg-white border border-[#E8E2DA] rounded-2xl shadow-xs space-y-4 animate-in slide-in-from-top-1 duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Dietary preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Dietary / Highlights
                </label>
                <select
                  value={dietaryFilter}
                  onChange={(e) => setDietaryFilter(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-xs text-[#25231F] font-medium focus:outline-none focus:border-[#B64E35]"
                >
                  <option value="all">All Specialties</option>
                  <option value="chef-special">Chef's Special</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="halal">100% Halal</option>
                  <option value="vegetarian">Vegetarian</option>
                </select>
              </div>

              {/* Spice Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Spice Level
                </label>
                <select
                  value={spiceFilter}
                  onChange={(e) => setSpiceFilter(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-xs text-[#25231F] font-medium focus:outline-none focus:border-[#B64E35]"
                >
                  <option value="all">All Spice Levels</option>
                  <option value="1">Mild & Delicate</option>
                  <option value="2">Medium Karachi Heat</option>
                  <option value="3">Fiery Red Chillies</option>
                </select>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#77736D] hover:text-[#B64E35] transition-colors py-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sticky/Horizontal Category Bar */}
        <div className="overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategorySlug('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategorySlug === 'all'
                  ? 'bg-[#26231F] text-white shadow-xs'
                  : 'bg-white text-[#77736D] border border-[#E8E2DA] hover:text-[#25231F]'
              }`}
            >
              All Dishes ({products.length})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategorySlug === cat.slug;
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#B64E35] text-white shadow-xs'
                      : 'bg-white text-[#77736D] border border-[#E8E2DA] hover:text-[#25231F]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] opacity-75`}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCustomize={(p) => setActiveCustomizerProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2DA] max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F4] flex items-center justify-center text-[#77736D] mx-auto">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#25231F]">
            No Dishes Found
          </h3>
          <p className="text-xs sm:text-sm text-[#77736D]">
            We couldn't find any items matching your active search or filter selection. Try adjusting your keywords.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Product Customizer Modal */}
      {activeCustomizerProduct && (
        <ProductCustomizerModal
          item={activeCustomizerProduct}
          isDeal={false}
          onClose={() => setActiveCustomizerProduct(null)}
        />
      )}
    </div>
  );
};
