import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Zap, 
  Check, 
  Star, 
  ShieldCheck, 
  Coins,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { MarketplaceItem } from '../types';
import { MOCK_MARKETPLACE } from '../data/mockData';
import { FitcoinLogo } from './FitcoinLogo';
import { PROMOTION_URL, formatFtcToUsd, FTC_PRICE_USD } from '../utils/formatters';

interface MarketplaceHubProps {
  userFtcBalance: number;
  onPurchaseItem: (item: MarketplaceItem) => void;
}

export const MarketplaceHub: React.FC<MarketplaceHubProps> = ({
  userFtcBalance,
  onPurchaseItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [purchasingItem, setPurchasingItem] = useState<MarketplaceItem | null>(null);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  const categories = ['All', 'Wearables', 'Mining Boosters', 'Supplements', 'Passes'];

  const filteredItems = selectedCategory === 'All'
    ? MOCK_MARKETPLACE
    : MOCK_MARKETPLACE.filter(item => item.category === selectedCategory);

  const handleConfirmPurchase = () => {
    if (!purchasingItem) return;
    if (userFtcBalance < purchasingItem.priceFtc) {
      alert("Insufficient FTC balance in Main Wallet.");
      return;
    }

    onPurchaseItem(purchasingItem);
    setPurchaseSuccessMessage(`Successfully purchased ${purchasingItem.name}! Transaction signed on Solana.`);
    setPurchasingItem(null);

    setTimeout(() => {
      setPurchaseSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1 inline-block">
              FITPOOL REWARDS & UTILITY
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              FTC <span className="text-emerald-400">Marketplace & Boosters</span>
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Redeem freshly mined FTC tokens for smart wearables, 2x PoBC NFT boosters, organic athletic fuel, and global gym passes.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-800/50 p-4 rounded-xl text-right font-mono flex items-center gap-3">
            <FitcoinLogo size="md" showGlow={true} />
            <div>
              <div className="text-[10px] text-slate-400">AVAILABLE LIQUID BALANCE</div>
              <div className="text-2xl font-extrabold text-emerald-400 flex items-center justify-end gap-1">
                <span>{userFtcBalance.toLocaleString()}</span>
                <span className="text-amber-400 text-xs">FTC</span>
              </div>
              <div className="text-[10px] text-slate-400">≈ {formatFtcToUsd(userFtcBalance)} USD</div>
            </div>
          </div>
        </div>
      </div>

      {purchaseSuccessMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-mono animate-fade-in">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{purchaseSuccessMessage}</span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-emerald-700/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.badge && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950 shadow">
                    {item.badge}
                  </span>
                )}
                <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{item.category}</span>
                <h3 className="font-bold text-white text-sm leading-snug group-hover:text-emerald-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-emerald-400 font-mono flex items-center gap-1.5">
                  <FitcoinLogo size="xs" showGlow={false} />
                  <span>{item.priceFtc}</span>
                  <span className="text-amber-400 text-xs">FTC</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">≈ {formatFtcToUsd(item.priceFtc)}</div>
                <div className="text-[10px] text-slate-500 line-through">Retail ${item.retailUsd.toFixed(2)} USD</div>
              </div>

              <button
                onClick={() => setPurchasingItem(item)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1 transition-all shadow-sm"
              >
                <span>Buy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {purchasingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Confirm Solana FTC Checkout</h3>
              <button onClick={() => setPurchasingItem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <img src={purchasingItem.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <div className="font-bold text-white text-sm">{purchasingItem.name}</div>
                <div className="text-xs text-slate-400">{purchasingItem.category}</div>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Item Price:</span>
                <span className="text-amber-400 font-bold">{purchasingItem.priceFtc} FTC</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Solana Network Gas Fee:</span>
                <span className="text-emerald-400">0.000005 SOL</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2 font-bold text-slate-200">
                <span>Your Main Wallet Balance:</span>
                <span>{userFtcBalance.toLocaleString()} FTC</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPurchasingItem(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Sign Solana SPL Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
