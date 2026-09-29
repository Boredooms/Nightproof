# NightProof — User & Operational Guide (`USERS.md`)

Welcome to **NightProof**, a privacy-preserving public service eligibility verification platform built on the **Midnight Network** utilizing Zero-Knowledge Proofs (ZKPs) and Compact smart contracts.

---

## 🌟 Quick Overview

NightProof allows citizens to prove eligibility for government welfare programs, educational scholarships, healthcare subsidies, and agricultural grants **without revealing sensitive personal details** like exact annual income, age, academic transcripts, or identity numbers.

| User Role | Responsibilities & Capabilities |
| :--- | :--- |
| 🧑‍🦱 **Citizen / Applicant** | Connects Midnight Lace Wallet, inputs private credential details into browser ZK sandbox, generates off-chain ZK proofs, and submits disclosed eligibility outcomes to Midnight testnet. |
| 🏛️ **Institutional Verifier** | Inspects auditable cryptographic proof outcomes on-chain without receiving or storing any raw documents or personal data. |
| 🔐 **Credential Vault Manager** | Registers citizen credential commitments on the Midnight ledger via `register_citizen_credential()` circuit. |

---

## 🚀 Step-by-Step User Instructions

### 1. Prerequisite Setup
1. Install the **Midnight Lace Wallet extension** from [midnight.network/lace](https://midnight.network/lace).
2. Set your Lace wallet network to **Midnight Preview Testnet**.
3. Fund your wallet with testnet tokens (tDUST) using the Midnight Preview faucet.

### 2. Connecting Wallet
1. Open the NightProof application.
2. Click **Connect Midnight Lace Wallet** in the top right header.
3. Accept the authorization request in your Lace wallet popup window.

### 3. Verifying Eligibility (Citizen Portal)
1. Select a program scheme (e.g., *National Higher Education Scholarship*, *Agricultural Fertilizer Subsidy*, or *Universal Healthcare Assistance*).
2. Enter your private credential inputs:
   - **Annual Income (₹)**
   - **Age (years)**
   - **Academic Score (%)**
   - **Citizen Identity Secret Key** (`Bytes<32>`)
   - **Issuer Document Hash** (SHA-256 hash of document)
3. Click **Generate ZK Proof via Midnight Lace**.
4. Enter your Lace wallet password in the wallet popup window to sign the proof payload.
5. Watch the **Zero-Knowledge Pipeline Monitor** evaluate circuit inequalities off-chain and output your auditable ZK proof result.

### 4. Registering Credential Commitments (Vault Portal)
1. Navigate to the **Credential Vault** tab.
2. Enter your secret key and document hash.
3. Click **Register Credential Commitment** to invoke the `register_citizen_credential()` Compact circuit on-chain.

---

## 🛡️ Privacy & Security Guarantees

* **Zero Data Leakage**: Sensitive inputs never leave your browser sandbox.
* **On-Chain Auditability**: Only the boolean eligibility outcome (`disclose(is_eligible)`) hits the ledger.
* **Tamper-Proof Verification**: ZK circuits enforce program thresholds mathematically.
