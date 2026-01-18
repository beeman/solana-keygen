import { exportKeyPairToBytes } from './export-key-pair-to-bytes.ts'

export async function exportKeyPairToSecretKey(keyPair: CryptoKeyPair): Promise<Uint8Array> {
  const { privateKey, publicKey } = await exportKeyPairToBytes(keyPair)

  const secretKey = new Uint8Array(64)
  secretKey.set(privateKey, 0)
  secretKey.set(publicKey, 32)

  return secretKey
}
