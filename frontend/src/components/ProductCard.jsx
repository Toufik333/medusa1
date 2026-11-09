import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import ProductImageFrame from './ProductImageFrame';

export const formatPrice = (amount) => `৳${Number(amount || 0).toLocaleString('en-BD')}`;

export default function ProductCard({
  product,
  isFeatured = false,
  selectedSize,
  onSelectSize,
  needsSizePrompt,
  onAddToCart,
  onOpenProduct
}) {
  // Extract options from attributes or fallback sizes
  const rawOptions = product.attributes?.options && product.attributes.options.length > 0
    ? product.attributes.options
    : (product.sizes && product.sizes.length > 0
        ? product.sizes.map((s) => ({ name: s, price: null }))
        : []);

  const attributeName = product.attributes?.name || (product.isClothing ? 'Size' : 'Volume');
  const activeOption = rawOptions.find((o) => o.name === selectedSize) || (rawOptions.length > 0 ? rawOptions[0] : null);

  // Dynamic price calculation
  const basePrice = product.discountPrice || product.price;
  const displayPrice = activeOption?.price && activeOption.price > 0
    ? activeOption.price
    : basePrice;

  const hasDiscount = !activeOption?.price && product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const handleCardClick = (e) => {
    // If not clicking button, open product detail page
    if (e.target.closest('button')) return;
    if (onOpenProduct) onOpenProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-neutral-900/5 hover:border-neutral-300 cursor-pointer ${
        isFeatured ? 'ring-1 ring-neutral-900/5' : ''
      }`}
    >
      <div>
        {/* Strict 4:5 Aspect Ratio Image Frame with Hover Action */}
        <div className="relative">
          <ProductImageFrame
            src={product.imageUrl}
            alt={product.title}
            cropMeta={product.cropMeta}
            featured={product.featured}
            badge={hasDiscount ? `-${discountPct}% OFF` : null}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="py-2 px-3.5 rounded-xl bg-white/95 text-neutral-950 font-semibold text-xs shadow-md flex items-center gap-1.5 backdrop-blur-xs">
              <Eye className="w-3.5 h-3.5" /> View Details
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
              {product.category}
            </span>
            <span className="text-[11px] text-neutral-400">
              {product.stock} in stock
            </span>
          </div>

          <h3 className="font-semibold text-neutral-900 text-base leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors font-serif">
            {product.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
            {product.subtitle || 'Luxury Fragrance Formulation'}
          </p>

          {/* Dynamic Price Display */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-950">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {activeOption?.price && activeOption.price > 0 && (
              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-medium ml-auto">
                {activeOption.name} Spec
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Attribute / Size Selector + Add To Bag */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 flex flex-col gap-3">
        {rawOptions.length > 0 ? (
          <div
            className={`p-2 rounded-xl border transition-colors ${
              needsSizePrompt
                ? 'border-rose-400 bg-rose-50/60'
                : 'border-neutral-100 bg-neutral-50/70'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 text-[11px]">
              <span
                className={`font-medium ${
                  needsSizePrompt ? 'text-rose-600 font-semibold' : 'text-neutral-500'
                }`}
              >
                {needsSizePrompt ? `Please select a ${attributeName}:` : `${attributeName}:`}
              </span>
              {activeOption && (
                <span className="font-semibold text-neutral-900">
                  {activeOption.name}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {rawOptions.map((opt) => {
                const active = (selectedSize || rawOptions[0]?.name) === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSize(product.id, opt.name);
                    }}
                    className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-neutral-950 text-white shadow-xs'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span>{opt.name}</span>
                    {opt.price && opt.price > 0 && (
                      <span className={`text-[10px] font-normal ml-1 ${active ? 'text-amber-300' : 'text-neutral-400'}`}>
                        ৳{opt.price}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Standard Spec</span>
            <span className="font-medium text-neutral-700">Universal Edition</span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, activeOption?.name, 1, displayPrice);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {activeOption ? `Add (${activeOption.name}) to Bag` : 'Add to Bag'}
          </span>
        </button>
      </div>
    </div>
  );
}
