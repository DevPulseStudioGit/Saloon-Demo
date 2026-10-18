import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { CustomerInquiry } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { MessageSquare, Phone, Mail, CheckCircle2, Clock } from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  const { showToast } = useRestaurant();
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => StorageService.getInquiries());

  const refresh = () => setInquiries(StorageService.getInquiries());

  const handleUpdateStatus = (id: string, status: CustomerInquiry['status']) => {
    StorageService.updateInquiryStatus(id, status);
    refresh();
    showToast(`Inquiry marked as ${status}.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Customer Inbound
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
          Inquiries & Contact Requests ({inquiries.length})
        </h1>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-4 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FAF8F4]">
              <div>
                <span className="font-serif font-bold text-lg text-[#25231F] block">
                  {inq.subject}
                </span>
                <div className="flex items-center gap-3 text-xs text-[#77736D] mt-0.5">
                  <span className="font-semibold text-[#25231F]">{inq.name}</span>
                  <span>·</span>
                  <a href={`tel:${inq.phone}`} className="hover:text-[#B64E35] flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {inq.phone}
                  </a>
                  {inq.email && (
                    <>
                      <span>·</span>
                      <a href={`mailto:${inq.email}`} className="hover:text-[#B64E35] flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {inq.email}
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md capitalize ${
                    inq.status === 'new'
                      ? 'bg-amber-100 text-amber-800'
                      : inq.status === 'reviewed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {inq.status}
                </span>
                <span className="text-[11px] text-[#77736D]">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#77736D] bg-[#FAF8F4] p-4 rounded-2xl border border-[#E8E2DA]">
              "{inq.message}"
            </p>

            <div className="flex justify-end gap-2 text-xs">
              {inq.status !== 'resolved' && (
                <button
                  onClick={() => handleUpdateStatus(inq.id, 'resolved')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Mark Resolved
                </button>
              )}
              {inq.status === 'new' && (
                <button
                  onClick={() => handleUpdateStatus(inq.id, 'reviewed')}
                  className="bg-[#26231F] hover:bg-black text-white font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Mark Under Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
