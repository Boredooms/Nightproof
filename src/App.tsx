import React from 'react';
import { Layout } from './components/Layout';
import { EligibilityVerifier } from './components/EligibilityVerifier';
import { useMidnight } from './hooks/useMidnight';
import { Sparkles } from 'lucide-react';

export function App() {
  const midnight = useMidnight();

  return (
    <Layout
      wallet={midnight.wallet}
      metrics={midnight.metrics}
      onConnectWallet={midnight.connectWallet}
      onDisconnectWallet={midnight.disconnectWallet}
    >
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Zero-Knowledge Public Services Verification on Midnight Network</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Prove Eligibility.{' '}
          <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            Protect Your Data.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Authorize with your Midnight Lace Wallet, then prove income, age, and academic qualifications
          for scholarships and welfare programs via real ZK proofs — without disclosing any sensitive documents.
        </p>
      </div>

      <EligibilityVerifier midnight={midnight} />
    </Layout>
  );
}

export default App;
