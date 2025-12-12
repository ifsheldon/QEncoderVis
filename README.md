# XQAI-Eyes

This is the source code of the XQAI-Eyes system from the paper _Towards Explainable Quantum AI: Informing the Encoder Selection of Quantum Neural Networks via Visualization_.

## Project Setup

We use `uv` and `bun` to manage dependencies and `poethepoet` to run tasks. To set up the project:

1. Install `uv` and `bun`
2. Run `uv sync` in `.`
3. (Optional) Edit `client/src/configs.json` to change the server address.
4. Run `uv run poe setup-client` to set up the frontend.

### Launch the application

1. run `uv run poe run-client` to launch the frontend
2. run `uv run poe run-server` to launch the backend
