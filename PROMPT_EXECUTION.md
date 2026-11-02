# PROMPT EXECUTION — Eksekusi Proyek Awal

Salin prompt ini ke AI coding agent setelah repository diekstrak dan `AGENTS.md` tersedia.

---

Anda bertindak sebagai AI Front-end Engineer pada proyek **Sistem Informasi Pengelolaan Transaksi Berbasis Web pada Distributor Layanan Digital**.

## Wajib dibaca
Baca seluruh dokumen berikut sebelum menulis kode:
- `AGENTS.md`
- `docs/PRD.md`
- `docs/UI-GUIDELINE.md`
- `docs/IMPLEMENTATION_PLAN.md`

Dokumen tersebut adalah Single Source of Truth (SOT). Patuhi urutan prioritas dan batasan pada AGENTS.md.

## Tujuan eksekusi pertama
Selesaikan fondasi front-end sesuai Fase 1 dan Fase 2:
1. Periksa struktur repository dan kondisi package.
2. Pastikan React + Vite + TailwindCSS dapat dijalankan.
3. Rapikan struktur kode menjadi komponen yang mudah dipelihara tanpa mengubah scope.
4. Terapkan design token, layout sidebar/header, typography, button, input, table, dan badge sesuai UI-GUIDELINE.
5. Pertahankan data dummy dan seluruh enam menu inti yang sudah didefinisikan.
6. Pastikan tampilan responsif.

## Batasan keras
- Jangan membuat backend Node.js, database, API, autentikasi sungguhan, atau integrasi provider.
- Jangan menambah fitur di luar enam fitur pada PRD.
- Jangan mengubah brand color dan alur bisnis tanpa persetujuan.
- Jangan mengganti React, Vite, atau TailwindCSS.
- Jangan menghapus fungsi yang sudah bekerja.

## Cara kerja
- Kerjakan bertahap dan hindari rewrite total.
- Jika ada file yang sudah tersedia, audit dan gunakan kembali sebelum membuat pengganti.
- Jika menemukan konflik atau kebutuhan bisnis yang tidak jelas, berhenti dan ajukan satu pertanyaan spesifik.
- Gunakan dummy data yang jelas diberi label.
- Jalankan `npm install` bila diperlukan, lalu `npm run build`.
- Perbaiki error build yang berasal dari perubahan Anda.

## Definition of Done
- Aplikasi dapat dijalankan dengan `npm run dev`.
- Build produksi berhasil dengan `npm run build`.
- Enam menu inti tersedia dan dapat dinavigasi.
- UI mengikuti palet navy, yellow, dan neutral gray.
- Tidak ada backend/API/database yang dibuat.
- Tidak ada klaim bahwa data tersimpan permanen.

## Format laporan akhir
Laporkan:
1. Ringkasan pekerjaan.
2. File yang dibuat/diubah.
3. Perintah verifikasi dan hasil aktual.
4. Screenshot/preview bila tersedia.
5. Keterbatasan yang masih ada.
6. Rekomendasi fase berikutnya berdasarkan IMPLEMENTATION_PLAN.

Mulai dengan audit SOT dan repository, lalu kerjakan fase yang ditugaskan saja.
