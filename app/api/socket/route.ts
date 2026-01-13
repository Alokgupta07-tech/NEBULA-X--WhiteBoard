import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  return new Response(
    JSON.stringify({
      message: 'Socket.IO endpoint. Use WebSocket connection.',
      status: 'ready',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const POST = async (req: NextRequest) => {
  return new Response(
    JSON.stringify({
      message: 'Socket.IO endpoint. Use WebSocket connection.',
      status: 'ready',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
