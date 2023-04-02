# hp
Homepage generator. Workflow:

  - Deno scripts and the GitHub API to fetch repo information
  - clone multiple public+private repositories
  - merge stuff into a Docker image

## Labels

These project labels are used and respected:

  - `hp-include` to forcefully include a fork repo; label won't be displayed
  - `hp-exclude` to exclude a non-fork repo
  - `game` / `util`/ `old` for categorization; label won't be displayed
  - `hacktoberfest` / `mindmap` labels won't be displayed
  - `7drl` / `webgl` / `websocket` / `3d-printing` will have prettified names
