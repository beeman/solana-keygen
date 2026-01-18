export async function exportKeyPairToBytes(keyPair: CryptoKeyPair): Promise<{
  privateKey: Uint8Array
  publicKey: Uint8Array
}> {
  const [privateKeyPkcs8, publicKeyRaw] = await Promise.all([
    crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
    crypto.subtle.exportKey('raw', keyPair.publicKey),
  ])
  const privateKey = new Uint8Array(privateKeyPkcs8).slice(-32)
  const publicKey = new Uint8Array(publicKeyRaw)

  return { privateKey, publicKey }
}
