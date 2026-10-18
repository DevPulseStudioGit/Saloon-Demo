import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface TeamPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ navigateTo }) => {
  const { staff, branches, updateBookingDraft } = useSalon();

  const handleBookWithArtist = (stylistId: string) => {
    updateBookingDraft({ stylistId });
    navigateTo('booking');
  };

  const handleViewProfile = (stylistId: string) => {
    navigateTo('stylist-detail', stylistId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Artisans of Beauty
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Meet Our Master Artists
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          Our team comprises internationally trained hair architects, clinical skin therapists, and bridal artists who view each appointment as a bespoke collaboration.
        </p>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {staff.map((artist) => {
          const artistBranches = branches.filter((b) => artist.branches.includes(b.id));

          return (
            <div
              key={artist.id}
              className="bg-white rounded-2xl border border-[#E7E0D8] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#A77A7E]/50 transition-all space-y-6"
            >
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#E7E0D8]">
                    <img
                      src={artist.photo}
                      alt={artist.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h2
                      onClick={() => handleViewProfile(artist.id)}
                      className="text-2xl font-serif-title font-semibold text-[#26231E] hover:text-[#A77A7E] transition-colors cursor-pointer"
                    >
                      {artist.name}
                    </h2>
                    <div className="text-xs uppercase tracking-wider text-[#A77A7E] font-medium">
                      {artist.role}
                    </div>
                    <div className="text-[11px] text-[#77716C] flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>{artistBranches.map((b) => b.area).join(' · ')}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#77716C] leading-relaxed">
                  {artist.bio}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#77716C] font-semibold block">
                    Specialties & Craft
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {artist.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-[#F7F4EF] text-[#26231E] px-2.5 py-1 rounded-md border border-[#E7E0D8]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E0D8] flex items-center justify-between gap-4">
                <button
                  onClick={() => handleViewProfile(artist.id)}
                  className="text-xs font-semibold text-[#77716C] hover:text-[#26231E]"
                >
                  View Profile & Work
                </button>

                <button
                  onClick={() => handleBookWithArtist(artist.id)}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730] transition-colors"
                >
                  Book with {artist.name.split(' ')[0]}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
