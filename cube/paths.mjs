import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export const lock = JSON.parse(readFileSync(new URL('./runtime-lock.json', import.meta.url), 'utf8'));
export function paths(env = process.env) {
  const home = env.HOME || homedir();
  const cache = resolve(env.CUBE_COLLABORATOR_CACHE_DIR || join(env.XDG_CACHE_HOME || join(home, '.cache'), 'cube-collaborator'));
  const data = resolve(env.CUBE_COLLABORATOR_DATA_DIR || join(env.XDG_DATA_HOME || join(home, '.local', 'share'), 'cube-collaborator'));
  const runtime = join(cache, `${lock.version}-linux-x64-${lock.artifact.sha256.slice(0, 12)}`);
  return { cache, data, runtime, executable: join(runtime, lock.executable), profile: join(data, 'profile'), bin: join(data, 'bin') };
}
export function requirePlatform(platform = process.platform, arch = process.arch) {
  if (platform !== 'linux' || arch !== 'x64') throw new Error('This Cube package requires Linux x64.');
}
