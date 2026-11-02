import React, { useState, useMemo } from 'react'
import {
  ClipboardCheck,
  Check,
  XCircle,
  Search,
  RotateCcw,
  History,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { SectionTitle } from '../components/common/SectionTitle'
import { StatusBadge } from '../components/common/StatusBadge'
import { SearchBox } from '../components/common/SearchBox'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { Field } from '../components/common/Field'
import { TableWrap } from '../components/common/TableWrap'
import { formatRupiah } from '../utils/formatters'

export function ValidasiPage({
  transactions = [],
  validationLogs = [],
  onApprove,
  onReject,
}) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('queue') // 'queue' | 'logs'

  // Modal confirmation states: null | 'approve' | 'reject'
  const [modalMode, setModalMode] = useState(null)
  const [selectedTrx, setSelectedTrx] = useState(null)

  // Form notes for modal
  const [actionNote, setActionNote] = useState('')
  const [presetReason, setPresetReason] = useState('Nomor tujuan tidak aktif / masa tenggang')
  const [errorMessage, setErrorMessage] = useState('')

  // Filter pending transactions
  const pendingTransactions = useMemo(() => {
    return transactions.filter((t) => t.status === 'Menunggu')
  }, [transactions])

  const filteredPending = useMemo(() => {
    return pendingTransactions.filter((t) => {
      const q = query.toLowerCase()
      return (
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q)
      )
    })
  }, [pendingTransactions, query])

  // Open Approve Modal
  const handleOpenApprove = (trx) => {
    setSelectedTrx(trx)
    setModalMode('approve')
    setActionNote('Transaksi pulsa telah diverifikasi dan disetujui.')
    setErrorMessage('')
  }

  // Open Reject Modal
  const handleOpenReject = (trx) => {
    setSelectedTrx(trx)
    setModalMode('reject')
    setPresetReason('Nomor tujuan tidak aktif / masa tenggang')
    setActionNote('')
    setErrorMessage('')
  }

  // Close Modal
  const handleCloseModal = () => {
    setModalMode(null)
    setSelectedTrx(null)
    setActionNote('')
    setErrorMessage('')
  }

  // Confirm Approve
  const handleConfirmApprove = (e) => {
    e.preventDefault()
    if (!selectedTrx) return
    onApprove(selectedTrx.id, actionNote.trim() || 'Disetujui oleh operator.')
    handleCloseModal()
  }

  // Confirm Reject
  const handleConfirmReject = (e) => {
    e.preventDefault()
    if (!selectedTrx) return

    const finalReason =
      presetReason === 'Lainnya'
        ? actionNote.trim()
        : actionNote.trim()
        ? `${presetReason} — ${actionNote.trim()}`
        : presetReason

    if (!finalReason) {
      setErrorMessage('Harap tentukan alasan penolakan transaksi.')
      return
    }

    onReject(selectedTrx.id, finalReason)
    handleCloseModal()
  }

  return (
    <div className="space-y-6">
      {/* Information Guidance Banner */}
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-xs text-amber-900">
        <div className="flex items-center gap-2 font-bold text-amber-800">
          <ClipboardCheck size={16} />
          <span>Antrean Pemeriksaan & Validasi Operasional</span>
        </div>
        <p className="mt-1 text-slate-600 leading-relaxed">
          Setiap transaksi baru masuk berstatus <b className="text-amber-700">Menunggu</b>. Operator bertanggung jawab memverifikasi keabsahan nomor tujuan dan ketersediaan produk sebelum menentukan status akhir (Setujui atau Tolak). Seluruh tindakan akan otomatis dicatat ke dalam <b>LogValidasi</b>.
        </p>
      </div>

      {/* Tab Navigation: Queue vs Audit Logs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'queue'
              ? 'bg-ink text-white shadow-soft'
              : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
          }`}
        >
          <ClipboardCheck size={15} />
          <span>Antrean Validasi</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === 'queue' ? 'bg-gold text-ink font-extrabold' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {pendingTransactions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'logs'
              ? 'bg-ink text-white shadow-soft'
              : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
          }`}
        >
          <History size={15} />
          <span>Log Validasi Audit ({validationLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Antrean Validasi */}
      {activeTab === 'queue' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
          <SectionTitle
            title="Daftar transaksi menunggu pemeriksaan"
            desc={`${pendingTransactions.length} transaksi saat ini membutuhkan peninjauan operator.`}
          />

          {/* Search Box */}
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Cari ID transaksi, nama pelanggan, atau nomor..."
              className="max-w-md"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <RotateCcw size={13} />
                <span>Reset pencarian</span>
              </button>
            )}
          </div>

          {/* Queue Content */}
          {filteredPending.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <Check size={24} />
              </div>
              <h4 className="font-bold text-ink">
                {pendingTransactions.length === 0
                  ? 'Tidak ada transaksi yang menunggu validasi'
                  : 'Tidak ada hasil yang sesuai dengan kata kunci pencarian'}
              </h4>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                {pendingTransactions.length === 0
                  ? 'Seluruh transaksi telah selesai diperiksa. Transaksi baru yang dibuat di menu Transaksi akan otomatis tampil di sini.'
                  : 'Silakan reset pencarian untuk menampilkan kembali antrean transaksi.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPending.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-slate-200/80 p-4 transition hover:border-slate-300 hover:bg-slate-50/50"
                >
                  {/* Left: Transaction Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-ink tabular-nums">
                        {item.id}
                      </span>
                      <span className="text-[11px] text-slate-400">• {item.date}</span>
                      <StatusBadge value={item.status} />
                    </div>

                    <div className="text-xs font-semibold text-slate-800">
                      {item.customer}{' '}
                      <span className="font-mono text-slate-500 font-normal">
                        ({item.phone})
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Produk: <b className="text-slate-800">{item.product}</b> • Nominal:{' '}
                      <span className="font-bold font-mono text-ink tabular-nums">
                        {formatRupiah(item.amount)}
                      </span>
                      {item.note && (
                        <span className="text-slate-400 italic ml-2">
                          (Catatan: "{item.note}")
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleOpenApprove(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-95 shadow-sm"
                    >
                      <Check size={14} />
                      <span>Setujui</span>
                    </button>

                    <button
                      onClick={() => handleOpenReject(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                    >
                      <XCircle size={14} />
                      <span>Tolak</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Log Validasi Audit Trail */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
          <SectionTitle
            title="Catatan Log Validasi (Audit Trail)"
            desc="Rekam jejak setiap tindakan persetujuan dan penolakan transaksi sesuai PRD."
          />

          <TableWrap minWidth="min-w-[760px]">
            <thead>
              <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pr-4">ID Log</th>
                <th className="py-3 pr-4">ID Transaksi</th>
                <th className="py-3 pr-4">Pelaku Validasi</th>
                <th className="py-3 pr-4">Alur Status</th>
                <th className="py-3 pr-4">Waktu Validasi</th>
                <th className="py-3 pr-4">Catatan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {validationLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-slate-400">
                    Belum ada riwayat validasi yang tercatat.
                  </td>
                </tr>
              ) : (
                validationLogs.map((log) => (
                  <tr key={log.id} className="transition hover:bg-slate-50/60">
                    <td className="py-3.5 pr-4 font-mono font-bold text-ink tabular-nums text-xs">
                      {log.id}
                    </td>
                    <td className="py-3.5 pr-4 font-mono font-bold text-slate-700 tabular-nums">
                      {log.transaksi_id}
                    </td>
                    <td className="py-3.5 pr-4 text-xs font-semibold text-slate-800">
                      {log.validator_id}
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <StatusBadge value={log.status_sebelum} />
                        <ArrowRight size={12} className="text-slate-400" />
                        <StatusBadge value={log.status_sesudah} />
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-slate-500 tabular-nums">
                      {log.validated_at}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-slate-600 max-w-xs">
                      {log.catatan || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        </div>
      )}

      {/* MODAL: Konfirmasi Persetujuan */}
      {modalMode === 'approve' && selectedTrx && (
        <Modal
          title="Konfirmasi Persetujuan Transaksi"
          onClose={handleCloseModal}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmApprove} className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-900">
              <p className="font-bold">Apakah Anda yakin menyetujui transaksi ini?</p>
              <div className="mt-2 space-y-1 text-slate-700">
                <div>ID: <b className="font-mono text-ink">{selectedTrx.id}</b></div>
                <div>Pelanggan: <b>{selectedTrx.customer}</b> ({selectedTrx.phone})</div>
                <div>Produk: <b>{selectedTrx.product}</b></div>
                <div>Nominal: <b className="text-ink">{formatRupiah(selectedTrx.amount)}</b></div>
              </div>
            </div>

            <Field label="Catatan Persetujuan (Opsional)">
              <input
                type="text"
                className="field"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Misal: Transaksi diverifikasi berhasil..."
              />
            </Field>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Batal
              </Button>
              <Button variant="success" type="submit">
                <Check size={14} />
                <span>Konfirmasi Setujui</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Konfirmasi Penolakan */}
      {modalMode === 'reject' && selectedTrx && (
        <Modal
          title="Konfirmasi Penolakan Transaksi"
          onClose={handleCloseModal}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmReject} className="space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-900">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertTriangle size={15} />
                <span>Transaksi akan ditandai Gagal</span>
              </div>
              <div className="mt-2 space-y-1 text-slate-700">
                <div>ID: <b className="font-mono text-ink">{selectedTrx.id}</b></div>
                <div>Pelanggan: <b>{selectedTrx.customer}</b> ({selectedTrx.phone})</div>
                <div>Produk: <b>{selectedTrx.product}</b></div>
              </div>
            </div>

            <Field label="Alasan Penolakan">
              <select
                value={presetReason}
                onChange={(e) => setPresetReason(e.target.value)}
                className="field mb-2"
              >
                <option value="Nomor tujuan tidak aktif / masa tenggang">
                  Nomor tujuan tidak aktif / masa tenggang
                </option>
                <option value="Nomor tujuan salah operator provider">
                  Nomor tujuan salah operator provider
                </option>
                <option value="Gangguan koneksi dari sistem operator">
                  Gangguan koneksi dari sistem operator
                </option>
                <option value="Limit kuota distribusi harian tercapai">
                  Limit kuota distribusi harian tercapai
                </option>
                <option value="Lainnya">Lainnya (Tulis alasan khusus)</option>
              </select>
            </Field>

            <Field
              label={presetReason === 'Lainnya' ? 'Alasan Khusus (Wajib)' : 'Catatan Tambahan (Opsional)'}
              hint={errorMessage}
              className={errorMessage ? 'text-rose-600' : ''}
            >
              <textarea
                rows={2}
                className="field"
                value={actionNote}
                onChange={(e) => {
                  setActionNote(e.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
                placeholder="Jelaskan alasan penolakan secara spesifik..."
              />
            </Field>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Batal
              </Button>
              <Button variant="danger" type="submit">
                <XCircle size={14} />
                <span>Konfirmasi Tolak</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
