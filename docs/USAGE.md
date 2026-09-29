# How to Use NightProof

Welcome to **NightProof** — the privacy-first eligibility verification platform powered by the Midnight Network. This guide explains how citizens and institutions can verify eligibility for government schemes, scholarships, and welfare programs without exposing sensitive personal documents.

---

## What You Need

Before getting started, make sure you have:
1. **Node.js (v22+)** and **npm** installed on your computer (for local execution).
2. **Lace Wallet Extension** (configured for Midnight Preprod network with testnet tDUST).
3. **Your Private Credentials** (Family annual income, age, academic scores, and identity commitment key).

---

## Step-by-Step Guide

### 1. Connect Your Midnight Wallet
- Open the NightProof application in your browser.
- Click the **Connect Midnight Wallet** button at the top right of the navigation header.
- Approve the connection request in your Lace Wallet popup.

### 2. Register Your Credential Commitment (Vault)
- Navigate to the **Credential Commitment Vault** tab.
- Enter your 32-byte citizen identity key and document hash commitment.
- Click **Register Credential Commitment** to invoke the `register_citizen_credential()` circuit on Midnight Network.
- Your identity commitment is stored on-chain without exposing any of your personal details.

### 3. Generate a Private Eligibility Proof (Citizen Portal)
- Go to the **Citizen Portal (Prove Eligibility)** tab.
- Select the program or scholarship you wish to apply for (e.g. *National Higher Education Scholarship*).
- Fill in your sensitive personal credentials:
  - **Annual Income (₹)**
  - **Applicant Age**
  - **Academic Score (%)**
- Click **Generate & Submit ZK Proof**.
- NightProof builds a zero-knowledge witness locally inside your browser sandbox and evaluates program inequalities (`income <= threshold`, `age >= min_age`, `score >= min_score`).
- The Midnight Compact smart contract verifies the proof on-chain via `verify_eligibility()`.

### 4. Review Institutional Verification Outcome
- Switch to the **Institutional Verifier** tab to view the verified audit outcome.
- Verifying institutions see only an auditable **APPROVED (Eligible)** or **REJECTED (Ineligible)** result along with the cryptographic proof hash and transaction ID.
- No documents are shared, uploaded, or leaked!

---

## What Gets Proved (and What Stays Private)

| Data Field | Status on Midnight Ledger | Visible to Institutions? |
| :--- | :--- | :--- |
| **Annual Family Income** | 🔒 **PRIVATE WITNESS** | ❌ Never Disclosed |
| **Applicant Age** | 🔒 **PRIVATE WITNESS** | ❌ Never Disclosed |
| **Academic Marks / Transcripts** | 🔒 **PRIVATE WITNESS** | ❌ Never Disclosed |
| **Citizen Secret Key / Aadhaar** | 🔒 **PRIVATE WITNESS** | ❌ Never Disclosed |
| **Document Credential Hash** | 🔒 **PRIVATE WITNESS** | ❌ Never Disclosed |
| **Scheme Criteria Thresholds** | 🌐 **PUBLIC LEDGER** | ✅ Yes (Verifiable Public Inputs) |
| **Eligibility Result (Yes/No)** | 🌐 **PUBLIC LEDGER** | ✅ Yes (Disclosed Boolean Only) |
| **Audit Cryptographic Proof** | 🌐 **PUBLIC LEDGER** | ✅ Yes (Auditable zk-SNARK) |

---

## Troubleshooting

### Q: Why is my proof generation failing?
- Make sure your citizen secret key and credential document hash are non-zero hex strings.
- Verify that your Lace Wallet is connected to the **Midnight Preprod** testnet.

### Q: Does the government or scholarship portal see my actual income?
- **No.** Midnight Compact smart contracts process inequalities inside client-side zero-knowledge circuits. The institution receives only a verified mathematical proof that your income satisfies the criteria without revealing the number.

### Q: How do I request testnet tDUST tokens?
- Visit the official Midnight Testnet Faucet at `https://faucet.midnight.network` and paste your Bech32 wallet address.
