import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  citizen_secret_key(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  annual_income(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  age(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  academic_score(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  credential_hash(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  register_citizen_credential(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>,
                     max_income_threshold_0: bigint,
                     min_age_required_0: bigint,
                     min_score_required_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  get_total_verifications(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, bigint>>;
}

export type ProvableCircuits<PS> = {
  register_citizen_credential(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>,
                     max_income_threshold_0: bigint,
                     min_age_required_0: bigint,
                     min_score_required_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  get_total_verifications(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, bigint>>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  register_citizen_credential(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>,
                     max_income_threshold_0: bigint,
                     min_age_required_0: bigint,
                     min_score_required_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  get_total_verifications(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, bigint>>;
}

export type Ledger = {
  readonly total_verifications: bigint;
  readonly total_applications: bigint;
  readonly verified_citizens_count: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
