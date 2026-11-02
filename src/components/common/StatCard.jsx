import React from 'react'
import { ArrowUpRight } from 'lucide-react'

export function StatCard({
  title,
  value,
  note,
  icon: Icon,
  trend,
  tone = 'gold',
}) {
  const toneMap = {
    gold: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-ink tabular-nums">
            {value}
          </div>
        </div>
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${
            toneMap[tone] || toneMap.gold
          }`}
        >
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px]">
        {trend && (
          <span className="flex items-center gap-0.5 font-bold text-emerald-600">
            <ArrowUpRight size={13} />
            {trend}
          </span>
        )}
        <span className="text-slate-400">{note}</span>
      </div>
    </div>
  )
}

