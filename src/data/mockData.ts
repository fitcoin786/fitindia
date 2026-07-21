import { 
  ActivityMultiplierInfo, 
  WalletDetail, 
  StakingPool, 
  MarketplaceItem, 
  MiningSession, 
  SolanaTx,
  UserHealthStats,
  FitPoolMiner
} from '../types';

export const ACTIVITY_MULTIPLIERS: ActivityMultiplierInfo[] = [
  {
    type: 'Walking',
    multiplier: 1.0,
    iconName: 'Footprints',
    calPerMinAvg: 4.5,
    description: '1.0x Base PoBC mining rate. Low impact, steady consensus emission.'
  },
  {
    type: 'Running',
    multiplier: 2.0,
    iconName: 'Flame',
    calPerMinAvg: 11.5,
    description: '2.0x High energy output. High heart rate sync requirement.'
  },
  {
    type: 'Cycling',
    multiplier: 2.5,
    iconName: 'Bike',
    calPerMinAvg: 9.0,
    description: '2.5x Cadence & GPS speed correlation required for verification.'
  },
  {
    type: 'Gym Workout',
    multiplier: 3.0,
    iconName: 'Dumbbell',
    calPerMinAvg: 8.0,
    description: '3.0x Accelerometer burst patterns & heart rate zone verification.'
  },
  {
    type: 'Yoga',
    multiplier: 1.5,
    iconName: 'Sparkles',
    calPerMinAvg: 4.0,
    description: '1.5x HR variability & posture stability sensor tracking.'
  },
  {
    type: 'Swimming',
    multiplier: 3.5,
    iconName: 'Waves',
    calPerMinAvg: 12.0,
    description: '3.5x Hydrodynamic movement stroke counter & HR sensor.'
  },
  {
    type: 'Hiking',
    multiplier: 2.2,
    iconName: 'Mountain',
    calPerMinAvg: 7.5,
    description: '2.2x Elevation climb correlation with elevation GPS tracking.'
  },
  {
    type: 'Functional Exercise',
    multiplier: 2.8,
    iconName: 'Activity',
    calPerMinAvg: 8.5,
    description: '2.8x High-intensity interval training (HIIT) gyro spike verification.'
  },
  {
    type: 'Marathon',
    multiplier: 5.0,
    iconName: 'Trophy',
    calPerMinAvg: 13.0,
    description: '5.0x Apex mining tier. Verified endurance challenge & continuous GPS.'
  }
];

export const INITIAL_USER_STATS: UserHealthStats = {
  healthScore: 98,
  todayCalories: 1054,
  todayFtcEarned: 1054,
  weeklyCalories: 6420,
  totalFtcEarned: 14850,
  globalRank: 142,
  miningSpeedFtcMin: 4.2,
  consecutiveStreakDays: 14,
  vo2MaxEst: 51,
  restingHeartRate: 58
};

export const INITIAL_WALLETS: WalletDetail[] = [
  {
    type: 'main',
    name: 'Main FTC Wallet',
    balanceFtc: 8450.25,
    usdValue: 8450.25 * 0.000002986,
    solBalance: 0.85,
    address: '5K7mXq8...9p2L',
    iconName: 'Wallet',
    description: 'Liquid FTC tokens available for immediate Solana transfer or trade.'
  },
  {
    type: 'mining',
    name: 'Mining Reward Wallet',
    balanceFtc: 1054.00,
    usdValue: 1054.00 * 0.000002986,
    solBalance: 0,
    address: 'FTCm1n1n...9x01',
    iconName: 'Zap',
    description: 'Freshly mined FTC awaiting PoBC AI block verification & settlement.'
  },
  {
    type: 'pobc',
    name: 'POBC Consensus Vault',
    balanceFtc: 3200.00,
    usdValue: 3200.00 * 0.000002986,
    solBalance: 0,
    address: 'PoBCvau1t...77aa',
    iconName: 'ShieldCheck',
    description: 'Locked PoBC consensus collateral supporting ecosystem health score.'
  },
  {
    type: 'staking',
    name: 'Staking & Yield Vault',
    balanceFtc: 2000.00,
    usdValue: 2000.00 * 0.000002986,
    solBalance: 0,
    address: 'STKstak3...44bb',
    iconName: 'TrendingUp',
    description: 'Earning passive 14.5% APY yield on physical activity proof tokens.'
  },
  {
    type: 'referral',
    name: 'Referral & Social Wallet',
    balanceFtc: 145.00,
    usdValue: 145.00 * 0.000002986,
    solBalance: 0,
    address: 'REFf11end...88cc',
    iconName: 'Users',
    description: 'Ecosystem expansion rewards from active workout network friends.'
  },
  {
    type: 'learning',
    name: 'Learning & Quiz Wallet',
    balanceFtc: 80.00,
    usdValue: 80.00 * 0.000002986,
    solBalance: 0,
    address: 'EDUlearn...11dd',
    iconName: 'GraduationCap',
    description: 'Health literacy and nutrition academy verification tokens.'
  }
];

export const MOCK_STAKING_POOLS: StakingPool[] = [
  {
    id: 'pool-1',
    name: 'Solana PoBC High-Yield Pool',
    apyPct: 18.5,
    lockDays: 30,
    minStakeFtc: 100,
    totalStakedFtc: 1250000,
    userStakedFtc: 1500,
    earnedFtc: 62.4
  },
  {
    id: 'pool-2',
    name: 'Cardio Endurance Flexible Pool',
    apyPct: 10.2,
    lockDays: 0,
    minStakeFtc: 50,
    totalStakedFtc: 890000,
    userStakedFtc: 500,
    earnedFtc: 18.1
  },
  {
    id: 'pool-3',
    name: 'Marathoner Genesis Validator',
    apyPct: 24.0,
    lockDays: 90,
    minStakeFtc: 1000,
    totalStakedFtc: 3400000,
    userStakedFtc: 0,
    earnedFtc: 0
  }
];

