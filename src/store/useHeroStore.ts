import { create } from 'zustand';
import type { HeroSlide } from '@/components/home/heroData';
import { HERO_SLIDES } from '@/components/home/heroData';
import {
  fetchHeroSlides,
  saveHeroSlides,
  uploadHeroImage,
} from '@/api/heroSlides';
import type { HeroSlideDTO } from '@/api/heroSlides';

interface HeroState {
  slides: HeroSlide[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  initialized: boolean;

  addSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateSlide: (id: string, updates: Partial<HeroSlide>) => void;
  removeSlide: (id: string) => void;
  reorderSlides: (slides: HeroSlide[]) => void;
  setSlideImage: (id: string, dataUrl: string) => void;
  resetToDefaults: () => void;

  fetchSlides: () => Promise<void>;
  saveToApi: () => Promise<boolean>;
}

function toDTO(s: HeroSlide): HeroSlideDTO {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    bgColor: s.bgColor,
    overlayFrom: s.overlayFrom,
    overlayTo: s.overlayTo,
    bgImage: s.bgImage,
    primaryCta: s.primaryCta,
    active: s.active,
  };
}

export const useHeroStore = create<HeroState>()((set, get) => ({
  slides: [],
  loading: true,
  saving: false,
  error: null,
  initialized: false,

  addSlide: (slide) =>
    set((state) => ({
      slides: [
        ...state.slides,
        { ...slide, active: true, id: `slide_${Date.now()}` },
      ],
    })),

  updateSlide: (id, updates) =>
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    })),

  removeSlide: (id) =>
    set((state) => ({
      slides: state.slides.filter((s) => s.id !== id),
    })),

  reorderSlides: (slides) => set({ slides }),

  setSlideImage: (id, dataUrl) =>
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === id ? { ...s, bgImage: dataUrl } : s,
      ),
    })),

  resetToDefaults: () => set({ slides: [...HERO_SLIDES] }),

  fetchSlides: async () => {
    set({ loading: true, error: null });
    try {
      const dtos = await fetchHeroSlides();
      const slides: HeroSlide[] = dtos.map((d) => ({
        ...d,
        bgColor: d.bgColor || 'bg-slate-900',
        overlayFrom: d.overlayFrom || 'from-slate-900/80',
        overlayTo: d.overlayTo || 'to-slate-950/60',
      }));
      if (slides.length > 0) {
        set({ slides, loading: false, initialized: true });
      } else {
        set({ slides: [], loading: false, initialized: true });
      }
    } catch (err) {
      console.warn('[HeroStore] fetchSlides failed, falling back to defaults:', err);
      set({
        loading: false,
        initialized: true,
        slides: get().slides.length === 0 ? [...HERO_SLIDES] : get().slides,
      });
    }
  },

  saveToApi: async () => {
    set({ saving: true, error: null });
    try {
      const current = get().slides;
      const dtos: HeroSlideDTO[] = [];

      for (const slide of current) {
        let bgImage = slide.bgImage;
        if (bgImage && bgImage.startsWith('data:')) {
          bgImage = await uploadHeroImage(slide.id, bgImage);
        }
        dtos.push({ ...toDTO(slide), bgImage });
      }

      await saveHeroSlides(dtos);
      set({ slides: dtos as HeroSlide[], saving: false });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save hero settings';
      set({ saving: false, error: message });
      return false;
    }
  },
}));
