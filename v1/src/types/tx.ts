export type DropfiPackageType =
  | "transaction"
  | "message"
  | "asset"
  | "multi";

export interface DropfiPackageHeader {
  id: string;                  // unique identifier
  type: DropfiPackageType;     // what the package contains
  version: string;             // schema version
  createdAt: number;           // unix timestamp
  sender: string;              // base58 public key
  recipient: string;           // base58 public key
}

export interface DropfiPackageMeta {
  network: "mainnet" | "devnet" | "testnet" | "localnet";
  retries?: number;
  expiry?: number;             // optional expiry timestamp
  tags?: string[];
}

export interface DropfiPackagePayload {
  encrypted: boolean;          // if payload is encrypted
  encoding: "base64" | "hex";
  data: string;                // encrypted tx / asset / msg blob
  checksum: string;            // sha256 or blake3 hash of data
}

export interface DropfiSignature {
  signer: string;              // public key
  signature: string;           // base58 or hex signature
}

export interface DropfiPackage {
  header: DropfiPackageHeader;
  meta: DropfiPackageMeta;
  payload: DropfiPackagePayload;
  signatures: DropfiSignature[];
}
