import { getGitHubUser, displayUserInfo, saveUserInfo, saveUserJson } from './github.js';

async function main(): Promise<void> {
  const username = 'gary-ascuy';

  try {
    const user = await getGitHubUser(username);
    displayUserInfo(user);
    await saveUserInfo(user, 'output/output.txt');
    await saveUserJson(user, 'output/output.json');
    console.log('\nResults saved to output/output.txt and output/output.json');
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    process.exit(1);
  }
}

main();
