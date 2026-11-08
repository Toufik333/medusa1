import React, { useState } from 'react';
import { Package, CreditCard } from 'lucide-react';
import { formatPrice } from '../ProductCard';

export default function OrderManager({
  orders,
  onUpdateStatus,
  showToast
}) {
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-base font-bold">Customer Orders ({orders.length})</h2>
            <p className="text-xs text-neutral-500">
              Storefront orders default to Cash on Delivery (COD). Backend schema includes reserved columns for bKash.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-800 text-xs font-medium">
              <CreditCard className="w-3.5 h-3.5" />
              <span>bKash Slot: /api/payments/bkash (Reserved)</span>
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold cursor-pointer"
            >
              <option value="All">All Statuses ({orders.length})</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-xs">
            No orders found under "{statusFilter}".
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-4 hover:border-neutral-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm bg-neutral-950 text-white px-2.5 py-1 rounded-lg">
                      {ord.id}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-neutral-900">
                        {ord.customerName} • <span className="font-mono text-neutral-600">{ord.phone}</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {ord.address} ({ord.area})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-semibold text-xs">
                      Payment: {ord.paymentMethod || 'COD'} (Cash on Delivery)
                    </span>
                    <select
                      value={ord.status || 'Pending'}
                      onChange={(e) => onUpdateStatus(ord.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-semibold cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    {ord.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-neutral-200/80"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-950">{item.qty}x</span>
                          <span className="text-neutral-800">{item.title}</span>
                          {item.isClothing && item.size && (
                            <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-white font-mono text-[10px]">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-neutral-950">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-xs space-y-1">
                    {ord.couponCode && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Applied Coupon ({ord.couponCode}):</span>
                        <span>-{formatPrice(ord.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-500">
                      <span>Delivery Charge ({ord.area}):</span>
                      <span>{formatPrice(ord.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-neutral-950 pt-1 border-t border-neutral-100">
                      <span>Total Collectible (COD):</span>
                      <span>{formatPrice(ord.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
