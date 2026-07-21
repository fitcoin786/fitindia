import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Wallet, 
  Bot, 
  ShoppingBag, 
  Settings, 
  Flame, 
  Zap,
  Globe,
  Coins,
  TrendingUp,
  ExternalLink,
  User,
  LogOut,
  UserPlus
} from 'lucide-react';
import { FitcoinLogo } from './FitcoinLogo';
import { FTC_PRICE_USD, FTC_HIGH_24H, FTC_LOW_24H, PROMOTION_URL, formatUsd } from '../utils/formatters';
import { UserAccount } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  todayFtc: number;
  healthScore: number;
  isLiveMining: boolean;
  ftcPriceUsd: number;
  priceTrend?: 'up' | 'down';
  priceChangePct?: number;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: (mode?: 'register' | 'login') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  todayFtc,
  healthScore,
  isLiveMining,
  ftcPriceUsd,
  priceTrend = 'up',
  priceChangePct = 0.85,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const navItems = [
    { id: 'mining', label: 'Live Mining', icon: Activity, badge: isLiveMining ? 'LIVE' : null },
    { id: 'pobc', label: 'PoBC Verification', icon: ShieldCheck },
    { id: 'wallets', label: 'Solana Wallets', icon: Wallet },
    { id: 'ai', label: 'AI Health Suite', icon: Bot, highlight: true },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'admin', label: 'Admin Hub', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/40 text-slate-100">
      {/* Top Ticker Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950/90 to-slate-950 border-b border-emerald-800/30 px-4 py-1.5 text-xs flex flex-wrap justify-between items-center gap-2 font-mono">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          <FitcoinLogo size="xs" showGlow={true} />
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-emerald-400 font-bold tracking-tight">
              1 FITCOIN (FTC) = ${ftcPriceUsd.toFixed(9)} USD
            </span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold font-mono transition-colors flex items-center gap-0.5 ${
              priceTrend === 'up' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
            }`}>
              {priceTrend === 'up' ? '▲ +' : '▼ '}{priceChangePct >= 0 ? `+${priceChangePct}%` : `${priceChangePct}%`}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-300 flex items-center gap-1 whitespace-nowrap">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            24h High: <strong className="text-emerald-400">${FTC_HIGH_24H.toFixed(9)}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-rose-300 flex items-center gap-1 whitespace-nowrap">
            24h Low: <strong className="text-rose-400">${FTC_LOW_24H.toFixed(9)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Promotional Redirect Link */}
          <a
            href={PROMOTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 text-[11px] transition-all"
          >
            <span>Www.Futurecoin.in</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>

          <div className="flex items-center gap-1.5 text-slate-300 hidden md:flex">
            <Globe className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>Solana Mainnet</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Health:</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[11px]">
              {healthScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Round Fitcoin Icon & Redirect Link */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('mining')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <FitcoinLogo size="lg" showGlow={true} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                    FUTURECOIN.IN
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-tight font-mono -mt-1">
                  FITCOIN (FTC) HUMAN ENERGY MINING
                </p>
              </div>
            </div>

            <a 
              href={PROMOTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-mono text-amber-300 transition-colors"
            >
              <span>Visit www.Futurecoin.in</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-red-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && !isActive && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick FTC Counter Badge & Account User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-slate-900/90 border border-emerald-500/30 rounded-xl px-3 py-1.5 items-center gap-2 shadow-inner">
              <FitcoinLogo size="xs" showGlow={false} />
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-mono leading-none">TODAY MINED</div>
                <div className="text-sm font-extrabold text-emerald-400 font-mono">
                  {todayFtc.toLocaleString()} <span className="text-amber-400 text-xs">FTC</span>
                </div>
              </div>
            </div>

            {/* Auth Buttons / Profile Badge */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-1 flex items-center gap-2 font-mono text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="text-left">
                    <div className="text-white font-bold leading-tight flex items-center gap-1">
                      <span>{currentUser.fullName || currentUser.username}</span>
                      {currentUser.username === 'Fitrudrah' && (
                        <span className="px-1 py-0.2 rounded text-[9px] bg-rose-500/30 text-rose-300 font-extrabold">ADMIN</span>
                      )}
                    </div>
                    <div className="text-[10px] text-emerald-400">@{currentUser.username}</div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-slate-800 transition-all"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Nav Bar */}
      <div className="md:hidden flex overflow-x-auto border-t border-slate-800 bg-slate-950 px-2 py-2 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isActive
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 bg-slate-900/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
