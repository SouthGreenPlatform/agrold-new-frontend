# frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### No Type-Check, Compile and Minify for Production

```sh
npm run build
```

## LLM Chat & SPARQL Flow

- Open the new chat page at `/chat` to talk with the LLM.
- If the assistant generates a SPARQL query, buttons appear to:
  - open the query in the SPARQL editor,
  - or download the query as `query.sparql`.
- From the SPARQL editor, the "Explain" action opens the chat page in a new tab and preserves the explanation request.
- The SPARQL editor also supports loading a predefined query pattern via URL, for example:
  - `/sparql-editor?patternId=1`
  - `/sparql-editor?patternId=4`

### Query Pattern Links in Markdown

To create a markdown link that opens the SPARQL editor with a pattern preselected, use a direct link to the editor page with the `patternId` query parameter. Example:

```md
[Open pattern 3 in the SPARQL editor](/sparql-editor?patternId=3)
```

### Commit and Push

```sh
git commit -m "--message--" & git push
```

<!-- ### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
``` -->
