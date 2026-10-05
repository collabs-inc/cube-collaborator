# Cube integration

Read [cube/README.md](cube/README.md) before changing the Cube package or Linux
build workflow. Preserve all upstream license and notice files. The original
`collabs-inc/collab-public` repository is not this integration's publish target.

Native sidecar tests require Node/libuv: use `bun x tsx --test` for
`collab-electron/src/main/sidecar/*.test.ts`, not `bun test`.
