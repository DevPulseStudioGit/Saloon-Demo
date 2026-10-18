import React from 'react';
import { MapPin, Phone, Clock, MessageSquare, Shield, Sparkles } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

interface FooterProps {
  navigateTo: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const { settings, categories, branches } = useSalon();

  return (
    <footer className="bg-[#26231E] text-[#F7F4EF] pt-16 pb-12 border-t border-[#3D3730]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3D3730]">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-3xl font-serif-title tracking-tight font-semibold text-white">
              {settings.salonName}
            </h3>
            <p className="text-xs uppercase tracking-widest text-[#C8A96A] font-medium">
              {settings.tagline}
            </p>
            <p className="text-sm text-[#E7E0D8]/80 leading-relaxed max-w-md">
              {settings.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#E7E0D8]/70">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C8A96A]" />
                {settings.openingHoursSummary}
              </span>
            </div>
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#26231E] bg-[#C8A96A] rounded hover:bg-[#D8BA7B] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Concierge
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C8A96A]">
              Treatments
            </h4>
            <ul className="space-y-2 text-sm text-[#E7E0D8]/80">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigateTo('services')}
                    className="hover:text-white transition-colors text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigateTo('pricing')}
                  className="hover:text-white transition-colors text-left text-[#C8A96A]"
                >
                  Price List
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('packages')}
                  className="hover:text-white transition-colors text-left"
                >
                  Bridal Suites & Packages
                </button>
              </li>
            </ul>
          </div>

          {/* Studios / Karachi Branches */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C8A96A]">
              Karachi Studios
            </h4>
            <ul className="space-y-3 text-xs text-[#E7E0D8]/80">
              {branches.map((b) => (
                <li key={b.id} className="space-y-1">
                  <div className="font-semibold text-white">{b.name}</div>
                  <div className="text-white/60 leading-relaxed">{b.address}</div>
                  <div className="text-[#C8A96A]">{b.phone}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care & Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C8A96A]">
              Client Care
            </h4>
            <ul className="space-y-2 text-sm text-[#E7E0D8]/80">
              <li>
                <button
                  onClick={() => navigateTo('booking')}
                  className="hover:text-white transition-colors text-left font-medium text-white"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('my-appointments')}
                  className="hover:text-white transition-colors text-left text-[#E9DADA]"
                >
                  Look Up / Reschedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faqs')}
                  className="hover:text-white transition-colors text-left"
                >
                  Questions & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policies')}
                  className="hover:text-white transition-colors text-left"
                >
                  Booking & Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="hover:text-[#C8A96A] transition-colors text-left flex items-center gap-1.5 pt-2 text-xs font-semibold text-white/90"
                >
                  <Shield className="w-3.5 h-3.5 text-[#C8A96A]" />
                  Staff Portal & Admin
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and agency reusability disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E7E0D8]/60 gap-4">
          <div>
            © {new Date().getFullYear()} {settings.salonName}. All rights reserved. Operating in Karachi, Pakistan.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('policies')} className="hover:text-white">
              Privacy
            </button>
            <span>·</span>
            <button onClick={() => navigateTo('policies')} className="hover:text-white">
              Terms
            </button>
            <span>·</span>
            <span className="text-[#C8A96A]/80">Digital Agency Production Template</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
