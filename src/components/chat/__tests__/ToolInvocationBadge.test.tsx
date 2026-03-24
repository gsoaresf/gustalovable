import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeInvocation(overrides: Partial<ToolInvocation> = {}): ToolInvocation {
  return {
    toolCallId: "test-id",
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "create", path: "/App.jsx" },
    ...overrides,
  } as ToolInvocation;
}

test("shows Creating for str_replace_editor create", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation()} />);
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows Editing for str_replace_editor str_replace", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({ args: { command: "str_replace", path: "/App.jsx" } })}
    />
  );
  expect(screen.getByText("Editing /App.jsx")).toBeDefined();
});

test("shows Editing for str_replace_editor insert", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({ args: { command: "insert", path: "/App.jsx" } })}
    />
  );
  expect(screen.getByText("Editing /App.jsx")).toBeDefined();
});

test("shows Reading for str_replace_editor view", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({ args: { command: "view", path: "/App.jsx" } })}
    />
  );
  expect(screen.getByText("Reading /App.jsx")).toBeDefined();
});

test("shows Undoing edit for str_replace_editor undo_edit", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({ args: { command: "undo_edit", path: "/App.jsx" } })}
    />
  );
  expect(screen.getByText("Undoing edit in /App.jsx")).toBeDefined();
});

test("shows Renaming for file_manager rename", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({
        toolName: "file_manager",
        args: { command: "rename", path: "/old.jsx" },
      })}
    />
  );
  expect(screen.getByText("Renaming /old.jsx")).toBeDefined();
});

test("shows Deleting for file_manager delete", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({
        toolName: "file_manager",
        args: { command: "delete", path: "/old.jsx" },
      })}
    />
  );
  expect(screen.getByText("Deleting /old.jsx")).toBeDefined();
});

test("shows spinner when in progress", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({ state: "call" } as Partial<ToolInvocation>)}
    />
  );
  expect(screen.getByTestId("spinner")).toBeDefined();
  expect(screen.queryByTestId("completed-indicator")).toBeNull();
});

test("shows green dot when completed", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation()} />);
  expect(screen.getByTestId("completed-indicator")).toBeDefined();
  expect(screen.queryByTestId("spinner")).toBeNull();
});

test("falls back to raw toolName for unknown tool and empty args", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation({ toolName: "unknown_tool", args: {} })}
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});
