import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGitHubUser, formatUserInfo } from '../src/github.js';
import type { GitHubUser } from '../src/types.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('getGitHubUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a GitHub user successfully', async () => {
    const mockUser: GitHubUser = {
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response);

    const result = await getGitHubUser('garyascuy');

    expect(result).toEqual(mockUser);
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
    const mockUser: GitHubUser = {
      login: 'testuser',
      id: 1,
      node_id: 'test',
      avatar_url: 'https://example.com/avatar.png',
      gravatar_id: '',
      url: '',
      html_url: '',
      followers_url: '',
      following_url: '',
      gists_url: '',
      starred_url: '',
      subscriptions_url: '',
      organizations_url: '',
      repos_url: '',
      events_url: '',
      received_events_url: '',
      type: 'User',
      site_admin: false,
      name: null,
      company: null,
      blog: null,
      location: null,
      email: null,
      hireable: null,
      bio: null,
      twitter_username: null,
      public_repos: 0,
      public_gists: 0,
      followers: 0,
      following: 0,
      created_at: '',
      updated_at: '',
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUser,
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
    company: 'Acme Corp',
    blog: 'https://garyascuy.com',
    location: 'Colombia',
    email: 'gary@example.com',
    hireable: true,
    bio: 'Software Developer',
    twitter_username: 'garyascuy',
    public_repos: 25,
    public_gists: 5,
    followers: 100,
    following: 50,
    created_at: '2015-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
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
      twitter_username: null,
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
