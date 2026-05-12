'use client';

import { useState, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onNavigate: (url: string) => void;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onNavigate,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = inputRef.current?.value.trim() || '';
      if (input) {
        if (input.startsWith('http://') || input.startsWith('https://')) {
          onNavigate(input);
        } else {
          onSearch(input);
        }
      }
    }
  };

  return (
    <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-700 rounded text-gray-400">🔄</button>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search with Mercury Workshop or enter URL..."
          className="flex-1 bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
        />
        <button className="p-2 hover:bg-gray-700 rounded text-gray-400">⭐</button>
      </div>
    </div>
  );
}