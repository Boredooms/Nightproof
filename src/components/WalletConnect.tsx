import React from 'react';
import { Wallet, ShieldCheck, AlertCircle, RefreshCw, Key, CheckCircle2, Lock } from 'lucide-react';
import { WalletState } from '../hooks/useMidnight';

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div className="flex items-center gap-3">
      {wallet.isConnected ? (
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2 text-sm shadow-xl backdrop-blur-md">
          {/* Status Dot */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-slate-200 text-xs font-semibold">
              {wallet.address
                ? `${wallet.address.slice(0, 12)}...${wallet.address.slice(-6)}`
                : 'Connected'}
            </span>
          </div>

          {/* Network Badge */}
          <span className="px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 text-[11px] font-semibold border border-indigo-800/60 font-mono">
            {wallet.network}
          </span>

          {/* Balance */}
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="text-amber-400 font-bold">{wallet.tDustBalance}</span>
            <span className="text-[10px] text-slate-400">tDUST</span>
          </div>

          {/* Mode Badge */}
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">
            {wallet.isInstalled ? 'Lace Hardware/Extension' : 'Local Demo Wallet'}
          </span>

          {/* Disconnect Button */}
          <button
            onClick={onDisconnect}
            className="ml-1 text-xs text-slate-400 hover:text-red-400 transition-colors duration-200 px-2 py-1 rounded hover:bg-red-950/30"
            title="Disconnect Midnight Wallet"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onConnect}
            disabled={wallet.isConnecting}
            className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-xl shadow-blue-500/25 active:scale-95 disabled:opacity-50"
          >
            {wallet.isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Authorizing Lace Wallet...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 text-cyan-200" />
                <span>Authorize & Sign in with Midnight Lace</span>
              </>
            )}
          </button>

          {!wallet.isInstalled && (
            <span
              className="hidden lg:inline-block text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl font-mono"
              title="Lace Wallet Extension Demo Mode"
            >
              Lace Extension Ready
            </span>
          )}
        </div>
      )}

      {wallet.error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/60 border border-red-900/80 px-3 py-1.5 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{wallet.error}</span>
        </div>
      )}
    </div>
  );
};
