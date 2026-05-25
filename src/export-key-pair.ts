import { getBase58Decoder, getBase64Decoder } from '@solana/kit'
import { exportKeyPairToSecretKey } from './export-key-pair-to-secret-key.ts'

export async function exportKeyPair(
  keyPair: CryptoKeyPair,
): Promise<{ base58: string; base64: string; byteArray: string }> {
  const secretKey = await exportKeyPairToSecretKey(keyPair)

  return {
    base58: getBase58Decoder().decode(secretKey),
    base64: getBase64Decoder().decode(secretKey),
    byteArray: JSON.stringify(Array.from(secretKey)),
  }
}
