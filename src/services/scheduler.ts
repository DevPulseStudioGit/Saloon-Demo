import {
  Staff,
  Service,
  Branch,
  Appointment,
  SalonSettings,
  AvailableTimeSlot
} from '../types';

/**
 * Converts "HH:mm" to minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * Converts minutes since midnight to "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Calculates total duration for a combination of services, addons and buffer
 */
export function calculateBookingDuration(
  services: Service[],
  selectedAddonIds: { [serviceId: string]: string[] },
  bufferMinutes: number = 15
): number {
  let total = 0;
  for (const s of services) {
    total += s.durationMinutes;
    const addonIds = selectedAddonIds[s.id] || [];
    for (const addonId of addonIds) {
      const addon = s.addons.find((a) => a.id === addonId);
      if (addon) {
        total += addon.durationMinutes;
      }
    }
  }
  // Add buffer time after the treatment
  total += bufferMinutes;
  return total;
}

/**
 * Calculates price breakdown for booking
 */
export function calculateBookingPrice(
  services: Service[],
  selectedAddonIds: { [serviceId: string]: string[] },
  depositPolicy: SalonSettings['depositPolicy'],
  currency: string = 'PKR'
) {
  let basePrice = 0;
  let addonsTotal = 0;

  for (const s of services) {
    basePrice += s.basePrice;
    const addonIds = selectedAddonIds[s.id] || [];
    for (const addonId of addonIds) {
      const addon = s.addons.find((a) => a.id === addonId);
      if (addon) {
        addonsTotal += addon.price;
      }
    }
  }

  const subtotal = basePrice + addonsTotal;
  const discount = 0;
  const tax = 0; // Transparent pricing
  const total = subtotal - discount + tax;

  // Deposit calculation
  let depositRequired = 0;
  const hasBridalService = services.some((s) => s.categoryId === 'bridal-editorial');
  const hasDepositService = services.some((s) => s.depositRequired);

  if (depositPolicy.enabled) {
    if (hasBridalService) {
      depositRequired = depositPolicy.fixedAmountForBridal;
    } else if (hasDepositService || total >= depositPolicy.requireForTotalOver) {
      depositRequired = Math.round((total * depositPolicy.percentage) / 100);
    }
  }

  const depositPaid = 0;
  const remainingDue = total - depositPaid;

  return {
    basePrice,
    addonsTotal,
    subtotal,
    discount,
    tax,
    total,
    depositRequired,
    depositPaid,
    remainingDue,
    currency
  };
}

/**
 * Filter staff members eligible for the given services and branch
 */
export function getEligibleStaff(
  services: Service[],
  branchId: string,
  staffList: Staff[]
): Staff[] {
  if (services.length === 0) return [];
  const reqServiceIds = services.map((s) => s.id);

  return staffList.filter((staff) => {
    if (!staff.active) return false;
    // Check branch
    if (!staff.branches.includes(branchId)) return false;
    // Check all services
    const canDoAll = reqServiceIds.every((sId) => staff.servicesSupported.includes(sId));
    return canDoAll;
  });
}

/**
 * Generates valid available appointment slots for a specific date
 */
