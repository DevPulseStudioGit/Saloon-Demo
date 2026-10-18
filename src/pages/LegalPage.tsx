import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Shield, FileText, Truck } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'delivery' | 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'delivery' }) => {
  const { config, currentPath, navigateTo } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'delivery' | 'privacy' | 'terms'>(() => {
    if (currentPath === '/privacy-policy') return 'privacy';
    if (currentPath === '/terms') return 'terms';
    return initialTab;
  });

  useEffect(() => {
    if (currentPath === '/privacy-policy') setActiveTab('privacy');
    else if (currentPath === '/terms') setActiveTab('terms');
    else if (currentPath === '/delivery-policy') setActiveTab('delivery');
  }, [currentPath]);

  const handleTabChange = (tab: 'delivery' | 'privacy' | 'terms') => {
    setActiveTab(tab);
    if (tab === 'delivery') navigateTo('/delivery-policy');
    if (tab === 'privacy') navigateTo('/privacy-policy');
    if (tab === 'terms') navigateTo('/terms');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Tabs */}
      <div className="flex items-center justify-center p-1.5 bg-white border border-[#E8E2DA] rounded-2xl max-w-md mx-auto shadow-2xs">
        <button
          onClick={() => handleTabChange('delivery')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'delivery'
              ? 'bg-[#B64E35] text-white shadow-xs'
              : 'text-[#77736D] hover:text-[#25231F]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Delivery Policy
        </button>

        <button
          onClick={() => handleTabChange('privacy')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'bg-[#B64E35] text-white shadow-xs'
              : 'text-[#77736D] hover:text-[#25231F]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Privacy Policy
        </button>

        <button
          onClick={() => handleTabChange('terms')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'terms'
              ? 'bg-[#B64E35] text-white shadow-xs'
              : 'text-[#77736D] hover:text-[#25231F]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Terms
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-10 shadow-xs space-y-6 text-[#25231F] leading-relaxed">
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
                Logistics & Dispatch
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
                Food Delivery & Coverage Policy
              </h1>
              <p className="text-xs text-[#77736D] mt-1">
                Last reviewed: October 2026 · {config.name} Karachi Operations
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#77736D]">
              <h3 className="font-serif font-bold text-base text-[#25231F]">
                1. Delivery Zones & Order Routing
              </h3>
              <p>
                To maintain the integrity and high temperature of our freshly cooked Karahis, Naans, and BBQ, orders are strictly routed to the nearest operational branch (Clifton & DHA Flagship, Gulshan Central, or North Nazimabad). We deliver exclusively to configured neighborhoods within safe transit radii.
              </p>

              <h3 className="font-serif font-bold text-base text-[#25231F]">
                2. Minimum Order & Delivery Fees
              </h3>
              <p>
                A standard delivery fee between Rs. 130 and Rs. 150 applies based on your neighborhood zone. The minimum order requirement for delivery is Rs. 700 to Rs. 800. Pickup orders carry no minimum fee.
              </p>

              <h3 className="font-serif font-bold text-base text-[#25231F]">
                3. Estimated Delivery Times
              </h3>
              <p>
                Standard delivery transit is approximately 30 to 45 minutes from the time your order is confirmed by the kitchen. Adverse weather, severe rain in Karachi, or road closures may occasionally extend delivery times, in which case our rider or concierge will notify you directly.
              </p>

              <h3 className="font-serif font-bold text-base text-[#25231F]">
                4. Customer Responsibilities upon Arrival
              </h3>
              <p>
                Please ensure your contact number is active so the rider can reach you upon arrival. If paying via Cash on Delivery, please have the exact or near-exact change ready where feasible.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
                Data Protection
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
                Customer Privacy Policy
              </h1>
              <p className="text-xs text-[#77736D] mt-1">
                Effective date: October 2026
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#77736D]">
              <h3 className="font-serif font-bold text-base text-[#25231F]">
                1. Information We Collect
              </h3>
              <p>
                When you place an online order or make a table reservation through {config.name}, we collect only the information required to fulfill your dining request: your full name, contact phone number, delivery address, nearby landmark, and optional email.
              </p>

              <h3 className="font-serif font-bold text-base text-[#25231F]">
                2. Use of Information
              </h3>
              <p>
                Your phone number is utilized solely to provide live status updates regarding your food order, rider dispatch, or table confirmation. We never sell, lease, or distribute your personal contact information to third-party marketing companies.
              </p>

              <h3 className="font-serif font-bold text-base text-[#25231F]">
                3. Payment Information Security
              </h3>
              <p>
                We do not collect or store raw credit or debit card numbers on our customer-facing servers. In-person card payments are processed via verified bank POS terminals carried by riders upon delivery.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
                Operational Rules
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
                Terms and Conditions
              </h1>
              <p className="text-xs text-[#77736D] mt-1">
                Applicable to online ordering and reservations at {config.name}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#77736D]">
              <h3 className="font-serif font-bold text-base text-[#25231F]">
                1. Order Acceptance & Pricing
              </h3>
              <p>
                All prices are denominated in Pakistani Rupees (PKR) and include applicable local sales taxes unless stated otherwise. An order is confirmed only after verified acceptance by our kitchen management.
              </p>

              <h3 className="font-serif font-bold text-base text-[#25231F]">
                2. Cancellations & Modifications
              </h3>
              <p>
                Because our charcoal grills and cast-iron karahis are fired upon order confirmation, cancellations must be communicated within 5 minutes of order placement by directly calling your assigned branch hotline.
              </p>

              <h3 className="font-serif font-bold text-base text-[#25231F]">
                3. Freshness & Food Handling
              </h3>
              <p>
                For optimal flavor, aroma, and food safety, our dishes should be consumed immediately upon delivery or pickup. Any complaints regarding food quality must be reported on the day of delivery along with your order reference number.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
