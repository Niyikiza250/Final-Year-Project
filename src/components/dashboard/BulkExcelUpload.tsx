import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileSpreadsheet, CheckCircle, XCircle, RefreshCw, Download, Upload
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useBulkImportUsers } from '@/hooks/useAdminUsers';
import type { UserRole } from '@/constants/routes';

const ALLOWED_BULK_ROLES: UserRole[] = ['FIELD_ADMINISTRATOR', 'FIELD_LEADER', 'DISTRICT_LEADER', 'CHURCH_LEADER', 'MINISTRY_LEADER'];
const ROLES: UserRole[] = ['SUPER_ADMIN', 'UNION_LEADER', 'FIELD_ADMINISTRATOR', 'FIELD_LEADER', 'DISTRICT_LEADER', 'CHURCH_LEADER', 'MINISTRY_LEADER', 'MEMBER', 'VOLUNTEER'];

const HIERARCHY_TARGETS: Partial<Record<UserRole, UserRole[]>> = {
  FIELD_ADMINISTRATOR: ['FIELD_LEADER', 'DISTRICT_LEADER', 'CHURCH_LEADER', 'MINISTRY_LEADER', 'MEMBER', 'VOLUNTEER'],
  FIELD_LEADER: ['DISTRICT_LEADER', 'CHURCH_LEADER', 'MINISTRY_LEADER', 'MEMBER', 'VOLUNTEER'],
  DISTRICT_LEADER: ['CHURCH_LEADER', 'MINISTRY_LEADER', 'MEMBER', 'VOLUNTEER'],
  CHURCH_LEADER: ['MINISTRY_LEADER', 'MEMBER', 'VOLUNTEER'],
  MINISTRY_LEADER: ['MEMBER', 'VOLUNTEER'],
};

interface BulkExcelUploadProps {
  buttonClassName?: string;
}

