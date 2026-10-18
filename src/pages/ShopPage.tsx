import React, { useState } from 'react';
import { ShoppingBag, Check, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { RetailProduct } from '../types';

interface ShopPageProps {
  navigateTo: (route: string, param?: string) => void;
}

interface CartItem {
  product: RetailProduct;
  quantity: number;
}

export const ShopPage: React.FC<ShopPageProps> = ({ navigateTo }) => {
  const { products } = useSalon();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Clifton, Karachi');

  const addToCart = (product: RetailProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 350 : 0;
  const total = subtotal + deliveryFee;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsCheckoutSuccess(true);
    setCart([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <div className="text-xs uppercase tracking-widest font-semibold text-[#A77A7E]">
          Atelier Apothecary
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif-title font-semibold text-[#26231E]">
          Clinical Formulas & Rituals
        </h1>
        <p className="text-sm sm:text-base text-[#77716C] leading-relaxed">
          Take our salon results home. Organic botanical oils, cellular hyaluronic serums, and scalp recovery elixirs crafted with pure cosmetic actives.
        </p>
      </div>

      {isCheckoutSuccess ? (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-900">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif-title font-bold text-emerald-950">
            Order Confirmed!
          </h2>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Thank you, {customerName}. Your atelier products will be dispatched via courier to {deliveryArea} within 24 hours. Cash on delivery or online payment confirmation has been recorded.
          </p>
          <button
            onClick={() => setIsCheckoutSuccess(false)}
            className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730]"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Products Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden shadow-2xs flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden relative bg-[#F7F4EF]">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[10px] font-medium px-2 py-0.5 rounded text-[#26231E]">
                      {prod.size}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#A77A7E] font-semibold">
                      {prod.category}
                    </span>
                    <h3 className="text-base font-serif-title font-semibold text-[#26231E]">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#77716C] leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#F7F4EF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#77716C] block">Price</span>
                    <span className="font-serif-title font-bold text-base text-[#26231E]">
                      Rs. {prod.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(prod)}
                    className="px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#26231E] rounded hover:bg-[#A77A7E] transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Drawer */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E0D8] p-6 shadow-sm space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-3">
              <h3 className="text-base font-serif-title font-semibold text-[#26231E] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#A77A7E]" />
                <span>Your Shopping Bag</span>
              </h3>
              <span className="text-xs text-[#77716C]">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#77716C]">
                Your bag is empty. Add a product to get started.
              </div>
            ) : (
              <form onSubmit={handleCompleteOrder} className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between text-xs py-2 border-b border-[#FAF8F4]"
                    >
                      <div className="space-y-0.5 max-w-[150px]">
                        <div className="font-semibold text-[#26231E] truncate">{item.product.name}</div>
                        <div className="text-[11px] text-[#77716C]">
                          Rs. {item.product.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-[#F7F4EF] flex items-center justify-center text-[#26231E] hover:bg-[#E7E0D8]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-xs min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded bg-[#F7F4EF] flex items-center justify-center text-[#26231E] hover:bg-[#E7E0D8]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E7E0D8] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#77716C]">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#77716C]">
                    <span>Karachi Courier Delivery</span>
                    <span>Rs. {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#26231E] pt-2 border-t border-[#E7E0D8]">
                    <span>Total</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Fields */}
                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone (+92 3...)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  />
                  <select
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F4] border border-[#E7E0D8] rounded focus:outline-none"
                  >
                    <option value="Clifton, Karachi">Clifton, Karachi</option>
                    <option value="DHA Phase 1-8, Karachi">DHA Phase 1-8, Karachi</option>
                    <option value="PECHS / KDA, Karachi">PECHS / KDA, Karachi</option>
                    <option value="Gulshan / Johar, Karachi">Gulshan / Johar, Karachi</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs uppercase tracking-widest font-semibold text-white bg-[#26231E] rounded hover:bg-[#3D3730] transition-colors shadow-xs"
                >
                  Place Order (Cash on Delivery)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
