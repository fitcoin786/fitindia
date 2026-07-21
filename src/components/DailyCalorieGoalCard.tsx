import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Trophy, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  Edit3, 
  Award, 
  Zap, 
  PartyPopper,
  ChevronRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { FitcoinLogo } from './FitcoinLogo';

interface DailyCalorieGoalCardProps {
  caloriesBurned: number;
  ftcMinedToday?: number;
  onGoalMetBonusClaim?: (bonusFtc: number) => void;
}

const PRESET_GOALS = [150, 300, 500, 750, 1000];

export const DailyCalorieGoalCard: React.FC<DailyCalorieGoalCardProps> = ({
  caloriesBurned,
  ftcMinedToday = 0,
  onGoalMetBonusClaim
}) => {
  const [dailyGoalKcal, setDailyGoalKcal] = useState<number>(() => {
    const saved = localStorage.getItem('fitcoin_daily_calorie_goal');
    return saved ? parseInt(saved, 10) : 300;
  });

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState(dailyGoalKcal.toString());
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [hasClaimedBonus, setHasClaimedBonus] = useState(false);

  const celebratedGoalRef = useRef<number | null>(null);

  // Save goal preference to localStorage
  useEffect(() => {
    localStorage.setItem('fitcoin_daily_calorie_goal', dailyGoalKcal.toString());
  }, [dailyGoalKcal]);

  // Check goal progress and trigger celebration
  useEffect(() => {
    if (caloriesBurned >= dailyGoalKcal && dailyGoalKcal > 0) {
      if (celebratedGoalRef.current !== dailyGoalKcal) {
        celebratedGoalRef.current = dailyGoalKcal;
        setHasCelebrated(true);
        setShowCelebrationModal(true);
        fireCelebratoryConfetti();
      }
    } else {
      // Reset celebration if goal increased above current calories
      if (caloriesBurned < dailyGoalKcal) {
        setHasCelebrated(false);
        celebratedGoalRef.current = null;
      }
    }
  }, [caloriesBurned, dailyGoalKcal]);

  const fireCelebratoryConfetti = () => {
    // Multi-burst fireworks celebration
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Left burst
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899']
      });

      // Right burst
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899']
      });
    }, 250);
  };

  const handleSelectGoal = (goal: number) => {
    setDailyGoalKcal(goal);
    setCustomGoalInput(goal.toString());
    setIsEditingGoal(false);
  };

  const handleCustomGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customGoalInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDailyGoalKcal(parsed);
      setIsEditingGoal(false);
    }
  };

  const handleClaimBonus = () => {
    if (hasClaimedBonus) return;
    setHasClaimedBonus(true);
    if (onGoalMetBonusClaim) {
      onGoalMetBonusClaim(50); // 50 FTC Daily Goal Bonus
    }
    // Secondary mini confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const progressPct = Math.min(100, Math.round((caloriesBurned / dailyGoalKcal) * 100));
  const isGoalReached = caloriesBurned >= dailyGoalKcal;
  const remainingKcal = Math.max(0, dailyGoalKcal - Math.floor(caloriesBurned));
  const surplusKcal = Math.max(0, Math.floor(caloriesBurned) - dailyGoalKcal);

  // SVG Circular progress radius
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-5">
      
      {/* Background Decorative Glow */}
      <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isGoalReached ? 'bg-amber-500/20' : 'bg-emerald-500/10'
      }`}></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
            isGoalReached 
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-bounce' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {isGoalReached ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              Daily Calorie Burning Goal
              {isGoalReached && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  GOAL MET!
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">Burn target calories to unlock daily proof-of-burn bonus</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditingGoal(!isEditingGoal)}
          className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
          title="Change daily goal"
        >
          <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{dailyGoalKcal} kcal</span>
        </button>
      </div>

      {/* Goal Preset Selector Modal / Inline Editor */}
      {isEditingGoal && (
        <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-semibold">
            <span>Select Daily Calorie Target:</span>
            <button onClick={() => setIsEditingGoal(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_GOALS.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectGoal(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  dailyGoalKcal === preset
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {preset} kcal
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomGoalSubmit} className="flex gap-2 pt-1">
            <input
              type="number"
              placeholder="Custom goal (e.g. 600)"
              value={customGoalInput}
              onChange={(e) => setCustomGoalInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg"
            >
              Set Goal
            </button>
          </form>
        </div>
      )}

      {/* Progress Dashboard Visuals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        
        {/* SVG Circular Ring */}
        <div className="flex flex-col items-center justify-center p-2 relative">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="text-slate-800 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className={`stroke-current transition-all duration-1000 ease-out ${
                  isGoalReached ? 'text-amber-400' : 'text-emerald-400'
                }`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-white font-mono">{progressPct}%</span>
              <span className="text-[10px] text-slate-400 font-mono">COMPLETED</span>
            </div>
          </div>
        </div>

        {/* Text Metrics & Status */}
        <div className="sm:col-span-2 space-y-3 font-mono">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Calories Burned Today:</span>
              <span className="text-white font-bold">{Math.floor(caloriesBurned)} / {dailyGoalKcal} kcal</span>
            </div>
            
            {/* Linear Progress Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isGoalReached 
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-lg shadow-amber-500/50' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            {isGoalReached ? (
              <div className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg w-full">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Target Crushed! +{surplusKcal} kcal surplus extra rewards</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-slate-400 w-full bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Flame className="w-3.5 h-3.5" />
                  {remainingKcal} kcal to go
                </span>
                <span className="text-slate-500 text-[11px]">≈ {remainingKcal} FTC reward</span>
              </div>
            )}
          </div>

          {/* Action & Test Celebration Buttons */}
          <div className="flex items-center justify-between pt-1 gap-2">
            <button
              type="button"
              onClick={fireCelebratoryConfetti}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition-all"
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              Test Celebration 🎉
            </button>

            {isGoalReached && !hasClaimedBonus && (
              <button
                type="button"
                onClick={handleClaimBonus}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-[11px] font-mono flex items-center gap-1 shadow-md shadow-amber-500/20 hover:scale-[1.03] transition-all"
              >
                <Award className="w-3.5 h-3.5 fill-current" />
                Claim +50 FTC Goal Bonus
              </button>
            )}

            {hasClaimedBonus && (
              <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                +50 FTC Bonus Claimed!
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Goal Met Celebratory Banner / Popup Trigger Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center relative overflow-hidden animate-scaleUp">
            
            {/* Top Confetti Burst Graphic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-12 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-amber-500/30 transform rotate-3 animate-bounce">
              <Trophy className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                DAILY CALORIE GOAL ACCOMPLISHED!
              </span>

              <h3 className="text-2xl font-black text-white">
                {dailyGoalKcal} kcal <span className="text-amber-400">Target Met!</span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto font-mono">
                Outstanding work! You burned <span className="text-emerald-400 font-bold">{Math.floor(caloriesBurned)} kcal</span> today, generating proof-of-burn calories converted directly into Solana FTC token rewards.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Daily Target Achieved:</span>
                <span className="text-white font-bold">{dailyGoalKcal} / {dailyGoalKcal} kcal</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>FTC Reward Yielded:</span>
                <span className="text-emerald-400 font-bold">{Math.floor(caloriesBurned)} FTC</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                <span>Daily Achievement Bonus:</span>
                <span className="text-amber-400 font-bold">+50 FTC Token</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleClaimBonus();
                  setShowCelebrationModal(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Award className="w-4 h-4 fill-current" />
                Claim +50 FTC Bonus & Celebrate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
