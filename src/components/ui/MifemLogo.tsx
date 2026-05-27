import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLogoStore } from '@/store/useLogoStore';
import { useTranslation } from 'react-i18next';

interface MifemLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { icon: 28, text: 'text-xs sm:text-lg', tagline: 'text-[7px] sm:text-[9px]' },
  md: { icon: 40, text: 'text-xl sm:text-2xl', tagline: 'text-[9px] sm:text-[10px]' },
  lg: { icon: 48, text: 'text-2xl sm:text-3xl', tagline: 'text-[10px] sm:text-xs' },
  xl: { icon: 56, text: 'text-3xl sm:text-4xl', tagline: 'text-xs sm:text-sm' },
};

const UPLOADS_LOGO = '/upload/MIFEM_logo.png';

export const MifemLogo: React.FC<MifemLogoProps> = ({ className, iconOnly = false, size = 'md' }) => {
  const { t } = useTranslation();
  const s = sizeMap[size];
  const { logoDataUrl, setLogo } = useLogoStore();

  useEffect(() => {
    if (!logoDataUrl) {
      setLogo(UPLOADS_LOGO);
    }
  }, [logoDataUrl, setLogo]);

  const src = logoDataUrl || UPLOADS_LOGO;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative shrink-0 rounded-lg overflow-hidden" style={{ width: s.icon, height: s.icon }}>
        <img
          src={src}
          alt={t('mifem.logoAlt')}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span className={cn('font-extrabold tracking-wider text-sda-blue dark:text-sda-gold', s.text)}>
            {t('mifem.brandName')}
          </span>
          <span className={cn('font-semibold text-slate-500 dark:text-slate-400', s.tagline)}>
            {t('mifem.tagline')}
          </span>
        </div>
      )}
    </div>
  );
};
