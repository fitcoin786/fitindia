import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Flame, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Activity, 
  Calendar,
  Gift
} from 'lucide-react';

export interface MilestoneAchievement {
  id: string;
  title: string;
  description: string;
  category: 'calories' | 'streak' | 'solana' | 'health';
  targetValue: number;
  currentValue: number;
  bonusFtc: number;
  iconName: string;
  isUnlocked: boolean;
  isClaimed: boolean;
}

interface AchievementsBadgesProps {
  totalCaloriesBurned?: number;
  consecutiveStreakDays?: number;
  totalMinedFtc?: number;
  healthScore?: number;
  onClaimAchievementBonus?: (bonusFtc: number, achievementTitle: string) => void;
}

export const AchievementsBadges: React.FC<AchievementsBadgesProps> = ({
  totalCaloriesBurned = 1450,
  consecutiveStreakDays = 5,
  totalMinedFtc = 2800,
  healthScore = 98,
  onClaimAchievementBonus
}) => {
  const [claimedAchievements, setClaimedAchievements] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('fitcoin_claimed_achievements');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'calories' | 'streak' | 'solana'>('all');

  // Define All Milestone Achievements
  const achievements: MilestoneAchievement[] = [
    {
      id: 'achieve-kcal-1',
      title: 'First Flame',
      description: 'Burn 100 total calories through verified fitness activities.',
      category: 'calories',
      targetValue: 100,
      currentValue: totalCaloriesBurned,
      bonusFtc: 25,
      iconName: 'Flame',
      isUnlocked: totalCaloriesBurned >= 100,
      isClaimed: !!claimedAchievements['achieve-kcal-1']
    },
    {
      id: 'achieve-kcal-1000',
      title: '1,000 Total Kcal Burned',
      description: 'Crush the 1,000 calorie threshold and convert proof-of-burn into Solana SPL tokens.',
      category: 'calories',
      targetValue: 1000,
      currentValue: totalCaloriesBurned,
      bonusFtc: 150,
      iconName: 'Trophy',
      isUnlocked: totalCaloriesBurned >= 1000,
      isClaimed: !!claimedAchievements['achieve-kcal-1000']
    },
    {
      id: 'achieve-kcal-5000',
      title: 'Calorie Crusher',
      description: 'Burn 5,000 total calories on the FitCoin PoBC network.',
      category: 'calories',
      targetValue: 5000,
      currentValue: totalCaloriesBurned,
      bonusFtc: 500,
      iconName: 'Zap',
      isUnlocked: totalCaloriesBurned >= 5000,
      isClaimed: !!claimedAchievements['achieve-kcal-5000']
    },
    {
      id: 'achieve-streak-3',
      title: 'Consecutive Day Miner (3-Day)',
      description: 'Mine for 3 consecutive days without missing a daily goal.',
      category: 'streak',
      targetValue: 3,
      currentValue: consecutiveStreakDays,
      bonusFtc: 50,
      iconName: 'Calendar',
      isUnlocked: consecutiveStreakDays >= 3,
      isClaimed: !!claimedAchievements['achieve-streak-3']
    },
    {
      id: 'achieve-streak-7',
      title: '7-Day Iron Streak',
      description: 'Maintain a 7-day uninterrupted workout streak.',
      category: 'streak',
      targetValue: 7,
      currentValue: consecutiveStreakDays,
      bonusFtc: 200,
      iconName: 'Award',
      isUnlocked: consecutiveStreakDays >= 7,
      isClaimed: !!claimedAchievements['achieve-streak-7']
    },
    {
      id: 'achieve-ftc-1000',
      title: 'Solana SPL Pioneer',
      description: 'Accumulate over 1,000 FTC in your on-chain wallet state.',
      category: 'solana',
      targetValue: 1000,
      currentValue: totalMinedFtc,
      bonusFtc: 100,
      iconName: 'Coins',
      isUnlocked: totalMinedFtc >= 1000,
      isClaimed: !!claimedAchievements['achieve-ftc-1000']
    },
    {
      id: 'achieve-health-95',
      title: 'Proof-of-Burn Sentinel',
      description: 'Maintain a verified AI Health & Telemetry Score above 95%.',
      category: 'health',
      targetValue: 95,
      currentValue: healthScore,
      bonusFtc: 75,
      iconName: 'ShieldCheck',
      isUnlocked: healthScore >= 95,
      isClaimed: !!claimedAchievements['achieve-health-95']
    }
  ];

  const handleClaimBonus = (ach: MilestoneAchievement) => {
    if (ach.isClaimed || !ach.isUnlocked) return;

    const updated = { ...claimedAchievements, [ach.id]: true };
    setClaimedAchievements(updated);
    localStorage.setItem('fitcoin_claimed_achievements', JSON.stringify(updated));

    if (onClaimAchievementBonus) {
      onClaimAchievementBonus(ach.bonusFtc, ach.title);
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#ec4899', '#3b82f6']
    });
  };

  const filteredAchievements = achievements.filter(a => {
    if (selectedFilter === 'all') return true;
    return a.category === selectedFilter;
  });

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-amber-500/20">
            <Award className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">Proof-of-Burn Milestone Achievements</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {unlockedCount}/{achievements.length} UNLOCKED
              </span>
            </div>
            <p className="text-xs text-slate-400">Unlock milestone badges and claim FTC token rewards on Solana</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedFilter === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Badges
          </button>
          <button
            onClick={() => setSelectedFilter('calories')}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedFilter === 'calories' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Calories
          </button>
          <button
            onClick={() => setSelectedFilter('streak')}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedFilter === 'streak' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Streak
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const pct = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                ach.isUnlocked
                  ? 'bg-slate-950/90 border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:border-emerald-400'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    ach.isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    {ach.isUnlocked ? (
                      <Trophy className="w-5 h-5 fill-current" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-extrabold ${
                    ach.isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    +{ach.bonusFtc} FTC BONUS
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  {ach.title}
                  {ach.isClaimed && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </h4>

                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress Bar & Claim Button */}
              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Progress:</span>
                    <span className="text-white font-bold">{ach.currentValue} / {ach.targetValue}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ach.isUnlocked ? 'bg-gradient-to-r from-emerald-500 to-amber-400' : 'bg-slate-700'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>

                {ach.isUnlocked && !ach.isClaimed && (
                  <button
                    onClick={() => handleClaimBonus(ach)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Gift className="w-4 h-4" />
                    Claim +{ach.bonusFtc} FTC Bonus
                  </button>
                )}

                {ach.isClaimed && (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-xl text-center text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Bonus Claimed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
