import { NextResponse } from "next/server";

// Simple AI priority heuristic — can be replaced with LLM call
function suggestPriority(title: string, description: string, labels: string[]): {
  priority: string;
  estimatedHours: number;
  reason: string;
} {
  const text = (title + " " + description + " " + labels.join(" ")).toLowerCase();

  // Bug detection
  if (/bug|fix|broken|crash|error|fail|regression/.test(text)) {
    return { priority: "urgent", estimatedHours: 4, reason: "Bug/fix detected — needs immediate attention" };
  }

  // Security
  if (/security|vuln|exploit|inject|xss|csrf/.test(text)) {
    return { priority: "urgent", estimatedHours: 6, reason: "Security issue — critical priority" };
  }

  // Feature with dependencies
  if (/api|migration|schema|database|auth/.test(text)) {
    return { priority: "high", estimatedHours: 8, reason: "Backend/infra change — high impact" };
  }

  // UI/UX
  if (/ui|ux|design|style|css|component|layout/.test(text)) {
    return { priority: "medium", estimatedHours: 3, reason: "Frontend improvement — moderate effort" };
  }

  // Documentation
  if (/doc|readme|wiki|guide/.test(text)) {
    return { priority: "low", estimatedHours: 1, reason: "Documentation task — low urgency" };
  }

  // Default
  const wordCount = text.split(/\s+/).length;
  const estimatedHours = Math.max(1, Math.ceil(wordCount / 50));
  return { priority: "medium", estimatedHours, reason: "General task — auto-estimated from description length" };
}

export async function POST(req: Request) {
  const { title, description, labels } = await req.json();
  const result = suggestPriority(title || "", description || "", labels || []);
  return NextResponse.json(result);
}
