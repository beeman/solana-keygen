import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit'

import { exportKeyPair } from './export-key-pair.ts'
import { generateKeyPairSignerExtractable } from './generate-key-pair-signer-extractable.ts'

const invalidSecretKeyInputMessage = 'Input must be a base58 secret key or JSON byte array'

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

function parseSecretKeyInput(input: string): Uint8Array {
  const trimmed = input.trim()
  if (trimmed.length === 0) {
    throw new Error(invalidSecretKeyInputMessage)
  }

  try {
    const bytes = getBase58Encoder().encode(trimmed)

    if (bytes.length !== 64) {
      throw new Error('Base58 secret key must decode to 64 bytes')
    }

    return new Uint8Array(bytes)
  } catch (error) {
    if (error instanceof Error && error.message === 'Base58 secret key must decode to 64 bytes') {
      throw error
    }
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