export const BulkExcelUpload: React.FC<BulkExcelUploadProps> = ({ buttonClassName }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const bulkImport = useBulkImportUsers();

  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelPreview, setExcelPreview] = useState<Array<{ name: string; email: string; role: UserRole }> | null>(null);
  const [excelErrors, setExcelErrors] = useState<string[] | null>(null);
  const [importResultCredentials, setImportResultCredentials] = useState<Array<{ name: string; email: string; tempPass: string }> | null>(null);

  const isExcelUploadAllowed = user && ALLOWED_BULK_ROLES.includes(user.role);

  if (!isExcelUploadAllowed) return null;

  const allowedTargets = HIERARCHY_TARGETS[user!.role] || [];

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xlsx') {
      setExcelErrors([t('admin.formatError')]);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setExcelErrors([t('admin.fileTooLarge')]);
      return;
    }

    setExcelFile(file);
    setExcelErrors(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      if (lines.length < 2) {
        setExcelErrors([t('admin.noDataRows')]);
        return;
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const nameIndex = headers.indexOf('name');
      const emailIndex = headers.indexOf('email');
      const roleIndex = headers.indexOf('role');

      if (nameIndex === -1 || emailIndex === -1) {
        setExcelErrors([t('admin.missingColumns')]);
        return;
      }

      const parsedRows: Array<{ name: string; email: string; role: UserRole }> = [];
      const validationErrors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        const rowName = columns[nameIndex];
        const rowEmail = columns[emailIndex];
        let rowRole = (roleIndex !== -1 ? columns[roleIndex]?.toUpperCase() : 'MEMBER') as UserRole;

        if (!ROLES.includes(rowRole)) {
          rowRole = 'MEMBER';
        }

        if (!rowName || !rowEmail) {
          validationErrors.push(t('admin.rowMissingFields', { row: i + 1 }));
          continue;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(rowEmail)) {
          validationErrors.push(t('admin.rowInvalidEmail', { row: i + 1, email: rowEmail }));
          continue;
        }

        if (!allowedTargets.includes(rowRole)) {
          validationErrors.push(`Row ${i + 1}: You are not authorized to create users with role "${rowRole}". Allowed: ${allowedTargets.join(', ')}`);
          continue;
        }

        parsedRows.push({ name: rowName, email: rowEmail, role: rowRole });
      }

      if (validationErrors.length > 0) {
        setExcelErrors(validationErrors);
      }
      setExcelPreview(parsedRows);
    };

    reader.readAsText(file);
  };

  const handleBulkImportSubmit = async () => {
    if (!excelPreview || excelPreview.length === 0) return;

    try {
      const res = await bulkImport.mutateAsync(excelPreview);
      setImportResultCredentials(res);
      setExcelFile(null);
      setExcelPreview(null);
      setExcelErrors(null);
    } catch (err: any) {
      setExcelErrors([err?.message || t('admin.bulkRegistrationFailed')]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setExcelModalOpen(true)}
        className={buttonClassName || "flex items-center gap-2 p-3 rounded-xl bg-sda-gold text-sda-blue text-xs font-bold hover:opacity-90 transition-all w-full"}
      >
        <Upload size={16} />
        {t('admin.attachExcel')}
      </button>

      {excelModalOpen && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 max-w-2xl w-full p-6 rounded-2xl shadow-xl space-y-5 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="text-sda-gold" size={18} />
              {t('admin.excelBulkRegistration')}
            </h3>

            {!importResultCredentials ? (
              <>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-sda-blue/30 transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept=".csv, .xlsx"
                      onChange={handleExcelFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 bg-slate-55 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                        <FileSpreadsheet size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {excelFile ? excelFile.name : t('admin.excelDropPrompt')}
                      </p>
                      <p className="text-[10px] text-slate-400">{t('admin.excelMaxSizeHint')}</p>
                    </div>
                  </div>

                  {excelErrors && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl space-y-1.5 text-xs text-red-700 dark:text-red-400">
                      <div className="flex items-center gap-1 font-bold">
                        <XCircle size={14} /> {t('admin.validationWarnings')}
                      </div>
                      <ul className="list-disc pl-5 text-[10px] space-y-1">
                        {excelErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {excelPreview && excelPreview.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
                        <CheckCircle className="text-green-600" size={12} />
                        {t('admin.importPreview', { count: excelPreview.length })}
                      </p>
                      <div className="overflow-x-auto rounded-xl border border-slate-150 dark:border-slate-800 max-h-[220px]">
                        <table className="w-full text-left text-[11px] min-w-[320px]">
                          <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-450">
                            <tr>
                              <th className="p-3 font-bold">{t('admin.tableName')}</th>
                              <th className="p-3 font-bold">{t('admin.tableEmail')}</th>
                              <th className="p-3 font-bold">{t('admin.tableRole')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {excelPreview.map((row, i) => (
                              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                                <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{row.name}</td>
                                <td className="p-3 text-slate-500">{row.email}</td>
                                <td className="p-3 font-bold text-sda-blue dark:text-sda-gold">{row.role}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setExcelModalOpen(false);
                      setExcelFile(null);
                      setExcelPreview(null);
                      setExcelErrors(null);
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="button"
                    disabled={!excelPreview || excelPreview.length === 0 || bulkImport.isPending}
                    onClick={handleBulkImportSubmit}
                    className="px-6 py-2 bg-sda-blue text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-40 hover:bg-sda-blue-dark flex items-center gap-1.5"
                  >
                    {bulkImport.isPending ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> {t('admin.importRegistering')}
                      </>
                    ) : (
                      t('admin.confirmImport')
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs text-green-700 dark:text-green-400">
                    <CheckCircle size={16} /> {t('admin.bulkSuccess')}
                  </div>
                  <p className="text-[10px] text-green-600 dark:text-green-500 leading-relaxed font-semibold">
                    {t('admin.bulkSuccessDesc', { count: importResultCredentials.length })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-450 uppercase">{t('admin.generatedPasswords')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const csvHeader = 'Name,Email,TemporaryPassword\n';
                        const csvRows = importResultCredentials.map(c => `${c.name},${c.email},${c.tempPass}`).join('\n');
                        const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `imported-credentials-${Date.now()}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-[10px] font-bold text-sda-blue dark:text-sda-gold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Download size={12} /> {t('admin.downloadCsv')}
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-150 dark:border-slate-800 max-h-[220px]">
                    <table className="w-full text-left text-[11px] min-w-[320px]">
                      <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-450">
                        <tr>
                          <th className="p-3 font-bold">{t('admin.tableUser')}</th>
                          <th className="p-3 font-bold">{t('admin.tableEmail')}</th>
                          <th className="p-3 font-bold">{t('admin.tableTemporaryPassword')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResultCredentials.map((cred, i) => (
                          <tr key={i} className="border-b border-slate-100 dark:border-slate-800 font-medium">
                            <td className="p-3 text-slate-700 dark:text-slate-300">{cred.name}</td>
                            <td className="p-3 text-slate-500">{cred.email}</td>
                            <td className="p-3">
                              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-extrabold select-all text-sda-blue dark:text-sda-gold-light border dark:border-slate-700">
                                {cred.tempPass}
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setExcelModalOpen(false);
                      setImportResultCredentials(null);
                    }}
                    className="px-8 py-2.5 bg-sda-blue text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-sda-blue-dark shadow-xs"
                  >
                    {t('admin.finish')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
