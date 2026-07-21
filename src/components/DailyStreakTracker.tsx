import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Award, 
  ShieldAlert, 
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { FitcoinLogo } from './FitcoinLogo';

interface DailyStreakTrackerProps {
  currentStreakDays?: number;
  longestStreakDays?: number;
  isTodayGoalMet?: boolean;
  onClaimStreakBonus?: (bonusFtc: number) => void;
}

interface StreakDay {
  dayName: string;
  dateStr: string;
  isCompleted: boolean;
  isToday: boolean;
  caloriesBurned: number;
}

export const DailyStreakTracker: React.FC<DailyStreakTrackerProps> = ({
  currentStreakDays = 5,
  longestStreakDays = 12,
  isTodayGoalMet = false,
  onClaimStreakBonus
}) => {
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('fitcoin_user_streak_count');
    return saved ? parseInt(saved, 10) : currentStreakDays;
  });

  const [hasClaimedWeeklyBonus, setHasClaimedWeeklyBonus] = useState<boolean>(() => {
    return localStorage.getItem('fitcoin_weekly_streak_claimed') === 'true';
  });

  const [showBonusModal, setShowBonusModal] = useState(false);

  // Sync today's goal completion to streak count
  useEffect(() => {
    if (isTodayGoalMet) {
      const todayKey = `fitcoin_streak_completed_${new Date().toISOString().slice(0, 10)}`;
      if (!localStorage.getItem(todayKey)) {
        localStorage.setItem(todayKey, 'true');
        setStreakCount(prev => {
          const newStreak = prev + 1;
          localStorage.setItem('fitcoin_user_streak_count', newStreak.toString());
          return newStreak;
        });
      }
    }
  }, [isTodayGoalMet]);

  // Generate 7-day past week calendar simulation
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = 4; // e.g., Friday or today

  const mockWeeklyHistory: StreakDay[] = daysOfWeek.map((day, idx) => {
    const isToday = idx === todayIndex;
    const isPast = idx < todayIndex;
    return {
      dayName: day,
      dateStr: `Jul ${15 + idx}`,
      isCompleted: isPast ? true : isToday ? isTodayGoalMet : false,
      isToday,
      caloriesBurned: isPast ? 350 + (idx * 20) : isToday && isTodayGoalMet ? 320 : 0
    };
  });

  // Calculate Streak Tier
  const getStreakTier = (days: number) => {
    if (days >= 30) return { name: 'Titan Proof-of-Burner', multiplier: '1.5x', color: 'from-amber-400 to-orange-500', minDays: 30 };
    if (days >= 14) return { name: 'Gold Miner', multiplier: '1.25x', color: 'from-yellow-400 to-amber-500', minDays: 14 };
    if (days >= 7) return { name: 'Silver Streak', multiplier: '1.15x', color: 'from-cyan-400 to-blue-500', minDays: 7 };
    return { name: 'Bronze Flame', multiplier: '1.05x', color: 'from-emerald-400 to-teal-500', minDays: 3 };
  };

  const currentTier = getStreakTier(streakCount);

  const handleClaimWeeklyBonus = () => {
    if (hasClaimedWeeklyBonus) return;
    setHasClaimedWeeklyBonus(true);
    localStorage.setItem('fitcoin_weekly_streak_claimed', 'true');
    setShowBonusModal(true);
    if (onClaimStreakBonus) {
      onClaimStreakBonus(100); // 100 FTC 7-Day Streak Bonus
    }
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-5">
      {/* Background Flame Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Streak Counter */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/20 animate-pulse">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">Daily Mining Streak</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-gradient-to-r ${currentTier.color} text-slate-950 shadow-sm`}>
                {currentTier.name}
              </span>
            </div>
            <p className="text-xs text-slate-400">Mine consecutive days to boost your PoBC reward multiplier</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-[10px] text-slate-400">LONGEST STREAK</div>
          <div className="text-xs font-bold text-amber-400 flex items-center justify-end gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            {Math.max(streakCount, longestStreakDays)} Days
          </div>
        </div>
      </div>

      {/* Big Flame Streak Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-orange-500/30 transform -rotate-3">
              <Flame className="w-10 h-10 fill-current animate-bounce" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-white font-mono flex items-baseline gap-2">
              <span>{streakCount}</span>
              <span className="text-orange-400 text-lg font-extrabold">DAYS STREAK</span>
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Mining Yield Multiplier: <strong className="text-white">{currentTier.multiplier}</strong></span>
            </div>
          </div>
        </div>

        {/* 7-Day Streak Bonus Action */}
        <div className="w-full sm:w-auto text-right">
          {!hasClaimedWeeklyBonus && streakCount >= 5 ? (
            <button
              onClick={handleClaimWeeklyBonus}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
            >
              <Award className="w-4 h-4 fill-current" />
              Claim 100 FTC Streak Bonus
            </button>
          ) : (
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-[11px] font-mono text-slate-400 text-center sm:text-right">
              {hasClaimedWeeklyBonus ? (
                <span className="text-emerald-400 font-bold flex items-center justify-center sm:justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Weekly 100 FTC Claimed
                </span>
              ) : (
                <span>2 days left to unlock 100 FTC bonus</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Weekly Calendar Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            This Week's Goal Achievement:
          </span>
          <span>{streakCount % 7}/7 Days Completed</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {mockWeeklyHistory.map((day, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-between h-20 transition-all ${
                day.isCompleted
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                  : day.isToday
                  ? 'bg-amber-950/30 border-amber-500/60 text-amber-300 animate-pulse'
                  : 'bg-slate-950 border-slate-800/80 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-mono font-bold">{day.dayName}</span>

              <div className="my-1">
                {day.isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : day.isToday ? (
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700 bg-slate-900"></div>
                )}
              </div>

              <span className="text-[9px] font-mono text-slate-400">
                {day.isCompleted ? `${day.caloriesBurned} kcal` : day.isToday ? 'Today' : 'Upcoming'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Bonus Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/30">
              <Award className="w-8 h-8 fill-current" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-white">Streak Milestone Unlocked!</h4>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                You earned a <span className="text-amber-400 font-bold">+100 FTC</span> token bonus for maintaining a high-fidelity proof-of-burn streak!
              </p>
            </div>

            <button
              onClick={() => setShowBonusModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs"
            >
              Collect Rewards
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
