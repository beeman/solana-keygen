#!/usr/bin/env bun
import { solanaKeygen } from './solana-keygen.ts'

async function main() {
  const result = await solanaKeygen()
  console.log(JSON.stringify(result, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
