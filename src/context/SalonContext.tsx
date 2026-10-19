import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SalonSettings,
  Branch,
  Staff,
  ServiceCategory,
  Service,
  Appointment,
  PackageDeal,
  RetailProduct,
  GiftCard,
  Review,
  FaqItem,
  CustomerDetails,
  PaymentMethod,
  AppointmentStatus,
  AvailableTimeSlot
} from '../types';
import { StorageService } from '../services/storage';
import { useAdminAuth } from './AdminAuthContext';
import {
  calculateBookingDuration,
  calculateBookingPrice,
  getAvailableSlotsForDate,
  validateBookingSubmission,
  minutesToTime,
  timeToMinutes
} from '../services/scheduler';

interface BookingDraft {
  serviceIds: string[];
  selectedAddons: { [serviceId: string]: string[] };
  branchId: string;
  stylistId: string; // or "any"
  date: string;
  startTime: string;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
}

const DEFAULT_BOOKING_DRAFT: BookingDraft = {
  serviceIds: [],
  selectedAddons: {},
  branchId: 'clifton',
  stylistId: 'any',
  date: '',
  startTime: '',
  customer: {
    name: '',
    phone: '',
    email: '',
    notes: ''
  },
  paymentMethod: 'salon'
};

interface SalonContextType {
  settings: SalonSettings;
  branches: Branch[];
  categories: ServiceCategory[];
  services: Service[];
  staff: Staff[];
  appointments: Appointment[];
  packages: PackageDeal[];
  products: RetailProduct[];
  giftCards: GiftCard[];
  reviews: Review[];
  faqs: FaqItem[];
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  bookingDraft: BookingDraft;
  updateBookingDraft: (partial: Partial<BookingDraft>) => void;
  resetBookingDraft: () => void;
  getAvailableSlots: (dateStr: string, stylistIdOverride?: string) => AvailableTimeSlot[];
  submitBooking: () => Promise<{ success: boolean; appointment?: Appointment; error?: string }>;
  findAppointment: (reference: string, phone: string) => Appointment | undefined;
  cancelAppointment: (id: string, reason: string, user: string) => { success: boolean; error?: string };
  rescheduleAppointment: (
    id: string,
    newDate: string,
    newStartTime: string,
    user: string
  ) => { success: boolean; error?: string };
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
    note: string,
    user: string,
    paymentStatusUpdate?: Appointment['payment']['status']
  ) => void;
  updateSettings: (newSettings: SalonSettings) => void;
  updateService: (service: Service) => void;
  createService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
  updateStaffMember: (staffMember: Staff) => void;
  createStaffMember: (staffMember: Staff) => void;
  updateBranch: (branch: Branch) => void;
  resetAllData: () => void;
  refreshData: () => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAdminAuth();
  const [settings, setSettings] = useState<SalonSettings>(StorageService.getSettings());
  const [branches, setBranches] = useState<Branch[]>(StorageService.getBranches());
  const [categories, setCategories] = useState<ServiceCategory[]>(StorageService.getCategories());
  const [services, setServices] = useState<Service[]>(StorageService.getServices());
  const [staff, setStaff] = useState<Staff[]>(StorageService.getStaff());
  const [appointments, setAppointments] = useState<Appointment[]>(StorageService.getAppointments());
  const [packages, setPackages] = useState<PackageDeal[]>(StorageService.getPackages());
  const [products, setProducts] = useState<RetailProduct[]>(StorageService.getProducts());
  const [giftCards, setGiftCards] = useState<GiftCard[]>(StorageService.getGiftCards());
  const [reviews, setReviews] = useState<Review[]>(StorageService.getReviews());
  const [faqs, setFaqs] = useState<FaqItem[]>(StorageService.getFaqs());

  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => {
    return localStorage.getItem('luma_selected_branch_v1') || 'clifton';
  });
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({
    ...DEFAULT_BOOKING_DRAFT,
    branchId: 'clifton'
  });
  const auditUser = currentUser?.name || 'System';
  const auditRole = currentUser?.role || 'system';

  const setSelectedBranchId = (id: string) => {
    setSelectedBranchIdState(id);
    localStorage.setItem('luma_selected_branch_v1', id);
    setBookingDraft((previous) => ({ ...previous, branchId: id }));
  };

  const refreshData = () => {
    setSettings(StorageService.getSettings());
    setBranches(StorageService.getBranches());
    setCategories(StorageService.getCategories());
    setServices(StorageService.getServices());
    setStaff(StorageService.getStaff());
    setAppointments(StorageService.getAppointments());
    setPackages(StorageService.getPackages());
    setProducts(StorageService.getProducts());
    setGiftCards(StorageService.getGiftCards());
    setReviews(StorageService.getReviews());
    setFaqs(StorageService.getFaqs());
  };

  useEffect(() => {
    const handleStorageUpdate = () => refreshData();
    window.addEventListener('luma_data_updated', handleStorageUpdate);
    return () => window.removeEventListener('luma_data_updated', handleStorageUpdate);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    void StorageService.refreshFromServer();
    const refreshInterval = window.setInterval(() => {
      void StorageService.refreshFromServer();
    }, 5000);

    return () => window.clearInterval(refreshInterval);
  }, [currentUser]);

  const updateBookingDraft = (partial: Partial<BookingDraft>) => {
    setBookingDraft((prev) => ({ ...prev, ...partial }));
  };

  const resetBookingDraft = () => {
    setBookingDraft({
      ...DEFAULT_BOOKING_DRAFT,
      branchId: selectedBranchId
    });
  };

  // Helper to get available slots for currently drafted services and branch
  const getAvailableSlots = (dateStr: string, stylistIdOverride?: string): AvailableTimeSlot[] => {
    const draftedServices = services.filter((s) => bookingDraft.serviceIds.includes(s.id));
    return getAvailableSlotsForDate({
      dateStr,
      branchId: bookingDraft.branchId,
      services: draftedServices,
      selectedAddons: bookingDraft.selectedAddons,
      stylistId: stylistIdOverride || bookingDraft.stylistId,
      allAppointments: appointments,
      allStaff: staff,
      allBranches: branches,
      settings
    });
  };

  // Submit appointment with strict server-like double booking re-validation
  const submitBooking = async (): Promise<{ success: boolean; appointment?: Appointment; error?: string }> => {
    const draftedServices = services.filter((s) => bookingDraft.serviceIds.includes(s.id));
    if (draftedServices.length === 0) {
      return { success: false, error: 'Please select at least one service.' };
    }
    if (!bookingDraft.date) {
      return { success: false, error: 'Please select an appointment date.' };
    }
    if (!bookingDraft.startTime) {
      return { success: false, error: 'Please select an appointment time slot.' };
    }
    if (!bookingDraft.customer.name.trim() || !bookingDraft.customer.phone.trim()) {
      return { success: false, error: 'Please provide customer name and Pakistani phone number.' };
    }

    const duration = calculateBookingDuration(
      draftedServices,
      bookingDraft.selectedAddons,
      settings.bookingRules.bufferTimeBetweenServices
    );

    // Re-verify availability
    const validation = validateBookingSubmission({
      date: bookingDraft.date,
      startTime: bookingDraft.startTime,
      durationMinutes: duration,
      branchId: bookingDraft.branchId,
      stylistId: bookingDraft.stylistId,
      services: draftedServices,
      allAppointments: appointments,
      allStaff: staff,
      allBranches: branches
    });

    if (!validation.valid || !validation.assignedStylistId) {
      return {
        success: false,
        error: validation.error || 'The requested slot is no longer available. Please choose another time.'
      };
    }

    // Calculate start & end time
    const startMin = timeToMinutes(bookingDraft.startTime);
    const endMin = startMin + duration;
    const endTime = minutesToTime(endMin);

    // Pricing calculation
    const pricing = calculateBookingPrice(
      draftedServices,
      bookingDraft.selectedAddons,
      settings.depositPolicy,
      settings.currency
    );

    // Payment state
    let paymentStatus: Appointment['payment']['status'] = 'unpaid';
    let amountPaid = 0;
    let transactionId = undefined;

    if (bookingDraft.paymentMethod === 'deposit_online') {
      paymentStatus = 'deposit_paid';
      amountPaid = pricing.depositRequired;
      transactionId = `TXN-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
      pricing.depositPaid = amountPaid;
      pricing.remainingDue = pricing.total - amountPaid;
    } else if (bookingDraft.paymentMethod === 'full_online') {
      paymentStatus = 'fully_paid';
      amountPaid = pricing.total;
      transactionId = `TXN-FULL-${Math.floor(100000 + Math.random() * 900000)}`;
      pricing.depositPaid = amountPaid;
      pricing.remainingDue = 0;
    }

    // Auto confirm check
    const status: AppointmentStatus = settings.bookingRules.autoConfirm ? 'confirmed' : 'pending';

    const reference = `LMA-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      reference,
      branchId: bookingDraft.branchId,
      serviceIds: bookingDraft.serviceIds,
      serviceAddons: bookingDraft.selectedAddons,
      stylistId: validation.assignedStylistId,
      date: bookingDraft.date,
      startTime: bookingDraft.startTime,
      endTime,
      totalDurationMinutes: duration,
      customer: { ...bookingDraft.customer },
      pricing,
      payment: {
        method: bookingDraft.paymentMethod,
        status: paymentStatus,
        transactionId,
        paidAt: amountPaid > 0 ? nowIso : undefined,
        amountPaid
      },
      status,
      statusHistory: [
        {
          status,
          timestamp: nowIso,
          note: `Appointment booked online via customer checkout (${bookingDraft.paymentMethod})`,
          changedBy: 'Online Booking'
        }
      ],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // Save to storage
    const currentAppts = StorageService.getAppointments();
    const updatedAppts = [newAppt, ...currentAppts];
    StorageService.saveAppointments(updatedAppts);
    setAppointments(updatedAppts);

    // Record customer in CRM
    StorageService.recordCustomerAppointment(bookingDraft.customer, pricing.total);

    // Log audit
    StorageService.addAuditLog(
      bookingDraft.customer.name,
      'customer',
      'APPOINTMENT_CREATED',
      `Created booking ${reference} for ${draftedServices.map((s) => s.name).join(', ')} on ${bookingDraft.date}`
    );

    return { success: true, appointment: newAppt };
  };

  const findAppointment = (reference: string, phone: string): Appointment | undefined => {
    const cleanRef = reference.trim().toUpperCase();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    return appointments.find((a) => {
      const matchRef = a.reference.toUpperCase() === cleanRef;
      const apptCleanPhone = a.customer.phone.replace(/[^0-9]/g, '');
      const matchPhone =
        apptCleanPhone.endsWith(cleanPhone) ||
        cleanPhone.endsWith(apptCleanPhone) ||
        apptCleanPhone === cleanPhone;
      return matchRef && matchPhone;
    });
  };

  const cancelAppointment = (id: string, reason: string, user: string): { success: boolean; error?: string } => {
    const appts = StorageService.getAppointments();
    const appt = appts.find((a) => a.id === id);
    if (!appt) return { success: false, error: 'Appointment not found' };

    if (appt.status === 'cancelled') {
      return { success: false, error: 'Appointment is already cancelled' };
    }
    if (appt.status === 'completed') {
      return { success: false, error: 'Cannot cancel a completed service' };
    }

    const nowIso = new Date().toISOString();
    appt.status = 'cancelled';
    appt.cancellationReason = reason;
    appt.cancelledAt = nowIso;
    appt.updatedAt = nowIso;
    appt.statusHistory.push({
      status: 'cancelled',
      timestamp: nowIso,
      note: `Cancelled: ${reason}`,
      changedBy: user
    });

    StorageService.saveAppointments(appts);
    setAppointments([...appts]);

    StorageService.addAuditLog(
      user,
      'user',
      'APPOINTMENT_CANCELLED',
      `Cancelled booking ${appt.reference}: ${reason}`
    );

    return { success: true };
  };

  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newStartTime: string,
    user: string
  ): { success: boolean; error?: string } => {
    const appts = StorageService.getAppointments();
    const appt = appts.find((a) => a.id === id);
    if (!appt) return { success: false, error: 'Appointment not found' };

    const draftedServices = services.filter((s) => appt.serviceIds.includes(s.id));
    const validation = validateBookingSubmission({
      date: newDate,
      startTime: newStartTime,
      durationMinutes: appt.totalDurationMinutes,
      branchId: appt.branchId,
      stylistId: appt.stylistId,
      services: draftedServices,
      allAppointments: appts,
      allStaff: staff,
      allBranches: branches,
      excludeAppointmentId: appt.id
    });

    if (!validation.valid || !validation.assignedStylistId) {
      return { success: false, error: validation.error || 'Requested slot is unavailable.' };
    }

    const startMin = timeToMinutes(newStartTime);
    const endMin = startMin + appt.totalDurationMinutes;
    const newEndTime = minutesToTime(endMin);
    const nowIso = new Date().toISOString();

    appt.rescheduledFrom = {
      date: appt.date,
      startTime: appt.startTime,
      rescheduledAt: nowIso
    };
    appt.date = newDate;
    appt.startTime = newStartTime;
    appt.endTime = newEndTime;
    appt.stylistId = validation.assignedStylistId;
    appt.updatedAt = nowIso;
    appt.status = 'confirmed';
    appt.statusHistory.push({
      status: 'confirmed',
      timestamp: nowIso,
      note: `Rescheduled to ${newDate} at ${newStartTime}`,
      changedBy: user
    });

    StorageService.saveAppointments(appts);
    setAppointments([...appts]);

    StorageService.addAuditLog(
      user,
      'user',
      'APPOINTMENT_RESCHEDULED',
      `Rescheduled booking ${appt.reference} to ${newDate} at ${newStartTime}`
    );

    return { success: true };
  };

  const updateAppointmentStatus = (
    id: string,
    status: AppointmentStatus,
    note: string,
    user: string,
    paymentStatusUpdate?: Appointment['payment']['status']
  ) => {
    const appts = StorageService.getAppointments();
    const appt = appts.find((a) => a.id === id);
    if (!appt) return;

    const nowIso = new Date().toISOString();
    appt.status = status;
    appt.updatedAt = nowIso;
    if (paymentStatusUpdate) {
      appt.payment.status = paymentStatusUpdate;
      if (paymentStatusUpdate === 'fully_paid') {
        appt.pricing.remainingDue = 0;
        appt.payment.paidAt = nowIso;
      }
    }
    appt.statusHistory.push({
      status,
      timestamp: nowIso,
      note: note || `Status updated to ${status}`,
      changedBy: user
    });

    StorageService.saveAppointments(appts);
    setAppointments([...appts]);

    StorageService.addAuditLog(
      user,
      'staff',
      'STATUS_CHANGE',
      `Updated booking ${appt.reference} to ${status}`
    );
  };

  const updateSettings = (newSettings: SalonSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
    StorageService.addAuditLog(auditUser, auditRole, 'SETTINGS_UPDATE', 'Updated salon settings and policies');
  };

  const updateService = (updatedService: Service) => {
    const current = StorageService.getServices();
    const next = current.map((s) => (s.id === updatedService.id ? updatedService : s));
    StorageService.saveServices(next);
    setServices(next);
    StorageService.addAuditLog(auditUser, auditRole, 'SERVICE_UPDATED', `Updated service ${updatedService.name}`);
  };

  const createService = (newService: Service) => {
    const current = StorageService.getServices();
    const next = [...current, newService];
    StorageService.saveServices(next);
    setServices(next);
    StorageService.addAuditLog(auditUser, auditRole, 'SERVICE_CREATED', `Created service ${newService.name}`);
  };

  const deleteService = (serviceId: string) => {
    const current = StorageService.getServices();
    const next = current.filter((s) => s.id !== serviceId);
    StorageService.saveServices(next);
    setServices(next);
    StorageService.addAuditLog(auditUser, auditRole, 'SERVICE_DELETED', `Deleted service ID ${serviceId}`);
  };

  const updateStaffMember = (staffMember: Staff) => {
    const current = StorageService.getStaff();
    const next = current.map((s) => (s.id === staffMember.id ? staffMember : s));
    StorageService.saveStaff(next);
    setStaff(next);
    StorageService.addAuditLog(auditUser, auditRole, 'STAFF_UPDATED', `Updated staff member ${staffMember.name}`);
  };

  const createStaffMember = (staffMember: Staff) => {
    const current = StorageService.getStaff();
    const next = [...current, staffMember];
    StorageService.saveStaff(next);
    setStaff(next);
    StorageService.addAuditLog(auditUser, auditRole, 'STAFF_CREATED', `Added staff member ${staffMember.name}`);
  };

  const updateBranch = (branch: Branch) => {
    const current = StorageService.getBranches();
    const next = current.map((b) => (b.id === branch.id ? branch : b));
    StorageService.saveBranches(next);
    setBranches(next);
    StorageService.addAuditLog(auditUser, auditRole, 'BRANCH_UPDATED', `Updated branch ${branch.name}`);
  };

  const resetAllData = () => {
    StorageService.resetAll();
    refreshData();
  };

  return (
    <SalonContext.Provider
      value={{
        settings,
        branches,
        categories,
        services,
        staff,
        appointments,
        packages,
        products,
        giftCards,
        reviews,
        faqs,
        selectedBranchId,
        setSelectedBranchId,
        bookingDraft,
        updateBookingDraft,
        resetBookingDraft,
        getAvailableSlots,
        submitBooking,
        findAppointment,
        cancelAppointment,
        rescheduleAppointment,
        updateAppointmentStatus,
        updateSettings,
        updateService,
        createService,
        deleteService,
        updateStaffMember,
        createStaffMember,
        updateBranch,
        resetAllData,
        refreshData
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const ctx = useContext(SalonContext);
  if (!ctx) throw new Error('useSalon must be used within a SalonProvider');
  return ctx;
};
