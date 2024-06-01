import { createHash } from 'crypto';

export function createCacheKey(readable: string, ...args: any[]): string {
  const hash = createHash('sha256');
  hash.update(args.join('-'));
  return `${readable}-${hash.digest('hex')}`;
}
