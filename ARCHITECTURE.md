# NebulaBoard X - Architecture Documentation

## Overview

NebulaBoard X is a production-ready, real-time collaborative infinite whiteboard SaaS built with cutting-edge web technologies. This document outlines the architectural decisions, folder structure, and key design patterns.

## Tech Stack

### Frontend
- **Next.js 13** (App Router) - React framework with server components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Advanced animations
- **Konva.js / React-Konva** - High-performance canvas rendering
- **Zustand** - Lightweight state management
- **Socket.IO Client** - Real-time communication

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Socket.IO** - WebSocket server for real-time collaboration
- **Supabase** - PostgreSQL database, authentication, and storage

### Infrastructure
- **Vercel** - Frontend hosting and edge functions
- **Supabase** - Database and real-time backend

---

## Folder Structure

```
nebulaboard-x/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── socket/               # Socket.IO endpoint
│   ├── board/                    # Board pages
│   │   └── [id]/                 # Dynamic board route
│   ├── dashboard/                # User dashboard
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── canvas/                   # Canvas-specific components
│   │   ├── InfiniteCanvas.tsx    # Main canvas component
│   │   ├── CanvasObject.tsx      # Individual object renderer
│   │   ├── Grid.tsx              # Animated grid background
│   │   └── Minimap.tsx           # Navigation minimap
│   ├── collaboration/            # Real-time collaboration UI
│   │   ├── CursorTracker.tsx     # Other users' cursors
│   │   ├── UserList.tsx          # Active collaborators
│   │   └── PresenceIndicator.tsx # Online status
│   ├── layout/                   # Layout components
│   │   ├── Toolbar.tsx           # Main toolbar
│   │   ├── Sidebar.tsx           # Collapsible sidebar
│   │   ├── CommandPalette.tsx    # Keyboard shortcuts menu
│   │   └── ThemeSelector.tsx     # Theme switcher
│   ├── objects/                  # Canvas object components
│   │   ├── Shape.tsx             # Rectangle, circle, diamond, arrow
│   │   ├── StickyNote.tsx        # Sticky notes with emoji
│   │   ├── TextBlock.tsx         # Rich text
│   │   ├── Drawing.tsx           # Freehand drawings
│   │   └── Connector.tsx         # Smart connectors
│   └── ui/                       # shadcn/ui components
│
├── lib/                          # Core library code
│   ├── canvas/                   # Canvas engine
│   │   ├── coordinates.ts        # World ↔ Screen transformations
│   │   ├── object-factory.ts     # Object creation utilities
│   │   ├── performance.ts        # Viewport culling, throttling
│   │   └── connectors.ts         # Auto-routing logic
│   ├── store/                    # Zustand stores
│   │   ├── canvas-store.ts       # Canvas objects & viewport
│   │   ├── collaboration-store.ts # Users, cursors, locks
│   │   └── board-store.ts        # Board metadata & history
│   ├── socket/                   # Real-time communication
│   │   ├── socket-client.ts      # Socket.IO client wrapper
│   │   └── event-handlers.ts     # Event processing
│   ├── theme/                    # Theme system
│   │   └── themes.ts             # Theme configurations
│   ├── supabase/                 # Database client
│   │   └── client.ts             # Supabase configuration
│   └── utils.ts                  # Utility functions
│
├── types/                        # TypeScript type definitions
│   ├── canvas.ts                 # Canvas object types
│   ├── collaboration.ts          # Collaboration types
│   └── board.ts                  # Board metadata types
│
├── hooks/                        # Custom React hooks
│   ├── use-canvas.ts             # Canvas interaction hooks
│   ├── use-collaboration.ts      # Real-time hooks
│   └── use-keyboard.ts           # Keyboard shortcuts
│
├── public/                       # Static assets
│   └── assets/                   # Images, fonts, etc.
│
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
└── next.config.js                # Next.js configuration
```

---

## Core Architecture Decisions

### 1. Infinite Canvas Mathematics

**Challenge**: Rendering an infinite canvas efficiently.

**Solution**: Dual coordinate system
- **World Coordinates**: Absolute position of objects (unbounded)
- **Screen Coordinates**: Viewport-relative rendering (bounded)

**Key File**: `lib/canvas/coordinates.ts`

```typescript
screenToWorld(screenPoint) → worldPoint
worldToScreen(worldPoint) → screenPoint
zoomToPoint(point, delta) → newViewport
```

