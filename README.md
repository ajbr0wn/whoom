# Character Decomposition Chat

This repository contains an experimental chat application that decomposes large language model (LLM) responses into distinct "characters" representing different perspectives. Users can select which characters to continue conversing with, creating branching conversations. Branches are listed in the interface so you can switch between them and explore multiple lines of thought. A small tree view in the sidebar visualizes how branches relate to each other.

Development documentation can be found in [docs/development_plan.md](docs/development_plan.md).

## GitHub Pages

The React frontend is automatically deployed to GitHub Pages using GitHub
Actions. Once Pages is enabled for the repository, the latest build will be
available at:

```
https://<your-github-username>.github.io/whoom/
```

Replace `<your-github-username>` with the owner of the repository.

To have the site show up when visiting `https://<your-github-username>.github.io`:

1. In your repository **Settings → Pages**, set the deployment source to **GitHub Actions** so the `deploy-pages.yml` workflow publishes the `frontend` build.
2. Optionally rename this repository to `<your-github-username>.github.io` or create a new repository with that name and copy the code over. GitHub only serves a user page from a repository named after your username.

### Running entirely on GitHub Pages

GitHub Pages only hosts static files, so the entire app now runs in the browser.
Users choose an LLM provider (OpenAI, Anthropic, Google Gemini or a local Llama
server) and supply the appropriate API key. The React frontend communicates
directly with the selected provider. See
[docs/github_pages_architecture.md](docs/github_pages_architecture.md) for a
description of this approach.

### Conversation Persistence

All branches and messages are automatically saved in your browser's local
storage. Reloading the page restores the previous conversation. Use the **Reset**
button in the interface to clear the stored data, **Export** to download a JSON
copy of your chat history, or **Import** to load a previously saved file.

### Human-Written Mode

Use the radio buttons below the branch controls to switch between **AI mode** and
**Human-written mode**. In human-written mode your input is treated as the next
assistant message. The text you supply is analyzed just like an AI response so
characters can still be selected and branched.

### Simulated LLM Workflow

During early development you may not want to contact a real language model. The
`frontend/src/services` folder now contains two API layers:

* `api.js` – returns simple simulated responses so you can test the interface
  without any network calls.
* `llmApi.js` – contains the actual provider logic for OpenAI, Anthropic,
  Gemini and local Llama.

The chat interface defaults to a **Simulated** provider so you can test
interactions without any API keys. Use the provider dropdown to select a real
LLM when you're ready to connect. The app automatically routes requests to
`llmApi.js` for the chosen provider.
\nA small Node script `simulate.mjs` demonstrates this mock workflow on the command line. Run `node simulate.mjs` and enter a message to receive a fake response and listed characters.
