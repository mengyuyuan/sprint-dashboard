import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId, githubOrg } = await req.json();

  // Fetch issues from GitHub org repos
  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 });

  // Get repos for the org
  const reposRes = await fetch(`https://api.github.com/orgs/${githubOrg}/repos?per_page=10&sort=updated`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  const repos = await reposRes.json();
  if (!Array.isArray(repos)) return NextResponse.json({ error: "Failed to fetch repos", detail: repos }, { status: 500 });

  let imported = 0;
  for (const repo of repos.slice(0, 5)) {
    const issuesRes = await fetch(
      `https://api.github.com/repos/${githubOrg}/${repo.name}/issues?state=open&per_page=20&sort=created`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
    );
    const issues = await issuesRes.json();
    if (!Array.isArray(issues)) continue;

    for (const issue of issues) {
      if (issue.pull_request) continue; // Skip PRs
      const priority = issue.labels?.some((l: any) => l.name?.toLowerCase().includes("bug")) ? "high"
        : issue.labels?.some((l: any) => l.name?.toLowerCase().includes("urgent")) ? "urgent"
        : issue.labels?.some((l: any) => l.name?.toLowerCase().includes("enhancement")) ? "medium"
        : "low";

      await prisma.task.create({
        data: {
          title: issue.title,
          description: issue.body?.slice(0, 500),
          priority,
          status: "backlog",
          githubIssueUrl: issue.html_url,
          assignee: issue.assignee?.login || null,
          organizationId: orgId,
        },
      });
      imported++;
    }
  }

  return NextResponse.json({ imported });
}
