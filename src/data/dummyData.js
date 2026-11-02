import {
  LayoutDashboard,
  Package,
  Smartphone,
  CreditCard,
  ClipboardCheck,
  FileClock,
} from 'lucide-react'

export const initialTransactions = [
  {
    id: 'TRX-261102-0081',
    date: '02 Nov 2026, 09:42',
    dateIso: '2026-11-02',
    customer: 'PT Sinar Abadi',
    phone: '0812••••8821',
    product: 'Telkomsel 50.000',
    amount: 50000,
    status: 'Berhasil',
    operator: 'Nadia',
  },
  {
    id: 'TRX-261102-0080',
    date: '02 Nov 2026, 09:28',
    dateIso: '2026-11-02',
    customer: 'CV Maju Jaya',
    phone: '0857••••1204',
    product: 'XL 25.000',
    amount: 25000,
    status: 'Menunggu',
    operator: 'Rizky',
  },
  {
    id: 'TRX-261102-0079',
    date: '02 Nov 2026, 09:14',
    dateIso: '2026-11-02',
    customer: 'Toko Berkah',
    phone: '0821••••4432',
    product: 'Indosat 100.000',
    amount: 100000,
    status: 'Berhasil',
    operator: 'Nadia',
  },
  {
    id: 'TRX-261102-0078',
    date: '02 Nov 2026, 08:56',
    dateIso: '2026-11-02',
    customer: 'PT Sinar Abadi',
    phone: '0812••••8821',
    product: 'Telkomsel 20.000',
    amount: 20000,
    status: 'Gagal',
    operator: 'Rizky',
    rejectionReason: 'Nomor tujuan berada dalam masa tenggang operator.',
  },
  {
    id: 'TRX-261101-0077',
    date: '01 Nov 2026, 16:20',
    dateIso: '2026-11-01',
    customer: 'Koperasi Sejahtera',
    phone: '0895••••0091',
    product: 'Tri 50.000',
    amount: 50000,
    status: 'Berhasil',
    operator: 'Nadia',
  },
]

export const initialValidationLogs = [
  {
    id: 'LOG-001',
    transaksi_id: 'TRX-261102-0081',
    validator_id: 'Nadia (Operator)',
    status_sebelum: 'Menunggu',
    status_sesudah: 'Berhasil',
    catatan: 'Transaksi pulsa telah diverifikasi dan disetujui.',
    validated_at: '02 Nov 2026, 09:43',
  },
  {
    id: 'LOG-002',
    transaksi_id: 'TRX-261102-0078',
    validator_id: 'Rizky (Operator)',
    status_sebelum: 'Menunggu',
    status_sesudah: 'Gagal',
    catatan: 'Nomor tujuan berada dalam masa tenggang operator.',
    validated_at: '02 Nov 2026, 08:58',
  },
  {
    id: 'LOG-003',
    transaksi_id: 'TRX-261101-0077',
    validator_id: 'Nadia (Operator)',
    status_sebelum: 'Menunggu',
    status_sesudah: 'Berhasil',
    catatan: 'Verifikasi saldo dan nomor pelanggan valid.',
    validated_at: '01 Nov 2026, 16:22',
  },
]

export const initialProducts = [
  {
    id: 'PLS-001',
    provider: 'Telkomsel',
    nominal: 'Rp50.000',
    price: 48500,
    stock: 'Tersedia',
    updated: '02 Nov 2026',
  },
  {
    id: 'PLS-002',
    provider: 'Telkomsel',
    nominal: 'Rp20.000',
    price: 19500,
    stock: 'Tersedia',
    updated: '02 Nov 2026',
  },
  {
    id: 'PLS-003',
    provider: 'XL',
    nominal: 'Rp25.000',
    price: 24200,
    stock: 'Tersedia',
    updated: '01 Nov 2026',
  },
  {
    id: 'PLS-004',
    provider: 'Indosat',
    nominal: 'Rp100.000',
    price: 97800,
    stock: 'Tersedia',
    updated: '01 Nov 2026',
  },
  {
    id: 'PLS-005',
    provider: 'Tri',
    nominal: 'Rp50.000',
    price: 48700,
    stock: 'Nonaktif',
    updated: '30 Okt 2026',
  },
]

export const initialNumbers = [
  {
    id: 'NTJ-001',
    name: 'PT Sinar Abadi',
    phone: '081234568821',
    provider: 'Telkomsel',
    tag: 'Perusahaan',
  },
  {
    id: 'NTJ-002',
    name: 'CV Maju Jaya',
    phone: '085712341204',
    provider: 'XL',
    tag: 'Perusahaan',
  },
  {
    id: 'NTJ-003',
    name: 'Toko Berkah',
    phone: '082134564432',
    provider: 'Indosat',
    tag: 'Retail',
  },
  {
    id: 'NTJ-004',
    name: 'Koperasi Sejahtera',
    phone: '089512340091',
    provider: 'Tri',
    tag: 'Retail',
  },
]

export const navGroups = [
  {
    label: 'MENU UTAMA',
    items: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'Data Pulsa', label: 'Data Pulsa', icon: Package },
      { id: 'Nomor Tujuan', label: 'Nomor Tujuan', icon: Smartphone },
      { id: 'Transaksi', label: 'Transaksi', icon: CreditCard },
      { id: 'Validasi Transaksi', label: 'Validasi Transaksi', icon: ClipboardCheck },
      { id: 'Riwayat Transaksi', label: 'Riwayat Transaksi', icon: FileClock },
    ],
  },
]

