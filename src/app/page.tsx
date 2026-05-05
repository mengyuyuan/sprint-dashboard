import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
        Sprint Dashboard
      </h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        AI-powered sprint planning for engineering managers. Connect your GitHub
        organization and let AI prioritize your team&apos;s backlog.
      </p>
      <Link
        href="/api/auth/signin"
        className="rounded-lg bg-brand-600 text-white px-6 py-3 font-semibold hover:bg-brand-700 transition"
      >
        Sign in with GitHub
      </Link>
      <div className="mt-16 grid gap-6 sm:grid-cols-3 max-w-3xl">
        {[
          { title: "Auto-Prioritize", desc: "AI reads your issues and ranks by business impact" },
          { title: "Smart Scheduling", desc: "Calendar view with automatic time estimates" },
          { title: "Save Hours", desc: "Cut sprint planning from hours to minutes" },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border bg-white p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
