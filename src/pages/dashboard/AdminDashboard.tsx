import React from 'react';
import { 
  Users, Shield, Server, RefreshCw, Key, Database, AlertTriangle, 
  CheckCircle, Cpu, HardDrive, Terminal, UserPlus, BellRing
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useNotificationStore } from '@/store/useNotificationStore';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AchievementManager } from '@/components/admin/AchievementManager';

const SYSTEM_LOAD_DATA = [
  { time: '12:00', cpu: 25, ram: 48 },
  { time: '12:10', cpu: 32, ram: 50 },
  { time: '12:20', cpu: 55, ram: 52 },
  { time: '12:30', cpu: 40, ram: 51 },
  { time: '12:40', cpu: 28, ram: 49 },
  { time: '12:50', cpu: 35, ram: 49 },
];

export const AdminDashboard: React.FC = () => {
  const { addToast } = useNotificationStore();
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminKPI title={t('adminDashboard.activeUsers')} value="1,248" desc={t('adminDashboard.acrossPortals')} icon={<Users className="text-sda-blue" />} />
        <AdminKPI title={t('adminDashboard.securityScore')} value="98%" desc={t('adminDashboard.protocolsActive')} icon={<Shield className="text-green-600" />} />
        <AdminKPI title={t('adminDashboard.systemUptime')} value="99.98%" desc={t('adminDashboard.viteNodeBackend')} icon={<Server className="text-indigo-600" />} />
        <AdminKPI title={t('adminDashboard.databaseSize')} value="4.8 GB" desc={t('adminDashboard.capacityFree')} icon={<Database className="text-sda-gold" />} />
      </div>

      {/* System Resources & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Load Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{t('adminDashboard.systemResourceLoad')}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{t('adminDashboard.realTimeCpu')}</p>
            </div>
            <div className="flex gap-2 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sda-blue inline-block" /> {t('adminDashboard.cpu')}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sda-gold inline-block" /> {t('adminDashboard.ram')}</span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SYSTEM_LOAD_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stroke="#003087" fillOpacity={0.06} fill="#003087" />
                <Area type="monotone" dataKey="ram" stroke="#C5B358" fillOpacity={0.06} fill="#C5B358" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick System Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-1">{t('adminDashboard.adminActions')}</h3>
            <p className="text-[10px] text-slate-400 font-medium mb-4">{t('adminDashboard.managePermissions')}</p>
          </div>
          <div className="space-y-2">
            <AdminButton label={t('adminDashboard.inviteOperator')} sub={t('adminDashboard.inviteWorkspace')} icon={<UserPlus size={16} />} color="bg-sda-blue text-white hover:bg-sda-blue-dark" />
            <AdminButton label={t('adminDashboard.dbBackup')} sub={t('adminDashboard.runPostgres')} icon={<Database size={16} />} color="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700" />
            <AdminButton label={t('adminDashboard.flushCache')} sub={t('adminDashboard.clearRedis')} icon={<RefreshCw size={16} />} color="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700" />
          </div>
        </div>
      </div>

      {/* Achievement Management */}
      <AchievementManager />

      {/* Security Logs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Terminal size={16} className="text-slate-400" />
          {t('adminDashboard.securityLogs')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                <th className="pb-3">{t('adminDashboard.colAction')}</th>
                <th className="pb-3">{t('adminDashboard.colOperator')}</th>
                <th className="pb-3">{t('adminDashboard.colIp')}</th>
                <th className="pb-3">{t('adminDashboard.colTimestamp')}</th>
                <th className="pb-3">{t('adminDashboard.colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <AuditRow action={t('adminDashboard.mfaBypass')} user="operator.john@mifem.org" ip="197.243.2.14" date={t('adminDashboard.todayTime')} status="warning" />
              <AuditRow action={t('adminDashboard.dbSchemaModified')} user="super.admin@mifem.org" ip="197.243.2.12" date={t('adminDashboard.yesterdayTime')} status="success" />
              <AuditRow action={t('adminDashboard.failedSignin')} user="unknown.user@mifem.org" ip="102.115.42.9" date={t('adminDashboard.failedSigninDate')} status="failed" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminKPI = ({ title, value, desc, icon }: any) => (
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

const AdminButton = ({ label, sub, icon, color }: any) => (
  <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${color}`}>
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs font-bold leading-tight">{label}</p>
        <p className="text-[9px] opacity-70 font-medium">{sub}</p>
      </div>
    </div>
  </button>
);

const AuditRow = ({ action, user, ip, date, status }: any) => {
  const { t } = useTranslation();
  const statusConfig: any = {
    success: { bg: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50', icon: <CheckCircle size={10} />, label: t('common.success') || 'SUCCESS' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50', icon: <AlertTriangle size={10} />, label: t('adminDashboard.statusWarn') },
    failed: { bg: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50', icon: <AlertTriangle size={10} />, label: t('adminDashboard.statusFail') },
  };
  const config = statusConfig[status];
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
      <td className="py-3 font-bold text-slate-700 dark:text-slate-300">{action}</td>
      <td className="py-3 text-slate-500 dark:text-slate-400">{user}</td>
      <td className="py-3 text-slate-500 dark:text-slate-400">{ip}</td>
      <td className="py-3 text-slate-400">{date}</td>
      <td className="py-3">
        <span className={`inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wider ${config.bg}`}>
          {config.icon} {config.label}
        </span>
      </td>
    </tr>
  );
};
