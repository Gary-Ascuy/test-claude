import { promises as fs } from 'fs';
import type { GitHubUser } from './types.js';

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  const url = `https://api.github.com/users/${username}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-User-Fetcher',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as GitHubUser;
  return data;
}

export function formatUserInfo(user: GitHubUser): string {
  const sections: string[] = [];

  sections.push('GitHub User Information');
  sections.push('========================');
  sections.push(`Username:     ${user.login}`);
  sections.push(`Name:         ${user.name || 'N/A'}`);
  sections.push(`Bio:          ${user.bio || 'N/A'}`);
  sections.push(`Location:     ${user.location || 'N/A'}`);
  sections.push(`Company:      ${user.company || 'N/A'}`);
  sections.push(`Email:        ${user.email || 'N/A'}`);
  sections.push(`Blog:         ${user.blog || 'N/A'}`);
  sections.push(`Twitter:      ${user.twitter_username || 'N/A'}`);
  sections.push('');
  sections.push('Stats');
  sections.push('-----');
  sections.push(`Public Repos:   ${user.public_repos}`);
  sections.push(`Public Gists:   ${user.public_gists}`);
  sections.push(`Followers:      ${user.followers}`);
  sections.push(`Following:      ${user.following}`);
  sections.push('');
  sections.push('Dates');
  sections.push('-----');
  sections.push(`Account Created: ${new Date(user.created_at).toLocaleDateString()}`);
  sections.push(`Profile Updated: ${new Date(user.updated_at).toLocaleDateString()}`);
  sections.push('');
  sections.push(`Profile URL: ${user.html_url}`);
  sections.push(`Avatar URL:  ${user.avatar_url}`);

  return sections.join('\n');
}

export function displayUserInfo(user: GitHubUser): void {
  console.log(formatUserInfo(user));
}

export async function saveUserInfo(user: GitHubUser, filepath: string): Promise<void> {
  const formatted = formatUserInfo(user);
  await fs.writeFile(filepath, formatted);
}

export async function saveUserJson(user: GitHubUser, filepath: string): Promise<void> {
  await fs.writeFile(filepath, JSON.stringify(user, null, 2));
}
