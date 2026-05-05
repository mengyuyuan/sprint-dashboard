"use client";

import { useState } from "react";

type Props = {
  orgName: string;
  onCreateSprint: (name: string, start: string, end: string) => void;
  onClose: () => void;
};

export default function CreateSprintModal({ orgName, onCreateSprint, onClose }: Props) {
  const [name, setName] = useState("Sprint 1");
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10));
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);
  const [end, setEnd] = useState(endDate.toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-4">New Sprint — {orgName}</h3>
        <div className="space-y-3">
          <input className="w-full border rounded px-3 py-2 text-sm" value={name} onChange={e => setName(e.target.value)} placeholder="Sprint name" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Start</label>
              <input type="date" className="w-full border rounded px-3 py-2 text-sm" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">End</label>
              <input type="date" className="w-full border rounded px-3 py-2 text-sm" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>
          <button
            className="w-full bg-brand-600 text-white rounded-lg py-2 font-semibold hover:bg-brand-700"
            onClick={() => onCreateSprint(name, start, end)}
          >
            Create Sprint
          </button>
        </div>
      </div>
    </div>
  );
}
