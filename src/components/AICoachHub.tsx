import React, { useState } from 'react';
import { 
  Bot, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Activity 
} from 'lucide-react';
import { ActivityType } from '../types';
import { ACTIVITY_MULTIPLIERS } from '../data/mockData';

export const AICoachHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'forecast'>('workout');
  
  // Workout Coach Form
  const [workoutActivity, setWorkoutActivity] = useState<ActivityType>('Running');
  const [targetCalories, setTargetCalories] = useState('600');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [timeAvailable, setTimeAvailable] = useState('45');
  const [workoutResult, setWorkoutResult] = useState<string | null>(null);
  const [isWorkoutLoading, setIsWorkoutLoading] = useState(false);

  // Diet Planner Form
  const [dietCaloriesBurned, setDietCaloriesBurned] = useState('850');
  const [dietWorkoutType, setDietWorkoutType] = useState('Gym & Running');
  const [dietWeightKg, setDietWeightKg] = useState('72');
  const [dietResult, setDietResult] = useState<string | null>(null);
  const [isDietLoading, setIsDietLoading] = useState(false);

  // Forecast Form
  const [weeklyCal, setWeeklyCal] = useState('5000');
  const [forecastActivity, setForecastActivity] = useState('Running & Gym');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [forecastResult, setForecastResult] = useState<string | null>(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);

  const handleGenerateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWorkoutLoading(true);
    setWorkoutResult(null);

    try {
      const res = await fetch('/api/ai/workout-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity: workoutActivity,
          targetCalories: parseInt(targetCalories) || 500,
          fitnessLevel,
          timeAvailableMinutes: parseInt(timeAvailable) || 45
        })
      });
      const data = await res.json();
      setWorkoutResult(data.result);
    } catch (err) {
      console.error(err);
      setWorkoutResult("Failed to contact AI Coach. Check Gemini API key in secrets.");
    } finally {
      setIsWorkoutLoading(false);
    }
  };

  const handleGenerateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDietLoading(true);
    setDietResult(null);

    try {
      const res = await fetch('/api/ai/diet-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caloriesBurnedToday: parseInt(dietCaloriesBurned) || 800,
          workoutType: dietWorkoutType,
          weightKg: parseInt(dietWeightKg) || 70
        })
      });
      const data = await res.json();
      setDietResult(data.result);
    } catch (err) {
      console.error(err);
      setDietResult("Failed to generate diet plan. Please check server logs.");
    } finally {
      setIsDietLoading(false);
    }
  };

  const handleGenerateForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForecastLoading(true);
    setForecastResult(null);

    try {
      const res = await fetch('/api/ai/health-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentWeeklyCalories: parseInt(weeklyCal) || 5000,
          primaryActivity: forecastActivity,
          targetDaysPerWeek: parseInt(daysPerWeek) || 5
        })
      });
      const data = await res.json();
      setForecastResult(data.result);
    } catch (err) {
      console.error(err);
      setForecastResult("Failed to generate forecast.");
    } finally {
      setIsForecastLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 w-max mb-1">
              <Bot className="w-3.5 h-3.5 text-teal-400" />
              SERVER-SIDE GEMINI 3.6 FLASH
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Health & <span className="text-emerald-400">Mining Optimization Suite</span>
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Personalized AI workout coaching, metabolic nutrition refueling, and 90-day FTC token earning predictions.
            </p>
          </div>

          <div className="flex border border-slate-800 bg-slate-950 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('workout')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'workout' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              Workout Coach
            </button>
            <button
              onClick={() => setActiveTab('diet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'diet' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              Diet & Refuel
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'forecast' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Earning Forecast
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: AI Workout Coach */}
      {activeTab === 'workout' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Controls */}
          <form onSubmit={handleGenerateWorkout} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              Configure Workout Mining
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Activity Type</label>
              <select
                value={workoutActivity}
                onChange={(e) => setWorkoutActivity(e.target.value as ActivityType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                {ACTIVITY_MULTIPLIERS.map(a => (
                  <option key={a.type} value={a.type}>{a.type} ({a.multiplier}x Multiplier)</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Target Calories to Burn (kcal)</label>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Fitness Level</label>
              <select
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced / Athlete">Advanced / Athlete</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Time Available (Minutes)</label>
              <input
                type="number"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isWorkoutLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {isWorkoutLoading ? 'Generating Plan...' : 'Generate AI Coaching Plan'}
            </button>
          </form>

          {/* AI Output Display */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bot className="w-5 h-5 text-teal-400" />
              AI Mining Workout Routine Response
            </h3>

            {workoutResult ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {workoutResult}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs font-mono space-y-2">
                <Sparkles className="w-8 h-8 text-slate-700 mx-auto" />
                <p>Click "Generate AI Coaching Plan" to query Gemini for customized workout routine.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: AI Diet & Refuel Planner */}
      {activeTab === 'diet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleGenerateDiet} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Apple className="w-5 h-5 text-emerald-400" />
              Post-Workout Refuel Inputs
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Today Calories Burned (kcal)</label>
              <input
                type="number"
                value={dietCaloriesBurned}
                onChange={(e) => setDietCaloriesBurned(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Workout Type Completed</label>
              <input
                type="text"
                value={dietWorkoutType}
                onChange={(e) => setDietWorkoutType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Body Weight (kg)</label>
              <input
                type="number"
                value={dietWeightKg}
                onChange={(e) => setDietWeightKg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isDietLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {isDietLoading ? 'Generating Nutrition...' : 'Generate Diet Refuel Plan'}
            </button>
          </form>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Apple className="w-5 h-5 text-teal-400" />
              AI Sports Nutrition Response
            </h3>

            {dietResult ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {dietResult}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs font-mono space-y-2">
                <Sparkles className="w-8 h-8 text-slate-700 mx-auto" />
                <p>Click "Generate Diet Refuel Plan" for post-workout macronutrient recommendation.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: AI Earning Forecast */}
      {activeTab === 'forecast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleGenerateForecast} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Ecosystem Forecast Inputs
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Target Weekly Burn (kcal)</label>
              <input
                type="number"
                value={weeklyCal}
                onChange={(e) => setWeeklyCal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Primary Activities</label>
              <input
                type="text"
                value={forecastActivity}
                onChange={(e) => setForecastActivity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Active Workout Days/Week</label>
              <input
                type="number"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isForecastLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {isForecastLoading ? 'Calculating Forecast...' : 'Calculate 90-Day Forecast'}
            </button>
          </form>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              AI 90-Day FTC Projection Response
            </h3>

            {forecastResult ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {forecastResult}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs font-mono space-y-2">
                <Sparkles className="w-8 h-8 text-slate-700 mx-auto" />
                <p>Click "Calculate 90-Day Forecast" for AI token earnings & body composition forecast.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
