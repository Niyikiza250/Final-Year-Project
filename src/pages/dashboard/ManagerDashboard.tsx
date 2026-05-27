import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, Map, Calendar, FileText, CheckCircle, Clock, 
  ArrowUpRight, AlertCircle, TrendingUp, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { LeaderAchievementForm } from '@/components/leader/LeaderAchievementForm';

const OBS_DATA = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 18 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 24 },
  { month: 'May', count: 32 },
];

export const ManagerDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ManagerKPI title={t('managerDashboard.assignedDirectory')} value={t('managerDashboard.assignedDirectoryValue')} desc={t('managerDashboard.assignedDirectoryDesc')} icon={<Users className="text-sda-blue" />} />
        <ManagerKPI title={t('managerDashboard.strategicGoal')} value={t('managerDashboard.strategicGoalValue')} desc={t('managerDashboard.strategicGoalDesc')} icon={<TrendingUp className="text-sda-gold" />} />
        <ManagerKPI title={t('managerDashboard.upcomingAudits')} value={t('managerDashboard.upcomingAuditsValue')} desc={t('managerDashboard.upcomingAuditsDesc')} icon={<Calendar className="text-indigo-600" />} />
        <ManagerKPI title={t('managerDashboard.pendingApprovals')} value={t('managerDashboard.pendingApprovalsValue')} desc={t('managerDashboard.pendingApprovalsDesc')} icon={<AlertCircle className="text-red-500" />} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Observations chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{t('managerDashboard.obsTrend')}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{t('managerDashboard.obsTrendDesc')}</p>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-bold text-sda-blue dark:text-sda-gold hover:underline">
              {t('managerDashboard.analyticalPanel')} <ArrowUpRight size={12} />
            </button>
          </div>
          
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OBS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" name={t('managerDashboard.obsTrend')} fill="#003087" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Manager Quick Panel & Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <Sparkles size={16} className="text-sda-gold" />
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{t('managerDashboard.managementTasks')}</h3>
            </div>
            <div className="space-y-3">
              <ManagerActionRow label={t('managerDashboard.actionChurchAudit')} desc={t('managerDashboard.actionChurchAuditDesc')} date={t('managerDashboard.actionChurchAuditDate')} />
              <ManagerActionRow label={t('managerDashboard.actionVerifyAttendance')} desc={t('managerDashboard.actionVerifyAttendanceDesc')} date={t('managerDashboard.actionVerifyAttendanceDate')} />
              <ManagerActionRow label={t('managerDashboard.actionSyncBackups')} desc={t('managerDashboard.actionSyncBackupsDesc')} date={t('managerDashboard.actionSyncBackupsDate')} isDone />
            </div>
          </div>
          <button className="w-full mt-4 bg-sda-blue hover:bg-sda-blue-dark dark:bg-sda-gold dark:hover:bg-sda-gold-light dark:text-sda-blue font-bold text-white text-xs py-2.5 rounded-xl cursor-pointer">
            {t('managerDashboard.exportMonthlyLedger')}
          </button>
        </div>
      </div>

      <LeaderAchievementForm />
    </div>
  );
};

const ManagerKPI = ({ title, value, desc, icon }: any) => (
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

const ManagerActionRow = ({ label, desc, date, isDone }: any) => (
  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-xl text-xs flex items-start justify-between gap-2">
    <div>
      <p className={`font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{label}</p>
      <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">{desc}</p>
    </div>
    <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${isDone ? 'bg-green-50 dark:bg-green-950/20 text-green-600' : 'bg-sda-blue/5 text-sda-blue dark:bg-sda-gold/10 dark:text-sda-gold'}`}>
      {date}
    </span>
  </div>
);
