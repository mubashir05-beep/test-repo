// src/app/api/create-repo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {  initializeViteProject } from '@/lib/github';
import { authOptions } from '../auth/[...nextauth]/route';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { repoName } = await req.json();

  try {
    // const repoData = await createGitHubRepo(session.accessToken, repoName);
    // const repoPath = path.join(process.cwd(), 'repos', repoData.full_name);
    // fs.mkdirSync(repoPath, { recursive: true });
    // await initializeViteProject(repoPath);
    // return NextResponse.json({ repoUrl: repoData.html_url });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating repo' }, { status: 500 });
  }
}