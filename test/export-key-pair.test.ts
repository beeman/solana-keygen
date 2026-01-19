import { expect, test } from 'bun:test'
import { exportKeyPair } from '../src/export-key-pair.ts'
import { exportKeyPairToSecretKey } from '../src/export-key-pair-to-secret-key.ts'

test('exportKeyPair returns base58 and byteArray properties', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPair(keyPair)

  expect(result).toHaveProperty('base58')
  expect(result).toHaveProperty('byteArray')
  expect(typeof result.base58).toBe('string')
  expect(typeof result.byteArray).toBe('string')
})

test('exportKeyPair base58 is valid base58 string', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPair(keyPair)

  expect(result.base58).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/)
})

test('exportKeyPair byteArray is valid JSON', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPair(keyPair)

  const parsed = JSON.parse(result.byteArray)
  expect(Array.isArray(parsed)).toBe(true)
  expect(parsed.length).toBe(64)
})

test('exportKeyPair byteArray contains valid byte values', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPair(keyPair)
  const byteArray = JSON.parse(result.byteArray)

  byteArray.forEach((byte: number) => {
    expect(byte).toBeGreaterThanOrEqual(0)
    expect(byte).toBeLessThanOrEqual(255)
  })
})

test('exportKeyPair base58 and byteArray have consistent lengths', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPair(keyPair)
  const byteArray = JSON.parse(result.byteArray)

  expect(result.base58.length).toBeGreaterThan(0)
  expect(byteArray.length).toBe(64)
})

test('exportKeyPair byteArray equals secret key bytes', async () => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  const result = await exportKeyPair(keyPair)
  const byteArray = JSON.parse(result.byteArray)
  const secretKey = await exportKeyPairToSecretKey(keyPair)

  expect(Array.from(byteArray)).toEqual(Array.from(secretKey))
})
