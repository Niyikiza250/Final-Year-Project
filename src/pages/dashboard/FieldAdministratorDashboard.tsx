import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Map, Church, Calendar, Megaphone, FileText, Upload,
  ToggleLeft, ToggleRight, Shield, ClipboardList, Activity
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/constants/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { getTranslatedRoleLabel } from '@/lib/roles';
import { MOCK_FIELDS } from '@/data/enterpriseMocks';
import { FIELD_REPORTS } from '@/data/fieldReports';
import HeroManagement from '@/components/admin/HeroManagement';

const DISTRICT_DATA = [
  { district: 'Kigali City', churches: 12, members: 8400 },
  { district: 'Bugesera', churches: 8, members: 5200 },
  { district: 'Rwamagana', churches: 6, members: 3800 },
  { district: 'Gicumbi', churches: 7, members: 4100 },
  { district: 'Musanze', churches: 5, members: 2900 },
];

const BULK_ROLES: UserRole[] = ['DISTRICT_LEADER', 'CHURCH_LEADER', 'MINISTRY_LEADER'];

export const FieldAdministratorDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, excelImportAllowedRoles = ['SUPER_ADMIN'], toggleExcelImportPermission } = useAuthStore();
  const { addToast } = useNotificationStore();

  const fieldId = user?.fieldId || 'FR1';
  const report = FIELD_REPORTS[fieldId] || FIELD_REPORTS.FR1;
  const fieldName = MOCK_FIELDS.find((f) => f.id === fieldId)?.name || 'Field';

  const statsCards = [
    { label: 'Total Districts', value: String(report.districts), icon: <Map className="text-sda-blue" />, desc: 'Active districts' },
    { label: 'Total Churches', value: String(report.churches), icon: <Church className="text-sda-gold" />, desc: 'Organized churches' },
    { label: 'Total Members', value: report.membership, icon: <Users className="text-green-600" />, desc: `Total membership (${fieldName})` },
    { label: 'Total Baptisms', value: report.baptisms, icon: <Calendar className="text-indigo-600" />, desc: `+${report.baptismsDelta.replace('+', '')} this year` },
  ];

  const quickActions = [
    { label: 'Manage Districts', icon: <Map size={16} />, to: ROUTES.DISTRICTS, color: 'bg-sda-blue text-white' },
    { label: 'Manage Churches', icon: <Church size={16} />, to: ROUTES.CHURCHES, color: 'bg-indigo-600 text-white' },
    { label: 'Create Events', icon: <Calendar size={16} />, to: ROUTES.EVENTS, color: 'bg-amber-600 text-white' },
    { label: 'Send Announcements', icon: <Megaphone size={16} />, to: ROUTES.ANNOUNCEMENTS, color: 'bg-emerald-600 text-white' },
    { label: 'View Reports', icon: <FileText size={16} />, to: ROUTES.REPORTS, color: 'bg-slate-700 text-white' },
    { label: 'Audit Logs', icon: <ClipboardList size={16} />, to: ROUTES.AUDIT_LOGS, color: 'bg-rose-600 text-white' },
  ];

  return (
    <div className="space-y-4">
      {/* Field Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-sda-blue/10 rounded-xl">
          <Shield size={20} className="text-sda-blue dark:text-sda-gold" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 dark:text-white">{fieldName}</h1>
          <p className="text-[10px] text-slate-400 font-medium">Field Administrator Dashboard</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400">{stat.label}</span>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">{stat.icon}</div>
            </div>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">{stat.value}</div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Activity size={16} className="text-sda-blue dark:text-sda-gold" />
          {'Quick Actions'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.to}
              className={`flex items-center gap-2 p-3 rounded-xl ${action.color} hover:opacity-90 transition-all text-xs font-bold`}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bulk Registration Permissions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Upload size={16} className="text-sda-blue dark:text-sda-gold" />
              {'Bulk Registration Permissions'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Grant bulk Excel upload access to leaders on the Member Registry page.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 pt-1">
          {BULK_ROLES.map((role) => {
            const isAllowed = excelImportAllowedRoles.includes(role);
            return (
              <button
                key={role}
                onClick={() => {
                  toggleExcelImportPermission(role);
                  addToast({
                    title: isAllowed
                      ? 'Bulk Registration permission disabled successfully.'
                      : 'Bulk Registration permission enabled successfully.',
                    body: '',
                    type: 'SUCCESS',
                    duration: 4000,
                  });
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:opacity-90 cursor-pointer"
              >
                {isAllowed ? (
                  <ToggleRight size={22} className="text-green-600" />
                ) : (
                  <ToggleLeft size={22} className="text-slate-400" />
                )}
                {getTranslatedRoleLabel(role, t)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Section Management */}
      <HeroManagement />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Comparison Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{'District Metrics'}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{'Members & churches by district'}</p>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="district" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="churches" name="Churches" fill="#003087" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


      </div>
    </div>
  );
};
