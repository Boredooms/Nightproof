import { useState, useEffect } from 'react';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: 'Preprod' | 'Local';
  tDustBalance: number;
  isConnecting: boolean;
  error: string | null;
}

export interface ContractMetrics {
  totalVerifications: number;
  totalApplications: number;
  verifiedCitizensCount: number;
}

export function useMidnight() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: 'Preprod',
    tDustBalance: 0,
    isConnecting: false,
    error: null,
  });

  const [metrics, setMetrics] = useState<ContractMetrics>({
    totalVerifications: 142,
    totalApplications: 158,
    verifiedCitizensCount: 89,
  });

  // Check for window.midnight Lace Wallet DApp connector
  const connectWallet = async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      // Simulate or connect to Midnight Lace Extension
      const midnightWindow = (window as any).midnight;
      if (midnightWindow && midnightWindow.mnLace) {
        const api = await midnightWindow.mnLace.enable();
        const state = await api.state();
        setWallet({
          isConnected: true,
          address: state.address || 'mn_preprod1q9x...7a8z',
          network: 'Preprod',
          tDustBalance: 1250,
          isConnecting: false,
          error: null,
        });
      } else {
        // Fallback simulation for local demonstration
        await new Promise((r) => setTimeout(r, 600));
        setWallet({
          isConnected: true,
          address: 'mn_preprod1q8f29ac038d7k2919x4021z',
          network: 'Preprod',
          tDustBalance: 2500,
          isConnecting: false,
          error: null,
        });
      }
    } catch (err: any) {
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: err.message || 'Failed to connect Midnight Lace wallet',
      }));
    }
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      network: 'Preprod',
      tDustBalance: 0,
      isConnecting: false,
      error: null,
    });
  };

  const incrementMetrics = (wasVerified: boolean) => {
    setMetrics((prev) => ({
      ...prev,
      totalApplications: prev.totalApplications + 1,
      totalVerifications: wasVerified ? prev.totalVerifications + 1 : prev.totalVerifications,
    }));
  };

  const incrementCitizensCount = () => {
    setMetrics((prev) => ({
      ...prev,
      verifiedCitizensCount: prev.verifiedCitizensCount + 1,
    }));
  };

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    metrics,
    incrementMetrics,
    incrementCitizensCount,
  };
}
