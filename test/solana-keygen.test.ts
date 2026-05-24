import { expect, test } from 'bun:test'

import { solanaKeygen } from '../src/solana-keygen.ts'

const invalidSecretKeyInputMessage = 'Input must be a base58 secret key or JSON byte array'

const secretKey = {
  address: '4sa2EtCgxbGEmZXquuNxynvPJVnQzBgs8VnmeQCs4TX3',
  base58: '5sF6vTVVYbYWjZbQ4BrNRHQA3ESgC7BLkEoGFkRTxkW42e43BfcgAQWvhKQFZt3dU3UUjb7aTC7YmDh3U5WM6vTo',
  byteArray:
    '[243,101,81,46,49,8,122,67,56,221,213,21,189,228,207,109,203,206,40,160,18,194,92,153,89,141,123,122,219,7,115,35,57,135,112,72,239,180,72,60,135,163,42,162,65,187,191,132,194,12,103,148,2,55,236,232,193,236,113,169,200,5,32,46]',
}

test('solanaKeygen generates valid keypair', async () => {
  const result = await solanaKeygen()

  expect(result).toHaveProperty('address')
  expect(result).toHaveProperty('base58')
  expect(result).toHaveProperty('byteArray')

  expect(typeof result.address).toBe('string')
  expect(result.address).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)

  expect(typeof result.base58).toBe('string')
  expect(result.base58).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/)

  const byteArray = JSON.parse(result.byteArray)
  expect(Array.isArray(byteArray)).toBe(true)
  expect(byteArray).toHaveLength(64)

  byteArray.forEach((byte: number) => {
    expect(byte).toBeGreaterThanOrEqual(0)
    expect(byte).toBeLessThanOrEqual(255)
  })
})

test('solanaKeygen generates unique keys', async () => {
  const [key1, key2] = await Promise.all([solanaKeygen(), solanaKeygen()])

  expect(key1.address).not.toBe(key2.address)
  expect(key1.base58).not.toBe(key2.base58)
  expect(key1.byteArray).not.toBe(key2.byteArray)
})

test('solanaKeygen outputs are consistent formats', async () => {
  const result = await solanaKeygen()
  const byteArray = JSON.parse(result.byteArray)

  expect(byteArray.length).toBe(64)
  expect(result.base58.length).toBeGreaterThan(0)
})

test('solanaKeygen uses base58 secret key input', async () => {
  const result = await solanaKeygen(secretKey.base58)

  expect(String(result.address)).toBe(secretKey.address)
  expect(result.base58).toBe(secretKey.base58)
  expect(result.byteArray).toBe(secretKey.byteArray)
})

test('solanaKeygen uses byte array secret key input', async () => {
  const result = await solanaKeygen(secretKey.byteArray)

  expect(String(result.address)).toBe(secretKey.address)
  expect(result.base58).toBe(secretKey.base58)
  expect(result.byteArray).toBe(secretKey.byteArray)
})

test('solanaKeygen rejects invalid secret key input', async () => {
  await expect(solanaKeygen('not a secret key')).rejects.toThrow(invalidSecretKeyInputMessage)
  await expect(solanaKeygen('[1,2,]')).rejects.toThrow(invalidSecretKeyInputMessage)
  await expect(solanaKeygen('   ')).rejects.toThrow(invalidSecretKeyInputMessage)
})
