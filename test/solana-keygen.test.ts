import { expect, test } from 'bun:test'

import { solanaKeygen } from '../src/solana-keygen.ts'

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
