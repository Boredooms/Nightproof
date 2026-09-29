import React from 'react';
import { Wallet, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
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
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2 text-sm shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-slate-200 text-xs font-medium">
              {wallet.address ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-6)}` : 'Connected'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 text-[11px] font-semibold border border-indigo-800/50">
            {wallet.network}
          </span>
          <span className="text-slate-400 text-xs font-mono">
            {wallet.tDustBalance} tDUST
          </span>
          <button
            onClick={onDisconnect}
            className="ml-2 text-xs text-slate-400 hover:text-red-400 transition-colors duration-200"
            title="Disconnect Wallet"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          disabled={wallet.isConnecting}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
        >
          {wallet.isConnecting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
              <span>Connecting Lace Wallet...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              <span>Connect Midnight Wallet</span>
            </>
          )}
        </button>
      )}

      {wallet.error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/40 border border-red-900/60 px-3 py-1.5 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{wallet.error}</span>
        </div>
      )}
    </div>
  );
};
