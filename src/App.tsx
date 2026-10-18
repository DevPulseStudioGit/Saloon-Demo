import React, { useEffect, useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { SalonProvider } from './context/SalonContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminCalendar } from './pages/admin/AdminCalendar';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminStaff } from './pages/admin/AdminStaff';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminBranches } from './pages/admin/AdminBranches';
import { AdminPackages } from './pages/admin/AdminPackages';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminGiftCards } from './pages/admin/AdminGiftCards';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAuditLog } from './pages/admin/AdminAuditLog';
import { AdminStylistPortal } from './pages/admin/AdminStylistPortal';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { TeamPage } from './pages/TeamPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { BookingPage } from './pages/BookingPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyAppointmentsPage } from './pages/MyAppointmentsPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { PackagesPage } from './pages/PackagesPage';
import { ShopPage } from './pages/ShopPage';
import { GiftCardsPage } from './pages/GiftCardsPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { StylistDetailPage } from './pages/StylistDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LocationPickerModal } from './components/common/LocationPickerModal';
import { useSalon } from './context/SalonContext';

type AdminTab =
  | 'overview'
  | 'appointments'
  | 'calendar'
  | 'services'
  | 'staff'
  | 'customers'
  | 'branches'
  | 'packages'
  | 'products'
  | 'gift-cards'
  | 'settings'
  | 'audit-log'
  | 'stylist-portal';

const normalizeRoute = (path: string) => {
  const route = path.replace(/^\/+|\/+$/g, '');
  return route || 'home';
};

const getAllowedAdminTabs = (role: string | undefined): AdminTab[] => {
  if (role === 'stylist') return ['stylist-portal', 'appointments', 'services'];
  if (role === 'receptionist') return ['overview', 'appointments', 'calendar', 'services', 'customers', 'audit-log'];
  return [
    'overview', 'appointments', 'calendar', 'services', 'staff', 'customers',
    'branches', 'packages', 'products', 'gift-cards', 'settings', 'audit-log'
  ];
};

const AppContent: React.FC = () => {
  const { isAuthenticated, currentUser } = useAdminAuth();
  const { branches, selectedBranchId, setSelectedBranchId } = useSalon();
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname));
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    if (!route.startsWith('admin')) {
      const hasSelectedLocation = localStorage.getItem('luma_location_selected_v1') === 'true';
      if (!hasSelectedLocation) {
        setIsFirstVisit(true);
        setIsLocationPickerOpen(true);
      }
    }
  }, [route]);

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (route === 'admin' && currentUser?.role === 'stylist') {
      setAdminTab('stylist-portal');
    } else if (route === 'admin/stylist-portal' && currentUser?.role !== 'stylist') {
      window.history.replaceState({}, '', '/admin');
      setRoute('admin');
      setAdminTab('overview');
    }
  }, [currentUser?.role, route]);

  const navigateTo = (target: string, param?: string) => {
    const path = param ? `${target}/${param}` : target;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    window.history.pushState({}, '', normalizedPath);
    setRoute(normalizeRoute(normalizedPath));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLocationSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
    localStorage.setItem('luma_location_selected_v1', 'true');
    setIsFirstVisit(false);
  };

  if (route === 'admin/login' || (route.startsWith('admin') && !isAuthenticated)) {
    return <AdminLogin />;
  }

  if (route === 'admin' || route.startsWith('admin/')) {
    const tabFromRoute = route.replace('admin/', '') as AdminTab;
    const allowedTabs = getAllowedAdminTabs(currentUser?.role);
    const activeTab = allowedTabs.includes(tabFromRoute) && tabFromRoute !== 'stylist-portal'
      ? tabFromRoute
      : currentUser?.role === 'stylist'
        ? 'stylist-portal'
        : allowedTabs.includes(adminTab)
          ? adminTab
          : 'overview';

    const views: Record<AdminTab, React.ReactNode> = {
      overview: <AdminOverview onSelectTab={(tab) => setAdminTab(tab as AdminTab)} onSelectAppointment={() => setAdminTab('appointments')} />,
      appointments: <AdminAppointments />,
      calendar: <AdminCalendar />,
      services: <AdminServices />,
      staff: <AdminStaff />,
      customers: <AdminCustomers />,
      branches: <AdminBranches />,
      packages: <AdminPackages />,
      products: <AdminProducts />,
      'gift-cards': <AdminGiftCards />,
      settings: <AdminSettings />
      ,
      'audit-log': <AdminAuditLog />,
      'stylist-portal': <AdminStylistPortal />
    };

    return (
      <AdminLayout
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setAdminTab(tab as AdminTab);
          navigateTo(`/admin/${tab}`);
        }}
        navigateToPublic={(target) => navigateTo(target)}
      >
        {views[activeTab]}
      </AdminLayout>
    );
  }

  const [baseRoute, param] = route.split('/');
  const page = (() => {
    switch (baseRoute) {
      case 'services': return <ServicesPage navigateTo={navigateTo} />;
      case 'pricing': return <PricingPage navigateTo={navigateTo} />;
      case 'team': return <TeamPage navigateTo={navigateTo} />;
      case 'gallery': return <GalleryPage navigateTo={navigateTo} />;
      case 'about': return <AboutPage navigateTo={navigateTo} />;
      case 'booking': return <BookingPage navigateTo={navigateTo} />;
      case 'booking-confirmation': return <BookingConfirmationPage reference={param || ''} navigateTo={navigateTo} />;
      case 'my-appointments': return <MyAppointmentsPage navigateTo={navigateTo} />;
      case 'contact': return <ContactPage navigateTo={navigateTo} />;
      case 'faq':
      case 'faqs': return <FaqPage navigateTo={navigateTo} />;
      case 'policies': return <PoliciesPage navigateTo={navigateTo} />;
      case 'delivery-policy':
      case 'privacy-policy':
      case 'terms': return <PoliciesPage navigateTo={navigateTo} />;
      case 'packages': return <PackagesPage navigateTo={navigateTo} />;
      case 'shop': return <ShopPage navigateTo={navigateTo} />;
      case 'gift-cards': return <GiftCardsPage navigateTo={navigateTo} />;
      case 'menu': return <ServicesPage navigateTo={navigateTo} />;
      case 'deals': return <PackagesPage navigateTo={navigateTo} />;
      case 'track-order': return <MyAppointmentsPage navigateTo={navigateTo} />;
      case 'service-detail': return <ServiceDetailPage serviceId={param || ''} navigateTo={navigateTo} />;
      case 'stylist-detail': return <StylistDetailPage stylistId={param || ''} navigateTo={navigateTo} />;
      case 'home': return <HomePage navigateTo={navigateTo} />;
      default: return <NotFoundPage navigateTo={navigateTo} />;
    }
  })();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EF] text-[#26231E]">
      <Header
        currentRoute={route}
        navigateTo={navigateTo}
        onOpenLocationPicker={() => {
          setIsFirstVisit(false);
          setIsLocationPickerOpen(true);
        }}
      />
      <main key={route} className="flex-1 motion-page-enter">{page}</main>
      <Footer navigateTo={navigateTo} />
      <LocationPickerModal
        branches={branches}
        selectedBranchId={selectedBranchId}
        isOpen={isLocationPickerOpen}
        isFirstVisit={isFirstVisit}
        onSelect={handleLocationSelect}
        onClose={() => setIsLocationPickerOpen(false)}
      />
    </div>
  );
};

const App: React.FC = () => (
  <AdminAuthProvider>
    <SalonProvider>
      <AppContent />
    </SalonProvider>
  </AdminAuthProvider>
);

export default App;
