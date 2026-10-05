import { access, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { paths, requirePlatform } from './paths.mjs';
import { desktopProfile } from './profile.mjs';
import { runDesktop } from './desktop/start.mjs';

requirePlatform();
const locations = paths();
await mkdir(locations.bin, { recursive: true, mode: 0o700 });
await access(locations.executable, constants.X_OK);
await runDesktop(desktopProfile());
