import React, { useState, useMemo, useEffect } from 'react'
import {
  CreditCard,
  Smartphone,
  CircleHelp,
  TrendingUp,
  Building2,
  User,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { SectionTitle } from '../components/common/SectionTitle'
import { Field } from '../components/common/Field'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { StatusBadge } from '../components/common/StatusBadge'
import { formatRupiah } from '../utils/formatters'

export function TransaksiPage({ products = [], numbers = [], onSubmit }) {
  // Select initial destination number (first available)
  const [selectedNumberId, setSelectedNumberId] = useState('')
  // Select initial product (first available with Tersedia)
  const [selectedProductId, setSelectedProductId] = useState('')
  // Quantity (Jumlah transaksi)
  const [qty, setQty] = useState(1)
  // Optional note
  const [note, setNote] = useState('')
  // Validation errors
  const [errors, setErrors] = useState({})
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Initialize defaults and handle deletion fallback when products or numbers are changed
  useEffect(() => {
    if (numbers.length > 0) {
      const exists = numbers.some((n) => n.id === selectedNumberId)
      if (!exists) {
        setSelectedNumberId(numbers[0].id)
      }
    } else {
      setSelectedNumberId('')
    }
  }, [numbers, selectedNumberId])

  useEffect(() => {
    if (products.length > 0) {
      const exists = products.some((p) => p.id === selectedProductId)
      if (!exists) {
        const activeProd = products.find((p) => p.stock === 'Tersedia') || products[0]
        setSelectedProductId(activeProd.id)
      }
    } else {
      setSelectedProductId('')
    }
  }, [products, selectedProductId])

  // Find currently selected entities
  const selectedNumber = useMemo(() => {
    return numbers.find((n) => n.id === selectedNumberId) || null
  }, [numbers, selectedNumberId])

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || null
  }, [products, selectedProductId])

  // Extract nominal numeric value (e.g. "Rp50.000" -> 50000)
  const nominalValue = useMemo(() => {
    if (!selectedProduct) return 0
    const raw = String(selectedProduct.nominal).replace(/[^0-9]/g, '')
    return Number(raw) || 0
  }, [selectedProduct])

  // Cost price (harga beli distributor)
  const costPrice = useMemo(() => {
    return selectedProduct ? selectedProduct.price : 0
  }, [selectedProduct])

  // Calculations
  const validQty = Math.max(1, parseInt(qty, 10) || 1)
  const totalNominal = nominalValue * validQty
  const totalCost = costPrice * validQty
  const marginPerUnit = nominalValue - costPrice
  const totalMargin = marginPerUnit * validQty
  const marginPercentage =
    totalNominal > 0 ? ((totalMargin / totalNominal) * 100).toFixed(1) : '0'

  // Validate form
  const validate = () => {
    const errs = {}

    if (!selectedNumberId || !selectedNumber) {
      errs.number = 'Pilih nomor tujuan dari Master Nomor Tujuan.'
    }

    if (!selectedProductId || !selectedProduct) {
      errs.product = 'Pilih produk pulsa dari Master Data Pulsa.'
    } else if (selectedProduct.stock === 'Nonaktif') {
      errs.product = 'Produk yang dipilih sedang berstatus Nonaktif dan tidak dapat ditransaksikan.'
    }

    if (!qty || isNaN(qty) || qty < 1 || qty > 20) {
      errs.qty = 'Jumlah transaksi minimal 1 dan maksimal 20.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Handle open confirmation modal
  const handleReviewOrder = (e) => {
    e.preventDefault()
    if (validate()) {
      setShowConfirmModal(true)
    }
  }

  // Handle final submission
  const handleConfirmSubmit = () => {
    if (!selectedNumber || !selectedProduct) return

    const trxPayload = {
      phone: selectedNumber.phone,
      customer: selectedNumber.name,
      productName: `${selectedProduct.provider} ${selectedProduct.nominal}`,
      totalAmount: totalNominal,
      totalCost,
      totalMargin,
      qty: validQty,
      note: note.trim(),
    }

    setShowConfirmModal(false)
    onSubmit(trxPayload)
  }

  return (
    <div className="space-y-6">
      {/* Empty Master Data Warning if any is missing */}
      {numbers.length === 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <ShieldAlert size={18} className="shrink-0 text-amber-600" />
          <div>
            <p className="font-bold">Data Master Nomor Tujuan Kosong</p>
            <p className="mt-0.5">
              Tambahkan nomor tujuan terlebih dahulu di menu <b>Nomor Tujuan</b> sebelum membuat transaksi.
            </p>
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <ShieldAlert size={18} className="shrink-0 text-amber-600" />
          <div>
            <p className="font-bold">Data Master Pulsa Kosong</p>
            <p className="mt-0.5">
              Tambahkan produk pulsa terlebih dahulu di menu <b>Data Pulsa</b> sebelum membuat transaksi.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Form on Left, Order Summary on Right */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        {/* Form Input Section */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <SectionTitle
            title="Formulir transaksi baru"
            desc="Pilih nomor tujuan dan produk pulsa dari master data untuk memproses pesanan."
          />

          <form onSubmit={handleReviewOrder} className="space-y-5">
            {/* Destination Number Selector from Master */}
            <Field
              label="Nomor Tujuan Pelanggan (Dari Master Data)"
              hint={errors.number || 'Pilih pelanggan dari daftar yang sudah terverifikasi'}
              className={errors.number ? 'text-rose-600' : ''}
            >
              <select
                value={selectedNumberId}
                onChange={(e) => {
                  setSelectedNumberId(e.target.value)
                  if (errors.number) setErrors((prev) => ({ ...prev, number: null }))
                }}
                className="field"
                disabled={numbers.length === 0}
              >
                {numbers.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} — {n.phone} ({n.provider} • {n.tag})
                  </option>
                ))}
              </select>
            </Field>

            {/* Display Selected Number Card Preview */}
            {selectedNumber && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-gold font-bold">
                    {selectedNumber.tag === 'Perusahaan' ? (
                      <Building2 size={16} />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-ink">{selectedNumber.name}</div>
                    <div className="font-mono text-slate-500 tabular-nums text-[11px]">
                      {selectedNumber.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                    {selectedNumber.provider}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      selectedNumber.tag === 'Perusahaan'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : 'bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {selectedNumber.tag}
                  </span>
                </div>
              </div>
            )}

            {/* Product Selector from Master */}
            <Field
              label="Produk Pulsa (Dari Master Data)"
              hint={errors.product || 'Pilih produk aktif dari katalog distributor'}
              className={errors.product ? 'text-rose-600' : ''}
            >
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value)
                  if (errors.product) setErrors((prev) => ({ ...prev, product: null }))
                }}
                className="field"
                disabled={products.length === 0}
              >
                {products.map((p) => {
                  const isMatch =
                    selectedNumber && p.provider.toLowerCase() === selectedNumber.provider.toLowerCase()
                  return (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={p.stock === 'Nonaktif'}
                    >
                      {p.provider} {p.nominal} — Modal: {formatRupiah(p.price)} [
                      {p.stock}] {isMatch ? '★ Cocok dengan nomor' : ''}
                    </option>
                  )
                })}
              </select>
            </Field>

            {/* Quantity Input */}
            <Field
              label="Jumlah Transaksi (Qty)"
              hint={errors.qty || 'Batas transaksi 1 hingga 20 per pemesanan'}
              className={errors.qty ? 'text-rose-600' : ''}
            >
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={qty}
                  onChange={(e) => {
                    setQty(e.target.value)
                    if (errors.qty) setErrors((prev) => ({ ...prev, qty: null }))
                  }}
                  className="field w-28 text-center font-bold tabular-nums"
                />
                <span className="text-xs text-slate-500">transaksi pulsa</span>
              </div>
            </Field>

            {/* Note Input */}
            <Field label="Catatan Transaksi (Opsional)">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="field"
                placeholder="Misal: Pembelian voucher bulanan cabang..."
              />
            </Field>

            {/* Reminder Alert */}
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-3.5 text-xs text-amber-900">
              <div className="mb-1 flex items-center gap-2 font-bold text-amber-800">
                <CircleHelp size={15} />
                <span>Ketentuan Alur Transaksi</span>
              </div>
              Transaksi yang disimpan akan otomatis masuk ke antrean validasi dengan status{' '}
              <b className="text-amber-700">Menunggu</b> untuk diverifikasi oleh operator.
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={numbers.length === 0 || products.length === 0}
              >
                <CreditCard size={15} />
                <span>Periksa Ringkasan Transaksi</span>
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary Card */}
        <div className="flex flex-col justify-between rounded-2xl bg-ink p-6 text-white shadow-soft">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Ringkasan Transaksi Real-time
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Live Kalkulasi
              </span>
            </div>

            {/* Selected Product Highlight */}
            {selectedProduct ? (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-gold shadow-sm">
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {selectedProduct.provider} {selectedProduct.nominal}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      ID Produk: {selectedProduct.id} • Modal:{' '}
                      {formatRupiah(selectedProduct.price)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400 text-center">
                Belum ada produk yang dipilih.
              </div>
            )}

            {/* Itemized Calculation */}
            <div className="my-5 border-t border-white/10" />

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Penerima / Nomor</span>
                <span className="font-semibold text-white tabular-nums">
                  {selectedNumber ? `${selectedNumber.name} (${selectedNumber.phone})` : '-'}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Nilai Pulsa Satuan</span>
                <span className="font-mono tabular-nums text-white">
                  {formatRupiah(nominalValue)}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Jumlah Transaksi</span>
                <span className="font-bold text-white tabular-nums">
                  {validQty}x
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Harga Beli Distributor (Modal)</span>
                <span className="font-mono tabular-nums text-slate-300">
                  {formatRupiah(totalCost)}
                </span>
              </div>

              <div className="flex justify-between items-center rounded-lg bg-white/5 px-3 py-2 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <TrendingUp size={14} />
                  Estimasi Margin Distributor
                </span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  +{formatRupiah(totalMargin)} ({marginPercentage}%)
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Biaya Layanan Admin</span>
                <span className="font-semibold text-emerald-400">Rp0 (Gratis)</span>
              </div>
            </div>
          </div>

          <div>
            <div className="my-5 border-t border-white/10" />
            <div className="flex items-baseline justify-between">
              <div>
                <span className="block text-xs text-slate-300">Total Nilai Transaksi</span>
                <span className="text-[10px] text-slate-400">Akumulasi nominal pulsa</span>
              </div>
              <span className="text-2xl font-extrabold text-gold font-mono tabular-nums">
                {formatRupiah(totalNominal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Requirement 7) */}
      {showConfirmModal && selectedNumber && selectedProduct && (
        <Modal
          title="Konfirmasi Pesanan Transaksi"
          onClose={() => setShowConfirmModal(false)}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Periksa rincian data transaksi berikut sebelum dicatat ke antrean validasi:
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Pelanggan / Nomor</span>
                <span className="font-bold text-ink text-right">
                  {selectedNumber.name}
                  <br />
                  <span className="font-mono font-normal text-slate-600">
                    {selectedNumber.phone} ({selectedNumber.provider})
                  </span>
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Produk Pulsa</span>
                <span className="font-bold text-ink">
                  {selectedProduct.provider} {selectedProduct.nominal}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Jumlah Transaksi</span>
                <span className="font-bold text-ink">{validQty}x transaksi</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Modal Beli Distributor</span>
                <span className="font-mono text-slate-700">{formatRupiah(totalCost)}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Estimasi Margin Keuntungan</span>
                <span className="font-mono font-bold text-emerald-600">
                  +{formatRupiah(totalMargin)} ({marginPercentage}%)
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-600 font-bold">Total Nilai Transaksi</span>
                <span className="font-mono text-base font-extrabold text-ink">
                  {formatRupiah(totalNominal)}
                </span>
              </div>

              {note && (
                <div className="border-t border-slate-200/80 pt-2 text-[11px] text-slate-500">
                  Catatan: <i className="text-slate-700">"{note}"</i>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-800 border border-amber-200/60">
              <CircleHelp size={14} className="shrink-0" />
              <span>
                Status awal transaksi ini adalah <b className="text-amber-900">Menunggu</b> dan akan langsung diarahkan ke halaman Validasi.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowConfirmModal(false)}
              >
                Ubah Data
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleConfirmSubmit}
              >
                <CheckCircle2 size={15} />
                <span>Konfirmasi & Simpan Transaksi</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
