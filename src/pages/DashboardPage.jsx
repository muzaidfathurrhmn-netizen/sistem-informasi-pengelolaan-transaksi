import React, { useMemo } from 'react'
import {
  Activity,
  BadgeCheck,
  Clock3,
  Wallet,
  Zap,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { StatCard } from '../components/common/StatCard'
import { SectionTitle } from '../components/common/SectionTitle'
import { TableWrap } from '../components/common/TableWrap'
import { StatusBadge } from '../components/common/StatusBadge'
import { formatRupiah } from '../utils/formatters'

export function DashboardPage({ transactions = [], setPage, currentUser }) {
  // Dynamically calculate metrics from transactions state
  const metrics = useMemo(() => {
    const totalCount = transactions.length
    const successCount = transactions.filter((t) => t.status === 'Berhasil').length
    const pendingCount = transactions.filter((t) => t.status === 'Menunggu').length
    const failedCount = transactions.filter((t) => t.status === 'Gagal').length

    const totalVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0)

    const successPct =
      totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : '0'
    const pendingPct =
      totalCount > 0 ? ((pendingCount / totalCount) * 100).toFixed(1) : '0'
    const failedPct =
      totalCount > 0 ? ((failedCount / totalCount) * 100).toFixed(1) : '0'

    return {
      totalCount,
      successCount,
      pendingCount,
      failedCount,
      totalVolume,
      successPct,
      pendingPct,
      failedPct,
    }
  }, [transactions])

  // Donut chart dynamic gradient calculation
  const donutGradient = useMemo(() => {
    if (metrics.totalCount === 0) {
      return { background: '#E2E8F0' }
    }
    const s = Number(metrics.successPct)
    const p = Number(metrics.pendingPct)
    return {
      background: `conic-gradient(#16a36a 0% ${s}%, #f5c84c ${s}% ${s + p}%, #e45b65 ${s + p}% 100%)`,
    }
  }, [metrics])

  // 4 latest transactions
  const latestTransactions = useMemo(() => {
    return transactions.slice(0, 4)
  }, [transactions])

  const isOperator = currentUser?.role === 'Operator'

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-soft md:p-8">
        <div className="relative z-10 max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            PORTAL OPERASIONAL • {currentUser?.role?.toUpperCase() || 'ADMINISTRATOR'}
          </div>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
            {isOperator
              ? 'Selamat bertugas, Operator.'
              : 'Kelola transaksi digital,'}
            <br />
            <span className="text-gold">
              {isOperator
                ? 'Pantau antrean dan proses validasi.'
                : 'lebih cepat dan terkontrol.'}
            </span>
          </h2>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-300">
            {isOperator
              ? 'Anda memiliki wewenang untuk membuat transaksi, memeriksa antrean validasi, dan menelusuri riwayat operasional distributor.'
              : 'Pantau katalog pulsa, nomor pelanggan, dan metrik transaksi distributor dalam satu kendali terpusat.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setPage('Transaksi')}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-extrabold text-ink shadow-sm transition hover:bg-yellow-400 active:scale-95"
            >
              <span>Buat transaksi baru</span>
              <ChevronRight size={15} />
            </button>

            {metrics.pendingCount > 0 && (
              <button
                onClick={() => setPage('Validasi Transaksi')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                <span>Validasi ({metrics.pendingCount})</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border-[36px] border-white/5" />
        <div className="pointer-events-none absolute right-16 top-12 hidden h-36 w-36 rounded-full border border-gold/30 md:block" />
        <Zap
          className="pointer-events-none absolute bottom-7 right-12 hidden text-gold/20 md:block"
          size={110}
        />
      </div>

      {/* Dynamic Metrics Stat Cards (Synchronized with State) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total transaksi tercatat"
          value={metrics.totalCount}
          note="akumulasi seluruh record sesi"
          trend={`${metrics.totalCount} TRX`}
          icon={Activity}
          tone="gold"
        />
        <StatCard
          title="Transaksi berhasil"
          value={metrics.successCount}
          note={`tingkat sukses: ${metrics.successPct}%`}
          trend={`${metrics.successPct}%`}
          icon={BadgeCheck}
          tone="emerald"
        />
        <StatCard
          title="Menunggu validasi"
          value={metrics.pendingCount}
          note="butuh tindakan operator"
          trend={metrics.pendingCount > 0 ? `+${metrics.pendingCount} antrean` : 'Antrean bersih'}
          icon={Clock3}
          tone="gold"
        />
        <StatCard
          title="Total nilai transaksi"
          value={formatRupiah(metrics.totalVolume)}
          note="akumulasi nominal pulsa"
          trend="Real-time"
          icon={Wallet}
          tone="blue"
        />
      </div>

      {/* 2-Column Overview: Latest Transactions & Status Ring Composition */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {/* Latest Transactions Table */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
          <SectionTitle
            title="Transaksi terbaru"
            desc="Aktivitas transaksi yang baru tercatat dalam sistem."
            action={
              <button
                onClick={() => setPage('Riwayat Transaksi')}
                className="inline-flex items-center gap-1 text-xs font-bold text-ink hover:text-slate-700"
              >
                <span>Lihat semua</span>
                <ChevronRight size={14} />
              </button>
            }
          />

          <TableWrap minWidth="min-w-[640px]">
            <thead>
              <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pr-4">ID Transaksi</th>
                <th className="py-3 pr-4">Pelanggan / Nomor</th>
                <th className="py-3 pr-4">Produk</th>
                <th className="py-3 pr-4">Nominal</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {latestTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              ) : (
                latestTransactions.map((row) => (
                  <tr key={row.id} className="transition hover:bg-slate-50/60">
                    <td className="py-3.5 pr-4 font-bold text-ink">
                      <span className="font-mono tabular-nums">{row.id}</span>
                      <div className="mt-0.5 text-[10px] font-normal text-slate-400">
                        {row.date}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-slate-700">
                        {row.customer}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400 tabular-nums font-mono">
                        {row.phone}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600">{row.product}</td>
                    <td className="py-3.5 pr-4 font-bold text-ink font-mono tabular-nums">
                      {formatRupiah(row.amount)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <StatusBadge value={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        </div>

        {/* Dynamic Status Donut Chart Composition */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft flex flex-col justify-between">
          <div>
            <SectionTitle
              title="Komposisi status transaksi"
              desc="Distribusi transaksi real-time sesi ini."
            />

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6">
              {/* Dynamic Conic Gradient Donut Chart */}
              <div
                className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full shadow-inner transition-all duration-500"
                style={donutGradient}
              >
                <div className="grid h-24 w-24 place-items-center rounded-full bg-white shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-ink tabular-nums">
                      {metrics.totalCount}
                    </div>
                    <div className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                      Total
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown Legend */}
              <div className="w-full sm:w-auto space-y-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  <span className="text-slate-600 font-medium">Berhasil</span>
                  <b className="ml-auto text-ink tabular-nums pl-4">
                    {metrics.successCount} ({metrics.successPct}%)
                  </b>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Menunggu</span>
                  <b className="ml-auto text-ink tabular-nums pl-4">
                    {metrics.pendingCount} ({metrics.pendingPct}%)
                  </b>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Gagal</span>
                  <b className="ml-auto text-ink tabular-nums pl-4">
                    {metrics.failedCount} ({metrics.failedPct}%)
                  </b>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-500">
            Statistik diperbarui secara otomatis setiap kali ada transaksi baru atau perubahan validasi status.
          </div>
        </div>
      </div>
    </div>
  )
}
