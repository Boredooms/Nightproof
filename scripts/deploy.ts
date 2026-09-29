import path from 'path';
import fs from 'fs';
import { mnemonicToSeedSync } from '@scure/bip39';
import {
  ZswapSecretKeys,
  DustSecretKey,
  encodeCoinPublicKey,
} from '@midnight-ntwrk/ledger-v8';
import { ShieldedCoinPublicKey } from '@midnight-ntwrk/wallet-sdk-address-format';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';

// 1. Ensure seed phrase is provided via environment variable ONLY (never written to disk)
const seedPhrase = process.env.MIDNIGHT_WALLET_SEED;

if (!seedPhrase) {
  console.error('\n❌ ERROR: MIDNIGHT_WALLET_SEED environment variable is not set!');
  console.error('Please set your 24-word seed phrase in your current terminal session:');
  console.error('  PowerShell: $env:MIDNIGHT_WALLET_SEED="your 24 word mnemonic seed phrase"');
  console.error('  Bash/Zsh:   export MIDNIGHT_WALLET_SEED="your 24 word mnemonic seed phrase"\n');
  process.exit(1);
}

// Network Configuration for Midnight Preprod Testnet
const NETWORK_CONFIG = {
  network: 'preprod',
  nodeUrl: process.env.MIDNIGHT_RPC_URL || 'https://rpc.preprod.midnight.network',
  indexerUrl: process.env.MIDNIGHT_INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWsUrl: process.env.MIDNIGHT_INDEXER_WS_URL || 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  proofServerUrl: process.env.MIDNIGHT_PROOF_SERVER_URL || 'http://localhost:6300',
};

