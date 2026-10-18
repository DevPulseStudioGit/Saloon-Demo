import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Mail, Send, Check } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface ContactPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigateTo }) => {
  const { settings, branches } = useSalon();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Studios & Concierge
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Visit Our Karachi Destinations
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          We welcome you to our two dedicated ateliers in Clifton and DHA Phase 6. Connect with our concierge team for private consultations or wedding party bookings.
        </p>
      </div>

      {/* Branches Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-[#E7E0D8] p-6 sm:p-8 space-y-5 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
                  {b.name}
                </h2>
                <span className="text-[11px] bg-[#F7F4EF] text-[#A77A7E] font-semibold px-2.5 py-1 rounded">
                  {b.area}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#77716C]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#A77A7E] shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#A77A7E] shrink-0" />
                  <span className="text-[#26231E] font-medium">{b.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#A77A7E] shrink-0" />
                  <span>{b.hours} (Tue – Sun)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E0D8] flex items-center gap-3">
              <a
                href={b.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold text-[#26231E] border border-[#E7E0D8] rounded hover:border-[#26231E] transition-colors"
              >
                Google Maps Directions
              </a>
              <button
                onClick={() => navigateTo('booking')}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
              >
                Book Here
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Form & WhatsApp Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E7E0D8] p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
            Send Concierge Inquiry
          </h2>

          {sentSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-xs text-emerald-800">
              <Check className="w-6 h-6 text-emerald-700 mx-auto" />
              <div className="font-semibold text-sm">Thank You for Reaching Out</div>
              <p>Your inquiry has been received. Our concierge will contact you via WhatsApp or phone within 2 hours.</p>
              <button
                onClick={() => setSentSuccess(false)}
                className="mt-2 text-xs font-semibold text-[#26231E] underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#26231E]">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Siddiqui"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#26231E]">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Message / Inquiries</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Questions about bridal suite reservations, color consultations, or private events..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730] transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Concierge</span>
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 bg-[#26231E] text-white rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold">
              Instant Assistance
            </span>
            <h3 className="text-2xl font-serif-title font-semibold text-white">
              WhatsApp Concierge
            </h3>
            <p className="text-xs text-[#E7E0D8]/80 leading-relaxed">
              Prefer instant messaging? Chat directly with our salon manager on WhatsApp for custom scheduling, photo consultations, and directions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#332E27] border border-[#443E36] space-y-2 text-xs">
            <div className="text-[#C8A96A] font-semibold">Karachi Concierge Desk</div>
            <div className="text-white text-sm font-bold">{settings.whatsapp}</div>
            <div className="text-white/60">Active Tuesday – Sunday: 10:00 AM – 8:00 PM</div>
          </div>

          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold text-[#26231E] bg-[#C8A96A] rounded-md hover:bg-[#D8BA7B] transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open WhatsApp Chat</span>
          </a>
        </div>
      </div>
    </div>
  );
};
