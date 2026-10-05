# Collaborator in Cube

This integration is prepared from `collabs-inc/collab-public` source commit
`476b8efc942ee5f430a9b8bf832b8560a8cf76c2`. Upstream publishes no Linux
release artifact, so `.github/workflows/cube-linux.yml` builds the production
Linux x64 app on an isolated GitHub Actions runner. Cloud installation downloads
the checksum-pinned artifact in `runtime-lock.json` and does not compile the
monorepo. The artifact includes its exact build revision and original notices.

The build preserves `LICENSE.md` (FSL-1.1-ALv2), `NOTICE.md`, the app's NOTICE,
Electron notices and dependency licenses. FSL is not an OSI open-source license;
the upstream terms include internal use and access as a permitted purpose.

The upstream integration adds `COLLAB_CLI_DIR` to the native CLI
installer. Cube points it into its private persistent data directory so the app
does not overwrite or remove the machine's existing `collab` command. HOME and
the existing coding CLI sign-ins are retained. App state remains in the upstream
`$HOME/.collaborator` directory, outside the disposable Cube source checkout.

The native sidecar also honors its configured Unix session socket directory.
Upstream ignored that option and wrote test sessions into the real home path;
the existing Linux sidecar tests caught this during the first isolated build.

The assistant-ui packages are pinned to the compatible versions used by the
newer local Collaborator checkout. The public source's unbounded ranges resolved
an incompatible core/store combination and failed the renderer build.

## Runtime

Requires Linux x64, Node 22+, and the host packages listed in
[desktop/README.md](desktop/README.md). The packaged Electron 40.6.0 application
runs with its normal sandbox on a private X11 display. The foreground bridge
listens only on `127.0.0.1:$PORT`. Cube owns outer authentication and lifecycle.

Defaults, all outside the replaceable source checkout:

- Runtime: `${XDG_CACHE_HOME:-$HOME/.cache}/cube-collaborator`.
- Electron profile, desktop bridge state and private helper commands:
  `${XDG_DATA_HOME:-$HOME/.local/share}/cube-collaborator`.
- Native canvas/workspace/session state: `$HOME/.collaborator`.
- Existing Claude Code/Codex sign-ins: their original paths; HOME is preserved.

`CUBE_COLLABORATOR_CACHE_DIR` and `CUBE_COLLABORATOR_DATA_DIR` can override the
first two locations. Updates replace the checksum-keyed runtime and retain
these persistent directories. Open external HTTP(S) links using the bridge's
link banner. Clipboard text uses the Paste control and the native paste shortcut.
Show app restores a minimized native window. Native file dialogs refer to the
cloud computer. Audio and custom-URI OAuth callbacks are not forwarded.

Current terminals use the native node-pty sidecar. Upstream's optional vendored
tmux binary is absent from the public source; legacy tmux session recovery needs
system tmux. No legacy sessions are created by this package.

## Validation

The isolated Linux CI build passed with the frozen Bun lockfile: 22 native
sidecar tests passed, one platform-specific test skipped, then production
renderer and Electron packaging succeeded. Run `node --test cube/*.test.mjs
cube/desktop/*.test.mjs` for download integrity, profile/environment preservation,
HTTP/WebSocket origin checks and process cleanup.

Read this document before changing the `cube/` package or its build workflow.
