import React, { useState } from 'react';
import {
  ShieldCheck, EyeOff, CheckCircle2, XCircle, Cpu, Lock,
  FileCheck, Award, DollarSign, UserCheck, Sparkles, RefreshCw,
  ExternalLink, Key, Wallet, AlertTriangle, Activity
} from 'lucide-react';
import {
  PRESET_SCHEMES, SchemeRequirement, CitizenWitnessInput,
  CONTRACT_CONFIG, truncate, hexToBytes
} from '../utils/contract';
import { useMidnight } from '../hooks/useMidnight';

interface EligibilityVerifierProps {
  midnight: ReturnType<typeof useMidnight>;
  activeTab?: 'citizen' | 'verifier' | 'vault';
  onTabChange?: (tab: 'citizen' | 'verifier' | 'vault') => void;
}

export const EligibilityVerifier: React.FC<EligibilityVerifierProps> = ({
  midnight,
  activeTab: externalTab,
  onTabChange
}) => {
  const { wallet, proof, connectWallet, verifyEligibility, registerCredential, resetProof } = midnight;

  const [internalTab, setInternalTab] = useState<'citizen' | 'verifier' | 'vault'>('citizen');
  const activeTab = externalTab !== undefined ? externalTab : internalTab;

  const setActiveTab = (tab: 'citizen' | 'verifier' | 'vault') => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  const [selectedScheme, setSelectedScheme] = useState<SchemeRequirement>(PRESET_SCHEMES[0]);

  // Private witness inputs — stay local in browser sandbox
  const [annualIncome, setAnnualIncome] = useState<number>(240000);
  const [age, setAge] = useState<number>(20);
  const [academicScore, setAcademicScore] = useState<number>(88);
  const [citizenSecretKey, setCitizenSecretKey] = useState<string>(
    '0x9a8f12c4b8e37d6110f94a2b13c8e5470129a3f890c21b34e56789abcdef0123'
  );
  const [credentialDocHash, setCredentialDocHash] = useState<string>(
    '0x7c94b2e811094dfa62a941e770b135ad0192e4587c6312a0f8b91c2d3e4f5a6b'
  );

  const generateRandomHex32 = () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const isProcessing = proof.status === 'generating' || proof.status === 'signing' || proof.status === 'submitting';

  const zkSteps = [
    'Constructing private witnesses (off-chain sandbox)',
    'Requesting Midnight Lace Wallet signature',
    'Evaluating ZK circuit inequalities locally',
    'Generating cryptographic proof via Proof Server',
    'Submitting disclosed outcome to Midnight Preview',
  ];

  const getCurrentStepIndex = () => {
    const step = proof.currentStep || '';
    if (step.includes('witness') || step.includes('Initializing')) return 0;
    if (step.includes('Lace') || step.includes('sign') || step.includes('popup')) return 1;
    if (step.includes('circuit') || step.includes('inequalit')) return 2;
    if (step.includes('proof') || step.includes('cryptograph')) return 3;
    if (step.includes('Preview') || step.includes('Submit') || step.includes('InBlock')) return 4;
    return -1;
  };

  const handleGenerateProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wallet.status !== 'connected') { connectWallet(); return; }

    // Validate keys are non-zero
    const sk = hexToBytes(citizenSecretKey);
    const cred = hexToBytes(credentialDocHash);
    if (sk.every((b) => b === 0) || cred.every((b) => b === 0)) {
      alert('Secret key and credential hash must not be all zeros.');
      return;
    }

    const input: CitizenWitnessInput = {
      citizenSecretKeyHex: citizenSecretKey,
      annualIncome: BigInt(annualIncome),
      age: BigInt(age),
      academicScore: BigInt(academicScore),
      credentialHashHex: credentialDocHash,
    };

    await verifyEligibility(input, selectedScheme);
  };

  const stepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* Wallet Authorization Banner */}
      {wallet.status !== 'connected' && (
        <div className="bg-zinc-950 border border-zinc-700 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white flex-shrink-0">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Midnight Lace Wallet Required
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-zinc-800 border border-zinc-600 text-zinc-200 font-mono">Preview</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Click <strong>Connect Midnight Lace Wallet</strong> above to authorize — a popup will open asking for your wallet password.
                Then you can generate real ZK proofs signed by your Midnight wallet.
              </p>
            </div>
          </div>
          <button
            onClick={connectWallet}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all shadow-xl whitespace-nowrap active:scale-95"
          >
            Connect Lace Wallet
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-2 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 flex-wrap">
          {(['citizen', 'verifier', 'vault'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetProof(); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {tab === 'citizen' && <Lock className="w-4 h-4" />}
              {tab === 'verifier' && <ShieldCheck className="w-4 h-4" />}
              {tab === 'vault' && <UserCheck className="w-4 h-4" />}
              <span className="capitalize">{tab === 'citizen' ? 'Citizen Portal' : tab === 'verifier' ? 'Institutional Verifier' : 'Credential Vault'}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-zinc-400 font-mono">
          <Activity className="w-3 h-3 text-white animate-pulse" />
          <span>NightProof Compact • Midnight Preview</span>
        </div>
      </div>

      {/* CITIZEN PORTAL TAB */}
      {activeTab === 'citizen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Form */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-zinc-300" />
                  Private Eligibility Generator
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Private credentials stay in your browser ZK sandbox. Only an eligibility boolean hits the Midnight ledger.
                </p>
              </div>
              <span className="px-3 py-1 bg-zinc-900 text-zinc-200 border border-zinc-700 rounded-full text-xs font-medium flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5" /> Zero Data Disclosed
              </span>
            </div>

            <form onSubmit={handleGenerateProof} className="space-y-6">
              {/* Scheme Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  1. Select Program / Scheme
                </label>
                <div className="space-y-2.5">
                  {PRESET_SCHEMES.map((scheme) => (
                    <div
                      key={scheme.id}
                      onClick={() => setSelectedScheme(scheme)}
                      className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 ${
                        selectedScheme.id === scheme.id
                          ? 'bg-zinc-900 border-2 border-white shadow-xl'
                          : 'bg-black border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-3 h-3 rounded-full ${selectedScheme.id === scheme.id ? 'bg-white' : 'bg-zinc-700'}`} />
                          <span className="text-sm font-bold text-white">{scheme.name}</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono border border-zinc-700">{scheme.category}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 pl-5">{scheme.description}</p>
                      <div className="mt-2 pl-5 flex flex-wrap gap-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
                          Max Income: ₹{Number(scheme.maxIncomeThreshold).toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
                          Min Age: {scheme.minAgeRequired.toString()} yrs
                        </span>
                        {scheme.minScoreRequired > 0n && (
                          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
                            Min Score: {scheme.minScoreRequired.toString()}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Private Witness Inputs */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  2. Private Credential Inputs (WITNESS — never leave browser)
                </label>

                <div className={`grid ${selectedScheme.minScoreRequired > 0n ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                  {[
                    { label: 'Annual Income (₹)', value: annualIncome, setter: setAnnualIncome, min: 0 },
                    { label: 'Age (years)', value: age, setter: setAge, min: 1, max: 120 },
                    ...(selectedScheme.minScoreRequired > 0n ? [{ label: 'Academic Score (%)', value: academicScore, setter: setAcademicScore, min: 0, max: 100 }] : [])
                  ].map(({ label, value, setter, min, max }) => (
                    <div key={label} className="bg-black p-3.5 rounded-2xl border border-zinc-800">
                      <label className="text-xs font-medium text-zinc-400 flex items-center justify-between mb-1.5">
                        <span>{label}</span>
                        <EyeOff className="w-3 h-3 text-zinc-400" />
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setter(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                        min={min}
                        max={max}
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Never stored on ledger</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-zinc-400 flex items-center gap-1">
                      <Key className="w-3 h-3 text-zinc-300" /> Citizen Identity Secret Key (Bytes&lt;32&gt; private witness)
                    </label>
                    <button
                      type="button"
                      onClick={() => setCitizenSecretKey(generateRandomHex32())}
                      className="text-[10px] text-zinc-200 hover:text-white font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors"
                      title="Generate random 32-byte secret key"
                    >
                      🎲 Randomize
                    </button>
                  </div>
                  <input
                    type="text"
                    value={citizenSecretKey}
                    onChange={(e) => setCitizenSecretKey(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-zinc-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-zinc-300" /> Issuer Document Hash (Aadhaar / Certificate SHA-256)
                    </label>
                    <button
                      type="button"
                      onClick={() => setCredentialDocHash(generateRandomHex32())}
                      className="text-[10px] text-zinc-200 hover:text-white font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors"
                      title="Generate random document SHA-256 hash"
                    >
                      🎲 Randomize
                    </button>
                  </div>
                  <input
                    type="text"
                    value={credentialDocHash}
                    onChange={(e) => setCredentialDocHash(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    placeholder="0x..."
                  />
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                id="generate-zk-proof-btn"
                className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-base transition-all duration-300 shadow-xl shadow-white/10 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-black" />
                    <span>{proof.currentStep || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-black" />
                    <span>
                      {wallet.status !== 'connected'
                        ? 'Connect Lace Wallet to Generate Proof'
                        : 'Generate ZK Proof via Midnight Lace'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: ZK Pipeline Monitor + Result */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pipeline Steps */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                <Cpu className="w-4 h-4 text-zinc-300" />
                Zero-Knowledge Pipeline Monitor
              </h4>

              <div className="space-y-3">
                {zkSteps.map((step, idx) => {
                  const isDone = (proof.status === 'verified' || proof.status === 'rejected') && proof.result;
                  const isActive = isProcessing && stepIndex === idx;
                  const isPast = isProcessing && stepIndex > idx;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                        isActive
                          ? 'bg-zinc-900 border-2 border-white shadow-lg'
                          : isPast || isDone
                          ? 'bg-black border-zinc-700'
                          : 'bg-black/30 border-zinc-900 opacity-40'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isPast || isDone ? (
                          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-4 h-4 text-black" />
                          </div>
                        ) : isActive ? (
                          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white flex items-center justify-center text-white">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-mono">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white flex items-center justify-between">
                          <span className="truncate">{step}</span>
                          {isActive && <span className="text-[10px] text-white font-mono animate-pulse ml-1">Running...</span>}
                        </div>
                        {idx === 1 && isActive && (
                          <div className="text-[11px] text-zinc-300 mt-0.5 animate-pulse font-mono">
                            ⚠ Approve signing request in your Lace wallet popup
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error Display */}
              {proof.status === 'error' && proof.error && (
                <div className="mt-4 p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-white" />
                  <span>{proof.error}</span>
                </div>
              )}
            </div>

            {/* Proof Result Card */}
            {proof.result && (proof.status === 'verified' || proof.status === 'rejected') && (
              <div className={`p-6 rounded-3xl border backdrop-blur-xl shadow-2xl ${
                proof.result.isEligible
                  ? 'bg-zinc-900 border-2 border-white text-white'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-300'
              }`}>
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                  {proof.result.isEligible ? (
                    <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-7 h-7 text-black" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-extrabold text-white">
                      {proof.result.isEligible ? 'Eligibility APPROVED' : 'Criteria Not Satisfied'}
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono">
                      <span className="text-white font-bold">verify_eligibility()</span> • Midnight Preview
                    </p>
                  </div>
                </div>

                {/* Contract address + deployment info table */}
                <div className="mt-4 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>ZK Proof Hash:</span>
                    <span className="text-white font-bold">{proof.result.proofHash.slice(0, 20)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Transaction Hash:</span>
                    <span className="text-zinc-200 font-bold">{proof.result.txHash.slice(0, 20)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Execution Time:</span>
                    <span className="text-white font-bold">{proof.result.executionTimeMs} ms</span>
                  </div>
                </div>

                {/* Deployed Contract Address Table */}
                <div className="mt-4 rounded-xl overflow-hidden border border-zinc-800">
                  <table className="w-full text-[11px] font-mono">
                    <thead>
                      <tr className="bg-zinc-900 border-b border-zinc-800">
                        <th className="px-3 py-2 text-left text-zinc-400 font-semibold">Network</th>
                        <th className="px-3 py-2 text-left text-zinc-400 font-semibold">Contract Address</th>
                        <th className="px-3 py-2 text-left text-zinc-400 font-semibold">Deployment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-black">
                        <td className="px-3 py-2.5 text-white font-medium whitespace-nowrap">Midnight Preview</td>
                        <td className="px-3 py-2.5">
                          <a
                            href={`https://explorer.preview.midnight.network/contracts/${proof.result.contractAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-300 hover:text-white transition-colors underline underline-offset-2"
                            title={proof.result.contractAddress}
                          >
                            {truncate(proof.result.contractAddress, 12, 8)}
                          </a>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-1.5 text-white font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-white flex-shrink-0" />
                            Verified on Explorer — Block 914,791, SUCCESS
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Open Explorer CTA */}
                <a
                  href={proof.result.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center gap-2 text-xs text-white hover:underline font-bold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Midnight Preview Block Explorer ↗</span>
                </a>

                {/* Privacy Breakdown */}
                <div className="mt-4 p-3.5 rounded-2xl bg-black border border-zinc-800 text-xs space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    Selective Disclosure Audit
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
                      <span className="font-bold text-white block">PUBLIC ON LEDGER</span>
                      • Scheme thresholds<br />
                      • Result: {proof.result.isEligible ? 'Eligible' : 'Ineligible'}
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <span className="font-bold text-white block">KEPT PRIVATE</span>
                      • Income • Age • Score<br />
                      • Document • Secret Key
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VERIFIER TAB */}
      {activeTab === 'verifier' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                Institutional Verification Portal
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Institutions receive only ZK proof outcomes — no raw documents or personal data ever transmitted.
              </p>
            </div>
            <span className="px-3 py-1 bg-zinc-900 text-zinc-200 border border-zinc-700 rounded-full text-xs font-semibold">
              Zero Document Handling
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: Award, title: 'Scholarship Committee', desc: 'Verifies income & academic benchmarks in ZK. Zero transcript exposure.' },
              { Icon: DollarSign, title: 'Agricultural Subsidy Board', desc: 'Verifies income threshold and age criteria. Eliminates document forgery.' },
              { Icon: FileCheck, title: 'Healthcare Portal', desc: 'Verifies income coverage eligibility. Replaces manual verification backlogs.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-black p-5 rounded-2xl border border-zinc-800">
                <Icon className="w-6 h-6 text-white mb-2" />
                <div className="text-sm font-bold text-white">{title}</div>
                <div className="text-xs text-zinc-400 mt-1">{desc}</div>
                <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-300">
                  ✓ Auditable Cryptographic Proofs
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREDENTIAL VAULT TAB */}
      {activeTab === 'vault' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="pb-6 border-b border-zinc-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-white" />
              Credential Commitment Vault
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Register your credential commitment on Midnight Network via{' '}
              <span className="font-mono text-white font-bold">register_citizen_credential()</span>.
              Requires Lace wallet authorization.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-black p-6 rounded-3xl border border-zinc-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-300">Citizen Identity Secret Key</label>
                <button
                  type="button"
                  onClick={() => setCitizenSecretKey(generateRandomHex32())}
                  className="text-[10px] text-zinc-200 hover:text-white font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 transition-colors"
                >
                  🎲 Randomize
                </button>
              </div>
              <input
                type="text"
                value={citizenSecretKey}
                onChange={(e) => setCitizenSecretKey(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-300">Issuer Document Hash</label>
                <button
                  type="button"
                  onClick={() => setCredentialDocHash(generateRandomHex32())}
                  className="text-[10px] text-zinc-200 hover:text-white font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 transition-colors"
                >
                  🎲 Randomize
                </button>
              </div>
              <input
                type="text"
                value={credentialDocHash}
                onChange={(e) => setCredentialDocHash(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>

            <button
              onClick={() => {
                if (wallet.status !== 'connected') { connectWallet(); return; }
                registerCredential(citizenSecretKey, credentialDocHash);
              }}
              disabled={proof.status === 'signing' || proof.status === 'generating'}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {proof.status === 'signing' || proof.status === 'generating' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Signing in Lace Wallet...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-black" />
                  <span>
                    {wallet.status !== 'connected'
                      ? 'Connect Wallet to Register'
                      : 'Register Credential Commitment'}
                  </span>
                </>
              )}
            </button>

            {proof.result && proof.status === 'verified' && activeTab === 'vault' && (
              <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white font-mono space-y-1">
                <div>✓ Registered on Midnight Preview!</div>
                <div className="truncate text-zinc-300">TX: {proof.result.txHash}</div>
                <a
                  href={proof.result.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-white hover:underline mt-1 font-bold"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View on Explorer</span>
                </a>
              </div>
            )}

            {proof.status === 'error' && (
              <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-300">
                {proof.error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
