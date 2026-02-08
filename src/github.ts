// GitHub API module - exports functions for testing
// Run with: npx tsx fetch-github-user.ts

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubApiError {
  status: number;
  statusText: string;
  message: string;
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
