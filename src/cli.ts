#!/usr/bin/env bun
import { solanaKeygen } from './solana-keygen.ts'

async function main() {
  const input = process.stdin.isTTY ? undefined : await Bun.stdin.text()
  const result = await solanaKeygen(input)
  console.log(JSON.stringify(result, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
