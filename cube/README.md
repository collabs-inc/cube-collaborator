# Collaborator in Cube

This integration is prepared from `collabs-inc/collab-public` source commit
`476b8efc942ee5f430a9b8bf832b8560a8cf76c2`. Upstream publishes no Linux
release artifact, so `.github/workflows/cube-linux.yml` builds the production
Linux x64 app on an isolated GitHub Actions runner. Cloud installation will use
the resulting checksum-pinned artifact and will not compile the monorepo.

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

Build and cloud runtime verification are pending. Read this document before
changing the `cube/` package or its build workflow.
