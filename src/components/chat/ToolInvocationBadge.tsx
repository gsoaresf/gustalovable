"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

function getLabel(toolName: string, args: unknown): string {
  const a = args as Record<string, unknown>;
  const path = typeof a?.path === "string" ? a.path : "";
  const command = typeof a?.command === "string" ? a.command : "";

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":     return `Creating ${path}`;
      case "str_replace":
      case "insert":     return `Editing ${path}`;
      case "view":       return `Reading ${path}`;
      case "undo_edit":  return `Undoing edit in ${path}`;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename": return `Renaming ${path}`;
      case "delete": return `Deleting ${path}`;
    }
  }

  return toolName;
}

interface Props {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationBadge({ toolInvocation }: Props) {
  const isDone = toolInvocation.state === "result" && toolInvocation.result;
  const label = getLabel(toolInvocation.toolName, toolInvocation.args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div data-testid="completed-indicator" className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 data-testid="spinner" className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
