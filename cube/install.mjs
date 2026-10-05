import { access, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { download } from './download.mjs';
import { lock, paths, requirePlatform } from './paths.mjs';

requirePlatform();
const locations = paths();
const run = promisify(execFile);
await mkdir(locations.cache, { recursive: true, mode: 0o700 });
let installed = false;
try {
  installed = await readFile(join(locations.runtime, '.cube-sha256'), 'utf8') === lock.artifact.sha256;
  if (installed) await access(locations.executable, constants.X_OK);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  installed = false;
}
if (!installed) {
  const temporary = await mkdtemp(join(locations.cache, '.extract-'));
  try {
    const archive = join(temporary, 'collaborator-linux-x64.tgz');
    console.log(`Downloading pinned Collaborator ${lock.version} (${Math.ceil(lock.artifact.size / 1024 / 1024)} MiB).`);
    await download(lock.artifact, archive);
    const extracted = join(temporary, 'runtime');
    await mkdir(extracted);
    await run('tar', ['-xzf', archive, '-C', extracted]);
    await access(join(extracted, lock.executable), constants.X_OK);
    if ((await readFile(join(extracted, 'CUBE_BUILD_REVISION'), 'utf8')).trim() !== lock.buildRevision) throw new Error('Build provenance mismatch.');
    await writeFile(join(extracted, '.cube-sha256'), lock.artifact.sha256);
    await rm(locations.runtime, { recursive: true, force: true });
    await rename(extracted, locations.runtime);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
console.log(`Collaborator ${lock.version} is installed; no cloud compilation or global helper install.`);
