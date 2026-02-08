import { promises as fs } from 'fs';
import type { GitHubUser, GitHubApiResponse } from './types.js';

function toCamelCase(data: GitHubApiResponse): GitHubUser {
  return {
    login: data.login,
    id: data.id,
    nodeId: data.node_id,
    avatarUrl: data.avatar_url,
    gravatarId: data.gravatar_id,
    url: data.url,
    htmlUrl: data.html_url,
    followersUrl: data.followers_url,
    followingUrl: data.following_url,
    gistsUrl: data.gists_url,
    starredUrl: data.starred_url,
    subscriptionsUrl: data.subscriptions_url,
    organizationsUrl: data.organizations_url,
    reposUrl: data.repos_url,
    eventsUrl: data.events_url,
    receivedEventsUrl: data.received_events_url,
    type: data.type,
    siteAdmin: data.site_admin,
    name: data.name,
    company: data.company,
    blog: data.blog,
    location: data.location,
    email: data.email,
    hireable: data.hireable,
    bio: data.bio,
    twitterUsername: data.twitter_username,
    publicRepos: data.public_repos,
    publicGists: data.public_gists,
    followers: data.followers,
    following: data.following,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

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

  const data = await response.json() as GitHubApiResponse;
  return toCamelCase(data);
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
  sections.push(`Twitter:      ${user.twitterUsername || 'N/A'}`);
  sections.push('');
  sections.push('Stats');
  sections.push('-----');
  sections.push(`Public Repos:   ${user.publicRepos}`);
  sections.push(`Public Gists:   ${user.publicGists}`);
  sections.push(`Followers:      ${user.followers}`);
  sections.push(`Following:      ${user.following}`);
  sections.push('');
  sections.push('Dates');
  sections.push('-----');
  sections.push(`Account Created: ${new Date(user.createdAt).toLocaleDateString()}`);
  sections.push(`Profile Updated: ${new Date(user.updatedAt).toLocaleDateString()}`);
  sections.push('');
  sections.push(`Profile URL: ${user.htmlUrl}`);
  sections.push(`Avatar URL:  ${user.avatarUrl}`);

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
