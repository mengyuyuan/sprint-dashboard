import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId");
  const sprintId = searchParams.get("sprintId");

  const where: any = {};
  if (orgId) where.organizationId = orgId;
  if (sprintId) where.sprintId = sprintId;

  const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, priority, sprintId, organizationId, assignee, estimatedHours, githubIssueUrl } = await req.json();
  const task = await prisma.task.create({
    data: { title, description, priority, sprintId, organizationId, assignee, estimatedHours, githubIssueUrl },
  });
  return NextResponse.json({ task });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  const task = await prisma.task.update({ where: { id }, data });
  return NextResponse.json({ task });
}
