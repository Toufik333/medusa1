import React from 'react';
import { ShoppingBag } from 'lucide-react';
import ProductImageFrame from './ProductImageFrame';

export const formatPrice = (amount) => `৳${Number(amount || 0).toLocaleString('en-BD')}`;

export default function ProductCard({
  product,
  isFeatured = false,
  selectedSize,
  onSelectSize,
  needsSizePrompt,
  onAddToCart
}) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <div
      className={`group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-neutral-900/5 hover:border-neutral-300 ${
        isFeatured ? 'ring-1 ring-neutral-900/5' : ''
      }`}
    >
      <div>
        {/* Strict 4:5 Aspect Ratio Image Frame */}
        <ProductImageFrame
          src={product.imageUrl}
          alt={product.title}
          cropMeta={product.cropMeta}
          featured={product.featured}
          badge={hasDiscount ? `-${discountPct}% OFF` : null}
        />

        {/* Product Details */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
              {product.category} {product.isClothing ? '• Apparel' : '• Object'}
            </span>
            <span className="text-[11px] text-neutral-400">
              {product.stock} in stock
            </span>
          </div>

          <h3 className="font-semibold text-neutral-900 text-base leading-snug line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
            {product.subtitle || 'Everyday Studio Utility'}
          </p>

          {/* Price Row */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-950">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Size Selector (ONLY FOR CLOTHING) + Add To Bag Button */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 flex flex-col gap-3">
        {product.isClothing ? (
          <div
            className={`p-2 rounded-xl border transition-colors ${
              needsSizePrompt
                ? 'border-rose-400 bg-rose-50/60'
                : 'border-neutral-100 bg-neutral-50/70'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[11px] font-medium ${
                  needsSizePrompt ? 'text-rose-600 font-semibold' : 'text-neutral-500'
                }`}
              >
                {needsSizePrompt ? 'Please select a size:' : 'Select Size:'}
              </span>
              {selectedSize && (
                <span className="text-[11px] font-semibold text-neutral-900">
                  Size {selectedSize}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL']).map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onSelectSize(product.id, size)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Non-clothing items have size options strictly hidden */
          <div className="py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Standard Spec</span>
            <span className="font-medium text-neutral-700">Universal / One Size</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {product.isClothing && selectedSize
              ? `Add Size ${selectedSize} to Bag`
              : 'Add to Bag'}
          </span>
        </button>
      </div>
    </div>
  );
}
