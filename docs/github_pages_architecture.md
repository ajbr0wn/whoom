# GitHub Pages Compatible Architecture

GitHub Pages only serves static files and cannot host a Python backend. To run the full application directly from Pages, the backend functionality needs to move to the browser.

## Client-Only Approach

1. **Static React Frontend** – The `frontend/` project builds to static files that GitHub Pages hosts.
2. **User Supplied API Key** – When the page loads, the user selects an LLM provider (OpenAI, Anthropic, Gemini or a local Llama server) and enters the corresponding API key. The key is stored only in memory for the current session and sent with each request.
3. **LLM Calls From the Browser** – The React app calls the language model APIs directly using the provided key. Both generation and analysis happen client‑side.
4. **No Server Required** – Because all requests go straight to the LLM provider, no FastAPI service or other backend needs to be running.

This approach keeps the deployment entirely within GitHub Pages while still providing all functionality.

## Optional Serverless Backend

If maintaining an API key in the client is not desired, you can deploy a small serverless function (for example on Cloudflare Workers or AWS Lambda) that proxies the LLM requests. The React frontend on GitHub Pages can then call this function instead of contacting the LLM provider directly.

