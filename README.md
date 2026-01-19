## Solana Key Generation Library

This repository contains a lightweight, **Bun‑based** TypeScript library for generating and exporting Solana key pairs using the Web Crypto API. It is designed to be drop‑in for projects that need programmatic key creation without relying on the official Solana CLI or heavy dependencies.

### Features
- **Extractable Ed25519 key pairs** – generated from random bytes.
- Export to multiple formats:
  - Secret key (64 bytes, private + public)
  - Separate 32‑byte private & public keys
  - Base58 string (compatible with Solana tooling)
  - JSON array of bytes
- Built entirely with **Bun** and the native Web Crypto API – no external binaries.
- Fully typed with TypeScript and includes a small test suite that runs via `bun test`.

### Installation
```bash
bun add @solana/kit
bun add -D @types/node  # optional for TS projects
```

The library itself is bundled in this repo; you can import it directly:
```ts
import { generateKeyPairSignerExtractable } from './src/generate-key-pair-signer-extractable'
```

### Usage
```ts
import { generateKeyPairSignerExtractable } from './src/generate-key-pair-signer-extractable'
import { exportKeyPairToSecretKey } from './src/export-key-pair-to-secret-key'
import { exportKeyPairToBytes } from './src/export-key-pair-to-bytes'
import { exportKeyPair } from './src/export-key-pair'

async function demo() {
  const signer = await generateKeyPairSignerExtractable()

  // Secret key (64 bytes)
  const secretKey = await exportKeyPairToSecretKey(signer.keyPair)

  // Separate private/public
  const { privateKey, publicKey } = await exportKeyPairToBytes(signer.keyPair)

  // Base58 & JSON
  const { base58, byteArray } = await exportKeyPair(signer.keyPair)
  console.log({ base58, byteArray })
}

demo()
```

### Testing
Run the bundled tests with:
```bash
bun test
```

The test suite validates:
- Extractability of keys.
- Correctness of exported formats.
- Uniqueness of generated key pairs.

### Project Structure
```
src/
├─ export-key-pair-to-bytes.ts   # Export private/public as Uint8Array
├─ export-key-pair-to-secret-key.ts  # Export 64‑byte secret key
├─ export-key-pair.ts            # Export base58 string & JSON array
├─ generate-key-pair-signer-extractable.ts  # Key generation helper
└─ index.ts                       # Re‑exports public API

test/
├─ ... test files matching src modules
```

### License
MIT – see [LICENSE](./LICENSE).
