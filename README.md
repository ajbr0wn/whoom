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

Replace `<your-github-username>` with the owner of the repository. The backend
must be running separately (for example on your local machine or a server) and
the frontend can be configured to point to it via the
`REACT_APP_API_BASE_URL` environment variable when building.
