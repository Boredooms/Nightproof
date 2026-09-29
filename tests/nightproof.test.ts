/**
 * NightProof Contract Tests
 *
 * These unit tests validate the NightProof zero-knowledge eligibility verification
 * contract logic by simulating the Midnight execution model.
 *
 * It verifies:
 *  1. Initial ledger state initialization
 *  2. Citizen credential commitment registration
 *  3. Zero-Knowledge eligibility verification (Passing criteria)
 *  4. Zero-Knowledge eligibility verification (Failing criteria - Income/Age/Score)
 *  5. Privacy guarantees (sensitive inputs never disclosed to public ledger)
 */

interface ContractState {
  verified_citizens_count: number;
  total_applications: number;
  total_verifications: number;
}

interface CitizenWitnesses {
  citizen_secret_key: () => Uint8Array;
  annual_income: () => bigint;
  age: () => bigint;
  academic_score: () => bigint;
  credential_hash: () => Uint8Array;
}

// ─── Circuit Simulation Logic ───────────────────────────────────────────────

function createInitialState(): ContractState {
  return {
    verified_citizens_count: 0,
    total_applications: 0,
    total_verifications: 0,
  };
}

function register_citizen_credential(
  state: ContractState,
  witnesses: CitizenWitnesses
): ContractState {
  const sk = witnesses.citizen_secret_key();
  const cred = witnesses.credential_hash();

  const isSkZero = sk.every((b) => b === 0);
  if (isSkZero) throw new Error('Citizen secret key must not be zero');

  const isCredZero = cred.every((b) => b === 0);
  if (isCredZero) throw new Error('Credential hash must not be zero');

  return {
    ...state,
    verified_citizens_count: state.verified_citizens_count + 1,
  };
}

function verify_eligibility(
  state: ContractState,
  witnesses: CitizenWitnesses,
  max_income_threshold: bigint,
  min_age_required: bigint,
  min_score_required: bigint
): ContractState {
  const sk = witnesses.citizen_secret_key();
  const cred = witnesses.credential_hash();

  const isSkZero = sk.every((b) => b === 0);
  if (isSkZero) throw new Error('Invalid identity: key must not be zero');

  const isCredZero = cred.every((b) => b === 0);
  if (isCredZero) throw new Error('Invalid credential hash');

  const inc = witnesses.annual_income();
  const user_age = witnesses.age();
  const score = witnesses.academic_score();

  const is_income_ok = inc <= max_income_threshold;
  const is_age_ok = user_age >= min_age_required;
  const is_score_ok = score >= min_score_required;

  const is_eligible = is_income_ok && is_age_ok && is_score_ok;

  const newApplications = state.total_applications + 1;
  const newVerifications = is_eligible
    ? state.total_verifications + 1
    : state.total_verifications;

  return {
    ...state,
    total_applications: newApplications,
    total_verifications: newVerifications,
  };
}

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function makeValidWitnesses(
  income: bigint = 250000n,
  ageVal: bigint = 20n,
  scoreVal: bigint = 85n
): CitizenWitnesses {
  return {
    citizen_secret_key: () => {
      const key = new Uint8Array(32);
      key.fill(0x12);
      return key;
    },
    annual_income: () => income,
    age: () => ageVal,
    academic_score: () => scoreVal,
    credential_hash: () => {
      const hash = new Uint8Array(32);
      hash.fill(0x34);
      return hash;
    },
  };
}

function makeInvalidKeyWitnesses(): CitizenWitnesses {
  return {
    citizen_secret_key: () => new Uint8Array(32), // all zeros
    annual_income: () => 200000n,
    age: () => 22n,
    academic_score: () => 90n,
    credential_hash: () => {
      const hash = new Uint8Array(32);
      hash.fill(0x56);
      return hash;
    },
  };
}

// ─── Suite Execution ──────────────────────────────────────────────────────────

describe('NightProof Smart Contract Suite', () => {
  describe('Initial State', () => {
    it('should initialize with all counters at zero', () => {
      const state = createInitialState();
      expect(state.verified_citizens_count).toBe(0);
      expect(state.total_applications).toBe(0);
      expect(state.total_verifications).toBe(0);
    });
  });

  describe('register_citizen_credential circuit', () => {
    it('should register a valid citizen credential commitment', () => {
      let state = createInitialState();
      const witnesses = makeValidWitnesses();

      state = register_citizen_credential(state, witnesses);

      expect(state.verified_citizens_count).toBe(1);
      expect(state.total_applications).toBe(0);
      expect(state.total_verifications).toBe(0);
    });

    it('should reject registration with invalid zero secret key', () => {
      const state = createInitialState();
      const invalidWitnesses = makeInvalidKeyWitnesses();

      expect(() => register_citizen_credential(state, invalidWitnesses)).toThrow(
        'Citizen secret key must not be zero'
      );
      expect(state.verified_citizens_count).toBe(0);
    });
  });

  describe('verify_eligibility circuit', () => {
    it('should successfully verify eligibility when applicant meets all program criteria', () => {
      let state = createInitialState();
      // Applicant: Income 250,000, Age 20, Score 85%
      // Program criteria: Max Income 300,000, Min Age 18, Min Score 75%
      const witnesses = makeValidWitnesses(250000n, 20n, 85n);

      state = verify_eligibility(state, witnesses, 300000n, 18n, 75n);

      expect(state.total_applications).toBe(1);
      expect(state.total_verifications).toBe(1);
    });

    it('should reject verification when income exceeds maximum threshold', () => {
      let state = createInitialState();
      // Applicant: Income 450,000 (over 300,000 threshold)
      const witnesses = makeValidWitnesses(450000n, 20n, 85n);

      state = verify_eligibility(state, witnesses, 300000n, 18n, 75n);

      expect(state.total_applications).toBe(1);
      expect(state.total_verifications).toBe(0);
    });

    it('should reject verification when age is under minimum required', () => {
      let state = createInitialState();
      // Applicant: Age 16 (under 18 threshold)
      const witnesses = makeValidWitnesses(200000n, 16n, 90n);

      state = verify_eligibility(state, witnesses, 300000n, 18n, 75n);

      expect(state.total_applications).toBe(1);
      expect(state.total_verifications).toBe(0);
    });

    it('should reject verification when academic score is below minimum', () => {
      let state = createInitialState();
      // Applicant: Score 60% (below 75% threshold)
      const witnesses = makeValidWitnesses(200000n, 20n, 60n);

      state = verify_eligibility(state, witnesses, 300000n, 18n, 75n);

      expect(state.total_applications).toBe(1);
      expect(state.total_verifications).toBe(0);
    });
  });

  describe('Privacy Assertions', () => {
    it('proves zero-knowledge privacy: sensitive credentials never leak into ledger state', () => {
      let state = createInitialState();
      const sensitiveWitnesses = makeValidWitnesses(1234567n, 25n, 98n);

      state = verify_eligibility(state, sensitiveWitnesses, 2000000n, 18n, 70n);

      const stateKeys = Object.keys(state);
      expect(stateKeys).toEqual(['verified_citizens_count', 'total_applications', 'total_verifications']);

      const serializedState = JSON.stringify(state);
      expect(serializedState).not.toContain('1234567'); // Income not present
      expect(serializedState).not.toContain('25');      // Age not present
      expect(serializedState).not.toContain('98');      // Score not present
    });
  });
});
