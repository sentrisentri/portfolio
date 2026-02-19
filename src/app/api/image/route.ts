import { NextResponse } from 'next/server';

const allowedHosts = new Set([
  'mudae.net',
  'cdn.imgchest.com',
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid url parameter.' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return NextResponse.json({ error: 'Unsupported protocol.' }, { status: 400 });
  }

  if (!allowedHosts.has(parsedUrl.hostname)) {
    return NextResponse.json({ error: 'Host not allowed.' }, { status: 403 });
  }

  const upstreamResponse = await fetch(parsedUrl.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'Referer': `${parsedUrl.origin}/`,
    },
    cache: 'no-store',
  });

  if (!upstreamResponse.ok) {
    return NextResponse.json({ error: 'Upstream request failed.' }, { status: upstreamResponse.status });
  }

  const contentType = upstreamResponse.headers.get('content-type') || 'application/octet-stream';
  const arrayBuffer = await upstreamResponse.arrayBuffer();

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
