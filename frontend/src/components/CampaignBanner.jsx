import React from 'react';
import { Ticket } from 'lucide-react';

export default function CampaignBanner({ campaign, onApplyCoupon }) {
  if (!campaign || !campaign.active) return null;

  return (
    <div className="bg-neutral-950 text-white px-4 py-2.5 border-b border-neutral-800 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-amber-400 text-neutral-950 font-bold tracking-wider uppercase text-[10px]">
            {campaign.badge || 'PROMO'}
          </span>
          <p className="font-medium tracking-wide">
            {campaign.headline}
            {campaign.subtext && (
              <span className="hidden md:inline text-neutral-400 ml-2">
                — {campaign.subtext}
              </span>
            )}
          </p>
        </div>
        {campaign.promoCode && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-neutral-400 hidden sm:inline">Use Code:</span>
            <button
              type="button"
              onClick={() => onApplyCoupon(campaign.promoCode)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-amber-300 font-mono font-semibold text-xs border border-white/15 transition cursor-pointer"
              title="Click to apply coupon in bag"
            >
              <Ticket className="w-3.5 h-3.5" />
              {campaign.promoCode}
              <span className="text-[10px] text-white/80 font-sans font-normal underline ml-1">
                Apply
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

