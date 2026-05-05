import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");
  return <DashboardClient userName={session.user.name || ""} />;
}
