import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// --- API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    engine: 'FitPool Human Energy Mining Engine v5.0',
    blockchain: 'Solana SPL (FTC)',
    poBC: '1 kcal = 1 FTC Approved',
    time: new Date().toISOString()
  });
});

// AI Workout Coach endpoint
app.post('/api/ai/workout-coach', async (req, res) => {
  try {
    const { activity, targetCalories, fitnessLevel, timeAvailableMinutes } = req.body;
    const ai = getGeminiAI();
    
    const prompt = `You are the FitPool Human Energy Mining Coach AI on Solana.
    The user wants to mine FTC tokens by burning calories.
    Activity: ${activity || 'Running'}
    Target Calories to burn: ${targetCalories || 500} kcal (which equals ${targetCalories || 500} FTC base)
    Fitness Level: ${fitnessLevel || 'Intermediate'}
    Available Time: ${timeAvailableMinutes || 45} minutes.

    Provide a highly structured workout mining routine, heart rate zone targets (BPM), speed/intensity breakdown, and 3 key anti-cheat tips to keep their AI Health Score at 100%. Keep it concise, motivational, and technical. Format with markdown headers and bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/workout-coach:', error);
    res.status(500).json({ error: error.message || 'Failed to generate workout coaching plan' });
  }
});

// AI Diet & Refuel Planner
app.post('/api/ai/diet-planner', async (req, res) => {
  try {
    const { caloriesBurnedToday, workoutType, weightKg } = req.body;
    const ai = getGeminiAI();

    const prompt = `You are the FitPool Sports Nutrition AI Specialist.
    The user burned ${caloriesBurnedToday || 800} kcal today doing ${workoutType || 'Running & Gym'}.
    Estimated body weight: ${weightKg || 70} kg.
    
    Provide a optimal post-mining refuel plan:
    1. Optimal Macro Ratio (Protein, Carbs, Healthy Fats in grams)
    2. Recommended Hydration & Electrolytes
    3. 3 specific meal/snack ideas to replenish glycogen without gaining fat
    4. Recovery recommendation for maximum tomorrow mining performance. Keep it clear and concise in markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/diet-planner:', error);
    res.status(500).json({ error: error.message || 'Failed to generate diet plan' });
  }
});

// AI Fraud & Telemetry Diagnostic Inspection
app.post('/api/ai/fraud-diagnostic', async (req, res) => {
  try {
    const { sessionData } = req.body;
    const ai = getGeminiAI();

    const prompt = `You are the Proof of Burned Calories (PoBC) AI Anti-Cheat Fraud Inspector for Futurecoin.in.
    Analyze this workout mining session telemetry summary:
    - Activity: ${sessionData?.activityType || 'Running'}
    - Calories: ${sessionData?.caloriesBurned || 620} kcal
    - Duration: ${sessionData?.durationSeconds || 2700} seconds
    - Avg Heart Rate: ${sessionData?.heartRateAvg || 154} bpm (Max: ${sessionData?.heartRateMax || 172})
    - Avg Speed: ${sessionData?.speedKmhAvg || 10.2} km/h (Max: ${sessionData?.speedKmhMax || 13.8})
    - GPS Distance: ${sessionData?.gpsDistanceKm || 7.65} km
    - Fraud Indicators checked: Phone Shake filter, Teleportation GPS check, Hardware TEE signature, Heart Rate-Cadence cross-correlation.

    Provide an AI Verification Report with:
    1. Overall Fraud Risk Rating (LOW, MEDIUM, HIGH)
    2. Health Score Pct (e.g. 98%)
    3. Detailed audit of biometrics vs GPS consistency
    4. Final Verdict: APPROVED FOR SOLANA FTC MINTING or REJECTED/FLAGGED.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/fraud-diagnostic:', error);
    res.status(500).json({ error: error.message || 'Failed to inspect fraud diagnostic' });
  }
});

// AI Fitness & FTC Earning Forecast
app.post('/api/ai/health-prediction', async (req, res) => {
  try {
    const { currentWeeklyCalories, primaryActivity, targetDaysPerWeek } = req.body;
    const ai = getGeminiAI();

    const prompt = `You are the FitPool Predictive Health & Solana FTC Ecosystem Analyst.
    Current weekly burn: ${currentWeeklyCalories || 5000} kcal.
    Primary Activity: ${primaryActivity || 'Running & Gym'}.
    Active days/week: ${targetDaysPerWeek || 5}.

    Calculate a 30-day and 90-day projection:
    1. Projected total FTC token earnings (factoring multiplier bonuses)
    2. Estimated fat mass lost (kg) and VO2 Max increase
    3. Recommended staking strategy in FitPool Vaults for passive APY.
    Keep formatting clean with bullet points and bold figures.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/health-prediction:', error);
    res.status(500).json({ error: error.message || 'Failed to generate prediction' });
  }
});

// Vite / Static Fallback Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitPool Human Energy Mining Engine server running on http://localhost:${PORT}`);
  });
}

startServer();
