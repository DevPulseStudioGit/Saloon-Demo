import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Bike,
  ShoppingBag,
  Printer,
  X,
  Phone,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customNote, setCustomNote] = useState('');

  const refreshOrders = () => {
    const fresh = StorageService.getOrders();
    setOrders(fresh);
    if (selectedOrder) {
      const updatedSelected = fresh.find((o) => o.id === selectedOrder.id);
      if (updatedSelected) setSelectedOrder(updatedSelected);
    }
  };

  const handleStatusUpdate = (orderId: string, nextStatus: OrderStatus) => {
    const note = customNote.trim() || undefined;
    StorageService.updateOrderStatus(orderId, nextStatus, note);
    setCustomNote('');
    refreshOrders();
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inRef = order.orderReference.toLowerCase().includes(q);
      const inCust = order.customer.name.toLowerCase().includes(q);
      const inPhone = order.customer.phone.includes(q);
      if (!inRef && !inCust && !inPhone) return false;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-[11px] font-bold">New Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Confirmed</span>;
      case 'preparing':
        return <span className="bg-orange-100 text-orange-800 px-2.5 py-1 rounded-md text-[11px] font-bold">In Kitchen</span>;
      case 'out_for_delivery':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md text-[11px] font-bold">With Rider</span>;
      case 'ready_for_pickup':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Ready Counter</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Live Dispatch Stream
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
            Order Management ({orders.length})
          </h1>
        </div>

        <button
          onClick={refreshOrders}
          className="text-xs font-semibold text-[#B64E35] hover:text-[#9B3F28] px-3 py-2 rounded-xl bg-white border border-[#E8E2DA] shadow-2xs self-start"
        >
          Refresh Orders
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order Ref (e.g. DF-2026-9041), Customer Name, or Phone..."
            className="w-full bg-white border border-[#E8E2DA] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35] shadow-2xs"
          />
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-[#26231F] text-white shadow-2xs'
                    : 'bg-white text-[#77736D] border border-[#E8E2DA] hover:text-[#25231F]'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2DA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F4] border-b border-[#E8E2DA] text-[#77736D] uppercase tracking-wider font-semibold">
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Order Details</th>
                <th className="p-4">Kitchen Branch</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F4]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F4]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#25231F]">
                      {order.orderReference}
                      <div className="text-[10px] text-[#77736D] font-sans font-normal">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-[#25231F]">{order.customer.name}</div>
                      <div className="text-[11px] text-[#77736D]">{order.customer.phone}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-[#25231F]">
                        {order.items.length} {order.items.length === 1 ? 'dish' : 'dishes'}
                      </div>
                      <div className="text-[11px] text-[#77736D] truncate max-w-[150px]">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="capitalize font-medium text-[#25231F] flex items-center gap-1">
                        {order.orderType === 'delivery' ? (
                          <Bike className="w-3 h-3 text-[#B64E35]" />
                        ) : (
                          <ShoppingBag className="w-3 h-3 text-[#B64E35]" />
                        )}
                        {order.orderType}
                      </div>
                      <div className="text-[11px] text-[#77736D] truncate max-w-[140px]">
                        {order.branchName}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-[#25231F]">
                      Rs. {order.total.toLocaleString()}
                      <div className="text-[10px] text-[#77736D] font-normal uppercase">
                        {order.paymentMethod}
                      </div>
                    </td>

                    <td className="p-4">{getStatusBadge(order.status)}</td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="bg-[#B64E35] hover:bg-[#9B3F28] text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors shadow-2xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-[#77736D]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E2DA] flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E8E2DA] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#B64E35] uppercase tracking-wider">
                  Order Management
                </span>
                <h3 className="font-serif font-black text-2xl text-[#25231F] mt-0.5">
                  {selectedOrder.orderReference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#77736D] hover:text-[#25231F] hover:bg-[#FAF8F4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Status Progression Controls */}
              <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#77736D] uppercase tracking-wider">
                    Current Status:
                  </span>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#77736D] uppercase tracking-wider block">
                    Add Rider / Kitchen Dispatch Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Rider Farhan assigned on Bike # 7810..."
                    className="w-full bg-white border border-[#E8E2DA] rounded-xl px-3 py-2 text-xs text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                  />
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
                    >
                      Accept & Confirm
                    </button>
                  )}

                  {selectedOrder.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'preparing')}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
                    >
                      Fire Woks / Start Cooking
                    </button>
                  )}

                  {selectedOrder.status === 'preparing' && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          selectedOrder.id,
                          selectedOrder.orderType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery'
                        )
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
                    >
                      {selectedOrder.orderType === 'pickup' ? 'Mark Ready for Pick-Up' : 'Dispatch with Rider'}
                    </button>
                  )}

                  {(selectedOrder.status === 'out_for_delivery' || selectedOrder.status === 'ready_for_pickup') && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
                    >
                      Mark Completed / Delivered
                    </button>
                  )}

                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}
                      className="bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs px-3 py-2 rounded-xl transition-colors ml-auto"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Customer & Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-2xl border border-[#E8E2DA] space-y-1">
                  <span className="font-semibold text-[#77736D] uppercase tracking-wider block">Customer Contact</span>
                  <div className="font-bold text-sm text-[#25231F]">{selectedOrder.customer.name}</div>
                  <div className="text-[#25231F]">{selectedOrder.customer.phone}</div>
                  {selectedOrder.customer.email && <div className="text-[#77736D]">{selectedOrder.customer.email}</div>}
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8E2DA] space-y-1">
                  <span className="font-semibold text-[#77736D] uppercase tracking-wider block">
                    {selectedOrder.orderType === 'delivery' ? 'Delivery Destination' : 'Pickup Branch'}
                  </span>
                  <div className="font-bold text-sm text-[#25231F]">{selectedOrder.branchName}</div>
                  {selectedOrder.orderType === 'delivery' ? (
                    <>
                      <div className="text-[#77736D]">{selectedOrder.customer.address}</div>
                      {selectedOrder.customer.area && <div className="text-[#77736D] font-medium">{selectedOrder.customer.area}</div>}
                      {selectedOrder.customer.nearbyLandmark && (
                        <div className="text-[#77736D]">Landmark: {selectedOrder.customer.nearbyLandmark}</div>
                      )}
                    </>
                  ) : (
                    <div className="text-[#77736D]">Customer collecting at kitchen counter</div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Ordered Items & Options
                </span>
                <div className="divide-y divide-[#FAF8F4] border border-[#E8E2DA] rounded-2xl p-4 text-xs">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-[#25231F]">
                          {it.quantity}x {it.name}
                        </div>
                        {it.selectedOptions && it.selectedOptions.length > 0 && (
                          <div className="text-[#77736D] mt-0.5">
                            {it.selectedOptions.map((o) => `${o.groupName}: ${o.choiceName}`).join(' · ')}
                          </div>
                        )}
                        {it.specialInstructions && (
                          <div className="text-[11px] text-[#B64E35] italic mt-0.5">
                            Kitchen instruction: "{it.specialInstructions}"
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-[#25231F]">
                        Rs. {(it.unitPrice * it.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E8E2DA] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#77736D]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#25231F]">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#77736D]">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-[#25231F]">Rs. {selectedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#25231F] pt-2 border-t border-[#E8E2DA]">
                  <span>Grand Total</span>
                  <span className="text-[#B64E35]">Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8E2DA] bg-[#FAF8F4] flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25231F] bg-white border border-[#E8E2DA] px-3.5 py-2 rounded-xl hover:bg-[#FAF8F4]"
              >
                <Printer className="w-4 h-4 text-[#77736D]" />
                Print Order Slip
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-[#26231F] text-white text-xs font-semibold px-5 py-2 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
