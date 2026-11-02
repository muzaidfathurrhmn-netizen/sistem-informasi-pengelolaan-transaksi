# UI-GUIDELINE — Arus Digital Distributor

> Versi 1.0 · Baseline visual front-end

## 1. Arah visual
Modern futuristic SaaS: rapi, profesional, ringan, dan berorientasi operasional. Identitas visual menggunakan biru tua sebagai fondasi, kuning sebagai aksen aksi, serta abu-abu netral sebagai permukaan.

## 2. Palet warna
| Token | Hex | Penggunaan |
|---|---|---|
| Ink / Navy | `#101B33` | Sidebar, header hero, tombol utama, teks utama |
| Gold / Yellow | `#F5C84C` | CTA, highlight, ikon aktif |
| Mist | `#F3F5F8` | Latar halaman |
| White | `#FFFFFF` | Kartu dan panel |
| Slate 500 | `#64748B` | Teks sekunder |
| Border | `#E2E8F0` | Garis pemisah dan input |
| Success | `#16A36A` | Status berhasil |
| Warning | `#D99A16` | Status menunggu |
| Danger | `#E45B65` | Status gagal |

## 3. Tipografi
- Font stack: Inter, ui-sans-serif, system-ui.
- Judul halaman: 18–24 px, bold/extrabold.
- Judul panel: 14–16 px, bold.
- Isi tabel/form: 12–13 px.
- Label metadata: 10–11 px.
- Gunakan angka tabular bila menampilkan nominal atau ID.

## 4. Layout dan komponen
- Sidebar desktop lebar ±258 px, navy, menu aktif memakai bidang putih transparan dan ikon kuning.
- Header putih sticky, berisi breadcrumb, judul halaman, notifikasi, dan profil.
- Area konten menggunakan latar Mist, kartu putih, radius 16–20 px, border tipis, dan shadow halus.
- Tombol utama navy; tombol aksi penting dapat memakai kuning.
- Tabel memiliki header uppercase kecil, garis pemisah halus, dan horizontal scroll pada layar sempit.
- Form memakai label di atas input, radius 12 px, dan focus ring yang jelas.

## 5. Status dan feedback
- Berhasil: hijau; Menunggu: kuning; Gagal: merah.
- Selalu sertakan teks status, jangan mengandalkan warna saja.
- Aksi validasi perlu konfirmasi sebelum terhubung ke data nyata.
- Tampilkan empty state, loading state, dan error state saat integrasi backend.

## 6. Responsivitas
- Desktop: sidebar permanen.
- Mobile: sidebar menjadi drawer; tabel dapat digulir horizontal.
- Kartu statistik berubah dari empat kolom menjadi dua lalu satu kolom.
- Form transaksi menjadi satu kolom pada layar kecil.

## 7. Aksesibilitas dan konsistensi
- Kontras teks dan latar harus memadai.
- Semua input memiliki label.
- Tombol memiliki teks aksi yang jelas.
- Gunakan spacing konsisten berbasis kelipatan 4/8 px.
- Hindari animasi berlebihan; transisi singkat hanya untuk hover/focus.
