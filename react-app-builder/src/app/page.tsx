"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import DraggableButton from "@/components/DraggableButton";
import DropArea from "@/components/DropArea";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Home() {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [repoUrl, setRepoUrl] = useState<string>("");

  useEffect(() => {
    if (session && session.accessToken) {
      fetchRepos();
    }
  }, [session]);

  const fetchRepos = async () => {
    try {
      const res = await axios.get("/api/list-repos");
      setRepos(res.data);
    } catch (error) {
      console.error("Error listing repos:", error);
    }
  };

  const initializeRepo = async () => {
    if (!selectedRepo) return;

    try {
      const res = await axios.post("/api/initialize-repo", {
        repoName: selectedRepo,
      });
      setRepoUrl(res.data.repoUrl);
    } catch (error) {
      console.error("Error initializing repo:", error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
    );
  }

  return (
    <div className="flex flex-col items-center p-10">
      <Button className="mb-4" onClick={() => signOut()}>
        Sign Out
      </Button>
      <div className="mb-4">
        <h3>Select a Repository</h3>
        <select
          onChange={(e) => setSelectedRepo(e.target.value)}
          value={selectedRepo}
        >
          <option value="">Select a repository</option>
          {repos.map((repo: any) => (
            <option key={repo.id} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>
        <Button onClick={initializeRepo} className="ml-2">
          Initialize Repo
        </Button>
      </div>
      {repoUrl && (
        <p>
          Repository initialized:{" "}
          <a href={repoUrl} target="_blank" rel="noopener noreferrer">
            {repoUrl}
          </a>
        </p>
      )}
      <div className="flex space-x-4">
        <div>
          <h3>Available Components</h3>
          <DraggableButton />
        </div>
        <div>
          <h3>Page Builder</h3>
          <DropArea />
        </div>
      </div>
    </div>
  );
}
