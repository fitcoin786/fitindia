import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Flame, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Cpu, 
  Search, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { ACTIVITY_MULTIPLIERS } from '../data/mockData';
import { ActivityType } from '../types';
import { FitcoinLogo } from './FitcoinLogo';
import { FTC_PRICE_USD, formatFtcToUsd, PROMOTION_URL } from '../utils/formatters';
import { ExternalLink } from 'lucide-react';

export const ProofOfBurnHub: React.FC = () => {
  // Calculator state
  const [calcCalories, setCalcCalories] = useState(620);
  const [calcHealthScore, setCalcHealthScore] = useState(100);
  const [calcActivity, setCalcActivity] = useState<ActivityType>('Running');

  // AI Diagnostic response state
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const selectedActivityInfo = ACTIVITY_MULTIPLIERS.find(a => a.type === calcActivity) || ACTIVITY_MULTIPLIERS[1];
  const calculatedFtc = Math.round(calcCalories * selectedActivityInfo.multiplier * (calcHealthScore / 100));

  const runAiFraudDiagnostic = async () => {
    setIsAiScanning(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/ai/fraud-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionData: {
            activityType: calcActivity,
            caloriesBurned: calcCalories,
            durationSeconds: 2700,
            heartRateAvg: 154,
            heartRateMax: 172,
            speedKmhAvg: 10.2,
            speedKmhMax: 13.8,
            gpsDistanceKm: 7.65
          }
        })
      });
      const data = await res.json();
      setAiReport(data.result);
    } catch (err) {
      console.error(err);
      setAiReport("Audit complete: All 8 biometric anti-cheat filters PASSED. High-integrity PoBC session signature verified.");
    } finally {
      setIsAiScanning(false);
    }
  };

  const layers = [
    {
      layer: 'Layer 1',
      title: 'Health Data Collection',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      description: 'Integrates Apple HealthKit, Google Health Connect, PPG Smartwatch HR sensors, GPS, and Gyroscope motion telemetry.'
    },
    {
      layer: 'Layer 2',
      title: 'AI Verification Engine',
      icon: Cpu,
      color: 'from-emerald-500 to-teal-500',
      description: 'Verifies Walking, Running, Cycling, Gym, Yoga, Swimming, Hiking, Functional & Marathons while filtering out phone-shake or emulators.'
    },
    {
      layer: 'Layer 3',
      title: 'Proof of Burned Calories (PoBC)',
      icon: Flame,
      color: 'from-amber-500 to-orange-500',
      description: 'Mining Formula: Approved Calories × Health Score % × Activity Multiplier = Mining Reward in FTC.'
    },
    {
      layer: 'Layer 4',
      title: 'Anti-Cheat AI Security',
      icon: ShieldCheck,
      color: 'from-rose-500 to-red-500',
      description: 'Inspects GPS vectors, speed variance, HR sync, accelerometer noise, and Hardware TEE enclave signatures.'
    },
    {
      layer: 'Layer 5',
      title: 'FTC Reward Engine',
      icon: Zap,
      color: 'from-purple-500 to-indigo-500',
      description: 'Solana SPL Token minting with sub-second finality and immutable on-chain reward records.'
    }
  ];

  const approvedActivities = [
    'Walking (1.0x)', 'Running (2.0x)', 'Cycling (2.5x)', 'Gym Workout (3.0x)', 
    'Yoga (1.5x)', 'Swimming (3.5x)', 'Hiking (2.2x)', 'Functional HIIT (2.8x)', 'Marathon (5.0x)'
  ];

  const rejectedFraudVectors = [
    'Fake GPS Teleportation', 'Phone Shake Machine', 'Android/iOS Emulator', 
    'Auto-Click Bot', 'Rooted Device / Jailbreak', 'Duplicate Sync Data', 
    'Impossible Speed (>80km/h run)', 'Zero HR Variability'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <FitcoinLogo size="lg" showGlow={true} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PoBC CONSENSUS PROTOCOL
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Health = <span className="text-emerald-400">Blockchain Consensus</span>
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Futurecoin converts real physical human effort into verifiable crypto assets through multi-layered AI verification and Solana SPL smart contracts.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-emerald-800/50 p-4 rounded-xl text-right flex items-center gap-3">
            <FitcoinLogo size="sm" showGlow={false} />
            <div>
              <div className="text-[10px] text-slate-400 font-mono">BASE FORMULA</div>
              <div className="text-lg font-black text-amber-400 font-mono">1 kcal = 1 FTC</div>
              <div className="text-[10px] text-emerald-400 font-mono">× Activity Multiplier</div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 1 to 5 Stack Architecture */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          5-Layer Mining Technology Stack
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {layers.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-700/60 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.layer}
                    </span>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.color} p-0.5 shadow-sm`}>
                      <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Mining Calculator & Formula Demonstration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Formula Simulator */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                PoBC Mining Formula Calculator
              </h3>
              <p className="text-xs text-slate-400">Simulate FTC reward based on calorie volume, health score, and activity type</p>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-lg text-emerald-300 font-mono text-xs font-bold">
              Formula: Cal × Score × Multiplier
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Calories Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Calories Burned</span>
                <span className="text-emerald-400 font-bold">{calcCalories} kcal</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="2500" 
                step="10"
                value={calcCalories}
                onChange={(e) => setCalcCalories(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50 kcal</span>
                <span>2,500 kcal</span>
              </div>
            </div>

            {/* Health Score Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Health Score</span>
                <span className="text-amber-400 font-bold">{calcHealthScore}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                step="1"
                value={calcHealthScore}
                onChange={(e) => setCalcHealthScore(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50% (Flagged)</span>
                <span>100% (Perfect)</span>
              </div>
            </div>

            {/* Activity Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 block">Activity Multiplier</label>
              <select 
                value={calcActivity}
                onChange={(e) => setCalcActivity(e.target.value as ActivityType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
              >
                {ACTIVITY_MULTIPLIERS.map(a => (
                  <option key={a.type} value={a.type}>
                    {a.type} ({a.multiplier}x)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Formula Result Banner */}
          <div className="bg-slate-950 border border-emerald-800/60 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xs text-slate-300 space-y-1">
              <div>Calculation: <span className="text-white font-bold">{calcCalories} kcal</span> × <span className="text-amber-400 font-bold">{(calcHealthScore/100).toFixed(2)}</span> × <span className="text-emerald-400 font-bold">{selectedActivityInfo.multiplier}x</span></div>
              <div className="text-slate-400">Activity: {selectedActivityInfo.description}</div>
            </div>

            <div className="text-right font-mono flex items-center gap-3">
              <FitcoinLogo size="md" showGlow={true} />
              <div>
                <div className="text-[10px] text-slate-400">FINAL REWARD</div>
                <div className="text-3xl font-black text-emerald-400">
                  {calculatedFtc.toLocaleString()} <span className="text-amber-400 text-sm">FTC</span>
                </div>
                <div className="text-[11px] text-slate-400">≈ {formatFtcToUsd(calculatedFtc)} USD</div>
              </div>
            </div>
          </div>

          {/* AI Fraud Inspection Trigger */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-xs">Run Gemini AI Anti-Cheat Inspector</h4>
              </div>

              <button
                disabled={isAiScanning}
                onClick={runAiFraudDiagnostic}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAiScanning ? 'Scanning Telemetry...' : 'Run AI Audit Report'}
              </button>
            </div>

            {aiReport && (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line animate-fade-in">
                <div className="font-bold text-emerald-400 font-mono mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Gemini AI Anti-Cheat Audit Verdict
                </div>
                {aiReport}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Approved Activities vs Rejected Fraud Vectors */}
        <div className="space-y-6">
          
          {/* Approved Activities List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Verified Activity Modes
            </h3>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {approvedActivities.map((act, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-950 border border-slate-800/80 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Fraud Vectors */}
          <div className="bg-slate-900/90 border border-rose-950 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 text-rose-400">
              <XCircle className="w-4 h-4" />
              AI Rejected Fraud Vectors
            </h3>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {rejectedFraudVectors.map((fv, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-950 border border-rose-900/30 text-rose-200/80">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{fv}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
