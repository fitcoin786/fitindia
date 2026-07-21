import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Users, 
  Flame, 
  Coins, 
  Sliders, 
  RefreshCw,
  SlidersHorizontal,
  Lock,
  Unlock,
  Power,
  KeyRound,
  Bot,
  ShoppingBag,
  Wallet,
  ShieldAlert,
  UserX,
  UserCheck,
  Gift,
  Search,
  Sparkles,
  Clock,
  FastForward,
  Gauge,
  RotateCcw
} from 'lucide-react';
import { MiningSession, UserAccount, AdminFeatureControls } from '../types';
import { FitcoinLogo } from './FitcoinLogo';

interface AdminControlHubProps {
  sessions: MiningSession[];
  onApproveSession: (sessionId: string) => void;
  onRejectSession: (sessionId: string) => void;
  featureControls: AdminFeatureControls;
  onUpdateFeatureControls: (newControls: AdminFeatureControls) => void;
  currentLoggedInUser?: UserAccount | null;
}

export const AdminControlHub: React.FC<AdminControlHubProps> = ({
  sessions,
  onApproveSession,
  onRejectSession,
  featureControls,
  onUpdateFeatureControls,
  currentLoggedInUser
}) => {
  // Admin Login State for Admin Hub
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return currentLoggedInUser?.username === 'Fitrudrah' || localStorage.getItem('fitcoin_admin_authenticated') === 'true';
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  // User Management State
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForReset, setSelectedUserForReset] = useState<UserAccount | null>(null);
  const [adminSetNewPassword, setAdminSetNewPassword] = useState('');
  const [userActionSuccess, setUserActionSuccess] = useState<string | null>(null);

  // Load Registered Users
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fitcoin_registered_users');
      if (saved) {
        setRegisteredUsers(JSON.parse(saved));
      }
    } catch {
      setRegisteredUsers([]);
    }
  }, []);

  const saveUsers = (users: UserAccount[]) => {
    setRegisteredUsers(users);
    localStorage.setItem('fitcoin_registered_users', JSON.stringify(users));
  };

  // Verify Admin Login Credentials (Fitrudrah / 786786)
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (adminUsername.trim() === 'Fitrudrah' && adminPassword.trim() === '786786') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('fitcoin_admin_authenticated', 'true');
    } else {
      setLoginError('Invalid Admin Credentials. Please enter authorized credentials.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('fitcoin_admin_authenticated');
  };

  // Feature Toggle Handler
  const toggleFeature = (key: keyof AdminFeatureControls) => {
    const updated = {
      ...featureControls,
      [key]: typeof featureControls[key] === 'boolean' ? !featureControls[key] : featureControls[key]
    };
    onUpdateFeatureControls(updated);
  };

  // Numeric Property Control Handler
  const updateNumericControl = (key: keyof AdminFeatureControls, val: number) => {
    const updated = {
      ...featureControls,
      [key]: val
    };
    onUpdateFeatureControls(updated);
  };

  // Time Jump Handler (Relatively Change in Time)
  const handleTimeJump = (days: number) => {
    const currentDays = featureControls.simulatedDaysElapsed || 0;
    const newDays = currentDays + days;
    const updated = {
      ...featureControls,
      simulatedDaysElapsed: newDays
    };
    onUpdateFeatureControls(updated);
    setUserActionSuccess(`Fast-forwarded simulation clock +${days} day(s). Total time elapsed: +${newDays} days.`);
    setTimeout(() => setUserActionSuccess(null), 4000);
  };

  // Reset Simulation Time Clock
  const handleResetTime = () => {
    const updated = {
      ...featureControls,
      timeMultiplier: 1,
      simulatedDaysElapsed: 0
    };
    onUpdateFeatureControls(updated);
    setUserActionSuccess(`Simulation clock reset to Real-Time (1x) and 0 days elapsed.`);
    setTimeout(() => setUserActionSuccess(null), 3000);
  };

  // Block / Unblock User
  const toggleBlockUser = (userId: string) => {
    const updated = registeredUsers.map(u => {
      if (u.id === userId) {
        return { ...u, isBlocked: !u.isBlocked };
      }
      return u;
    });
    saveUsers(updated);
    setUserActionSuccess('User status updated successfully.');
    setTimeout(() => setUserActionSuccess(null), 3000);
  };

  // Direct Password Reset by Admin
  const handleAdminResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset || !adminSetNewPassword.trim()) return;

    const updated = registeredUsers.map(u => {
      if (u.id === selectedUserForReset.id) {
        return { ...u, passwordHash: adminSetNewPassword.trim() };
      }
      return u;
    });

    saveUsers(updated);
    setUserActionSuccess(`Password for ${selectedUserForReset.username} reset successfully to '${adminSetNewPassword.trim()}'.`);
    setSelectedUserForReset(null);
    setAdminSetNewPassword('');
    setTimeout(() => setUserActionSuccess(null), 4000);
  };

  // Credit FTC Tokens to User
  const handleCreditFtc = (userId: string, amount: number) => {
    const updated = registeredUsers.map(u => {
      if (u.id === userId) {
        return { ...u, ftcBalance: (u.ftcBalance || 0) + amount };
      }
      return u;
    });
    saveUsers(updated);
    setUserActionSuccess(`Credited +${amount} FTC to user account.`);
    setTimeout(() => setUserActionSuccess(null), 3000);
  };

  // Filtered Users
  const filteredUsers = registeredUsers.filter(
    u => u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
         u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
         u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // If Admin is not logged in, show Admin Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-rose-500/20 border-2 border-rose-500/50 rounded-2xl flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Admin Hub Security Lock</h2>
          <p className="text-xs text-slate-300 font-mono">
            Enter Master Admin credentials to access protocol settings and feature controls.
          </p>
        </div>

        {loginError && (
          <div className="bg-rose-950/90 border border-rose-500 p-3 rounded-xl text-xs font-mono text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleAdminAuthSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 block font-bold">Admin Username</label>
            <input
              type="text"
              required
              placeholder="Enter Admin Username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 block font-bold">Admin Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Authenticate Admin Control
          </button>
        </form>

        <div className="text-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400">
          <span>Protected Admin Portal • Authorized Protocol Personnel Only</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                MASTER ADMIN MODE: ACTIVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                SIMULATION SPEED: {featureControls.timeMultiplier || 1}x
              </span>
              {(featureControls.simulatedDaysElapsed || 0) > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  +{featureControls.simulatedDaysElapsed} DAYS WARPED
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              FitCoin Protocol <span className="text-rose-400">Master Control Panel</span>
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Complete admin management over live mining, time-warp simulation, emission rates, APYs, PoBC verification, wallet transfers, and user accounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold hover:bg-rose-500 hover:text-slate-950 transition-all"
            >
              Lock Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS / FEEDBACK NOTIFICATION */}
      {userActionSuccess && (
        <div className="bg-emerald-950/90 border border-emerald-500 p-4 rounded-xl text-emerald-200 text-xs font-mono flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{userActionSuccess}</span>
          </div>
        </div>
      )}

      {/* SECTION 1: TEMPORAL SIMULATION & TIME CONTROLLER (RELATIVELY CHANGE IN TIME) */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white">Temporal Simulation & Time-Warp Controller</h2>
          </div>
          <span className="text-xs text-amber-300 font-mono font-bold">
            Simulated Relative Time Controls
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
          
          {/* Time Multiplier Speed Switcher */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-200 font-bold flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-400" />
                Simulation Speed Multiplier:
              </span>
              <span className="text-amber-400 font-extrabold text-sm">{featureControls.timeMultiplier || 1}x Speed</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Accelerates relative time for real-time telemetry, FTC emissions, block creation, and staking accruals.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[1, 2, 5, 10, 60, 3600, 86400].map(speed => (
                <button
                  key={speed}
                  onClick={() => updateNumericControl('timeMultiplier', speed)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    (featureControls.timeMultiplier || 1) === speed 
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105' 
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  {speed === 1 ? '1x (Real)' : speed === 60 ? '60x (1m/s)' : speed === 3600 ? '3600x (1h/s)' : speed === 86400 ? '1 Day/s' : `${speed}x`}
                </button>
              ))}
              <button
                onClick={handleResetTime}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1"
                title="Reset to 1x Real-Time"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          {/* Fast Forward Epoch Time Jump */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-200 font-bold flex items-center gap-1.5">
                <FastForward className="w-4 h-4 text-cyan-400" />
                Fast-Forward Epoch Jump (+Days):
              </span>
              <span className="text-cyan-400 font-extrabold text-xs">Total Elapsed: +{featureControls.simulatedDaysElapsed || 0} Days</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Instantly warp simulation time into the future to test long-term staking yields and difficulty shifts.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => handleTimeJump(1)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-1"
              >
                +1 Day
              </button>
              <button
                onClick={() => handleTimeJump(7)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-1"
              >
                +7 Days (1 Wk)
              </button>
              <button
                onClick={() => handleTimeJump(30)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-1"
              >
                +30 Days (1 Mo)
              </button>
              <button
                onClick={() => handleTimeJump(365)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500 hover:text-white transition-all flex items-center gap-1"
              >
                +1 Year
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Rate Sliders (Emissions, APY, Difficulty, Target Block Time) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs pt-2">
          
          {/* Base Emission Multiplier */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-bold">Base Emission Rate:</span>
              <strong className="text-amber-400">{(featureControls.baseEmissionRate || 1.0).toFixed(1)}x</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={featureControls.baseEmissionRate || 1.0}
              onChange={(e) => updateNumericControl('baseEmissionRate', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">FTC Reward Multiplier per 100 kcal</div>
          </div>

          {/* Staking APY Multiplier */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-bold">Staking Yield APY Rate:</span>
              <strong className="text-emerald-400">{(featureControls.stakingApyMultiplier || 1.0).toFixed(1)}x</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={featureControls.stakingApyMultiplier || 1.0}
              onChange={(e) => updateNumericControl('stakingApyMultiplier', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">Global APY Multiplier for Yield Pools</div>
          </div>

          {/* Target Block Time */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-bold">PoBC Block Time:</span>
              <strong className="text-cyan-400">{featureControls.pobcBlockTimeSeconds || 10} sec</strong>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={featureControls.pobcBlockTimeSeconds || 10}
              onChange={(e) => updateNumericControl('pobcBlockTimeSeconds', parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">PoBC On-Chain Block Mint Frequency</div>
          </div>

          {/* Difficulty Multiplier */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-bold">PoBC Difficulty Target:</span>
              <strong className="text-purple-400">{(featureControls.difficultyMultiplier || 1.0).toFixed(1)}x</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={featureControls.difficultyMultiplier || 1.0}
              onChange={(e) => updateNumericControl('difficultyMultiplier', parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">Proof-of-Burn Network Hashrate Scale</div>
          </div>

        </div>
      </div>

      {/* MASTER SYSTEM FEATURE CONTROLS GRID */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Application Feature Function Switches</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Global Application Controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          
          {/* Live Mining Engine Control */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            featureControls.isMiningEnabled 
              ? 'bg-slate-950 border-emerald-500/40' 
              : 'bg-rose-950/30 border-rose-500/40 opacity-80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">Live Mining Feature</div>
                <div className="text-[10px] text-slate-400">GPS & Accelerometer Sensor Mining</div>
              </div>
            </div>

            <button
              onClick={() => toggleFeature('isMiningEnabled')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                featureControls.isMiningEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {featureControls.isMiningEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* PoBC Verification Protocol Control */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            featureControls.isPobcEnabled 
              ? 'bg-slate-950 border-emerald-500/40' 
              : 'bg-rose-950/30 border-rose-500/40 opacity-80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">PoBC Verification</div>
                <div className="text-[10px] text-slate-400">Solana Minting Protocol</div>
              </div>
            </div>

            <button
              onClick={() => toggleFeature('isPobcEnabled')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                featureControls.isPobcEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {featureControls.isPobcEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Solana Wallets & P2P Transfer Control */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            featureControls.isWalletsEnabled 
              ? 'bg-slate-950 border-emerald-500/40' 
              : 'bg-rose-950/30 border-rose-500/40 opacity-80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">Solana Wallet & P2P</div>
                <div className="text-[10px] text-slate-400">Transfers & Staking Vaults</div>
              </div>
            </div>

            <button
              onClick={() => toggleFeature('isWalletsEnabled')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                featureControls.isWalletsEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {featureControls.isWalletsEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* AI Health Suite Control */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            featureControls.isAiCoachEnabled 
              ? 'bg-slate-950 border-emerald-500/40' 
              : 'bg-rose-950/30 border-rose-500/40 opacity-80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">AI Health Suite</div>
                <div className="text-[10px] text-slate-400">Gemini Workout Coach</div>
              </div>
            </div>

            <button
              onClick={() => toggleFeature('isAiCoachEnabled')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                featureControls.isAiCoachEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {featureControls.isAiCoachEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Marketplace Control */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            featureControls.isMarketplaceEnabled 
              ? 'bg-slate-950 border-emerald-500/40' 
              : 'bg-rose-950/30 border-rose-500/40 opacity-80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">FitCoin Marketplace</div>
                <div className="text-[10px] text-slate-400">Store Purchases & Products</div>
              </div>
            </div>

            <button
              onClick={() => toggleFeature('isMarketplaceEnabled')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                featureControls.isMarketplaceEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {featureControls.isMarketplaceEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Emergency Master Pause Control */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            featureControls.isEmergencyPauseActive 
              ? 'bg-rose-950 border-rose-500' 
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Power className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-white">Emergency Protocol Lock</div>
                <div className="text-[10px] text-slate-400">Pause All System Minting</div>
              </div>
            </div>

            <button
              onClick={() => toggleFeature('isEmergencyPauseActive')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                featureControls.isEmergencyPauseActive
                  ? 'bg-rose-600 text-white shadow-lg animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {featureControls.isEmergencyPauseActive ? 'SYSTEM PAUSED' : 'NORMAL'}
            </button>
          </div>

        </div>
      </div>

      {/* REGISTERED USER MANAGEMENT TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Registered User Accounts & Access Control</h2>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user by username or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* User Password Reset Form Modal Overlay */}
        {selectedUserForReset && (
          <div className="bg-slate-950 border-2 border-amber-500/60 p-4 rounded-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                Admin Direct Password Reset for @{selectedUserForReset.username}
              </span>
              <button
                onClick={() => setSelectedUserForReset(null)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAdminResetPassword} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter new password"
                value={adminSetNewPassword}
                onChange={(e) => setAdminSetNewPassword(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold hover:bg-amber-400"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">FULL NAME</th>
                <th className="p-3">USERNAME</th>
                <th className="p-3">EMAIL</th>
                <th className="p-3">ROLE</th>
                <th className="p-3">FTC BALANCE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ADMIN ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">
                    No registered user accounts found. Users can register using the Registration form.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{usr.fullName}</td>
                    <td className="p-3 text-emerald-400 font-bold">@{usr.username}</td>
                    <td className="p-3 text-slate-400">{usr.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        usr.username === 'Fitrudrah' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {usr.username === 'Fitrudrah' ? 'ADMIN' : 'MINER'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-400">{usr.ftcBalance || 0} FTC</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        usr.isBlocked ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {usr.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleCreditFtc(usr.id, 500)}
                        className="px-2 py-1 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold text-[10px] border border-emerald-500/40"
                        title="Grant 500 FTC"
                      >
                        +500 FTC
                      </button>
                      <button
                        onClick={() => setSelectedUserForReset(usr)}
                        className="px-2 py-1 rounded bg-amber-600/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold text-[10px] border border-amber-500/40"
                      >
                        Reset Pass
                      </button>
                      {usr.username !== 'Fitrudrah' && (
                        <button
                          onClick={() => toggleBlockUser(usr.id)}
                          className={`px-2 py-1 rounded font-bold text-[10px] ${
                            usr.isBlocked ? 'bg-emerald-600 text-slate-950' : 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {usr.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flagged / Recent Sessions Inspection Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            PoBC Session Fraud Review Console
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {sessions.length} Sessions Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">SESSION ID</th>
                <th className="p-3">ACTIVITY</th>
                <th className="p-3">CALORIES</th>
                <th className="p-3">AVG HR</th>
                <th className="p-3">HEALTH SCORE</th>
                <th className="p-3">EST. FTC</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-200">{sess.id}</td>
                  <td className="p-3 text-emerald-400">{sess.activityType}</td>
                  <td className="p-3 font-bold">{sess.caloriesBurned} kcal</td>
                  <td className="p-3">{sess.heartRateAvg} bpm</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      sess.healthScorePct >= 95 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {sess.healthScorePct}%
                    </span>
                  </td>
                  <td className="p-3 font-bold text-amber-400">{sess.ftcEarned} FTC</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      sess.status === 'completed' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : sess.status === 'rejected' 
                        ? 'bg-rose-500/20 text-rose-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {sess.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {sess.status !== 'completed' && (
                      <button
                        onClick={() => onApproveSession(sess.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[10px]"
                      >
                        Approve
                      </button>
                    )}
                    {sess.status !== 'rejected' && (
                      <button
                        onClick={() => onRejectSession(sess.id)}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
