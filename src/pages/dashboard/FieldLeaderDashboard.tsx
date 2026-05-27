import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, MapPin, Church, TrendingUp, Calendar, ArrowUpRight, 
  FileText, Activity, AlertCircle 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { LeaderAchievementForm } from '@/components/leader/LeaderAchievementForm';

const WEEKLY_TREND = [
  { week: 'W1', attendance: 82 },
  { week: 'W2', attendance: 84 },
  { week: 'W3', attendance: 81 },
  { week: 'W4', attendance: 85 },
  { week: 'W5', attendance: 84 },
];

export const FieldLeaderDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FieldKPI title={t('fieldLeaderDashboard.fieldMembership')} value="12,800" desc={t('fieldLeaderDashboard.centralRegion')} icon={<Users className="text-sda-blue" />} />
        <FieldKPI title={t('fieldLeaderDashboard.oversightZones')} value={t('fieldLeaderDashboard.oversightZonesValue')} desc={t('fieldLeaderDashboard.zonesReporting')} icon={<MapPin className="text-sda-gold" />} />
        <FieldKPI title={t('fieldLeaderDashboard.localChurches')} value={t('fieldLeaderDashboard.organized')} desc={t('fieldLeaderDashboard.activeInMis')} icon={<Church className="text-indigo-600" />} />
        <FieldKPI title={t('fieldLeaderDashboard.avgAttendanceRate')} value="84%" desc={t('fieldLeaderDashboard.deviationWeekly')} icon={<TrendingUp className="text-green-600" />} />
      </div>

      {/* Grid of Chart & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Trend Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{t('fieldLeaderDashboard.regionalAttendanceTrend')}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{t('fieldLeaderDashboard.avgWeeklyCheckin')}</p>
            </div>
            <span className="text-[10px] font-bold bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
              {t('fieldLeaderDashboard.stableWeekly')}
            </span>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" name={t('fieldLeaderDashboard.checkinPercent')} stroke="#003087" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Auditing List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-3">{t('fieldLeaderDashboard.zoneComplianceAuditing')}</h3>
            <div className="space-y-3.5">
              <ZoneComplianceRow zone={t('fieldLeaderDashboard.zoneA')} status="submitted" time={t('fieldLeaderDashboard.hourAgo')} />
              <ZoneComplianceRow zone={t('fieldLeaderDashboard.zoneB')} status="submitted" time={t('fieldLeaderDashboard.hoursAgo')} />
              <ZoneComplianceRow zone={t('fieldLeaderDashboard.zoneC')} status="delayed" time={t('fieldLeaderDashboard.overdueTime')} />
              <ZoneComplianceRow zone={t('fieldLeaderDashboard.zoneD')} status="submitted" time={t('fieldLeaderDashboard.yesterday')} />
            </div>
          </div>
          <button className="w-full mt-4 bg-sda-blue hover:bg-sda-blue-dark dark:bg-sda-gold dark:hover:bg-sda-gold-light dark:text-sda-blue font-bold text-white text-xs py-2.5 rounded-xl cursor-pointer">
            {t('fieldLeaderDashboard.exportRegionalReport')}
          </button>
        </div>
      </div>

      <LeaderAchievementForm />
    </div>
  );
};

const FieldKPI = ({ title, value, desc, icon }: any) => (
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

const ZoneComplianceRow = ({ zone, status, time }: any) => {
  const { t } = useTranslation();
  const isSubmitted = status === 'submitted';
  return (
    <div className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-850 pb-2.5">
      <div>
        <p className="font-bold text-slate-800 dark:text-slate-200">{zone}</p>
        <span className="text-[9px] text-slate-400 font-semibold">{t('fieldLeaderDashboard.weeklyReport')}</span>
      </div>
      <div className="text-right">
        {isSubmitted ? (
          <span className="text-[9px] font-extrabold bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {t('fieldLeaderDashboard.submittedStatus')}
          </span>
        ) : (
          <span className="text-[9px] font-extrabold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
            <AlertCircle size={10} /> {t('fieldLeaderDashboard.overdueStatus')}
          </span>
        )}
        <p className="text-[9px] text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
};
