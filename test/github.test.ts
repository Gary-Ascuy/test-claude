import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGitHubUser, formatUserInfo } from '../src/github.js';
import type { GitHubUser } from '../src/types.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

const mockApiResponse = {
  login: 'garyascuy',
  id: 123456,
  node_id: 'MDQ6VXNlcjEyMzQ1Ng==',
  avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/garyascuy',
  html_url: 'https://github.com/garyascuy',
  followers_url: 'https://api.github.com/users/garyascuy/followers',
  following_url: 'https://api.github.com/users/garyascuy/following{/other_user}',
  gists_url: 'https://api.github.com/users/garyascuy/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/garyascuy/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/garyascuy/subscriptions',
  organizations_url: 'https://api.github.com/users/garyascuy/orgs',
  repos_url: 'https://api.github.com/users/garyascuy/repos',
  events_url: 'https://api.github.com/users/garyascuy/events{/privacy}',
  received_events_url: 'https://api.github.com/users/garyascuy/received_events',
  type: 'User',
  site_admin: false,
  name: 'Gary Ascuy',
  company: null,
  blog: '',
  location: 'Colombia',
  email: null,
  hireable: null,
  bio: 'Software Developer',
  twitter_username: null,
  public_repos: 25,
  public_gists: 5,
  followers: 100,
  following: 50,
  created_at: '2015-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const expectedUser: GitHubUser = {
  login: 'garyascuy',
  id: 123456,
  nodeId: 'MDQ6VXNlcjEyMzQ1Ng==',
  avatarUrl: 'https://avatars.githubusercontent.com/u/123456?v=4',
  gravatarId: '',
  url: 'https://api.github.com/users/garyascuy',
  htmlUrl: 'https://github.com/garyascuy',
  followersUrl: 'https://api.github.com/users/garyascuy/followers',
  followingUrl: 'https://api.github.com/users/garyascuy/following{/other_user}',
  gistsUrl: 'https://api.github.com/users/garyascuy/gists{/gist_id}',
  starredUrl: 'https://api.github.com/users/garyascuy/starred{/owner}{/repo}',
  subscriptionsUrl: 'https://api.github.com/users/garyascuy/subscriptions',
  organizationsUrl: 'https://api.github.com/users/garyascuy/orgs',
  reposUrl: 'https://api.github.com/users/garyascuy/repos',
  eventsUrl: 'https://api.github.com/users/garyascuy/events{/privacy}',
  receivedEventsUrl: 'https://api.github.com/users/garyascuy/received_events',
  type: 'User',
  siteAdmin: false,
  name: 'Gary Ascuy',
  company: null,
  blog: '',
  location: 'Colombia',
  email: null,
  hireable: null,
  bio: 'Software Developer',
  twitterUsername: null,
  publicRepos: 25,
  publicGists: 5,
  followers: 100,
  following: 50,
  createdAt: '2015-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('getGitHubUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a GitHub user successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const result = await getGitHubUser('garyascuy');

    expect(result).toEqual(expectedUser);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/users/garyascuy',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-User-Fetcher',
        },
      }
    );
  });

  it('should throw an error when user is not found (404)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    await expect(getGitHubUser('nonexistentuser')).rejects.toThrow(
      'GitHub API returned 404: Not Found'
    );
  });

  it('should throw an error for other API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(getGitHubUser('garyascuy')).rejects.toThrow(
      'GitHub API returned 500: Internal Server Error'
    );
  });

  it('should construct correct API URL for different usernames', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockApiResponse, login: 'octocat' }),
    } as Response);

    await getGitHubUser('octocat');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/users/octocat',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-User-Fetcher',
        }),
      })
    );
  });
});

describe('formatUserInfo', () => {
  const mockUser: GitHubUser = {
    login: 'garyascuy',
    id: 123456,
    nodeId: 'MDQ6VXNlcjEyMzQ1Ng==',
    avatarUrl: 'https://avatars.githubusercontent.com/u/123456?v=4',
    gravatarId: '',
    url: 'https://api.github.com/users/garyascuy',
    htmlUrl: 'https://github.com/garyascuy',
    followersUrl: 'https://api.github.com/users/garyascuy/followers',
    followingUrl: 'https://api.github.com/users/garyascuy/following{/other_user}',
    gistsUrl: 'https://api.github.com/users/garyascuy/gists{/gist_id}',
    starredUrl: 'https://api.github.com/users/garyascuy/starred{/owner}{/repo}',
    subscriptionsUrl: 'https://api.github.com/users/garyascuy/subscriptions',
    organizationsUrl: 'https://api.github.com/users/garyascuy/orgs',
    reposUrl: 'https://api.github.com/users/garyascuy/repos',
    eventsUrl: 'https://api.github.com/users/garyascuy/events{/privacy}',
    receivedEventsUrl: 'https://api.github.com/users/garyascuy/received_events',
    type: 'User',
    siteAdmin: false,
    name: 'Gary Ascuy',
    company: 'Acme Corp',
    blog: 'https://garyascuy.com',
    location: 'Colombia',
    email: 'gary@example.com',
    hireable: true,
    bio: 'Software Developer',
    twitterUsername: 'garyascuy',
    publicRepos: 25,
    publicGists: 5,
    followers: 100,
    following: 50,
    createdAt: '2015-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  it('should format user information correctly', () => {
    const result = formatUserInfo(mockUser);

    expect(result).toContain('garyascuy');
    expect(result).toContain('Gary Ascuy');
    expect(result).toContain('Software Developer');
    expect(result).toContain('Colombia');
    expect(result).toContain('Acme Corp');
    expect(result).toContain('gary@example.com');
    expect(result).toContain('https://garyascuy.com');
    expect(result).toContain('garyascuy');
  });

  it('should display stats correctly', () => {
    const result = formatUserInfo(mockUser);

    expect(result).toContain('Public Repos:   25');
    expect(result).toContain('Public Gists:   5');
    expect(result).toContain('Followers:      100');
    expect(result).toContain('Following:      50');
  });

  it('should handle null values gracefully', () => {
    const userWithNulls: GitHubUser = {
      ...mockUser,
      name: null,
      company: null,
      blog: null,
      location: null,
      email: null,
      bio: null,
      twitterUsername: null,
    };

    const result = formatUserInfo(userWithNulls);

    expect(result).toContain('N/A');
    expect(result).toMatch(/Name:\s+N\/A/);
    expect(result).toMatch(/Bio:\s+N\/A/);
    expect(result).toMatch(/Location:\s+N\/A/);
  });

  it('should include profile and avatar URLs', () => {
    const result = formatUserInfo(mockUser);

    expect(result).toContain('https://github.com/garyascuy');
    expect(result).toContain('https://avatars.githubusercontent.com/u/123456?v=4');
  });

  it('should format dates correctly', () => {
    const result = formatUserInfo(mockUser);

    expect(result).toContain('Account Created:');
    expect(result).toContain('Profile Updated:');
  });
});
