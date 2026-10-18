import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ChevronLeft, ChevronRight, Sparkles, Utensils, Tag, ArrowRight } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { config, openBranchModal, navigateTo } = useRestaurant();

  const slides = [
    {
      id: 1,
      badge: 'Karachi Culinary Heritage',
      headline: 'Authentic Shinwari Karahi & Heritage Clay Cooking',
      subtext:
        'Slow-simmered in cold-pressed mustard oil, vine-ripened tomatoes, and split green chillies in cast-iron woks. Fresh lamb & poultry delivered daily.',
      image:
        'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1600&q=85',
      primaryBtn: { label: 'Order Online Now', action: () => navigateTo('/menu') },
      secondaryBtn: { label: 'Explore Our Story', action: () => navigateTo('/about') },
    },
    {
      id: 2,
      badge: 'Live Sigri Fire & Coals',
      headline: 'Smoked Over Wild Babool Charcoal',
      subtext:
        'Tender mutton seekh kebabs, velvety reshmi malai boti, and flaky charred parathas infused with authentic hardwood smoke.',
      image:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=85',
      primaryBtn: { label: 'View BBQ Selections', action: () => navigateTo('/menu') },
      secondaryBtn: { label: 'Find Nearest Branch', action: openBranchModal },
    },
    {
      id: 3,
      badge: 'Signature Family Feast',
      headline: 'The Grand Dastarkhwan Combo',
      subtext:
        'Generous celebratory banquet serving 5 to 6 persons with Shinwari Karahi, Malai Handi, Saffron Dum Biryani, fresh Roghani Naans, and Matka Kheers.',
      image:
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
      primaryBtn: { label: 'View Family Deals', action: () => navigateTo('/deals') },
      secondaryBtn: { label: 'Order Delivery', action: openBranchModal },
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = slides.length;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused]);

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative bg-[#26231F] text-white overflow-hidden min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Hero Spotlight Carousel"
    >
      {/* Background Image with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000 ease-out"
          />
          {/* Editorial Dark Vignette & Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Slide Kicker / Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#F5E9E2] border-b border-[#B64E35] pb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B64E35]" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.1] text-white">
            {currentSlide.headline}
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans max-w-xl">
            {currentSlide.subtext}
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={currentSlide.primaryBtn.action}
              className="inline-flex items-center gap-2.5 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <span>{currentSlide.primaryBtn.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={currentSlide.secondaryBtn.action}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-6 py-3.5 rounded-xl backdrop-blur-xs transition-colors border border-white/20"
            >
              <span>{currentSlide.secondaryBtn.label}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls: Arrows */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex items-center gap-2 z-10">
        <button
          onClick={prevSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/40 hover:bg-black/70 text-white flex items-center justify-center border border-white/20 backdrop-blur-xs transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/40 hover:bg-black/70 text-white flex items-center justify-center border border-white/20 backdrop-blur-xs transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 flex items-center gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'w-8 bg-[#B64E35]'
                : 'w-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