export const MOCK_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'm1',
    name: 'FitPool BioGrip Smart Band Pro',
    category: 'Wearables',
    priceFtc: 1200,
    retailUsd: 149.00,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
    description: 'Optical PPG heart-rate sensor + sub-millimeter accelerometer for 100% anti-cheat PoBC verification.',
    badge: 'Popular'
  },
  {
    id: 'm2',
    name: 'Solana Mining Multiplier Badge (2x for 7 Days)',
    category: 'Mining Boosters',
    priceFtc: 350,
    retailUsd: 35.00,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'On-chain NFT power booster doubling calorie FTC mint rate on all workouts for 1 week.',
    badge: 'Booster'
  },
  {
    id: 'm3',
    name: 'Pure Electrolyte Energy Fuel Box (30 Servings)',
    category: 'Supplements',
    priceFtc: 250,
    retailUsd: 29.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Zero sugar, rapid hydration mineral blend engineered for high-intensity PoBC calorie burning.'
  },
  {
    id: 'm4',
    name: 'FitPool VIP Gym & Crossfit Global Pass',
    category: 'Passes',
    priceFtc: 800,
    retailUsd: 99.00,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    description: 'Access 2,500+ partner fitness facilities globally with automated NFC PoBC gym check-in.',
    badge: 'Exclusive'
  }
];

export const RECENT_SESSIONS: MiningSession[] = [
  {
    id: 'sess-101',
    startTime: Date.now() - 3600000 * 3,
    endTime: Date.now() - 3600000 * 2,
    activityType: 'Running',
    caloriesBurned: 620,
    durationSeconds: 2700,
    heartRateAvg: 154,
    heartRateMax: 172,
    speedKmhAvg: 10.2,
    speedKmhMax: 13.8,
    gpsDistanceKm: 7.65,
    healthScorePct: 100,
    fraudScorePct: 1,
    isVerified: true,
    status: 'completed',
    ftcEarned: 620,
    solanaTxHash: '5K7mXq89p2L1z9aB3cC4dD5eE6fF7gG8hH9iJ0kK1lL2mM',
    telemetryLogs: [],
    antiCheatChecks: [
      { id: 'c1', name: 'GPS Route Consistency', category: 'GPS', status: 'passed', score: 99, detail: 'Smooth physical movement along known running trail. No teleportation.' },
      { id: 'c2', name: 'Heart Rate Sync', category: 'Biometrics', status: 'passed', score: 100, detail: 'Heart rate dynamic curve correlates 98.4% with running cadence.' },
      { id: 'c3', name: 'Speed Pattern Sanity', category: 'Motion', status: 'passed', score: 97, detail: 'Average 10.2 km/h fits biological limits of human running.' },
      { id: 'c4', name: 'Accelerometer/Gyro Jitter', category: 'Motion', status: 'passed', score: 98, detail: 'Natural human stride impact harmonics detected.' },
      { id: 'c5', name: 'Device Integrity', category: 'Device', status: 'passed', score: 100, detail: 'Non-rooted device, hardware TEE signed biometrics.' }
    ],
    notes: 'Morning urban park run. 100% PoBC block verified.'
  },
  {
    id: 'sess-100',
    startTime: Date.now() - 86400000,
    endTime: Date.now() - 86400000 + 1800000,
    activityType: 'Cycling',
    caloriesBurned: 434,
    durationSeconds: 1800,
    heartRateAvg: 138,
    heartRateMax: 156,
    speedKmhAvg: 22.4,
    speedKmhMax: 29.1,
    gpsDistanceKm: 11.2,
    healthScorePct: 96,
    fraudScorePct: 3,
    isVerified: true,
    status: 'completed',
    ftcEarned: 434,
    solanaTxHash: '3xN8pQ12m9K0z1aB2cC3dD4eE5fF6gG7hH8iJ9kK0lL',
    telemetryLogs: [],
    antiCheatChecks: [
      { id: 'c1', name: 'GPS Route Consistency', category: 'GPS', status: 'passed', score: 96, detail: 'Road route verified via OpenStreetMap elevation profile.' },
      { id: 'c2', name: 'Heart Rate Sync', category: 'Biometrics', status: 'passed', score: 95, detail: 'Pedal surge HR increase observed.' }
    ]
  }
];

export const RECENT_SOLANA_TXS: SolanaTx[] = [
  {
    signature: '5K7mXq89p2L1z9aB3cC4dD5eE6fF7gG8hH9iJ0kK1lL2mM',
    type: 'POBC_MINT',
    amountFtc: 620,
    timestamp: Date.now() - 3600000 * 2,
    status: 'confirmed',
    blockNumber: 248910244,
    memo: 'PoBC Block #10294 Mint for Approved Calorie Burn (Running)'
  },
  {
    signature: '3xN8pQ12m9K0z1aB2cC3dD4eE5fF6gG7hH8iJ9kK0lL',
    type: 'POBC_MINT',
    amountFtc: 434,
    timestamp: Date.now() - 86400000,
    status: 'confirmed',
    blockNumber: 248762100,
    memo: 'PoBC Block #10250 Mint for Approved Calorie Burn (Cycling)'
  },
  {
    signature: '7yR9pM11k8J9z0aA1bB2cC3dD4eE5fF6gG7hH8iJ9kK',
    type: 'STAKE_LOCK',
    amountFtc: 500,
    timestamp: Date.now() - 86400000 * 3,
    status: 'confirmed',
    blockNumber: 248200199,
    memo: 'Lock into Solana PoBC High-Yield Pool @ 18.5% APY'
  }
];

