import React from 'react';
import { ShoppingBag, Search, X } from 'lucide-react';

const CATEGORIES = ['All', 'Clothing', 'Accessories', 'Gear'];

export default function Navbar({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
              M//S
            </div>
            <div>
              <span className="font-bold tracking-tight text-base block leading-none">
                MONO.STUDIO
              </span>
              <span className="text-[10px] text-neutral-400 tracking-widest uppercase block mt-0.5">
                Dhaka • Studio Apparel & Objects
              </span>
            </div>
          </a>

          {/* Category Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        {/* Real-time Search Input (Desktop Storefront) */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-1.5 bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white rounded-xl text-xs border border-transparent focus:border-neutral-300 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Customer Cart Drawer Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer shadow-sm"
            aria-label="Open shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold px-0.5">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Mobile Search & Category Bar */}
      <div className="lg:hidden px-4 pb-3 pt-1 flex flex-col sm:flex-row gap-2 border-t border-neutral-100">
        <div className="relative sm:hidden">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-8 py-1.5 bg-neutral-100 rounded-xl text-xs focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-950 text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
