import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises'; // Using promises API
import { authOptions } from '../auth/[...nextauth]/route';

// Function to create an HTML file
const createHtmlFile = async (repoPath: string) => {
  const filePath = path.join(repoPath, 'index.html');
  const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sample HTML File</title>
    </head>
    <body>
        <h1>Hello, World!</h1>
        <p>This is a sample HTML file.</p>
    </body>
    </html>
  `;

  await fs.writeFile(filePath, content);
  console.log(`HTML file created at ${filePath}`);
  return filePath;
};

// Function to push changes to GitHub
const gitPush = (repoPath: string, repoUrl: string, accessToken: string) => {
  return new Promise((resolve, reject) => {
    const authRepoUrl = repoUrl.replace('https://', `https://${accessToken}@`);

    process.chdir(repoPath);

    exec('git remote -v', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error checking remote: ${error.message}`);
        reject(new Error(`Failed to check remote: ${stderr || stdout}`));
        return;
      }

      // Check if the remote exists
      if (!stdout.includes('origin')) {
        exec(`git remote add origin ${repoUrl}`, (error) => {
          if (error) {
            console.error(`Error adding remote: ${error.message}`);
            reject(new Error(`Failed to add remote: ${stderr || stdout}`));
            return;
          }
        });
      }

      // Pull and push using 'main' branch
      exec(`git pull origin main --allow-unrelated-histories && git add . && git commit -m "Initial commit" && git push -u ${authRepoUrl} main`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error pushing to GitHub: ${error.message}`);
          reject(new Error(`Git push failed: ${stderr || stdout}`));
          return;
        }
        if (stderr) {
          console.warn(`Warning: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      });
    });
  });
};


// Placeholder function for Vercel deployment
import fetch from 'node-fetch';

const deployToVercel = async (repoUrl: string, accessToken: string) => {
  const projectName = 'YOUR_PROJECT_NAME'; // Replace with your actual project name
  const vercelApiUrl = `https://api.vercel.com/v1/deployments`;

  // Prepare the deployment request
  const deploymentPayload = {
    name: projectName, // Name of your Vercel project
    gitSource: {
      type: 'github',
      repo: repoUrl.replace('https://', ''), // Remove https:// for the API request
      branch: 'master', // Specify the branch you want to deploy
    },
  };

  try {
    console.log(`Deploying ${repoUrl} to Vercel...`);

    // Make the request to Vercel's API
    const response = await fetch(vercelApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deploymentPayload),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Vercel deployment failed: ${errorMessage}`);
    }

    const deploymentResult:any = await response.json();
    console.log(`Deployment successful! View at: ${deploymentResult.url}`);
  } catch (error:any) {
    console.error(`Error deploying to Vercel: ${error.message}`);
    throw error; // Rethrow the error to be handled by the caller
  }
};


export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  console.log('Session:', session);

  const { repoName } = await req.json();
  const repoUrl = `https://github.com/mubashir05-beep/${repoName}.git`; // Use the authenticated user's username

  try {
    const repoPath = path.join(process.cwd(), 'repos', repoName);
    await fs.mkdir(repoPath, { recursive: true }); // Use promises API for async creation

    // Create HTML file
    await createHtmlFile(repoPath);

    // Push to GitHub
    await gitPush(repoPath, repoUrl, session.accessToken);

    // Deploy to Vercel
    await deployToVercel(repoUrl, session.accessToken);

    return NextResponse.json({ repoUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error initializing repo' }, { status: 500 });
  }
}
