import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface FaqPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ navigateTo }) => {
  const { faqs } = useSalon();
  const [openId, setOpenId] = useState<string>(faqs[0]?.id || 'faq-1');
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="space-y-4 text-center sm:text-left">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Knowledge Base
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#77716C] max-w-xl">
          Everything you need to know about our reservation system, color consultations, bridal prep, and hygiene protocols in Karachi.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716C]" />
        <input
          type="text"
          placeholder="Search questions (e.g. balayage, deposit, cancellation, parking)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#E7E0D8] rounded-md focus:outline-none focus:border-[#26231E]"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E7E0D8] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-semibold text-sm text-[#26231E]">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#77716C] transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-[#77716C] leading-relaxed border-t border-[#FAF8F4] pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-[#F7F4EF] border border-[#E7E0D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-[#26231E] block">Still have a specific inquiry?</span>
          <span className="text-[#77716C]">Our concierge is available on WhatsApp daily.</span>
        </div>
        <button
          onClick={() => navigateTo('contact')}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
        >
          Contact Concierge
        </button>
      </div>
    </div>
  );
};
