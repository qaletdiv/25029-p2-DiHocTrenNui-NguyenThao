"use client";

import React from "react";
import { Search, Plus } from "lucide-react";

interface ListToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  addLabel?: string;
  onAdd?: () => void;
  /** Extra slot for filters, export buttons, etc. */
  extras?: React.ReactNode;
}

export default function ListToolbar({
  searchPlaceholder = "Tìm kiếm...",
  searchValue,
  onSearchChange,
  addLabel = "Thêm mới",
  onAdd,
  extras,
}: ListToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors placeholder-gray-400"
        />
      </div>

      {/* Extras slot */}
      {extras}

      {/* Add button */}
      {onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      )}
    </div>
  );
}
