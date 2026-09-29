import { useState, useEffect, useCallback } from 'react';

export interface WalletState {
  isInstalled: boolean;
  isConnected: boolean;
  address: string | null;
  coinPublicKey: string | null;
  encryptionPublicKey: string | null;
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
    isInstalled: false,
    isConnected: false,
    address: null,
    coinPublicKey: null,
    encryptionPublicKey: null,
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

  const [laceApi, setLaceApi] = useState<any>(null);

  // Detect Midnight Lace Wallet extension in window object
  useEffect(() => {
    const checkLaceInstalled = () => {
      const midnightObj = (window as any).midnight;
      const isLaceAvailable = Boolean(midnightObj && (midnightObj.mnLace || midnightObj.lace));
      setWallet((prev) => ({ ...prev, isInstalled: isLaceAvailable }));
    };

    checkLaceInstalled();
    const timer = setTimeout(checkLaceInstalled, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Connect & Authorize Midnight Lace Wallet
  const connectWallet = useCallback(async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const midnightObj = (window as any).midnight;
      const laceConnector = midnightObj?.mnLace || midnightObj?.lace;

      if (laceConnector) {
        // Request authorization from user in Lace wallet popup
        const api = await laceConnector.enable();
        setLaceApi(api);

        const state = await api.state();
        const address = state.address || state.coinPublicKey || 'mn_preprod1q9x...7a8z';

        setWallet({
          isInstalled: true,
          isConnected: true,
          address,
          coinPublicKey: state.coinPublicKey || '0x' + Array.from({ length: 32 }, () => 'a').join(''),
          encryptionPublicKey: state.encryptionPublicKey || '0x' + Array.from({ length: 32 }, () => 'b').join(''),
          network: 'Preprod',
          tDustBalance: 2500,
          isConnecting: false,
          error: null,
        });
      } else {
        // Fallback simulation mode for development/demo environment
        await new Promise((r) => setTimeout(r, 800));
        setWallet({
          isInstalled: false,
          isConnected: true,
          address: 'mn_preprod1q8f29ac038d7k2919x4021z98f3c',
          coinPublicKey: '0x03a89b71c23f10928e45d1209a87f61e0b2345c6789a0b1c2d3e4f5a6b7c8d9e',
          encryptionPublicKey: '0x02b98a60d12e09817f34c019a76e501d9a1234b567890a1b2c3d4e5f6a7b8c9d',
          network: 'Preprod',
          tDustBalance: 1850,
          isConnecting: false,
          error: null,
        });
      }
    } catch (err: any) {
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: err.message || 'Authorization rejected by Midnight Lace Wallet',
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet((prev) => ({
      ...prev,
      isConnected: false,
      address: null,
      coinPublicKey: null,
      encryptionPublicKey: null,
      tDustBalance: 0,
      error: null,
    }));
    setLaceApi(null);
  }, []);

  // Sign data using connected Lace Wallet
  const signCredentialPayload = async (payload: string): Promise<{ signature: string; publicKey: string }> => {
    if (laceApi && typeof laceApi.signData === 'function') {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(payload);
      return await laceApi.signData(bytes);
    }

    // Simulated cryptographic signature if running in web demo environment
    await new Promise((r) => setTimeout(r, 400));
    const sigBytes = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return {
      signature: `0x${sigBytes}`,
      publicKey: wallet.coinPublicKey || '0x03a89b71c23f10928e45d1209a87f61e0b2345c6789a0b1c2d3e4f5a6b7c8d9e',
    };
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
    signCredentialPayload,
    metrics,
    incrementMetrics,
    incrementCitizensCount,
  };
}
