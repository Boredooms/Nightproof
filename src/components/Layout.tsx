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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-zinc-200 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-700 p-0.5 shadow-xl flex items-center justify-center">
              {/* NightProof ZK Shield Mark */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <g transform="rotate(-30 12 12)">
                  <circle cx="7.3" cy="3.2" r="1.45" />
                  <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                  <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                  <circle cx="16.7" cy="20.8" r="1.45" />
                </g>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  NightProof
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-zinc-900 text-zinc-300 border border-zinc-700">
                  Midnight
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Privacy-First Eligibility Verification
              </p>
            </div>
          </div>

          <WalletConnect
            wallet={wallet}
            onConnect={onConnectWallet}
            onDisconnect={onDisconnectWallet}
          />
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-zinc-950 border-b border-zinc-800/80 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            {[
              { icon: <Activity className="w-4 h-4 text-zinc-200" />, label: 'Verified', value: metrics.totalVerifications },
              { icon: <Lock className="w-4 h-4 text-zinc-400" />, label: 'Evaluated', value: metrics.totalApplications },
              { icon: <Award className="w-4 h-4 text-zinc-300" />, label: 'Registered', value: metrics.verifiedCitizensCount },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-zinc-400">
                {icon}
                <span>{label}:</span>
                <span className="font-mono text-white font-bold text-sm">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Midnight Preview • Live</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-zinc-800 bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-300" />
            <span>NightProof — Built on Midnight Network Zero-Knowledge Proofs</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Boredooms/Nightproof" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a href="https://midnight.network" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
              <span>Midnight Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
