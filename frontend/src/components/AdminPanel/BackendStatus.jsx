import React, { useState, useEffect } from 'react';
import { Server, CheckCircle2, AlertCircle, Copy, ExternalLink, Terminal } from 'lucide-react';
import { api } from '../../api/client';

export default function BackendStatus({ showToast }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkConnection = async () => {
    setLoading(true);
    const res = await api.checkHealth();
    if (res.data) {
      setHealth(res.data);
    } else {
      setHealth(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const copyToClipboard = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Backend API Live Status */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-neutral-900" />
            <div>
              <h2 className="text-base font-bold">Node.js + PostgreSQL Backend Status</h2>
              <p className="text-xs text-neutral-500">
                Connected to Express API running with PostgreSQL support.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={checkConnection}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition cursor-pointer"
          >
            {loading ? 'Checking...' : 'Refresh Health'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
              API Connection
            </span>
            <div className="flex items-center gap-2">
              {health ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-neutral-900">Online & Responding</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-neutral-900">Local / Standalone Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
              Database Engine
            </span>
            <span className="text-sm font-bold text-neutral-900 block truncate">
              {health?.database || 'In-Memory / Postgres Fallback'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
              Payment Gateways
            </span>
            <span className="text-sm font-bold text-neutral-900 block">
              COD: Active • bKash: Reserved
            </span>
          </div>
        </div>
      </div>

      {/* Heroku & Vercel Deployment Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heroku Guide */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs">
                H
              </span>
              <h3 className="font-bold text-sm">Deploy Backend to Heroku</h3>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('git subtree push --prefix backend heroku main', 'Heroku deploy command')}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 cursor-pointer"
              title="Copy push command"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Your repository is already linked with Heroku remote. You can deploy the backend directly using Git Subtree:
          </p>
          <div className="p-3 bg-neutral-950 text-neutral-100 rounded-xl font-mono text-xs space-y-1">
            <div className="text-neutral-400"># Deploy backend subtree to Heroku</div>
            <div className="text-emerald-400">git subtree push --prefix backend heroku main</div>
            <div className="text-neutral-400 mt-2"># Add free PostgreSQL database addon</div>
            <div className="text-amber-400">heroku addons:create heroku-postgresql:essential-0</div>
          </div>
        </div>

        {/* Vercel Guide */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                V
              </span>
              <h3 className="font-bold text-sm">Deploy Frontend to Vercel</h3>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('cd frontend && npx vercel', 'Vercel deploy command')}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 cursor-pointer"
              title="Copy Vercel command"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Deploy the <code className="bg-neutral-100 px-1 py-0.5 rounded">frontend</code> directory to Vercel and provide your Heroku backend URL:
          </p>
          <div className="p-3 bg-neutral-950 text-neutral-100 rounded-xl font-mono text-xs space-y-1">
            <div className="text-neutral-400"># In Vercel Project Settings &gt; Environment Variables:</div>
            <div className="text-emerald-400">VITE_API_URL=https://my-medusa-store-api.herokuapp.com</div>
            <div className="text-neutral-400 mt-2"># Root Directory in Vercel project settings:</div>
            <div className="text-amber-400">frontend</div>
          </div>
        </div>
      </div>
    </div>
  );
}
