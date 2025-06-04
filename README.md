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

GitHub Pages only hosts static files, so the entire app now runs in the browser.
Users provide their own API key and the React frontend communicates directly
with the LLM provider. See
[docs/github_pages_architecture.md](docs/github_pages_architecture.md) for a
description of this approach.
