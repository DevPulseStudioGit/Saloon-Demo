import React from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Check, Sparkles } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface StylistDetailPageProps {
  stylistId: string;
  navigateTo: (route: string, param?: string) => void;
}

export const StylistDetailPage: React.FC<StylistDetailPageProps> = ({ stylistId, navigateTo }) => {
  const { staff, branches, services, updateBookingDraft } = useSalon();
  const artist = staff.find((s) => s.id === stylistId) || staff[0];

  if (!artist) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-base font-semibold">Artist not found.</p>
        <button onClick={() => navigateTo('team')} className="px-4 py-2 text-xs bg-[#26231E] text-white rounded">
          Back to Team
        </button>
      </div>
    );
  }

  const artistBranches = branches.filter((b) => artist.branches.includes(b.id));
  const artistServices = services.filter((s) => artist.servicesSupported.includes(s.id));

  const handleBook = (serviceId?: string) => {
    updateBookingDraft({
      stylistId: artist.id,
      serviceIds: serviceId ? [serviceId] : []
    });
    navigateTo('booking');
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      <button
        onClick={() => navigateTo('team')}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#77716C] hover:text-[#26231E]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Artists Directory</span>
      </button>

      {/* Hero Profile Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 space-y-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#E7E0D8] shadow-sm">
            <img
              src={artist.photo}
              alt={artist.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Schedule quick review */}
          <div className="p-4 rounded-xl bg-white border border-[#E7E0D8] space-y-2 text-xs">
            <div className="font-semibold text-[#26231E] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#A77A7E]" />
              <span>Weekly In-Studio Schedule</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center pt-1">
              {daysOfWeek.map((day, idx) => {
                const shift = artist.weeklySchedule[idx];
                const isWorking = shift && shift.isWorking;
                return (
                  <div
                    key={day}
                    className={`p-1.5 rounded text-[10px] ${
                      isWorking ? 'bg-[#F7F4EF] text-[#26231E] font-medium' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-[9px]">{isWorking ? 'On' : 'Off'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
              {artist.role}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
              {artist.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#77716C] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Studios: {artistBranches.map((b) => b.name).join(' & ')}</span>
            </div>
          </div>

          <p className="text-sm text-[#77716C] leading-relaxed">
            {artist.bio}
          </p>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#26231E]">
              Key Specialties & Technique
            </h3>
            <div className="flex flex-wrap gap-2">
              {artist.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="text-xs bg-white text-[#26231E] px-3 py-1 rounded-md border border-[#E7E0D8]"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7E0D8]">
            <button
              onClick={() => handleBook()}
              className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors shadow-sm"
            >
              Book an Appointment with {artist.name.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>

      {/* Services Provided by this artist */}
      <div className="space-y-4 pt-6 border-t border-[#E7E0D8]">
        <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
          Treatments by {artist.name.split(' ')[0]}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {artistServices.map((service) => (
            <div
              key={service.id}
              className="p-5 rounded-xl bg-white border border-[#E7E0D8] flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-semibold text-sm text-[#26231E]">{service.name}</div>
                <div className="text-xs text-[#77716C]">{service.durationMinutes} min · Rs. {service.basePrice.toLocaleString()}</div>
              </div>
              <button
                onClick={() => handleBook(service.id)}
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#26231E] rounded hover:bg-[#A77A7E] transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
