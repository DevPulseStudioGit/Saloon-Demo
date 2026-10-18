import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Share2,
  Printer,
  ArrowRight,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface BookingConfirmationPageProps {
  reference: string;
  navigateTo: (route: string, param?: string) => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({
  reference,
  navigateTo
}) => {
  const { appointments, branches, services, staff, settings } = useSalon();

  const appointment = appointments.find(
    (a) => a.reference.toUpperCase() === reference.toUpperCase()
  );

  if (!appointment) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
          Booking Reference Not Found
        </h2>
        <p className="text-xs text-[#77716C]">
          We could not locate reference {reference}. If you recently booked, please check your reference code.
        </p>
        <button
          onClick={() => navigateTo('my-appointments')}
          className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#26231E] rounded"
        >
          Look Up Appointment
        </button>
      </div>
    );
  }

  const branch = branches.find((b) => b.id === appointment.branchId) || branches[0];
  const stylist = staff.find((s) => s.id === appointment.stylistId);
  const bookedServices = services.filter((s) => appointment.serviceIds.includes(s.id));

  // Calendar export helper (.ics)
  const handleDownloadIcs = () => {
    const startDate = new Date(`${appointment.date}T${appointment.startTime}:00`);
    const endDate = new Date(`${appointment.date}T${appointment.endTime}:00`);

    const formatIcsDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Luma Atelier//Booking Platform//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.reference}@lumaatelier.com`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:${settings.salonName} - ${bookedServices.map((s) => s.name).join(', ')}`,
      `DESCRIPTION:Appointment Reference: ${appointment.reference}\\nStylist: ${stylist?.name || 'Master Artist'}\\nLocation: ${branch.name}`,
      `LOCATION:${branch.address}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${appointment.reference}-appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Luma Atelier Concierge, I have confirmed my booking ${appointment.reference} for ${appointment.date} at ${appointment.startTime} at ${branch.name}.`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Reservation Confirmed
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
          We Look Forward to Welcoming You
        </h1>
        <p className="text-xs sm:text-sm text-[#77716C] max-w-md mx-auto">
          Your booking is securely confirmed in our Karachi studio schedule. A confirmation copy has been registered under your reference.
        </p>
      </div>

      {/* Main Receipt Card */}
      <div className="bg-white rounded-2xl border border-[#E7E0D8] shadow-md p-6 sm:p-8 space-y-6">
        {/* Reference & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E0D8]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#77716C] block">
              Booking Reference
            </span>
            <span className="font-serif-title font-bold text-2xl text-[#26231E]">
              {appointment.reference}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#77716C] block">
              Status
            </span>
            <span className="inline-block px-3 py-1 rounded bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200 uppercase tracking-wider">
              {appointment.status}
            </span>
          </div>
        </div>

        {/* Schedule & Studio Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[#77716C] block uppercase text-[10px] tracking-wider font-semibold">
              Date & Time
            </span>
            <div className="font-semibold text-sm text-[#26231E] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#A77A7E]" />
              {appointment.date}
            </div>
            <div className="text-[#77716C] flex items-center gap-1.5 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#A77A7E]" />
              {appointment.startTime} – {appointment.endTime} ({appointment.totalDurationMinutes} mins)
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#77716C] block uppercase text-[10px] tracking-wider font-semibold">
              Karachi Studio
            </span>
            <div className="font-semibold text-sm text-[#26231E] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#A77A7E]" />
              {branch.name}
            </div>
            <div className="text-[#77716C] pt-0.5">{branch.address}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[#77716C] block uppercase text-[10px] tracking-wider font-semibold">
              Assigned Specialist
            </span>
            <div className="font-semibold text-sm text-[#26231E] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#A77A7E]" />
              {stylist?.name || 'Master Atelier Artist'}
            </div>
            <div className="text-[#77716C]">{stylist?.role || 'Lead Specialist'}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[#77716C] block uppercase text-[10px] tracking-wider font-semibold">
              Client Details
            </span>
            <div className="font-semibold text-sm text-[#26231E]">
              {appointment.customer.name}
            </div>
            <div className="text-[#77716C]">{appointment.customer.phone}</div>
          </div>
        </div>

        {/* Treatment Items */}
        <div className="pt-4 border-t border-[#E7E0D8] space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#77716C] block">
            Treatments Reserved
          </span>
          <div className="space-y-2 text-xs">
            {bookedServices.map((service) => (
              <div key={service.id} className="flex justify-between items-center py-1">
                <div>
                  <div className="font-medium text-[#26231E]">{service.name}</div>
                  <div className="text-[11px] text-[#77716C]">{service.durationMinutes} min</div>
                </div>
                <div className="font-semibold text-[#26231E]">
                  Rs. {service.basePrice.toLocaleString()}
                </div>
              </div>
            ))}
            {appointment.pricing.addonsTotal > 0 && (
              <div className="flex justify-between items-center py-1 text-xs text-[#77716C]">
                <span>Add-on treatments</span>
                <span>+Rs. {appointment.pricing.addonsTotal.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="pt-4 border-t border-[#E7E0D8] space-y-2 text-xs">
          <div className="flex justify-between text-sm font-bold text-[#26231E]">
            <span>Total Treatment Investment</span>
            <span>Rs. {appointment.pricing.total.toLocaleString()}</span>
          </div>

          {appointment.payment.status === 'deposit_paid' && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs text-emerald-800 font-semibold">
                <span>Deposit Paid Online</span>
                <span>Rs. {appointment.pricing.depositPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#77716C]">
                <span>Balance Due at Salon</span>
                <span>Rs. {appointment.pricing.remainingDue.toLocaleString()}</span>
              </div>
            </div>
          )}

          {appointment.payment.status === 'fully_paid' && (
            <div className="flex justify-between text-xs text-emerald-800 font-semibold pt-1">
              <span>Full Payment Settled</span>
              <span>Rs. {appointment.pricing.total.toLocaleString()}</span>
            </div>
          )}

          {appointment.payment.status === 'unpaid' && (
            <div className="flex justify-between text-xs text-[#77716C] pt-1">
              <span>Payment Mode</span>
              <span className="font-medium">Pay at Salon Desk</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#E7E0D8] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadIcs}
            className="p-3 text-xs font-semibold rounded-md border border-[#E7E0D8] hover:border-[#26231E] transition-colors flex items-center justify-center gap-2 text-[#26231E]"
          >
            <Calendar className="w-4 h-4 text-[#A77A7E]" />
            <span>Add to Calendar</span>
          </button>

          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="p-3 text-xs font-semibold rounded-md border border-[#E7E0D8] hover:border-emerald-600 transition-colors flex items-center justify-center gap-2 text-emerald-800 bg-emerald-50"
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>WhatsApp Confirmation</span>
          </a>

          <button
            onClick={() => window.print()}
            className="p-3 text-xs font-semibold rounded-md border border-[#E7E0D8] hover:border-[#26231E] transition-colors flex items-center justify-center gap-2 text-[#26231E]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Client self-service reminder */}
      <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E7E0D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-[#26231E] block">
            Need to reschedule or cancel later?
          </span>
          <span className="text-[#77716C]">
            Use your reference code <strong className="text-[#26231E]">{appointment.reference}</strong> in the client portal.
          </span>
        </div>
        <button
          onClick={() => navigateTo('my-appointments')}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#26231E] rounded hover:bg-[#3D3730] shrink-0"
        >
          Manage Booking
        </button>
      </div>
    </div>
  );
};
