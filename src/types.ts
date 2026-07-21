export type ActivityType = 
  | 'Walking' 
  | 'Running' 
  | 'Cycling' 
  | 'Gym Workout' 
  | 'Yoga' 
  | 'Swimming' 
  | 'Hiking' 
  | 'Functional Exercise' 
  | 'Marathon';

export interface ActivityMultiplierInfo {
  type: ActivityType;
  multiplier: number;
  iconName: string;
  calPerMinAvg: number;
  description: string;
}

export interface TelemetryPoint {
  timestamp: number;
  heartRate: number;
  speedKmh: number;
  steps: number;
  lat: number;
  lng: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroZ: number;
  calories: number;
}

export interface AntiCheatCheck {
  id: string;
  name: string;
  category: 'GPS' | 'Biometrics' | 'Motion' | 'Device' | 'AI Model';
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0 - 100
  detail: string;
}

export interface MiningSession {
  id: string;
  startTime: number;
  endTime?: number;
  activityType: ActivityType;
  caloriesBurned: number;
  durationSeconds: number;
  heartRateAvg: number;
  heartRateMax: number;
  speedKmhAvg: number;
  speedKmhMax: number;
  gpsDistanceKm: number;
  healthScorePct: number;
  fraudScorePct: number;
  isVerified: boolean;
  status: 'active' | 'paused' | 'completed' | 'flagged' | 'rejected';
  ftcEarned: number;
  solanaTxHash?: string;
  telemetryLogs: TelemetryPoint[];
  antiCheatChecks: AntiCheatCheck[];
  notes?: string;
}

export type WalletType = 'main' | 'mining' | 'pobc' | 'learning' | 'referral' | 'staking';

export interface WalletDetail {
  type: WalletType;
  name: string;
  balanceFtc: number;
  usdValue: number;
  solBalance: number;
  address: string;
  iconName: string;
  description: string;
}

export interface SolanaTx {
  signature: string;
  type: 'POBC_MINT' | 'STAKE_LOCK' | 'CLAIM_MINED' | 'TRANSFER' | 'STORE_PURCHASE' | 'REFERRAL_REWARD';
  amountFtc: number;
  timestamp: number;
  status: 'confirmed' | 'processing';
  blockNumber: number;
  memo: string;
}

export interface StakingPool {
  id: string;
  name: string;
  apyPct: number;
  lockDays: number;
  minStakeFtc: number;
  totalStakedFtc: number;
  userStakedFtc: number;
  earnedFtc: number;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'Wearables' | 'Supplements' | 'Mining Boosters' | 'Passes';
  priceFtc: number;
  retailUsd: number;
  rating: number;
  image: string;
  description: string;
  badge?: string;
}

export interface UserHealthStats {
  healthScore: number; // 0 - 100
  todayCalories: number;
  todayFtcEarned: number;
  weeklyCalories: number;
  totalFtcEarned: number;
  globalRank: number;
  miningSpeedFtcMin: number;
  consecutiveStreakDays: number;
  vo2MaxEst: number;
  restingHeartRate: number;
}

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  isAdmin?: boolean;
  isBlocked?: boolean;
  ftcBalance?: number;
}

export interface AdminFeatureControls {
  isMiningEnabled: boolean;
  isPobcEnabled: boolean;
  isWalletsEnabled: boolean;
  isAiCoachEnabled: boolean;
  isMarketplaceEnabled: boolean;
  isEmergencyPauseActive: boolean;
  baseEmissionRate: number;
  dailyCapFtc: number;
  antiCheatThreshold: number;
  // Temporal & Protocol Simulation Controls
  timeMultiplier?: number;
  simulatedDaysElapsed?: number;
  stakingApyMultiplier?: number;
  pobcBlockTimeSeconds?: number;
  difficultyMultiplier?: number;
  globalBonusMultiplier?: number;
}

export interface FitPoolMiner {
  id: string;
  name: string;
  username: string;
  walletAddress: string;
  rank: number;
  healthScore: number;
  totalMinedFtc: number;
  dailyCaloriesBurned?: number;
  favoriteActivity?: ActivityType;
  countryCode?: string;
  avatar: string;
  status: 'Online' | 'Mining Now' | 'Verified';
}

