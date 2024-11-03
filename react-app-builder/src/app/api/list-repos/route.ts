// src/app/api/list-repos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { listGitHubRepos } from '@/lib/github';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const repos = await listGitHubRepos(session.accessToken);
    return NextResponse.json(repos);
  } catch (error) {
    return NextResponse.json({ error: 'Error listing repos' }, { status: 500 });
  }
}