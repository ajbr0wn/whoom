# Repository Guide

This repo contains a React frontend under `frontend/`. The application is built with React and TypeScript but most logic lives in `frontend/src` using JavaScript. No backend service is present; the browser directly contacts the LLM provider using an API key stored in `localStorage`.

## Developing
- Install dependencies with `npm install` inside `frontend/`.
- Run `npm start` to develop locally or `npm run build` to produce the static site.
- GitHub Pages deployment is handled by `.github/workflows/deploy-pages.yml`.

## Notes
- Test scaffolding from Create React App has been removed. No tests run during CI.
- Keep compiled output (`frontend/build`) out of version control.
