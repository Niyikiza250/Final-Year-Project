import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Bell,
  Languages,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Megaphone,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useNotificationReadStore } from '@/store/useNotificationReadStore';
import { useHierarchicalAnnouncements } from '@/hooks/useCommunicationModule';
import { ROUTES } from '@/constants/routes';
import { setPreferredLanguage } from '@/lib/language';
import { cn } from '@/lib/utils';
import { getTranslatedRoleLabel } from '@/lib/roles';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
}

const PUBLIC_LINKS = [
  { label: 'home', href: ROUTES.HOME },
  { label: 'achievements', href: ROUTES.ACHIEVEMENTS },
];

function trapFocus(e: KeyboardEvent, container: HTMLElement) {
  if (e.key !== 'Tab') return;
  const items = getFocusable(container);
  if (!items.length) { e.preventDefault(); return; }
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

interface MobileMenuProps {
  hasSidebarLayout?: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ hasSidebarLayout = false }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const { data: announcements = [] } = useHierarchicalAnnouncements();
  const { isRead } = useNotificationReadStore();
  const unreadCount = announcements.filter((a) => !isRead(a.id)).length;

  const close = useCallback(() => { setOpen(false); setLangOpen(false); }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    close();
  };

  const setLang = (lng: 'en' | 'rw') => {
    void i18n.changeLanguage(lng);
    setPreferredLanguage(lng);
    setLangOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, close]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const handleKey = (e: KeyboardEvent) => trapFocus(e, panelRef.current!);
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const itemClass = 'flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-colors text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';
  const iconClass = 'w-4 h-4 text-slate-400 shrink-0';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label={t('common.menu')}
        aria-expanded={open}
      >
        <MoreVertical size={20} />
      </button>

      {/* Fixed backdrop - always rendered, visibility toggles */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/40"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        onClick={close}
        aria-hidden
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      />

      {/* Fixed panel - always rendered, visibility toggles */}
      <motion.div
        ref={panelRef}
        role="menu"
        className="fixed right-2 sm:right-4 top-16 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          scale: open ? 1 : 0.95,
          y: open ? 0 : -8,
        }}
        transition={{ duration: 0.15 }}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <div className="max-h-[80vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {/* User info when authenticated */}
          {user && (
            <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-800/30">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
              <span className="text-[10px] font-extrabold text-sda-blue dark:text-sda-gold uppercase tracking-wider">
                {getTranslatedRoleLabel(user.role, t)}
              </span>
            </div>
          )}

          {!hasSidebarLayout && (
            <div className="py-2">
              {PUBLIC_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={close}
                  className={itemClass}
                >
                  <span className="flex-1 text-left uppercase text-[10px] tracking-widest font-black text-slate-400">
                    {t(`nav.${link.label}`)}
                  </span>
                </Link>
              ))}
              <div className="px-4 py-2 space-y-2">
                <a
                  href="https://sabbath-school.adventech.io/kin"
                  onClick={close}
                  className="flex items-center justify-center w-full rounded-xl border-2 border-sda-blue py-3 text-xs font-black text-sda-blue transition-all active:scale-95"
                >
                  Sabbath School
                </a>
                <a
                  href="https://www.rumadventist.org/"
                  onClick={close}
                  className="flex items-center justify-center w-full rounded-xl bg-sda-blue py-3 text-xs font-black text-white shadow-lg transition-all active:scale-95"
                >
                  Visit Union
                </a>
              </div>
            </div>
          )}

          {/* Notifications */}
          {user && (
            <button
              type="button"
              onClick={() => { navigate(ROUTES.COMMUNICATION); close(); }}
              className={itemClass}
            >
              <span className="relative">
                <Bell className={iconClass} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </span>
              <span className="flex-1 text-left">{t('communication.tabNotifications')}</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-red-100 dark:bg-red-950/60 text-red-600 px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Language */}
          <div>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className={cn(itemClass, 'justify-between')}
            >
              <span className="flex items-center gap-3">
                <Languages className={iconClass} />
                {t('header.changeLanguage')}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">{i18n.language}</span>
            </button>
            <motion.div
              className="overflow-hidden"
              initial={false}
              animate={{ height: langOpen ? 'auto' : 0, opacity: langOpen ? 1 : 0 }}
            >
              <div className="px-4 pb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={cn(
                    'flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors text-center',
                    i18n.language === 'en'
                      ? 'bg-sda-blue text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  )}
                >
                  {t('common.english')}
                </button>
                <button
                  type="button"
                  onClick={() => setLang('rw')}
                  className={cn(
                    'flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors text-center',
                    i18n.language === 'rw'
                      ? 'bg-sda-blue text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  )}
                >
                  {t('common.kinyarwanda')}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => { toggleTheme(); close(); }}
            className={itemClass}
          >
            {theme === 'light' ? <Moon className={iconClass} /> : <Sun className={iconClass} />}
            {t('header.toggleTheme')}
          </button>

          {/* Auth section */}
          {user ? (
            <>
              <Link to={ROUTES.PROFILE} onClick={close} className={itemClass}>
                <User className={iconClass} />
                {t('nav.profile')}
              </Link>
              {user.role === 'SUPER_ADMIN' && (
                <Link to={ROUTES.SETTINGS} onClick={close} className={itemClass}>
                  <Settings className={iconClass} />
                  {t('nav.settings')}
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {t('common.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} onClick={close} className={itemClass}>
                <LogIn className={iconClass} />
                {t('auth.submit')}
              </Link>
              <Link to={ROUTES.REGISTER} onClick={close} className={itemClass}>
                <UserPlus className={iconClass} />
                {t('home.register')}
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
