# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**UIGen** — AI-powered React component generator. Users describe a UI in natural language via chat, and Claude generates React files into a virtual file system, displayed as a live preview in an iframe.

## Commands

```bash
npm run setup       # Full setup: install + prisma generate + migrate
npm run dev         # Dev server with Turbopack
npm run build       # Production build
npm run lint        # ESLint
npm run test        # Vitest (all tests)
npm run test -- --reporter=verbose src/components/chat  # Tests for a directory
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx  # Single test file
npm run db:reset    # Force reset SQLite database
```

`ANTHROPIC_API_KEY` in `.env` is required to use the real Claude model. Without it, the system falls back to `MockLanguageModel` with static demo components.

## Architecture

### Main flow: Chat → Generation → Preview

```
MessageInput → POST /api/chat (streaming)
    ↓
Claude (claude-haiku-4-5) with tools: str_replace_editor + file_manager
    ↓
onToolCall → FileSystemContext.handleToolCall() → VirtualFileSystem (in-memory)
    ↓
PreviewFrame (iframe) → JSX Transformer (Babel Standalone + importMap esm.sh)
```

The LLM never returns code directly — it calls tools (`str_replace_editor`, `file_manager`) that mutate the VirtualFileSystem. The preview reloads automatically when changes are detected.

### Layers

| Layer | Location | Responsibility |
|-------|----------|---------------|
| Next.js routes | `src/app/` | Pages and chat API route |
| Server Actions | `src/actions/` | Auth (JWT) and project CRUD via Prisma |
| Components | `src/components/` | Chat, Preview, Editor (Monaco), Auth |
| React Contexts | `src/lib/contexts/` | Client-side global state (chat + file system) |
| File System | `src/lib/file-system.ts` | VirtualFileSystem backed by `Map<string, FileNode>` |
| Transform | `src/lib/transform/jsx-transformer.ts` | Transpiles JSX with Babel and creates importMap |
| Tools | `src/lib/tools/` | Tool implementations invoked by Claude |
| Provider | `src/lib/provider.ts` | Returns `anthropic(...)` or `MockLanguageModel` |

### Virtual File System

No files are written to disk. `VirtualFileSystem` (`src/lib/file-system.ts`) is an in-memory Map. `FileSystemContext` exposes `handleToolCall()` which routes Claude's tool calls (`str_replace_editor`, `file_manager`) to VFS operations. State is serialized as JSON in the database (`data` column of the `Project` model).

### Persistence

- **Authenticated users**: messages + VFS state saved via Prisma (SQLite) in the chat's `onFinish` callback.
- **Anonymous users**: localStorage via `anon-work-tracker.ts` with usage limit tracking.

### Authentication

JWT httpOnly cookie (7 days). `getSession()` in `src/lib/auth.ts`. No external auth library — manual implementation with `bcrypt` + `jose`.

### Preview iframe

`PreviewFrame` (`src/components/preview/PreviewFrame.tsx`) detects entry points (`App.jsx`, `index.jsx`, etc.), builds an `importMap` pointing to `esm.sh` for external dependencies and `blob:` URLs for virtual files. Uses Babel Standalone for in-browser transpilation.

### Routing

- `/` — Home: redirects authenticated users to their most recent project (or creates one); anonymous users see `MainContent` without persistence.
- `/[projectId]` — Project page: verifies ownership before rendering.
- `/api/chat` — Streaming generation via Vercel AI SDK.

## Code Style

- Use comments sparingly. Only comment complex or non-obvious code.

## Database

The database schema is defined in `prisma/schema.prisma`. Reference it anytime you need to understand the structure of data stored in the database.

## Configuration

- `tsconfig.json`: alias `@/*` → `./src/*`
- `vitest.config.mts`: jsdom environment with tsconfig paths support
- Model in use: `claude-haiku-4-5` (defined in `src/lib/provider.ts`)
- System prompt in `src/lib/prompts/generation.tsx` — instructs Claude to use `/App.jsx` as entry point and Tailwind for styles
