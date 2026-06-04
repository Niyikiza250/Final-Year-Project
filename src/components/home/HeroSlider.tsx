import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Autoplay, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeroStore } from '@/store/useHeroStore';
import { useShallow } from 'zustand/react/shallow';
import EmailSubscription from './EmailSubscription';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { cn } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HERO_FALLBACK_BG = 'linear-gradient(135deg, #003087 0%, #001a4d 100%)';

interface ExpandableDescriptionProps {
  text: string;
  onToggle: (isExpanded: boolean) => void;
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({ text, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    onToggle(nextState);
  };

  return (
    <div className="space-y-3">
      <motion.div
        animate={{ height: isExpanded ? 'auto' : '1.6em' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className={cn(
          "text-sm sm:text-base lg:text-lg text-white/95 max-w-2xl font-medium leading-relaxed [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] transition-all",
          !isExpanded && "line-clamp-1"
        )}>
          {text}
        </p>
      </motion.div>
      <button
        onClick={toggle}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-sda-gold hover:text-sda-gold-light transition-colors uppercase tracking-wider bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10"
      >
        {isExpanded ? (
          <>Show Less <ChevronUp size={14} /></>
        ) : (
          <>Read More <ChevronDown size={14} /></>
        )}
      </button>
    </div>
  );
};

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

  const handleDescriptionToggle = useCallback((isExpanded: boolean) => {
    if (swiperRef.current) {
      if (isExpanded) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
    }
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
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-[1.05] tracking-tight">
            Welcome to MIFEM
          </h1>
          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
            Stay tuned for updates.
          </p>
        </div>
      </section>
    );
  }

  return (
    <ErrorBoundary>
    <section className="relative w-full min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0" style={{ background: HERO_FALLBACK_BG }} />

      <Swiper
        modules={[Autoplay, EffectFade, Keyboard, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
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
          <SwiperSlide key={slide.id} className="relative overflow-hidden group">
            {slide.bgImage && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-105"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />
            )}
            
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div 
              className={`absolute inset-0 bg-gradient-to-r ${slide.overlayFrom || 'from-slate-950/70'} ${slide.overlayTo || 'to-transparent'} z-10 opacity-80`} 
            />

            <div className="relative z-20 flex flex-col items-center sm:items-start justify-center w-full h-full min-h-screen px-6 sm:px-12 md:px-20 lg:px-32 xl:px-48">
              <div className="w-full max-w-3xl text-center sm:text-left space-y-5 sm:space-y-7">
                <div className="space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight [text-shadow:0_4px_12px_rgba(0,0,0,0.8)]">
                    {slide.title}
                  </h1>
                  <ExpandableDescription text={slide.description} onToggle={handleDescriptionToggle} />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start pt-2">
                  <Link
                    to={slide.primaryCta.href}
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl bg-sda-gold hover:bg-sda-gold-light px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-sda-blue shadow-2xl shadow-sda-gold/20 hover:shadow-sda-gold/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                  >
                    {slide.primaryCta.label}
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination dots — mobile view only */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 hero-pagination md:hidden" />
      <style>{`
        .hero-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          margin: 0 6px !important;
          transition: all 0.3s ease;
        }
        .hero-pagination .swiper-pagination-bullet-active {
          background: #C5B358;
          width: 24px;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(197, 179, 88, 0.5);
        }
      `}</style>

      {/* Subscription bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 xl:bottom-[120px] xl:left-auto xl:translate-x-0 xl:right-[8%] z-30 w-full max-w-md px-4">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] text-center mb-4">
          Stay Connected with our Mission
        </p>
        <EmailSubscription />
      </div>

      {/* Navigation Arrows — Now visible on all devices with mobile-optimized styling */}
      <button
        aria-label="Previous slide"
        className="hero-prev absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl cursor-pointer active:scale-90"
      >
        <ChevronLeft size={20} className="sm:size-6" />
      </button>
      <button
        aria-label="Next slide"
        className="hero-next absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl cursor-pointer active:scale-90"
      >
        <ChevronRight size={20} className="sm:size-6" />
      </button>
    </section>
    </ErrorBoundary>
  );
};

export default HeroSlider;
