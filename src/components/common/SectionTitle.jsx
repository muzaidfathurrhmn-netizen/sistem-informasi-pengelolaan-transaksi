import React from 'react'

export function SectionTitle({ title, desc, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {desc && <p className="mt-1 text-xs text-slate-500">{desc}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

