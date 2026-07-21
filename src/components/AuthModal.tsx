import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  X,
  UserPlus,
  LogIn
} from 'lucide-react';
import { FitcoinLogo } from './FitcoinLogo';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'register' | 'login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'register'
}) => {
  const [mode, setMode] = useState<'register' | 'login' | 'forgot_password'>(initialMode);
  
  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1); // 1: Generate OTP & Enter OTP, 2: New Password

  // Status & Feedback Messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Load existing registered users from localStorage
  const getRegisteredUsers = (): UserAccount[] => {
    try {
      const data = localStorage.getItem('fitcoin_registered_users');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveRegisteredUsers = (users: UserAccount[]) => {
    localStorage.setItem('fitcoin_registered_users', JSON.stringify(users));
  };

  // Handle User Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regFullName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    const existingUsers = getRegisteredUsers();
    const isDuplicate = existingUsers.some(
      u => u.username.toLowerCase() === regUsername.trim().toLowerCase() ||
           (u.email && regEmail && u.email.toLowerCase() === regEmail.trim().toLowerCase())
    );

    if (isDuplicate) {
      setErrorMsg('Username or Email is already registered. Please login.');
      return;
    }

    // Create new user account
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: regFullName.trim(),
      username: regUsername.trim(),
      email: regEmail.trim() || `${regUsername.trim()}@fitcoin.in`,
      passwordHash: regPassword, // client stored local credential
      createdAt: Date.now(),
      isAdmin: regUsername.trim() === 'Fitrudrah' && regPassword === '786786',
      ftcBalance: 500 // Welcome Bonus
    };

    saveRegisteredUsers([...existingUsers, newUser]);

    setSuccessMsg('Registration successful! Please login with your account.');
    setLoginIdentifier(newUser.username);
    setRegPassword('');
    setRegConfirmPassword('');
    setMode('login');
  };

  // Handle User Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const identifier = loginIdentifier.trim();
    const pass = loginPassword.trim();

    if (!identifier || !pass) {
      setErrorMsg('Please enter your username/email and password.');
      return;
    }

    // Check Admin Master Credentials (Fitrudrah / 786786)
    if (identifier === 'Fitrudrah' && pass === '786786') {
      const adminUser: UserAccount = {
        id: 'admin-fitrudrah',
        fullName: 'Fitrudrah Protocol Admin',
        username: 'Fitrudrah',
        email: 'admin@futurecoin.in',
        passwordHash: '786786',
        createdAt: Date.now(),
        isAdmin: true,
        ftcBalance: 1000000
      };
      onLoginSuccess(adminUser);
      if (onClose) onClose();
      return;
    }

    // Check saved users
    const users = getRegisteredUsers();
    const foundUser = users.find(
      u => (u.username.toLowerCase() === identifier.toLowerCase() ||
            u.email.toLowerCase() === identifier.toLowerCase()) &&
           u.passwordHash === pass
    );

    if (foundUser) {
      if (foundUser.isBlocked) {
        setErrorMsg('Your account has been suspended by Protocol Admin.');
        return;
      }
      onLoginSuccess(foundUser);
      if (onClose) onClose();
    } else {
      setErrorMsg('Invalid Username or Password. If you are new, please Register first.');
    }
  };

  // Step 1: Request On-Screen OTP
  const handleGenerateOnScreenOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const identifier = forgotIdentifier.trim();
    if (!identifier) {
      setErrorMsg('Please enter your registered Username or Email.');
      return;
    }

    // Generate random 6-digit OTP directly
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setResetStep(2);
    setSuccessMsg('Verification OTP generated immediately below! No email/phone required.');
  };

  // Step 2: Verify OTP & Reset Password
  const handleCompletePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (userEnteredOtp.trim() !== generatedOtp) {
      setErrorMsg('Incorrect OTP code. Please enter the 6-digit code shown on screen.');
      return;
    }

    if (!newPassword.trim() || newPassword.length < 4) {
      setErrorMsg('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    // Update saved user password in localStorage
    const identifier = forgotIdentifier.trim().toLowerCase();
    const users = getRegisteredUsers();
    let updated = false;

    const updatedUsers = users.map(u => {
      if (u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier) {
        updated = true;
        return { ...u, passwordHash: newPassword.trim() };
      }
      return u;
    });

    if (updated) {
      saveRegisteredUsers(updatedUsers);
    } else {
      // If user wasn't in localStorage yet, save new entry
      const brandNewUser: UserAccount = {
        id: `usr-${Date.now()}`,
        fullName: identifier,
        username: identifier,
        email: `${identifier}@fitcoin.in`,
        passwordHash: newPassword.trim(),
        createdAt: Date.now(),
        isAdmin: identifier === 'fitrudrah',
        ftcBalance: 500
      };
      saveRegisteredUsers([...users, brandNewUser]);
    }

    setSuccessMsg('Password reset complete! You can now log in with your new password.');
    setLoginIdentifier(forgotIdentifier);
    setLoginPassword(newPassword.trim());
    
    // Reset forgot password state and navigate to login
    setTimeout(() => {
      setMode('login');
      setGeneratedOtp(null);
      setUserEnteredOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setResetStep(1);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 animate-fadeIn">
        
        {/* Glow Background Accent */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Close Button if provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <FitcoinLogo size="lg" showGlow={true} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            FUTURECOIN.IN
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {mode === 'register' && 'Create your FitCoin Mining Account'}
            {mode === 'login' && 'Log in to access your Human Energy Wallet'}
            {mode === 'forgot_password' && 'Instant On-Screen OTP Password Recovery'}
          </p>
        </div>

        {/* Form Mode Switcher Tabs */}
        {mode !== 'forgot_password' && (
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 grid grid-cols-2 text-xs font-mono">
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              1. Register
            </button>
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              2. Login
            </button>
          </div>
        )}

        {/* Feedback Alert Banners */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-500/50 p-3 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE 1: REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 block">Username or Mobile/Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Username or email"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 block">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Complete Free Registration (+500 FTC Bonus)
            </button>
          </form>
        )}

        {/* MODE 2: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 block">Username or Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter your username or email"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setForgotIdentifier(loginIdentifier);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] font-mono text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Account
            </button>
          </form>
        )}

        {/* MODE 3: FORGOT PASSWORD WITH ON-SCREEN OTP */}
        {mode === 'forgot_password' && (
          <div className="space-y-4">
            {resetStep === 1 ? (
              <form onSubmit={handleGenerateOnScreenOtp} className="space-y-4">
                <p className="text-xs text-slate-300">
                  Enter your registered username or email. Your security verification OTP will be generated and displayed <strong className="text-amber-400">immediately on screen</strong>.
                </p>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">Username / Email</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Username or email"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  Generate On-Screen OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompletePasswordReset} className="space-y-4">
                
                {/* ON-SCREEN DISPLAYED OTP BADGE */}
                {generatedOtp && (
                  <div className="bg-amber-950/80 border-2 border-amber-500 p-4 rounded-2xl text-center space-y-1 shadow-xl">
                    <div className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-extrabold">
                      YOUR ON-SCREEN SECURITY OTP CODE
                    </div>
                    <div className="text-3xl font-mono font-black text-amber-400 tracking-widest my-1 select-all">
                      {generatedOtp}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      No email or SMS needed! Enter this code below to set your new password.
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">Enter On-Screen OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={userEnteredOtp}
                    onChange={(e) => setUserEnteredOtp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-center text-lg tracking-widest font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">Set New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save New Password & Complete Reset
                </button>
              </form>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setResetStep(1);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-slate-400 hover:text-white font-mono underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
