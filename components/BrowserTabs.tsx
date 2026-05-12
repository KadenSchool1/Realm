'use client';

interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

interface BrowserTabsProps {
  tabs: Tab[];
  onSwitchTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
}

export default function BrowserTabs({
  tabs,
  onSwitchTab,
  onCloseTab,
  onNewTab,
}: BrowserTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-800 px-2 py-2 border-b border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onSwitchTab(tab.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-t cursor-pointer whitespace-nowrap transition-colors ${
            tab.isActive
              ? 'bg-gray-700 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
          }`}
        >
          <span className="text-sm max-w-[150px] truncate">{tab.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(tab.id);
            }}
            className="ml-1 hover:bg-gray-600 rounded px-1 text-xs"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={onNewTab}
        className="ml-2 px-2 py-2 hover:bg-gray-700 rounded text-gray-400 text-lg transition"
      >
        +
      </button>
    </div>
  );
}
