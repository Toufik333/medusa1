import React from 'react';
import { Star } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FeaturedBoard({
  featuredProducts,
  selectedSizes,
  onSelectSize,
  sizePromptError,
  onAddToCart
}) {
  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between border-b border-neutral-200 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-600">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Curated Highlights</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
            Featured Board
          </h2>
        </div>
        <span className="text-xs text-neutral-500">
          {featuredProducts.length} Curated Drops
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard
            key={`feat-${product.id}`}
            product={product}
            isFeatured={true}
            selectedSize={selectedSizes[product.id]}
            onSelectSize={onSelectSize}
            needsSizePrompt={sizePromptError === product.id}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
