import React, { useState } from 'react';
import { 
  Wallet, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock, 
  Coins, 
  RefreshCw,
  Send,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  QrCode,
  UserCheck
} from 'lucide-react';
import { WalletDetail, StakingPool, SolanaTx, WalletType, FitPoolMiner } from '../types';
import { FitcoinLogo } from './FitcoinLogo';
import { FTC_PRICE_USD, formatFtcToUsd, formatUsd, PROMOTION_URL } from '../utils/formatters';
import { ACTIVE_FITPOOL_MINERS } from '../data/mockData';

interface WalletAndStakingHubProps {
  wallets: WalletDetail[];
  stakingPools: StakingPool[];
  transactions: SolanaTx[];
  onClaimMined: () => void;
  onStake: (poolId: string, amount: number) => void;
  onTransferFtc?: (fromType: WalletType, toAddress: string, amount: number, memo: string) => boolean;
  ftcPriceUsd?: number;
}

export const WalletAndStakingHub: React.FC<WalletAndStakingHubProps> = ({
  wallets,
  stakingPools,
  transactions,
  onClaimMined,
  onStake,
  onTransferFtc,
  ftcPriceUsd = FTC_PRICE_USD
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [stakeModalPool, setStakeModalPool] = useState<StakingPool | null>(null);
  const [stakeAmountInput, setStakeAmountInput] = useState('200');
  const [activeTab, setActiveTab] = useState<'wallets' | 'transfer' | 'staking' | 'solana'>('wallets');

  // P2P Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferStep, setTransferStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [selectedSourceType, setSelectedSourceType] = useState<WalletType>('main');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMemo, setTransferMemo] = useState('');
  const [searchMinerQuery, setSearchMinerQuery] = useState('');
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [explorerTxSearch, setExplorerTxSearch] = useState('');
  const [selectedExplorerTx, setSelectedExplorerTx] = useState<SolanaTx | null>(null);
  const [confirmedTxDetails, setConfirmedTxDetails] = useState<{
    signature: string;
    blockNumber: number;
    amount: number;
    recipient: string;
    fromWallet: string;
  } | null>(null);

  const mainWallet = wallets.find(w => w.type === 'main') || wallets[0];
  const miningWallet = wallets.find(w => w.type === 'mining') || wallets[1];
  const sourceWallet = wallets.find(w => w.type === selectedSourceType) || mainWallet;

  const totalFtcBalance = wallets.reduce((acc, w) => acc + w.balanceFtc, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getWalletIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wallet': return Wallet;
      case 'Zap': return Zap;
      case 'ShieldCheck': return ShieldCheck;
      case 'TrendingUp': return TrendingUp;
      case 'Users': return Users;
      case 'GraduationCap': return GraduationCap;
      default: return Wallet;
    }
  };

  const handleConfirmStake = () => {
    if (!stakeModalPool) return;
    const amt = parseFloat(stakeAmountInput);
    if (isNaN(amt) || amt <= 0) return;
    onStake(stakeModalPool.id, amt);
    setStakeModalPool(null);
  };

  const handleOpenTransferModal = (presetRecipient?: string) => {
    if (presetRecipient) {
      setRecipientAddress(presetRecipient);
    }
    setTransferStep('input');
    setIsTransferModalOpen(true);
  };

  const handleProceedToReview = () => {
    const amt = parseFloat(transferAmount);
    if (!recipientAddress || recipientAddress.trim().length < 8) {
      alert("Please enter a valid FitPool or Solana FTC wallet address.");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }
    if (amt > sourceWallet.balanceFtc) {
      alert(`Insufficient balance in ${sourceWallet.name}. Available: ${sourceWallet.balanceFtc} FTC`);
      return;
    }
    setTransferStep('confirm');
  };

  const handleExecuteTransfer = () => {
    const amt = parseFloat(transferAmount);
    if (!onTransferFtc) return;

    setIsProcessingTx(true);
    setTimeout(() => {
      const success = onTransferFtc(selectedSourceType, recipientAddress.trim(), amt, transferMemo);
      setIsProcessingTx(false);
      if (success) {
        const sig = `p2p-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
        const blk = 248912500 + Math.floor(Math.random() * 500);
        setConfirmedTxDetails({
          signature: sig,
          blockNumber: blk,
          amount: amt,
          recipient: recipientAddress.trim(),
          fromWallet: sourceWallet.name
        });
        setTransferStep('success');
      }
    }, 1200);
  };

  const filteredMiners = ACTIVE_FITPOOL_MINERS.filter(m => 
    m.name.toLowerCase().includes(searchMinerQuery.toLowerCase()) ||
    m.username.toLowerCase().includes(searchMinerQuery.toLowerCase()) ||
    m.walletAddress.toLowerCase().includes(searchMinerQuery.toLowerCase())
  );

  const p2pTransactions = transactions.filter(t => t.type === 'TRANSFER');

  return (
    <div className="space-y-8">
      {/* Total Balance Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <FitcoinLogo size="xl" showGlow={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SOLANA SPL TOKEN: FITCOIN (FTC)
                </span>
                <a 
                  href={PROMOTION_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline text-xs font-mono font-bold flex items-center gap-1"
                >
                  www.Futurecoin.in
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="mt-2 text-xs text-slate-400 font-mono">TOTAL ECOSYSTEM BALANCE</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-baseline gap-2">
                {totalFtcBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-amber-400 text-xl font-bold">FTC</span>
              </div>
              <div className="text-sm text-emerald-400 font-mono mt-0.5">
                ≈ {formatFtcToUsd(totalFtcBalance, ftcPriceUsd)} USD <span className="text-slate-500 text-xs">(@ ${ftcPriceUsd.toFixed(9)}/FTC)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Transfer FTC Button */}
            <button
              onClick={() => handleOpenTransferModal()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4 fill-current" />
              Transfer FTC to Miner Address
            </button>

            {miningWallet.balanceFtc > 0 && (
              <button
                onClick={onClaimMined}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                Claim {miningWallet.balanceFtc.toLocaleString()} Mined FTC
              </button>
            )}

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">SOL GAS FEE COVERAGE</span>
                <span className="text-emerald-400 font-bold">{mainWallet.solBalance} SOL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inner Sub-Tab Selector */}
        <div className="flex flex-wrap border-b border-slate-800 mt-6 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('wallets')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'wallets' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            6 Specialized Wallets
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'transfer' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-400" />
            P2P Miner Transfer Directory
          </button>
          <button
            onClick={() => setActiveTab('staking')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'staking' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            PoBC Staking Vaults
          </button>
          <button
            onClick={() => setActiveTab('solana')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'solana' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Solana On-Chain Explorer
          </button>
        </div>
      </div>

      {/* Tab 1: 6 Specialized Wallets Grid */}
      {activeTab === 'wallets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((w) => {
            const Icon = getWalletIcon(w.iconName);
            const isCopied = copiedAddress === w.address;
            return (
              <div
                key={w.type}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-700/60 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-white text-sm">{w.name}</h3>
                    </div>
                    {w.balanceFtc > 0 && (
                      <button
                        onClick={() => {
                          setSelectedSourceType(w.type);
                          handleOpenTransferModal();
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-all"
                        title="Send FTC from this wallet"
                      >
                        <Send className="w-3 h-3" />
                        Send
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {w.description}
                  </p>

                  <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">BALANCE</div>
                    <div className="text-2xl font-black text-white font-mono flex items-baseline justify-between">
                      <span>{w.balanceFtc.toLocaleString()} <span className="text-amber-400 text-xs">FTC</span></span>
                      <span className="text-xs font-normal text-emerald-400">{formatFtcToUsd(w.balanceFtc)} USD</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-800/80 font-mono">
                  <span className="truncate max-w-[160px]">{w.address}</span>
                  <button
                    onClick={() => copyToClipboard(w.address)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: P2P Miner Transfer Directory & History */}
      {activeTab === 'transfer' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-400" />
                  FitPool Miners P2P Transfer Network
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Send FitCoin (FTC) directly to any verified miner or Solana wallet address instantly with 0 gas fee.
                </p>
              </div>

              <button
                onClick={() => handleOpenTransferModal()}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                Transfer to Custom Wallet Address
              </button>
            </div>

            {/* Active FitPool Miners Directory */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Active FitPool Miners Directory
                </h3>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search miner name or address..."
                    value={searchMinerQuery}
                    onChange={(e) => setSearchMinerQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredMiners.map((miner) => (
                  <div
                    key={miner.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-600/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={miner.avatar}
                        alt={miner.name}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-white text-xs truncate">{miner.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{miner.username}</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2 rounded-lg text-[10px] font-mono space-y-1 border border-slate-800">
                      <div className="flex justify-between text-slate-400">
                        <span>Rank:</span>
                        <span className="text-amber-400 font-bold">#{miner.rank}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Health Score:</span>
                        <span className="text-emerald-400 font-bold">{miner.healthScore}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Total Mined:</span>
                        <span className="text-white font-bold">{miner.totalMinedFtc.toLocaleString()} FTC</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono truncate">
                      <span className="truncate">{miner.walletAddress}</span>
                      <a
                        href="https://advanced-miner-v3.preview.emergentagent.com/explorer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-0.5 ml-1 shrink-0"
                        title="View on Explorer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <button
                      onClick={() => handleOpenTransferModal(miner.walletAddress)}
                      className="w-full py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Send className="w-3 h-3" />
                      Send FTC
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent P2P Transfer Transactions */}
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                Recent P2P Transfer History
              </h3>

              {p2pTransactions.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs font-mono bg-slate-950 rounded-xl border border-slate-800">
                  No peer-to-peer transfers executed yet. Click "Transfer FTC" to send tokens.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">TRANSACTION HASH</th>
                        <th className="p-2.5">AMOUNT</th>
                        <th className="p-2.5">BLOCK</th>
                        <th className="p-2.5">STATUS</th>
                        <th className="p-2.5">MEMO / DETAILS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {p2pTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-2.5 text-emerald-400 font-bold underline">{tx.signature.substring(0, 16)}...</td>
                          <td className="p-2.5 font-bold text-amber-300">{tx.amountFtc} FTC</td>
                          <td className="p-2.5 text-slate-400">#{tx.blockNumber}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-400 truncate max-w-[240px]">{tx.memo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Staking & Yield Vaults */}
      {activeTab === 'staking' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              PoBC Yield Staking Pools
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Earn passive FTC yield on proof-of-burned calories collateral
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stakingPools.map((pool) => (
              <div
                key={pool.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {pool.lockDays > 0 ? `${pool.lockDays} DAYS LOCK` : 'FLEXIBLE LOCK'}
                    </span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {pool.apyPct}% <span className="text-xs font-normal text-slate-400">APY</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base">{pool.name}</h3>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Pool Staked:</span>
                      <span className="text-slate-200">{pool.totalStakedFtc.toLocaleString()} FTC</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Min Lock Amount:</span>
                      <span className="text-slate-200">{pool.minStakeFtc} FTC</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Your Active Stake:</span>
                      <span className="text-emerald-400 font-bold">{pool.userStakedFtc.toLocaleString()} FTC</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Accrued Yield:</span>
                      <span className="text-amber-400 font-bold">{pool.earnedFtc.toFixed(2)} FTC</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStakeModalPool(pool)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Stake FTC into Pool
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Solana Block Explorer Real-Time Transactions */}
      {activeTab === 'solana' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">
                  Real-Time Solana SPL Blockchain Explorer
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live merged block confirmation stream across miners, workouts, and P2P transfers
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://advanced-miner-v3.preview.emergentagent.com/explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                Open Advanced Miner Explorer ↗
              </a>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search signature, type, or memo..."
                value={explorerTxSearch}
                onChange={(e) => setExplorerTxSearch(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 self-end sm:self-center">
              <span>Total Logged: <strong className="text-emerald-400">{transactions.length} txs</strong></span>
              <span>•</span>
              <span className="text-amber-400">Mainnet-Beta</span>
            </div>
          </div>

          {/* Real-time Transactions Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">SIGNATURE HASH</th>
                  <th className="p-3">AMOUNT (FTC)</th>
                  <th className="p-3">BLOCK HEIGHT</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">MEMO / NOTE</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {transactions
                  .filter(tx => 
                    tx.signature.toLowerCase().includes(explorerTxSearch.toLowerCase()) ||
                    tx.type.toLowerCase().includes(explorerTxSearch.toLowerCase()) ||
                    tx.memo.toLowerCase().includes(explorerTxSearch.toLowerCase())
                  )
                  .map((tx, idx) => (
                    <tr key={tx.signature || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'POBC_MINT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          tx.type === 'TRANSFER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          tx.type === 'STAKE_LOCK' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td 
                        onClick={() => setSelectedExplorerTx(tx)}
                        className="p-3 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1 group"
                      >
                        <span>{tx.signature.substring(0, 14)}...{tx.signature.substring(tx.signature.length - 4)}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </td>
                      <td className="p-3 font-bold text-white">
                        +{tx.amountFtc.toLocaleString()} FTC
                        <span className="text-[10px] text-slate-400 font-normal block">
                          ≈ {formatFtcToUsd(tx.amountFtc)} USD
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono">#{tx.blockNumber}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 truncate max-w-[220px]">{tx.memo}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedExplorerTx(tx)}
                          className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-bold transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Real-time Explorer Transaction Detail Modal */}
      {selectedExplorerTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">On-Chain Transaction Details</h3>
              </div>
              <button 
                onClick={() => setSelectedExplorerTx(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Transaction Type:</span>
                <span className="font-bold text-amber-400">{selectedExplorerTx.type}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Signature Hash:</span>
                <span className="text-emerald-400 font-bold truncate max-w-[180px]">{selectedExplorerTx.signature}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Amount:</span>
                <span className="text-white font-extrabold">{selectedExplorerTx.amountFtc.toLocaleString()} FTC ({formatFtcToUsd(selectedExplorerTx.amountFtc)})</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Block Height:</span>
                <span className="text-slate-200">#{selectedExplorerTx.blockNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Network Finality:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED (400ms)
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Memo / Proof-of-Burn Note:</span>
                <p className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-[11px] text-slate-300">
                  {selectedExplorerTx.memo}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <a
                href="https://advanced-miner-v3.preview.emergentagent.com/explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                Advanced Miner Explorer ↗
              </a>
              <button
                onClick={() => setSelectedExplorerTx(null)}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stake Modal */}
      {stakeModalPool && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Stake into {stakeModalPool.name}</h3>
              <button onClick={() => setStakeModalPool(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Lock FTC tokens to earn <span className="text-emerald-400 font-bold">{stakeModalPool.apyPct}% APY</span> yield. Lock period: {stakeModalPool.lockDays} days.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">Enter FTC Amount to Stake:</label>
              <input
                type="number"
                value={stakeAmountInput}
                onChange={(e) => setStakeAmountInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-lg font-mono text-white font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setStakeModalPool(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStake}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs"
              >
                Confirm Lock Stake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* P2P Transfer & On-Chain Confirmation Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">
                  {transferStep === 'input' && 'Transfer FitCoin (FTC) to Miner Wallet'}
                  {transferStep === 'confirm' && 'Confirm Solana On-Chain Transaction'}
                  {transferStep === 'success' && 'FTC Transfer Settlement Confirmed!'}
                </h3>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Input Form */}
            {transferStep === 'input' && (
              <div className="space-y-4">
                {/* Source Wallet Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-semibold flex justify-between">
                    <span>Select Source Wallet:</span>
                    <span className="text-emerald-400">Available: {sourceWallet.balanceFtc.toLocaleString()} FTC</span>
                  </label>
                  <select
                    value={selectedSourceType}
                    onChange={(e) => setSelectedSourceType(e.target.value as WalletType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-emerald-500"
                  >
                    {wallets.map(w => (
                      <option key={w.type} value={w.type}>
                        {w.name} ({w.balanceFtc.toLocaleString()} FTC)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient Wallet Address Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-semibold flex justify-between">
                    <span>Recipient FitPool / Solana Wallet Address:</span>
                    <span className="text-slate-500 text-[10px]">SPL Token Standard</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. FitPool99x7p2L1z9aB3cC4dD5eE6fF7gG8hH9iJ0kK1"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-emerald-500 pr-10"
                    />
                    <QrCode className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Quick Pick Active Miner */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400">Quick Pick Active FitPool Miner:</span>
                  <div className="flex flex-wrap gap-2">
                    {ACTIVE_FITPOOL_MINERS.slice(0, 3).map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setRecipientAddress(m.walletAddress)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all flex items-center gap-1.5 ${
                          recipientAddress === m.walletAddress
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-300 font-semibold">
                    <span>Enter FTC Amount:</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTransferAmount((sourceWallet.balanceFtc * 0.25).toFixed(0))}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                      >
                        25%
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransferAmount((sourceWallet.balanceFtc * 0.50).toFixed(0))}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransferAmount(sourceWallet.balanceFtc.toString())}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xl font-mono text-white font-extrabold outline-none focus:border-emerald-500"
                  />
                  {parseFloat(transferAmount) > 0 && (
                    <div className="text-right text-xs font-mono text-emerald-400">
                      ≈ {formatFtcToUsd(parseFloat(transferAmount))} USD
                    </div>
                  )}
                </div>

                {/* Optional Memo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-semibold">
                    Transaction Note / Memo (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Workout challenge reward / Mining share"
                    value={transferMemo}
                    onChange={(e) => setTransferMemo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Action Controls */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProceedToReview}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    Review & Confirm FTC Transfer
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm Transaction Review */}
            {transferStep === 'confirm' && (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Source Wallet:</span>
                    <span className="text-white font-bold">{sourceWallet.name}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Recipient Address:</span>
                    <span className="text-emerald-300 font-bold truncate max-w-[200px]">{recipientAddress}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Transfer Amount:</span>
                    <span className="text-amber-400 font-extrabold text-sm">{transferAmount} FTC</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">USD Equivalent:</span>
                    <span className="text-emerald-400">{formatFtcToUsd(parseFloat(transferAmount))} USD</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Solana Network Fee:</span>
                    <span className="text-teal-300 font-bold">0.000005 SOL (Covered)</span>
                  </div>

                  {transferMemo && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memo Note:</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{transferMemo}</span>
                    </div>
                  )}
                </div>

                <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Solana SPL Smart Contract Instant Settlement (~400ms finality).</span>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setTransferStep('input')}
                    disabled={isProcessingTx}
                    className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleExecuteTransfer}
                    disabled={isProcessingTx}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {isProcessingTx ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Signing On-Chain...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                        Confirm & Execute Transfer
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Confirmation */}
            {transferStep === 'success' && confirmedTxDetails && (
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg font-extrabold text-white">Transfer Confirmed & Settled!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Successfully sent <span className="text-amber-400 font-bold">{confirmedTxDetails.amount} FTC</span> to wallet.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Signature Hash:</span>
                    <span className="text-emerald-400 font-bold truncate max-w-[180px]">{confirmedTxDetails.signature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Solana Block #:</span>
                    <span className="text-slate-200">#{confirmedTxDetails.blockNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recipient:</span>
                    <span className="text-slate-200 truncate max-w-[180px]">{confirmedTxDetails.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-bold">CONFIRMED ON SOLANA MAINNET</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-3">
                  <button
                    onClick={() => copyToClipboard(confirmedTxDetails.signature)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Tx Hash
                  </button>

                  <button
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
