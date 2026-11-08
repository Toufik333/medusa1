import React, { useState } from 'react';
import { Ticket, Plus, Trash2 } from 'lucide-react';

export default function CouponManager({
  coupons,
  onCreateCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  showToast
}) {
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState('15');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanCode = newCouponCode.trim().toUpperCase();
    const pct = Number(newCouponPercent);
    if (!cleanCode || !pct || pct < 1 || pct > 90) {
      showToast('Enter a valid coupon code and percentage (1–90%).', 'error');
      return;
    }
    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      showToast(`Coupon ${cleanCode} already exists.`, 'error');
      return;
    }

    await onCreateCoupon({
      code: cleanCode,
      discountPercent: pct,
      description: newCouponDesc.trim() || `${pct}% Off Storewide Promo`
    });

    setNewCouponCode('');
    setNewCouponDesc('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Create Coupon Box */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 h-fit">
        <div>
          <h2 className="text-base font-bold">Create Discount Coupon</h2>
          <p className="text-xs text-neutral-500">
            Customers apply active coupons in the checkout drawer. Deactivating a coupon immediately stops checkout discounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g., EID20"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm font-mono uppercase focus:outline-none focus:border-neutral-950"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Discount Percentage (%) *
            </label>
            <input
              type="number"
              required
              min="1"
              max="90"
              value={newCouponPercent}
              onChange={(e) => setNewCouponPercent(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Internal Label / Note
            </label>
            <input
              type="text"
              value={newCouponDesc}
              onChange={(e) => setNewCouponDesc(e.target.value)}
              placeholder="e.g., Seasonal Flash Promo"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Activate Coupon</span>
          </button>
        </form>
      </div>

      {/* Coupons List */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Manage Coupons ({coupons.length})</h2>
          <span className="text-xs text-neutral-500">
            Click switch to Activate / Deactivate in real time
          </span>
        </div>

        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 transition ${
                coupon.active
                  ? 'bg-white border-neutral-200'
                  : 'bg-neutral-50 border-neutral-200/60 opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm border ${
                    coupon.active
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-neutral-200 text-neutral-600 border-neutral-300 line-through'
                  }`}
                >
                  {coupon.code}
                </div>
                <div>
                  <div className="font-bold text-sm text-neutral-900">
                    {coupon.discountPercent}% OFF Order Subtotal
                  </div>
                  <div className="text-xs text-neutral-500">{coupon.description || 'Promotional Discount'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => onToggleCoupon(coupon.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    coupon.active
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      coupon.active ? 'bg-white' : 'bg-neutral-500'
                    }`}
                  />
                  <span>{coupon.active ? 'Active' : 'Deactivated'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteCoupon(coupon.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

