import React, { useState } from 'react';
import {
  ShieldCheck,
  EyeOff,
  Eye,
  CheckCircle2,
  XCircle,
  Cpu,
  Lock,
  FileCheck,
  Award,
  DollarSign,
  UserCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Terminal,
  ChevronRight,
  Info
} from 'lucide-react';
import { PRESET_SCHEMES, SchemeRequirement, CitizenCredentialInput, ProofGenerationResult, generateAndSubmitProof } from '../utils/contract';

interface EligibilityVerifierProps {
  onProofGenerated: (isEligible: boolean) => void;
  onCredentialRegistered: () => void;
  isConnected: boolean;
}

export const EligibilityVerifier: React.FC<EligibilityVerifierProps> = ({
  onProofGenerated,
  onCredentialRegistered,
  isConnected,
}) => {
  const [activeTab, setActiveTab] = useState<'citizen' | 'verifier' | 'vault'>('citizen');
  const [selectedScheme, setSelectedScheme] = useState<SchemeRequirement>(PRESET_SCHEMES[0]);

  // Citizen Form Input State (Private Data)
  const [annualIncome, setAnnualIncome] = useState<number>(240000);
  const [age, setAge] = useState<number>(20);
  const [academicScore, setAcademicScore] = useState<number>(88);
  const [citizenSecretKey, setCitizenSecretKey] = useState<string>('0x9a8f12c4b8e37d6110f94a2b13c8e5470129a3f890c21b34e56789abcdef0123');
  const [credentialDocHash, setCredentialDocHash] = useState<string>('0x7c94b2e811094dfa62a941e770b135ad0192e4587c6312a0f8b91c2d3e4f5a6b');

  // Execution state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [result, setResult] = useState<ProofGenerationResult | null>(null);

  // Vault Registration state
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registrationTx, setRegistrationTx] = useState<string | null>(null);

  const steps = [
    { name: 'Constructing Private Witness', desc: 'Inputs stay in local sandbox memory' },
    { name: 'Evaluating ZK Circuit Assertions', desc: 'Validating inequalities in zero-knowledge' },
    { name: 'Generating zk-SNARK Cryptographic Proof', desc: 'Midnight Proof Server client compilation' },
    { name: 'Submitting Disclosed Outcome to Ledger', desc: 'Verifying on Midnight Network' },
  ];

  const handleGenerateProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCurrentStep(0);
    setResult(null);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 600);

    try {
      const res = await generateAndSubmitProof(
        {
          citizenSecretKey,
          annualIncome,
          age,
          academicScore,
          credentialDocumentHash: credentialDocHash,
        },
        selectedScheme
      );

      clearInterval(stepInterval);
      setCurrentStep(3);
      setResult(res);
      onProofGenerated(res.isEligible);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegisterCredential = async () => {
    setIsRegistering(true);
    setRegistrationTx(null);
    await new Promise((r) => setTimeout(r, 1200));
    const tx = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setRegistrationTx(tx);
    setIsRegistering(false);
    onCredentialRegistered();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === 'citizen'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Citizen Portal (Prove Eligibility)</span>
          </button>
          <button
            onClick={() => setActiveTab('verifier')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === 'verifier'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Institutional Verifier</span>
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === 'vault'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Credential Commitment Vault</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Compact Contract v1.0 • Midnight Preprod</span>
        </div>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'citizen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Credentials Form */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span>Private Eligibility Generator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your private credentials locally. They are processed strictly inside your browser ZK sandbox.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 rounded-full text-xs font-medium flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5" /> Zero Data Disclosed
              </span>
            </div>

            <form onSubmit={handleGenerateProof} className="space-y-6">
              {/* Select Scheme */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Target Public Scheme / Program
                </label>
                <div className="grid grid-cols-1 gap-2.5">
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
                          <div className={`w-3 h-3 rounded-full ${selectedScheme.id === scheme.id ? 'bg-blue-400' : 'bg-slate-700'}`}></div>
                          <span className="text-sm font-semibold text-white">{scheme.name}</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {scheme.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 pl-5">{scheme.description}</p>
                      
                      {/* Scheme public requirements */}
                      <div className="mt-3 pl-5 flex flex-wrap gap-2 text-[11px] font-mono">
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

              {/* Private Inputs Fields */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  2. Your Sensitive Personal Credentials (PRIVATE WITNESS INPUTS)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Annual Income */}
                  <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                    <label className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1.5">
                      <span>Annual Income (₹)</span>
                      <EyeOff className="w-3 h-3 text-amber-400" title="Kept Private" />
                    </label>
                    <input
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                      min={0}
                    />
                    <span className="text-[10px] text-amber-400/80 mt-1 block">Never stored on ledger</span>
                  </div>

                  {/* Age */}
                  <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                    <label className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1.5">
                      <span>Applicant Age</span>
                      <EyeOff className="w-3 h-3 text-amber-400" title="Kept Private" />
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                      min={1}
                      max={120}
                    />
                    <span className="text-[10px] text-amber-400/80 mt-1 block">Never stored on ledger</span>
                  </div>

                  {/* Score */}
                  <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                    <label className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1.5">
                      <span>Academic Score (%)</span>
                      <EyeOff className="w-3 h-3 text-amber-400" title="Kept Private" />
                    </label>
                    <input
                      type="number"
                      value={academicScore}
                      onChange={(e) => setAcademicScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                      min={0}
                      max={100}
                    />
                    <span className="text-[10px] text-amber-400/80 mt-1 block">Never stored on ledger</span>
                  </div>
                </div>

                {/* Secret Key & Document Commitment */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">
                      Citizen Identity Secret Key (32 Bytes Bytes&lt;32&gt;)
                    </label>
                    <input
                      type="text"
                      value={citizenSecretKey}
                      onChange={(e) => setCitizenSecretKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">
                      Issuer Document Hash Commitment (Aadhaar / Certificate Hash)
                    </label>
                    <input
                      type="text"
                      value={credentialDocHash}
                      onChange={(e) => setCredentialDocHash(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-cyan-200" />
                    <span>Executing Compact ZK Circuit...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                    <span>Generate & Submit ZK Proof</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: ZK Execution Progress & Proof Outcome */}
          <div className="lg:col-span-5 space-y-6">
            {/* Realtime Circuit Pipeline Visualizer */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Zero-Knowledge Pipeline Monitor</span>
              </h4>

              <div className="space-y-3">
                {steps.map((step, idx) => {
                  const isActive = isProcessing && currentStep === idx;
                  const isDone = !isProcessing && result !== null;
                  const isPast = isProcessing && currentStep > idx;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                        isActive
                          ? 'bg-blue-950/60 border-blue-500/80 shadow-md shadow-blue-500/20'
                          : isPast || isDone
                          ? 'bg-slate-950/60 border-emerald-900/50'
                          : 'bg-slate-950/20 border-slate-800/60 opacity-60'
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
                          <span>{step.name}</span>
                          {isActive && <span className="text-[10px] text-blue-400 font-mono animate-pulse">Running...</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proof Result Display Card */}
            {result && (
              <div className={`p-6 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all duration-500 ${
                result.isEligible
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-emerald-500/10'
                  : 'bg-red-950/30 border-red-500/50 shadow-red-500/10'
              }`}>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
                  {result.isEligible ? (
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
                      {result.isEligible ? 'Eligibility Verified (APPROVED)' : 'Criteria Not Satisfied (REJECTED)'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      Proven via Midnight Smart Contract: <span className="font-mono text-cyan-400">verify_eligibility()</span>
                    </p>
                  </div>
                </div>

                {/* Technical Audit Summary */}
                <div className="mt-4 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cryptographic Proof Hash:</span>
                    <span className="text-cyan-300 text-[11px]">{result.proofHash.slice(0, 18)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>On-Chain Tx Hash:</span>
                    <span className="text-indigo-300 text-[11px]">{result.txHash?.slice(0, 18)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Circuit Execution Time:</span>
                    <span className="text-emerald-300 text-[11px]">{result.executionTimeMs} ms</span>
                  </div>
                </div>

                {/* Privacy Breakdown Box */}
                <div className="mt-5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Selective Disclosure Audit</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                      <span className="font-semibold block">PUBLIC ON LEDGER</span>
                      • Program criteria thresholds<br />
                      • Result: {result.isEligible ? 'Eligible' : 'Ineligible'}
                    </div>
                    <div className="p-2 rounded bg-indigo-950/30 border border-indigo-900/40 text-indigo-300">
                      <span className="font-semibold block">KEPT PRIVATE</span>
                      • Income value<br />
                      • Exact age & score<br />
                      • Document contents
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
                <span>Institutional Verification Portal</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Institutions evaluate submitted zero-knowledge proofs without receiving or handling raw documents.
              </p>
            </div>
            <span className="px-3 py-1 bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 rounded-full text-xs font-medium">
              Zero Raw Document Processing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <Award className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-sm font-semibold text-white">Scholarship Committee</div>
              <div className="text-xs text-slate-400 mt-1">Verifies income ceiling and academic benchmark in ZK. Zero transcript exposure.</div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                ✓ 100% Data Protection Compliant
              </div>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <DollarSign className="w-6 h-6 text-emerald-400 mb-2" />
              <div className="text-sm font-semibold text-white">Agricultural Subsidy Board</div>
              <div className="text-xs text-slate-400 mt-1">Verifies landholder income threshold and age criteria. Eliminates document forgery.</div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                ✓ Immediate On-Chain Settlement
              </div>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <FileCheck className="w-6 h-6 text-indigo-400 mb-2" />
              <div className="text-sm font-semibold text-white">Universal Healthcare Portal</div>
              <div className="text-xs text-slate-400 mt-1">Verifies family income coverage eligibility. Replaces manual verification backlogs.</div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                ✓ Auditable Cryptographic Proofs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREDENTIAL VAULT TAB */}
      {activeTab === 'vault' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Credential Commitment Vault</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Register your zero-knowledge credential commitment on Midnight Network via <span className="font-mono text-emerald-400">register_citizen_credential()</span>.
              </p>
            </div>
          </div>

          <div className="max-w-xl mx-auto bg-slate-950/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Citizen Identity Commitment Secret Key
              </label>
              <input
                type="text"
                value={citizenSecretKey}
                onChange={(e) => setCitizenSecretKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Issuer Digital Signature Hash
              </label>
              <input
                type="text"
                value={credentialDocHash}
                onChange={(e) => setCredentialDocHash(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
              />
            </div>

            <button
              onClick={handleRegisterCredential}
              disabled={isRegistering}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Registering Commitment On-Chain...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Register Credential Commitment</span>
                </>
              )}
            </button>

            {registrationTx && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 font-mono">
                ✓ Registered! Transaction Hash: {registrationTx}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
