import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  AlertCircle,
  Bike
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    config,
    cart,
    cartCount,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    orderType,
    selectedBranch,
    selectedDeliveryArea,
    openBranchModal,
    navigateTo,
  } = useRestaurant();

  const minOrder = orderType === 'delivery' ? (selectedDeliveryArea?.minOrder || selectedBranch?.minOrder || 0) : 0;
  const isBelowMin = orderType === 'delivery' && cartSubtotal < minOrder;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E8E2DA] flex items-center justify-center text-[#77736D] mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8 text-[#B64E35]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F]">
            Your Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#77736D] mt-2 max-w-sm mx-auto">
            You haven't added any dishes or combos yet. Explore our freshly cooked Karahis, Char-grilled BBQ, and Dum Biryanis.
          </p>
        </div>
        <button
          onClick={() => navigateTo('/menu')}
          className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all active:scale-95"
        >
          <span>Explore Online Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8E2DA]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Review Selections
          </span>
          <h1 className="text-3xl font-serif font-black text-[#25231F] mt-1">
            Your Food Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-medium text-[#77736D] hover:text-rose-600 self-start sm:self-auto transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white rounded-2xl border border-[#E8E2DA] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-[#B64E35]/30 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#FAF8F4]"
                />
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#25231F]">
                    {item.name}
                  </h3>

                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="text-xs text-[#77736D] space-y-0.5">
                      {item.selectedOptions.map((opt, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="text-[#B64E35]">·</span>
                          <span>
                            {opt.choiceName}{' '}
                            {opt.price > 0 && `(+Rs. ${opt.price})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.specialInstructions && (
                    <p className="text-[11px] text-[#77736D] italic">
                      Note: "{item.specialInstructions}"
                    </p>
                  )}

                  <div className="text-xs font-semibold text-[#25231F] pt-1">
                    Rs. {item.unitPrice.toLocaleString()} each
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Item Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#FAF8F4]">
                <div className="flex items-center bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartItemId, -1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#77736D] hover:text-[#25231F] hover:bg-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#25231F]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartItemId, 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#77736D] hover:text-[#25231F] hover:bg-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[#25231F]">
                    Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-[#77736D] hover:text-rose-600 p-1.5 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping button */}
          <div className="pt-2">
            <button
              onClick={() => navigateTo('/menu')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#B64E35] hover:text-[#9B3F28] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Add More Dishes from Menu</span>
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-6 shadow-xs sticky top-28">
          <h2 className="font-serif font-bold text-xl text-[#25231F] pb-3 border-b border-[#E8E2DA]">
            Order Summary
          </h2>

          {/* Location details card */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E8E2DA] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold capitalize text-[#B64E35] flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5" /> {orderType} Order
              </span>
              <button
                type="button"
                onClick={openBranchModal}
                className="text-[11px] font-semibold text-[#B64E35] underline"
              >
                Change
              </button>
            </div>
            <div className="text-[#25231F] font-medium">
              Kitchen: {selectedBranch?.name}
            </div>
            {orderType === 'delivery' && selectedDeliveryArea && (
              <div className="text-[#77736D]">
                To: {selectedDeliveryArea.name} ({selectedDeliveryArea.estMinutes})
              </div>
            )}
          </div>

          {/* Price breakdown */}
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between text-[#77736D]">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#25231F]">
                Rs. {cartSubtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-[#77736D]">
              <span>Delivery Fee</span>
              <span className="font-semibold text-[#25231F]">
                {orderType === 'delivery'
                  ? `Rs. ${cartDeliveryFee}`
                  : 'Free (Pick-Up)'}
              </span>
            </div>

            <div className="pt-3 border-t border-[#E8E2DA] flex justify-between items-baseline">
              <div>
                <span className="font-serif font-bold text-lg text-[#25231F] block">
                  Total Payable
                </span>
                <span className="text-[11px] text-[#77736D]">All local taxes included</span>
              </div>
              <span className="text-xl font-bold font-sans text-[#B64E35]">
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Minimum order check warning */}
          {isBelowMin && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Minimum order for this delivery zone is <strong>Rs. {minOrder}</strong>. Please add <strong>Rs. {minOrder - cartSubtotal}</strong> more to proceed.
              </span>
            </div>
          )}

          {/* Checkout CTA */}
          <button
            type="button"
            onClick={() => navigateTo('/checkout')}
            disabled={isBelowMin}
            className="w-full bg-[#B64E35] hover:bg-[#9B3F28] disabled:bg-[#77736D]/40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm py-3.5 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
