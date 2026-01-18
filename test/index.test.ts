import { expect, test } from 'bun:test'

import { solanaKeygen } from '../src/solana-keygen.ts'

test('solanaKeygen returns true', async () => {
  const result = await solanaKeygen()
  expect(Object.keys(result)).toEqual(['address', 'base58', 'byteArray'])
})
