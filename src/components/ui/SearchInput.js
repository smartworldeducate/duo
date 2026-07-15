"use client";
import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div
      className={`flex items-center gap-2.5 bg-white border border-[var(--border)] rounded-xl h-10 px-3.5 focus-within:ring-2 focus-within:ring-brand-200 transition ${className}`}
    >
      <Search size={17} className="text-muted shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-plum placeholder:text-muted font-medium min-w-0"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-muted hover:text-plum cursor-pointer">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
