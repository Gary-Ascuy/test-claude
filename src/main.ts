// TypeScript script to fetch GitHub user information
// Run with: pnpm tsx src/main.ts

import { getGitHubUser, displayUserInfo } from './github.js';

async function main(): Promise<void> {
  const username = 'gary-ascuy';

  try {
    const user = await getGitHubUser(username);
    displayUserInfo(user);
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    process.exit(1);
  }
}

main();
