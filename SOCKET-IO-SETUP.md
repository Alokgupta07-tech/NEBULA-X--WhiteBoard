# Socket.IO Setup Guide

## Current Status

The Socket.IO API route (`app/api/socket/route.ts`) is currently a placeholder. Socket.IO requires a custom server setup that's not fully compatible with Next.js serverless functions.

## Production Options

### Option 1: Custom Next.js Server (Recommended for Development)

Create a custom server file:

**`server.js`**
```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const { boardId, userId, userName } = socket.handshake.auth;

    console.log(`[Socket.IO] User connected: ${userName} (${userId})`);

    socket.join(boardId);

    socket.broadcast.to(boardId).emit('event', {
      type: 'user:join',
      payload: { userId, userName },
      userId,
      timestamp: Date.now(),
    });

    socket.on('event', (event) => {
      socket.broadcast.to(boardId).emit('event', event);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] User disconnected: ${userName}`);
      socket.broadcast.to(boardId).emit('event', {
        type: 'user:leave',
        payload: { userId },
        userId,
        timestamp: Date.now(),
      });
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
```

**Update `package.json`:**
```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

### Option 2: Separate Socket.IO Server (Recommended for Production)

Deploy a standalone Socket.IO server on Railway, Render, or similar.

**`socket-server/index.js`**
```javascript
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  const { boardId, userId, userName } = socket.handshake.auth;

  console.log(`User connected: ${userName} (${userId})`);

  socket.join(boardId);

  socket.broadcast.to(boardId).emit('event', {
    type: 'user:join',
    payload: { userId, userName },
    userId,
    timestamp: Date.now(),
  });

  socket.on('event', (event) => {
    socket.broadcast.to(boardId).emit('event', event);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userName}`);
    socket.broadcast.to(boardId).emit('event', {
      type: 'user:leave',
      payload: { userId },
      userId,
      timestamp: Date.now(),
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
```

**Deploy to Railway:**
```bash
railway init
railway up
```

**Update `.env.local`:**
```env
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
```

### Option 3: Supabase Realtime (Easiest for Production)

Use Supabase's built-in Realtime features instead of Socket.IO.

**Advantages:**
- No separate server needed
- Built into Supabase
- Scales automatically
- PostgreSQL-based pub/sub

**Implementation:**
```typescript
import { supabase } from '@/lib/supabase/client';

const channel = supabase.channel(`board:${boardId}`);

channel
  .on('broadcast', { event: 'cursor:move' }, (payload) => {
    console.log('Cursor moved:', payload);
  })
  .subscribe();

channel.send({
  type: 'broadcast',
  event: 'cursor:move',
  payload: { x, y, userId },
});
```

## Recommendation

For this project:
1. **Development**: Use custom Next.js server (Option 1)
2. **Production**: Use Supabase Realtime (Option 3)

Supabase Realtime is the best choice for production because:
- No additional infrastructure
- Automatic scaling
- Already part of the stack
- Simpler deployment

## Implementation Plan

For Step 5 (Real-Time Collaboration), we'll:
1. Start with Socket.IO client wrapper (already built)
2. Test with custom server in development
3. Migrate to Supabase Realtime for production
4. Keep Socket.IO as an optional alternative

The client code (`lib/socket/socket-client.ts`) is designed to be adaptable to either approach.
