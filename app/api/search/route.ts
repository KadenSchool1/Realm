import { NextRequest, NextResponse } from 'next/server';

const MERCURY_PROXY_BASE = 'https://api.mercurywork.shop';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const url = searchParams.get('url');

    if (!query && !url) {
      return NextResponse.json(
        { error: 'Missing query or url parameter' },
        { status: 400 }
      );
    }

    let proxyUrl = MERCURY_PROXY_BASE;
    if (query) {
      proxyUrl += `/search?q=${encodeURIComponent(query)}`;
    } else if (url) {
      proxyUrl += `/fetch?url=${encodeURIComponent(url)}`;
    }

    const response = await fetch(proxyUrl);
    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Search proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}