import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Download, 
  Copy, 
  Check, 
  X, 
  Flame, 
  Zap, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Twitter,
  Send,
  MessageCircle,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { FitcoinLogo } from './FitcoinLogo';
import { PROMOTION_URL } from '../utils/formatters';

interface ShareAchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userHandle?: string;
  caloriesBurned?: number;
  ftcMinedToday?: number;
  streakDays?: number;
  healthScore?: number;
  ftcPriceUsd?: number;
  pobcHash?: string;
}

type ThemePreset = 'cyber_emerald' | 'solana_gold' | 'deep_violet' | 'crimson_rose';
type AspectRatio = 'square' | 'landscape';

export const ShareAchievementsModal: React.FC<ShareAchievementsModalProps> = ({
  isOpen,
  onClose,
  userName = 'FitCoin Miner',
  userHandle = '@FitMiner',
  caloriesBurned = 480,
  ftcMinedToday = 1920,
  streakDays = 5,
  healthScore = 98,
  ftcPriceUsd = 0.000004044,
  pobcHash = 'sol-' + Math.random().toString(36).substring(2, 10) + '...'
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>('cyber_emerald');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('square');
  const [customQuote, setCustomQuote] = useState('Converted my sweat into Solana crypto with Proof-of-Burn! 🔥🚀');
  
  // Toggles
  const [showUsdValue, setShowUsdValue] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [showPobcHash, setShowPobcHash] = useState(true);

  // States
  const [isCopied, setIsCopied] = useState(false);
  const [dataUrl, setDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const estimatedUsd = (ftcMinedToday * ftcPriceUsd).toFixed(4);

  // Generate image onto canvas
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = 1080;
    const height = aspectRatio === 'square' ? 1080 : 608;
    canvas.width = width;
    canvas.height = height;

    // Theme Configs
    const themes = {
      cyber_emerald: {
        bgGradient: ['#030712', '#06131e', '#022c22'],
        accent: '#10b981',
        accentGlow: 'rgba(16, 185, 129, 0.4)',
        secondary: '#06b6d4',
        cardBg: 'rgba(6, 24, 38, 0.85)',
        borderColor: 'rgba(16, 185, 129, 0.4)',
        textColor: '#f8fafc',
        subTextColor: '#94a3b8'
      },
      solana_gold: {
        bgGradient: ['#0f0a02', '#211303', '#3a2003'],
        accent: '#f59e0b',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        secondary: '#eab308',
        cardBg: 'rgba(30, 18, 4, 0.85)',
        borderColor: 'rgba(245, 158, 11, 0.4)',
        textColor: '#fffbeb',
        subTextColor: '#d97706'
      },
      deep_violet: {
        bgGradient: ['#0b0412', '#1a092b', '#2e1065'],
        accent: '#a855f7',
        accentGlow: 'rgba(168, 85, 247, 0.4)',
        secondary: '#ec4899',
        cardBg: 'rgba(23, 10, 38, 0.85)',
        borderColor: 'rgba(168, 85, 247, 0.4)',
        textColor: '#faf5ff',
        subTextColor: '#c084fc'
      },
      crimson_rose: {
        bgGradient: ['#120306', '#2b070f', '#4c0519'],
        accent: '#f43f5e',
        accentGlow: 'rgba(244, 63, 94, 0.4)',
        secondary: '#fb923c',
        cardBg: 'rgba(38, 8, 16, 0.85)',
        borderColor: 'rgba(244, 63, 94, 0.4)',
        textColor: '#fff1f2',
        subTextColor: '#fda4af'
      }
    };

    const t = themes[selectedTheme];

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, t.bgGradient[0]);
    bgGrad.addColorStop(0.5, t.bgGradient[1]);
    bgGrad.addColorStop(1, t.bgGradient[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Outer Decorative Glowing Circles
    ctx.save();
    ctx.shadowBlur = 120;
    ctx.shadowColor = t.accentGlow;
    ctx.fillStyle = t.accentGlow;
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.15, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.85, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Outer Card Frame
    const margin = 50;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;
    const cardX = margin;
    const cardY = margin;
    const radius = 32;

    ctx.save();
    ctx.fillStyle = t.cardBg;
    ctx.strokeStyle = t.borderColor;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 40;
    ctx.shadowColor = t.accentGlow;

    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);
    }
    ctx.restore();

    // Helper to draw original round Fitcoin logo on canvas
    const drawRoundFitcoinLogo = (cx: number, cy: number, r: number) => {
      ctx.save();
      // Outer metallic circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();

      const innerR = r * 0.88;

      // Left Red Half
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, Math.PI * 0.5, Math.PI * 1.5);
      ctx.fillStyle = '#7f1d1d';
      ctx.fill();
      ctx.restore();

      // Right Green Half
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, Math.PI * 1.5, Math.PI * 0.5);
      ctx.fillStyle = '#065f46';
      ctx.fill();
      ctx.restore();

      // Yin-Yang Dividing Line
      ctx.beginPath();
      ctx.moveTo(cx, cy - innerR);
      ctx.bezierCurveTo(cx + innerR * 0.3, cy - innerR * 0.5, cx - innerR * 0.3, cy + innerR * 0.5, cx, cy + innerR);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Studs / Rivets
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const sx = cx + (r * 0.94) * Math.cos(angle);
        const sy = cy + (r * 0.94) * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(2, r * 0.04), 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
      }

      // Yoga Figure (Lotus Position & Namaste)
      ctx.strokeStyle = '#fef08a';
      ctx.fillStyle = '#fef08a';
      ctx.lineWidth = Math.max(1.5, r * 0.05);

      // Head
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.25, r * 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Spine & Namaste hands
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.15);
      ctx.lineTo(cx, cy + r * 0.15);
      ctx.stroke();

      // Arms in prayer
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.22, cy - r * 0.03);
      ctx.lineTo(cx, cy - r * 0.12);
      ctx.lineTo(cx + r * 0.22, cy - r * 0.03);
      ctx.stroke();

      // Crossed Lotus Legs Base
      ctx.beginPath();
      ctx.arc(cx, cy + r * 0.18, r * 0.25, 0, Math.PI);
      ctx.stroke();

      // FITCOIN Text inside coin
      ctx.fillStyle = '#fef08a';
      ctx.font = `900 ${Math.floor(r * 0.22)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('FITCOIN', cx, cy + r * 0.58);

      ctx.restore();
    };

    // HEADER: Round FitCoin Logo Badge & Title
    drawRoundFitcoinLogo(cardX + 85, cardY + 80, 42);

    ctx.save();
    ctx.fillStyle = t.textColor;
    ctx.font = '900 36px sans-serif';
    ctx.fillText('FITCOIN (FTC)', cardX + 145, cardY + 80);

    ctx.fillStyle = t.accent;
    ctx.font = 'bold 18px monospace';
    ctx.fillText('PROOF-OF-BURN PROTOCOL • SOLANA NETWORK', cardX + 145, cardY + 115);

    // Right Header Tag
    ctx.fillStyle = t.secondary;
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('VERIFIED ACHIEVEMENT', cardX + cardW - 50, cardY + 80);
    ctx.restore();

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 50, cardY + 140);
    ctx.lineTo(cardX + cardW - 50, cardY + 140);
    ctx.stroke();

    // USER PROFILE SECTION
    ctx.save();
    ctx.fillStyle = t.textColor;
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(userName, cardX + 50, cardY + 195);

    ctx.fillStyle = t.subTextColor;
    ctx.font = '18px monospace';
    ctx.fillText(userHandle, cardX + 50, cardY + 225);

    if (showStreak && streakDays > 0) {
      const streakText = `🔥 ${streakDays} DAY STREAK`;
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'extrabold 20px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(streakText, cardX + cardW - 50, cardY + 205);
    }
    ctx.restore();

    // STATS BOX 1: CALORIES BURNED
    const boxMarginY = aspectRatio === 'square' ? cardY + 260 : cardY + 250;
    const boxW = (cardW - 120) / 2;
    const boxH = aspectRatio === 'square' ? 240 : 180;

    // Box 1 (Calories)
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 2;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(cardX + 50, boxMarginY, boxW, boxH, 20);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = '#fda4af';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('🔥 DAILY CALORIES BURNED', cardX + 80, boxMarginY + 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px sans-serif';
    ctx.fillText(`${caloriesBurned.toLocaleString()}`, cardX + 80, boxMarginY + 115);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('kcal verified on-chain', cardX + 80, boxMarginY + 155);
    ctx.restore();

    // Box 2 (FTC Mined)
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = t.borderColor;
    ctx.lineWidth = 2;
    const box2X = cardX + 70 + boxW;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(box2X, boxMarginY, boxW, boxH, 20);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = t.accent;
    ctx.font = 'bold 18px monospace';
    ctx.fillText('⚡ FTC TOKENS MINED', box2X + 30, boxMarginY + 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px sans-serif';
    ctx.fillText(`${ftcMinedToday.toLocaleString()}`, box2X + 30, boxMarginY + 115);

    ctx.fillStyle = showUsdValue ? t.secondary : '#94a3b8';
    ctx.font = 'bold 16px monospace';
    const subLabel = showUsdValue ? `≈ $${estimatedUsd} USD Value` : 'Proof-of-Burn Token';
    ctx.fillText(subLabel, box2X + 30, boxMarginY + 155);
    ctx.restore();

    // ADDITIONAL STATS BAR (Health Score & Verification Hash)
    const statsBarY = boxMarginY + boxH + 30;

    if (aspectRatio === 'square') {
      // Quote Box
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      const quoteBoxH = 120;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(cardX + 50, statsBarY, cardW - 100, quoteBoxH, 16);
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'italic 22px sans-serif';
      ctx.textAlign = 'center';
      
      // Wrap text
      const quoteText = `"${customQuote}"`;
      ctx.fillText(quoteText, cardX + cardW / 2, statsBarY + 68);
      ctx.restore();

      // Proof of Burn Hash & Seal Footer
      const footerY = statsBarY + quoteBoxH + 40;
      ctx.save();
      ctx.fillStyle = t.subTextColor;
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      if (showPobcHash) {
        ctx.fillText(`PoBC Hash: ${pobcHash}`, cardX + 50, footerY + 20);
      }
      ctx.fillText(`Health Index: ${healthScore}/100 ⚡`, cardX + 50, footerY + 50);

      ctx.fillStyle = t.accent;
      ctx.font = 'extrabold 18px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('www.Futurecoin.in', cardX + cardW - 50, footerY + 35);
      ctx.restore();

    } else {
      // Landscape Layout Footer
      ctx.save();
      ctx.fillStyle = t.subTextColor;
      ctx.font = '15px monospace';
      if (showPobcHash) {
        ctx.fillText(`PoBC Block Hash: ${pobcHash}`, cardX + 50, statsBarY + 30);
      }
      ctx.fillStyle = t.accent;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('www.Futurecoin.in • FitCoin AI Suite', cardX + cardW - 50, statsBarY + 30);
      ctx.restore();
    }

    // Export Canvas to Data URL for image tag preview
    const generatedUrl = canvas.toDataURL('image/png');
    setDataUrl(generatedUrl);
  }, [
    isOpen, 
    selectedTheme, 
    aspectRatio, 
    customQuote, 
    showUsdValue, 
    showStreak, 
    showPobcHash, 
    userName, 
    userHandle, 
    caloriesBurned, 
    ftcMinedToday, 
    streakDays, 
    healthScore, 
    ftcPriceUsd, 
    pobcHash
  ]);

  // Download Handler
  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `FitCoin_Achievement_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      });
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      // Fallback: Download image instead
      handleDownload();
    }
  };

  // Social Share Links
  const shareText = encodeURIComponent(`I burned ${caloriesBurned} kcal and mined ${ftcMinedToday} FTC on FitCoin Solana Proof-of-Burn Network! 🔥 tokenized workout goal reached. #FitCoin #Solana #ProofOfBurn`);
  const shareUrl = encodeURIComponent(PROMOTION_URL);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Hidden Working Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Share Achievement Card
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  EXPORT READY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Export daily calorie burn and FTC earned summaries as a high-res image for social media
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Image Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center min-h-[380px] shadow-inner relative group">
              {dataUrl ? (
                <img 
                  src={dataUrl} 
                  alt="FitCoin Achievement Card" 
                  className="w-full h-auto rounded-xl shadow-2xl border border-slate-800 max-h-[480px] object-contain transition-transform"
                />
              ) : (
                <div className="text-slate-500 text-xs font-mono animate-pulse">Rendering canvas card...</div>
              )}

              <div className="absolute top-5 right-5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                1080x{aspectRatio === 'square' ? '1080' : '608'} PNG
              </div>
            </div>

            {/* Quick Export Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
              </button>

              <button
                onClick={handleCopyImage}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied Image!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-300" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Customization Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5 font-mono text-xs">
            
            {/* Theme Picker */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-400" />
                Select Card Color Theme:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cyber_emerald', name: 'Cyber Emerald', color: 'bg-emerald-500' },
                  { id: 'solana_gold', name: 'Solana Gold', color: 'bg-amber-500' },
                  { id: 'deep_violet', name: 'Deep Violet', color: 'bg-purple-500' },
                  { id: 'crimson_rose', name: 'Crimson Energy', color: 'bg-rose-500' },
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id as ThemePreset)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                      selectedTheme === theme.id 
                        ? 'bg-slate-800 border-emerald-400 text-white shadow-md' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                    <span className="text-[11px] font-bold">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                Image Aspect Ratio:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAspectRatio('square')}
                  className={`p-2.5 rounded-xl border font-bold transition-all ${
                    aspectRatio === 'square'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  1:1 Square (Feed)
                </button>
                <button
                  onClick={() => setAspectRatio('landscape')}
                  className={`p-2.5 rounded-xl border font-bold transition-all ${
                    aspectRatio === 'landscape'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  16:9 Banner (X / Story)
                </button>
              </div>
            </div>

            {/* Motivational Note */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Custom Workout Quote / Caption:
              </label>
              <textarea
                rows={2}
                value={customQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                maxLength={90}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
              />
              <span className="text-[10px] text-slate-500 text-right block">{customQuote.length}/90 chars</span>
            </div>

            {/* Content Toggles */}
            <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] font-bold block mb-1">Display Data Options:</span>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUsdValue}
                    onChange={(e) => setShowUsdValue(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Show Estimated USD Value</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showStreak}
                    onChange={(e) => setShowStreak(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Show Streak Day Counter</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPobcHash}
                    onChange={(e) => setShowPobcHash(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Show Solana PoBC Verification Hash</span>
                </label>
              </div>
            </div>

            {/* Direct Social Media Sharing Links */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-bold block text-[11px]">Direct Share Links:</span>
              <div className="flex gap-2">
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-400 font-bold text-center flex items-center justify-center gap-1.5 transition-all text-[11px]"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>X (Twitter)</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold text-center flex items-center justify-center gap-1.5 transition-all text-[11px]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 font-bold text-center flex items-center justify-center gap-1.5 transition-all text-[11px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
