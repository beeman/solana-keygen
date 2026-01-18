import { expect, test } from 'bun:test'
import { solanaKeygen } from '../src/index.ts'

test('solanaKeygen returns true', async () => {
  const result = await solanaKeygen()
  expect(result).toBe(true)
})