**Benefits**:
- True infinite canvas (no limits)
- Smooth zoom to mouse position
- Viewport culling for performance

---

### 2. State Management Strategy

**Why Zustand over Redux/Context API?**

- **Performance**: Fine-grained subscriptions
- **Simplicity**: No boilerplate
- **TypeScript**: First-class support
- **Devtools**: Built-in debugging

**Three Stores Pattern**:

1. **Canvas Store** (`canvas-store.ts`)
   - Objects (Map for O(1) lookups)
   - Viewport (x, y, scale)
   - Selection state
   - Active tool

2. **Collaboration Store** (`collaboration-store.ts`)
   - Active users
   - Cursor positions
   - Object locks
   - Connection status

3. **Board Store** (`board-store.ts`)
   - Board metadata
   - Theme settings
   - History/Undo stack
   - Save state

**Why Separate Stores?**
- Independent re-renders
- Clear domain separation
- Easier testing

---

### 3. Real-Time Collaboration

**Socket.IO Architecture**:

```
Client → Socket.IO Client → Next.js API Route → Socket.IO Server → Other Clients
```

**Event Types**:
- `object:create`, `object:update`, `object:delete`
- `cursor:move` (throttled to 60fps)
- `object:lock`, `object:unlock`
- `user:join`, `user:leave`

**Optimizations**:
1. **Throttled Cursor Updates**: Sent max 16ms apart
2. **Optimistic UI**: Instant local updates
3. **Conflict Resolution**: Last-write-wins with soft locks
4. **Room-Based Broadcasting**: Only to board participants

**Key File**: `lib/socket/socket-client.ts`

---

### 4. Performance Optimizations

#### Viewport Culling
Only render objects visible in viewport + margin.

```typescript
filterVisibleObjects(objects, viewport) → visibleObjects
```

#### Object Pooling (Future)
Reuse Konva nodes instead of creating/destroying.

#### Debounced Autosave
Save to Supabase every 30 seconds after changes.

#### Lazy Loading
Load board objects in chunks as user pans.

**Key File**: `lib/canvas/performance.ts`

---

### 5. Theme System

**Three Built-in Themes**:

1. **Cosmic Glass** (Default)
   - Dark nebula background
   - Glassmorphism panels
   - Neon purple/pink accents
   - Glowing borders

2. **Minimal Pro**
   - Clean white background
   - Subtle shadows
   - Professional blue accents
   - No glow effects

3. **Cyber Motion**
   - Black background
   - Neon cyan/magenta
   - Grid patterns
   - Futuristic vibe

**Implementation**:
- CSS variables for runtime switching
- Tailwind classes generated from theme
- Persisted per-board in database

**Key File**: `lib/theme/themes.ts`

---

### 6. Database Schema (Supabase)

#### Tables

**boards**
```sql
id              UUID PRIMARY KEY
name            TEXT
description     TEXT
owner_id        UUID (references auth.users)
theme           TEXT
thumbnail       TEXT
is_public       BOOLEAN
created_at      TIMESTAMP
updated_at      TIMESTAMP
last_accessed_at TIMESTAMP
```

**board_objects**
```sql
id              UUID PRIMARY KEY
board_id        UUID (references boards)
type            TEXT (shape, sticky, text, drawing, connector)
data            JSONB (type-specific properties)
x, y            FLOAT (world coordinates)
width, height   FLOAT
rotation        FLOAT
z_index         INTEGER
locked          BOOLEAN
locked_by       UUID
created_by      UUID
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

**board_members**
```sql
board_id        UUID (references boards)
user_id         UUID (references auth.users)
role            TEXT (owner, editor, viewer)
joined_at       TIMESTAMP
PRIMARY KEY (board_id, user_id)
```

**Why JSONB for object data?**
- Flexible schema per object type
- Efficient indexing
- Easy to query specific properties

---

### 7. Coordinate Transformation Deep Dive

**The Core Problem**:
Users interact in screen space, but objects live in world space.

**Example**: User clicks at screen (500, 300)
- Viewport: { x: -1000, y: -500, scale: 0.5 }
- World point = ?

**Math**:
```typescript
worldX = (screenX - viewportX) / scale
worldY = (screenY - viewportY) / scale

