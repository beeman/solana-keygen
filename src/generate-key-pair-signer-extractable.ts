import { createKeyPairSignerFromPrivateKeyBytes, type KeyPairSigner } from '@solana/kit'

export async function generateKeyPairSignerExtractable(): Promise<KeyPairSigner> {
  return await createKeyPairSignerFromPrivateKeyBytes(crypto.getRandomValues(new Uint8Array(32)), true)
}
