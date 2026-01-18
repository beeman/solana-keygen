import { solanaKeygen } from './solana-keygen.ts'

const result = await solanaKeygen()
console.log(JSON.stringify(result, null, 2))
