import React from 'react'

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}) {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-5 py-3 text-sm',
  }

  const variantStyles = {
    primary:
      'bg-ink text-white shadow-soft hover:bg-slate-800 active:scale-[0.99] focus:ring-2 focus:ring-ink/20',
    gold:
      'bg-gold text-ink font-extrabold hover:bg-yellow-400 active:scale-[0.99] focus:ring-2 focus:ring-yellow-300',
    secondary:
      'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-ink active:scale-[0.99] focus:ring-2 focus:ring-slate-200',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99] focus:ring-2 focus:ring-emerald-400',
    danger:
      'border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-[0.99] focus:ring-2 focus:ring-rose-300',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      {children}
    </button>
  )
}

