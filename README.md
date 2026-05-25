# Solana Keygen

This repository contains a lightweight, **Bun-based** TypeScript tool for generating and exporting Solana key pairs.

It can be used via `bunx` for quick command-line key generation or as a library in your own projects.

It is designed to be a drop-in for projects that need programmatic key creation without relying on the official Solana CLI or heavy dependencies.

### Command-Line Usage

This tool is meant to be run using `bunx`.

**Generate a new keypair**

```bash
bun x solana-keygen@latest
```

Output:
```json
{
  "address": "...",
  "base58": "...",
  "base64": "...",
  "byteArray": "..."
}
```

**Extract the base58 secret key**

This is useful for importing into Phantom, Solflare, or other wallets.

```bash
bun x solana-keygen@latest --output base58
```

The short alias works the same way:

```bash
bun x solana-keygen@latest -o base58
```

You can select any output format:

```bash
bun x solana-keygen@latest --output address
bun x solana-keygen@latest --output base58
bun x solana-keygen@latest --output base64
bun x solana-keygen@latest --output byteArray
bun x solana-keygen@latest --output json
```

JSON is also the default output.

**Re-export an existing key**

If stdin is provided, the CLI reads it as a base58 secret key, base64 secret key, or JSON byte-array secret key.

```bash
printf '%s' "$SOLANA_SECRET_KEY_BASE64" | bun x solana-keygen@latest --output address
```

**Export to environment variables**

You can use `--output` to export a single value for use in scripts.

```bash
export SOLANA_FEE_PAYER=$(bun x solana-keygen@latest --output base58)
```

Or, use `jq` to get both the address and secret key from the same generated key:
```bash
eval $(bun x solana-keygen@latest | jq -r '"SOLANA_ADDRESS=\(.address)\nSOLANA_SECRET_KEY=\(.base58)"')
```

You can use this to add or append values to an `.env` file:
```bash
bun x solana-keygen@latest | jq -r '"SOLANA_FEE_PAYER_ADDRESS=\(.address)\nSOLANA_FEE_PAYER_SECRET=\(.base58)"' >> .env
```

### Library Usage

You can also use this package as a library to integrate key generation into your own projects.

#### Features
- **Extractable Ed25519 key pairs** – generated from random bytes.
- Export to multiple formats:
  - Secret key (64 bytes, private + public)
  - Separate 32-byte private & public keys
  - Base58 string (compatible with Solana tooling)
  - Base64 string (secret key)
  - JSON array of bytes
- Built entirely with **Bun** and the native Web Crypto API and [`@solana/kit`](https://npm.im/@solana/kit).
- Fully typed with TypeScript and includes a small test suite that runs via `bun test`.

#### Installation
```bash
bun add solana-keygen
```

#### Example
```ts
import { solanaKeygen } from 'solana-keygen'

async function demo() {
  const result = await solanaKeygen()

  console.log('Address:', result.address)
  console.log('Secret key (Base58):', result.base58)
  console.log('Secret key (Base64):', result.base64)
  console.log('Secret key (JSON array):', result.byteArray)
}

demo()
```

You can also use the lower-level functions for more control:

```ts
import { generateKeyPairSignerExtractable } from 'solana-keygen'
import { exportKeyPairToSecretKey } from 'solana-keygen'
import { exportKeyPairToBytes } from 'solana-keygen'
import { exportKeyPair } from 'solana-keygen'

async function demo() {
  const signer = await generateKeyPairSignerExtractable()

  // Secret key (64 bytes)
  const secretKey = await exportKeyPairToSecretKey(signer.keyPair)

  // Separate private/public
  const { privateKey, publicKey } = await exportKeyPairToBytes(signer.keyPair)

  // Base58, Base64 & JSON
  const { base58, base64, byteArray } = await exportKeyPair(signer.keyPair)
  console.log({ base58, base64, byteArray })
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
├─ cli.ts # Command-line interface entry point
├─ solana-keygen.ts # Main keygen function
├─ export-key-pair-to-bytes.ts # Export private/public as Uint8Array
├─ export-key-pair-to-secret-key.ts # Export 64-byte secret key
├─ export-key-pair.ts # Export base58, base64 & JSON array
├─ generate-key-pair-signer-extractable.ts # Key generation helper
└─ index.ts # Re-exports public API

test/
├─ ... test files matching src modules
```

### License
MIT – see [LICENSE](./LICENSE).
