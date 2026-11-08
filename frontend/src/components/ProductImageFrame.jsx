import React from 'react';
import { Star } from 'lucide-react';

export default function ProductImageFrame({ src, alt, cropMeta, badge, featured }) {
  const zoom = cropMeta?.zoom || 1;
  const panX = cropMeta?.panX || 0;
  const panY = cropMeta?.panY || 0;

  return (
    <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden select-none">
      <img
        src={src}
        alt={alt || 'Product'}
        className="w-full h-full object-cover transition-transform duration-300"
        style={{
          transform: `scale(${zoom}) translate(${panX}%, ${panY}%)`,
          transformOrigin: 'center center'
        }}
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';
        }}
      />
      {/* Top left badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
        {featured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-neutral-950/90 text-white backdrop-blur-sm shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Featured
          </span>
        )}
        {badge && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-600 text-white shadow-sm">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

