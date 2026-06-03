import React, { useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ImagePlus, Save, Loader2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useHeroStore } from '@/store/useHeroStore';
import HeroManagement from '@/components/admin/HeroManagement';
import { AchievementManager } from '@/components/admin/AchievementManager';

const HeroControlPage: React.FC = () => {
  const addToast = useNotificationStore((s) => s.addToast);
  const fetchSlides = useHeroStore((s) => s.fetchSlides);
  const saveToApi = useHeroStore((s) => s.saveToApi);
  const saving = useHeroStore((s) => s.saving);
  const loading = useHeroStore((s) => s.loading);
  const error = useHeroStore((s) => s.error);
  const initialized = useHeroStore((s) => s.initialized);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!initialized) {
      fetchSlides();
    }
  }, [initialized, fetchSlides]);

  useEffect(() => {
    if (error) {
      addToast({
        title: 'Save Failed',
        body: error,
        type: 'ALERT',
      });
    }
  }, [error, addToast]);

  const handleSave = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;

    const ok = await saveToApi();

    if (ok) {
      addToast({
        title: 'Settings Saved',
        body: 'Hero settings have been saved successfully!',
        type: 'SUCCESS',
      });
    }

    savingRef.current = false;
  }, [saveToApi, addToast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="p-2.5 bg-sda-blue/10 rounded-xl">
            <ImagePlus size={20} className="text-sda-blue dark:text-sda-gold" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800 dark:text-white">Hero Control</h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Manage the landing page hero slides, content, achievement items, and background images.
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-sda-blue px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-sda-blue/20 hover:shadow-xl hover:shadow-sda-blue/30 hover:bg-sda-blue-dark active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-sda-blue" />
        </div>
      ) : (
        <HeroManagement />
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Trophy size={16} className="text-sda-gold" />
          </div>
          <h2 className="font-extrabold text-sm text-slate-800 dark:text-white">Achievement Management</h2>
        </div>
        <AchievementManager />
      </div>
    </div>
  );
};

export default HeroControlPage;
