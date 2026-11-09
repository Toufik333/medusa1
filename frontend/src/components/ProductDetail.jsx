import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Star,
  Sparkles,
  ChevronRight,
  Clock
} from 'lucide-react';
import ProductImageFrame from './ProductImageFrame';
import { formatPrice } from './ProductCard';

export default function ProductDetail({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  showToast
}) {
  if (!product) return null;

  // Options from attributes or fallback sizes
  const attributeName = product.attributes?.name || (product.isClothing ? 'Size' : 'Volume');
  const rawOptions = product.attributes?.options && product.attributes.options.length > 0
    ? product.attributes.options
    : (product.sizes && product.sizes.length > 0
        ? product.sizes.map((s) => ({ name: s, price: null }))
        : []);

  const [selectedOptionName, setSelectedOptionName] = useState(
    rawOptions.length > 0 ? rawOptions[0].name : null
  );
  const [qty, setQty] = useState(1);

  // Compute active price based on selected option
  const activeOption = rawOptions.find((o) => o.name === selectedOptionName);
  const basePrice = product.discountPrice || product.price;
  const currentPrice = activeOption?.price && activeOption.price > 0
    ? activeOption.price
    : basePrice;

  const hasDiscount = !activeOption?.price && product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const handleAdd = (openDrawer = false) => {
    if (rawOptions.length > 0 && !selectedOptionName) {
      showToast(`Please select a ${attributeName.toLowerCase()} before adding to bag.`, 'error');
      return;
    }

    const cartPayload = {
      ...product,
      price: currentPrice,
      selectedOption: selectedOptionName,
      selectedSize: selectedOptionName,
      qty
    };

    if (openDrawer && onBuyNow) {
      onBuyNow(cartPayload);
    } else {
      onAddToCart(product, selectedOptionName, qty, currentPrice);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <div className="text-xs text-neutral-400 hidden sm:flex items-center gap-2">
          <span>PerfumeGo</span>
          <ChevronRight className="w-3 h-3" />
          <span>{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 4:5 Large Product Visual */}
        <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
          <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm">
            <ProductImageFrame
              src={product.imageUrl}
              alt={product.title}
              cropMeta={product.cropMeta}
              featured={product.featured}
              badge={hasDiscount ? `-${discountPct}% OFF` : null}
            />
          </div>
        </div>

        {/* Right Column: Information, Attributes & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          {/* Category & Stock */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
              {product.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock ({product.stock} available)</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight font-serif">
              {product.title}
            </h1>
            <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">
              {product.subtitle || 'Artisanal formulation with exceptional raw botanical essences.'}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-neutral-950 font-serif">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold">
                  Save {discountPct}%
                </span>
              </>
            )}
            <span className="text-xs text-neutral-500 ml-auto">
              Cash on Delivery (COD)
            </span>
          </div>

          {/* Custom Attribute / Volume / Sizing Pills */}
          {rawOptions.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-900">
                  Select {attributeName}:
                </span>
                {selectedOptionName && (
                  <span className="text-neutral-500">
                    Selected: <strong className="text-neutral-900">{selectedOptionName}</strong>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {rawOptions.map((opt) => {
                  const isSelected = selectedOptionName === opt.name;
                  const optionPrice = opt.price && opt.price > 0 ? opt.price : null;

                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setSelectedOptionName(opt.name)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer border ${
                        isSelected
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm scale-[1.02]'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{opt.name}</span>
                      {optionPrice && (
                        <span className={`text-[11px] font-normal ${isSelected ? 'text-amber-300' : 'text-neutral-500'}`}>
                          • {formatPrice(optionPrice)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-neutral-900">Quantity:</span>
            <div className="inline-flex items-center rounded-xl border border-neutral-300 bg-white">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-l-xl cursor-pointer"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-xs text-neutral-900">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((prev) => Math.min(product.stock || 20, prev + 1))}
                className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-r-xl cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => handleAdd(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-700 text-white font-bold text-sm hover:bg-amber-800 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-amber-900/10 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buy Now — Cash on Delivery ({formatPrice(currentPrice * qty)})</span>
            </button>

            <button
              type="button"
              onClick={() => handleAdd(false)}
              className="w-full py-3.5 px-6 rounded-2xl bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Bag</span>
            </button>
          </div>

          {/* Thin Guarantees Strip */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5 text-xs text-neutral-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>
                <strong>Fast Nationwide Delivery:</strong> ৳60 (Dhaka Metro 24–48h) • ৳120 (Outside Dhaka 3–5 days)
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>100% Authentic Guarantee:</strong> Sealed luxury packaging with pure essence guarantee
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Hassle-Free Exchange:</strong> Easy customer replacement support on any delivery issue
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
