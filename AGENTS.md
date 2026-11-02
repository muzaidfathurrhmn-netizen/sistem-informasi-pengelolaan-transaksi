# AGENTS.md — Kontrak Kerja AI Agent

Dokumen ini adalah aturan wajib untuk AI Agent yang mengerjakan repository ini.

## 1. Sumber kebenaran (SOT)
Urutan prioritas:
1. `docs/PRD.md` — scope, kebutuhan, aturan bisnis, acceptance criteria.
2. `docs/UI-GUIDELINE.md` — visual, warna, komponen, responsivitas.
3. `docs/IMPLEMENTATION_PLAN.md` — urutan fase dan Definition of Done.
4. `AGENTS.md` — aturan eksekusi dan batasan agent.

Jika instruksi baru bertentangan dengan SOT, hentikan perubahan yang berisiko dan minta klarifikasi. Jangan diam-diam mengubah scope.

## 2. Scope yang diizinkan
- Fokus pada front-end React + Vite + TailwindCSS.
- Gunakan data dummy lokal untuk seluruh interaksi prototype.
- Implementasikan hanya enam fitur PRD: Login/Logout, Data Pulsa, Nomor Tujuan, Transaksi, Validasi/Pengecekan, dan Riwayat.
- Boleh membuat komponen reusable, state lokal, dan data mock untuk memenuhi enam fitur.

## 3. Larangan
- Jangan membuat backend, server Node.js, database, API, autentikasi sungguhan, integrasi provider, payment gateway, atau deployment tanpa instruksi eksplisit.
- Jangan menambah modul bisnis di luar enam fitur.
- Jangan mengganti stack teknologi tanpa persetujuan.
- Jangan mengarang aturan bisnis yang belum tertulis.
- Jangan mengklaim data dummy sebagai data transaksi nyata.
- Jangan menambahkan dependency besar bila kebutuhan dapat dipenuhi dengan stack yang sudah ada.

## 4. Aturan teknis
- Gunakan JavaScript/JSX, React, Vite, dan TailwindCSS.
- Pisahkan komponen UI, halaman, dan data dummy secara masuk akal saat refactor.
- Hindari duplikasi komponen; utamakan komponen reusable.
- Gunakan nama variabel dan komponen yang jelas.
- Jaga state tetap sederhana; jangan menambah state manager tanpa kebutuhan.
- Pastikan layout responsif dan input memiliki label.
- Jangan menaruh secret, credential nyata, atau data pribadi ke repository.

## 5. Aturan desain
- Pertahankan identitas navy `#101B33`, yellow `#F5C84C`, dan neutral gray.
- Gunakan pola SaaS modern yang konsisten dengan UI-GUIDELINE.
- Teks antarmuka menggunakan Bahasa Indonesia.
- Status transaksi harus menampilkan label teks selain warna.
- Jangan mengubah struktur navigasi inti tanpa persetujuan.

## 6. Cara bekerja
Sebelum mengubah kode:
1. Baca dokumen SOT yang relevan.
2. Identifikasi fase aktif dan acceptance criteria.
3. Nyatakan file yang akan diubah dan alasan singkat.
4. Kerjakan perubahan sekecil mungkin untuk memenuhi kriteria.

Setelah mengubah kode:
1. Jalankan pemeriksaan/build yang tersedia.
2. Laporkan hasil aktual, bukan asumsi.
3. Catat keterbatasan, bug, dan keputusan yang belum ditetapkan.
4. Jangan menyatakan selesai jika acceptance criteria belum terpenuhi.

## 7. Format laporan agent
Setiap eksekusi harus melaporkan:
- **Fase:** fase IMPLEMENTATION_PLAN yang dikerjakan.
- **SOT acuan:** bagian dokumen yang digunakan.
- **Perubahan:** file dan fungsi yang berubah.
- **Verifikasi:** perintah yang dijalankan dan hasilnya.
- **Batasan:** hal yang belum dikerjakan.
- **Langkah berikutnya:** hanya fase selanjutnya yang diizinkan.

## 8. Kondisi berhenti
Hentikan dan minta persetujuan jika:
- Diminta mengerjakan fitur di luar PRD.
- Ada konflik antara dokumen.
- Diperlukan keputusan bisnis yang belum tersedia.
- Perubahan berpotensi menghapus atau merombak pekerjaan yang sudah ada.
