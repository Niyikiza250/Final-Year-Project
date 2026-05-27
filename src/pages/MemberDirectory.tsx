import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useMembers } from '@/services/memberService';
import { MemberStatus } from '@/types/member';
import { UserRole, ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { getTranslatedRoleLabel } from '@/lib/roles';
import { 
  Search, UserPlus, Eye, Edit, Trash2, Loader2, 
  Download, Filter, ChevronLeft, ChevronRight, MoreHorizontal 
} from 'lucide-react';
import { clsx } from 'clsx';

const MemberDirectory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | ''>('');
  const [fieldFilter, setFieldFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useMembers({
    search,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    field: fieldFilter || undefined,
    page,
    limit: 10,
  });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  const handleExport = (type: 'CSV' | 'PDF') => {
    console.log(`Exporting as ${type}...`);
    // Implementation for export would go here
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('member.directoryHeading')}</h1>
          <p className="text-sm text-slate-500">{t('member.directorySubtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
            <button 
              onClick={() => handleExport('CSV')}
              className="p-2 text-slate-600 hover:text-sda-blue transition-colors flex items-center text-xs font-bold"
            >
              <Download size={16} className="mr-1" /> {t('common.exportCsv')}
            </button>
            <div className="w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
            <button 
              onClick={() => handleExport('PDF')}
              className="p-2 text-slate-600 hover:text-sda-blue transition-colors flex items-center text-xs font-bold"
            >
              <Download size={16} className="mr-1" /> {t('common.exportPdf')}
            </button>
          </div>
          {isAdmin && (
            <Link 
              to={ROUTES.MEMBER_ADD}
              className="bg-sda-blue hover:bg-sda-blue-dark text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <UserPlus size={18} />
              <span className="font-bold">{t('member.addMember')}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t('member.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-sda-blue transition-all"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              "flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all font-bold text-sm",
              showFilters ? "bg-sda-blue text-white border-sda-blue" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600"
            )}
          >
            <Filter size={18} />
            <span>{t('common.filter')}</span>
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
            <FilterSelect label={t('member.filterRole')} value={roleFilter} onChange={setRoleFilter}>
              <option value="">{t('member.allRoles')}</option>
              <option value="MEMBER">{t('member.roleChurchMember')}</option>
              <option value="CHURCH_LEADER">{t('member.roleChurchLeader')}</option>
              <option value="FIELD_LEADER">{t('member.roleFieldLeader')}</option>
              <option value="UNION_LEADER">{t('member.roleUnionLeader')}</option>
              <option value="ADMIN">{t('member.roleSystemAdmin')}</option>
            </FilterSelect>

            <FilterSelect label={t('member.filterStatus')} value={statusFilter} onChange={setStatusFilter}>
              <option value="">{t('member.allStatuses')}</option>
              <option value="ACTIVE">{t('member.statusActive')}</option>
              <option value="INACTIVE">{t('member.statusInactive')}</option>
              <option value="TRANSFERRED">{t('member.statusTransferred')}</option>
              <option value="DECEASED">{t('member.statusDeceased')}</option>
            </FilterSelect>

            <FilterSelect label={t('member.filterField')} value={fieldFilter} onChange={setFieldFilter}>
              <option value="">{t('member.allFields')}</option>
              <option value="Central Rwanda Field">{t('member.fieldCentral')}</option>
              <option value="West Rwanda Field">{t('member.fieldWest')}</option>
              <option value="East Rwanda Field">{t('member.fieldEast')}</option>
              <option value="North Rwanda Field">{t('member.fieldNorth')}</option>
              <option value="South Rwanda Field">{t('member.fieldSouth')}</option>
            </FilterSelect>

            <div className="flex items-end">
              <button 
                onClick={() => { setRoleFilter(''); setStatusFilter(''); setFieldFilter(''); setSearch(''); }}
                className="text-xs font-bold text-red-500 hover:text-red-600 underline"
              >
                {t('member.clearFilters')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">{t('member.tableName')}</th>
                <th className="px-6 py-4">{t('member.tableRole')}</th>
                <th className="px-6 py-4">{t('member.tablePlacement')}</th>
                <th className="px-6 py-4">{t('common.status')}</th>
                <th className="px-6 py-4 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <TableSkeleton />
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">{t('member.noResults')}</td>
                </tr>
              ) : (
                data?.data.map((member) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    onClick={() => navigate(ROUTES.MEMBER_DETAILS.replace(':id', member.id))}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-xl bg-sda-blue/10 dark:bg-sda-blue/20 flex items-center justify-center text-sda-blue font-bold shadow-inner">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sda-blue transition-colors">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-slate-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                        {getTranslatedRoleLabel(member.role, t)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{member.churchName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{member.fieldName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={clsx(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter border",
                        member.status === 'ACTIVE' ? "bg-green-50 text-green-700 border-green-200" :
                        member.status === 'INACTIVE' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-50 text-slate-600 border-slate-200"
                      )}>
                        <span className={clsx("w-1.5 h-1.5 rounded-full mr-1.5", 
                          member.status === 'ACTIVE' ? "bg-green-500" : 
                          member.status === 'INACTIVE' ? "bg-amber-500" : "bg-slate-400"
                        )}></span>
                        {member.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => navigate(ROUTES.MEMBER_DETAILS.replace(':id', member.id))}
                          className="p-2 text-slate-400 hover:text-sda-blue hover:bg-sda-blue/5 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        {isAdmin && (
                          <>
                            <button 
                              onClick={() => navigate(ROUTES.MEMBER_EDIT.replace(':id', member.id))}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs font-medium text-slate-500">
            {t('member.paginateShowing', { from: (page - 1) * 10 + 1, to: Math.min(page * 10, data?.total || 0), total: data?.total || 0 })}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={clsx(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    page === i + 1 ? "bg-sda-blue text-white shadow-md shadow-sda-blue/20" : "text-slate-500 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  )}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
            </div>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponents
const FilterSelect = ({ label, value, onChange, children }: any) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <select 
      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-sda-blue transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  </div>
);

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
            <div className="ml-4 space-y-2">
              <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
              <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
        <td className="px-6 py-4 space-y-2">
          <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
        </td>
        <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
        <td className="px-6 py-4"><div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded ml-auto"></div></td>
      </tr>
    ))}
  </>
);

export default MemberDirectory;
