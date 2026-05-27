import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ComposedChart,
} from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import ExportMenu from '@/components/ui/ExportMenu';
import { useAttendanceTrends } from '@/hooks/useAttendanceModule';

const MINISTRY = [
  { name: 'Sabbath School', value: 420 },
  { name: 'Youth', value: 310 },
  { name: 'Health', value: 260 },
  { name: 'Stewardship', value: 180 },
  { name: 'Publishing', value: 140 },
];

const COMBINED = [
  { m: 'Jan', worship: 820, ss: 540, outreach: 210 },
  { m: 'Feb', worship: 840, ss: 560, outreach: 230 },
  { m: 'Mar', worship: 860, ss: 575, outreach: 250 },
  { m: 'Apr', worship: 855, ss: 580, outreach: 260 },
  { m: 'May', worship: 880, ss: 600, outreach: 275 },
];

const ReportsAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const { data: trends = [] } = useAttendanceTrends();
  const [note, setNote] = React.useState<string | null>(null);

  const handleExport = (fmt: 'csv' | 'pdf' | 'xlsx') => {
    setNote(`${fmt.toUpperCase()} — ${t('reports.exportSection')} (demo)`);
    setTimeout(() => setNote(null), 2200);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <PageHeader title={t('reports.title')} subtitle={t('reports.subtitle')} actions={<ExportMenu onExport={handleExport} />} />
      {note && (
        <div role="status" className="rounded-xl bg-sda-gold/20 px-4 py-2 text-center text-sm font-medium text-sda-blue">
          {note}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { k: 'kpiMembership', v: '48,254', d: '+2.1%' },
          { k: 'kpiBaptisms', v: '1,842', d: '+86' },
          { k: 'kpiGroups', v: '3,120', d: '+42' },
          { k: 'kpiVolunteers', v: '9,400', d: '+3%' },
        ].map((card, i) => (
          <motion.div
            key={card.k}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t(`reports.${card.k}` as 'reports.kpiMembership')}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{card.v}</p>
            <p className="mt-1 text-xs font-bold text-green-600">{card.d}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-bold text-slate-900 dark:text-white">{t('reports.ministryTitle')}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MINISTRY} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#003087" radius={[0, 8, 8, 0]} name="Participants" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-bold text-slate-900 dark:text-white">{t('reports.trendTitle')}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COMBINED}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="worship" stroke="#003087" strokeWidth={2} dot />
                <Line type="monotone" dataKey="ss" stroke="#C5B358" strokeWidth={2} dot />
                <Line type="monotone" dataKey="outreach" stroke="#002261" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-bold text-slate-900 dark:text-white">{t('attendance.trendTitle')}</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[60, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="right" dataKey="participants" fill="#C5B358" name="Participants" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#003087" strokeWidth={2} name="Rate %" dot />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default ReportsAnalytics;
