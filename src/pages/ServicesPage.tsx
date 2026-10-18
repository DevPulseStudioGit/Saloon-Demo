import React, { useState } from 'react';
import { Search, Clock, Plus, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface ServicesPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigateTo }) => {
  const { categories, services, updateBookingDraft } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = services.filter((service) => {
    if (!service.active) return false;
    const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (serviceId: string) => {
    updateBookingDraft({ serviceIds: [serviceId] });
    navigateTo('booking');
  };

  const handleViewDetails = (serviceId: string) => {
    navigateTo('service-detail', serviceId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Treatment Catalogue
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Artisanal Services & Rituals
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          Every service is meticulously tailored to your unique hair texture, facial architecture, and skin physiology using European clinical methodologies in Karachi.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-[#E7E0D8]">
        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#26231E] text-white shadow-xs'
                : 'bg-white border border-[#E7E0D8] text-[#77716C] hover:text-[#26231E]'
            }`}
          >
            All Services ({services.filter((s) => s.active).length})
          </button>
          {categories.map((cat) => {
            const count = services.filter((s) => s.categoryId === cat.id && s.active).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#26231E] text-white shadow-xs'
                    : 'bg-white border border-[#E7E0D8] text-[#77716C] hover:text-[#26231E]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716C]" />
          <input
            type="text"
            placeholder="Search treatments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E7E0D8] rounded-md focus:outline-none focus:border-[#26231E] transition-colors"
          />
        </div>
      </div>

      {/* Service Cards Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-[#E7E0D8] p-8 space-y-3">
          <p className="text-base font-semibold text-[#26231E]">No treatments match your selection.</p>
          <p className="text-xs text-[#77716C]">Try selecting "All Services" or clearing your search query.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#26231E] rounded"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const category = categories.find((c) => c.id === service.categoryId);

            return (
              <div
                key={service.id}
                className="bg-white rounded-xl overflow-hidden border border-[#E7E0D8] hover:border-[#A77A7E]/50 transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div
                    onClick={() => handleViewDetails(service.id)}
                    className="aspect-[16/10] overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-medium text-[#26231E] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A77A7E]" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                    {service.depositRequired && (
                      <div className="absolute top-3 right-3 bg-[#26231E]/90 text-[#C8A96A] px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                        Deposit Required
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-[#A77A7E]">
                      {category?.name}
                    </div>

                    <h3
                      onClick={() => handleViewDetails(service.id)}
                      className="text-xl font-serif-title font-semibold text-[#26231E] hover:text-[#A77A7E] transition-colors cursor-pointer"
                    >
                      {service.name}
                    </h3>

                    <p className="text-xs text-[#77716C] leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    {/* Add-ons notice if any */}
                    {service.addons && service.addons.length > 0 && (
                      <div className="pt-2 flex items-center gap-1 text-[11px] text-[#77716C]">
                        <Sparkles className="w-3 h-3 text-[#C8A96A]" />
                        <span>{service.addons.length} customizable add-on{service.addons.length > 1 ? 's' : ''} available</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#F7F4EF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#77716C] block">
                      Treatment Investment
                    </span>
                    <span className="font-serif-title font-bold text-lg text-[#26231E]">
                      {service.isStartingPrice ? 'From ' : ''}Rs. {service.basePrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(service.id)}
                      className="px-3 py-2 text-xs font-semibold text-[#77716C] hover:text-[#26231E] transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleBookService(service.id)}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#26231E] rounded hover:bg-[#3D3730] transition-colors shadow-xs"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
