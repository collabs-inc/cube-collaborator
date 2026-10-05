import { paths } from './paths.mjs';

export function desktopProfile(env = process.env) {
  const locations = paths(env);
  return {
    name: 'Collaborator',
    executable: locations.executable,
    args: [`--user-data-dir=${locations.profile}`, '--ozone-platform=x11'],
    dataDir: locations.data,
    env: {
      APPIMAGE: undefined,
      APPDIR: undefined,
      ELECTRON_RUN_AS_NODE: undefined,
      COLLAB_CLI_DIR: locations.bin,
      PATH: `${locations.bin}:${env.PATH || ''}`,
    },
  };
}
