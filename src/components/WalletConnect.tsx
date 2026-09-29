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
  'not-installed': { label: 'Lace Not Installed', color: 'bg-zinc-800 text-zinc-400 border border-zinc-700' },
  'disconnected':  { label: 'Not Connected',      color: 'bg-zinc-800 text-zinc-400 border border-zinc-700' },
  'connecting':    { label: 'Authorizing...',      color: 'bg-zinc-100 text-black font-semibold' },
  'connected':     { label: 'Authorized',          color: 'bg-white text-black font-semibold' },
  'error':         { label: 'Error',               color: 'bg-zinc-900 text-zinc-300 border border-zinc-700' },
};

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnect,
  onDisconnect,
}) => {
  if (wallet.status === 'connected') {
    return (
      <div className="flex flex-wrap items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-2xl">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse flex-shrink-0" />
          <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
          <ShieldCheck className="w-4 h-4 text-zinc-300 flex-shrink-0" />
        </div>

        {/* Address */}
        <span className="font-mono text-xs text-white font-bold tracking-wide">
          {wallet.address ? truncate(wallet.address, 12, 6) : 'Connected'}
        </span>

        {/* Network badge — always Preview */}
        <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-200 text-[11px] font-semibold border border-zinc-600 font-mono uppercase">
          {wallet.networkId || 'preview'}
        </span>

        {/* Balance */}
        {wallet.balance && (
          <div className="flex items-center gap-1 bg-zinc-950 px-2.5 py-0.5 rounded-md border border-zinc-800 text-xs font-mono">
            <span className="text-zinc-300 font-bold">{wallet.balance}</span>
          </div>
        )}

        {/* Disconnect */}
        <button
          onClick={onDisconnect}
          className="ml-1 text-xs text-zinc-400 hover:text-white transition-colors duration-200 px-2 py-1 rounded hover:bg-zinc-800"
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
          className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl"
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
        className="flex items-center gap-2.5 bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl shadow-white/10 active:scale-95 disabled:opacity-50"
      >
        {wallet.status === 'connecting' ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-black" />
            <span>Authorizing in Lace Wallet...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 text-black" />
            <span>Connect Midnight Lace Wallet</span>
          </>
        )}
      </button>

      {wallet.status === 'error' && wallet.error && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl max-w-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-white" />
          <span className="truncate">{wallet.error}</span>
        </div>
      )}
    </div>
  );
};
