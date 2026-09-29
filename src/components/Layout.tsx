import React from 'react';
import { ShieldCheck, Lock, Activity, Award, Github, ExternalLink } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { WalletState, ContractMetrics } from '../hooks/useMidnight';

interface LayoutProps {
  children: React.ReactNode;
  wallet: WalletState;
  metrics: ContractMetrics;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  wallet,
  metrics,
  onConnectWallet,
  onDisconnectWallet,
}) => {
  return (
    <div className="min-h-screen bg-[#050a18] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#050a18]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  NightProof
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-950 text-blue-400 border border-blue-800/60">
                  Midnight Compact
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Privacy-First Eligibility Verification Platform
              </p>
            </div>
          </div>

          {/* Wallet & Status */}
          <div className="flex items-center gap-4">
            <WalletConnect
              wallet={wallet}
              onConnect={onConnectWallet}
              onDisconnect={onDisconnectWallet}
            />
          </div>
        </div>
      </header>

      {/* Metric Stats Header Bar */}
      <div className="bg-slate-950/60 border-b border-slate-800/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Verifications Verified:</span>
              <span className="font-mono text-white font-bold text-sm">{metrics.totalVerifications}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Evaluations Processed:</span>
              <span className="font-mono text-white font-bold text-sm">{metrics.totalApplications}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Registered Commitments:</span>
              <span className="font-mono text-white font-bold text-sm">{metrics.verifiedCitizensCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Midnight Preprod Network Live</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#02050e] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>NightProof — Powered by Midnight Network Zero-Knowledge Proofs</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Boredooms/Nightproof"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <span>Midnight Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
