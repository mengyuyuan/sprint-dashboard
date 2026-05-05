"use client";

import { useState } from "react";

type Task = { title: string; priority: string; estimatedHours?: number };

export default function TriageSwiper({ tasks, onUpdate }: { tasks: Task[]; onUpdate: (idx: number, priority: string) => void }) {
  const [index, setIndex] = useState(0);
  if (index >= tasks.length) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center">
        <p className="text-lg font-semibold mb-2">All tasks triaged! 🎉</p>
        <p className="text-gray-500 text-sm">{tasks.length} tasks prioritized</p>
      </div>
    );
  }

  const task = tasks[index];

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Quick Triage ({index + 1}/{tasks.length})</h3>
        <span className={`text-xs px-2 py-0.5 rounded ${
          task.priority === "urgent" ? "bg-red-100 text-red-700" :
          task.priority === "high" ? "bg-orange-100 text-orange-700" :
          "bg-gray-100 text-gray-600"
        }`}>
          {task.priority} · {task.estimatedHours}h
        </span>
      </div>
      <p className="text-sm font-medium mb-2">{task.title}</p>
      <div className="flex gap-2">
        {["urgent", "high", "medium", "low"].map(p => (
          <button
            key={p}
            onClick={() => { onUpdate(index, p); setIndex(i => i + 1); }}
            className={`flex-1 py-2 rounded text-xs font-semibold transition ${
              p === "urgent" ? "bg-red-600 text-white hover:bg-red-700" :
              p === "high" ? "bg-orange-500 text-white hover:bg-orange-600" :
              p === "medium" ? "bg-blue-500 text-white hover:bg-blue-600" :
              "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {p === "urgent" ? "↑ Urgent" : p === "high" ? "→ High" : p === "medium" ? "Medium" : "Low ↓"}
          </button>
        ))}
      </div>
    </div>
  );
}
