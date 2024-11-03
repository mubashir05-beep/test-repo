// src/lib/github.ts
import axios from 'axios';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export const listGitHubRepos = async (accessToken: string) => {
  const url = 'https://api.github.com/user/repos';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json',
  };

  let repos: any[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await axios.get(url, {
        headers,
        params: {
          per_page: 100, // Maximum allowed per page
          page,
          sort: 'updated', // Sort by updated_at
        },
      });

      repos = repos.concat(response.data);
      hasMore = response.data.length === 100;
      page += 1;
    }

    // Sort the final list of repositories by updated_at in descending order
    repos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return repos;
  } catch (error: any) {
    console.error('Error listing GitHub repos:', error.response?.data || error.message);
    throw error;
  }
};

export const initializeViteProject = (repoPath: string) => {
  return new Promise((resolve, reject) => {
    exec(`npx create-vite@latest ${repoPath} --template react`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error initializing Vite project: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};