import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { repoName, githubRepoUrl, vercelToken } = await req.json();

  try {
    const response = await axios.post(
      'https://api.vercel.com/v13/deployments',
      {
        name: repoName,
        gitSource: {
          type: 'github',
          repo: githubRepoUrl,
          branch: 'main',  // or the branch name you want to deploy from
        },
      },
      {
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      deploymentUrl: response.data.url,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to deploy to Vercel' }, { status: 500 });
  }
}
