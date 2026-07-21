import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LiveMiningDashboard } from './components/LiveMiningDashboard';
import { ProofOfBurnHub } from './components/ProofOfBurnHub';
import { WalletAndStakingHub } from './components/WalletAndStakingHub';
import { AICoachHub } from './components/AICoachHub';
import { MarketplaceHub } from './components/MarketplaceHub';
import { AdminControlHub } from './components/AdminControlHub';
import { AuthModal } from './components/AuthModal';
import { FitcoinLogo } from './components/FitcoinLogo';
import { ExternalLink, AlertTriangle, ShieldAlert, Power } from 'lucide-react';
import { 
  FTC_PRICE_USD, 
  FTC_HIGH_24H, 
  FTC_LOW_24H, 
  PROMOTION_URL 
} from './utils/formatters';

import { 
  INITIAL_WALLETS, 
  INITIAL_USER_STATS, 
  RECENT_SESSIONS, 
  RECENT_SOLANA_TXS, 
  MOCK_STAKING_POOLS,
  ACTIVE_FITPOOL_MINERS
} from './data/mockData';

import { 
  WalletDetail, 
  MiningSession, 
  SolanaTx, 
  StakingPool, 
  MarketplaceItem,
  WalletType,
  UserAccount,
  AdminFeatureControls
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('mining');
  const [wallets, setWallets] = useState<WalletDetail[]>(INITIAL_WALLETS);
  const [userStats, setUserStats] = useState(INITIAL_USER_STATS);
  const [sessions, setSessions] = useState<MiningSession[]>(RECENT_SESSIONS);
  const [transactions, setTransactions] = useState<SolanaTx[]>(RECENT_SOLANA_TXS);
  const [stakingPools, setStakingPools] = useState<StakingPool[]>(MOCK_STAKING_POOLS);
  const [ftcPriceUsd, setFtcPriceUsd] = useState<number>(FTC_PRICE_USD);
  const [priceTrend, setPriceTrend] = useState<'up' | 'down'>('up');
  const [priceChangePct, setPriceChangePct] = useState<number>(+0.85);

  // Live FTC Price Fluctuation (+ / -) Every 3 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFtcPriceUsd(prevPrice => {
        const isUp = Math.random() > 0.48;
        const deltaFactor = (Math.random() * 0.017 + 0.001) * (isUp ? 1 : -1);
        const newPrice = Math.max(0.000001500, Math.min(0.000008500, prevPrice * (1 + deltaFactor)));

        if (newPrice >= prevPrice) {
          setPriceTrend('up');
        } else {
          setPriceTrend('down');
        }

        const pct = ((newPrice - FTC_PRICE_USD) / FTC_PRICE_USD) * 100;
        setPriceChangePct(parseFloat(pct.toFixed(2)));

        return newPrice;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Admin Master Feature Controls State
  const [featureControls, setFeatureControls] = useState<AdminFeatureControls>(() => {
    const defaultControls: AdminFeatureControls = {
      isMiningEnabled: true,
      isPobcEnabled: true,
      isWalletsEnabled: true,
      isAiCoachEnabled: true,
      isMarketplaceEnabled: true,
      isEmergencyPauseActive: false,
      baseEmissionRate: 1.0,
      dailyCapFtc: 250000,
      antiCheatThreshold: 90,
      timeMultiplier: 1,
      simulatedDaysElapsed: 0,
      stakingApyMultiplier: 1.0,
      pobcBlockTimeSeconds: 10,
      difficultyMultiplier: 1.0,
      globalBonusMultiplier: 1.0
    };
    try {
      const saved = localStorage.getItem('fitcoin_admin_feature_controls');
      return saved ? { ...defaultControls, ...JSON.parse(saved) } : defaultControls;
    } catch {
      return defaultControls;
    }
  });

  // Real-Time Blockchain Stream: Auto-generate live network FTC transactions scaled by time multiplier & block time
  useEffect(() => {
    if (featureControls.isEmergencyPauseActive) return;

    const timeSpeed = featureControls.timeMultiplier || 1;
    const baseTargetSec = featureControls.pobcBlockTimeSeconds || 10;
    const computedIntervalMs = Math.max(500, Math.floor((baseTargetSec * 1000) / timeSpeed));

    const txInterval = setInterval(() => {
      const miners = ACTIVE_FITPOOL_MINERS;
      if (!miners || miners.length === 0) return;
      
      const randomMiner = miners[Math.floor(Math.random() * miners.length)];
      const txTypes: ('POBC_MINT' | 'TRANSFER' | 'STAKE_LOCK')[] = ['POBC_MINT', 'POBC_MINT', 'TRANSFER', 'STAKE_LOCK'];
      const chosenType = txTypes[Math.floor(Math.random() * txTypes.length)];

      let amt = 0;
      let memoStr = '';
      const bonusMult = (featureControls.globalBonusMultiplier || 1.0) * (featureControls.baseEmissionRate || 1.0);

      if (chosenType === 'POBC_MINT') {
        amt = Math.floor((Math.random() * 480 + 90) * bonusMult);
        memoStr = `PoBC Block #${248912000 + Math.floor(Math.random() * 8000)} Mint: ${randomMiner.name} (${randomMiner.favoriteActivity})`;
      } else if (chosenType === 'TRANSFER') {
        amt = Math.floor((Math.random() * 350 + 50) * (featureControls.baseEmissionRate || 1.0));
        const recipientMiner = miners[Math.floor(Math.random() * miners.length)];
        memoStr = `P2P Transfer: ${randomMiner.name} ➔ ${recipientMiner.name} (${randomMiner.walletAddress.substring(0, 8)}...)`;
      } else {
        amt = Math.floor((Math.random() * 900 + 150) * (featureControls.stakingApyMultiplier || 1.0));
        memoStr = `Solana Yield Vault Stake Lock: ${randomMiner.name} (${amt} FTC)`;
      }

      const generatedTx: SolanaTx = {
        signature: `sol-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`,
        type: chosenType,
        amountFtc: amt,
        timestamp: Date.now(),
        status: 'confirmed',
        blockNumber: 248912000 + Math.floor(Math.random() * 10000),
        memo: memoStr
      };

      setTransactions(prev => [generatedTx, ...prev.slice(0, 99)]);
    }, computedIntervalMs);

    return () => clearInterval(txInterval);
  }, [featureControls.isEmergencyPauseActive, featureControls.timeMultiplier, featureControls.pobcBlockTimeSeconds, featureControls.baseEmissionRate, featureControls.globalBonusMultiplier, featureControls.stakingApyMultiplier]);

  // User Account & Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('fitcoin_logged_in_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'register' | 'login'>('register');

  // Save feature controls to localStorage
  const handleUpdateFeatureControls = (newControls: AdminFeatureControls) => {
    setFeatureControls(newControls);
    localStorage.setItem('fitcoin_admin_feature_controls', JSON.stringify(newControls));
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('fitcoin_logged_in_user', JSON.stringify(user));
    
    // Check if user has FTC balance bonus
    if (user.ftcBalance && user.ftcBalance > 0) {
      setWallets(prev => prev.map(w => {
        if (w.type === 'main') {
          const newBal = w.balanceFtc + user.ftcBalance!;
          return {
            ...w,
            balanceFtc: newBal,
            usdValue: newBal * ftcPriceUsd
          };
        }
        return w;
      }));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fitcoin_logged_in_user');
    localStorage.removeItem('fitcoin_admin_authenticated');
  };

  const openAuthModal = (mode: 'register' | 'login' = 'register') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const mainWallet = wallets.find(w => w.type === 'main') || wallets[0];

  // Handler: Real-time Live Mining Update
  const handleLiveMiningUpdate = (deltaCalories: number, deltaFtc: number) => {
    if (featureControls.isEmergencyPauseActive || !featureControls.isMiningEnabled) return;
    if (deltaFtc <= 0 && deltaCalories <= 0) return;

    const adjustedFtc = deltaFtc * featureControls.baseEmissionRate;

    setWallets(prev => prev.map(w => {
      if (w.type === 'mining') {
        const updatedFtc = w.balanceFtc + adjustedFtc;
        return {
          ...w,
          balanceFtc: updatedFtc,
          usdValue: updatedFtc * ftcPriceUsd
        };
      }
      return w;
    }));

    setUserStats(prev => ({
      ...prev,
      todayCalories: prev.todayCalories + deltaCalories,
      todayFtcEarned: prev.todayFtcEarned + adjustedFtc,
      totalFtcEarned: prev.totalFtcEarned + adjustedFtc
    }));
  };

  // Handler: Complete Mining Session
  const handleCompleteSession = (newSession: MiningSession) => {
    setSessions(prev => [newSession, ...prev]);

    const newTx: SolanaTx = {
      signature: newSession.solanaTxHash || `tx-${Date.now()}`,
      type: 'POBC_MINT',
      amountFtc: newSession.ftcEarned,
      timestamp: Date.now(),
      status: 'confirmed',
      blockNumber: 248911000 + Math.floor(Math.random() * 500),
      memo: `PoBC Block Mint: ${newSession.caloriesBurned} kcal burned (${newSession.activityType})`
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Handler: Claim Mined Rewards to Main Wallet
  const handleClaimMined = () => {
    const miningW = wallets.find(w => w.type === 'mining');
    if (!miningW || miningW.balanceFtc <= 0) return;

    const claimedAmt = miningW.balanceFtc;

    setWallets(prev => prev.map(w => {
      if (w.type === 'mining') {
        return { ...w, balanceFtc: 0, usdValue: 0 };
      }
      if (w.type === 'main') {
        return { 
          ...w, 
          balanceFtc: w.balanceFtc + claimedAmt,
          usdValue: (w.balanceFtc + claimedAmt) * ftcPriceUsd 
        };
      }
      return w;
    }));

    const tx: SolanaTx = {
      signature: `claim-${Date.now().toString(36)}`,
      type: 'CLAIM_MINED',
      amountFtc: claimedAmt,
      timestamp: Date.now(),
      status: 'confirmed',
      blockNumber: 248911500,
      memo: `Claim Mined Rewards to Main Wallet: ${claimedAmt} FTC`
    };
    setTransactions(prev => [tx, ...prev]);
  };

  // Handler: Stake FTC into Vault
  const handleStakeFtc = (poolId: string, amount: number) => {
    if (mainWallet.balanceFtc < amount) {
      alert("Insufficient Main Wallet FTC balance to lock into staking vault.");
      return;
    }

    setWallets(prev => prev.map(w => {
      if (w.type === 'main') {
        return {
          ...w,
          balanceFtc: w.balanceFtc - amount,
          usdValue: (w.balanceFtc - amount) * ftcPriceUsd
        };
      }
      if (w.type === 'staking') {
        return {
          ...w,
          balanceFtc: w.balanceFtc + amount,
          usdValue: (w.balanceFtc + amount) * ftcPriceUsd
        };
      }
      return w;
    }));

    setStakingPools(prev => prev.map(p => {
      if (p.id === poolId) {
        return {
          ...p,
          totalStakedFtc: p.totalStakedFtc + amount,
          userStakedFtc: p.userStakedFtc + amount
        };
      }
      return p;
    }));

    const tx: SolanaTx = {
      signature: `stake-${Date.now().toString(36)}`,
      type: 'STAKE_LOCK',
      amountFtc: amount,
      timestamp: Date.now(),
      status: 'confirmed',
      blockNumber: 248911800,
      memo: `Stake Lock into PoBC Yield Vault: ${amount} FTC`
    };
    setTransactions(prev => [tx, ...prev]);
  };

  // Handler: Purchase Marketplace Item
  const handlePurchaseItem = (item: MarketplaceItem) => {
    if (mainWallet.balanceFtc < item.priceFtc) return;

    setWallets(prev => prev.map(w => {
      if (w.type === 'main') {
        return {
          ...w,
          balanceFtc: w.balanceFtc - item.priceFtc,
          usdValue: (w.balanceFtc - item.priceFtc) * ftcPriceUsd
        };
      }
      return w;
    }));

    const tx: SolanaTx = {
      signature: `buy-${Date.now().toString(36)}`,
      type: 'STORE_PURCHASE',
      amountFtc: item.priceFtc,
      timestamp: Date.now(),
      status: 'confirmed',
      blockNumber: 248912000,
      memo: `Marketplace Purchase: ${item.name}`
    };
    setTransactions(prev => [tx, ...prev]);
  };

  // Handler: Transfer FTC to Miner Wallet Address
  const handleTransferFtc = (fromType: WalletType, toAddress: string, amount: number, memo: string) => {
    const sourceWallet = wallets.find(w => w.type === fromType);
    if (!sourceWallet || sourceWallet.balanceFtc < amount) {
      alert("Insufficient FTC balance in selected wallet.");
      return false;
    }

    setWallets(prev => prev.map(w => {
      if (w.type === fromType) {
        const newBal = parseFloat((w.balanceFtc - amount).toFixed(2));
        return {
          ...w,
          balanceFtc: newBal,
          usdValue: newBal * ftcPriceUsd
        };
      }
      if (w.address.toLowerCase() === toAddress.toLowerCase()) {
        const newBal = parseFloat((w.balanceFtc + amount).toFixed(2));
        return {
          ...w,
          balanceFtc: newBal,
          usdValue: newBal * ftcPriceUsd
        };
      }
      return w;
    }));

    const tx: SolanaTx = {
      signature: `p2p-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`,
      type: 'TRANSFER',
      amountFtc: amount,
      timestamp: Date.now(),
      status: 'confirmed',
      blockNumber: 248912500 + Math.floor(Math.random() * 500),
      memo: memo || `P2P Transfer to Miner Wallet: ${toAddress.substring(0, 10)}...`
    };

    setTransactions(prev => [tx, ...prev]);
    return true;
  };

  // Admin Session Handlers
  const handleApproveSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'completed', isVerified: true };
      }
      return s;
    }));
  };

  const handleRejectSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'rejected', isVerified: false };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      
      {/* Registration / Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalInitialMode}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayFtc={userStats.todayFtcEarned}
        healthScore={userStats.healthScore}
        isLiveMining={false}
        ftcPriceUsd={ftcPriceUsd}
        priceTrend={priceTrend}
        priceChangePct={priceChangePct}
        currentUser={currentUser}
        onOpenAuthModal={openAuthModal}
        onLogout={handleLogout}
      />

      {/* Emergency System Pause Alert Banner if toggled by Admin */}
      {featureControls.isEmergencyPauseActive && (
        <div className="bg-rose-950/90 border-b border-rose-500 px-4 py-2 text-xs font-mono text-rose-200 flex items-center justify-center gap-2">
          <Power className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Protocol Emergency Lock Active: All live minting and reward emissions are temporarily paused by Admin Fitrudrah.</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Live Mining */}
        {activeTab === 'mining' && (
          !featureControls.isMiningEnabled ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3 font-mono">
              <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-extrabold text-white">Live Mining Module Paused</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                This feature function has been temporarily disabled by Admin. Please check back shortly.
              </p>
            </div>
          ) : (
            <LiveMiningDashboard
              onCompleteSession={handleCompleteSession}
              onLiveUpdate={handleLiveMiningUpdate}
              healthScore={userStats.healthScore}
              miningWalletFtc={wallets.find(w => w.type === 'mining')?.balanceFtc || 0}
              onTransferFtc={handleTransferFtc}
              mainWalletBalance={wallets.find(w => w.type === 'main')?.balanceFtc || 15420}
            />
          )
        )}

        {/* Tab 2: PoBC Verification */}
        {activeTab === 'pobc' && (
          !featureControls.isPobcEnabled ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3 font-mono">
              <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-xl font-extrabold text-white">PoBC Verification Module Under Maintenance</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                PoBC Solana verification is currently locked by Admin.
              </p>
            </div>
          ) : (
            <ProofOfBurnHub />
          )
        )}

        {/* Tab 3: Wallets & Staking */}
        {activeTab === 'wallets' && (
          !featureControls.isWalletsEnabled ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3 font-mono">
              <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-xl font-extrabold text-white">Solana Wallets & P2P Disabled</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Solana transfer operations are currently disabled by Admin.
              </p>
            </div>
          ) : (
            <WalletAndStakingHub
              wallets={wallets}
              stakingPools={stakingPools}
              transactions={transactions}
              onClaimMined={handleClaimMined}
              onStake={handleStakeFtc}
              onTransferFtc={handleTransferFtc}
              ftcPriceUsd={ftcPriceUsd}
            />
          )
        )}

        {/* Tab 4: AI Health Suite */}
        {activeTab === 'ai' && (
          !featureControls.isAiCoachEnabled ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3 font-mono">
              <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-xl font-extrabold text-white">AI Health Suite Offline</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                AI Assistant is temporarily locked by Admin.
              </p>
            </div>
          ) : (
            <AICoachHub />
          )
        )}

        {/* Tab 5: Marketplace */}
        {activeTab === 'marketplace' && (
          !featureControls.isMarketplaceEnabled ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3 font-mono">
              <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-xl font-extrabold text-white">FitCoin Marketplace Closed</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Store purchasing is disabled by Admin.
              </p>
            </div>
          ) : (
            <MarketplaceHub
              userFtcBalance={mainWallet.balanceFtc}
              onPurchaseItem={handlePurchaseItem}
            />
          )
        )}

        {/* Tab 6: Admin Control Hub */}
        {activeTab === 'admin' && (
          <AdminControlHub
            sessions={sessions}
            onApproveSession={handleApproveSession}
            onRejectSession={handleRejectSession}
            featureControls={featureControls}
            onUpdateFeatureControls={handleUpdateFeatureControls}
            currentLoggedInUser={currentUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FitcoinLogo size="sm" showGlow={true} />
            <a 
              href={PROMOTION_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-slate-200 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>WWW.FUTURECOIN.IN</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
            <span className="text-slate-600">– FitPool Human Energy Mining Engine v5.0</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={PROMOTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              Fitcoin Official Portal: www.Futurecoin.in
            </a>
            <span>•</span>
            <span className="text-amber-400">PoBC Consensus Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
