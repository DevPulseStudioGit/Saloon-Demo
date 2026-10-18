import React, { useEffect, useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService } from '../services/storage';
import { Order } from '../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Bike,
  ShoppingBag,
  Share2,
  Printer
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { config, navigateTo } = useRestaurant();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    if (orderId) {
      const found = StorageService.getOrderById(orderId);
      if (found) {
        setOrder(found);
      }
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#25231F]">
          Order Not Found
        </h2>
        <p className="text-xs sm:text-sm text-[#77736D]">
          We couldn't locate this order confirmation reference. Please check your tracking link.
        </p>
        <button
          onClick={() => navigateTo('/track-order')}
          className="bg-[#B64E35] text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
        >
          Track An Existing Order
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 pb-24">
      {/* Success Badge & Headline */}
      <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-10 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Order Confirmed & Sent to Kitchen
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#25231F] mt-1">
            Thank You, {order.customer.name}!
          </h1>
          <p className="text-xs sm:text-sm text-[#77736D] mt-2 max-w-md mx-auto">
            Your culinary order has been received by our{' '}
            <strong className="text-[#25231F]">{order.branchName}</strong> kitchen.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="inline-flex items-center gap-3 bg-[#FAF8F4] px-5 py-3 rounded-2xl border border-[#E8E2DA] text-xs sm:text-sm">
          <span className="text-[#77736D]">Reference Number:</span>
          <span className="font-mono font-bold text-[#25231F] text-base tracking-wider">
            {order.orderReference}
          </span>
        </div>

        {/* Action buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigateTo(`/track-order?ref=${order.orderReference}`)}
            className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <span>Track Live Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8F4] text-[#25231F] border border-[#E8E2DA] text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4 text-[#77736D]" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Detailed Order Breakdown Card */}
      <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
        <h2 className="font-serif font-bold text-xl text-[#25231F] pb-3 border-b border-[#E8E2DA]">
          Order Summary & Dispatch Details
        </h2>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] text-xs">
          <div>
            <span className="text-[#77736D] block">Order Type</span>
            <span className="font-bold text-[#25231F] capitalize flex items-center gap-1 mt-0.5">
              {order.orderType === 'delivery' ? (
                <Bike className="w-3.5 h-3.5 text-[#B64E35]" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 text-[#B64E35]" />
              )}
              {order.orderType}
            </span>
          </div>

          <div>
            <span className="text-[#77736D] block">Est. Arrival / Ready</span>
            <span className="font-bold text-[#25231F] flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#B64E35]" />
              {order.estimatedDeliveryOrPickupTime}
            </span>
          </div>

          <div>
            <span className="text-[#77736D] block">Assigned Branch</span>
            <span className="font-bold text-[#25231F] truncate block mt-0.5">
              {order.branchName}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#77736D] block">
            Items Ordered
          </span>
          <div className="divide-y divide-[#FAF8F4] border-t border-b border-[#FAF8F4] py-2">
            {order.items.map((item, i) => (
              <div key={i} className="py-2.5 flex items-start justify-between gap-4 text-xs sm:text-sm">
                <div>
                  <div className="font-semibold text-[#25231F]">
                    {item.quantity}x {item.name}
                  </div>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="text-xs text-[#77736D] mt-0.5">
                      {item.selectedOptions.map((o) => o.choiceName).join(', ')}
                    </div>
                  )}
                  {item.specialInstructions && (
                    <div className="text-[11px] text-[#77736D] italic mt-0.5">
                      Note: "{item.specialInstructions}"
                    </div>
                  )}
                </div>
                <div className="font-semibold text-[#25231F] shrink-0">
                  Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 text-xs sm:text-sm pt-2">
          <div className="flex justify-between text-[#77736D]">
            <span>Subtotal</span>
            <span className="font-medium text-[#25231F]">Rs. {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#77736D]">
            <span>Delivery Charges</span>
            <span className="font-medium text-[#25231F]">
              {order.deliveryFee > 0 ? `Rs. ${order.deliveryFee}` : 'Free'}
            </span>
          </div>
          <div className="pt-3 border-t border-[#E8E2DA] flex justify-between items-baseline">
            <span className="font-serif font-bold text-lg text-[#25231F]">
              Confirmed Total
            </span>
            <span className="text-xl font-bold font-sans text-[#B64E35]">
              Rs. {order.total.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-[#77736D]">
            Payment Method: <strong>{order.paymentMethod.toUpperCase().replace(/_/g, ' ')}</strong> ({order.paymentStatus === 'paid' ? 'Paid Online' : 'Payable on Delivery'})
          </div>
        </div>

        {/* Customer Address Details */}
        {order.orderType === 'delivery' && (
          <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] space-y-1 text-xs">
            <div className="font-semibold text-[#25231F] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B64E35]" />
              Delivery Destination
            </div>
            <div className="text-[#77736D]">{order.customer.address}</div>
            {order.customer.area && <div className="text-[#77736D]">{order.customer.area}</div>}
            {order.customer.nearbyLandmark && (
              <div className="text-[#77736D]">Landmark: {order.customer.nearbyLandmark}</div>
            )}
            <div className="text-[#25231F] font-medium pt-1">
              Contact: {order.customer.phone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
