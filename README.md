# GitHub User Fetcher

A TypeScript CLI tool to fetch and display GitHub user information.

## Features

- Fetch GitHub user profiles via the GitHub API
- Display formatted user information to console
- Save results to text and JSON files
- Written in TypeScript with full type safety
- Comprehensive unit tests with Vitest

## Installation

```bash
pnpm install
```

## Usage

### Fetch and display user info

```bash
pnpm start
```

This will fetch information for `gary-ascuy` and:
- Display the profile to the console
- Save formatted output to `output/output.txt`
- Save raw JSON to `output/output.json`

### Run tests

```bash
pnpm test
```

## Project Structure

```
.
├── src/
│   ├── types.ts       # Type definitions
│   ├── github.ts      # GitHub API client
│   └── main.ts        # CLI entry point
├── test/
│   └── github.test.ts # Unit tests
├── output/            # Generated output files (gitignored)
└── README.md
```

## API Types

The module uses camelCase for all type properties:

```typescript
interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  publicRepos: number;
  followers: number;
  // ... and more
}
```

## License

ISC
