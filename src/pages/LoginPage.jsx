import React, { useState } from 'react'
import { Zap, ChevronRight, Lock, Mail, AlertCircle, Shield, UserCheck } from 'lucide-react'
import { Field } from '../components/common/Field'
import { Button } from '../components/common/Button'

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Quick fill accounts
  const handleFillAccount = (role) => {
    if (role === 'admin') {
      setEmail('admin@arus.id')
      setPassword('admin123')
    } else {
      setEmail('operator@arus.id')
      setPassword('operator123')
    }
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    // Validasi simulasi role akun
    if (cleanEmail === 'admin@arus.id' && cleanPassword === 'admin123') {
      setError('')
      onLogin({
        email: 'admin@arus.id',
        name: 'Admin Demo',
        role: 'Admin',
      })
    } else if (cleanEmail === 'operator@arus.id' && cleanPassword === 'operator123') {
      setError('')
      onLogin({
        email: 'operator@arus.id',
        name: 'Nadia (Operator)',
        role: 'Operator',
      })
    } else {
      setError('Kredensial tidak cocok. Silakan gunakan akun demo Admin atau Operator yang tersedia.')
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink p-4">
      <div className="w-full max-w-[440px] rounded-3xl bg-white p-8 shadow-2xl">
        {/* Brand Logo */}
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-ink shadow-sm">
            <Zap size={22} fill="currentColor" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-ink tracking-tight">
              arus<span className="text-gold">.</span>
            </div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-slate-400">
              DIGITAL DISTRIBUTOR
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-extrabold text-ink tracking-tight">
          Selamat datang.
        </h1>
        <p className="mt-1.5 text-xs text-slate-500">
          Masuk ke portal operasional transaksi distributor digital.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email Pengguna">
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                required
                className="field pl-9"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                placeholder="admin@arus.id atau operator@arus.id"
              />
            </div>
          </Field>

          <Field label="Kata Sandi">
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                required
                className="field pl-9"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                placeholder="••••••••"
              />
            </div>
          </Field>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full py-3 text-sm">
              <span>Masuk ke dashboard</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        </form>

        {/* Demo Credentials Box with Dual Role Buttons */}
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-600 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="font-bold text-ink">Simulasi Peran Pengguna (Role):</span>
            <span className="text-[10px] text-slate-400">Pilih akun instan</span>
          </div>

          {/* Admin Option */}
          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-100 shadow-card">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-ink">
                <Shield size={13} className="text-amber-500" />
                <span>Akun Administrator</span>
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                admin@arus.id • admin123
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleFillAccount('admin')}
              className="rounded-lg bg-ink px-2.5 py-1 text-[11px] font-bold text-gold hover:bg-slate-800 transition"
            >
              Pilih Admin
            </button>
          </div>

          {/* Operator Option */}
          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-100 shadow-card">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-ink">
                <UserCheck size={13} className="text-emerald-500" />
                <span>Akun Operator</span>
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                operator@arus.id • operator123
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleFillAccount('operator')}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Pilih Operator
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] text-slate-400">
          © 2026 Arus Digital • Prototype Front-end RBAC (Fase 6)
        </p>
      </div>
    </div>
  )
}
