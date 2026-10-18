import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Check } from 'lucide-react';

interface AboutPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigateTo }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Editorial Hero */}
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          The Atelier Philosophy
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Quiet Luxury & Dedicated Beauty Craft in Karachi
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          Luma Atelier was established to reimagine the salon experience in Pakistan — away from noisy, rushed assembly-line parlors, toward architectural calm and clinical precision.
        </p>
      </div>

      {/* Narrative & Visual Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5 text-sm text-[#77716C] leading-relaxed">
          <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
            A Personalised Sanctuary for Hair, Skin & Bridal Art
          </h2>
          <p>
            Operating across two bespoke destinations in Karachi — our Clifton E-Street Flagship and our DHA Bukhari Studio — each space was intentionally designed with natural travertine stone, acoustic baffling, and warm natural lighting to create an environment where clients can decompress.
          </p>
          <p>
            We believe that hair coloring and skincare must never follow cookie-cutter formulas. A balayage at Luma Atelier is hand-painted in accordance with the direction of your hair growth, bone structure, and lifestyle maintenance desires.
          </p>
          <p>
            Our aesthetic facials combine medical-grade extractions with lymphatic manual contouring, leaving skin visibly lifted with zero capillary downtime.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden border border-[#E7E0D8] shadow-md aspect-[4/3]">
            <img
              src="/assets/images/luma_hero_salon_1792040701867.jpg"
              alt="Luma Atelier Interior"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[#E7E0D8]">
        <div className="p-6 rounded-2xl bg-white border border-[#E7E0D8] space-y-3">
          <ShieldCheck className="w-6 h-6 text-[#A77A7E]" />
          <h3 className="text-lg font-semibold text-[#26231E]">Medical-Grade Sterilization</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            All nail tools and metallic implements undergo hospital autoclave sterilization and are unsealed from individual pouches in front of you.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E0D8] space-y-3">
          <Sparkles className="w-6 h-6 text-[#A77A7E]" />
          <h3 className="text-lg font-semibold text-[#26231E]">European Botanical Formulas</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            We work exclusively with formaldehyde-free smoothing keratin, ammonia-reduced gloss glazes, and clean bioactive dermatological serums.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E0D8] space-y-3">
          <Heart className="w-6 h-6 text-[#A77A7E]" />
          <h3 className="text-lg font-semibold text-[#26231E]">Guaranteed Zero Wait Policy</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            We limit total daily bookings to ensure your specialist begins immediately at your reserved slot time with undivided attention.
          </p>
        </div>
      </div>

      {/* Team CTA */}
      <div className="p-8 rounded-2xl bg-[#26231E] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-serif-title font-semibold text-white">
            Meet the Master Artists
          </h3>
          <p className="text-xs text-[#E7E0D8]/80 pt-1">
            Discover the specialists who bring the Luma Atelier vision to life every day.
          </p>
        </div>
        <button
          onClick={() => navigateTo('team')}
          className="px-6 py-3 text-xs uppercase tracking-widest font-semibold text-[#26231E] bg-[#C8A96A] rounded hover:bg-[#D8BA7B] transition-colors shrink-0"
        >
          View Team Profiles
        </button>
      </div>
    </div>
  );
};
