import { expect, test } from 'bun:test'

const cwd = new URL('../', import.meta.url).pathname

const secretKey = {
  address: '4sa2EtCgxbGEmZXquuNxynvPJVnQzBgs8VnmeQCs4TX3',
  base58: '5sF6vTVVYbYWjZbQ4BrNRHQA3ESgC7BLkEoGFkRTxkW42e43BfcgAQWvhKQFZt3dU3UUjb7aTC7YmDh3U5WM6vTo',
  base64: '82VRLjEIekM43dUVveTPbcvOKKASwlyZWY17etsHcyM5h3BI77RIPIejKqJBu7+EwgxnlAI37OjB7HGpyAUgLg==',
  byteArray:
    '[243,101,81,46,49,8,122,67,56,221,213,21,189,228,207,109,203,206,40,160,18,194,92,153,89,141,123,122,219,7,115,35,57,135,112,72,239,180,72,60,135,163,42,162,65,187,191,132,194,12,103,148,2,55,236,232,193,236,113,169,200,5,32,46]',
}

async function runCli(args: string[] = [], input = secretKey.base58) {
  const process = Bun.spawn(['bun', 'src/cli.ts', ...args], {
    cwd,
    stderr: 'pipe',
    stdin: 'pipe',
    stdout: 'pipe',
  })

  process.stdin.write(input)
  process.stdin.end()

  const [exitCode, stderr, stdout] = await Promise.all([
    process.exited,
    new Response(process.stderr).text(),
    new Response(process.stdout).text(),
  ])

  return { exitCode, stderr, stdout }
}

test('cli defaults to json output', async () => {
  const result = await runCli()

  expect(result.exitCode).toBe(0)
  expect(result.stderr).toBe('')
  expect(JSON.parse(result.stdout)).toEqual(secretKey)
})

test('cli outputs selected field with --output', async () => {
  const result = await runCli(['--output', 'base58'])

  expect(result.exitCode).toBe(0)
  expect(result.stderr).toBe('')
  expect(result.stdout).toBe(`${secretKey.base58}\n`)
})

test('cli outputs selected field with --output equals syntax', async () => {
  const result = await runCli(['--output=byteArray'])

  expect(result.exitCode).toBe(0)
  expect(result.stderr).toBe('')
  expect(result.stdout).toBe(`${secretKey.byteArray}\n`)
})

test('cli outputs selected field with -o', async () => {
  const result = await runCli(['-o', 'address'])

  expect(result.exitCode).toBe(0)
  expect(result.stderr).toBe('')
  expect(result.stdout).toBe(`${secretKey.address}\n`)
})

test('cli accepts base64 input', async () => {
  const result = await runCli(['--output', 'address'], secretKey.base64)

  expect(result.exitCode).toBe(0)
  expect(result.stderr).toBe('')
  expect(result.stdout).toBe(`${secretKey.address}\n`)
})

test('cli outputs secret key base64', async () => {
  const result = await runCli(['--output', 'base64'])

  expect(result.exitCode).toBe(0)
  expect(result.stderr).toBe('')
  expect(result.stdout).toBe(`${secretKey.base64}\n`)
})

test('cli rejects invalid --output value', async () => {
  const result = await runCli(['--output', 'invalid'])

  expect(result.exitCode).not.toBe(0)
  expect(result.stderr).toContain('Invalid output "invalid"')
})

test('cli rejects missing --output value', async () => {
  const result = await runCli(['--output'])

  expect(result.exitCode).not.toBe(0)
  expect(result.stderr).toContain('Missing value for --output')
})

test('cli rejects missing -o value', async () => {
  const result = await runCli(['-o'])

  expect(result.exitCode).not.toBe(0)
  expect(result.stderr).toContain('Missing value for -o')
})
