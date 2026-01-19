import { expect, test } from 'bun:test'
import { generateKeyPairSignerExtractable } from '../src/generate-key-pair-signer-extractable.ts'

test('generateKeyPairSignerExtractable returns KeyPairSigner', async () => {
  const signer = await generateKeyPairSignerExtractable()

  expect(signer).toHaveProperty('address')
  expect(signer).toHaveProperty('keyPair')
  expect(signer).toHaveProperty('signMessages')
  expect(signer).toHaveProperty('signTransactions')
  expect(typeof signer.address).toBe('string')
  expect(typeof signer.signMessages).toBe('function')
  expect(typeof signer.signTransactions).toBe('function')
})

test('generateKeyPairSignerExtractable returns extractable key pair', async () => {
  const signer = await generateKeyPairSignerExtractable()

  expect(signer.keyPair.privateKey.extractable).toBe(true)
  expect(signer.keyPair.publicKey.extractable).toBe(true)
})

test('generateKeyPairSignerExtractable generates unique signers', async () => {
  const [signer1, signer2] = await Promise.all([generateKeyPairSignerExtractable(), generateKeyPairSignerExtractable()])

  expect(signer1.address).not.toBe(signer2.address)
  expect(signer1.keyPair).not.toBe(signer2.keyPair)
})

test('generateKeyPairSignerExtractable generates valid address format', async () => {
  const signer = await generateKeyPairSignerExtractable()

  expect(signer.address).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)
})

test('generateKeyPairSignerExtractable can sign messages', async () => {
  const signer = await generateKeyPairSignerExtractable()

  const message = new Uint8Array([1, 2, 3, 4, 5])
  const signatures = await signer.signMessages([{ content: message, signatures: {} }])

  expect(signatures).toHaveLength(1)
  const signature = signatures[0]
  expect(signature).toHaveProperty(signer.address)
  expect(signature?.[signer.address]).toBeInstanceOf(Uint8Array)
})
