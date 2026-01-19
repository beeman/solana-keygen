# Solana Key Generation and Formats

Based on the analysis of the project's key generation scripts, here's how Solana keys work.

## 1. Key Pair Generation Fundamentals

- **Algorithm**: Key pairs are generated using the standard Web Crypto API (`crypto.subtle.generateKey`).
- **Curve**: The cryptographic curve used is `Ed25519`, which is standard for Solana.
- **Extractable**: Keys **must** be generated with the `extractable` flag set to `true`. This allows the private key material to be exported from the `CryptoKey` object for storage or use.

## 2. Key Components

A Solana key pair consists of two 32-byte components:

- **Private Key (32 bytes)**: The secret part of the key.
- **Public Key (32 bytes)**: The public part of the key, which also serves as the wallet address.

## 3. The "Secret Key"

In the Solana ecosystem, a "secret key" typically refers to a **64-byte** `Uint8Array`.

- **Structure**: It's formed by concatenating the 32-byte private key and the 32-byte public key.
  `[ ...32-byte Private Key..., ...32-byte Public Key... ]`

## 4. Export Formats

This 64-byte secret key can be encoded for storage and interchange:

- **`Uint8Array`**: The raw 64-byte array.
- **Base58 String**: A Base58-encoded string of the 64-byte secret key.
- **JSON Byte Array**: A JSON-formatted string of an array of numbers (e.g., `"[10, 21, ...]"`).

---

## 5. Practical Usage with `@solana/kit`

The `@solana/kit` library provides helpers to streamline key generation and management.

### Generating a KeyPairSigner

The easiest way to create a key is to generate a `KeyPairSigner`. This object bundles the key pair with signing functions.

```ts
import { createKeyPairSignerFromPrivateKeyBytes, type KeyPairSigner } from '@solana/kit'

// Generate a new key pair from random bytes
const signer: KeyPairSigner = await createKeyPairSignerFromPrivateKeyBytes(
  crypto.getRandomValues(new Uint8Array(32)),
  true  // extractable: true
);

// The public key (address) is readily available
console.log('New address:', signer.address);
```

### Exporting Keys

You can export the generated `signer` into standard Solana formats using the utility functions in this project.

**Export to a 64-byte secret key:**

```ts
import { exportKeyPairToSecretKey } from './export-key-pair-to-secret-key';

const secretKey: Uint8Array = await exportKeyPairToSecretKey(signer.keyPair);
// secretKey is a 64-byte Uint8Array
```

**Export to separate private/public key bytes:**

```ts
import { exportKeyPairToBytes } from './export-key-pair-to-bytes';

const { privateKey, publicKey } = await exportKeyPairToBytes(signer.keyPair);
// Both are 32-byte Uint8Arrays
```

**Export to Base58 and JSON formats:**

```ts
import { exportKeyPair } from './export-key-pair';

const { base58, byteArray } = await exportKeyPair(signer.keyPair);
// base58: A string like '5...'
// byteArray: A JSON string like '[10, 21, ...]'
```
