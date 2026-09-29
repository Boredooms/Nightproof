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
}

export const EligibilityVerifier: React.FC<EligibilityVerifierProps> = ({ midnight }) => {
  const { wallet, proof, connectWallet, verifyEligibility, registerCredential, resetProof } = midnight;

  const [activeTab, setActiveTab] = useState<'citizen' | 'verifier' | 'vault'>('citizen');
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
        <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-slate-900/90 border border-blue-700/60 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/60 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Midnight Lace Wallet Required
                <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded bg-blue-900 text-blue-300 font-mono">Preview</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Click <strong>Connect Midnight Lace Wallet</strong> above to authorize — a popup will open asking for your wallet password.
                Then you can generate real ZK proofs signed by your Midnight wallet.
              </p>
            </div>
          </div>
          <button
            onClick={connectWallet}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all shadow-xl whitespace-nowrap active:scale-95"
          >
            Connect Lace Wallet
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 flex-wrap">
          {(['citizen', 'verifier', 'vault'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetProof(); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab === 'citizen' && <Lock className="w-4 h-4" />}
              {tab === 'verifier' && <ShieldCheck className="w-4 h-4" />}
              {tab === 'vault' && <UserCheck className="w-4 h-4" />}
              <span className="capitalize">{tab === 'citizen' ? 'Citizen Portal' : tab === 'verifier' ? 'Institutional Verifier' : 'Credential Vault'}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
          <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>NightProof Compact • Midnight Preview</span>
        </div>
      </div>

      {/* CITIZEN PORTAL TAB */}
      {activeTab === 'citizen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Form */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  Private Eligibility Generator
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Private credentials stay in your browser ZK sandbox. Only an eligibility boolean hits the Midnight ledger.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 rounded-full text-xs font-medium flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5" /> Zero Data Disclosed
              </span>
            </div>

            <form onSubmit={handleGenerateProof} className="space-y-6">
              {/* Scheme Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Program / Scheme
                </label>
                <div className="space-y-2.5">
                  {PRESET_SCHEMES.map((scheme) => (
                    <div
                      key={scheme.id}
                      onClick={() => setSelectedScheme(scheme)}
                      className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 ${
                        selectedScheme.id === scheme.id
                          ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-500/10'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-3 h-3 rounded-full ${selectedScheme.id === scheme.id ? 'bg-blue-400' : 'bg-slate-700'}`} />
                          <span className="text-sm font-semibold text-white">{scheme.name}</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{scheme.category}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 pl-5">{scheme.description}</p>
                      <div className="mt-2 pl-5 flex flex-wrap gap-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          Max Income: ₹{Number(scheme.maxIncomeThreshold).toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          Min Age: {scheme.minAgeRequired.toString()} yrs
                        </span>
                        {scheme.minScoreRequired > 0n && (
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            Min Score: {scheme.minScoreRequired.toString()}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Private Witness Inputs */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  2. Private Credential Inputs (WITNESS — never leave browser)
                </label>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Annual Income (₹)', value: annualIncome, setter: setAnnualIncome, min: 0 },
                    { label: 'Age (years)', value: age, setter: setAge, min: 1, max: 120 },
                    { label: 'Academic Score (%)', value: academicScore, setter: setAcademicScore, min: 0, max: 100 },
                  ].map(({ label, value, setter, min, max }) => (
                    <div key={label} className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                      <label className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1.5">
                        <span>{label}</span>
                        <EyeOff className="w-3 h-3 text-amber-400" />
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setter(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                        min={min}
                        max={max}
                      />
                      <span className="text-[10px] text-amber-400/80 mt-1 block">Never stored on ledger</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400 flex items-center gap-1">
                      <Key className="w-3 h-3 text-indigo-400" /> Citizen Identity Secret Key (Bytes&lt;32&gt; private witness)
                    </label>
                    <button
                      type="button"
                      onClick={() => setCitizenSecretKey(generateRandomHex32())}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                      title="Generate random 32-byte secret key"
                    >
                      🎲 Randomize
                    </button>
                  </div>
                  <input
                    type="text"
                    value={citizenSecretKey}
                    onChange={(e) => setCitizenSecretKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-indigo-400" /> Issuer Document Hash (Aadhaar / Certificate SHA-256)
                    </label>
                    <button
                      type="button"
                      onClick={() => setCredentialDocHash(generateRandomHex32())}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                      title="Generate random document SHA-256 hash"
                    >
                      🎲 Randomize
                    </button>
                  </div>
                  <input
                    type="text"
                    value={credentialDocHash}
                    onChange={(e) => setCredentialDocHash(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                    placeholder="0x..."
                  />
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                id="generate-zk-proof-btn"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-cyan-200" />
                    <span>{proof.currentStep || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-cyan-300" />
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
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <Cpu className="w-4 h-4 text-cyan-400" />
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
                          ? 'bg-blue-950/60 border-blue-500/80 shadow-md shadow-blue-500/20'
                          : isPast || isDone
                          ? 'bg-slate-950/60 border-emerald-900/50'
                          : 'bg-slate-950/20 border-slate-800/60 opacity-50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isPast || isDone ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isActive ? (
                          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-400">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-mono">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white flex items-center justify-between">
                          <span className="truncate">{step}</span>
                          {isActive && <span className="text-[10px] text-blue-400 font-mono animate-pulse ml-1">Running...</span>}
                        </div>
                        {idx === 1 && isActive && (
                          <div className="text-[11px] text-amber-300 mt-0.5 animate-pulse">
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
                <div className="mt-4 p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-xs text-red-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{proof.error}</span>
                </div>
              )}
            </div>

            {/* Proof Result Card */}
            {proof.result && (proof.status === 'verified' || proof.status === 'rejected') && (
              <div className={`p-6 rounded-3xl border backdrop-blur-xl shadow-2xl ${
                proof.result.isEligible
                  ? 'bg-emerald-950/30 border-emerald-500/50'
                  : 'bg-red-950/30 border-red-500/50'
              }`}>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
                  {proof.result.isEligible ? (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {proof.result.isEligible ? 'Eligibility APPROVED' : 'Criteria Not Satisfied'}
                    </h4>
                    <p className="text-xs text-slate-300 font-mono">
                      <span className="text-cyan-400">verify_eligibility()</span> • Midnight Preview
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>ZK Proof Hash:</span>
                    <span className="text-cyan-300">{proof.result.proofHash.slice(0, 20)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Transaction Hash:</span>
                    <span className="text-indigo-300">{proof.result.txHash.slice(0, 20)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Execution Time:</span>
                    <span className="text-emerald-300">{proof.result.executionTimeMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Contract:</span>
                    <span className="text-slate-300 text-[11px]">
                      {proof.result.contractAddress !== '[DEPLOY CONTRACT FIRST — paste address here]'
                        ? truncate(proof.result.contractAddress, 10, 6)
                        : 'Pending deploy'}
                    </span>
                  </div>
                </div>

                {/* Explorer Link & Off-chain notice */}
                {proof.result.contractAddress.includes('DEPLOY CONTRACT FIRST') ? (
                  <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-[11px] text-indigo-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Off-Chain ZK Proof Verified (Lace Signed)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      This ZK proof was cryptographically signed via your Lace wallet. To broadcast & index live on-chain TX blocks on Night Scan explorer, deploy contract bytecode via <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">npm run deploy</code>.
                    </p>
                    <a
                      href={proof.result.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium pt-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Midnight Preview Block Explorer ↗</span>
                    </a>
                  </div>
                ) : (
                  <a
                    href={proof.result.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Transaction on Night Scan Explorer</span>
                  </a>
                )}

                {/* Privacy Breakdown */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Selective Disclosure Audit
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                      <span className="font-semibold block">PUBLIC ON LEDGER</span>
                      • Scheme thresholds<br />
                      • Result: {proof.result.isEligible ? 'Eligible' : 'Ineligible'}
                    </div>
                    <div className="p-2 rounded bg-indigo-950/30 border border-indigo-900/40 text-indigo-300">
                      <span className="font-semibold block">KEPT PRIVATE</span>
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
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Institutional Verification Portal
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Institutions receive only ZK proof outcomes — no raw documents or personal data ever transmitted.
              </p>
            </div>
            <span className="px-3 py-1 bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 rounded-full text-xs">
              Zero Document Handling
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: Award, color: 'text-blue-400', title: 'Scholarship Committee', desc: 'Verifies income & academic benchmarks in ZK. Zero transcript exposure.' },
              { Icon: DollarSign, color: 'text-emerald-400', title: 'Agricultural Subsidy Board', desc: 'Verifies income threshold and age criteria. Eliminates document forgery.' },
              { Icon: FileCheck, color: 'text-indigo-400', title: 'Healthcare Portal', desc: 'Verifies income coverage eligibility. Replaces manual verification backlogs.' },
            ].map(({ Icon, color, title, desc }) => (
              <div key={title} className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <Icon className={`w-6 h-6 ${color} mb-2`} />
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-slate-400 mt-1">{desc}</div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                  ✓ Auditable Cryptographic Proofs
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREDENTIAL VAULT TAB */}
      {activeTab === 'vault' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="pb-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              Credential Commitment Vault
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Register your credential commitment on Midnight Network via{' '}
              <span className="font-mono text-emerald-400">register_citizen_credential()</span>.
              Requires Lace wallet authorization.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-slate-950/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Citizen Identity Secret Key</label>
                <button
                  type="button"
                  onClick={() => setCitizenSecretKey(generateRandomHex32())}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                >
                  🎲 Randomize
                </button>
              </div>
              <input
                type="text"
                value={citizenSecretKey}
                onChange={(e) => setCitizenSecretKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Issuer Document Hash</label>
                <button
                  type="button"
                  onClick={() => setCredentialDocHash(generateRandomHex32())}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                >
                  🎲 Randomize
                </button>
              </div>
              <input
                type="text"
                value={credentialDocHash}
                onChange={(e) => setCredentialDocHash(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
              />
            </div>

            <button
              onClick={() => {
                if (wallet.status !== 'connected') { connectWallet(); return; }
                registerCredential(citizenSecretKey, credentialDocHash);
              }}
              disabled={proof.status === 'signing' || proof.status === 'generating'}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {proof.status === 'signing' || proof.status === 'generating' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing in Lace Wallet...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {wallet.status !== 'connected'
                      ? 'Connect Wallet to Register'
                      : 'Register Credential Commitment'}
                  </span>
                </>
              )}
            </button>

            {proof.result && proof.status === 'verified' && activeTab === 'vault' && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 font-mono space-y-1">
                <div>✓ Registered on Midnight Preview!</div>
                <div className="truncate">TX: {proof.result.txHash}</div>
                <a
                  href={proof.result.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 mt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View on Explorer</span>
                </a>
              </div>
            )}

            {proof.status === 'error' && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">
                {proof.error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
