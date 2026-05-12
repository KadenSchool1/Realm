import { NextRequest, NextResponse } from 'next/server';

// Free proxies that don't require API keys or accounts
const FREE_PROXIES = [
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    type: 'direct'
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    type: 'direct'
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    type: 'direct'
  },
  {
    name: 'Brave Search',
    url: 'https://search.brave.com/search?q=',
    type: 'direct'
  },
  {
    name: 'Startpage',
    url: 'https://www.startpage.com/sp/search?query=',
    type: 'direct'
  },
  {
    name: 'Ecosia',
    url: 'https://www.ecosia.org/search?q=',
    type: 'direct'
  },
  {
    name: 'MetaGer',
    url: 'https://metager.org/search?eingabe=',
    type: 'direct'
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const engine = searchParams.get('engine') || 'google';
    const action = searchParams.get('action');

    if (action === 'list') {
      return NextResponse.json(
        { engines: FREE_PROXIES },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      );
    }

    // Find the proxy engine
    const proxy = FREE_PROXIES.find(
      (p) => p.name.toLowerCase() === engine.toLowerCase()
    ) || FREE_PROXIES[0];

    const searchUrl = proxy.url + encodeURIComponent(query);

    return NextResponse.json(
      { url: searchUrl, engine: proxy.name },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
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