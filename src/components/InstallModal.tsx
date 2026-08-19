import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  ExternalLink,
  X,
  ShieldCheck,
  Zap,
  Info,
  Copy,
  Check,
  Package,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallModalProps {
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'apk' | 'guide'>('instant');
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    soundEngine.playClick();
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        soundEngine.playLevelUp();
      }
      setInstallPrompt(null);
    } else {
      setActiveTab('guide');
    }
  };

  const handleCopyLink = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="w-full max-w-md bg-slate-900 border border-slate-750 rounded-3xl p-5 shadow-2xl flex flex-col relative max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white font-['Outfit'] leading-tight">
                Install Imran Blast on Android
              </h2>
              <span className="text-[11px] text-cyan-400 font-medium">
                Play in fullscreen, offline & 60 FPS
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 my-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('instant');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'instant'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Tap Install
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('apk');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GitHub APK
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('guide');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Guide
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {/* TAB 1: Instant App Installation */}
          {activeTab === 'instant' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-850 to-indigo-950/40 border border-cyan-500/30 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 p-1 mb-2 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-2xl">
                    ⚡
                  </div>
                </div>
                <h3 className="text-sm font-black text-white font-['Outfit']">
                  Instant Android Web APK
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-[280px]">
                  Installs directly to your home screen with zero downloading. Runs completely offline like a native app.
                </p>

                <div className="grid grid-cols-3 gap-2 w-full mt-3 pt-3 border-t border-slate-750 text-left">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Offline ready</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>No ads delay</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Full 60 FPS</span>
                  </div>
                </div>
              </div>

              {isInstalled ? (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-black block">Already Installed!</span>
                    <span>Imran Blast is running directly from your home screen.</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm font-['Outfit'] tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>INSTALL TO ANDROID DEVICE</span>
                </button>
              )}

              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Share Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy Game Link to Send to Phone</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: GitHub Actions Compiled APK */}
          {activeTab === 'apk' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750">
                <div className="flex items-center gap-2 mb-1.5">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-white">GitHub Actions APK Workflow</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The automated pipeline at <code className="text-cyan-300 text-[10px] bg-slate-950 px-1 py-0.5 rounded">.github/workflows/build-apk.yml</code> builds and publishes your debug APK on every push to <code className="text-cyan-300 text-[10px] bg-slate-950 px-1 py-0.5 rounded">main</code>.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="font-bold text-white block">Push Workflow to GitHub</span>
                    Commit and push <code className="text-cyan-300">build-apk.yml</code> to your repository.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="font-bold text-white block">Download from GitHub Releases</span>
                    Go to your repository’s <strong>Releases</strong> section or <strong>Actions → Artifacts</strong> to download <code className="text-amber-300 font-mono">*-debug-build-*.apk</code>.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="font-bold text-white block">Install on Android</span>
                    Tap the downloaded <code className="text-emerald-300">.apk</code> on your device, allow "Install Unknown Apps" if prompted, and launch!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Chrome / Browser Manual Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750">
                <span className="text-xs font-black text-white block mb-1">
                  How to Install via Chrome on Android:
                </span>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1">
                  <li>
                    Open this game in <strong>Google Chrome</strong> or Samsung Internet.
                  </li>
                  <li>
                    Tap the <strong>three dots (⋮)</strong> menu in the top-right corner.
                  </li>
                  <li>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    Tap <strong>"Install"</strong> when the confirmation popup appears.
                  </li>
                </ol>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-2 text-indigo-300 text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Once installed, you can play offline anytime with full high scores and settings saved locally on your phone.
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
