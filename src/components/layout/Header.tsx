import React, { useState } from 'react';
import { Menu, X, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

interface HeaderProps {
  currentRoute: string;
  navigateTo: (route: string) => void;
  onOpenLocationPicker: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigateTo, onOpenLocationPicker }) => {
  const { settings, selectedBranchId, branches, setSelectedBranchId } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Services', route: 'services' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'Team', route: 'team' },
    { label: 'Gallery', route: 'gallery' },
    { label: 'About', route: 'about' }
  ];

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EF]/95 backdrop-blur-md border-b border-[#E7E0D8]">
      {/* Subtle top announcement bar */}
      <div className="bg-[#26231E] text-[#F7F4EF] text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs tracking-wide">
            <span className="font-medium text-[#C8A96A]">Karachi Atelier:</span>
            <span className="hidden sm:inline">Clifton Flagship & DHA Studio</span>
            <span className="text-[#C8A96A]/60">·</span>
            <span>WhatsApp Concierge: {settings.whatsapp}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Branch Quick Switcher */}
            {settings.features.branchSelection && branches.length > 1 && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-[#E9DADA]">
                <span className="text-white/60">Branch:</span>
                <button
                  type="button"
                  onClick={onOpenLocationPicker}
                  className="inline-flex items-center gap-1 border-b border-white/30 py-0.5 font-medium text-white transition-colors hover:border-[#C8A96A] hover:text-[#C8A96A]"
                >
                  <MapPin className="h-3 w-3 text-[#C8A96A]" />
                  {branches.find((branch) => branch.id === selectedBranchId)?.area || 'Choose studio'}
                </button>
              </div>
            )}

            <button
              onClick={() => navigateTo('my-appointments')}
              className="text-white/80 hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>My Booking</span>
            </button>

            <button
              onClick={() => navigateTo('admin')}
              className="text-[#C8A96A] hover:text-[#E9DADA] transition-colors flex items-center gap-1 font-medium whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff / Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-4">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="text-2xl sm:text-3xl font-serif-title font-semibold tracking-tight text-[#26231E] group-hover:text-[#A77A7E] transition-colors">
            {settings.salonName}
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#77716C]">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 hover:text-[#26231E] ${
                  isActive ? 'text-[#26231E] font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="nav-active-indicator absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#A77A7E]" />
                )}
              </button>
            );
          })}
          {settings.features.packages && (
            <button
              onClick={() => handleNavClick('packages')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 hover:text-[#26231E] ${
                currentRoute === 'packages' ? 'text-[#26231E] font-semibold' : ''
              }`}
            >
              Packages
            </button>
          )}
          {settings.features.retailProducts && (
            <button
              onClick={() => handleNavClick('shop')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 hover:text-[#26231E] ${
                currentRoute === 'shop' ? 'text-[#26231E] font-semibold' : ''
              }`}
            >
              Apothecary
            </button>
          )}
          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 hover:text-[#26231E] ${
              currentRoute === 'contact' ? 'text-[#26231E] font-semibold' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('booking')}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Book an Appointment
          </button>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('booking')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#26231E] rounded"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#26231E] hover:text-[#A77A7E] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="motion-menu-in md:hidden border-t border-[#E7E0D8] bg-[#F7F4EF] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 text-base font-medium text-[#26231E]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLocationPicker();
              }}
              className="flex items-center gap-2 border-b border-[#E7E0D8] pb-4 text-left text-sm font-semibold text-[#A77A7E]"
            >
              <MapPin className="h-4 w-4" />
              Change studio location
            </button>
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-1 hover:text-[#A77A7E]"
            >
              Home
            </button>
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className="text-left py-1 hover:text-[#A77A7E]"
              >
                {link.label}
              </button>
            ))}
            {settings.features.packages && (
              <button
                onClick={() => handleNavClick('packages')}
                className="text-left py-1 hover:text-[#A77A7E]"
              >
                Packages & Offers
              </button>
            )}
            {settings.features.retailProducts && (
              <button
                onClick={() => handleNavClick('shop')}
                className="text-left py-1 hover:text-[#A77A7E]"
              >
                Apothecary & Products
              </button>
            )}
            {settings.features.giftCards && (
              <button
                onClick={() => handleNavClick('gift-cards')}
                className="text-left py-1 hover:text-[#A77A7E]"
              >
                Gift Cards
              </button>
            )}
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-1 hover:text-[#A77A7E]"
            >
              Contact & Studios
            </button>
            <button
              onClick={() => handleNavClick('my-appointments')}
              className="text-left py-1 text-[#A77A7E] font-semibold"
            >
              Look Up My Booking
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left py-1 text-[#C8A96A] font-semibold"
            >
              Staff & Salon Admin
            </button>
          </div>

          <div className="pt-4 border-t border-[#E7E0D8]">
            <button
              onClick={() => handleNavClick('booking')}
              className="w-full py-3 text-center text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md shadow"
            >
              Book an Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
