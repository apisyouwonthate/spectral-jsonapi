# Contributing

Thanks for helping improve Spectral JSON:API.

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Build the ruleset:

```bash
npm run build
```

## Project Layout

- TypeScript source of truth: [src/ruleset.ts](src/ruleset.ts)
- Generated JS/types output: [dist/](dist/)
- Generated YAML ruleset: [.spectral.yml](.spectral.yml)
- Rule tests: [__tests__/](__tests__)
- Example documents: [examples/](examples)

## Rule Change Workflow

1. Add or update the rule implementation in [src/ruleset.ts](src/ruleset.ts).
2. Add or update tests for the same rule in [__tests__/](__tests__).
3. Update examples if behavior changes:
- valid examples in [examples/valid/](examples/valid)
- invalid examples in [examples/invalid/](examples/invalid)
4. Run tests before opening a PR:

```bash
npm test
```

5. If your change affects generated artifacts, rebuild:

```bash
npm run build
```

## Testing Approach

This project follows per-rule Jest tests, based on some quirky testing patterns for Spectral rulesets I devised when working at Stoplight, a lot of help from the rest of the team.

The approach was outlined in this article: https://apisyouwonthate.com/blog/testing-spectral-style-guides-with-jest/

## Legacy YAML Notes

The legacy YAML file [.spectral.yml](.spectral.yml) is generated from TypeScript.

It is intended to include rules that rely only on Spectral core functions. At the moment all rules in this ruleset are using core functions so the two rulesets are identical, but this may change in the future.

## Pull Requests

- Keep PRs focused and scoped.
- Prefer small, reviewable commits.
- Include a short summary of what changed and why.
- Mention any rule behavior changes that may affect downstream users.

## Automated Releases

Releases are automated with semantic-release via GitHub Actions on pushes to `main`.

- Commits should follow Conventional Commits (`feat:`, `fix:`, `feat!:`) so the next version can be calculated correctly.
- The workflow publishes to npm and creates a GitHub release and tag like `v2.1.0`.
