import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Heart, 
  Sparkles, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  Flame, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Award,
  Info
} from 'lucide-react';
import { ActivityType } from '../types';

interface HealthHydrationNotifierProps {
  selectedActivity?: ActivityType;
  caloriesBurned?: number;
  isMining?: boolean;
  heartRate?: number;
  onLogHydrationBonus?: (bonusFtc: number) => void;
}

interface HealthTip {
  id: string;
  category: 'hydration' | 'recovery' | 'pacing' | 'nutrition';
  title: string;
  message: string;
  recommendedWaterMl: number;
  intensityTrigger: 'low' | 'moderate' | 'high' | 'all';
}

export const HealthHydrationNotifier: React.FC<HealthHydrationNotifierProps> = ({
  selectedActivity = 'Running',
  caloriesBurned = 0,
  isMining = false,
  heartRate = 128,
  onLogHydrationBonus
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [glassesLoggedToday, setGlassesLoggedToday] = useState<number>(() => {
    const saved = localStorage.getItem('fitcoin_water_glasses_today');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [hasLoggedRecently, setHasLoggedRecently] = useState(false);

  // Generate dynamic tips based on user's live activity level
  const getDynamicTips = (): HealthTip[] => {
    const intensity = caloriesBurned > 300 || heartRate > 140
      ? 'high'
      : caloriesBurned > 100 || heartRate > 110
      ? 'moderate'
      : 'low';

    const activityTips: Record<string, HealthTip> = {
      Running: {
        id: 'tip-run',
        category: 'hydration',
        title: 'High Perspiration Warning 🏃‍♂️',
        message: `Running at ${heartRate} BPM burns calories fast! Drink ~250ml water now to maintain muscle elasticity & proof-of-burn rate.`,
        recommendedWaterMl: 250,
        intensityTrigger: 'high'
      },
      Cycling: {
        id: 'tip-cycle',
        category: 'hydration',
        title: 'Quad Stamina & Hydration 🚴‍♂️',
        message: 'Sustained pedaling reduces blood volume if dehydrated. Take frequent small sips every 15 minutes.',
        recommendedWaterMl: 200,
        intensityTrigger: 'moderate'
      },
      Gym: {
        id: 'tip-gym',
        category: 'recovery',
        title: 'Interval Electrolyte Tip 🏋️',
        message: 'Resting between sets? Sip electrolyte-infused water to prevent muscle fatigue and keep heart rate steady.',
        recommendedWaterMl: 250,
        intensityTrigger: 'high'
      },
      Walking: {
        id: 'tip-walk',
        category: 'pacing',
        title: 'Steady Pace Hydration 🚶',
        message: 'Walking is great steady aerobic mining. Keep a 500ml water bottle handy to maintain energy balance.',
        recommendedWaterMl: 150,
        intensityTrigger: 'low'
      }
    };

    const generalTips: HealthTip[] = [
      {
        id: 'tip-gen-1',
        category: 'hydration',
        title: 'Hydration Goal Target 💧',
        message: `You've burned ${Math.floor(caloriesBurned)} kcal today. Drink at least 500ml water per 300 kcal burned.`,
        recommendedWaterMl: 300,
        intensityTrigger: 'all'
      },
      {
        id: 'tip-gen-2',
        category: 'recovery',
        title: 'Heart Rate Zone Recovery ❤️',
        message: `Current Heart Rate: ${heartRate} BPM. Deep belly breathing accelerates lactic acid flush post-session.`,
        recommendedWaterMl: 200,
        intensityTrigger: 'all'
      },
      {
        id: 'tip-gen-3',
        category: 'nutrition',
        title: 'Proof-of-Burn Fueling ⚡',
        message: 'Post-workout glycogen window: Combine 1 glass of water with protein & complex carbs for max recovery.',
        recommendedWaterMl: 250,
        intensityTrigger: 'all'
      }
    ];

    const specific = activityTips[selectedActivity] || activityTips['Running'];
    return [specific, ...generalTips];
  };

  const tips = getDynamicTips();

  // Auto-rotate tips every 12 seconds
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 12000);

    return () => clearInterval(timer);
  }, [isPaused, isVisible, tips.length]);

  const currentTip = tips[currentTipIndex] || tips[0];

  const handleLogWater = () => {
    const newLogged = glassesLoggedToday + 1;
    setGlassesLoggedToday(newLogged);
    localStorage.setItem('fitcoin_water_glasses_today', newLogged.toString());
    setHasLoggedRecently(true);

    if (onLogHydrationBonus) {
      onLogHydrationBonus(10); // 10 FTC Hydration Bonus
    }

    setTimeout(() => setHasLoggedRecently(false), 4000);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-5 right-5 z-40 bg-slate-900 border border-cyan-500/50 p-3 rounded-full text-cyan-400 shadow-xl shadow-cyan-500/20 hover:scale-110 transition-all flex items-center gap-2 font-mono text-xs font-bold"
        title="Open Health & Hydration Assistant"
      >
        <Droplets className="w-5 h-5 animate-bounce" />
        <span className="hidden sm:inline">Hydration Tips ({glassesLoggedToday}/8 💧)</span>
      </button>
    );
  }

  return (
    <div 
      className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl shadow-cyan-950/50 backdrop-blur-md relative overflow-hidden space-y-3 animate-fadeIn transition-all max-w-lg w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
            <Droplets className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-xs">AI Hydration & Health Advisor</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Personalized for {selectedActivity} • {Math.floor(caloriesBurned)} kcal</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tips.length)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Next tip"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tip Body */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-cyan-300 text-xs flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {currentTip.title}
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Target: +{currentTip.recommendedWaterMl}ml
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {currentTip.message}
        </p>
      </div>

      {/* Bottom Hydration Counter & Quick Action */}
      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-cyan-400">
            <Droplets className="w-4 h-4 fill-cyan-400/30" />
            <span className="font-bold">{glassesLoggedToday}/8</span>
          </div>
          <span className="text-[10px] text-slate-400">Glasses Today</span>
        </div>

        {hasLoggedRecently ? (
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            +10 FTC Hydration Bonus Logged!
          </span>
        ) : (
          <button
            onClick={handleLogWater}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <Droplets className="w-3 h-3 fill-current" />
            Log Water Sip (+10 FTC)
          </button>
        )}
      </div>

      {/* Progress Bar Timer */}
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-cyan-400 transition-all duration-1000 ease-linear"
          style={{ width: isPaused ? '100%' : '100%' }}
        ></div>
      </div>
    </div>
  );
};
