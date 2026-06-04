import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import LoadingBlock from '@/components/ui/LoadingBlock';
import { useAchievements } from '@/hooks/useAchievements';
import { ROUTES } from '@/constants/routes';
import type { AchievementKind } from '@/types/achievement';
import { cn } from '@/lib/utils';
import { BookOpen, ImageIcon, Heart, Newspaper, ArrowUpRight, Calendar, User } from 'lucide-react';

const kindIcon: Record<AchievementKind, React.ReactNode> = {
  STORY: <BookOpen size={16} aria-hidden />,
  GALLERY: <ImageIcon size={16} aria-hidden />,
  TESTIMONY: <Heart size={16} aria-hidden />,
  NEWS: <Newspaper size={16} aria-hidden />,
};

const kindLabelKey: Record<AchievementKind, string> = {
  STORY: 'achievements.story',
  GALLERY: 'achievements.gallery',
  TESTIMONY: 'achievements.testimony',
  NEWS: 'achievements.news',
};

const AchievementsModule: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [kind, setKind] = useState<AchievementKind | ''>('');
  const { data: items = [], isLoading } = useAchievements(kind);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [kind]);

  const kinds: (AchievementKind | '')[] = ['', 'GALLERY', 'TESTIMONY', 'NEWS', 'STORY'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={t('achievements.title')}
        subtitle={t('achievements.subtitle')}
        className="mb-8"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {kinds.map((k) => (
          <button
            key={k || 'all'}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              'rounded-xl px-5 py-2.5 text-xs font-black transition-all whitespace-nowrap',
              kind === k
                ? 'bg-sda-blue text-white shadow-lg shadow-sda-blue/20'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-sda-blue/30 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800/50'
            )}
          >
            {k ? t(kindLabelKey[k]) : t('common.all')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                 <BookOpen size={24} className="text-slate-400" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t('achievements.noItems')}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try selecting a different category or check back later.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => navigate(ROUTES.ACHIEVEMENT_DETAILS.replace(':id', item.id))}
                  className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-none"
                >
                  <div className="relative h-56 overflow-hidden">
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sda-blue/10 to-sda-gold/10 dark:from-sda-blue/20 dark:to-sda-gold/20">
                        <div className="rounded-full bg-white/60 p-4 dark:bg-slate-800/60 backdrop-blur-sm">
                          {kindIcon[item.kind]}
                        </div>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 text-[10px] font-black uppercase text-sda-blue dark:text-sda-gold backdrop-blur shadow-sm">
                      {kindIcon[item.kind]}
                      {t(kindLabelKey[item.kind])}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {item.author}
                      </span>
                    </div>

                    <h2 className="mb-3 text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-sda-blue dark:group-hover:text-sda-gold transition-colors">
                      {item.title}
                    </h2>

                    <p className="mb-6 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                      <span className="text-[11px] font-black text-sda-blue dark:text-sda-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('achievements.readMore')}
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AchievementsModule;

