'use client';

import { useState, useRef, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import BrowserTabs from '@/components/BrowserTabs';
import WebView from '@/components/WebView';

interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find((tab) => tab.isActive);

  const handleSearch = async (query: string) => {
    // Use Mercury Workshop proxy for searches
    const proxyUrl = `https://api.mercurywork.shop/search?q=${encodeURIComponent(query)}`;
    updateActiveTab(proxyUrl);
    setAddressValue(proxyUrl);
  };

  const handleNavigate = (url: string) => {
    let finalUrl = url;

    // Check if it's a URL or search query
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
      // Use Mercury Workshop proxy for searches
      finalUrl = `https://api.mercurywork.shop/search?q=${encodeURIComponent(url)}`;
    }

    updateActiveTab(finalUrl);
    setAddressValue(finalUrl);
  };

  const updateActiveTab = (url: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.isActive ? { ...tab, url, title: new URL(url).hostname || 'New Tab' } : tab
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
      {/* Browser Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        {/* Tabs */}
        <BrowserTabs
          tabs={tabs}
          onSwitchTab={switchTab}
          onCloseTab={closeTab}
          onNewTab={addNewTab}
        />

        {/* Address Bar */}
        <SearchBar
          value={addressValue}
          onChange={setAddressValue}
          onSearch={handleSearch}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Web Content Area */}
      <div className="flex-1 overflow-hidden bg-gray-900">
        {activeTab && (
          <WebView url={activeTab.url} />
        )}
      </div>
    </div>
  );
}