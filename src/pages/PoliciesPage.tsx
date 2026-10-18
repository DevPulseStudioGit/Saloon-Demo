import React from 'react';
import { ShieldCheck, Clock, CreditCard, Lock } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface PoliciesPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ navigateTo }) => {
  const { settings } = useSalon();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Atelier Policies
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
          Booking, Cancellation & Studio Policies
        </h1>
        <p className="text-xs sm:text-sm text-[#77716C] leading-relaxed max-w-xl">
          To maintain an unhurried, serene atmosphere with guaranteed zero waiting time for every client, we operate strictly by the following policies.
        </p>
      </div>

      <div className="space-y-8 text-xs leading-relaxed text-[#77716C]">
        {/* Cancellation Section */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E0D8] space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#26231E]">
            <Clock className="w-4 h-4 text-[#A77A7E]" />
            <span>24-Hour Rescheduling & Cancellation Policy</span>
          </div>
          <p>
            {settings.cancellationPolicy}
          </p>
          <p>
            Because our master colorists and bridal artists reserve 1 to 3 uninterrupted hours per client, late cancellations within 24 hours cannot easily be filled. If you need to reschedule, please use your online reference code or notify our concierge as soon as possible.
          </p>
        </div>

        {/* Deposit Policy */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E0D8] space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#26231E]">
            <CreditCard className="w-4 h-4 text-[#A77A7E]" />
            <span>Advance Deposit Policy</span>
          </div>
          <p>
            Advance booking deposits are required for comprehensive bridal couture suites, master balayage, and multi-service appointments exceeding Rs. {settings.depositPolicy.requireForTotalOver.toLocaleString()}.
          </p>
          <p>
            Deposits are fully credited toward your final invoice on the day of treatment. In the event of timely cancellation (24+ hours in advance), deposits can either be fully refunded or held on account for a future date.
          </p>
        </div>

        {/* Studio Etiquette & Arrival */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E0D8] space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#26231E]">
            <ShieldCheck className="w-4 h-4 text-[#A77A7E]" />
            <span>Punctuality & Studio Etiquette</span>
          </div>
          <p>
            We request clients arrive 10 minutes prior to their reserved slot to enjoy a complimentary herbal infusion and settle into their consultation.
          </p>
          <p>
            If you anticipate running late, please alert our reception. Arrivals exceeding 15 minutes past the scheduled slot may require trimming certain steps of the treatment or rescheduling to protect subsequent clients' reservations.
          </p>
        </div>

        {/* Privacy & Data Protection */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E0D8] space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#26231E]">
            <Lock className="w-4 h-4 text-[#A77A7E]" />
            <span>Privacy & Client Confidentiality</span>
          </div>
          <p>
            Your phone number, email address, and booking history are private records strictly confidential to Luma Atelier. We do not sell or transmit client contact details to third-party telemarketers.
          </p>
          <p>
            All before-and-after photography displayed on our public portfolio is published exclusively with the explicit written or oral consent of the client.
          </p>
        </div>
      </div>
    </div>
  );
};
