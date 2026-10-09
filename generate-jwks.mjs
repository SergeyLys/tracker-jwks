import { createPublicKey } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { exportJWK } from 'jose';

const directory = new URL('./', import.meta.url);
const publicKeyPath = new URL('./keys/public.pem', directory);
const outputPath = new URL('./public/.well-known/jwks.json', directory);

const kid = 'tracker-local-2026-01';

const pem = await readFile(publicKeyPath);
const publicKey = createPublicKey(pem);
const publicJwk = await exportJWK(publicKey);

const jwks = {
  keys: [
    {
      ...publicJwk,
      kid,
      use: 'sig',
      alg: 'RS256',
    },
  ],
};

await mkdir(new URL('./public/.well-known/', directory), {
  recursive: true,
});

await writeFile(outputPath, JSON.stringify(jwks, null, 2) + '\n');

console.log('Generated local JWKS:', outputPath.pathname);