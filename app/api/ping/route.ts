import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ status: 'error', message: 'URL is required' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'StatusChecker/1.0',
      },
    });

    clearTimeout(timeout);

    return NextResponse.json({ 
      status: response.ok ? 'online' : 'offline' 
    });
  } catch (error) {
    return NextResponse.json({ status: 'offline' });
  }
}
