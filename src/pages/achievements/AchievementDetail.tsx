import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, User, Tag, BookOpen, ImageIcon, Heart, Newspaper } from 'lucide-react';
import { useAchievement } from '@/hooks/useAchievements';
import { ROUTES } from '@/constants/routes';
import LoadingBlock from '@/components/ui/LoadingBlock';
import EmptyState from '@/components/ui/EmptyState';
import type { AchievementKind } from '@/types/achievement';

const kindIcon: Record<AchievementKind, React.ReactNode> = {
  STORY: <BookOpen size={18} aria-hidden />,
  GALLERY: <ImageIcon size={18} aria-hidden />,
  TESTIMONY: <Heart size={18} aria-hidden />,
  NEWS: <Newspaper size={18} aria-hidden />,
};

const AchievementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: item, isLoading } = useAchievement(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <LoadingBlock />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState
          title={t('achievements.noItems')}
          description="The achievement you are looking for could not be found."
          actionLabel="Back to Achievements"
          onAction={() => navigate(ROUTES.ACHIEVEMENTS)}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl px-4 py-8 sm:py-12"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-sda-blue hover:border-sda-blue transition-all group shadow-sm dark:bg-slate-900 dark:border-slate-800"
        title={t('common.back')}
      >
        <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
      </button>

      <article className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none border border-slate-100 dark:border-slate-800">
        {/* Hero Image */}
        <div className="relative h-64 sm:h-[400px] w-full overflow-hidden">
          {item.coverUrl ? (
            <img
              src={item.coverUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sda-blue/10 to-sda-gold/10 dark:from-sda-blue/20 dark:to-sda-gold/20">
              <div className="rounded-full bg-white/50 p-6 dark:bg-slate-800/50 backdrop-blur-sm">
                {kindIcon[item.kind]}
              </div>
            </div>
          )}
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-900/90 px-4 py-2 text-xs font-bold uppercase text-sda-blue dark:text-sda-gold backdrop-blur shadow-lg">
            {kindIcon[item.kind]}
            {t(`achievements.${item.kind.toLowerCase()}`)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(item.publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {item.author}
            </span>
          </div>

          <h1 className="mb-8 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {item.title}
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
              {item.summary}
            </p>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 pt-8 border-t border-slate-100 dark:border-slate-800">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {item.kind === 'GALLERY' && item.galleryUrls && item.galleryUrls.length > 0 && (
            <div className="mt-12 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Photo Gallery</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {item.galleryUrls.map((url, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group cursor-pointer">
                    <img
                      src={url}
                      alt={`${item.title} - ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate(ROUTES.ACHIEVEMENTS)}
          className="inline-flex items-center gap-2 rounded-2xl bg-sda-blue px-8 py-4 text-sm font-bold text-white shadow-xl shadow-sda-blue/20 hover:bg-sda-blue-dark transition-all hover:-translate-y-1 active:translate-y-0"
        >
          Explore More Achievements
        </button>
      </div>
    </motion.div>
  );
};

export default AchievementDetail;
