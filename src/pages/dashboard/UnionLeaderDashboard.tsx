import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, Map, Church, Award, FileText, Share2, TrendingUp, Calendar, ArrowUpRight 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LeaderAchievementForm } from '@/components/leader/LeaderAchievementForm';

const UNION_FIELD_DATA = [
  { field: 'Central RW', members: 15400, baptisms: 1250 },
  { field: 'Western RW', members: 12800, baptisms: 1100 },
  { field: 'Eastern RW', members: 9200, baptisms: 740 },
  { field: 'Southern RW', members: 6400, baptisms: 520 },
  { field: 'Northern RW', members: 4454, baptisms: 350 },
];

export const UnionLeaderDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UnionKPI title={t('unionLeaderDashboard.totalUnionMembership')} value={t('unionLeaderDashboard.totalUnionMembershipValue')} desc={t('unionLeaderDashboard.growthYtd')} icon={<Users className="text-sda-blue" />} />
        <UnionKPI title={t('unionLeaderDashboard.activeFields')} value={t('unionLeaderDashboard.activeFieldsValue')} desc={t('unionLeaderDashboard.submissionRate')} icon={<Map className="text-sda-gold" />} />
        <UnionKPI title={t('unionLeaderDashboard.organizedChurches')} value={t('unionLeaderDashboard.organizedChurchesValue')} desc={t('unionLeaderDashboard.newlyOrganized')} icon={<Church className="text-indigo-600" />} />
        <UnionKPI title={t('unionLeaderDashboard.ytdBaptisms')} value={t('unionLeaderDashboard.ytdBaptismsValue')} desc={t('unionLeaderDashboard.goalBaptisms')} icon={<Award className="text-green-600" />} />
      </div>

      {/* Analytics Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Field Comparison chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{t('unionLeaderDashboard.fieldComparisonMetrics')}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{t('unionLeaderDashboard.fieldComparisonDesc')}</p>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-bold text-sda-blue dark:text-sda-gold hover:underline">
              {t('unionLeaderDashboard.viewDetailedMetrics')} <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UNION_FIELD_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="field" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="members" name={t('unionLeaderDashboard.totalUnionMembership')} fill="#003087" radius={[4, 4, 0, 0]} />
                <Bar dataKey="baptisms" name={t('unionLeaderDashboard.ytdBaptisms')} fill="#C5B358" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Union Announcements */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-3">{t('unionLeaderDashboard.strategicActionCenter')}</h3>
            <div className="space-y-3">
              <UnionActionItem label={t('unionLeaderDashboard.actionPublishDirective')} desc={t('unionLeaderDashboard.actionPublishDirectiveDesc')} icon={<Share2 size={14} />} />
              <UnionActionItem label={t('unionLeaderDashboard.actionBudgetStatus')} desc={t('unionLeaderDashboard.actionBudgetStatusDesc')} icon={<FileText size={14} />} />
              <UnionActionItem label={t('unionLeaderDashboard.actionLeadershipSummit')} desc={t('unionLeaderDashboard.actionLeadershipSummitDesc')} icon={<Calendar size={14} />} />
            </div>
          </div>
          <button className="w-full mt-4 bg-sda-blue hover:bg-sda-blue-dark dark:bg-sda-gold dark:hover:bg-sda-gold-light dark:text-sda-blue font-bold text-white text-xs py-2.5 rounded-xl cursor-pointer">
            {t('unionLeaderDashboard.strategicReportsPanel')}
          </button>
        </div>
      </div>

      <LeaderAchievementForm />
    </div>
  );
};

const UnionKPI = ({ title, value, desc, icon }: any) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden group">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-bold text-slate-400">{title}</span>
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:scale-105 transition-transform duration-300">
        {icon}
      </div>
    </div>
    <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</div>
    <p className="text-[10px] text-slate-400 font-medium mt-1">{desc}</p>
  </div>
);

const UnionActionItem = ({ label, desc, icon }: any) => (
  <div className="flex gap-3 p-2.5 rounded-xl border border-slate-50 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg h-max shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{label}</p>
      <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">{desc}</p>
    </div>
  </div>
);
