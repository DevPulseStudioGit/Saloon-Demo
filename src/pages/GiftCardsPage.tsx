import React, { useState } from 'react';
import { Gift, Check, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { StorageService } from '../services/storage';
import { GiftCard } from '../types';

interface GiftCardsPageProps {
  navigateTo: (route: string, param?: string) => void;
}

export const GiftCardsPage: React.FC<GiftCardsPageProps> = ({ navigateTo }) => {
  const { giftCards } = useSalon();
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [issuedCard, setIssuedCard] = useState<GiftCard | null>(null);

  // Balance checker
  const [checkCode, setCheckCode] = useState('');
  const [checkedCard, setCheckedCard] = useState<GiftCard | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const handleIssueGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `LUMA-VOUCHER-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCard: GiftCard = {
      id: `gc-${Date.now()}`,
      code: newCode,
      initialValue: selectedAmount,
      balance: selectedAmount,
      recipientName,
      recipientEmail,
      senderName,
      senderEmail: 'client@example.com',
      message,
      expiryDate: '2027-12-31',
      active: true,
      createdAt: new Date().toISOString()
    };
    StorageService.saveGiftCards([...giftCards, newCard]);
    setIssuedCard(newCard);
  };

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckError(null);
    setCheckedCard(null);

    const clean = checkCode.trim().toUpperCase();
    const found = giftCards.find((g) => g.code.toUpperCase() === clean);
    if (found) {
      setCheckedCard(found);
    } else {
      setCheckError('Gift voucher code not found. Please verify the code.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          The Gift of Beauty
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Atelier Gift Cards & Experiences
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          Gift an unforgettable afternoon of hair couture, bespoke facials, or bridal suites at our Karachi destinations. Digital cards are delivered instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Purchase Card Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E7E0D8] p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-2xl font-serif-title font-semibold text-[#26231E]">
            Purchase a Digital Gift Card
          </h2>

          {issuedCard ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif-title font-bold text-emerald-950">
                Gift Voucher Issued!
              </h3>
              <div className="p-4 bg-white rounded-lg border border-emerald-300 font-mono text-base font-bold text-[#26231E]">
                {issuedCard.code}
              </div>
              <p className="text-xs text-emerald-800">
                Value: Rs. {issuedCard.balance.toLocaleString()} for {issuedCard.recipientName}. Valid through {issuedCard.expiryDate}.
              </p>
              <button
                onClick={() => setIssuedCard(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded"
              >
                Create Another Gift Card
              </button>
            </div>
          ) : (
            <form onSubmit={handleIssueGiftCard} className="space-y-5">
              {/* Amounts */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#77716C] block">
                  Select Voucher Value (PKR)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[5000, 10000, 25000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedAmount === amt
                          ? 'bg-[#26231E] text-white border-[#26231E] font-bold shadow-xs'
                          : 'bg-white border-[#E7E0D8] text-[#26231E] hover:border-[#A77A7E]'
                      }`}
                    >
                      <div className="text-xs font-serif-title">Rs. {amt.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#26231E]">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Tariq"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#26231E]">Recipient Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="fatima@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#26231E]">Sender Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#26231E]">Personal Message</label>
                  <textarea
                    rows={2}
                    placeholder="Wishing you a beautiful bridal glow..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded-md hover:bg-[#3D3730] transition-colors shadow-xs"
              >
                Proceed to Checkout (Rs. {selectedAmount.toLocaleString()})
              </button>
            </form>
          )}
        </div>

        {/* Balance Checker */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E7E0D8] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-serif-title font-semibold text-[#26231E] flex items-center gap-2">
              <Search className="w-4 h-4 text-[#A77A7E]" />
              <span>Check Voucher Balance</span>
            </h3>
            <p className="text-xs text-[#77716C]">
              Already have an Atelier card? Enter your code below. Sample: <button onClick={() => setCheckCode('LUMA-GLOW-10K')} className="text-[#A77A7E] underline">LUMA-GLOW-10K</button>
            </p>
          </div>

          <form onSubmit={handleCheckBalance} className="space-y-3">
            <input
              type="text"
              required
              placeholder="e.g. LUMA-GLOW-10K"
              value={checkCode}
              onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded uppercase font-mono tracking-wider focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold text-[#26231E] border border-[#26231E] rounded hover:bg-[#26231E] hover:text-white transition-colors"
            >
              Verify Balance
            </button>
          </form>

          {checkError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs border border-red-200">
              {checkError}
            </div>
          )}

          {checkedCard && (
            <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E7E0D8] space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold text-sm text-[#26231E]">
                <span>Available Balance</span>
                <span>Rs. {checkedCard.balance.toLocaleString()}</span>
              </div>
              <div className="text-[#77716C] pt-1 space-y-0.5">
                <div>Recipient: <strong className="text-[#26231E]">{checkedCard.recipientName}</strong></div>
                <div>Expiry: <strong className="text-[#26231E]">{checkedCard.expiryDate}</strong></div>
                <div>Status: <strong className="text-emerald-800">Active & Redeemable</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
