#!/usr/bin/env bun
import { solanaKeygen } from './solana-keygen.ts'

const outputFormats = ['address', 'base58', 'base64', 'byteArray', 'json'] as const

type OutputFormat = (typeof outputFormats)[number]

function parseOutputFormat(args: string[]): OutputFormat {
  let outputFormat: OutputFormat = 'json'

  for (let index = 0; index < args.length; index++) {
    const arg = args[index]

    if (arg === undefined) {
      continue
    }

    if (arg === '--output' || arg === '-o') {
      const value = args[index + 1]

      if (!value) {
        throw new Error(`Missing value for ${arg}`)
      }

      outputFormat = validateOutputFormat(value)
      index++
      continue
    }

    if (arg.startsWith('--output=')) {
      outputFormat = validateOutputFormat(arg.slice('--output='.length))
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return outputFormat
}

function validateOutputFormat(value: string): OutputFormat {
  if (outputFormats.includes(value as OutputFormat)) {
    return value as OutputFormat
  }

  throw new Error(`Invalid output "${value}". Expected one of: ${outputFormats.join(', ')}`)
}

async function main() {
  const outputFormat = parseOutputFormat(process.argv.slice(2))
  const input = process.stdin.isTTY ? undefined : await Bun.stdin.text()
  const result = await solanaKeygen(input)

  if (outputFormat === 'json') {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  console.log(result[outputFormat])
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
