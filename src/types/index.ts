export type UserRole = 'owner' | 'receptionist' | 'stylist' | 'customer';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stylistId?: string; // If role is stylist
  branchId?: string;
  avatar?: string;
}

export interface SalonBookingRules {
  advanceBookingDays: number;
  minNoticeHours: number;
  defaultSlotInterval: number; // in minutes (e.g. 30)
  autoConfirm: boolean;
  allowGuestBooking: boolean;
  allowStylistSelection: boolean;
  bufferTimeBetweenServices: number; // in minutes
}

export interface SalonDepositPolicy {
  enabled: boolean;
  percentage: number; // e.g. 20%
  fixedAmountForBridal: number; // e.g. 5000 PKR
  requireForTotalOver: number; // e.g. 8000 PKR
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  description: string;
  heroHeading: string;
  heroSubheading: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  openingHoursSummary: string;
  timeZone: string; // e.g. "Asia/Karachi"
  currency: string; // "PKR"
  currencySymbol: string; // "Rs."
  socials: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  bookingRules: SalonBookingRules;
  cancellationPolicy: string;
  depositPolicy: SalonDepositPolicy;
  features: {
    packages: boolean;
    giftCards: boolean;
    retailProducts: boolean;
    branchSelection: boolean;
    onlineDeposits: boolean;
    reviews: boolean;
  };
  brandColors: {
    primaryCharcoal: string;
    warmIvory: string;
    mutedMauve: string;
    champagneGold: string;
    softBlush: string;
    border: string;
  };
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  whatsapp?: string;
  hours: string;
  googleMapsUrl: string;
  image: string;
  active: boolean;
}

export interface WorkingShift {
  isWorking: boolean;
  start: string; // "10:30"
  end: string;   // "20:00"
  breaks: { start: string; end: string }[]; // e.g. lunch 14:00 - 15:00
}

export interface StaffTimeOff {
  id: string;
  date: string; // "YYYY-MM-DD"
  reason: string;
  approved: boolean;
}

export interface Staff {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  photo: string;
  specialties: string[];
  servicesSupported: string[]; // service IDs
  branches: string[]; // branch IDs
  weeklySchedule: {
    [dayOfWeek: number]: WorkingShift; // 0: Sunday, 1: Monday, ... 6: Saturday
  };
  timeOff: StaffTimeOff[];
  maxDailyAppointments: number;
  active: boolean;
  displayOrder: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  active: boolean;
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  durationMinutes: number;
  preparationMinutes: number;
  bufferMinutes: number;
  basePrice: number;
  isStartingPrice: boolean;
  image: string;
  assignedStaffIds: string[];
  branchIds: string[];
  active: boolean;
  isOnlineBookable: boolean;
  depositRequired: boolean;
  depositAmount: number;
  addons: ServiceAddon[];
  prepInstructions?: string;
  cancellationRule?: string;
  includedItems?: string[];
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_service'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentMethod =
  | 'salon'
  | 'deposit_online'
  | 'full_online'
  | 'card'
  | 'jazzcash'
  | 'easypaisa';

export type PaymentStatus =
  | 'unpaid'
  | 'deposit_paid'
  | 'fully_paid'
  | 'refunded';

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  notes?: string;
  city?: string;
  customerId?: string;
}

export interface AppointmentPricing {
  basePrice: number;
  addonsTotal: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  depositRequired: number;
  depositPaid: number;
  remainingDue: number;
  currency: string;
}

export interface StatusHistoryItem {
  status: AppointmentStatus;
  timestamp: string;
  note: string;
  changedBy: string;
}

export interface Appointment {
  id: string;
  reference: string; // e.g. "LMA-8921"
  branchId: string;
  serviceIds: string[];
  serviceAddons: { [serviceId: string]: string[] }; // serviceId -> array of addon IDs
  stylistId: string; // or "any" if auto-assigned
  date: string; // "YYYY-MM-DD"
  startTime: string; // "14:30"
  endTime: string;   // "16:00"
  totalDurationMinutes: number;
  customer: CustomerDetails;
  pricing: AppointmentPricing;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    paidAt?: string;
    amountPaid?: number;
  };
  status: AppointmentStatus;
  cancellationReason?: string;
  cancelledAt?: string;
  rescheduledFrom?: {
    date: string;
    startTime: string;
    rescheduledAt: string;
  };
  statusHistory: StatusHistoryItem[];
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpend: number;
  lastVisit?: string;
  preferences?: string;
  allergiesOrSensitivities?: string;
  createdAt: string;
}

export interface PackageDeal {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  durationMinutes: number;
  includedServices: string[];
  image: string;
  active: boolean;
  badge?: string;
}

export interface RetailProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  size: string;
  inStock: boolean;
}

export interface GiftCard {
  id: string;
  code: string;
  initialValue: number;
  balance: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  expiryDate: string;
  active: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface Review {
  id: string;
  customerName: string;
  serviceName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  approved: boolean;
}

export interface FaqItem {
  id: string;
  category: 'Booking & Policies' | 'Hair Services' | 'Skincare & Facials' | 'Bridal Suites' | 'General';
  question: string;
  answer: string;
}

export interface AvailableTimeSlot {
  time: string; // "11:00"
  available: boolean;
  stylistId?: string;
  stylistName?: string;
  reason?: string;
}
