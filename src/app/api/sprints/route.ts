import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const sprints = await prisma.sprint.findMany({
    where: { organizationId: orgId },
    include: { tasks: { orderBy: { priority: "asc" } } },
    orderBy: { startDate: "desc" },
  });

  return NextResponse.json({ sprints });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, startDate, endDate, organizationId } = await req.json();
  const sprint = await prisma.sprint.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      organizationId,
    },
  });

  return NextResponse.json({ sprint });
}
