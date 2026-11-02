import React from 'react'
import { Zap, ShieldCheck, LogOut, Shield, UserCheck } from 'lucide-react'
import { navGroups } from '../../data/dummyData'

export function Sidebar({
  page,
  setPage,
  mobileOpen,
  setMobileOpen,
  onLogout,
  currentUser,
}) {
  const isOperator = currentUser?.role === 'Operator'

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-ink/60 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-ink transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-ink shadow-sm">
            <Zap size={22} fill="currentColor" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-white">
              arus<span className="text-gold">.</span>
            </div>
            <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-400">
              DIGITAL DISTRIBUTOR
            </div>
          </div>
        </div>

        {/* User Role Card inside Sidebar */}
        <div className="mx-4 mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`grid h-7 w-7 place-items-center rounded-lg text-[10px] font-extrabold ${
                isOperator ? 'bg-emerald-600 text-white' : 'bg-gold text-ink'
              }`}
            >
              {isOperator ? 'OP' : 'AD'}
            </div>
            <div className="overflow-hidden">
              <div className="truncate text-xs font-bold text-white">
                {currentUser?.name || 'Pengguna'}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                {isOperator ? (
                  <UserCheck size={11} className="text-emerald-400" />
                ) : (
                  <Shield size={11} className="text-gold" />
                )}
                <span>Role: {currentUser?.role || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items (Filtered by Role) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((group) => {
            // Role-based menu filtering according to PRD Section 3
            const visibleItems = group.items.filter((item) => {
              if (isOperator) {
                // Operator does not have access to master data
                return item.id !== 'Data Pulsa' && item.id !== 'Nomor Tujuan'
              }
              return true
            })

            return (
              <div key={group.label}>
                <p className="mb-2.5 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon
                    const isActive = page === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setPage(item.id)
                          setMobileOpen(false)
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
                          isActive
                            ? 'bg-white/10 text-white shadow-inner font-semibold'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon
                          size={17}
                          className={isActive ? 'text-gold' : 'text-slate-400'}
                        />
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Demo Notice & Logout */}
        <div className="border-t border-white/5 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck size={14} className="text-gold" />
              <span>Mode demo aktif</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400">
              {isOperator
                ? 'Hak akses Operator: Transaksi, Validasi, dan Riwayat.'
                : 'Hak akses Administrator: Seluruh menu dan Master Data.'}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={15} />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  )
}
