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
import { Modal } from '../components/common/Modal'
import { Field } from '../components/common/Field'

export function NomorTujuanPage({ data, onAdd, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori')
  const [providerFilter, setProviderFilter] = useState('Semua Provider')

  // Modal states: null | 'add' | 'edit' | 'delete'
  const [modalMode, setModalMode] = useState(null)
  const [selectedNumber, setSelectedNumber] = useState(null)

  // Form field states
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formProvider, setFormProvider] = useState('Telkomsel')
  const [formTag, setFormTag] = useState('Retail')
  const [formErrors, setFormErrors] = useState({})

  // Provider detection helper from prefix
  const detectProviderFromPhone = (num) => {
    const clean = num.replace(/[^0-9]/g, '')
    if (clean.length < 4) return null
    const prefix = clean.slice(0, 4)

    if (['0811', '0812', '0813', '0821', '0822', '0823', '0852', '0853'].includes(prefix)) {
      return 'Telkomsel'
    }
    if (['0817', '0818', '0819', '0859', '0877', '0878'].includes(prefix)) {
      return 'XL'
    }
    if (['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(prefix)) {
      return 'Indosat'
    }
    if (['0895', '0896', '0897', '0898', '0899'].includes(prefix)) {
      return 'Tri'
    }
    if (['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'].includes(prefix)) {
      return 'Smartfren'
    }
    return null
  }

  // Handle phone input change with auto-detection
  const handlePhoneChange = (val) => {
    setFormPhone(val)
    const detected = detectProviderFromPhone(val)
    if (detected) {
      setFormProvider(detected)
    }
  }

  // Filtered numbers list
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchQuery =
        item.id.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.phone.toLowerCase().includes(query.toLowerCase()) ||
        item.provider.toLowerCase().includes(query.toLowerCase())

      const matchCategory =
        categoryFilter === 'Semua Kategori' || item.tag === categoryFilter

      const matchProvider =
        providerFilter === 'Semua Provider' || item.provider === providerFilter

      return matchQuery && matchCategory && matchProvider
    })
  }, [data, query, categoryFilter, providerFilter])

  // Reset filters
  const handleResetFilters = () => {
    setQuery('')
    setCategoryFilter('Semua Kategori')
    setProviderFilter('Semua Provider')
  }

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalMode('add')
    setSelectedNumber(null)
    setFormName('')
    setFormPhone('')
    setFormProvider('Telkomsel')
    setFormTag('Retail')
    setFormErrors({})
  }

  // Open Edit Modal
  const handleOpenEdit = (numberItem) => {
    setModalMode('edit')
    setSelectedNumber(numberItem)
    setFormName(numberItem.name)
    setFormPhone(numberItem.phone)
    setFormProvider(numberItem.provider)
    setFormTag(numberItem.tag)
    setFormErrors({})
  }

  // Open Delete Modal
  const handleOpenDelete = (numberItem) => {
    setSelectedNumber(numberItem)
    setModalMode('delete')
  }

  // Close Modal
  const handleCloseModal = () => {
    setModalMode(null)
    setSelectedNumber(null)
    setFormErrors({})
  }

  // Validate form fields
  const validateForm = () => {
    const errors = {}

    if (!formName.trim() || formName.trim().length < 3) {
      errors.name = 'Nama pelanggan minimal 3 karakter.'
    }

    const cleanPhone = formPhone.trim()
    const phoneRegex = /^08[0-9]{8,12}$/
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone = 'Nomor tujuan harus berawalan 08 dan terdiri dari 10-14 digit angka.'
    } else {
      // Check for duplicate number
      const duplicate = data.find(
        (item) =>
          item.phone === cleanPhone &&
          (!selectedNumber || item.id !== selectedNumber.id)
      )
      if (duplicate) {
        errors.phone = `Nomor ini sudah terdaftar atas nama ${duplicate.name}.`
      }
    }

    if (!formProvider.trim()) {
      errors.provider = 'Provider wajib dipilih.'
    }

    if (!['Perusahaan', 'Retail'].includes(formTag)) {
      errors.tag = 'Kategori wajib dipilih.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit Add or Edit
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const cleanPhone = formPhone.trim()

    if (modalMode === 'add') {
      // Generate ID NTJ-XXX
      const maxNum = data.reduce((acc, curr) => {
        const num = parseInt(curr.id.replace(/[^0-9]/g, ''), 10)
        return !isNaN(num) && num > acc ? num : acc
      }, 0)
      const newId = `NTJ-${String(maxNum + 1).padStart(3, '0')}`

      const newNumber = {
        id: newId,
        name: formName.trim(),
        phone: cleanPhone,
        provider: formProvider,
        tag: formTag,
      }
      onAdd(newNumber)
    } else if (modalMode === 'edit' && selectedNumber) {
      const updatedNumber = {
        ...selectedNumber,
        name: formName.trim(),
        phone: cleanPhone,
        provider: formProvider,
        tag: formTag,
      }
      onEdit(updatedNumber)
    }

    handleCloseModal()
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (selectedNumber) {
      onDelete(selectedNumber.id)
    }
    handleCloseModal()
  }

  const isFilterActive =
    query !== '' ||
    categoryFilter !== 'Semua Kategori' ||
    providerFilter !== 'Semua Provider'

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      {/* Title & Add Action */}
      <SectionTitle
        title="Daftar nomor tujuan"
        desc="Kelola data nomor pelanggan dan mitra perusahaan untuk tujuan pengiriman transaksi pulsa."
        action={
          <Button onClick={handleOpenAdd} variant="primary">
            <Plus size={15} />
            <span>Tambah nomor tujuan</span>
          </Button>
        }
      />

      {/* Search & Filter Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Cari nama pelanggan, nomor, atau ID..."
          className="min-w-[220px]"
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
          >
            <option value="Semua Kategori">Semua Kategori</option>
            <option value="Perusahaan">Perusahaan</option>
            <option value="Retail">Retail</option>
          </select>

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

      {/* Table */}
      <TableWrap>
        <thead>
          <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3 pr-4">ID Nomor</th>
            <th className="py-3 pr-4">Nama Pelanggan</th>
            <th className="py-3 pr-4">Nomor Tujuan</th>
            <th className="py-3 pr-4">Provider</th>
            <th className="py-3 pr-4">Kategori</th>
            <th className="py-3 pr-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-12 text-center text-xs text-slate-400"
              >
                {data.length === 0 ? (
                  <div>
                    <p className="font-semibold text-slate-600">
                      Belum ada data nomor tujuan.
                    </p>
                    <p className="mt-1 text-slate-400">
                      Klik tombol "Tambah nomor tujuan" di atas untuk menambahkan data baru.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-slate-600">
                      Tidak ditemukan nomor tujuan yang cocok.
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
                <td className="py-3.5 pr-4 font-semibold text-slate-800">
                  {item.name}
                </td>
                <td className="py-3.5 pr-4 font-mono tabular-nums text-slate-600">
                  {item.phone}
                </td>
                <td className="py-3.5 pr-4">
                  <span className="inline-block rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {item.provider}
                  </span>
                </td>
                <td className="py-3.5 pr-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      item.tag === 'Perusahaan'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                        : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {item.tag}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink"
                      title="Edit nomor tujuan"
                      aria-label={`Edit ${item.id}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(item)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      title="Hapus nomor tujuan"
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
          <b className="text-slate-700">{data.length}</b> nomor tujuan
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
              ? 'Tambah Nomor Tujuan Baru'
              : `Edit Nomor Tujuan (${selectedNumber?.id})`
          }
          onClose={handleCloseModal}
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Field
              label="Nama Pelanggan / Entitas"
              hint={formErrors.name || 'Contoh: PT Harapan Jaya atau Toko Berkah'}
              className={formErrors.name ? 'text-rose-600' : ''}
            >
              <input
                type="text"
                required
                className="field"
                placeholder="Masukkan nama pelanggan..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </Field>

            <Field
              label="Nomor Tujuan (HP)"
              hint={formErrors.phone || 'Format: 08xxxxxxxxxx (10–14 digit)'}
              className={formErrors.phone ? 'text-rose-600' : ''}
            >
              <input
                type="tel"
                required
                className="field font-mono"
                placeholder="081234567890"
                value={formPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            </Field>

            <Field
              label="Provider Operator"
              hint={formErrors.provider || 'Terdeteksi otomatis dari awalan nomor'}
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
              label="Kategori Pelanggan"
              hint={formErrors.tag}
              className={formErrors.tag ? 'text-rose-600' : ''}
            >
              <select
                value={formTag}
                onChange={(e) => setFormTag(e.target.value)}
                className="field"
              >
                <option value="Retail">Retail</option>
                <option value="Perusahaan">Perusahaan</option>
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
                {modalMode === 'add' ? 'Tambah Nomor' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'delete' && selectedNumber && (
        <Modal title="Konfirmasi Hapus Nomor Tujuan" onClose={handleCloseModal}>
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Apakah Anda yakin ingin menghapus nomor tujuan ini?</p>
                <p className="mt-1">
                  Nomor <b className="font-mono">{selectedNumber.phone}</b> ({selectedNumber.name} - {selectedNumber.provider}) akan dihapus dari data pelanggan.
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
                Hapus Nomor
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
