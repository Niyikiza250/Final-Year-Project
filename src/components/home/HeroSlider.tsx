import React, { useEffect, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Autoplay, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useHeroStore } from '@/store/useHeroStore';
import { useShallow } from 'zustand/react/shallow';
import EmailSubscription from './EmailSubscription';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HERO_FALLBACK_BG = 'linear-gradient(135deg, #003087 0%, #001a4d 100%)';

const HeroSlider: React.FC = () => {
  const fetchSlides = useHeroStore((s) => s.fetchSlides);
  const loading = useHeroStore((s) => s.loading);
  const initialized = useHeroStore((s) => s.initialized);
  const fetched = useRef(false);
  const swiperRef = useRef<SwiperClass | null>(null);

  const slides = useHeroStore(
    useShallow((s) => s.slides.filter((slide) => slide.active !== false)),
  );

  useEffect(() => {
    if (initialized || fetched.current) return;
    fetched.current = true;
    fetchSlides();
  }, [initialized, fetchSlides]);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    swiperRef.current = swiper;
  }, []);

  if (!initialized || loading) {
    return (
      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-slate-950">
        <Loader2 size={40} className="animate-spin text-sda-gold" />
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-slate-950">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Welcome to MIFEM
          </h1>
          <p className="mt-2 sm:mt-4 text-xs sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
            Stay tuned for updates.
          </p>
        </div>
      </section>
    );
  }

  return (
    <ErrorBoundary>
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Base gradient fallback — always underneath */}
      <div className="absolute inset-0" style={{ background: HERO_FALLBACK_BG }} />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Swiper — backgrounds + content per slide */}
      <Swiper
        modules={[Autoplay, EffectFade, Keyboard, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        keyboard={{ enabled: true }}
        loop={slides.length > 1}
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next',
        }}
        pagination={{
          clickable: true,
          el: '.hero-pagination',
        }}
        onSlideChange={handleSlideChange}
        className="absolute inset-0 w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Per-slide background image — fades via Swiper */}
            {slide.bgImage && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />
            )}
            {/* Content */}
            <div className="relative z-20 flex flex-col items-center sm:items-start justify-center sm:justify-start w-full h-full min-h-screen sm:pt-24 lg:pt-28 px-4 sm:ml-[7cm] sm:max-w-[50%]">
              <div className="w-full text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                  {slide.title}
                </h1>
                <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-white/90 max-w-lg font-medium leading-relaxed [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                  {slide.description}
                </p>
                <div className="mt-4 sm:mt-6 flex justify-center sm:justify-start">
                  <a
                    href={slide.primaryCta.href}
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-sda-gold px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-sda-blue shadow-xl shadow-sda-gold/20 hover:shadow-2xl hover:shadow-sda-gold/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {slide.primaryCta.label}
                    <ChevronRight size={16} className="sm:size-[18px]" />
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination dots — above overlay */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 hero-pagination" />
      <style>{`
        .hero-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.35);
          opacity: 1;
          margin: 0 6px;
        }
        .hero-pagination .swiper-pagination-bullet-active {
          background: #C5B358;
          box-shadow: 0 0 8px rgba(197, 179, 88, 0.5);
        }
      `}</style>

      {/* Subscription bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 xl:bottom-[202px] xl:left-auto xl:translate-x-0 xl:right-[190px] z-30 w-full max-w-lg px-4">
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider text-center mb-3">
          Stay Updated — Subscribe to Our Newsletter
        </p>
        <EmailSubscription />
      </div>

      {/* Navigation Arrows — above overlay */}
      <button
        aria-label="Previous slide"
        className="hero-prev absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg cursor-pointer"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        aria-label="Next slide"
        className="hero-next absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg cursor-pointer"
      >
        <ChevronRight size={22} />
      </button>
    </section>
    </ErrorBoundary>
  );
};

export default HeroSlider;
