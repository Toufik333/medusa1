import React, { useState, useEffect } from 'react';
import { Megaphone, Check } from 'lucide-react';

export default function CampaignManager({
  campaign,
  onUpdateCampaign,
  onToggleCampaign,
  showToast
}) {
  const [badge, setBadge] = useState(campaign?.badge || 'SEASONAL DROP');
  const [promoCode, setPromoCode] = useState(campaign?.promoCode || 'WINTER15');
  const [headline, setHeadline] = useState(campaign?.headline || '');
  const [subtext, setSubtext] = useState(campaign?.subtext || '');

  useEffect(() => {
    if (campaign) {
      setBadge(campaign.badge || 'SEASONAL DROP');
      setPromoCode(campaign.promoCode || 'WINTER15');
      setHeadline(campaign.headline || '');
      setSubtext(campaign.subtext || '');
    }
  }, [campaign]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateCampaign({
      active: campaign?.active ?? true,
      badge: badge.trim(),
      promoCode: promoCode.trim().toUpperCase(),
      headline: headline.trim(),
      subtext: subtext.trim()
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-lg font-bold">Special Discount Campaign Manager</h2>
          <p className="text-xs text-neutral-500">
            Controls the top announcement bar and storefront hero campaign message.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleCampaign}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm ${
            campaign?.active
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
          }`}
        >
          {campaign?.active ? 'Campaign Active' : 'Campaign Paused'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Campaign Badge Pill
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g., WINTER DROP"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Featured Promo Code Chip
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="e.g., WINTER15"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm font-mono uppercase focus:outline-none focus:border-neutral-950"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">
            Campaign Headline *
          </label>
          <input
            type="text"
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g., WINTER DROP CAMPAIGN — Up to 25% OFF Selected Items"
            className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">
            Campaign Subtext
          </label>
          <input
            type="text"
            value={subtext}
            onChange={(e) => setSubtext(e.target.value)}
            placeholder="e.g., Minimalist essentials crafted for everyday utility."
            className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Check className="w-4 h-4" />
          <span>Save Campaign Changes</span>
        </button>
      </form>
    </div>
  );
}

