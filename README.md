# Character Decomposition Chat

This repository contains an experimental chat application that decomposes large language model (LLM) responses into distinct "characters" representing different perspectives. Users can select which characters to continue conversing with, creating branching conversations.

Development documentation can be found in [docs/development_plan.md](docs/development_plan.md).

## GitHub Pages

The React frontend is automatically deployed to GitHub Pages using GitHub
Actions. Once Pages is enabled for the repository, the latest build will be
available at:

```
https://<your-github-username>.github.io/whoom/
```

Replace `<your-github-username>` with the owner of the repository.

### Running entirely on GitHub Pages

GitHub Pages only hosts static files, so a Python backend cannot run there. To
use the app without a separate server you can run all language model calls
directly from the browser. In this mode users provide their own API key and the
frontend communicates with the LLM provider. See
[docs/github_pages_architecture.md](docs/github_pages_architecture.md) for a
description of this approach.

The previous FastAPI backend remains useful for local development or if you
prefer to proxy requests through your own service. When using a separate backend
the frontend can be configured via the `REACT_APP_API_BASE_URL` environment
variable when building.
