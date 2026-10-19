import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { executeOrderCreation } from '../services/orderValidator';
import { PaymentMethod, OrderCustomer } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Building2,
  Lock,
  ArrowRight,
  AlertCircle,
  MapPin,
  Bike,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    config,
    cart,
    cartCount,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    clearCart,
    orderType,
    selectedBranch,
    selectedDeliveryArea,
    navigateTo,
    showToast,
  } = useRestaurant();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionErrors, setSubmissionErrors] = useState<string[]>([]);

  if (cart.length === 0) {
    navigateTo('/cart');
    return null;
  }

  const minOrder = orderType === 'delivery' ? (selectedDeliveryArea?.minOrder || selectedBranch?.minOrder || 0) : 0;
  if (orderType === 'delivery' && cartSubtotal < minOrder) {
    navigateTo('/cart');
    return null;
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionErrors([]);

    if (!selectedBranch) {
      setSubmissionErrors(['Please select an operating branch.']);
      return;
    }

    const customer: OrderCustomer = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      email: customerEmail.trim() || undefined,
      address: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      area: orderType === 'delivery' ? selectedDeliveryArea?.name : undefined,
      nearbyLandmark: nearbyLandmark.trim() || undefined,
      orderNotes: orderNotes.trim() || undefined,
    };

    setIsSubmitting(true);

    // Call server-side validator engine
    setTimeout(() => {
      const result = executeOrderCreation({
        orderType,
        branchId: selectedBranch.id,
        items: cart,
        customer,
        deliveryAreaId: selectedDeliveryArea?.id,
        paymentMethod,
      });

      setIsSubmitting(false);

      if (!result.success || !result.order) {
        setSubmissionErrors(result.errors || ['Failed to place order. Please check inputs.']);
        showToast('Validation failed. Please review errors.', 'error');
        return;
      }

      // Order created successfully
      clearCart();
      showToast(`Order ${result.order.orderReference} confirmed!`, 'success');
      navigateTo(`/order-confirmation?id=${result.order.id}`);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      <div className="pb-4 border-b border-[#E8E2DA]">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Final Step
        </span>
        <h1 className="text-3xl font-serif font-black text-[#25231F] mt-1">
          Guest Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#77736D] mt-1">
          No mandatory registration required. We will send live order updates to your phone.
        </p>
      </div>

      {submissionErrors.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Please correct the following:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5 text-xs">
            {submissionErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Customer & Delivery Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information Section */}
          <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif font-bold text-lg text-[#25231F]">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Full Name <span className="text-[#B64E35]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Mobile Number <span className="text-[#B64E35]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Email Address <span className="text-[#77736D]/60">(Optional for invoice copy)</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>
            </div>
          </div>

          {/* Delivery or Pickup Details */}
          {orderType === 'delivery' ? (
            <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h2 className="font-serif font-bold text-lg text-[#25231F]">
                  2. Delivery Destination
                </h2>
                <span className="text-xs text-[#B64E35] font-semibold">
                  Area: {selectedDeliveryArea?.name}
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                    Complete Street Address <span className="text-[#B64E35]">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House / Apartment number, Street name, Block / Phase..."
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-3.5 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      value={nearbyLandmark}
                      onChange={(e) => setNearbyLandmark(e.target.value)}
                      placeholder="e.g. Opposite Masjid, Near Park..."
                      className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                      Delivery Zone
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedDeliveryArea?.name || 'Standard Area'}
                      className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#77736D] opacity-80 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-3 shadow-2xs">
              <h2 className="font-serif font-bold text-lg text-[#25231F]">
                2. Takeaway / Collection Counter
              </h2>
              <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] space-y-1 text-xs">
                <div className="font-bold text-sm text-[#25231F]">{selectedBranch?.name}</div>
                <div className="text-[#77736D]">{selectedBranch?.address}</div>
                <div className="text-[#B64E35] font-semibold pt-1">
                  Estimated Ready Time: {selectedBranch?.estPickupTimeMinutes} from acceptance
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-3 shadow-2xs">
            <h2 className="font-serif font-bold text-lg text-[#25231F]">
              3. Special Instructions / Rider Notes
            </h2>
            <textarea
              rows={2}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Please do not ring the bell, call when arriving..."
              className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-3.5 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35] resize-none"
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif font-bold text-lg text-[#25231F]">
              4. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-[#B64E35] bg-[#F5E9E2]/50'
                    : 'border-[#E8E2DA] bg-white hover:border-[#77736D]/40'
                }`}
              >
                <div className="space-y-2">
                  <Banknote className="w-5 h-5 text-[#B64E35]" />
                  <div className="font-serif font-bold text-sm text-[#25231F]">
                    Cash on Delivery
                  </div>
                  <p className="text-[11px] text-[#77736D]">
                    Pay cash directly to the rider upon receipt.
                  </p>
                </div>
                <div className="pt-2 text-right">
                  {paymentMethod === 'cod' && (
                    <CheckCircle2 className="w-4 h-4 text-[#B64E35] inline" />
                  )}
                </div>
              </div>

              {/* Card on Delivery */}
              <div
                onClick={() => setPaymentMethod('card_on_delivery')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'card_on_delivery'
                    ? 'border-[#B64E35] bg-[#F5E9E2]/50'
                    : 'border-[#E8E2DA] bg-white hover:border-[#77736D]/40'
                }`}
              >
                <div className="space-y-2">
                  <CreditCard className="w-5 h-5 text-[#B64E35]" />
                  <div className="font-serif font-bold text-sm text-[#25231F]">
                    Card on Delivery
                  </div>
                  <p className="text-[11px] text-[#77736D]">
                    Rider arrives with a secure mobile POS machine.
                  </p>
                </div>
                <div className="pt-2 text-right">
                  {paymentMethod === 'card_on_delivery' && (
                    <CheckCircle2 className="w-4 h-4 text-[#B64E35] inline" />
                  )}
                </div>
              </div>

              {/* Raast / Bank Transfer */}
              <div
                onClick={() => setPaymentMethod('bank_transfer_raast')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'bank_transfer_raast'
                    ? 'border-[#B64E35] bg-[#F5E9E2]/50'
                    : 'border-[#E8E2DA] bg-white hover:border-[#77736D]/40'
                }`}
              >
                <div className="space-y-2">
                  <Building2 className="w-5 h-5 text-[#B64E35]" />
                  <div className="font-serif font-bold text-sm text-[#25231F]">
                    Raast / Direct Bank
                  </div>
                  <p className="text-[11px] text-[#77736D]">
                    Instant transfer via Raast ID or Bank IBAN.
                  </p>
                </div>
                <div className="pt-2 text-right">
                  {paymentMethod === 'bank_transfer_raast' && (
                    <CheckCircle2 className="w-4 h-4 text-[#B64E35] inline" />
                  )}
                </div>
              </div>
            </div>

            {paymentMethod === 'bank_transfer_raast' && (
              <div className="p-4 bg-[#FAF8F4] border border-[#E8E2DA] rounded-2xl text-xs space-y-1.5 text-[#25231F]">
                <div className="font-semibold text-[#B64E35]">Official Salon Raast Details:</div>
                <div>Raast ID: <strong>03008294110</strong> ({config.name})</div>
                <div>Bank: Meezan Bank Ltd | Account: 0102-0105892341</div>
                <div className="text-[11px] text-[#77736D]">
                  Please share screenshot of payment receipt with rider or WhatsApp concierge.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Itemized Order Summary & Confirmation CTA */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-6 shadow-xs sticky top-28">
          <h2 className="font-serif font-bold text-xl text-[#25231F] pb-3 border-b border-[#E8E2DA]">
            Order Review
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex items-center justify-between text-xs gap-3">
                <div className="truncate flex-1">
                  <span className="font-semibold text-[#25231F]">
                    {item.quantity}x {item.name}
                  </span>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="text-[11px] text-[#77736D] truncate">
                      {item.selectedOptions.map((o) => o.choiceName).join(', ')}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-[#25231F] shrink-0">
                  Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#E8E2DA] text-xs">
            <div className="flex justify-between text-[#77736D]">
              <span>Subtotal</span>
              <span className="font-medium text-[#25231F]">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#77736D]">
              <span>Delivery Charges</span>
              <span className="font-medium text-[#25231F]">
                {orderType === 'delivery' ? `Rs. ${cartDeliveryFee}` : 'Free'}
              </span>
            </div>
            <div className="flex justify-between text-[#77736D]">
              <span>Branch</span>
              <span className="font-medium text-[#25231F]">{selectedBranch?.name}</span>
            </div>
            <div className="pt-3 border-t border-[#E8E2DA] flex justify-between items-baseline">
              <div>
                <span className="font-serif font-bold text-lg text-[#25231F] block">
                  Final Amount
                </span>
                <span className="text-[10px] text-[#77736D]">Payable at delivery</span>
              </div>
              <span className="text-xl font-bold font-sans text-[#B64E35]">
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#B64E35] hover:bg-[#9B3F28] disabled:opacity-75 text-white font-semibold text-xs sm:text-sm py-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying & Placing Order...</span>
              </>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#77736D]">
            <Lock className="w-3.5 h-3.5 text-[#B64E35]" />
            <span>Secure 256-bit Verified Submission</span>
          </div>
        </div>
      </form>
    </div>
  );
};
