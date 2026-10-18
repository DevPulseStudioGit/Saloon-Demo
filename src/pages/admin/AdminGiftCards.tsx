import React, { useState } from 'react';
import { Gift, Plus, Check } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { StorageService } from '../../services/storage';
import { GiftCard } from '../../types';

export const AdminGiftCards: React.FC = () => {
  const { giftCards } = useSalon();
  const [cards, setCards] = useState<GiftCard[]>(giftCards);

  const [code, setCode] = useState('');
  const [value, setValue] = useState(10000);
  const [recipient, setRecipient] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: GiftCard = {
      id: `gc-${Date.now()}`,
      code: code || `LUMA-GIFT-${Math.floor(1000 + Math.random() * 9000)}`,
      initialValue: value,
      balance: value,
      recipientName: recipient || 'Honored Client',
      recipientEmail: 'client@example.com',
      senderName: 'Luma Concierge',
      senderEmail: 'concierge@lumaatelier.com',
      expiryDate: '2027-12-31',
      active: true,
      createdAt: new Date().toISOString()
    };
    const next = [newCard, ...cards];
    setCards(next);
    StorageService.saveGiftCards(next);
    setModalOpen(false);
    setCode('');
    setRecipient('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Gift Vouchers & Balances
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Issue promotional vouchers and monitor remaining client balances.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Gift Voucher</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F4] text-[#77716C] border-b border-[#E7E0D8] uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Voucher Code</th>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Initial Value</th>
              <th className="py-3 px-4">Available Balance</th>
              <th className="py-3 px-4">Expiry Date</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF8F4]">
            {cards.map((gc) => (
              <tr key={gc.id} className="hover:bg-[#FAF8F4] transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#26231E]">
                  {gc.code}
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#26231E]">
                  {gc.recipientName}
                </td>
                <td className="py-3.5 px-4 text-[#77716C]">
                  Rs. {gc.initialValue.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-800">
                  Rs. {gc.balance.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-[#77716C]">
                  {gc.expiryDate}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-800">
                    {gc.active ? 'Active' : 'Redeemed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="text-base font-serif-title font-semibold text-[#26231E]">
              Issue New Digital Gift Voucher
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Voucher Code (Optional or auto-generated)</label>
                <input
                  type="text"
                  placeholder="e.g. LUMA-VIP-20K"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Voucher Amount (PKR)</label>
                <input
                  type="number"
                  required
                  step={1000}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#26231E]">Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="Client Name"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F4] border border-[#E7E0D8] rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#77716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs uppercase font-semibold text-white bg-[#26231E] rounded"
                >
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
