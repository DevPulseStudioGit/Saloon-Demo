import React from 'react';
import { ArrowRight, Sparkles, Clock, CheckCircle2, Star, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

interface HomePageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  const { settings, services, staff, branches, updateBookingDraft } = useSalon();

  // Pick top 4 signature services
  const signatureServices = services.slice(0, 4);
  // Pick top 3 stylists
  const featuredStaff = staff.slice(0, 3);

  const handleBookService = (serviceId: string) => {
    updateBookingDraft({ serviceIds: [serviceId] });
    navigateTo('booking');
  };

  const handleBookStylist = (stylistId: string) => {
    updateBookingDraft({ stylistId });
    navigateTo('booking');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* A. SIGNATURE EDITORIAL HERO */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 lg:pr-6">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E] flex items-center gap-2">
              <span>Bespoke Beauty & Hair Atelier</span>
              <span className="text-[#C8A96A]">·</span>
              <span>Karachi, Pakistan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-semibold tracking-tight text-[#26231E] leading-[1.12]">
              {settings.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-[#77716C] leading-relaxed max-w-xl">
              {settings.heroSubheading}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => navigateTo('booking')}
                className="px-7 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigateTo('services')}
                className="px-6 py-3.5 text-xs uppercase tracking-widest font-semibold text-[#26231E] bg-white border border-[#E7E0D8] rounded-md hover:bg-[#FAF8F4] transition-colors text-center"
              >
                Explore Services
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-[#E7E0D8] grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-serif-title text-xl font-bold text-[#26231E]">2 Studios</div>
                <div className="text-[#77716C]">Clifton & DHA Phase 6</div>
              </div>
              <div>
                <div className="font-serif-title text-xl font-bold text-[#26231E]">Zero Wait</div>
                <div className="text-[#77716C]">Dedicated reserved slots</div>
              </div>
              <div>
                <div className="font-serif-title text-xl font-bold text-[#26231E]">Hospital-Grade</div>
                <div className="text-[#77716C]">Sterile autoclave tools</div>
              </div>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[16/11] shadow-xl border border-[#E7E0D8]">
              <img
                src="/assets/images/luma_hero_salon_1792040701867.jpg"
                alt="Luma Atelier Salon Interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Bottom overlay card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E7E0D8] flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#26231E]">Featured Treatment</div>
                  <div className="text-[#77716C]">Bespoke Balayage & French Acidic Gloss</div>
                </div>
                <div className="text-right">
                  <div className="font-serif-title text-base font-bold text-[#26231E]">From Rs. 26,000</div>
                  <button
                    onClick={() => handleBookService('hair-balayage-gloss')}
                    className="text-[#A77A7E] font-semibold hover:underline"
                  >
                    Reserve Slot →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. THREE-STEP BOOKING SEQUENCE */}
      <section className="bg-white border-y border-[#E7E0D8] py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
              Streamlined Online Experience
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
              How Your Booking Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#F7F4EF] border border-[#E7E0D8] space-y-3">
              <div className="font-serif-title text-2xl font-bold text-[#C8A96A]">01</div>
              <h3 className="text-lg font-semibold text-[#26231E]">Choose Your Service</h3>
              <p className="text-sm text-[#77716C] leading-relaxed">
                Browse our curated menu across Hair Craft, Clinical Skincare, Bridal Couture, and Nail Artistry with clear, transparent pricing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F7F4EF] border border-[#E7E0D8] space-y-3">
              <div className="font-serif-title text-2xl font-bold text-[#C8A96A]">02</div>
              <h3 className="text-lg font-semibold text-[#26231E]">Select Stylist & Time</h3>
              <p className="text-sm text-[#77716C] leading-relaxed">
                Choose your preferred Karachi branch (Clifton or DHA) and specific master artist with guaranteed real-time availability.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F7F4EF] border border-[#E7E0D8] space-y-3">
              <div className="font-serif-title text-2xl font-bold text-[#C8A96A]">03</div>
              <h3 className="text-lg font-semibold text-[#26231E]">Instant Confirmation</h3>
              <p className="text-sm text-[#77716C] leading-relaxed">
                Receive an instant booking reference, WhatsApp updates, and an easy portal to reschedule or cancel up to 24 hours prior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* C. FEATURED SIGNATURE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
              Signature Offerings
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
              Curated Atelier Services
            </h2>
          </div>
          <button
            onClick={() => navigateTo('services')}
            className="text-xs uppercase tracking-widest font-semibold text-[#26231E] hover:text-[#A77A7E] transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View All Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-xl overflow-hidden border border-[#E7E0D8] hover:border-[#A77A7E]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-medium text-[#26231E]">
                    {service.durationMinutes} min
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-serif-title font-semibold text-[#26231E] line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#77716C] leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#F7F4EF] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#77716C] block">Price</span>
                  <span className="font-serif-title font-bold text-base text-[#26231E]">
                    {service.isStartingPrice ? 'From ' : ''}Rs. {service.basePrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleBookService(service.id)}
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#26231E] rounded hover:bg-[#A77A7E] transition-colors"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* D. ATELIER PHILOSOPHY & STORY */}
      <section className="bg-[#26231E] text-[#F7F4EF] py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#C8A96A]">
              The Atelier Standard
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-title font-semibold text-white leading-tight">
              An Architectural Sanctuary for Hair & Skin in Karachi
            </h2>
            <p className="text-sm text-[#E7E0D8]/80 leading-relaxed">
              Founded on the belief that beauty treatments should be unhurried and restorative, Luma Atelier merges clinical dermatological rigor with bespoke French hair design.
            </p>
            <p className="text-sm text-[#E7E0D8]/80 leading-relaxed">
              Every client experiences dedicated one-on-one attention from master stylists in private or semi-private suites designed with raw travertine and warm acoustic acoustics.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('about')}
                className="px-6 py-3 text-xs uppercase tracking-widest font-semibold text-[#26231E] bg-[#C8A96A] rounded hover:bg-[#D8BA7B] transition-colors"
              >
                Our Story & Standards
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#332E27] border border-[#443E36] space-y-3">
              <Sparkles className="w-6 h-6 text-[#C8A96A]" />
              <h3 className="text-lg font-semibold text-white">Custom Formula Formulations</h3>
              <p className="text-xs text-[#E7E0D8]/70 leading-relaxed">
                Color glazes and skin ampoules are custom-blended on the spot based on your natural undertone and skin barrier health.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#332E27] border border-[#443E36] space-y-3">
              <CheckCircle2 className="w-6 h-6 text-[#C8A96A]" />
              <h3 className="text-lg font-semibold text-white">Hospital Autoclave Hygiene</h3>
              <p className="text-xs text-[#E7E0D8]/70 leading-relaxed">
                All metal nail tools and brushes are sealed in medical pouches and steam autoclaved after every single appointment.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#332E27] border border-[#443E36] space-y-3">
              <Clock className="w-6 h-6 text-[#C8A96A]" />
              <h3 className="text-lg font-semibold text-white">Strict Respect for Your Time</h3>
              <p className="text-xs text-[#E7E0D8]/70 leading-relaxed">
                We do not overbook. Your stylist and station are dedicated solely to you for your entire booked duration.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#332E27] border border-[#443E36] space-y-3">
              <MapPin className="w-6 h-6 text-[#C8A96A]" />
              <h3 className="text-lg font-semibold text-white">Two Karachi Destinations</h3>
              <p className="text-xs text-[#E7E0D8]/70 leading-relaxed">
                Visit our Clifton E-Street Flagship or our serene DHA Bukhari Studio with dedicated valet parking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E. MASTER STYLISTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
              Master Artists
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-title font-semibold text-[#26231E]">
              Meet Our Specialists
            </h2>
          </div>
          <button
            onClick={() => navigateTo('team')}
            className="text-xs uppercase tracking-widest font-semibold text-[#26231E] hover:text-[#A77A7E] transition-colors flex items-center gap-1.5"
          >
            <span>View All Artists</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredStaff.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-xl overflow-hidden border border-[#E7E0D8] space-y-4 p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#FAF8F4]">
                  <img
                    src={artist.photo}
                    alt={artist.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-serif-title font-semibold text-[#26231E]">
                    {artist.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#A77A7E] font-medium pt-0.5">
                    {artist.role}
                  </p>
                  <p className="text-xs text-[#77716C] leading-relaxed pt-2">
                    {artist.bio}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-[#77716C]">
                  {artist.specialties.map((spec, i) => (
                    <span key={i} className="inline-block bg-[#F7F4EF] px-2 py-0.5 rounded border border-[#E7E0D8]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E0D8]">
                <button
                  onClick={() => handleBookStylist(artist.id)}
                  className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold text-[#26231E] border border-[#26231E] rounded hover:bg-[#26231E] hover:text-white transition-colors"
                >
                  Book with {artist.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* F. FINAL VIP BOOKING CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-2xl bg-[#26231E] text-white p-8 sm:p-14 text-center space-y-6 relative overflow-hidden border border-[#3D3730]">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold">
              Reserve Your Bespoke Session
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-title font-semibold text-white">
              Your Next Appointment Starts Here.
            </h2>
            <p className="text-sm sm:text-base text-[#E7E0D8]/80 leading-relaxed">
              Experience the quiet luxury of Luma Atelier. Appointments can be scheduled up to 45 days in advance with guaranteed zero wait time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigateTo('booking')}
              className="px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-[#26231E] bg-[#C8A96A] rounded-md hover:bg-[#D8BA7B] transition-colors shadow-lg"
            >
              Book Now
            </button>
            <button
              onClick={() => navigateTo('pricing')}
              className="px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
            >
              Explore Full Price List
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