export const ACTIVE_FITPOOL_MINERS: FitPoolMiner[] = [
  { id: 'miner-1', name: 'Alex Vance', username: '@alex_runner', walletAddress: 'FitPool99x7p2L1z9aB3cC4dD5eE6fF7gG8hH9iJ0kK1', rank: 1, healthScore: 99, totalMinedFtc: 42800, dailyCaloriesBurned: 1420, favoriteActivity: 'Marathon', countryCode: 'US', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-2', name: 'Elena Rostova', username: '@elena_fit', walletAddress: 'FitPool88a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q', rank: 2, healthScore: 98, totalMinedFtc: 38500, dailyCaloriesBurned: 1280, favoriteActivity: 'Gym Workout', countryCode: 'DE', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-3', name: 'Marcus Chen', username: '@marcus_cyclist', walletAddress: 'FitPool77x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n', rank: 3, healthScore: 97, totalMinedFtc: 31200, dailyCaloriesBurned: 1150, favoriteActivity: 'Cycling', countryCode: 'SG', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-4', name: 'Sarah Jenkins', username: '@sarah_marathon', walletAddress: 'FitPool66m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c', rank: 4, healthScore: 96, totalMinedFtc: 27400, dailyCaloriesBurned: 980, favoriteActivity: 'Running', countryCode: 'GB', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-5', name: 'David Silva', username: '@david_swimmer', walletAddress: 'FitPool55k4j3h2g1f0e9d8c7b6a5z4y3x2w1v0u9', rank: 5, healthScore: 95, totalMinedFtc: 24100, dailyCaloriesBurned: 890, favoriteActivity: 'Swimming', countryCode: 'BR', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-6', name: 'Chloe Dubois', username: '@chloe_hike', walletAddress: 'FitPool44a9b8c7d6e5f4g3h2i1j0k9l8m7n6o5p', rank: 6, healthScore: 94, totalMinedFtc: 21800, dailyCaloriesBurned: 810, favoriteActivity: 'Hiking', countryCode: 'FR', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-7', name: 'Kenji Takahashi', username: '@kenji_crossfit', walletAddress: 'FitPool33z1y2x3w4v5u6t7s8r9q0p1o2n3m4l5k', rank: 7, healthScore: 96, totalMinedFtc: 19500, dailyCaloriesBurned: 760, favoriteActivity: 'Functional Exercise', countryCode: 'JP', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-8', name: 'Aisha Patel', username: '@aisha_yoga', walletAddress: 'FitPool22p1o2n3m4l5k6j7i8h9g0f1e2d3c4b5a', rank: 8, healthScore: 93, totalMinedFtc: 17200, dailyCaloriesBurned: 690, favoriteActivity: 'Yoga', countryCode: 'IN', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-9', name: "Liam O'Connor", username: '@liam_trail', walletAddress: 'FitPool11q9w8e7r6t5y4u3i2o1p0a9s8d7f6g5', rank: 9, healthScore: 92, totalMinedFtc: 15400, dailyCaloriesBurned: 620, favoriteActivity: 'Hiking', countryCode: 'IE', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-10', name: 'Sofia Martinez', username: '@sofia_stride', walletAddress: 'FitPool00z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5', rank: 10, healthScore: 95, totalMinedFtc: 14100, dailyCaloriesBurned: 580, favoriteActivity: 'Walking', countryCode: 'ES', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-11', name: 'Viktor Morozov', username: '@viktor_iron', walletAddress: 'FitPool11a2b3c4d5e6f7g8h9i0j1k2l3m4n5o', rank: 11, healthScore: 94, totalMinedFtc: 13800, dailyCaloriesBurned: 560, favoriteActivity: 'Gym Workout', countryCode: 'CA', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-12', name: 'Emma Watson', username: '@emma_run', walletAddress: 'FitPool12b3c4d5e6f7g8h9i0j1k2l3m4n5o6p', rank: 12, healthScore: 93, totalMinedFtc: 13500, dailyCaloriesBurned: 545, favoriteActivity: 'Running', countryCode: 'AU', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-13', name: 'Lucas Santos', username: '@lucas_pobc', walletAddress: 'FitPool13c4d5e6f7g8h9i0j1k2l3m4n5o6p7q', rank: 13, healthScore: 92, totalMinedFtc: 13100, dailyCaloriesBurned: 530, favoriteActivity: 'Cycling', countryCode: 'BR', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-14', name: 'Mia Lin', username: '@mialin_fit', walletAddress: 'FitPool14d5e6f7g8h9i0j1k2l3m4n5o6p7q8r', rank: 14, healthScore: 95, totalMinedFtc: 12800, dailyCaloriesBurned: 515, favoriteActivity: 'Swimming', countryCode: 'TW', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-15', name: 'Oliver Schmidt', username: '@oliver_schmidt', walletAddress: 'FitPool15e6f7g8h9i0j1k2l3m4n5o6p7q8r9s', rank: 15, healthScore: 91, totalMinedFtc: 12400, dailyCaloriesBurned: 500, favoriteActivity: 'Marathon', countryCode: 'DE', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-16', name: 'Noah Garcia', username: '@noah_cross', walletAddress: 'FitPool16f7g8h9i0j1k2l3m4n5o6p7q8r9s0t', rank: 16, healthScore: 90, totalMinedFtc: 12100, dailyCaloriesBurned: 490, favoriteActivity: 'Functional Exercise', countryCode: 'MX', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-17', name: 'Ava Rossi', username: '@ava_rossi', walletAddress: 'FitPool17g8h9i0j1k2l3m4n5o6p7q8r9s0t1u', rank: 17, healthScore: 94, totalMinedFtc: 11800, dailyCaloriesBurned: 480, favoriteActivity: 'Yoga', countryCode: 'IT', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-18', name: 'William Weber', username: '@william_w', walletAddress: 'FitPool18h9i0j1k2l3m4n5o6p7q8r9s0t1u2v', rank: 18, healthScore: 89, totalMinedFtc: 11500, dailyCaloriesBurned: 470, favoriteActivity: 'Hiking', countryCode: 'AT', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-19', name: 'Isabella Kim', username: '@isabella_k', walletAddress: 'FitPool19i0j1k2l3m4n5o6p7q8r9s0t1u2v3w', rank: 19, healthScore: 96, totalMinedFtc: 11200, dailyCaloriesBurned: 460, favoriteActivity: 'Running', countryCode: 'KR', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-20', name: 'James Wilson', username: '@james_miner', walletAddress: 'FitPool20j1k2l3m4n5o6p7q8r9s0t1u2v3w4x', rank: 20, healthScore: 93, totalMinedFtc: 10900, dailyCaloriesBurned: 450, favoriteActivity: 'Gym Workout', countryCode: 'US', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-21', name: 'Sophia Kowalski', username: '@sophia_pobc', walletAddress: 'FitPool21k2l3m4n5o6p7q8r9s0t1u2v3w4x5y', rank: 21, healthScore: 91, totalMinedFtc: 10600, dailyCaloriesBurned: 440, favoriteActivity: 'Walking', countryCode: 'PL', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-22', name: 'Benjamin Lee', username: '@ben_lee', walletAddress: 'FitPool22l3m4n5o6p7q8r9s0t1u2v3w4x5y6z', rank: 22, healthScore: 92, totalMinedFtc: 10300, dailyCaloriesBurned: 430, favoriteActivity: 'Cycling', countryCode: 'NZ', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-23', name: 'Charlotte Dubois', username: '@charlotte_fit', walletAddress: 'FitPool23m4n5o6p7q8r9s0t1u2v3w4x5y6z7a', rank: 23, healthScore: 95, totalMinedFtc: 10000, dailyCaloriesBurned: 420, favoriteActivity: 'Swimming', countryCode: 'CH', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-24', name: 'Lucas Becker', username: '@lucas_becker', walletAddress: 'FitPool24n5o6p7q8r9s0t1u2v3w4x5y6z7a8b', rank: 24, healthScore: 90, totalMinedFtc: 9800, dailyCaloriesBurned: 410, favoriteActivity: 'Hiking', countryCode: 'NL', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-25', name: 'Amelia Gupta', username: '@amelia_yoga', walletAddress: 'FitPool25o6p7q8r9s0t1u2v3w4x5y6z7a8b9c', rank: 25, healthScore: 94, totalMinedFtc: 9500, dailyCaloriesBurned: 400, favoriteActivity: 'Yoga', countryCode: 'IN', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-26', name: 'Henry Fischer', username: '@henry_runner', walletAddress: 'FitPool26p7q8r9s0t1u2v3w4x5y6z7a8b9c0d', rank: 26, healthScore: 89, totalMinedFtc: 9300, dailyCaloriesBurned: 395, favoriteActivity: 'Running', countryCode: 'DE', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-27', name: 'Harper Novak', username: '@harper_fit', walletAddress: 'FitPool27q8r9s0t1u2v3w4x5y6z7a8b9c0d1e', rank: 27, healthScore: 93, totalMinedFtc: 9100, dailyCaloriesBurned: 390, favoriteActivity: 'Gym Workout', countryCode: 'CZ', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-28', name: 'Alexander Wright', username: '@alex_w', walletAddress: 'FitPool28r9s0t1u2v3w4x5y6z7a8b9c0d1e2f', rank: 28, healthScore: 88, totalMinedFtc: 8900, dailyCaloriesBurned: 385, favoriteActivity: 'Functional Exercise', countryCode: 'ZA', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-29', name: 'Evelyn Sato', username: '@evelyn_sato', walletAddress: 'FitPool29s0t1u2v3w4x5y6z7a8b9c0d1e2f3g', rank: 29, healthScore: 95, totalMinedFtc: 8700, dailyCaloriesBurned: 380, favoriteActivity: 'Walking', countryCode: 'JP', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-30', name: 'Daniel Meyer', username: '@daniel_m', walletAddress: 'FitPool30t1u2v3w4x5y6z7a8b9c0d1e2f3g4h', rank: 30, healthScore: 91, totalMinedFtc: 8500, dailyCaloriesBurned: 375, favoriteActivity: 'Cycling', countryCode: 'SE', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-31', name: 'Abigail Nielsen', username: '@abigail_n', walletAddress: 'FitPool31u2v3w4x5y6z7a8b9c0d1e2f3g4h5i', rank: 31, healthScore: 92, totalMinedFtc: 8300, dailyCaloriesBurned: 370, favoriteActivity: 'Swimming', countryCode: 'DK', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-32', name: 'Matthew Jensen', username: '@matthew_j', walletAddress: 'FitPool32v3w4x5y6z7a8b9c0d1e2f3g4h5i6j', rank: 32, healthScore: 89, totalMinedFtc: 8100, dailyCaloriesBurned: 365, favoriteActivity: 'Hiking', countryCode: 'NO', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-33', name: 'Emily Tanaka', username: '@emily_t', walletAddress: 'FitPool33w4x5y6z7a8b9c0d1e2f3g4h5i6j7k', rank: 33, healthScore: 94, totalMinedFtc: 7900, dailyCaloriesBurned: 360, favoriteActivity: 'Marathon', countryCode: 'CA', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-34', name: 'Jackson Schneider', username: '@jackson_s', walletAddress: 'FitPool34x5y6z7a8b9c0d1e2f3g4h5i6j7k8l', rank: 34, healthScore: 90, totalMinedFtc: 7700, dailyCaloriesBurned: 355, favoriteActivity: 'Gym Workout', countryCode: 'FI', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-35', name: 'Elizabeth Fernandez', username: '@elizabeth_f', walletAddress: 'FitPool35y6z7a8b9c0d1e2f3g4h5i6j7k8l9m', rank: 35, healthScore: 93, totalMinedFtc: 7500, dailyCaloriesBurned: 350, favoriteActivity: 'Running', countryCode: 'AR', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-36', name: 'Sebastian Lindqvist', username: '@sebastian_l', walletAddress: 'FitPool36z7a8b9c0d1e2f3g4h5i6j7k8l9m0n', rank: 36, healthScore: 88, totalMinedFtc: 7300, dailyCaloriesBurned: 345, favoriteActivity: 'Functional Exercise', countryCode: 'SE', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-37', name: 'Avery Hoffman', username: '@avery_h', walletAddress: 'FitPool37a8b9c0d1e2f3g4h5i6j7k8l9m0n1o', rank: 37, healthScore: 92, totalMinedFtc: 7100, dailyCaloriesBurned: 340, favoriteActivity: 'Yoga', countryCode: 'US', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-38', name: 'Jack Lindholm', username: '@jack_l', walletAddress: 'FitPool38b9c0d1e2f3g4h5i6j7k8l9m0n1o2p', rank: 38, healthScore: 91, totalMinedFtc: 6900, dailyCaloriesBurned: 335, favoriteActivity: 'Walking', countryCode: 'FI', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-39', name: 'Ella Johansen', username: '@ella_j', walletAddress: 'FitPool39c0d1e2f3g4h5i6j7k8l9m0n1o2p3q', rank: 39, healthScore: 95, totalMinedFtc: 6700, dailyCaloriesBurned: 330, favoriteActivity: 'Cycling', countryCode: 'NO', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-40', name: 'Owen Larsen', username: '@owen_l', walletAddress: 'FitPool40d1e2f3g4h5i6j7k8l9m0n1o2p3q4r', rank: 40, healthScore: 89, totalMinedFtc: 6500, dailyCaloriesBurned: 325, favoriteActivity: 'Swimming', countryCode: 'DK', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-41', name: 'Camila Ruiz', username: '@camila_r', walletAddress: 'FitPool41e2f3g4h5i6j7k8l9m0n1o2p3q4r5s', rank: 41, healthScore: 93, totalMinedFtc: 6300, dailyCaloriesBurned: 320, favoriteActivity: 'Hiking', countryCode: 'CO', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-42', name: 'Samuel Virtanen', username: '@samuel_v', walletAddress: 'FitPool42f3g4h5i6j7k8l9m0n1o2p3q4r5s6t', rank: 42, healthScore: 90, totalMinedFtc: 6100, dailyCaloriesBurned: 315, favoriteActivity: 'Gym Workout', countryCode: 'FI', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-43', name: 'Victoria De Jong', username: '@victoria_dj', walletAddress: 'FitPool43g4h5i6j7k8l9m0n1o2p3q4r5s6t7u', rank: 43, healthScore: 94, totalMinedFtc: 5900, dailyCaloriesBurned: 310, favoriteActivity: 'Running', countryCode: 'NL', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-44', name: 'Joseph Van Der Meer', username: '@joseph_vdm', walletAddress: 'FitPool44h5i6j7k8l9m0n1o2p3q4r5s6t7u8v', rank: 44, healthScore: 88, totalMinedFtc: 5700, dailyCaloriesBurned: 305, favoriteActivity: 'Functional Exercise', countryCode: 'NL', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-45', name: 'Scarlett Karlsson', username: '@scarlett_k', walletAddress: 'FitPool45i6j7k8l9m0n1o2p3q4r5s6t7u8v9w', rank: 45, healthScore: 92, totalMinedFtc: 5500, dailyCaloriesBurned: 300, favoriteActivity: 'Yoga', countryCode: 'SE', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-46', name: 'John Nieminen', username: '@john_n', walletAddress: 'FitPool46j7k8l9m0n1o2p3q4r5s6t7u8v9w0x', rank: 46, healthScore: 89, totalMinedFtc: 5300, dailyCaloriesBurned: 295, favoriteActivity: 'Walking', countryCode: 'FI', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-47', name: 'Grace Borg', username: '@grace_b', walletAddress: 'FitPool47k8l9m0n1o2p3q4r5s6t7u8v9w0x1y', rank: 47, healthScore: 95, totalMinedFtc: 5100, dailyCaloriesBurned: 290, favoriteActivity: 'Cycling', countryCode: 'MT', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-48', name: 'Levi Varga', username: '@levi_v', walletAddress: 'FitPool48l9m0n1o2p3q4r5s6t7u8v9w0x1y2z', rank: 48, healthScore: 91, totalMinedFtc: 4900, dailyCaloriesBurned: 285, favoriteActivity: 'Swimming', countryCode: 'HU', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-49', name: 'Chloe Popa', username: '@chloe_p', walletAddress: 'FitPool49m0n1o2p3q4r5s6t7u8v9w0x1y2z3a', rank: 49, healthScore: 93, totalMinedFtc: 4700, dailyCaloriesBurned: 280, favoriteActivity: 'Hiking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-50', name: 'Isaac Horvath', username: '@isaac_h', walletAddress: 'FitPool50n1o2p3q4r5s6t7u8v9w0x1y2z3a4b', rank: 50, healthScore: 88, totalMinedFtc: 4500, dailyCaloriesBurned: 275, favoriteActivity: 'Gym Workout', countryCode: 'SK', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-51', name: 'Penelope Balogh', username: '@penelope_b', walletAddress: 'FitPool51o2p3q4r5s6t7u8v9w0x1y2z3a4b5c', rank: 51, healthScore: 90, totalMinedFtc: 4300, dailyCaloriesBurned: 270, favoriteActivity: 'Running', countryCode: 'HU', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-52', name: 'Jayden Stoica', username: '@jayden_s', walletAddress: 'FitPool52p3q4r5s6t7u8v9w0x1y2z3a4b5c6d', rank: 52, healthScore: 94, totalMinedFtc: 4100, dailyCaloriesBurned: 265, favoriteActivity: 'Functional Exercise', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-53', name: 'Riley Muresan', username: '@riley_m', walletAddress: 'FitPool53q4r5s6t7u8v9w0x1y2z3a4b5c6d7e', rank: 53, healthScore: 89, totalMinedFtc: 3900, dailyCaloriesBurned: 260, favoriteActivity: 'Yoga', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-54', name: 'Gabriel Dumitrescu', username: '@gabriel_d', walletAddress: 'FitPool54r5s6t7u8v9w0x1y2z3a4b5c6d7e8f', rank: 54, healthScore: 92, totalMinedFtc: 3700, dailyCaloriesBurned: 255, favoriteActivity: 'Walking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-55', name: 'Nora Popescu', username: '@nora_p', walletAddress: 'FitPool55s6t7u8v9w0x1y2z3a4b5c6d7e8f9g', rank: 55, healthScore: 91, totalMinedFtc: 3500, dailyCaloriesBurned: 250, favoriteActivity: 'Cycling', countryCode: 'MD', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-56', name: 'Anthony Stan', username: '@anthony_s', walletAddress: 'FitPool56t7u8v9w0x1y2z3a4b5c6d7e8f9g0h', rank: 56, healthScore: 88, totalMinedFtc: 3300, dailyCaloriesBurned: 245, favoriteActivity: 'Swimming', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-57', name: 'Zoey Ionescu', username: '@zoey_i', walletAddress: 'FitPool57u8v9w0x1y2z3a4b5c6d7e8f9g0h1i', rank: 57, healthScore: 93, totalMinedFtc: 3100, dailyCaloriesBurned: 240, favoriteActivity: 'Hiking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-58', name: 'Dylan Radu', username: '@dylan_r', walletAddress: 'FitPool58v9w0x1y2z3a4b5c6d7e8f9g0h1i2j', rank: 58, healthScore: 90, totalMinedFtc: 2900, dailyCaloriesBurned: 235, favoriteActivity: 'Gym Workout', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-59', name: 'Lily Tudor', username: '@lily_t', walletAddress: 'FitPool59w0x1y2z3a4b5c6d7e8f9g0h1i2j3k', rank: 59, healthScore: 95, totalMinedFtc: 2700, dailyCaloriesBurned: 230, favoriteActivity: 'Running', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-60', name: 'Leo Dima', username: '@leo_d', walletAddress: 'FitPool60x1y2z3a4b5c6d7e8f9g0h1i2j3k4l', rank: 60, healthScore: 89, totalMinedFtc: 2500, dailyCaloriesBurned: 225, favoriteActivity: 'Functional Exercise', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-61', name: 'Hannah Marin', username: '@hannah_m', walletAddress: 'FitPool61y2z3a4b5c6d7e8f9g0h1i2j3k4l5m', rank: 61, healthScore: 91, totalMinedFtc: 2400, dailyCaloriesBurned: 220, favoriteActivity: 'Yoga', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-62', name: 'Julian Diaconu', username: '@julian_d', walletAddress: 'FitPool62z3a4b5c6d7e8f9g0h1i2j3k4l5m6n', rank: 62, healthScore: 92, totalMinedFtc: 2300, dailyCaloriesBurned: 215, favoriteActivity: 'Walking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-63', name: 'Layla Gheorghe', username: '@layla_g', walletAddress: 'FitPool63a4b5c6d7e8f9g0h1i2j3k4l5m6n7o', rank: 63, healthScore: 88, totalMinedFtc: 2200, dailyCaloriesBurned: 210, favoriteActivity: 'Cycling', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-64', name: 'Christopher Nistor', username: '@chris_n', walletAddress: 'FitPool64b5c6d7e8f9g0h1i2j3k4l5m6n7o8p', rank: 64, healthScore: 94, totalMinedFtc: 2100, dailyCaloriesBurned: 205, favoriteActivity: 'Swimming', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-65', name: 'Penelope Stanciu', username: '@penelope_s', walletAddress: 'FitPool65c6d7e8f9g0h1i2j3k4l5m6n7o8p9q', rank: 65, healthScore: 90, totalMinedFtc: 2000, dailyCaloriesBurned: 200, favoriteActivity: 'Hiking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-66', name: 'Joshua Costea', username: '@joshua_c', walletAddress: 'FitPool66d7e8f9g0h1i2j3k4l5m6n7o8p9q0r', rank: 66, healthScore: 93, totalMinedFtc: 1950, dailyCaloriesBurned: 195, favoriteActivity: 'Gym Workout', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-67', name: 'Layla Oprea', username: '@layla_o', walletAddress: 'FitPool67e8f9g0h1i2j3k4l5m6n7o8p9q0r1s', rank: 67, healthScore: 89, totalMinedFtc: 1900, dailyCaloriesBurned: 190, favoriteActivity: 'Running', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-68', name: 'Andrew Sandu', username: '@andrew_s', walletAddress: 'FitPool68f9g0h1i2j3k4l5m6n7o8p9q0r1s2t', rank: 68, healthScore: 91, totalMinedFtc: 1850, dailyCaloriesBurned: 185, favoriteActivity: 'Functional Exercise', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-69', name: 'Zoey Voicu', username: '@zoey_v', walletAddress: 'FitPool69g0h1i2j3k4l5m6n7o8p9q0r1s2t3u', rank: 69, healthScore: 95, totalMinedFtc: 1800, dailyCaloriesBurned: 180, favoriteActivity: 'Yoga', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-70', name: 'Lincoln Ungureanu', username: '@lincoln_u', walletAddress: 'FitPool70h1i2j3k4l5m6n7o8p9q0r1s2t3u4v', rank: 70, healthScore: 88, totalMinedFtc: 1750, dailyCaloriesBurned: 175, favoriteActivity: 'Walking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-71', name: 'Grace Barbu', username: '@grace_barbu', walletAddress: 'FitPool71i2j3k4l5m6n7o8p9q0r1s2t3u4v5w', rank: 71, healthScore: 92, totalMinedFtc: 1700, dailyCaloriesBurned: 172, favoriteActivity: 'Cycling', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-72', name: 'Christopher Mocanu', username: '@chris_m', walletAddress: 'FitPool72j3k4l5m6n7o8p9q0r1s2t3u4v5w6x', rank: 72, healthScore: 90, totalMinedFtc: 1650, dailyCaloriesBurned: 168, favoriteActivity: 'Swimming', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-73', name: 'Natalie Lazar', username: '@natalie_l', walletAddress: 'FitPool73k4l5m6n7o8p9q0r1s2t3u4v5w6x7y', rank: 73, healthScore: 94, totalMinedFtc: 1600, dailyCaloriesBurned: 165, favoriteActivity: 'Hiking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-74', name: 'Theodore Cristea', username: '@theo_c', walletAddress: 'FitPool74l5m6n7o8p9q0r1s2t3u4v5w6x7y8z', rank: 74, healthScore: 89, totalMinedFtc: 1550, dailyCaloriesBurned: 162, favoriteActivity: 'Gym Workout', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-75', name: 'Chloe Paraschiv', username: '@chloe_par', walletAddress: 'FitPool75m6n7o8p9q0r1s2t3u4v5w6x7y8z9a', rank: 75, healthScore: 91, totalMinedFtc: 1500, dailyCaloriesBurned: 160, favoriteActivity: 'Running', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-76', name: 'Ryan Preda', username: '@ryan_p', walletAddress: 'FitPool76n7o8p9q0r1s2t3u4v5w6x7y8z9a0b', rank: 76, healthScore: 93, totalMinedFtc: 1450, dailyCaloriesBurned: 158, favoriteActivity: 'Functional Exercise', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-77', name: 'Victoria Dobre', username: '@victoria_d', walletAddress: 'FitPool77o8p9q0r1s2t3u4v5w6x7y8z9a0b1c', rank: 77, healthScore: 88, totalMinedFtc: 1400, dailyCaloriesBurned: 155, favoriteActivity: 'Yoga', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-78', name: 'Timothy Enache', username: '@tim_enache', walletAddress: 'FitPool78p9q0r1s2t3u4v5w6x7y8z9a0b1c2d', rank: 78, healthScore: 90, totalMinedFtc: 1380, dailyCaloriesBurned: 152, favoriteActivity: 'Walking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-79', name: 'Audrey Suciu', username: '@audrey_s', walletAddress: 'FitPool79q0r1s2t3u4v5w6x7y8z9a0b1c2d3e', rank: 79, healthScore: 92, totalMinedFtc: 1350, dailyCaloriesBurned: 150, favoriteActivity: 'Cycling', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-80', name: 'Nathan Cojocaru', username: '@nathan_c', walletAddress: 'FitPool80r1s2t3u4v5w6x7y8z9a0b1c2d3e4f', rank: 80, healthScore: 89, totalMinedFtc: 1320, dailyCaloriesBurned: 148, favoriteActivity: 'Swimming', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-81', name: 'Savannah Vlad', username: '@savannah_v', walletAddress: 'FitPool81s2t3u4v5w6x7y8z9a0b1c2d3e4f5g', rank: 81, healthScore: 91, totalMinedFtc: 1300, dailyCaloriesBurned: 145, favoriteActivity: 'Hiking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-82', name: 'Christian Roman', username: '@christian_r', walletAddress: 'FitPool82t3u4v5w6x7y8z9a0b1c2d3e4f5g6h', rank: 82, healthScore: 94, totalMinedFtc: 1280, dailyCaloriesBurned: 142, favoriteActivity: 'Gym Workout', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-83', name: 'Brooklyn Dumitru', username: '@brooklyn_d', walletAddress: 'FitPool83u4v5w6x7y8z9a0b1c2d3e4f5g6h7i', rank: 83, healthScore: 88, totalMinedFtc: 1260, dailyCaloriesBurned: 140, favoriteActivity: 'Running', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-84', name: 'Hunter Marin', username: '@hunter_m', walletAddress: 'FitPool84v5w6x7y8z9a0b1c2d3e4f5g6h7i8j', rank: 84, healthScore: 90, totalMinedFtc: 1240, dailyCaloriesBurned: 138, favoriteActivity: 'Functional Exercise', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-85', name: 'Bella Moga', username: '@bella_m', walletAddress: 'FitPool85w6x7y8z9a0b1c2d3e4f5g6h7i8j9k', rank: 85, healthScore: 93, totalMinedFtc: 1220, dailyCaloriesBurned: 135, favoriteActivity: 'Yoga', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-86', name: 'Aaron Rus', username: '@aaron_rus', walletAddress: 'FitPool86x7y8z9a0b1c2d3e4f5g6h7i8j9k0l', rank: 86, healthScore: 89, totalMinedFtc: 1200, dailyCaloriesBurned: 132, favoriteActivity: 'Walking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-87', name: 'Skylar Neagu', username: '@skylar_n', walletAddress: 'FitPool87y8z9a0b1c2d3e4f5g6h7i8j9k0l1m', rank: 87, healthScore: 91, totalMinedFtc: 1180, dailyCaloriesBurned: 130, favoriteActivity: 'Cycling', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-88', name: 'Charles Nita', username: '@charles_n', walletAddress: 'FitPool88z9a0b1c2d3e4f5g6h7i8j9k0l1m2n', rank: 88, healthScore: 92, totalMinedFtc: 1160, dailyCaloriesBurned: 128, favoriteActivity: 'Swimming', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-89', name: 'Lucy Pop', username: '@lucy_pop', walletAddress: 'FitPool89a0b1c2d3e4f5g6h7i8j9k0l1m2n3o', rank: 89, healthScore: 88, totalMinedFtc: 1140, dailyCaloriesBurned: 125, favoriteActivity: 'Hiking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-90', name: 'Eli Filip', username: '@eli_filip', walletAddress: 'FitPool90b1c2d3e4f5g6h7i8j9k0l1m2n3o4p', rank: 90, healthScore: 90, totalMinedFtc: 1120, dailyCaloriesBurned: 122, favoriteActivity: 'Gym Workout', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-91', name: 'Paisley Macovei', username: '@paisley_m', walletAddress: 'FitPool91c2d3e4f5g6h7i8j9k0l1m2n3o4p5q', rank: 91, healthScore: 93, totalMinedFtc: 1100, dailyCaloriesBurned: 120, favoriteActivity: 'Running', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-92', name: 'Jonathan Sava', username: '@jonathan_s', walletAddress: 'FitPool92d3e4f5g6h7i8j9k0l1m2n3o4p5q6r', rank: 92, healthScore: 89, totalMinedFtc: 1080, dailyCaloriesBurned: 118, favoriteActivity: 'Functional Exercise', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-93', name: 'Everly Ilie', username: '@everly_ilie', walletAddress: 'FitPool93e4f5g6h7i8j9k0l1m2n3o4p5q6r7s', rank: 93, healthScore: 91, totalMinedFtc: 1060, dailyCaloriesBurned: 115, favoriteActivity: 'Yoga', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-94', name: 'Connor Burlacu', username: '@connor_b', walletAddress: 'FitPool94f5g6h7i8j9k0l1m2n3o4p5q6r7s8t', rank: 94, healthScore: 88, totalMinedFtc: 1040, dailyCaloriesBurned: 112, favoriteActivity: 'Walking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-95', name: 'Anna Nica', username: '@anna_nica', walletAddress: 'FitPool95g6h7i8j9k0l1m2n3o4p5q6r7s8t9u', rank: 95, healthScore: 94, totalMinedFtc: 1020, dailyCaloriesBurned: 110, favoriteActivity: 'Cycling', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-96', name: 'Landon Stoian', username: '@landon_s', walletAddress: 'FitPool96h7i8j9k0l1m2n3o4p5q6r7s8t9u0v', rank: 96, healthScore: 90, totalMinedFtc: 1000, dailyCaloriesBurned: 108, favoriteActivity: 'Swimming', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'Verified' },
  { id: 'miner-97', name: 'Claire Lupu', username: '@claire_lupu', walletAddress: 'FitPool97i8j9k0l1m2n3o4p5q6r7s8t9u0v1w', rank: 97, healthScore: 92, totalMinedFtc: 980, dailyCaloriesBurned: 105, favoriteActivity: 'Hiking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-98', name: 'Adrian Chiriac', username: '@adrian_c', walletAddress: 'FitPool98j9k0l1m2n3o4p5q6r7s8t9u0v1w2x', rank: 98, healthScore: 89, totalMinedFtc: 960, dailyCaloriesBurned: 102, favoriteActivity: 'Gym Workout', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Mining Now' },
  { id: 'miner-99', name: 'Julia Moldovan', username: '@julia_m', walletAddress: 'FitPool99k0l1m2n3o4p5q6r7s8t9u0v1w2x3y', rank: 99, healthScore: 91, totalMinedFtc: 940, dailyCaloriesBurned: 100, favoriteActivity: 'Running', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Online' },
  { id: 'miner-100', name: 'Darius Sandu', username: '@darius_s', walletAddress: 'FitPool100l1m2n3o4p5q6r7s8t9u0v1w2x3y4z', rank: 100, healthScore: 88, totalMinedFtc: 920, dailyCaloriesBurned: 98, favoriteActivity: 'Walking', countryCode: 'RO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Verified' }
];

