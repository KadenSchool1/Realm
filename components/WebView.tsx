'use client';

interface WebViewProps {
  url: string;
}

export default function WebView({ url }: WebViewProps) {
  if (url === 'about:blank') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">Realm Browser</h1>
          <p className="text-gray-400 mb-8">Private web browsing with free search engines</p>
          <div className="space-y-2 text-left inline-block text-gray-400">
            <p>✨ Free search (no API keys)</p>
            <p>🔒 Private browsing</p>
            <p>⚡ Fast performance</p>
            <p>🌐 Multiple search engines</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      className="w-full h-full border-none"
      title="Web View"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
    />
  );
}
