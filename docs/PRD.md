# PRD — Sistem Informasi Pengelolaan Transaksi Distributor Layanan Digital

> Versi 1.0 · 2 November 2026 · Status: baseline SOT · Scope: front-end prototype

## 1. Ringkasan produk
Aplikasi web internal untuk membantu admin dan operator distributor layanan digital mengelola katalog pulsa, nomor tujuan, transaksi, pemeriksaan transaksi, dan riwayat transaksi. Tahap awal hanya membangun front-end React + Vite + TailwindCSS dengan data dummy.

## 2. Masalah dan tujuan
**Masalah yang dituju:** pencatatan transaksi dan nomor tujuan berisiko tidak konsisten; operator membutuhkan alur yang ringkas untuk memasukkan transaksi dan memeriksa statusnya.

**Tujuan MVP:**
- Menyatukan enam fungsi inti dalam satu antarmuka.
- Membuat alur input transaksi dan validasi mudah dipahami.
- Menyediakan pencarian dan penyaringan data.
- Menjadi fondasi front-end yang siap diintegrasikan dengan backend pada fase terpisah.

## 3. Pengguna dan hak akses
| Peran | Ruang lingkup |
|---|---|
| Admin | Mengakses seluruh menu; mengelola data pulsa dan nomor tujuan; memantau dan memvalidasi transaksi. |
| Operator | Mengakses transaksi, validasi sesuai kewenangan, dan riwayat. |

Pada prototype, autentikasi hanya simulasi UI. Pembatasan akses berbasis peran belum diterapkan.

## 4. Batasan ruang lingkup
**Termasuk:** login/logout simulasi, dashboard ringkas, tabel data dummy, pencarian/filter dasar, form transaksi, validasi status, riwayat, navigasi responsif.

**Tidak termasuk:** backend Node.js, database, API, integrasi provider pulsa, payment gateway, pengiriman pulsa nyata, keamanan produksi, multi-tenant, dan deployment.

## 5. Fitur dan kriteria penerimaan
### F01 — Login dan Logout
- Menampilkan form email dan kata sandi.
- Login demo membuka dashboard; logout kembali ke halaman login.
- Prototype tidak melakukan verifikasi kredensial ke server.

### F02 — Pengelolaan Data Pulsa
- Menampilkan ID, provider, nominal, harga beli, status, dan tanggal pembaruan.
- Menyediakan pencarian dan tombol tambah sebagai representasi alur UI.
- Data berasal dari array dummy; penyimpanan permanen belum tersedia.

### F03 — Pengelolaan Data Nomor Tujuan
- Menampilkan ID, nama pelanggan, nomor, provider, dan kategori.
- Menyediakan pencarian serta tombol tambah.
- Validasi nomor unik dan deteksi duplikasi menjadi kebutuhan backend/fase lanjutan.

### F04 — Pengelolaan Transaksi
- Form menerima nomor tujuan, produk pulsa, dan catatan.
- Ringkasan menampilkan produk dan estimasi harga.
- Submit menambahkan transaksi dummy berstatus Menunggu dan mengarahkan pengguna ke validasi.

### F05 — Validasi dan Pengecekan Transaksi
- Menampilkan transaksi berstatus Menunggu.
- Operator dapat menyetujui atau menolak transaksi dummy.
- Perubahan status tercermin di daftar dan riwayat selama sesi berjalan.

### F06 — Riwayat Transaksi
- Menampilkan transaksi dengan ID, waktu, pelanggan/nomor, produk, nominal, dan status.
- Mendukung pencarian dan filter status.
- Tombol export pada prototype masih berupa affordance UI.

## 6. Alur utama
1. Pengguna membuka aplikasi dan login demo.
2. Pengguna memeriksa dashboard.
3. Admin memelihara data pulsa dan nomor tujuan.
4. Operator membuat transaksi dengan memilih produk dan memasukkan nomor tujuan.
5. Transaksi masuk ke antrean validasi dengan status Menunggu.
6. Operator memeriksa lalu menyetujui/menolak.
7. Transaksi dapat ditelusuri melalui riwayat.

## 7. Aturan bisnis awal
- Satu transaksi memiliki satu ID unik.
- Status transaksi pada MVP: Menunggu, Berhasil, Gagal.
- Nominal transaksi mengikuti produk yang dipilih.
- Nomor tujuan wajib diisi sebelum transaksi dibuat.
- Data dummy tidak boleh dianggap sebagai transaksi nyata.
- Pencegahan nomor ganda dan idempotensi transaksi wajib dirancang sebelum backend dibangun.

## 8. Kebutuhan nonfungsional
- Responsif untuk desktop dan tablet; navigasi mobile tetap dapat digunakan.
- Antarmuka konsisten, kontras terbaca, dan status tidak hanya dibedakan oleh warna.
- Komponen dan data dipisahkan agar mudah dikembangkan.
- Tidak menyimpan data sensitif pada prototype.
- Build harus lolos `npm run build`.

## 9. Data inti (konseptual)
- **User:** id, nama, email, password_hash, role, status.
- **ProdukPulsa:** id, provider, nominal, harga_beli, status.
- **NomorTujuan:** id, nama_pelanggan, nomor, provider, kategori.
- **Transaksi:** id, produk_id, nomor_tujuan_id, operator_id, nominal, status, catatan, created_at.
- **LogValidasi:** id, transaksi_id, validator_id, status_sebelum, status_sesudah, catatan, validated_at.

## 10. Asumsi dan keputusan terbuka
- Prototype menggunakan satu mata uang: Rupiah.
- Role final dan matriks izin perlu dikonfirmasi pemilik produk.
- Definisi “berhasil” harus ditetapkan saat integrasi provider (respons provider vs konfirmasi manual).
- Kebijakan retry, pembatalan, refund, dan rekonsiliasi belum termasuk MVP.
