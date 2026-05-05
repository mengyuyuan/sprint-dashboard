"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CreateSprintModal from "@/components/CreateSprintModal";

interface Organization { id: string; name: string; githubOrg: string }
interface Sprint { id: string; name: string; startDate: string; endDate: string; tasks: Task[] }
interface Task { id: string; title: string; priority: string; status: string; assignee?: string; estimatedHours?: number }

export default function DashboardClient({ userName }: { userName: string }) {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/organizations")
      .then(r => r.json())
      .then(d => { if (d.orgs?.length) { setOrgs(d.orgs); setActiveOrg(d.orgs[0]); } })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeOrg) return;
    fetch(`/api/sprints?orgId=${activeOrg.id}`)
      .then(r => r.json())
      .then(d => setSprints(d.sprints || []));
  }, [activeOrg]);

  const createSprint = useCallback(async (name: string, start: string, end: string) => {
    if (!activeOrg) return;
    const res = await fetch("/api/sprints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, startDate: start, endDate: end, organizationId: activeOrg.id }),
    });
    if (res.ok) {
      const d = await res.json();
      setSprints(prev => [d.sprint, ...prev]);
      setShowCreateSprint(false);
    }
  }, [activeOrg]);

  const updateTask = useCallback(async (taskId: string, data: Partial<Task>) => {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, ...data }),
    });
    setSprints(prev => prev.map(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...data } : t),
    })));
  }, []);

  const priorityColor = (p: string) =>
    ({ urgent: "bg-red-100 text-red-700", high: "bg-orange-100 text-orange-700", medium: "bg-blue-100 text-blue-700", low: "bg-gray-100 text-gray-600" }[p] || "bg-gray-100");

  const statusColor = (s: string) =>
    ({ done: "bg-green-100 text-green-700", "in-progress": "bg-yellow-100 text-yellow-700", todo: "bg-purple-100 text-purple-700", backlog: "bg-gray-100 text-gray-600" }[s] || "bg-gray-100");

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-400">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg">Sprint Dashboard</span>
          <div className="flex items-center gap-3">
            {orgs.map(o => (
              <button
                key={o.id}
                onClick={() => setActiveOrg(o)}
                className={`text-sm px-3 py-1 rounded ${activeOrg?.id === o.id ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {o.name}
              </button>
            ))}
            <span className="text-sm text-gray-400">{userName}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {!activeOrg ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-2">Connect your GitHub org</h2>
            <p className="text-gray-500 mb-4">Import your team's issues to get started</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{activeOrg.name} — Sprints</h2>
              <button onClick={() => setShowCreateSprint(true)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700">
                + New Sprint
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {sprints.length === 0 && (
                  <div className="bg-white rounded-xl border p-12 text-center">
                    <p className="text-gray-400">No sprints yet. Create your first sprint to start planning.</p>
                  </div>
                )}
                {sprints.map(sprint => (
                  <div key={sprint.id} className="bg-white rounded-xl border">
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{sprint.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(sprint.startDate).toLocaleDateString()} → {new Date(sprint.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">{sprint.tasks.length} tasks</span>
                    </div>
                    <div className="divide-y">
                      {sprint.tasks.map(task => (
                        <div key={task.id} className="px-6 py-3 flex items-center gap-3 hover:bg-gray-50">
                          <select
                            value={task.status}
                            onChange={e => updateTask(task.id, { status: e.target.value })}
                            className={`text-xs px-2 py-1 rounded border-0 ${statusColor(task.status)}`}
                          >
                            <option value="backlog">Backlog</option>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                          <span className={`text-xs px-2 py-0.5 rounded ${priorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="flex-1 text-sm">{task.title}</span>
                          {task.assignee && <span className="text-xs text-gray-400">{task.assignee}</span>}
                          {task.estimatedHours && (
                            <span className="text-xs text-gray-400 font-mono">{task.estimatedHours}h</span>
                          )}
                        </div>
                      ))}
                      {sprint.tasks.length === 0 && (
                        <div className="px-6 py-8 text-center text-sm text-gray-400">
                          No tasks yet. Import issues from GitHub to get started.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold mb-4">Metrics</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Total Tasks", value: sprints.reduce((s, sp) => s + sp.tasks.length, 0) },
                      { label: "Completed", value: sprints.reduce((s, sp) => s + sp.tasks.filter(t => t.status === "done").length, 0) },
                      { label: "Active Sprints", value: sprints.length },
                      { label: "Avg Hours/Task", value: (() => {
                        const tasks = sprints.flatMap(s => s.tasks).filter(t => t.estimatedHours);
                        return tasks.length ? (tasks.reduce((s, t) => s + (t.estimatedHours || 0), 0) / tasks.length).toFixed(1) + "h" : "—";
                      })() },
                    ].map(m => (
                      <div key={m.label} className="flex justify-between">
                        <span className="text-sm text-gray-500">{m.label}</span>
                        <span className="text-sm font-mono font-semibold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {showCreateSprint && activeOrg && (
        <CreateSprintModal orgName={activeOrg.name} onCreateSprint={createSprint} onClose={() => setShowCreateSprint(false)} />
      )}
    </div>
  );
}
