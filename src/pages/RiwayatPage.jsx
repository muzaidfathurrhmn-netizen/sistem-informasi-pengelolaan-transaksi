import React, { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Filter,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { SectionTitle } from '../components/common/SectionTitle'
import { Button } from '../components/common/Button'
import { SearchBox } from '../components/common/SearchBox'
import { TableWrap } from '../components/common/TableWrap'
import { StatusBadge } from '../components/common/StatusBadge'
import { Modal } from '../components/common/Modal'
import { formatRupiah } from '../utils/formatters'

export function RiwayatPage({ transactions = [], validationLogs = [] }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua status')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Modal detail transaction
  const [selectedTrx, setSelectedTrx] = useState(null)

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      // Search matching ID, customer, phone, product, operator
      const q = query.toLowerCase()
      const matchQuery =
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q) ||
        (t.operator && t.operator.toLowerCase().includes(q))

      // Status filter
      const matchStatus =
        statusFilter === 'Semua status' || t.status === statusFilter

      // Date range filter (using dateIso 'YYYY-MM-DD')
      const itemDate = t.dateIso || (t.date.includes('01 Nov') ? '2026-11-01' : '2026-11-02')
      const matchStart = !startDate || itemDate >= startDate
      const matchEnd = !endDate || itemDate <= endDate

      return matchQuery && matchStatus && matchStart && matchEnd
    })
  }, [transactions, query, statusFilter, startDate, endDate])

  // Reset all filters
  const handleResetFilters = () => {
    setQuery('')
    setStatusFilter('Semua status')
    setStartDate('')
    setEndDate('')
  }

  // Set quick date preset
  const handleSetDatePreset = (preset) => {
    if (preset === 'today') {
      setStartDate('2026-11-02')
      setEndDate('2026-11-02')
    } else if (preset === 'yesterday') {
      setStartDate('2026-11-01')
      setEndDate('2026-11-01')
    } else {
      setStartDate('')
      setEndDate('')
    }
  }

  // Find associated validation log
  const associatedLog = useMemo(() => {
    if (!selectedTrx) return null
    return validationLogs.find((l) => l.transaksi_id === selectedTrx.id) || null
  }, [selectedTrx, validationLogs])

  const isFilterActive =
    query !== '' ||
    statusFilter !== 'Semua status' ||
    startDate !== '' ||
    endDate !== ''

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      {/* Title & Export */}
      <SectionTitle
        title="Riwayat transaksi distributor"
        desc="Seluruh catatan transaksi masuk, dalam proses validasi, berhasil, maupun ditolak."
        action={
          <Button
            variant="secondary"
            onClick={() =>
              alert(
                'Fitur Export CSV merupakan affordance UI pada prototype front-end. Data riwayat saat ini berjumlah ' +
                  filtered.length +
                  ' baris.'
              )
            }
          >
            <Download size={14} />
            <span>Export CSV</span>
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Search */}
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Cari ID, nama pelanggan, nomor, produk..."
            className="min-w-[240px]"
          />

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
          >
            <option value="Semua status">Semua status</option>
            <option value="Berhasil">Berhasil</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Gagal">Gagal</option>
          </select>
        </div>

        {/* Date Range Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-600">
            <Calendar size={14} className="text-slate-400" />
            <span>Rentang Tanggal:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-ink"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-ink"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pl-1">
            <button
              onClick={() => handleSetDatePreset('today')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                startDate === '2026-11-02' && endDate === '2026-11-02'
                  ? 'bg-ink text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Hari Ini (02 Nov)
            </button>
            <button
              onClick={() => handleSetDatePreset('yesterday')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                startDate === '2026-11-01' && endDate === '2026-11-01'
                  ? 'bg-ink text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kemarin (01 Nov)
            </button>
          </div>

          {/* Reset Filters */}
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-rose-600 transition hover:bg-rose-50"
              title="Reset seluruh filter pencarian dan tanggal"
            >
              <RotateCcw size={12} />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <TableWrap minWidth="min-w-[760px]">
        <thead>
          <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3 pr-4">ID Transaksi</th>
            <th className="py-3 pr-4">Pelanggan / Nomor</th>
            <th className="py-3 pr-4">Produk Pulsa</th>
            <th className="py-3 pr-4">Nominal</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Operator</th>
            <th className="py-3 pr-4 text-right">Rincian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-12 text-center text-xs text-slate-400"
              >
                Tidak ditemukan riwayat transaksi yang memenuhi kriteria pencarian dan filter tanggal.
              </td>
            </tr>
          ) : (
            filtered.map((r) => (
              <tr key={r.id} className="transition hover:bg-slate-50/60">
                <td className="py-3.5 pr-4 font-bold text-ink">
                  <span className="font-mono tabular-nums">{r.id}</span>
                  <div className="mt-0.5 text-[10px] font-normal text-slate-400">
                    {r.date}
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="font-semibold text-slate-700">{r.customer}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-slate-400 tabular-nums">
                    {r.phone}
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-slate-600">{r.product}</td>
                <td className="py-3.5 pr-4 font-bold text-ink font-mono tabular-nums">
                  {formatRupiah(r.amount)}
                </td>
                <td className="py-3.5 pr-4">
                  <StatusBadge value={r.status} />
                </td>
                <td className="py-3.5 pr-4 text-slate-500 text-xs">
                  {r.operator || 'Admin Demo'}
                </td>
                <td className="py-3.5 pr-4 text-right">
                  <button
                    onClick={() => setSelectedTrx(r)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-ink shadow-sm"
                    title="Lihat rincian transaksi"
                  >
                    <Eye size={13} />
                    <span>Detail</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TableWrap>

      {/* Pagination Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
        <span>
          Menampilkan <b className="text-slate-700">{filtered.length}</b> dari{' '}
          <b className="text-slate-700">{transactions.length}</b> riwayat transaksi
        </span>
        <div className="flex items-center gap-1.5">
          <button
            className="rounded-lg border border-slate-200 p-1.5 transition hover:bg-slate-50 disabled:opacity-40"
            disabled
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-xs font-bold text-white">
            1
          </span>
          <button
            className="rounded-lg border border-slate-200 p-1.5 transition hover:bg-slate-50 disabled:opacity-40"
            disabled
            aria-label="Halaman selanjutnya"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Modal Detail Transaksi & Audit Log */}
      {selectedTrx && (
        <Modal
          title={`Rincian Transaksi: ${selectedTrx.id}`}
          onClose={() => setSelectedTrx(null)}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            {/* Main Info Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Status Transaksi</span>
                <StatusBadge value={selectedTrx.status} />
              </div>

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Waktu Pencatatan</span>
                <span className="font-semibold text-ink">{selectedTrx.date}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Penerima Pulsa</span>
                <span className="font-bold text-ink text-right">
                  {selectedTrx.customer}
                  <br />
                  <span className="font-mono font-normal text-slate-500 text-[11px]">
                    {selectedTrx.phone}
                  </span>
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Produk yang Dipilih</span>
                <span className="font-bold text-ink">{selectedTrx.product}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Total Nominal</span>
                <span className="font-mono font-bold text-ink">
                  {formatRupiah(selectedTrx.amount)}
                </span>
              </div>

              {selectedTrx.margin && (
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Estimasi Margin Distributor</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +{formatRupiah(selectedTrx.margin)}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Operator Penginput</span>
                <span className="font-semibold text-slate-700">
                  {selectedTrx.operator || 'Admin Demo'}
                </span>
              </div>

              {selectedTrx.note && (
                <div className="border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Catatan Pemesanan:</span>
                  <p className="mt-0.5 text-slate-700 italic">"{selectedTrx.note}"</p>
                </div>
              )}

              {selectedTrx.rejectionReason && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-rose-800">
                  <b className="block">Alasan Penolakan:</b>
                  <span className="mt-0.5 block">{selectedTrx.rejectionReason}</span>
                </div>
              )}
            </div>

            {/* Audit Log Box (LogValidasi) */}
            {associatedLog && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900">
                <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1">
                  <ShieldCheck size={15} />
                  <span>Log Audit Validasi ({associatedLog.id})</span>
                </div>
                <div className="text-[11px] space-y-0.5 text-slate-600">
                  <div>Diverifikasi oleh: <b>{associatedLog.validator_id}</b></div>
                  <div>Waktu validasi: <b>{associatedLog.validated_at}</b></div>
                  <div>Catatan validasi: <i>"{associatedLog.catatan}"</i></div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={() => setSelectedTrx(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
