# NebulaBoard X - Complete File Structure

```
nebulaboard-x/
│
├── 📁 app/                                 # Next.js App Router
│   ├── 📁 api/                             # API Routes
│   │   └── 📁 socket/                      # Socket.IO endpoint
│   │       └── route.ts                    # WebSocket server handler
│   ├── 📁 board/                           # Board pages
│   │   └── 📁 [id]/                        # Dynamic board route
│   │       └── page.tsx                    # Main board interface
│   ├── 📁 dashboard/                       # User dashboard
│   │   └── page.tsx                        # Board list/management
│   ├── layout.tsx                          # Root layout with providers
│   ├── page.tsx                            # Landing/home page
│   └── globals.css                         # Global styles + theme vars
│
├── 📁 components/                          # React Components
│   │
│   ├── 📁 canvas/                          # Canvas-Specific Components
│   │   ├── InfiniteCanvas.tsx              # Main canvas wrapper
│   │   ├── CanvasStage.tsx                 # Konva stage component
│   │   ├── CanvasLayer.tsx                 # Konva layer wrapper
│   │   ├── Grid.tsx                        # Animated grid background
│   │   ├── Minimap.tsx                     # Navigation minimap
│   │   ├── SelectionBox.tsx                # Multi-select rectangle
│   │   └── ViewportControls.tsx            # Zoom/pan UI controls
│   │
│   ├── 📁 collaboration/                   # Real-Time Collaboration UI
│   │   ├── CursorTracker.tsx               # Render other users' cursors
│   │   ├── CursorLabel.tsx                 # User name + color badge
│   │   ├── UserList.tsx                    # Active collaborators panel
│   │   ├── PresenceIndicator.tsx           # Online status dot
│   │   ├── LockIndicator.tsx               # Object lock visual
│   │   └── CollaborationPanel.tsx          # Combined collaboration UI
│   │
│   ├── 📁 layout/                          # Layout Components
│   │   ├── Toolbar.tsx                     # Main floating toolbar
│   │   ├── ToolButton.tsx                  # Individual tool button
│   │   ├── Sidebar.tsx                     # Collapsible left sidebar
│   │   ├── PropertiesPanel.tsx             # Right panel for object props
│   │   ├── CommandPalette.tsx              # Cmd+K quick actions
│   │   ├── ThemeSelector.tsx               # Theme switcher dropdown
│   │   └── KeyboardShortcuts.tsx           # Shortcuts help modal
│   │
│   ├── 📁 objects/                         # Canvas Object Renderers
│   │   ├── CanvasObject.tsx                # Base object wrapper
│   │   ├── Shape.tsx                       # Rectangle/circle/diamond/arrow
│   │   ├── StickyNote.tsx                  # Sticky notes with emoji
│   │   ├── TextBlock.tsx                   # Editable rich text
│   │   ├── Drawing.tsx                     # Freehand drawing paths
│   │   ├── Connector.tsx                   # Smart connector lines
│   │   ├── ResizeHandles.tsx               # Corner/edge resize handles
│   │   ├── RotateHandle.tsx                # Rotation control
│   │   └── AnchorPoints.tsx                # Connector anchor dots
│   │
│   ├── 📁 timeline/                        # Timeline & Replay
│   │   ├── Timeline.tsx                    # Timeline scrubber
│   │   ├── TimelineControls.tsx            # Play/pause/speed controls
│   │   ├── GhostCursor.tsx                 # Replay cursor rendering
│   │   └── EventLog.tsx                    # Event history list
│   │
│   ├── 📁 export/                          # Export Dialogs
│   │   ├── ExportDialog.tsx                # Main export modal
│   │   ├── ExportPNG.tsx                   # PNG export options
│   │   └── ExportPDF.tsx                   # PDF export options
│   │
│   └── 📁 ui/                              # shadcn/ui Components
│       ├── button.tsx                      # Button component
│       ├── dialog.tsx                      # Dialog/modal
│       ├── dropdown-menu.tsx               # Dropdown menus
│       ├── input.tsx                       # Input fields
│       ├── select.tsx                      # Select dropdowns
│       ├── slider.tsx                      # Range sliders
│       ├── tooltip.tsx                     # Tooltips
│       └── ...                             # Other UI components
│
├── 📁 lib/                                 # Core Library Code
│   │
│   ├── 📁 canvas/                          # Canvas Engine
│   │   ├── coordinates.ts                  # ⭐ World ↔ Screen transforms
│   │   ├── object-factory.ts               # Object creation utilities
│   │   ├── performance.ts                  # Viewport culling, throttling
│   │   ├── connectors.ts                   # Auto-routing algorithm
│   │   ├── collision.ts                    # Collision detection
│   │   ├── alignment.ts                    # Snap-to-align guides
│   │   └── grid.ts                         # Grid calculations
│   │
│   ├── 📁 store/                           # Zustand State Stores
│   │   ├── canvas-store.ts                 # ⭐ Objects, viewport, tool
│   │   ├── collaboration-store.ts          # ⭐ Users, cursors, locks
│   │   ├── board-store.ts                  # ⭐ Board metadata, history
│   │   └── ui-store.ts                     # UI state (panels, modals)
│   │
│   ├── 📁 socket/                          # Real-Time Communication
│   │   ├── socket-client.ts                # ⭐ Socket.IO client wrapper
│   │   ├── event-handlers.ts               # Event processing logic
│   │   └── event-queue.ts                  # Optimistic update queue
│   │
│   ├── 📁 theme/                           # Theme System
│   │   ├── themes.ts                       # ⭐ Theme configurations
│   │   └── theme-provider.tsx              # React context provider
│   │
│   ├── 📁 supabase/                        # Database Client
│   │   ├── client.ts                       # ⭐ Supabase configuration
│   │   ├── boards.ts                       # Board CRUD operations
│   │   ├── objects.ts                      # Object CRUD operations
│   │   └── auth.ts                         # Authentication helpers
│   │
│   ├── 📁 config/                          # Configuration
│   │   └── constants.ts                    # App constants & config
│   │
│   └── utils.ts                            # General utility functions
│
├── 📁 types/                               # TypeScript Type Definitions
│   ├── canvas.ts                           # ⭐ Canvas object types
│   ├── collaboration.ts                    # ⭐ Collaboration types
│   ├── board.ts                            # ⭐ Board metadata types
│   └── index.ts                            # Type exports
│
├── 📁 hooks/                               # Custom React Hooks
│   ├── use-canvas.ts                       # Canvas interaction hooks
│   ├── use-collaboration.ts                # Real-time collaboration
│   ├── use-keyboard.ts                     # Keyboard shortcuts
│   ├── use-viewport.ts                     # Viewport management
│   ├── use-selection.ts                    # Object selection
│   ├── use-autosave.ts                     # Debounced autosave
│   └── use-undo-redo.ts                    # History management
│
├── 📁 public/                              # Static Assets
│   ├── 📁 assets/                          # Images, fonts
│   └── favicon.ico                         # Favicon
│
├── 📁 supabase/                            # Supabase Configuration
│   └── 📁 migrations/                      # Database migrations
│       └── 001_initial_schema.sql          # Initial tables
│
├── 📄 .env.example                         # Environment variables template
├── 📄 .env.local                           # Local environment (gitignored)
├── 📄 .gitignore                           # Git ignore rules
├── 📄 package.json                         # ⭐ Dependencies
├── 📄 tsconfig.json                        # TypeScript configuration
├── 📄 tailwind.config.ts                   # Tailwind CSS config
├── 📄 next.config.js                       # Next.js configuration
├── 📄 components.json                      # shadcn/ui config
│
├── 📄 README.md                            # Project overview
├── 📄 ARCHITECTURE.md                      # ⭐ Architecture deep-dive
└── 📄 STRUCTURE.md                         # This file

⭐ = Critical files to understand first
```

