import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService, subscribeToStorageChanges } from '../services/storage';
import { Order, OrderStatus } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  Bike,
  ShoppingBag,
  ChefHat,
  Flame,
  Phone,
  AlertCircle,
  PackageCheck,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { config } = useRestaurant();

  const [referenceQuery, setReferenceQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || 'DF-2026-9041'; // default sample pre-filled for instant testing!
  });
  const [phoneQuery, setPhoneQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Lookup function
  const lookupOrder = () => {
    setSearchAttempted(true);
    if (!referenceQuery.trim()) {
      setTrackedOrder(null);
      return;
    }
    const order = StorageService.getOrderByReference(referenceQuery, phoneQuery);
    setTrackedOrder(order || null);
  };

  // Initial lookup if reference is in URL
  useEffect(() => {
    if (referenceQuery) {
      lookupOrder();
    }
  }, []);

  // Listen for live status changes (e.g. Admin updates status in dashboard)
  useEffect(() => {
    const unsubscribe = subscribeToStorageChanges(() => {
      if (referenceQuery) {
        const updated = StorageService.getOrderByReference(referenceQuery, phoneQuery);
        if (updated) {
          setTrackedOrder({ ...updated });
        }
      }
    });
    return unsubscribe;
  }, [referenceQuery, phoneQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder();
  };

  // Define steps
  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Order Received', desc: 'Sent to branch kitchen' },
    { key: 'confirmed', label: 'Kitchen Confirmed', desc: 'Ingredients prepared' },
    { key: 'preparing', label: 'Simmering & Grilling', desc: 'Over coals & woks' },
    {
      key: trackedOrder?.orderType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery',
      label: trackedOrder?.orderType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery',
      desc: trackedOrder?.orderType === 'pickup' ? 'At branch pickup counter' : 'Rider en route with thermal bag',
    },
    { key: 'completed', label: 'Order Delivered', desc: 'Enjoy your meal!' },
  ];

  const getStepStatus = (stepKey: OrderStatus) => {
    if (!trackedOrder) return 'upcoming';
    const statusOrder: OrderStatus[] = [
      'pending',
      'confirmed',
      'preparing',
      trackedOrder.orderType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery',
      'completed',
    ];

    const currentIdx = statusOrder.indexOf(trackedOrder.status);
    const thisIdx = statusOrder.indexOf(stepKey);

    if (thisIdx < currentIdx) return 'completed';
    if (thisIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Live Kitchen Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#25231F]">
          Track Your Food Order
        </h1>
        <p className="text-xs sm:text-sm text-[#77736D]">
          Enter your order reference code (e.g. <strong>DF-2026-9041</strong>) to view live cooking and rider updates.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                Order Reference <span className="text-[#B64E35]">*</span>
              </label>
              <input
                type="text"
                required
                value={referenceQuery}
                onChange={(e) => setReferenceQuery(e.target.value)}
                placeholder="e.g. DF-2026-9041"
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] font-mono uppercase focus:outline-none focus:border-[#B64E35]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                Mobile Number (Optional)
              </label>
              <input
                type="tel"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                placeholder="e.g. 03214455889"
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-[#77736D]">
              Sample active order: <button type="button" onClick={() => { setReferenceQuery('DF-2026-9041'); lookupOrder(); }} className="underline text-[#B64E35] font-mono">DF-2026-9041</button>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Track Order</span>
            </button>
          </div>
        </form>
      </div>

      {/* Order Status Display */}
      {trackedOrder ? (
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-10 space-y-8 shadow-xs animate-in fade-in duration-200">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2DA]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-[#25231F]">
                  {trackedOrder.orderReference}
                </span>
                <span className="text-xs text-[#77736D]">·</span>
                <span className="text-xs font-semibold uppercase text-[#B64E35]">
                  {trackedOrder.orderType}
                </span>
              </div>
              <div className="text-xs text-[#77736D] mt-1">
                Placed on {new Date(trackedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} at {trackedOrder.branchName}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${trackedOrder.branchPhone}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B64E35] hover:bg-[#F5E9E2] px-3.5 py-2 rounded-xl border border-[#B64E35]/30 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Kitchen ({trackedOrder.branchPhone})
              </a>
            </div>
          </div>

          {/* Stepper Progress Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#25231F]">
              Live Progress
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {steps.map((step, idx) => {
                const status = getStepStatus(step.key);

                return (
                  <div
                    key={step.key}
                    className={`p-4 rounded-2xl border transition-all ${
                      status === 'current'
                        ? 'bg-[#F5E9E2]/70 border-[#B64E35] shadow-xs'
                        : status === 'completed'
                        ? 'bg-[#FAF8F4] border-emerald-200 text-[#25231F]'
                        : 'bg-white border-[#E8E2DA] opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : status === 'current'
                            ? 'bg-[#B64E35] text-white animate-pulse'
                            : 'bg-[#E8E2DA] text-[#77736D]'
                        }`}
                      >
                        {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77736D]">
                        Step {idx + 1}
                      </span>
                    </div>

                    <div className="font-serif font-bold text-sm text-[#25231F]">
                      {step.label}
                    </div>
                    <p className="text-[11px] text-[#77736D] mt-0.5 leading-snug">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log / Status History */}
          <div className="p-5 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#77736D]">
              Kitchen Dispatch Notes & Updates
            </h4>
            <div className="space-y-2.5">
              {trackedOrder.statusHistory.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#B64E35] shrink-0 mt-1.5" />
                  <div className="flex-1">
                    <span className="text-[#25231F] font-medium">{item.note}</span>
                    <span className="text-[10px] text-[#77736D] ml-2">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items & Delivery destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
            <div className="space-y-2">
              <span className="font-semibold text-[#77736D] uppercase tracking-wider block">
                Ordered Items
              </span>
              <ul className="space-y-1 text-[#25231F]">
                {trackedOrder.items.map((it, i) => (
                  <li key={i} className="flex justify-between py-1 border-b border-[#FAF8F4]">
                    <span>
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-semibold">
                      Rs. {(it.unitPrice * it.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold text-sm pt-1 text-[#25231F]">
                <span>Total Amount:</span>
                <span className="text-[#B64E35]">Rs. {trackedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-[#77736D] uppercase tracking-wider block">
                Destination & Customer
              </span>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2DA] space-y-1">
                <div className="font-bold text-[#25231F]">{trackedOrder.customer.name}</div>
                <div className="text-[#77736D]">{trackedOrder.customer.phone}</div>
                {trackedOrder.orderType === 'delivery' && (
                  <div className="text-[#77736D] pt-1 border-t border-[#FAF8F4] mt-1">
                    {trackedOrder.customer.address}, {trackedOrder.customer.area}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : searchAttempted ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#E8E2DA] max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-[#B64E35] mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#25231F]">
            No Matching Order Found
          </h3>
          <p className="text-xs text-[#77736D]">
            We couldn't find an order with reference "{referenceQuery}". Please double check your receipt or contact our phone concierge.
          </p>
        </div>
      ) : null}
    </div>
  );
};
