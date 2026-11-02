import React from 'react'
import { Menu, Bell, Shield, UserCheck } from 'lucide-react'

export function Header({ page, setMobileOpen, currentUser }) {
  const isOperator = currentUser?.role === 'Operator'
  const initials = isOperator ? 'OP' : 'AD'
  const roleName = isOperator ? 'Operator' : 'Administrator'
  const displayName = currentUser?.name || (isOperator ? 'Operator Demo' : 'Admin Demo')

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur-md md:px-8">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>
        <div>
          <div className="text-[11px] font-medium text-slate-400">
            Workspace / <span className="text-slate-600">{page}</span>
          </div>
          <h1 className="text-lg font-bold text-ink">{page}</h1>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3.5">
        {/* Role Pill Indicator */}
        <div
          className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
            isOperator
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
              : 'bg-amber-50 text-amber-800 border-amber-200/70'
          }`}
        >
          {isOperator ? (
            <UserCheck size={12} className="text-emerald-600" />
          ) : (
            <Shield size={12} className="text-amber-600" />
          )}
          <span>Role: {roleName}</span>
        </div>

        <button
          className="relative rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-ink"
          aria-label="Lihat notifikasi"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="h-7 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5 pl-1">
          <div
            className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-extrabold shadow-sm ${
              isOperator ? 'bg-emerald-700 text-white' : 'bg-ink text-gold'
            }`}
          >
            {initials}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-ink leading-tight">
              {displayName}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {roleName}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
