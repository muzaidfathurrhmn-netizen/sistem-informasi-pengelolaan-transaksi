import React, { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import {
  initialTransactions,
  initialProducts,
  initialNumbers,
  initialValidationLogs,
} from './data/dummyData'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'

// Pages
import { DashboardPage } from './pages/DashboardPage'
import { DataPulsaPage } from './pages/DataPulsaPage'
import { NomorTujuanPage } from './pages/NomorTujuanPage'
import { TransaksiPage } from './pages/TransaksiPage'
import { ValidasiPage } from './pages/ValidasiPage'
import { RiwayatPage } from './pages/RiwayatPage'
import { LoginPage } from './pages/LoginPage'

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Auth simulation handlers
  const handleLogin = (userObj) => {
    setCurrentUser(
      userObj || { name: 'Admin Demo', role: 'Admin', email: 'admin@arus.id' }
    )
    setLoggedIn(true)
    setPage('Dashboard')
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setCurrentUser(null)
    setPage('Dashboard')
    setMobileOpen(false)
  }

  // Data states (in-memory dummy data)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [productData, setProductData] = useState(initialProducts)
  const [numberData, setNumberData] = useState(initialNumbers)
  const [validationLogs, setValidationLogs] = useState(initialValidationLogs)

  // Master Data - Pulsa CRUD handlers
  const handleAddProduct = (newProduct) => {
    setProductData((prev) => [newProduct, ...prev])
  }

  const handleEditProduct = (updatedProduct) => {
    setProductData((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    )
  }

  const handleDeleteProduct = (productId) => {
    setProductData((prev) => prev.filter((p) => p.id !== productId))
  }

  // Master Data - Nomor Tujuan CRUD handlers
  const handleAddNumber = (newNumber) => {
    setNumberData((prev) => [newNumber, ...prev])
  }

  const handleEditNumber = (updatedNumber) => {
    setNumberData((prev) =>
      prev.map((n) => (n.id === updatedNumber.id ? updatedNumber : n))
    )
  }

  const handleDeleteNumber = (numberId) => {
    setNumberData((prev) => prev.filter((n) => n.id !== numberId))
  }

  // Create new transaction handler
  const handleAddTransaction = (trxData) => {
    const now = new Date()
    const yy = String(now.getFullYear()).slice(-2)
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const randomSuffix = String(Math.floor(1000 + Math.random() * 9000))
    const newId = `TRX-${yy}${mm}${dd}-${randomSuffix}`

    const dateIso = `${now.getFullYear()}-${mm}-${dd}`

    const dateStr = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now)

    // Mask phone number for display (e.g. 0812••••8821)
    const rawPhone = trxData.phone || ''
    const maskedPhone =
      rawPhone.length > 8
        ? `${rawPhone.slice(0, 4)}••••${rawPhone.slice(-4)}`
        : rawPhone

    const newTrx = {
      id: newId,
      date: dateStr,
      dateIso,
      customer: trxData.customer || 'Pelanggan Baru',
      phone: maskedPhone,
      product: trxData.productName,
      amount: trxData.totalAmount,
      costPrice: trxData.totalCost,
      margin: trxData.totalMargin,
      qty: trxData.qty || 1,
      status: 'Menunggu',
      operator: currentUser?.name || 'Admin Demo',
      note: trxData.note || undefined,
    }

    setTransactions((prev) => [newTrx, ...prev])
    setPage('Validasi Transaksi')
  }

  // Approve transaction & record to LogValidasi
  const handleApprove = (id, approvalNote) => {
    const validatedAt = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())

    const logId = `LOG-${String(validationLogs.length + 1).padStart(3, '0')}`

    const newLog = {
      id: logId,
      transaksi_id: id,
      validator_id: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Admin Demo (Operator)',
      status_sebelum: 'Menunggu',
      status_sesudah: 'Berhasil',
      catatan: approvalNote || 'Transaksi pulsa telah diverifikasi dan disetujui.',
      validated_at: validatedAt,
    }

    setValidationLogs((prev) => [newLog, ...prev])
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Berhasil' } : t))
    )
  }

  // Reject transaction & record to LogValidasi
  const handleReject = (id, rejectionReason) => {
    const validatedAt = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())

    const logId = `LOG-${String(validationLogs.length + 1).padStart(3, '0')}`

    const newLog = {
      id: logId,
      transaksi_id: id,
      validator_id: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Admin Demo (Operator)',
      status_sebelum: 'Menunggu',
      status_sesudah: 'Gagal',
      catatan: rejectionReason || 'Transaksi ditolak oleh operator.',
      validated_at: validatedAt,
    }

    setValidationLogs((prev) => [newLog, ...prev])
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'Gagal', rejectionReason } : t
      )
    )
  }

  // Not logged in: Show login page
  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Role access check helper
  const isOperator = currentUser?.role === 'Operator'
  const isRestrictedPageForOperator =
    isOperator && (page === 'Data Pulsa' || page === 'Nomor Tujuan')

  return (
    <div className="min-h-screen bg-mist text-ink antialiased">
      {/* Sidebar Navigation (Filtered by Role) */}
      <Sidebar
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="min-h-screen lg:pl-[258px]">
        {/* Sticky Header with Role Info */}
        <Header
          page={page}
          setMobileOpen={setMobileOpen}
          currentUser={currentUser}
        />

        {/* Content Body */}
        <div className="mx-auto max-w-[1500px] p-5 md:p-8 space-y-8">
          {/* Restricted Access Banner if Operator tries to access Master Data */}
          {isRestrictedPageForOperator ? (
            <div className="mx-auto my-12 max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-soft">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
                <ShieldAlert size={28} />
              </div>
              <h3 className="text-base font-bold text-ink">Akses Menu Dibatasi</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Sesuai batasan peran pada PRD, peran <b>Operator</b> tidak memiliki kewenangan untuk mengakses atau mengelola Master Data (<b>{page}</b>).
              </p>
              <button
                onClick={() => setPage('Dashboard')}
                className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Kembali ke Dashboard
              </button>
            </div>
          ) : (
            <>
              {page === 'Dashboard' && (
                <DashboardPage
                  transactions={transactions}
                  setPage={setPage}
                  currentUser={currentUser}
                />
              )}

              {page === 'Data Pulsa' && (
                <DataPulsaPage
                  data={productData}
                  onAdd={handleAddProduct}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              )}

              {page === 'Nomor Tujuan' && (
                <NomorTujuanPage
                  data={numberData}
                  onAdd={handleAddNumber}
                  onEdit={handleEditNumber}
                  onDelete={handleDeleteNumber}
                />
              )}

              {page === 'Transaksi' && (
                <TransaksiPage
                  products={productData}
                  numbers={numberData}
                  onSubmit={handleAddTransaction}
                />
              )}

              {page === 'Validasi Transaksi' && (
                <ValidasiPage
                  transactions={transactions}
                  validationLogs={validationLogs}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              )}

              {page === 'Riwayat Transaksi' && (
                <RiwayatPage
                  transactions={transactions}
                  validationLogs={validationLogs}
                />
              )}
            </>
          )}

          {/* Footer Disclaimer */}
          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-5 text-[11px] text-slate-400">
            <span>© 2026 Arus Digital Distributor</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Front-end demo prototype • Role: {currentUser?.role}</span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  )
}
