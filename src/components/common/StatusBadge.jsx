import React from 'react'

export function StatusBadge({ value }) {
  const config = {
    Berhasil: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-600',
    },
    Menunggu: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      dot: 'bg-amber-600',
    },
    Gagal: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      dot: 'bg-rose-600',
    },
    Tersedia: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-600',
    },
    Nonaktif: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200/60',
      dot: 'bg-slate-400',
    },
  }

  const current = config[value] || config.Menunggu

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${current.bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      <span>{value}</span>
    </span>
  )
}

