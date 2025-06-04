# Character Decomposition Chat Development Plan

This document outlines the current vision and feature set for **Character Decomposition Chat**. The goal is to create a chat interface where each LLM response is automatically analyzed and divided into "characters" that represent distinct reasoning patterns. Users can then choose which characters to engage with, producing branched conversations similar to Loom but focused on perspectives rather than purely alternate completions.

## Goals and Philosophy

* Make implicit reasoning within LLM responses visible and interactive.
* Provide users with metacognitive insight by exposing different perspectives behind a single answer.
* Allow conversations to branch by selecting one or more characters to continue with.
* Maintain authenticity: the LLM generates normal responses, then a second analysis pass decomposes them without asking the LLM to role‑play.

## Key Features

1. **Response Decomposition**
   - User message is sent to the LLM to generate a complete response.
   - The same LLM is called again to analyze that response and identify 2‑5 perspectives.
   - Each perspective becomes a "character" with a name, short description, and the text segments attributed to it.

2. **Character‑Based Branching**
   - Characters from a response are displayed to the user with checkboxes.
   - The user selects one, several, or all characters to continue the dialogue.
   - Each selection spawns a new branch that retains only the context associated with the chosen characters.

3. **Dynamic Character System**
   - Characters may merge, split, or disappear as the conversation evolves.
   - New characters can appear when new topics or reasoning styles emerge.
   - The LLM is not explicitly asked to role‑play; characters are a post‑processing interpretation of its responses.

4. **Dual Interaction Modes**
   - **AI mode**: the LLM generates text which is then decomposed.
   - **Human‑written mode**: users can supply their own text to be decomposed in the same way.
   - Hybrid flows are possible, similar to how AI Dungeon allows both AI and human turns.

5. **Web Interface**
   - A static React frontend communicates directly with the LLM provider.
   - The user supplies an API key which is stored locally in the browser.
   - Characters and branches are visualized, starting with a simple tree view.

## Architecture

```
User input ─► LLM completion ─► response
                │
                └─► LLM analysis ─► character list
```

1. **Generation**: The frontend sends the conversation history and selected characters directly to the LLM provider to produce the next assistant message.
2. **Analysis**: The same response is analyzed by the LLM provider (in a separate call) to detect perspectives and produce character metadata.
3. **Client**: The frontend displays the attributed text and lets the user choose which characters should participate in the next turn.

## Considered Approaches

* **Explicit roleplay prompts** were rejected to avoid forcing the LLM into performance mode.
* **Separate contexts per character** would complicate merging and coherence; a shared context with character-aware summaries is preferred.
* **Tree-style multiverse visualization** inspired by Janus' Loom is planned, though initial versions will be simpler.

## Open Questions

* How best to track character persistence and evolution across many turns?
* What summarization technique should keep past context manageable without losing important character details?
* How should new characters be introduced or old ones retired in long conversations?

## Roadmap

1. **MVP**
   - Basic chat interface with character decomposition using mock data.
   - Checkbox character selection and single-level branching.
   - Documentation and initial setup scripts.

2. **Core Features**
   - Integrate real LLM APIs for generation and analysis.
   - Support multiple branching levels and store branch history.
   - Improve visualization of characters and branches.

3. **Enhanced Experience**
   - Allow user-written text decomposition and hybrid turns.
   - Implement advanced character evolution (merging, splitting, new appearances).
   - Provide options to save conversations and character configurations.

4. **Long Term**
   - Expose the character decomposition as an API for other tools.
   - Explore collaborative sessions and sharing of interesting branches.
   - Research insights from character patterns as a form of LLM interpretability.

