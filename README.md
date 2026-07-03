# SpinQueue — Web Client

A real-time React + TypeScript client for the [SpinQueue song-request API](../spinqueue-api).
DJs open a room, the crowd requests and upvotes songs from their phones, and the
vote-ranked queue updates **live over WebSocket** everywhere at once.

Built with **React 19**, **Vite**, **React Router 7**, and **Tailwind CSS v4**.

## Features

- **Live queue over WebSocket** — a single `useLiveQueue` hook subscribes to
  `/ws/sessions/:code`; every request, vote and status change pushes an update to
  the DJ console, every patron's phone, and the big screen simultaneously (with
  auto-reconnect).
- **Three surfaces, one session**
  - **DJ console** — open/close sessions, see the vote-ranked queue, and move
    tracks through `queued → playing → played` (or reject); only legal moves shown
  - **Patron view** — submit requests and upvote, with optimistic vote state
  - **Big screen** (`/screen/:code`) — a public, auth-free display for the venue
    showing the join code, now-playing, and the top of the queue
- **Auth** — login / register with a DJ-or-patron toggle, JWT persistence, and
  one-tap demo logins
- **Public by design where it counts** — the big screen and the patron watch view
  need no login (mirroring the API's public WebSocket); requesting & voting require
  an account
- **Nightlife design system** — Tailwind v4 `@theme` tokens (fuchsia→violet on
  near-black), glow effects, a live connection indicator, toasts, and a
  dependency-free icon set

## Getting started

The client expects the API on `http://127.0.0.1:8000`. Vite proxies both `/api`
(REST) and `/ws` (WebSocket) there — see [`vite.config.ts`](./vite.config.ts).

```bash
# 1) start the backend (in ../spinqueue-api)
cd ../spinqueue-api
source .venv/bin/activate
python -m scripts.seed      # a DJ, patrons, a live session with a few requests
uvicorn app.main:app        # serves REST + WebSocket on :8000

# 2) start this client
npm install
npm run dev                 # http://localhost:5173
```

### Try the full loop
1. On the login screen, click the **DJ** demo → you'll land on your sessions.
2. Open a session → note the **join code**, and open the **Big screen** in a new tab.
3. In another browser/incognito, sign in as the **Patron** demo, join with the code,
   and request a song. Watch it appear instantly on the DJ console and big screen.

## Scripts

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Vite dev server with API + WebSocket proxy |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

## Structure

```
src/
├── lib/            # api client, auth context, types, formatters,
│   └── useLiveQueue.ts   #   the WebSocket subscription hook
├── components/
│   ├── ui/         # Icon, Field, Spinner, Toast
│   ├── QueueList   # shared queue renderer (patron / dj / display modes)
│   ├── ConnDot     # realtime connection indicator
│   └── TopBar, Logo, StatusChip, ProtectedRoute
├── pages/          # Landing, Auth, DjSessions, DjConsole, JoinSession,
│                   #   PatronSession, BigScreen, NotFound
├── App.tsx         # routes
├── main.tsx        # providers (Router, Toast, Auth)
└── index.css       # Tailwind v4 theme + component layer
```
