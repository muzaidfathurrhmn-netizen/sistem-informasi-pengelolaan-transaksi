# IMPLEMENTATION_PLAN — Arus Digital Distributor

> Versi 1.0 · Urutan pengerjaan per fase

## Prinsip eksekusi
Kerjakan satu fase sampai kriteria penerimaan terpenuhi. Jangan melompat ke backend atau menambah fitur di luar PRD tanpa persetujuan.

| Fase | Fokus | Aktivitas | Output / Definition of Done |
|---|---|---|---|
| 0 | SOT & fondasi | Tetapkan PRD, UI guideline, kontrak agent, prompt eksekusi | Dokumen disetujui dan tidak saling bertentangan |
| 1 | Setup front-end | Vite, React, Tailwind, struktur folder, routing/state sederhana | `npm install` dan `npm run dev` berjalan |
| 2 | Design system | Warna, typography, sidebar, header, button, input, table, badge | Komponen konsisten dan responsif |
| 3 | Master data | Halaman Data Pulsa dan Nomor Tujuan memakai dummy data | Tabel, pencarian, dan form UI tampil |
| 4 | Transaksi | Form transaksi dan ringkasan pesanan | Submit membuat record dummy |
| 5 | Validasi & riwayat | Antrean validasi, perubahan status, pencarian/filter riwayat | Status sinkron selama sesi |
| 6 | Login & dashboard | Login/logout simulasi, statistik, ringkasan | Alur enam fitur dapat didemokan |
| 7 | QA & handoff | Uji responsive, build, cek konsistensi dokumen | Build sukses, known limitations tercatat |

## Checklist pengujian MVP
- [ ] Login demo dapat membuka dashboard.
- [ ] Logout mengembalikan ke halaman login.
- [ ] Navigasi keenam fitur bekerja.
- [ ] Pencarian data pulsa dan nomor tujuan bekerja.
- [ ] Form transaksi menghasilkan transaksi dummy.
- [ ] Validasi mengubah status transaksi.
- [ ] Riwayat menampilkan status terbaru dan filter berfungsi.
- [ ] Layout dapat digunakan pada lebar desktop dan mobile.
- [ ] `npm run build` berhasil.

## Risiko dan mitigasi
- **Data hilang saat refresh:** memang disengaja pada prototype; gunakan API/database pada fase backend.
- **Status dummy tidak mewakili provider:** jangan gunakan untuk operasional.
- **Nomor duplikat:** tambahkan unique constraint dan pemeriksaan server-side saat backend dirancang.
- **Akses peran belum aman:** jangan gunakan login simulasi untuk deployment publik.
