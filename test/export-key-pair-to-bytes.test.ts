import { expect, test } from 'bun:test'
import { exportKeyPairToBytes } from '../src/export-key-pair-to-bytes.ts'

test('exportKeyPairToBytes exports private and public key as Uint8Array', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPairToBytes(keyPair)

  expect(result).toHaveProperty('privateKey')
  expect(result).toHaveProperty('publicKey')
  expect(result.privateKey).toBeInstanceOf(Uint8Array)
  expect(result.publicKey).toBeInstanceOf(Uint8Array)
})

test('exportKeyPairToBytes returns 32-byte keys', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPairToBytes(keyPair)

  expect(result.privateKey).toHaveLength(32)
  expect(result.publicKey).toHaveLength(32)
})

test('exportKeyPairToBytes extracts last 32 bytes from PKCS8 private key', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const pkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
  const pkcs8Array = new Uint8Array(pkcs8)

  const result = await exportKeyPairToBytes(keyPair)

  const extractedPrivateKey = result.privateKey
  const expectedPrivateKey = pkcs8Array.slice(-32)
  expect(Array.from(extractedPrivateKey)).toEqual(Array.from(expectedPrivateKey))
})

test('exportKeyPairToBytes returns raw public key', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const rawPublic = await crypto.subtle.exportKey('raw', keyPair.publicKey)
  const result = await exportKeyPairToBytes(keyPair)

  expect(Array.from(result.publicKey)).toEqual(Array.from(new Uint8Array(rawPublic)))
})
