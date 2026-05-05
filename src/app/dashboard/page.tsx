import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg">Sprint Dashboard</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{session.user.name}</span>
            <Link href="/api/auth/signout" className="text-sm text-gray-500 hover:text-gray-700">
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Sprint Calendar</h2>
            <p className="text-gray-500 text-sm">
              Connect your GitHub organization to see your team&apos;s issues here.
            </p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Metrics</h2>
            <div className="space-y-4">
              {[
                { label: "Time Saved", value: "Coming soon" },
                { label: "Tasks Assigned", value: "Coming soon" },
                { label: "Sprint Progress", value: "Coming soon" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-xs text-gray-500">{m.label}</p>
                  <p className="font-mono text-sm text-gray-400">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
