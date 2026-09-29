# NightProof

![CI Pipeline](https://github.com/Boredooms/Nightproof/actions/workflows/ci.yml/badge.svg)

> **Tagline:** Privacy-first eligibility verification platform built on Midnight Network using Zero-Knowledge Proofs to verify citizens for scholarships, subsidies, and welfare without exposing sensitive personal documents.

---

## Live Demo
[Preprod demo URL — I will paste after deploying frontend]

---

## Contract Address
| Network | Address |
|---|---|
| Preprod | [ADDRESS — I will paste after deploy] |

---

## What This Product Does

Today, applicants applying for government welfare schemes, university scholarships, agricultural subsidies, and healthcare assistance are required to repeatedly upload copies of Aadhaar cards, income certificates, caste certificates, tax records, and academic transcripts across multiple institutional portals. This process exposes citizens to major privacy risks, document forgery, identity theft, and data leaks while creating duplicate verification overhead for verifying institutions.

**NightProof** solves this fundamental privacy flaw by introducing a zero-knowledge credential verification layer powered by the Midnight Network. Built using Compact smart contracts, NightProof enables citizens to securely store encrypted document commitments and generate cryptographic proofs that confirm program eligibility—such as family income falling below a scheme threshold, age being above 18, or academic score satisfying scholarship benchmarks—without exposing the underlying documents or personal figures.

By using selective disclosure, institutions receive an instant, tamper-proof on-chain verification result (Approved/Rejected) backed by auditable zk-SNARK cryptographic proofs. Citizens retain total ownership over their sensitive personal records while public service institutions eliminate manual document processing backlogs.

---

## Privacy Model

- **What is PUBLIC (on-chain, visible to anyone on the ledger):**
  - Scheme criteria threshold parameters (maximum allowable income, minimum required age, passing score).
  - Total verifications counter (`total_verifications`), total applications counter (`total_applications`), and registered commitments counter (`verified_citizens_count`).
  - Final disclosed boolean eligibility outcome (`disclose(is_eligible)` -> true/false).
  - Cryptographic transaction hashes and auditable ZK proof metadata.

- **What is PRIVATE (private witness, handled off-chain, NEVER touches the ledger):**
  - Citizen identity secret key (`citizen_secret_key`: `Bytes<32>`).
  - Actual family annual income in currency units (`annual_income`: `Uint<64>`).
  - Exact applicant age in years (`age`: `Uint<64>`).
  - Exact academic test scores or GPA (`academic_score`: `Uint<64>`).
  - Issuer document digital signature / Aadhaar hash (`credential_hash`: `Bytes<32>`).

- **What the user PROVES without revealing:**
  - *"I hold a valid, non-zero issuer credential commitment."*
  - *"My annual family income is less than or equal to the public scheme threshold (\( \text{income} \le \text{max\_income} \))."*
  - *"My age is greater than or equal to the required minimum age (\( \text{age} \ge \text{min\_age} \))."*
  - *"My academic score satisfies the scholarship passing benchmark (\( \text{score} \ge \text{min\_score} \))."*

---

## Tech Stack

- **Smart Contract Language:** Compact (v0.14+)
- **Blockchain Network:** Midnight Network (Preprod Testnet)
- **Zero-Knowledge Runtime:** `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/midnight-js-contracts`
- **Frontend Framework:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Lucide React Icons
- **Testing:** Jest, `ts-jest`
- **CI/CD:** GitHub Actions

---

## Prerequisites

- **Node.js:** v22.0.0 or higher
- **Package Manager:** npm v10+
- **Midnight Compiler:** Compact CLI compiler (`compact`)
- **Wallet:** Midnight Lace Wallet Extension (configured for Preprod Testnet with tDUST)
- **Docker:** Optional (for running local Midnight ZK Proof Server on port 6300)

---

## Setup & Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Boredooms/Nightproof.git
   cd Nightproof
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile the Midnight Compact contract:**
   ```bash
   npm run compile
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Run Tests

Run the full Jest test suite validating contract circuit logic, state transitions, and zero-knowledge privacy assertions:

```bash
npm test
```

---

## CI/CD

NightProof uses GitHub Actions to run automated compilation, unit test suites, and frontend build checks on every push to `main`. See [.github/workflows/ci.yml](file:///.github/workflows/ci.yml).

---

## Usage Guide

For a detailed step-by-step walkthrough, see [docs/USAGE.md](file:///docs/USAGE.md).

---

## Product X Profile

[PLACEHOLDER — I will add after creating the account]