export function getAvailableSlotsForDate(params: {
  dateStr: string; // "YYYY-MM-DD"
  branchId: string;
  services: Service[];
  selectedAddons: { [serviceId: string]: string[] };
  stylistId: string; // specific ID or "any"
  allAppointments: Appointment[];
  allStaff: Staff[];
  allBranches: Branch[];
  settings: SalonSettings;
}): AvailableTimeSlot[] {
  const {
    dateStr,
    branchId,
    services,
    selectedAddons,
    stylistId,
    allAppointments,
    allStaff,
    allBranches,
    settings
  } = params;

  if (services.length === 0) return [];

  // 1. Validate date range
  const targetDate = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Disallow past dates
  if (dateStr < todayStr) {
    return [];
  }

  // Check advance booking window
  const maxAdvanceDate = new Date();
  maxAdvanceDate.setDate(now.getDate() + settings.bookingRules.advanceBookingDays);
  if (targetDate > maxAdvanceDate) {
    return [];
  }

  // Day of week in JavaScript: 0 = Sun, 1 = Mon, ..., 6 = Sat
  const dayOfWeek = targetDate.getDay();

  // 2. Check branch
  const branch = allBranches.find((b) => b.id === branchId && b.active);
  if (!branch) return [];

  // Calculate required total duration
  const duration = calculateBookingDuration(
    services,
    selectedAddons,
    settings.bookingRules.bufferTimeBetweenServices
  );

  // 3. Determine eligible staff pool
  const eligibleStaff = getEligibleStaff(services, branchId, allStaff);
  if (eligibleStaff.length === 0) return [];

  // Filter staff by selected stylist or all eligible if "any"
  let targetStaffList =
    stylistId && stylistId !== 'any'
      ? eligibleStaff.filter((s) => s.id === stylistId)
      : eligibleStaff;

  if (targetStaffList.length === 0) return [];

  // Filter out staff who are not scheduled to work or on time off
  targetStaffList = targetStaffList.filter((staff) => {
    const shift = staff.weeklySchedule[dayOfWeek];
    if (!shift || !shift.isWorking) return false;

    // Check time off
    const hasTimeOff = staff.timeOff.some(
      (to) => to.date === dateStr && to.approved
    );
    if (hasTimeOff) return false;

    // Check daily max appointments
    const staffDayAppts = allAppointments.filter(
      (a) =>
        a.stylistId === staff.id &&
        a.date === dateStr &&
        a.status !== 'cancelled'
    );
    if (staffDayAppts.length >= staff.maxDailyAppointments) {
      return false;
    }

    return true;
  });

  if (targetStaffList.length === 0) return [];

  // Current time in minutes if booking for today
  const isToday = dateStr === todayStr;
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;
  const minNoticeMinutes = settings.bookingRules.minNoticeHours * 60;
  const earliestAllowedMinute = isToday ? currentMinutes + minNoticeMinutes : 0;

  // We generate slots at regular intervals (default 30 mins)
  const slotInterval = settings.bookingRules.defaultSlotInterval || 30;

  // Salon standard operational day (10:30 to 20:00 -> 630 to 1200)
  const earliestDayStart = 10 * 60 + 30; // 10:30 AM
  const latestDayEnd = 20 * 60; // 8:00 PM

  const slotMap = new Map<string, { available: boolean; stylistId?: string; stylistName?: string }>();

  for (let m = earliestDayStart; m + duration <= latestDayEnd; m += slotInterval) {
    const timeStr = minutesToTime(m);

    // If today, enforce minimum notice
    if (isToday && m < earliestAllowedMinute) {
      continue;
    }

    const candidateStart = m;
    const candidateEnd = m + duration;

    // Check which eligible staff is available for [candidateStart, candidateEnd]
    let freeStaff: Staff | null = null;

    for (const staff of targetStaffList) {
      const shift = staff.weeklySchedule[dayOfWeek];
      if (!shift || !shift.isWorking) continue;

      const shiftStart = timeToMinutes(shift.start);
      const shiftEnd = timeToMinutes(shift.end);

      // Must fit within working shift
      if (candidateStart < shiftStart || candidateEnd > shiftEnd) {
        continue;
      }

      // Must not overlap with break times
      const hasBreakOverlap = shift.breaks.some((brk) => {
        const bStart = timeToMinutes(brk.start);
        const bEnd = timeToMinutes(brk.end);
        return candidateStart < bEnd && candidateEnd > bStart;
      });
      if (hasBreakOverlap) continue;

      // Must not overlap with existing appointments for this staff
      const existingAppts = allAppointments.filter(
        (a) =>
          a.stylistId === staff.id &&
          a.date === dateStr &&
          a.status !== 'cancelled'
      );

      const hasApptOverlap = existingAppts.some((appt) => {
        const apptStart = timeToMinutes(appt.startTime);
        const apptEnd = timeToMinutes(appt.endTime);
        return candidateStart < apptEnd && candidateEnd > apptStart;
      });

      if (!hasApptOverlap) {
        freeStaff = staff;
        break; // Found an available stylist for this slot
      }
    }

    if (freeStaff) {
      slotMap.set(timeStr, {
        available: true,
        stylistId: freeStaff.id,
        stylistName: freeStaff.name
      });
    }
  }

  // Convert map to array
  const result: AvailableTimeSlot[] = [];
  slotMap.forEach((val, time) => {
    result.push({
      time,
      available: val.available,
      stylistId: val.stylistId,
      stylistName: val.stylistName
    });
  });

  return result.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

/**
 * Strict Concurrency & Double-Booking Guard
 * Re-validates that the exact slot and stylist is still free prior to committing to storage.
 */
export function validateBookingSubmission(params: {
  date: string;
  startTime: string;
  durationMinutes: number;
  branchId: string;
  stylistId: string;
  services: Service[];
  allAppointments: Appointment[];
  allStaff: Staff[];
  allBranches: Branch[];
  excludeAppointmentId?: string; // When rescheduling
}): { valid: boolean; error?: string; assignedStylistId?: string } {
  const {
    date,
    startTime,
    durationMinutes,
    branchId,
    stylistId,
    services,
    allAppointments,
    allStaff,
    allBranches,
    excludeAppointmentId
  } = params;

  const startMin = timeToMinutes(startTime);
  const endMin = startMin + durationMinutes;

  const eligibleStaff = getEligibleStaff(services, branchId, allStaff);
  if (eligibleStaff.length === 0) {
    return { valid: false, error: 'No qualified stylists found for this branch and service selection.' };
  }

  const targetDate = new Date(`${date}T00:00:00`);
  const dayOfWeek = targetDate.getDay();

  // Determine which staff member to validate
  let candidateStaff: Staff[] = [];
  if (stylistId && stylistId !== 'any') {
    const s = eligibleStaff.find((x) => x.id === stylistId);
    if (!s) return { valid: false, error: 'Selected stylist is not eligible for these services at this branch.' };
    candidateStaff = [s];
  } else {
    // Any available stylist: search all eligible
    candidateStaff = eligibleStaff;
  }

  let finalStylist: Staff | null = null;

  for (const staff of candidateStaff) {
    const shift = staff.weeklySchedule[dayOfWeek];
    if (!shift || !shift.isWorking) continue;

    const shiftStart = timeToMinutes(shift.start);
    const shiftEnd = timeToMinutes(shift.end);

    if (startMin < shiftStart || endMin > shiftEnd) continue;

    // Check breaks
    const breakOverlap = shift.breaks.some((brk) => {
      const bStart = timeToMinutes(brk.start);
      const bEnd = timeToMinutes(brk.end);
      return startMin < bEnd && endMin > bStart;
    });
    if (breakOverlap) continue;

    // Check time off
    const isOff = staff.timeOff.some((to) => to.date === date && to.approved);
    if (isOff) continue;

    // Check existing appointments collision
    const existing = allAppointments.filter(
      (a) =>
        a.id !== excludeAppointmentId &&
        a.stylistId === staff.id &&
        a.date === date &&
        a.status !== 'cancelled'
    );

    const collision = existing.find((appt) => {
      const aStart = timeToMinutes(appt.startTime);
      const aEnd = timeToMinutes(appt.endTime);
      return startMin < aEnd && endMin > aStart;
    });

    if (!collision) {
      finalStylist = staff;
      break;
    }
  }

  if (!finalStylist) {
    return {
      valid: false,
      error: 'The requested time slot was just booked or is no longer available. Please select another time.'
    };
  }

  return {
    valid: true,
    assignedStylistId: finalStylist.id
  };
}
