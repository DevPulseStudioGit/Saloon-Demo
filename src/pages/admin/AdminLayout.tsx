import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Scissors,
  Users,
  MapPin,
  Sparkles,
  ShoppingBag,
  Gift,
  Settings,
  FileText,
  LogOut,
  ChevronRight,
  Shield,
  UserCheck,
  ExternalLink,
  RotateCcw,
  Bell
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSalon } from '../../context/SalonContext';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  navigateToPublic: (route: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  navigateToPublic,
  children
}) => {
  const { currentUser, switchDemoRole, logout } = useAdminAuth();
  const { settings, appointments, resetAllData } = useSalon();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [newBookingNotice, setNewBookingNotice] = useState<string | null>(null);
  const knownAppointmentIds = useRef<Set<string> | null>(null);

  const role = currentUser?.role || 'owner';
  const isStylist = role === 'stylist';

  useEffect(() => {
    const appointmentIds = new Set(appointments.map((appointment) => appointment.id));
    if (knownAppointmentIds.current) {
      const newAppointment = appointments.find(
        (appointment) => !knownAppointmentIds.current?.has(appointment.id)
      );
      if (newAppointment) {
        setNewBookingNotice(`New booking received: ${newAppointment.reference}`);
      }
    }
    knownAppointmentIds.current = appointmentIds;
  }, [appointments]);

  // Navigation items based on role
  const navItems = isStylist
    ? [
        { id: 'stylist-portal', label: 'My Calendar & Clients', icon: Calendar },
        { id: 'appointments', label: 'All Salon Bookings', icon: Clock },
        { id: 'services', label: 'Services Catalogue', icon: Scissors }
      ]
    : role === 'receptionist'
    ? [
        { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
        { id: 'appointments', label: 'Appointments Manager', icon: Clock },
        { id: 'calendar', label: 'Schedule Calendar', icon: Calendar },
        { id: 'services', label: 'Services Catalogue', icon: Scissors },
        { id: 'customers', label: 'Client CRM', icon: UserCheck },
        { id: 'audit-log', label: 'Audit Trail', icon: FileText }
      ]
    : [
        { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
        { id: 'appointments', label: 'Appointments Manager', icon: Clock },
        { id: 'calendar', label: 'Schedule Calendar', icon: Calendar },
        { id: 'services', label: 'Services & Pricing', icon: Scissors },
        { id: 'staff', label: 'Stylists & Shifts', icon: Users },
        { id: 'customers', label: 'Client CRM', icon: UserCheck },
        { id: 'branches', label: 'Karachi Branches', icon: MapPin },
        { id: 'packages', label: 'Packages & Offers', icon: Sparkles },
        { id: 'products', label: 'Retail Inventory', icon: ShoppingBag },
        { id: 'gift-cards', label: 'Gift Vouchers', icon: Gift },
        { id: 'settings', label: 'Salon Settings & Brand', icon: Settings },
        { id: 'audit-log', label: 'Audit Trail', icon: FileText }
      ];

  const handleResetData = () => {
    resetAllData();
    setResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#F0ECE1] flex flex-col md:flex-row text-[#26231E]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#26231E] text-[#F7F4EF] p-5 flex flex-col justify-between shrink-0 border-r border-[#3D3730]">
        <div className="space-y-6">
          {/* Logo & Subtitle */}
          <div>
            <div className="text-xl font-serif-title font-semibold tracking-tight text-white flex items-center gap-2">
              <span>{settings.salonName}</span>
              <span className="text-[10px] bg-[#C8A96A] text-[#26231E] font-bold px-1.5 py-0.5 rounded uppercase">
                Studio OS
              </span>
            </div>
            <div className="text-[11px] text-[#C8A96A] pt-1">
              Karachi Management Platform
            </div>
          </div>

          {/* Current User Badge */}
          <div className="p-3 rounded-xl bg-[#332E27] border border-[#443E36] flex items-center justify-between">
            <div className="text-xs space-y-0.5">
              <div className="font-semibold text-white">{currentUser?.name}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#C8A96A]">
                Role: {currentUser?.role}
              </div>
            </div>
            <Shield className="w-4 h-4 text-[#C8A96A]" />
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C8A96A] text-[#26231E] font-semibold shadow-xs'
                      : 'text-[#E7E0D8]/80 hover:bg-[#332E27] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-[#3D3730] space-y-2 text-xs">
          <button
            onClick={() => navigateToPublic('home')}
            className="w-full py-2 px-3 rounded text-left text-white/70 hover:text-white hover:bg-[#332E27] transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Public Salon Website</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2 px-3 rounded text-left text-red-400 hover:text-red-300 hover:bg-[#332E27] transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Bar with Role Switcher & Karachi Time */}
        <header className="bg-white border-b border-[#E7E0D8] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
          {newBookingNotice && (
            <div className="fixed right-6 top-20 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900 shadow-lg">
              <Bell className="h-4 w-4 text-emerald-700" />
              <span className="font-semibold">{newBookingNotice}</span>
              <button
                type="button"
                onClick={() => setNewBookingNotice(null)}
                className="text-emerald-700 hover:text-emerald-950"
                aria-label="Dismiss new booking notification"
              >
                ×
              </button>
            </div>
          )}
          {/* Quick Demo Persona Switcher */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#77716C] font-medium hidden sm:inline">Active Persona:</span>
            <button
              onClick={() => switchDemoRole('owner')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                role === 'owner'
                  ? 'bg-[#26231E] text-white'
                  : 'bg-[#F7F4EF] text-[#77716C] hover:text-[#26231E] border border-[#E7E0D8]'
              }`}
            >
              Owner (Amna)
            </button>
            <button
              onClick={() => switchDemoRole('receptionist')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                role === 'receptionist'
                  ? 'bg-[#26231E] text-white'
                  : 'bg-[#F7F4EF] text-[#77716C] hover:text-[#26231E] border border-[#E7E0D8]'
              }`}
            >
              Receptionist (Sana)
            </button>
            <button
              onClick={() => switchDemoRole('stylist', 'ayla@lumaatelier.com')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                role === 'stylist' && currentUser?.stylistId === 'staff-ayla'
                  ? 'bg-[#26231E] text-white'
                  : 'bg-[#F7F4EF] text-[#77716C] hover:text-[#26231E] border border-[#E7E0D8]'
              }`}
            >
              Stylist (Ayla Merchant)
            </button>
            <button
              onClick={() => switchDemoRole('stylist', 'zara@lumaatelier.com')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                role === 'stylist' && currentUser?.stylistId === 'staff-zara'
                  ? 'bg-[#26231E] text-white'
                  : 'bg-[#F7F4EF] text-[#77716C] hover:text-[#26231E] border border-[#E7E0D8]'
              }`}
            >
              Skin Specialist (Zara)
            </button>
          </div>

          {/* Quick Actions & Reset */}
          <div className="flex items-center gap-3 text-xs">
            {role === 'owner' && (resetConfirm ? (
              <div className="flex items-center gap-1.5">
                <span className="text-red-700 font-semibold text-[11px]">Reset all demo data?</span>
                <button
                  onClick={handleResetData}
                  className="px-2 py-0.5 bg-red-600 text-white rounded text-[11px] font-bold"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                title="Reset sample salon data to original seed"
                className="text-[11px] text-[#77716C] hover:text-[#26231E] flex items-center gap-1 py-1 px-2 rounded border border-[#E7E0D8]"
              >
                <RotateCcw className="w-3 h-3 text-[#A77A7E]" />
                <span className="hidden sm:inline">Reset Seed Data</span>
              </button>
            ))}

            <button
              onClick={() => navigateToPublic('booking')}
              className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
            >
              + New Client Booking
            </button>
          </div>
        </header>

        {/* Tab Content Canvas */}
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
