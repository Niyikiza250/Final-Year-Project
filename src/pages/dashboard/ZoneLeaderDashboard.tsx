import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, Church, Calendar, Award, FileText, CheckCircle, Clock, 
  ChevronRight, ArrowUpRight 
} from 'lucide-react';
import { LeaderAchievementForm } from '@/components/leader/LeaderAchievementForm';

export const ZoneLeaderDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ZoneKPI title={t('zoneLeaderDashboard.zoneMembership')} value={t('zoneLeaderDashboard.zoneMembershipValue')} desc={t('zoneLeaderDashboard.zoneMembershipDesc')} icon={<Users className="text-sda-blue" />} />
        <ZoneKPI title={t('zoneLeaderDashboard.activeChurches')} value={t('zoneLeaderDashboard.activeChurchesValue')} desc={t('zoneLeaderDashboard.activeChurchesDesc')} icon={<Church className="text-sda-gold" />} />
        <ZoneKPI title={t('zoneLeaderDashboard.zoneWideEvents')} value={t('zoneLeaderDashboard.zoneWideEventsValue')} desc={t('zoneLeaderDashboard.zoneWideEventsDesc')} icon={<Calendar className="text-indigo-600" />} />
        <ZoneKPI title={t('zoneLeaderDashboard.ytdBaptisms')} value={t('zoneLeaderDashboard.ytdBaptismsValue')} desc={t('zoneLeaderDashboard.ytdBaptismsDesc')} icon={<Award className="text-green-600" />} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Church Compliance Sheet */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{t('zoneLeaderDashboard.churchReportSubmissions')}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{t('zoneLeaderDashboard.churchReportSubmissionsDesc')}</p>
            </div>
            <button className="text-[10px] font-bold text-sda-blue dark:text-sda-gold flex items-center gap-0.5 hover:underline">
              {t('zoneLeaderDashboard.remindDelayed')} <ChevronRight size={12} />
            </button>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
            <ChurchStatusRow name={t('zoneLeaderDashboard.church1Name')} pastor={t('zoneLeaderDashboard.church1Pastor')} status="success" time={t('zoneLeaderDashboard.church1Time')} />
            <ChurchStatusRow name={t('zoneLeaderDashboard.church2Name')} pastor={t('zoneLeaderDashboard.church2Pastor')} status="success" time={t('zoneLeaderDashboard.church2Time')} />
            <ChurchStatusRow name={t('zoneLeaderDashboard.church3Name')} pastor={t('zoneLeaderDashboard.church3Pastor')} status="pending" time={t('zoneLeaderDashboard.church3Time')} />
            <ChurchStatusRow name={t('zoneLeaderDashboard.church4Name')} pastor={t('zoneLeaderDashboard.church4Pastor')} status="success" time={t('zoneLeaderDashboard.church4Time')} />
          </div>
        </div>

        {/* Zone Action Board */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-3">{t('zoneLeaderDashboard.zoneDirectives')}</h3>
            <div className="space-y-3">
              <ZoneDirectiveItem label={t('zoneLeaderDashboard.directiveTraining')} desc={t('zoneLeaderDashboard.directiveTrainingDesc')} date={t('zoneLeaderDashboard.directiveTrainingDate')} />
              <ZoneDirectiveItem label={t('zoneLeaderDashboard.directiveAudit')} desc={t('zoneLeaderDashboard.directiveAuditDesc')} date={t('zoneLeaderDashboard.directiveAuditDate')} />
            </div>
          </div>
          <button className="w-full mt-4 bg-sda-blue hover:bg-sda-blue-dark dark:bg-sda-gold dark:hover:bg-sda-gold-light dark:text-sda-blue font-bold text-white text-xs py-2.5 rounded-xl cursor-pointer">
            {t('zoneLeaderDashboard.publishZoneAnnouncements')}
          </button>
        </div>
      </div>

      <LeaderAchievementForm />
    </div>
  );
};

const ZoneKPI = ({ title, value, desc, icon }: any) => (
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

const ChurchStatusRow = ({ name, pastor, status, time }: any) => {
  const { t } = useTranslation();
  const isSuccess = status === 'success';
  return (
    <div className="py-3 flex items-center justify-between">
      <div>
        <p className="font-bold text-slate-800 dark:text-slate-200">{name}</p>
        <p className="text-[10px] text-slate-400 font-medium">{t('zoneLeaderDashboard.pastorLabel')} {pastor}</p>
      </div>
      <div className="text-right">
        {isSuccess ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full uppercase">
            <CheckCircle size={10} /> {t('zoneLeaderDashboard.statusOk')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase">
            <Clock size={10} /> {t('zoneLeaderDashboard.statusPending')}
          </span>
        )}
        <p className="text-[9px] text-slate-400 mt-1 font-medium">{time}</p>
      </div>
    </div>
  );
};

const ZoneDirectiveItem = ({ label, desc, date }: any) => (
  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-xl text-xs">
    <p className="font-bold text-slate-800 dark:text-slate-200">{label}</p>
    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{desc}</p>
    <span className="text-[9px] text-sda-blue dark:text-sda-gold font-extrabold mt-1.5 inline-block">{date}</span>
  </div>
);