---

## Critical Paths for Understanding the Codebase

### 1. State Management Flow

```
User Action → Component Event
    ↓
Zustand Store Update (lib/store/*.ts)
    ↓
React Re-render
    ↓
Socket.IO Emit (lib/socket/socket-client.ts)
    ↓
Broadcast to Other Users
```

### 2. Canvas Rendering Pipeline

```
World Coordinates (objects)
    ↓
Coordinate Transform (lib/canvas/coordinates.ts)
    ↓
Screen Coordinates
    ↓
Viewport Culling (lib/canvas/performance.ts)
    ↓
Konva Rendering (components/canvas/*.tsx)
```

### 3. Real-Time Collaboration Flow

```
User A: Object Update
    ↓
Socket Client Emit
    ↓
Socket.IO Server (app/api/socket/route.ts)
    ↓
Broadcast to Room
    ↓
User B: Receive Event
    ↓
Update Collaboration Store
    ↓
Optimistic UI Update
```

---

## File Responsibilities Summary

| File Path | Primary Responsibility |
|-----------|----------------------|
| `lib/canvas/coordinates.ts` | World ↔ Screen transformations, zoom-to-point |
| `lib/store/canvas-store.ts` | Canvas objects, viewport, selection state |
| `lib/socket/socket-client.ts` | WebSocket connection, event emission |
| `components/canvas/InfiniteCanvas.tsx` | Main canvas container, event handling |
| `lib/theme/themes.ts` | Theme definitions and switching |
| `lib/supabase/client.ts` | Database connection and queries |
| `lib/canvas/object-factory.ts` | Create canvas objects |
| `lib/canvas/performance.ts` | Viewport culling, throttle/debounce |

---

## Next Steps

1. ✅ **Step 1 Complete**: Project scaffold established
2. **Step 2 Next**: Implement UI template system
   - Create layout components
   - Apply theme system
   - Build toolbar and sidebar

See the main STEP prompts for incremental feature development.
