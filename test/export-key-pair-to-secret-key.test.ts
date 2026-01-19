import { expect, test } from 'bun:test'
import { exportKeyPairToBytes } from '../src/export-key-pair-to-bytes.ts'
import { exportKeyPairToSecretKey } from '../src/export-key-pair-to-secret-key.ts'

test('exportKeyPairToSecretKey returns 64-byte Uint8Array', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPairToSecretKey(keyPair)

  expect(result).toBeInstanceOf(Uint8Array)
  expect(result).toHaveLength(64)
})

test('exportKeyPairToSecretKey combines private and public key', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const secretKey = await exportKeyPairToSecretKey(keyPair)
  const { privateKey, publicKey } = await exportKeyPairToBytes(keyPair)

  const secretKeyPrivate = secretKey.slice(0, 32)
  const secretKeyPublic = secretKey.slice(32, 64)

  expect(Array.from(secretKeyPrivate)).toEqual(Array.from(privateKey))
  expect(Array.from(secretKeyPublic)).toEqual(Array.from(publicKey))
})

test('exportKeyPairToSecretKey maintains byte order', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const secretKey = await exportKeyPairToSecretKey(keyPair)
  const { privateKey, publicKey } = await exportKeyPairToBytes(keyPair)

  expect(Array.from(secretKey.slice(0, 32))).toEqual(Array.from(privateKey))
  expect(Array.from(secretKey.slice(32))).toEqual(Array.from(publicKey))
})
