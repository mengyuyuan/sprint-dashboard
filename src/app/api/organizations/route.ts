import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgs = await prisma.organization.findMany({
    where: { userId: (session.user as any).id },
  });

  return NextResponse.json({ orgs });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, githubOrg } = await req.json();
  const org = await prisma.organization.create({
    data: { name, githubOrg, userId: (session.user as any).id },
  });

  return NextResponse.json({ org });
}
