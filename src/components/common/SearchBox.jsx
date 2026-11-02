import React from 'react'
import { Search } from 'lucide-react'

export function SearchBox({
  value,
  onChange,
  placeholder = 'Cari data...',
  className = '',
}) {
  return (
    <div className={`relative min-w-[200px] flex-1 ${className}`}>
      <Search
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10 placeholder:text-slate-400"
      />
    </div>
  )
}

