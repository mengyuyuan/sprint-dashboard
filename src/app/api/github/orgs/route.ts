import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = (session as any).accessToken || process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ error: "No GitHub token" }, { status: 400 });

  // Fetch user's GitHub orgs
  const res = await fetch("https://api.github.com/user/orgs", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  const orgs = await res.json();

  return NextResponse.json({ orgs: Array.isArray(orgs) ? orgs : [] });
}