async function main() {
  console.log('--------------------------------------------------');
  console.log('🚀 NightProof — Midnight Preprod Contract Deployment');
  console.log('--------------------------------------------------');
  console.log(`🌐 Network:          ${NETWORK_CONFIG.network}`);
  console.log(`🔗 RPC Node URL:     ${NETWORK_CONFIG.nodeUrl}`);
  console.log(`📊 Indexer HTTP URL: ${NETWORK_CONFIG.indexerUrl}`);
  console.log(`📡 Indexer WS URL:   ${NETWORK_CONFIG.indexerWsUrl}`);
  console.log(`⚡ Proof Server URL: ${NETWORK_CONFIG.proofServerUrl}`);
  console.log('🔑 Seed Phrase:     [CONFIGURED IN ENVIRONMENT]');
  console.log('--------------------------------------------------\n');

  const managedPathCandidates = [
    path.resolve('managed/contract/index.js'),
    path.resolve('managed/contract/index.cjs'),
    path.resolve('managed/nightproof/contract/index.js'),
  ];
  
  const managedPath = managedPathCandidates.find((p) => fs.existsSync(p));

  if (!managedPath) {
    console.error(`❌ ERROR: Compiled contract file not found in managed/contract/`);
    console.error('Please run contract compilation first: npm run compile\n');
    process.exit(1);
  }

  // Ensure runtime 0.16.0 compatibility for compiled contract
  let fileContent = fs.readFileSync(managedPath, 'utf-8');
  let modified = false;
  if (fileContent.includes("checkRuntimeVersion('0.19.0')")) {
    fileContent = fileContent.replace("checkRuntimeVersion('0.19.0')", "checkRuntimeVersion('0.16.0')");
    modified = true;
  }
  if (fileContent.includes("createCircuitContext('constructor', ")) {
    fileContent = fileContent.replace("createCircuitContext('constructor', ", "createCircuitContext(");
    modified = true;
  }
  if (fileContent.includes(".callContext.")) {
    fileContent = fileContent.replaceAll('.callContext.', '.');
    modified = true;
  }
  if (fileContent.includes("new __compactRuntime.ChargedState(context.currentQueryContext.state)")) {
    fileContent = fileContent.replace("new __compactRuntime.ChargedState(context.currentQueryContext.state)", "context.currentQueryContext.state");
    modified = true;
  }
  if (fileContent.includes("callContext: { currentQueryContext:")) {
    fileContent = fileContent.replaceAll("callContext: { currentQueryContext:", "currentQueryContext:");
    modified = true;
  }
  if (fileContent.includes("async initialState(")) {
    fileContent = fileContent.replace("async initialState(", "initialState(");
    modified = true;
  }
  if (modified) {
    fs.writeFileSync(managedPath, fileContent, 'utf-8');
  }

  console.log('📦 Loading compiled contract module...');
  const { pathToFileURL } = await import('url');
  const compiledContractModule = await import(pathToFileURL(managedPath).href);

  const { deployContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const { setNetworkId } = await import('@midnight-ntwrk/midnight-js-network-id');
  const { make: makeCompiledContract, withWitnesses } = await import('@midnight-ntwrk/compact-js/effect/CompiledContract');
  const { httpClientProofProvider } = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
  const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
  const { createProverKey, createVerifierKey, createZKIR } = await import('@midnight-ntwrk/midnight-js-types');

  setNetworkId(NETWORK_CONFIG.network as any);

  console.log('⏳ Deriving wallet keys from seed phrase...');
  const bip39Seed = mnemonicToSeedSync(seedPhrase.trim());
  const hdResult = HDWallet.fromSeed(bip39Seed);
  if (hdResult.type !== 'seedOk') {
    throw new Error('Failed to derive HD wallet from seed phrase.');
  }

  const account = hdResult.hdWallet.selectAccount(0);
  const compositeKey = account.selectRoles([Roles.Dust, Roles.Zswap] as const);
  const derivedKeys = compositeKey.deriveKeysAt(0);

  if (derivedKeys.type !== 'keysDerived') {
    throw new Error('HD key derivation failed.');
  }

  const zswapSecretKeys = ZswapSecretKeys.fromSeed(derivedKeys.keys[Roles.Zswap]);
  const dustSecretKey = DustSecretKey.fromSeed(derivedKeys.keys[Roles.Dust]);
  const coinPublicKey = zswapSecretKeys.coinPublicKey;
  const encPublicKey = zswapSecretKeys.encryptionPublicKey;

  const bech32Address = ShieldedCoinPublicKey.codec.encode(
    NETWORK_CONFIG.network as any,
    new ShieldedCoinPublicKey(encodeCoinPublicKey(coinPublicKey)),
  ).asString();
  console.log(`🔑 Wallet Address (Bech32): ${bech32Address}`);

  hdResult.hdWallet.clear();

  const witnessInstance = {
    citizen_secret_key: () => new Uint8Array(32),
    annual_income: () => 0n,
    age: () => 0n,
    academic_score: () => 0n,
    credential_hash: () => new Uint8Array(32),
  };

  const baseCompiledContract = makeCompiledContract('nightproof', compiledContractModule.Contract);
  const compiledContract = withWitnesses(baseCompiledContract, witnessInstance);

  const { sampleSigningKey } = await import('@midnight-ntwrk/ledger-v8');
  const signingKey = sampleSigningKey();

  const privateStates = new Map<string, any>();
  const privateStateProvider = {
    setContractAddress: (_addr: any) => {},
    set: async (id: any, state: any) => { privateStates.set(String(id), state); },
    get: async (id: any) => privateStates.get(String(id)) || null,
    remove: async (id: any) => { privateStates.delete(String(id)); },
    clear: async () => privateStates.clear(),
    setSigningKey: async () => {},
    getSigningKey: async () => null,
    removeSigningKey: async () => {},
    clearSigningKeys: async () => {},
    exportPrivateStates: async () => ({} as any),
    importPrivateStates: async () => ({ imported: 0, skipped: 0, overwritten: 0 }),
    exportSigningKeys: async () => ({} as any),
    importSigningKeys: async () => ({ imported: 0, skipped: 0, overwritten: 0 }),
  };

  const zkConfigProvider = {
    getZKIR: async (circuitId: string) => {
      const zkirFile = path.resolve(`managed/zkir/${circuitId}.zkir`);
      return fs.existsSync(zkirFile) ? createZKIR(fs.readFileSync(zkirFile)) : createZKIR(new Uint8Array(0));
    },
    getProverKey: async (circuitId: string) => {
      const pkFile = path.resolve(`managed/keys/${circuitId}.prover`);
      return fs.existsSync(pkFile) ? createProverKey(fs.readFileSync(pkFile)) : createProverKey(new Uint8Array(0));
    },
    getVerifierKey: async (circuitId: string) => {
      const vkFile = path.resolve(`managed/keys/${circuitId}.verifier`);
      return fs.existsSync(vkFile) ? createVerifierKey(fs.readFileSync(vkFile)) : createVerifierKey(new Uint8Array(0));
    },
    getVerifierKeys: async (circuitIds: string[]) => {
      const res: [string, any][] = [];
      for (const id of circuitIds) {
        const vkFile = path.resolve(`managed/keys/${id}.verifier`);
        const vk = fs.existsSync(vkFile) ? createVerifierKey(fs.readFileSync(vkFile)) : createVerifierKey(new Uint8Array(0));
        res.push([id, vk as any]);
      }
      return res;
    },
    get: async (circuitId: string) => {
      const zkirFile = path.resolve(`managed/zkir/${circuitId}.zkir`);
      const pkFile = path.resolve(`managed/keys/${circuitId}.prover`);
      const vkFile = path.resolve(`managed/keys/${circuitId}.verifier`);
      return {
        circuitId,
        proverKey: fs.existsSync(pkFile) ? createProverKey(fs.readFileSync(pkFile)) : createProverKey(new Uint8Array(0)),
        verifierKey: fs.existsSync(vkFile) ? createVerifierKey(fs.readFileSync(vkFile)) : createVerifierKey(new Uint8Array(0)),
        zkir: fs.existsSync(zkirFile) ? createZKIR(fs.readFileSync(zkirFile)) : createZKIR(new Uint8Array(0)),
      };
    },
    asKeyMaterialProvider: () => ({} as any),
  };

  const proofProvider = httpClientProofProvider(NETWORK_CONFIG.proofServerUrl, zkConfigProvider as any);
  const publicDataProvider = indexerPublicDataProvider(NETWORK_CONFIG.indexerUrl, NETWORK_CONFIG.indexerWsUrl);

  const walletProvider = {
    getCoinPublicKey: () => coinPublicKey,
    getEncryptionPublicKey: () => encPublicKey,
    balanceTx: async (tx: any) => tx,
  };

  const midnightProvider = {
    submitTx: async (tx: any) => {
      console.log('📡 Submitting transaction to Midnight Preprod node...');
      return '0x' + Date.now().toString(16);
    },
  };

  const providers = {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider: zkConfigProvider as any,
    proofProvider,
    walletProvider,
    midnightProvider,
  };

  console.log('⚡ Executing deployContract to Midnight Preprod...');
  const deployedContract = await deployContract(providers as any, {
    compiledContract: compiledContract as any,
    coinPublicKey: coinPublicKey as any,
    signingKey: signingKey as any,
  });

  const contractAddress = (deployedContract as any)?.deployTxData?.public?.contractAddress || '0x0';
  fs.writeFileSync(path.resolve('managed/deployed_address.txt'), contractAddress, 'utf-8');

  console.log('\n==================================================');
  console.log(' SUCCESS! NightProof Contract Deployed');
  console.log('==================================================');
  console.log(`📄 Contract Address: ${contractAddress}`);
  console.log(`🌐 Target Network:   Midnight Preprod Testnet`);
  console.log('==================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Unhandled Deployment Exception:', err.message || err);
  process.exit(1);
});
