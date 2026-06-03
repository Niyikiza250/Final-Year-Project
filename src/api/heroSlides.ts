import apiClient from './client';

export interface HeroSlideDTO {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  overlayFrom: string;
  overlayTo: string;
  bgImage?: string;
  primaryCta: { label: string; href: string };
  active: boolean;
}

export interface HeroSlidePayload extends HeroSlideDTO {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export async function fetchHeroSlides(): Promise<HeroSlideDTO[]> {
  const { data } = await apiClient.get<HeroSlideDTO[]>('/hero-slides');
  return data;
}

export async function saveHeroSlides(
  slides: HeroSlideDTO[],
): Promise<{ ok: boolean }> {
  const { data } = await apiClient.put<{ ok: boolean }>('/hero-slides', {
    slides,
  });
  return data;
}

export async function uploadHeroImage(
  slideId: string,
  dataUrl: string,
): Promise<string> {
  const { data } = await apiClient.put<{ path: string }>(
    `/hero-slides/${slideId}/image`,
    { dataUrl },
  );
  return data.path;
}
