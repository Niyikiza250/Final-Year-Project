export interface HeroSlide {
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

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Transforming Communities Through Technology',
    description: 'MIFEM empowers church leaders with modern tools for member management, event coordination, and seamless communication across every level of your organization.',
    bgImage: '/hero/images/slide-1.png',
    bgColor: 'bg-slate-900',
    overlayFrom: 'from-slate-900/80',
    overlayTo: 'to-slate-950/60',
    primaryCta: { label: 'Get Started', href: '/login' },
    active: true,
  },
  {
    id: 'slide-2',
    title: 'Uniting Leaders for a Connected Mission',
    description: 'From field administrators to ministry leaders, MIFEM provides role-based dashboards and real-time collaboration tools designed for your church organization.',
    bgImage: '/hero/images/slide-2.webp',
    bgColor: 'bg-sda-blue',
    overlayFrom: 'from-sda-blue/85',
    overlayTo: 'to-slate-950/70',
    primaryCta: { label: 'Join Now', href: '/register' },
    active: true,
  },
  {
    id: 'slide-3',
    title: 'Empowering Faith-Driven Innovation',
    description: 'Manage members, track attendance, organize events, and share announcements — all from a single, secure platform built for the unique needs of your church.',
    bgImage: '/hero/images/slide-3.webp',
    bgColor: 'bg-slate-950',
    overlayFrom: 'from-slate-950/85',
    overlayTo: 'to-sda-blue/60',
    primaryCta: { label: 'Get Started', href: '/login' },
    active: true,
  },
];

export const HERO_TITLE = 'Transforming Communities Through Technology';
export const HERO_DESCRIPTION =
  'MIFEM empowers church leaders with modern tools for member management, event coordination, and seamless communication across every level of your organization.';
