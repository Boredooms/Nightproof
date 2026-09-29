import React from 'react';
import {
  Wallet, ShieldCheck, AlertCircle, RefreshCw, ExternalLink, CheckCircle2
} from 'lucide-react';
import { WalletState, WalletStatus } from '../hooks/useMidnight';
import { truncate, CONTRACT_CONFIG } from '../utils/contract';

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

const STATUS_BADGES: Record<WalletStatus, { label: string; color: string }> = {
  'not-installed': { label: 'Lace Not Installed', color: 'bg-slate-800 text-slate-400' },
  'disconnected':  { label: 'Not Connected',      color: 'bg-slate-800 text-slate-400' },
  'connecting':    { label: 'Authorizing...',      color: 'bg-blue-900 text-blue-300'   },
  'connected':     { label: 'Authorized',          color: 'bg-emerald-900 text-emerald-300' },
  'error':         { label: 'Error',               color: 'bg-red-900 text-red-300'     },
};

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnect,
  onDisconnect,
}) => {
  const badge = STATUS_BADGES[wallet.status];

  if (wallet.status === 'connected') {
    return (
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xl">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        </div>

        {/* Address */}
        <span className="font-mono text-xs text-slate-200 font-semibold">
          {wallet.address ? truncate(wallet.address, 12, 6) : 'Connected'}
        </span>

        {/* Network badge — always Preview */}
        <span className="px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 text-[11px] font-semibold border border-indigo-800/60 font-mono uppercase">
          {wallet.networkId || 'preview'}
        </span>

        {/* Balance */}
        {wallet.balance && (
          <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-0.5 rounded-md border border-slate-800 text-xs font-mono">
            <span className="text-amber-400 font-bold">{wallet.balance}</span>
          </div>
        )}

        {/* Disconnect */}
        <button
          onClick={onDisconnect}
          className="ml-1 text-xs text-slate-400 hover:text-red-400 transition-colors duration-200 px-2 py-1 rounded hover:bg-red-950/30"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Install prompt if Lace not found */}
      {wallet.status === 'not-installed' && (
        <a
          href="https://midnight.network/lace"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors px-3 py-1.5 bg-amber-950/30 border border-amber-800/40 rounded-xl"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Install Midnight Lace Wallet</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}

      <button
        onClick={onConnect}
        disabled={wallet.status === 'connecting'}
        id="connect-wallet-btn"
        className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-xl shadow-blue-500/25 active:scale-95 disabled:opacity-50"
      >
        {wallet.status === 'connecting' ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
            <span>Authorizing in Lace Wallet...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 text-cyan-200" />
            <span>Connect Midnight Lace Wallet</span>
          </>
        )}
      </button>

      {wallet.status === 'error' && wallet.error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/60 border border-red-900/60 px-3 py-1.5 rounded-xl max-w-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{wallet.error}</span>
        </div>
      )}
    </div>
  );
};
