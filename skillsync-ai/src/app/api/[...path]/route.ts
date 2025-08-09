import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

async function handler(req: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    return new NextResponse(JSON.stringify({ error: 'Backend URL is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Reconstruct the URL for the backend
  const path = req.nextUrl.pathname.replace(/^\/api/, '');
  const url = new URL(path, backendUrl);
  
  // Forward the request
  const response = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    redirect: 'manual',
  });

  return response;
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
