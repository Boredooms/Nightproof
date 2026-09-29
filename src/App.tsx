import React from 'react';
import { Layout } from './components/Layout';
import { EligibilityVerifier } from './components/EligibilityVerifier';
import { useMidnight } from './hooks/useMidnight';
import { ShieldCheck, Lock, Sparkles, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export function App() {
  const {
    wallet,
    connectWallet,
    disconnectWallet,
    metrics,
    incrementMetrics,
    incrementCitizensCount,
  } = useMidnight();

  return (
    <Layout
      wallet={wallet}
      metrics={metrics}
      onConnectWallet={connectWallet}
      onDisconnectWallet={disconnectWallet}
    >
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-semibold text-blue-300 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero-Knowledge Public Services Verification</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Prove Eligibility.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Protect Your Data.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          NightProof replaces repetitive document uploads with Zero-Knowledge Proofs on Midnight Network.
          Prove income, age, and academic qualifications for scholarships and welfare schemes without revealing sensitive document copies.
        </p>
      </div>

      {/* Main Core Component */}
      <EligibilityVerifier
        isConnected={wallet.isConnected}
        onProofGenerated={(isEligible) => incrementMetrics(isEligible)}
        onCredentialRegistered={incrementCitizensCount}
      />
    </Layout>
  );
}

export default App;
