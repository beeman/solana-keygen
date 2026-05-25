import { createKeyPairSignerFromBytes, getBase58Encoder, getBase64Encoder } from '@solana/kit'

import { exportKeyPair } from './export-key-pair.ts'
import { generateKeyPairSignerExtractable } from './generate-key-pair-signer-extractable.ts'

const invalidSecretKeyInputMessage = 'Input must be a base58 secret key, base64 secret key, or JSON byte array'

function parseByteArraySecretKey(input: string): Uint8Array {
  if (!input.startsWith('[') || !input.endsWith(']')) {
    throw new Error(invalidSecretKeyInputMessage)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(input) as unknown
  } catch {
    throw new Error(invalidSecretKeyInputMessage)
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Byte array input must be a JSON array')
  }

  if (parsed.length !== 64) {
    throw new Error('Secret key byte array must contain 64 bytes')
  }

  const bytes = parsed.map((byte) => {
    if (!Number.isInteger(byte) || byte < 0 || byte > 255) {
      throw new Error('Secret key byte array must contain only bytes from 0 to 255')
    }

    return byte
  })

  return new Uint8Array(bytes)
}

function parseBase58SecretKey(input: string): Uint8Array | undefined {
  try {
    const bytes = getBase58Encoder().encode(input)

    if (bytes.length === 64) {
      return new Uint8Array(bytes)
    }
  } catch {}

  return undefined
}

function parseBase64SecretKey(input: string): Uint8Array | undefined {
  try {
    const bytes = getBase64Encoder().encode(input)

    if (bytes.length === 64) {
      return new Uint8Array(bytes)
    }
  } catch {}

  return undefined
}

function parseSecretKeyInput(input: string): Uint8Array {
  const trimmed = input.trim()
  if (trimmed.length === 0) {
    throw new Error(invalidSecretKeyInputMessage)
  }

  const base58SecretKey = parseBase58SecretKey(trimmed)
  if (base58SecretKey) {
    return base58SecretKey
  }

  const base64SecretKey = parseBase64SecretKey(trimmed)
  if (base64SecretKey) {
    return base64SecretKey
  }

  return parseByteArraySecretKey(trimmed)
}

export async function solanaKeygen(input?: string) {
  const signer =
    input === undefined
      ? await generateKeyPairSignerExtractable()
      : await createKeyPairSignerFromBytes(parseSecretKeyInput(input), true)

  const exported = await exportKeyPair(signer.keyPair)

  return { address: signer.address, ...exported }
}
