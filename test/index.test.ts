import { expect, test } from 'bun:test'

import {
  exportKeyPair,
  exportKeyPairToBytes,
  exportKeyPairToSecretKey,
  generateKeyPairSignerExtractable,
  solanaKeygen,
} from '../src/index.ts'

test('index.ts exports all public functions', () => {
  expect(typeof solanaKeygen).toBe('function')
  expect(typeof generateKeyPairSignerExtractable).toBe('function')
  expect(typeof exportKeyPair).toBe('function')
  expect(typeof exportKeyPairToBytes).toBe('function')
  expect(typeof exportKeyPairToSecretKey).toBe('function')
})

test('index.ts solanaKeygen export works correctly', async () => {
  const result = await solanaKeygen()

  expect(result).toHaveProperty('address')
  expect(result).toHaveProperty('base58')
  expect(result).toHaveProperty('byteArray')
})
