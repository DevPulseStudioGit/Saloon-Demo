import React, { useEffect, useMemo, useState } from 'react';
import { FileText, RefreshCw, Search } from 'lucide-react';
import { AuditLogItem } from '../../types';
import { StorageService } from '../../services/storage';

export const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>(() => StorageService.getAuditLogs());
  const [search, setSearch] = useState('');

  const refresh = () => setLogs(StorageService.getAuditLogs());

  useEffect(() => {
    window.addEventListener('luma_data_updated', refresh);
    return () => window.removeEventListener('luma_data_updated', refresh);
  }, []);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;
    return logs.filter((log) =>
      [log.user, log.role, log.action, log.details].some((value) => value.toLowerCase().includes(query))
    );
  }, [logs, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">Audit Trail</h1>
          <p className="text-xs text-[#77716C] pt-0.5">A complete activity history for bookings, staff, settings, and salon operations.</p>
        </div>
        <button onClick={refresh} className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-white border border-[#E7E0D8] rounded-lg hover:border-[#26231E]">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#77716C]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search user, action, role, or details"
          className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E7E0D8] rounded-xl focus:outline-none focus:border-[#26231E]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#77716C]">
            <FileText className="w-8 h-8 mx-auto mb-2 text-[#A77A7E]" />
            No audit records match your search.
          </div>
        ) : (
          <div className="divide-y divide-[#F0ECE1]">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F7F4EF] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#A77A7E]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-xs text-[#26231E]">{log.action.replace(/_/g, ' ')}</span>
                    <span className="px-2 py-0.5 rounded bg-[#F7F4EF] text-[10px] uppercase tracking-wider text-[#A77A7E]">{log.role}</span>
                  </div>
                  <p className="text-xs text-[#77716C] mt-1">{log.details}</p>
                  <p className="text-[11px] text-[#77716C] mt-1">{log.user}</p>
                </div>
                <time className="text-[10px] text-[#77716C] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
