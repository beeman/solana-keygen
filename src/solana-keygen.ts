import { exportKeyPair } from './export-key-pair.ts'
import { generateKeyPairSignerExtractable } from './generate-key-pair-signer-extractable.ts'

export async function solanaKeygen() {
  const signer = await generateKeyPairSignerExtractable()

  const exported = await exportKeyPair(signer.keyPair)

  return { address: signer.address, ...exported }
}
