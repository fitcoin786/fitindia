// Real GPS & Device Motion Tracking Utility for FitPool PoBC Engine

export interface GPSLocation {
  lat: number;
  lng: number;
  speedKmh: number;
  accuracy: number; // in meters
  heading: number | null;
  altitude: number | null;
  timestamp: number;
}

export interface MotionData {
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroZ: number;
  magnitude: number;
  netMotion: number;
  timestamp: number;
}

// Activity MET values for precise calorie calculation
export const ACTIVITY_MET_MAP: Record<string, number> = {
  Walking: 3.8,
  Running: 9.8,
  Cycling: 8.0,
  'Gym Workout': 6.0,
  Yoga: 3.0,
  Swimming: 8.0,
  Hiking: 6.5,
  'Functional Exercise': 6.0,
  Marathon: 11.0,
};

/**
 * Calculates Haversine distance in kilometers between two lat/lng coordinates
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates calories burned per second based on MET, weight (kg), real speed & movement intensity
 */
export function calculateRealCaloriesPerSec(
  activityType: string,
  userWeightKg: number = 70,
  currentSpeedKmh: number = 0,
  isMoving: boolean = true,
  motionIntensity: number = 0
): number {
  const baseMet = ACTIVITY_MET_MAP[activityType] || 5.0;

  // Scale MET dynamically based on speed / motion intensity
  let effectiveMet = baseMet;

  if (!isMoving && currentSpeedKmh < 0.5 && motionIntensity < 0.3) {
    // Resting state while paused or stationary
    effectiveMet = 1.3;
  } else if (currentSpeedKmh > 0) {
    // Adjust MET according to speed ratio
    if (activityType === 'Running' || activityType === 'Marathon') {
      const speedFactor = Math.max(0.7, currentSpeedKmh / 10);
      effectiveMet = baseMet * speedFactor;
    } else if (activityType === 'Walking' || activityType === 'Hiking') {
      const speedFactor = Math.max(0.6, currentSpeedKmh / 5);
      effectiveMet = baseMet * speedFactor;
    } else if (activityType === 'Cycling') {
      const speedFactor = Math.max(0.5, currentSpeedKmh / 20);
      effectiveMet = baseMet * speedFactor;
    }
  }

  // Boost MET slightly with physical device motion/shaking intensity
  effectiveMet += Math.min(2.0, motionIntensity * 0.5);

  // Calorie formula: (MET * 3.5 * weightKg / 200) / 60 per second
  const calPerMin = (effectiveMet * 3.5 * userWeightKg) / 200;
  return calPerMin / 60;
}

/**
 * Request iOS/Safari Motion Sensor permission if required
 */
export async function requestDeviceMotionPermission(): Promise<boolean> {
  if (
    typeof window !== 'undefined' &&
    'DeviceMotionEvent' in window &&
    typeof (DeviceMotionEvent as any).requestPermission === 'function'
  ) {
    try {
      const permissionState = await (DeviceMotionEvent as any).requestPermission();
      return permissionState === 'granted';
    } catch (e) {
      console.warn('DeviceMotion permission request failed or rejected:', e);
      return false;
    }
  }
  return true; // Granted by default on non-iOS browsers
}

// Global Screen Wake Lock Sentinel reference
let wakeLockSentinel: any = null;

/**
 * Requests Screen Wake Lock to keep the screen and GPS process alive when locked or dimmed
 */
export async function requestScreenWakeLock(): Promise<boolean> {
  if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
    try {
      wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      console.log('Screen Wake Lock acquired: Active background tracking enabled.');
      return true;
    } catch (err: any) {
      console.warn(`Screen Wake Lock request failed (${err.name}): ${err.message}`);
      return false;
    }
  }
  return false;
}

/**
 * Releases the Screen Wake Lock sentinel when tracking stops
 */
export async function releaseScreenWakeLock(): Promise<void> {
  if (wakeLockSentinel) {
    try {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
      console.log('Screen Wake Lock released.');
    } catch (e) {
      console.warn('Error releasing Wake Lock:', e);
    }
  }
}

// AudioContext keep-alive instance to keep Web Worker / background timers ticking when screen is locked
let silentAudioCtx: AudioContext | null = null;
let silentOscillator: OscillatorNode | null = null;

/**
 * Starts a silent Web Audio buffer stream.
 * Mobile OS browsers (iOS Safari & Android Chrome) keep Web Workers and GPS event loops active
 * in background/screen locked mode when a background media stream is playing.
 */
export function startBackgroundAudioKeepAlive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return false;

    if (!silentAudioCtx || silentAudioCtx.state === 'closed') {
      silentAudioCtx = new AudioCtx();
    }

    if (silentAudioCtx.state === 'suspended') {
      silentAudioCtx.resume();
    }

    if (!silentOscillator) {
      silentOscillator = silentAudioCtx.createOscillator();
      const gain = silentAudioCtx.createGain();
      gain.gain.value = 0.0001; // Virtually silent
      silentOscillator.type = 'sine';
      silentOscillator.frequency.value = 20; // 20Hz infrasonic frequency
      silentOscillator.connect(gain);
      gain.connect(silentAudioCtx.destination);
      silentOscillator.start();
    }

    // Set Media Session metadata for Lock Screen widget if supported
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'FitPool PoBC Energy Mining',
        artist: 'Futurecoin.in Engine v5.0',
        album: 'Live Real-Time GPS & Motion Tracking Active'
      });
      navigator.mediaSession.playbackState = 'playing';
    }

    return true;
  } catch (e) {
    console.warn('Background audio keep-alive setup note:', e);
    return false;
  }
}

/**
 * Stops background audio keep-alive stream
 */
export function stopBackgroundAudioKeepAlive(): void {
  if (silentOscillator) {
    try {
      silentOscillator.stop();
      silentOscillator.disconnect();
    } catch (e) {
      // ignore
    }
    silentOscillator = null;
  }

  if (silentAudioCtx && silentAudioCtx.state !== 'closed') {
    try {
      silentAudioCtx.suspend();
    } catch (e) {
      // ignore
    }
  }

  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'none';
  }
}

/**
 * Requests Background System Notification Permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    } catch (e) {
      console.warn('Notification permission note:', e);
    }
  }
  return false;
}

/**
 * Sends real-time background notification when screen is locked
 */
export function sendBackgroundProgressNotification(calories: number, ftcEarned: number, activity: string): void {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`FitPool Mining Active (${activity})`, {
        body: `🔥 Burned: ${calories.toFixed(0)} kcal | 💎 Mined: ${ftcEarned} FTC (Synced to Wallet)`,
        icon: '/favicon.ico',
        tag: 'fitpool-pobc-mining',
        silent: true
      });
    } catch (e) {
      // ignore
    }
  }
}

