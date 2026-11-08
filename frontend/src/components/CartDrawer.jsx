import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Ticket,
  User,
  Phone,
  MapPin,
  Truck,
  Lock,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { formatPrice } from './ProductCard';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onClearCart,
  couponInput,
  setCouponInput,
  appliedCoupon,
  couponFeedback,
  onApplyCoupon,
  onPlaceOrder,
  checkoutSuccessOrder,
  setCheckoutSuccessOrder,
  onInspectOrderInAdmin
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Dhaka Metro'); // 'Dhaka Metro' (60) | 'Outside Dhaka' (120)
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const couponDiscountAmount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;
  const deliveryFee = cart.length === 0 ? 0 : deliveryArea === 'Dhaka Metro' ? 60 : 120;
  const grandTotal = Math.max(0, cartSubtotal - couponDiscountAmount + deliveryFee);

  const handleSubmitCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      return;
    }

    setIsSubmitting(true);
    await onPlaceOrder({
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      area: deliveryArea,
      items: cart.map((i) => ({
        id: i.productId,
        title: i.title,
        isClothing: i.isClothing,
        size: i.isClothing ? i.size : null,
        qty: i.qty,
        price: i.price
      })),
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      discountAmount: couponDiscountAmount,
      deliveryFee,
      total: grandTotal
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-950" />
            <h2 className="font-bold text-base">Your Shopping Bag ({cartCount})</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {checkoutSuccessOrder ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 my-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-emerald-200/70 text-emerald-950 font-bold">
                  {checkoutSuccessOrder.id}
                </span>
                <h3 className="text-lg font-bold text-neutral-950 pt-1">
                  Order Confirmed (Cash on Delivery)
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Thank you, <strong>{checkoutSuccessOrder.customerName}</strong>! Please keep{' '}
                  <strong>{formatPrice(checkoutSuccessOrder.total)}</strong> ready in cash upon delivery to{' '}
                  {checkoutSuccessOrder.area}.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onInspectOrderInAdmin();
                  }}
                  className="w-full py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition"
                >
                  Inspect Order in Admin Panel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutSuccessOrder(null);
                    onClose();
                  }}
                  className="w-full py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium cursor-pointer hover:bg-neutral-50 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
              <div className="font-semibold text-sm text-neutral-800">
                Your bag is currently empty
              </div>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our 4:5 catalog and add clothing (with size selection) or everyday carry gear.
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3.5 p-3 rounded-2xl border border-neutral-200 bg-neutral-50/50"
                  >
                    <div className="w-16 aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-xs text-neutral-900 truncate">
                          {item.title}
                        </h4>
                        {item.isClothing && item.size ? (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-neutral-900 text-white font-mono text-[10px] font-semibold">
                            Size: {item.size}
                          </span>
                        ) : (
                          <span className="inline-block mt-1 text-[11px] text-neutral-400">
                            Universal Spec
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartItemId, -1)}
                            className="px-2 py-0.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartItemId, 1)}
                            className="px-2 py-0.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-xs text-neutral-950">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Input Box */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
                <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" />
                    Promo / Coupon Code
                  </span>
                  <span className="text-[11px] font-normal text-neutral-500">
                    Try WINTER15 or WELCOME10
                  </span>
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onApplyCoupon(couponInput);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code..."
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-mono uppercase focus:outline-none focus:border-neutral-950"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponFeedback && (
                  <div
                    className={`text-[11px] flex items-center gap-1.5 font-medium ${
                      couponFeedback.type === 'success'
                        ? 'text-emerald-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {couponFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{couponFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* Delivery & Payment Form */}
              <form id="cod-checkout-form" onSubmit={handleSubmitCheckout} className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                  Customer & Delivery Info
                </h3>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name *"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone Number (e.g., 017XXXXXXXX) *"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Street Address, House/Flat, Area *"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {['Dhaka Metro', 'Outside Dhaka'].map((zone) => (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => setDeliveryArea(zone)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                          deliveryArea === zone
                            ? 'bg-neutral-950 text-white border-neutral-950'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="font-semibold">{zone}</div>
                        <div className="text-[10px] opacity-80">
                          Delivery: {zone === 'Dhaka Metro' ? '৳60' : '৳120'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector: COD Active + bKash Reserved */}
                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                    Payment Method
                  </h3>

                  {/* Option 1: Cash on Delivery (Active) */}
                  <div className="p-3.5 rounded-xl border-2 border-neutral-950 bg-neutral-50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-neutral-950" />
                      <div>
                        <div className="text-xs font-bold text-neutral-950">
                          Cash on Delivery (COD)
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Pay with cash when your parcel arrives
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-neutral-950 text-white text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>

                  {/* Option 2: bKash (Backend Slot Reserved) */}
                  <div className="p-3.5 rounded-xl border border-dashed border-pink-300 bg-pink-50/40 flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-pink-600" />
                      <div>
                        <div className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                          <span>bKash Payment Gateway</span>
                        </div>
                        <div className="text-[11px] text-pink-700">
                          Backend endpoint & DB ready • Disabled on storefront
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-800 text-[10px] font-semibold">
                      RESERVED
                    </span>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cart.length > 0 && !checkoutSuccessOrder && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedCoupon.code} - {appliedCoupon.discountPercent}%)</span>
                  <span>-{formatPrice(couponDiscountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Delivery Charge ({deliveryArea})</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total Payable (COD)</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="cod-checkout-form"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-semibold text-xs sm:text-sm hover:bg-neutral-800 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Confirm Order — Cash on Delivery ({formatPrice(grandTotal)})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

