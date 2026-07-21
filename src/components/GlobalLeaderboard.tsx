import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  Zap, 
  Search, 
  TrendingUp, 
  Users, 
  Crown, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
  Copy,
  Check,
  QrCode,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { FitPoolMiner, WalletType } from '../types';
import { ACTIVE_FITPOOL_MINERS } from '../data/mockData';
import { formatFtcToUsd } from '../utils/formatters';

interface GlobalLeaderboardProps {
  currentUserCaloriesBurned?: number;
  currentUserMinedFtc?: number;
  onTransferFtc?: (fromType: WalletType, toAddress: string, amount: number, memo: string) => boolean;
  userMainWalletBalance?: number;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  currentUserCaloriesBurned = 320,
  currentUserMinedFtc = 450,
  onTransferFtc,
  userMainWalletBalance = 15420
}) => {
  const [filterTimeframe, setFilterTimeframe] = useState<'today' | 'weekly' | 'allTime'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Transfer Modal State in Leaderboard
  const [selectedMinerForTransfer, setSelectedMinerForTransfer] = useState<FitcoinLogoMiner | null>(null);
  const [transferAmountInput, setTransferAmountInput] = useState<string>('100');
  const [transferMemoInput, setTransferMemoInput] = useState<string>('');
  const [isProcessingTx, setIsProcessingTx] = useState<boolean>(false);
  const [confirmedTx, setConfirmedTx] = useState<{
    hash: string;
    amount: number;
    recipientName: string;
    recipientAddress: string;
  } | null>(null);

  // Explorer Modal State
  const [explorerMiner, setExplorerMiner] = useState<FitcoinLogoMiner | null>(null);

  // Copy helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // Include current user in leaderboard calculation
  const currentUserMiner: FitcoinLogoMiner = {
    id: 'miner-user-me',
    name: 'You (Current Miner)',
    username: '@fitcoin_pioneer',
    walletAddress: 'FitPool99x7p2L1z9aB3cC4dD5eE6fF7gG8hH9iJ0kK1',
    rank: 0, // dynamic
    healthScore: 98,
    totalMinedFtc: 12500 + currentUserMinedFtc,
    dailyCaloriesBurned: currentUserCaloriesBurned,
    favoriteActivity: 'Running',
    countryCode: 'US',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'Mining Now'
  };

  type FitcoinLogoMiner = FitPoolMiner & { dailyCaloriesBurned?: number };

  // Check for any registered users in localStorage
  const getRegisteredUserMiners = (): FitcoinLogoMiner[] => {
    try {
      const stored = localStorage.getItem('fitcoin_registered_users');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((user: any, idx: number) => ({
        id: `reg-user-${user.id || idx}`,
        name: user.name || user.email?.split('@')[0] || `Miner #${idx + 1}`,
        username: `@${user.name?.toLowerCase().replace(/\s+/g, '_') || 'miner_' + idx}`,
        walletAddress: user.walletAddress || `FitPoolReg${idx}x9a8b7c6d5e4f321`,
        rank: 0,
        healthScore: 96,
        totalMinedFtc: user.minedFtc || (800 + idx * 45),
        dailyCaloriesBurned: user.dailyCalories || (220 + (idx % 15) * 20),
        favoriteActivity: 'Running',
        countryCode: 'US',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        status: 'Verified' as const
      }));
    } catch (e) {
      return [];
    }
  };

  const registeredMiners = getRegisteredUserMiners();

  // Combine & sort miners up to 100+
  const allMiners: FitcoinLogoMiner[] = [
    currentUserMiner,
    ...registeredMiners,
    ...ACTIVE_FITPOOL_MINERS
  ];

  const sortedMiners = [...allMiners].sort((a, b) => {
    if (filterTimeframe === 'today') {
      return (b.dailyCaloriesBurned || 0) - (a.dailyCaloriesBurned || 0);
    }
    return b.totalMinedFtc - a.totalMinedFtc;
  }).map((miner, index) => ({
    ...miner,
    rank: index + 1
  }));

  const filteredMiners = sortedMiners
    .filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 100);

  const currentUserRank = sortedMiners.find(m => m.id === 'miner-user-me')?.rank || 1;

  const totalFilteredCount = filteredMiners.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMiners = filteredMiners.slice(startIndex, startIndex + pageSize);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg shadow-amber-500/40 animate-pulse">
          <Crown className="w-5 h-5 fill-current" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
          <Trophy className="w-4 h-4 fill-current" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 text-slate-100 flex items-center justify-center font-black text-sm shadow-md">
          <Award className="w-4 h-4 fill-current" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-mono font-bold flex items-center justify-center text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">Global Proof-of-Burn Leaderboard</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                TOP 100 SOLANA MINERS
              </span>
            </div>
            <p className="text-xs text-slate-400">Top 100 registered live miners ranked by verified daily calories burned and FTC yield</p>
          </div>
        </div>

        {/* Timeframe & Search Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search miner or country..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950 text-slate-200 border border-slate-800 pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex text-xs font-mono">
            <button
              onClick={() => {
                setFilterTimeframe('today');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterTimeframe === 'today'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today's Kcal
            </button>
            <button
              onClick={() => {
                setFilterTimeframe('allTime');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterTimeframe === 'allTime'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All-Time FTC
            </button>
          </div>
        </div>
      </div>

      {/* Your Personal Rank Card */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-950 to-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-mono font-extrabold text-emerald-300 text-sm">
            #{currentUserRank}
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <span>YOUR CURRENT RANKING</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-sm font-extrabold text-white">You (@fitcoin_pioneer)</div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">DAILY KCAL</span>
            <span className="text-amber-400 font-extrabold text-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {currentUserCaloriesBurned} kcal
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">TOTAL MINED</span>
            <span className="text-emerald-300 font-extrabold text-sm">{currentUserMinedFtc.toLocaleString()} FTC</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">RANK</th>
              <th className="p-3">MINER</th>
              <th className="p-3">COUNTRY</th>
              <th className="p-3">SOLANA WALLET ADDRESS</th>
              <th className="p-3">DAILY BURN</th>
              <th className="p-3">HEALTH SCORE</th>
              <th className="p-3">TOTAL FTC MINED</th>
              <th className="p-3">P2P TRANSFER / ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {paginatedMiners.map((miner) => {
              const isCurrentUser = miner.id === 'miner-user-me';
              return (
                <tr 
                  key={miner.id} 
                  className={`transition-colors ${
                    isCurrentUser 
                      ? 'bg-emerald-950/40 border-l-4 border-l-emerald-400 font-bold' 
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Rank */}
                  <td className="p-3">
                    {getRankBadge(miner.rank)}
                  </td>

                  {/* Miner Info */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={miner.avatar}
                        alt={miner.name}
                        className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {miner.name}
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">YOU</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{miner.username}</div>
                      </div>
                    </div>
                  </td>

                  {/* Country */}
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-bold">
                      {miner.countryCode}
                    </span>
                  </td>

                  {/* Wallet Address & Copy */}
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800/80 max-w-[170px]">
                      <span className="text-[11px] font-mono text-emerald-400 truncate">
                        {miner.walletAddress.substring(0, 8)}...{miner.walletAddress.substring(miner.walletAddress.length - 4)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(miner.walletAddress)}
                        title="Copy Solana Wallet Address"
                        className="text-slate-400 hover:text-white transition-colors p-0.5"
                      >
                        {copiedAddress === miner.walletAddress ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Daily Calories Burned */}
                  <td className="p-3">
                    <span className="font-extrabold text-amber-400 flex items-center gap-1 text-sm">
                      <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                      {miner.dailyCaloriesBurned || 0} kcal
                    </span>
                  </td>

                  {/* Health Score */}
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">{miner.healthScore}%</span>
                    </div>
                  </td>

                  {/* Total Mined FTC */}
                  <td className="p-3">
                    <div>
                      <span className="font-extrabold text-emerald-300 text-sm">{miner.totalMinedFtc.toLocaleString()} FTC</span>
                      <span className="text-[10px] text-slate-500 block">≈ {formatFtcToUsd(miner.totalMinedFtc)}</span>
                    </div>
                  </td>

                  {/* P2P Transfer & Explorer Buttons */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {!isCurrentUser ? (
                        <button
                          onClick={() => {
                            setSelectedMinerForTransfer(miner);
                            setConfirmedTx(null);
                            setTransferAmountInput('100');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Send className="w-3 h-3" />
                          Send FTC
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Self Wallet</span>
                      )}

                      <a
                        href="https://advanced-miner-v3.preview.emergentagent.com/explorer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-bold flex items-center gap-1"
                        title="View on Advanced Miner Explorer"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        Explorer
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination & Display Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span>Showing ranks {totalFilteredCount > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, totalFilteredCount)} of {totalFilteredCount} miners</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Page Size Selector */}
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            {[10, 25, 50, 100].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  pageSize === size
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Page buttons */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-500 font-bold"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                    currentPage === p
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-500 font-bold"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* P2P Miner FTC Transfer Modal */}
      {selectedMinerForTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">
                  Transfer FTC to Miner
                </h3>
              </div>
              <button
                onClick={() => setSelectedMinerForTransfer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {!confirmedTx ? (
              <div className="space-y-4">
                {/* Recipient Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedMinerForTransfer.avatar}
                      alt={selectedMinerForTransfer.name}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                    />
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        {selectedMinerForTransfer.name}
                        <span className="text-amber-400 font-mono text-[10px]">Rank #{selectedMinerForTransfer.rank}</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                        {selectedMinerForTransfer.username}
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://advanced-miner-v3.preview.emergentagent.com/explorer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-emerald-400 border border-slate-800 text-[10px]"
                    title="View in Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Recipient Wallet Address Display */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">Target Miner Solana Wallet Address:</span>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 flex items-center justify-between">
                    <span className="truncate mr-2">{selectedMinerForTransfer.walletAddress}</span>
                    <button
                      onClick={() => copyToClipboard(selectedMinerForTransfer.walletAddress)}
                      className="text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedAddress === selectedMinerForTransfer.walletAddress ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300 font-semibold">Transfer Amount (FTC):</span>
                    <span className="text-slate-400">Available: <strong className="text-emerald-400">{userMainWalletBalance.toLocaleString()} FTC</strong></span>
                  </div>
                  <input
                    type="number"
                    value={transferAmountInput}
                    onChange={(e) => setTransferAmountInput(e.target.value)}
                    placeholder="100"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xl font-mono text-white font-extrabold outline-none focus:border-emerald-500"
                  />
                  {parseFloat(transferAmountInput) > 0 && (
                    <div className="text-right text-xs font-mono text-emerald-400">
                      ≈ {formatFtcToUsd(parseFloat(transferAmountInput))} USD
                    </div>
                  )}
                </div>

                {/* Optional Memo */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">Transaction Memo / Note:</span>
                  <input
                    type="text"
                    value={transferMemoInput}
                    onChange={(e) => setTransferMemoInput(e.target.value)}
                    placeholder="e.g. Leaderboard reward / Proof-of-burn transfer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedMinerForTransfer(null)}
                    disabled={isProcessingTx}
                    className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const amt = parseFloat(transferAmountInput);
                      if (isNaN(amt) || amt <= 0) {
                        alert("Please enter a valid transfer amount.");
                        return;
                      }
                      setIsProcessingTx(true);
                      setTimeout(() => {
                        if (onTransferFtc) {
                          onTransferFtc('main', selectedMinerForTransfer.walletAddress, amt, transferMemoInput || `Leaderboard P2P transfer to ${selectedMinerForTransfer.name}`);
                        }
                        setIsProcessingTx(false);
                        const sig = `p2p-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
                        setConfirmedTx({
                          hash: sig,
                          amount: amt,
                          recipientName: selectedMinerForTransfer.name,
                          recipientAddress: selectedMinerForTransfer.walletAddress
                        });
                      }, 1000);
                    }}
                    disabled={isProcessingTx}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {isProcessingTx ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Executing On-Chain...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 fill-current" />
                        Execute FTC Transfer
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Success confirmation */
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-white">FTC Transfer Settled!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Transferred <span className="text-amber-400 font-bold">{confirmedTx.amount} FTC</span> to <span className="text-white font-bold">{confirmedTx.recipientName}</span>.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction Signature:</span>
                    <span className="text-emerald-400 font-bold truncate max-w-[160px]">{confirmedTx.hash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Wallet:</span>
                    <span className="text-slate-200 truncate max-w-[160px]">{confirmedTx.recipientAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Solana Network Status:</span>
                    <span className="text-emerald-400 font-bold">CONFIRMED (Finality ~400ms)</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href="https://advanced-miner-v3.preview.emergentagent.com/explorer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    Open Explorer
                  </a>
                  <button
                    onClick={() => setSelectedMinerForTransfer(null)}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs"
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
