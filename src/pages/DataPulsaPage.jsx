import React, { useState, useMemo } from 'react'
import {
  Plus,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import { SectionTitle } from '../components/common/SectionTitle'
import { Button } from '../components/common/Button'
import { SearchBox } from '../components/common/SearchBox'
import { TableWrap } from '../components/common/TableWrap'
import { StatusBadge } from '../components/common/StatusBadge'
import { Modal } from '../components/common/Modal'
import { Field } from '../components/common/Field'
import { formatRupiah } from '../utils/formatters'

export function DataPulsaPage({ data, onAdd, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [providerFilter, setProviderFilter] = useState('Semua Provider')
  const [stockFilter, setStockFilter] = useState('Semua Status')

  // Modal states: null | 'add' | 'edit' | 'delete'
  const [modalMode, setModalMode] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Form field states
  const [formProvider, setFormProvider] = useState('Telkomsel')
  const [formNominal, setFormNominal] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formStock, setFormStock] = useState('Tersedia')
  const [formErrors, setFormErrors] = useState({})

  // Format date helper
  const getTodayFormatted = () => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date())
  }

  // Filtered products list
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchQuery =
        item.id.toLowerCase().includes(query.toLowerCase()) ||
        item.provider.toLowerCase().includes(query.toLowerCase()) ||
        item.nominal.toLowerCase().includes(query.toLowerCase())

      const matchProvider =
        providerFilter === 'Semua Provider' || item.provider === providerFilter

      const matchStock =
        stockFilter === 'Semua Status' || item.stock === stockFilter

      return matchQuery && matchProvider && matchStock
    })
  }, [data, query, providerFilter, stockFilter])

  // Reset filter
  const handleResetFilters = () => {
    setQuery('')
    setProviderFilter('Semua Provider')
    setStockFilter('Semua Status')
  }

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalMode('add')
    setSelectedProduct(null)
    setFormProvider('Telkomsel')
    setFormNominal('')
    setFormPrice('')
    setFormStock('Tersedia')
    setFormErrors({})
  }

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setModalMode('edit')
    setSelectedProduct(product)
    setFormProvider(product.provider)
    // Extract numbers from "Rp50.000" -> "50000"
    const rawNominal = product.nominal.replace(/[^0-9]/g, '')
    setFormNominal(rawNominal)
    setFormPrice(String(product.price))
    setFormStock(product.stock)
    setFormErrors({})
  }

  // Open Delete Confirmation Modal
  const handleOpenDelete = (product) => {
    setSelectedProduct(product)
    setModalMode('delete')
  }

  // Close any modal
  const handleCloseModal = () => {
    setModalMode(null)
    setSelectedProduct(null)
    setFormErrors({})
  }

  // Validate form fields
  const validateForm = () => {
    const errors = {}

    if (!formProvider.trim()) {
      errors.provider = 'Provider wajib dipilih.'
    }

    const numNominal = Number(formNominal)
    if (!formNominal || isNaN(numNominal) || numNominal <= 0) {
      errors.nominal = 'Nominal harus berupa angka lebih besar dari 0.'
    }

    const numPrice = Number(formPrice)
    if (!formPrice || isNaN(numPrice) || numPrice <= 0) {
      errors.price = 'Harga beli harus berupa angka lebih besar dari 0.'
    }

    if (!['Tersedia', 'Nonaktif'].includes(formStock)) {
      errors.stock = 'Status produk wajib dipilih.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit Add or Edit
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const formattedNominal = `Rp${Number(formNominal).toLocaleString('id-ID')}`
    const priceNumber = Number(formPrice)

    if (modalMode === 'add') {
      // Generate ID PLS-XXX
      const maxNum = data.reduce((acc, curr) => {
        const num = parseInt(curr.id.replace(/[^0-9]/g, ''), 10)
        return !isNaN(num) && num > acc ? num : acc
      }, 0)
      const newId = `PLS-${String(maxNum + 1).padStart(3, '0')}`

      const newProduct = {
        id: newId,
        provider: formProvider,
        nominal: formattedNominal,
        price: priceNumber,
        stock: formStock,
        updated: getTodayFormatted(),
      }
      onAdd(newProduct)
    } else if (modalMode === 'edit' && selectedProduct) {
      const updatedProduct = {
        ...selectedProduct,
        provider: formProvider,
        nominal: formattedNominal,
        price: priceNumber,
        stock: formStock,
        updated: getTodayFormatted(),
      }
      onEdit(updatedProduct)
    }

    handleCloseModal()
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (selectedProduct) {
      onDelete(selectedProduct.id)
    }
    handleCloseModal()
  }

  const isFilterActive =
    query !== '' ||
    providerFilter !== 'Semua Provider' ||
    stockFilter !== 'Semua Status'

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      {/* Title & Add Action */}
      <SectionTitle
        title="Daftar produk pulsa"
        desc="Kelola katalog produk, nominal, harga beli, dan status ketersediaan distributor."
        action={
          <Button onClick={handleOpenAdd} variant="primary">
            <Plus size={15} />
            <span>Tambah produk pulsa</span>
          </Button>
        }
      />

      {/* Search & Filter Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Cari ID produk, provider, atau nominal..."
          className="min-w-[220px]"
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Provider Filter */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
          >
            <option value="Semua Provider">Semua Provider</option>
            <option value="Telkomsel">Telkomsel</option>
            <option value="XL">XL</option>
            <option value="Indosat">Indosat</option>
            <option value="Tri">Tri</option>
            <option value="Smartfren">Smartfren</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>

          {/* Reset Filter Button */}
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              title="Reset pencarian dan filter"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <TableWrap>
        <thead>
          <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3 pr-4">ID Produk</th>
            <th className="py-3 pr-4">Provider</th>
            <th className="py-3 pr-4">Nominal</th>
            <th className="py-3 pr-4">Harga Beli</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Terakhir Diperbarui</th>
            <th className="py-3 pr-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-12 text-center text-xs text-slate-400"
              >
                {data.length === 0 ? (
                  <div>
                    <p className="font-semibold text-slate-600">
                      Belum ada data produk pulsa.
                    </p>
                    <p className="mt-1 text-slate-400">
                      Klik tombol "Tambah produk pulsa" di atas untuk menambahkan data baru.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-slate-600">
                      Tidak ditemukan produk yang cocok.
                    </p>
                    <p className="mt-1 text-slate-400">
                      Silakan periksa kata kunci pencarian atau reset filter.
                    </p>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id} className="transition hover:bg-slate-50/60">
                <td className="py-3.5 pr-4 font-bold text-ink font-mono tabular-nums">
                  {item.id}
                </td>
                <td className="py-3.5 pr-4">
                  <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {item.provider}
                  </span>
                </td>
                <td className="py-3.5 pr-4 font-semibold text-slate-800">
                  {item.nominal}
                </td>
                <td className="py-3.5 pr-4 font-bold text-ink tabular-nums">
                  {formatRupiah(item.price)}
                </td>
                <td className="py-3.5 pr-4">
                  <StatusBadge value={item.stock} />
                </td>
                <td className="py-3.5 pr-4 text-xs text-slate-400">
                  {item.updated}
                </td>
                <td className="py-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink"
                      title="Edit produk"
                      aria-label={`Edit ${item.id}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(item)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      title="Hapus produk"
                      aria-label={`Hapus ${item.id}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
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
          <b className="text-slate-700">{data.length}</b> produk pulsa
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

      {/* Form Modal (Add / Edit) */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <Modal
          title={
            modalMode === 'add'
              ? 'Tambah Produk Pulsa Baru'
              : `Edit Produk Pulsa (${selectedProduct?.id})`
          }
          onClose={handleCloseModal}
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Field
              label="Provider Pulsa"
              hint={formErrors.provider}
              className={formErrors.provider ? 'text-rose-600' : ''}
            >
              <select
                value={formProvider}
                onChange={(e) => setFormProvider(e.target.value)}
                className="field"
              >
                <option value="Telkomsel">Telkomsel</option>
                <option value="XL">XL</option>
                <option value="Indosat">Indosat</option>
                <option value="Tri">Tri</option>
                <option value="Smartfren">Smartfren</option>
              </select>
            </Field>

            <Field
              label="Nominal Pulsa (Angka)"
              hint={formErrors.nominal || 'Contoh: 50000 untuk nominal Rp50.000'}
              className={formErrors.nominal ? 'text-rose-600' : ''}
            >
              <input
                type="number"
                min="1000"
                step="1000"
                required
                className="field"
                placeholder="50000"
                value={formNominal}
                onChange={(e) => setFormNominal(e.target.value)}
              />
            </Field>

            <Field
              label="Harga Beli Distributor (Rp)"
              hint={formErrors.price || 'Contoh: 48500'}
              className={formErrors.price ? 'text-rose-600' : ''}
            >
              <input
                type="number"
                min="1000"
                step="100"
                required
                className="field"
                placeholder="48500"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
              />
            </Field>

            <Field
              label="Status Ketersediaan"
              hint={formErrors.stock}
              className={formErrors.stock ? 'text-rose-600' : ''}
            >
              <select
                value={formStock}
                onChange={(e) => setFormStock(e.target.value)}
                className="field"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </Field>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                type="button"
                onClick={handleCloseModal}
              >
                Batal
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === 'add' ? 'Tambah Produk' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'delete' && selectedProduct && (
        <Modal title="Konfirmasi Hapus Produk" onClose={handleCloseModal}>
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Apakah Anda yakin ingin menghapus produk ini?</p>
                <p className="mt-1">
                  Produk <b className="font-mono">{selectedProduct.id}</b> ({selectedProduct.provider} - {selectedProduct.nominal}) akan dihapus dari daftar master pulsa.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="secondary"
                type="button"
                onClick={handleCloseModal}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={handleConfirmDelete}
              >
                Hapus Produk
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
