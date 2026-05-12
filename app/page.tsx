'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import BrowserTabs from '@/components/BrowserTabs';
import WebView from '@/components/WebView';

interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

interface SearchEngine {
  name: string;
  url: string;
}

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'New Tab',
      url: 'about:blank',
      isActive: true,
    },
  ]);

  const [addressValue, setAddressValue] = useState('');
  const [currentEngine, setCurrentEngine] = useState('Google');
  const [engines, setEngines] = useState<SearchEngine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeTab = tabs.find((tab) => tab.isActive);

  useEffect(() => {
    const loadEngines = async () => {
      try {
        const response = await fetch('/api/search?action=list');
        const data = await response.json();
        setEngines(data.engines);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load search engines:', error);
        setEngines([
          { name: 'Google', url: 'https://www.google.com/search?q=' },
          { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
          { name: 'Bing', url: 'https://www.bing.com/search?q=' },
          { name: 'Brave Search', url: 'https://search.brave.com/search?q=' },
        ]);
        setIsLoading(false);
      }
    };

    loadEngines();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&engine=${encodeURIComponent(currentEngine)}`
      );
      const data = await response.json();
      updateActiveTab(data.url);
      setAddressValue(data.url);
    } catch (error) {
      console.error('Search failed:', error);
      const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      updateActiveTab(fallbackUrl);
      setAddressValue(fallbackUrl);
    }
  };

  const handleNavigate = (url: string) => {
    let finalUrl = url;

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
      handleSearch(url);
      return;
    }

    updateActiveTab(finalUrl);
    setAddressValue(finalUrl);
  };

  const updateActiveTab = (url: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.isActive
          ? {
              ...tab,
              url,
              title: url === 'about:blank' ? 'New Tab' : new URL(url).hostname || 'New Tab',
            }
          : tab
      )
    );
  };

  const addNewTab = () => {
    const newId = Math.random().toString();
    setTabs((prevTabs) => [
      ...prevTabs.map((tab) => ({ ...tab, isActive: false })),
      {
        id: newId,
        title: 'New Tab',
        url: 'about:blank',
        isActive: true,
      },
    ]);
    setAddressValue('');
  };

  const closeTab = (id: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== id);
    if (newTabs.length === 0) {
      addNewTab();
    } else if (tabs.find((tab) => tab.id === id)?.isActive) {
      newTabs[0].isActive = true;
      setAddressValue(newTabs[0].url);
    }
    setTabs(newTabs);
  };

  const switchTab = (id: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        isActive: tab.id === id,
      }))
    );
    const tab = tabs.find((t) => t.id === id);
    if (tab) {
      setAddressValue(tab.url);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-2 bg-gray-850 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Search Engine:</label>
            <select
              value={currentEngine}
              onChange={(e) => setCurrentEngine(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            >
              {engines.map((engine) => (
                <option key={engine.name} value={engine.name}>
                  {engine.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <BrowserTabs
          tabs={tabs}
          onSwitchTab={switchTab}
          onCloseTab={closeTab}
          onNewTab={addNewTab}
        />

        <SearchBar
          value={addressValue}
          onChange={setAddressValue}
          onSearch={handleSearch}
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 overflow-hidden bg-gray-900">
        {activeTab && <WebView url={activeTab.url} />}
      </div>
    </div>
  );
}