worldX = (500 - (-1000)) / 0.5 = 3000
worldY = (300 - (-500)) / 0.5 = 1600
```

**Zoom to Point** (most complex):
When zooming at cursor position, must keep that world point stationary.

```typescript
// Before zoom: screen point → world point
worldPoint = screenToWorld(cursorPosition)

// After zoom: same world point → new screen position
newViewport.x = cursorX - worldPoint.x * newScale
newViewport.y = cursorY - worldPoint.y * newScale
```

**Why This Matters**:
- Smooth, intuitive zoom behavior
- No "jumping" when zooming
- Feels like Google Maps

---

### 8. Conflict Resolution Strategy

**Problem**: Two users edit same object simultaneously.

**Solution**: Soft Locking + Last-Write-Wins

1. User starts editing → Send `object:lock`
2. Lock expires after 30 seconds
3. Other users see lock indicator
4. Can force unlock (shows warning)
5. If simultaneous edits → Last-Write-Wins

**Why Not Operational Transform (OT)?**
- OT is complex and error-prone
- Soft locks handle 99% of cases
- Users expect occasional conflicts in real-time

**Alternative**: CRDTs (future consideration)

---

### 9. Smart Connectors Architecture

**Auto-Routing Algorithm**:
1. Calculate anchor points on both shapes
2. Use A* pathfinding to avoid overlaps
3. Apply cubic Bezier smoothing
4. Animate data-flow with SVG dash-offset

**Key Features**:
- Magnetic anchor points (8 per object)
- Automatic rerouting when objects move
- Avoids other objects (future)
- Spring physics for organic feel

**Performance**:
- Recalculate only affected connectors
- Debounce during drag
- Batch updates in single frame

---

### 10. Export & Timeline Features

**Export Options**:
- PNG (via canvas.toDataURL)
- PDF (via jsPDF)
- SVG (future)

**Timeline System**:
- Event log stored in memory
- Persisted to Supabase for replay
- Scrub through collaboration history
- See "ghost" cursors of past users

**Implementation**:
- Snapshot every 5 seconds
- Store deltas instead of full state
- On replay: Apply deltas in sequence

---

## Deployment Strategy

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

**Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SOCKET_URL`

### Socket.IO Server
**Note**: Socket.IO in Next.js API routes has limitations. For production:
1. Deploy separate Socket.IO server (Node.js + Express)
2. Host on Railway/Render
3. Point `NEXT_PUBLIC_SOCKET_URL` to it

**Alternative**: Use Supabase Realtime (PostgreSQL-based pub/sub)

---

## Performance Benchmarks (Target)

- **60 FPS** at 5000 objects
- **<100ms** cursor latency
- **<500ms** object sync time
- **<2s** initial board load

---

## Security Considerations

1. **RLS on Supabase**: Users can only access boards they're members of
2. **JWT Auth**: Socket.IO validates user identity
3. **Rate Limiting**: Max 100 events/second per user
4. **Input Sanitization**: All user content is escaped
5. **CORS**: Restricted to app domain

---

## Future Enhancements

1. **AI Features**
   - Sketch-to-shape recognition
   - Auto-layout algorithms
   - Text summarization

2. **Voice/Video**
   - Integrated WebRTC
   - Cursor-linked audio

3. **Plugins**
   - Third-party tool integrations
   - Custom object types

4. **Mobile App**
   - React Native version
   - Touch gestures

---

## Development Workflow

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

---

## Key Takeaways

1. **Dual Coordinate System** is the foundation of infinite canvas
2. **Zustand** provides fast, type-safe state management
3. **Viewport Culling** ensures performance at scale
4. **Socket.IO** enables real-time without backend complexity
5. **Soft Locks** balance collaboration with conflict prevention
6. **Theme System** makes it feel premium
7. **Supabase** handles auth, database, and file storage

---

## Interview Highlights

When explaining this project:

1. **Canvas Math**: Explain world vs screen coordinates
2. **Real-Time**: Discuss event-driven architecture
3. **Performance**: Viewport culling, throttling, debouncing
4. **State Management**: Why Zustand over Redux
5. **Conflict Resolution**: Soft locking strategy
6. **Scalability**: How to handle 10k+ objects

---

This architecture is designed to be:
- **Scalable**: Handles thousands of objects
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new features
- **Production-Ready**: Security, performance, error handling

**Next Steps**: See individual STEP prompts to build each feature incrementally.
