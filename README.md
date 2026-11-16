# Flipbook Modul Ajar: Menulis Teks Legenda

Flipbook interaktif berbasis web untuk **Modul Ajar Bahasa Indonesia SMP/MTs Kelas IX (Bab IV: Meneladani Pesan Moral dalam Legenda, Subbab E - Menulis Teks Legenda dengan Kosakata Denotatif, Konotatif, dan Kiasan)**.

## 📖 Deskripsi

Aplikasi flipbook digital responsif yang menyajikan materi modul pembelajaran secara interaktif dengan animasi pergantian halaman (flip animation), tata letak ramah perangkat (desktop, tablet, maupun ponsel), kuis evaluasi interaktif, fitur zoom/lightbox ilustrasi, pencarian materi, serta navigasi daftar isi.

- **Materi**: Menulis Teks Legenda (Kosakata Denotatif, Konotatif, dan Kiasan)
- **Jenjang**: SMP/MTs Kelas IX
- **Penyusun Modul**: Khansa Salma Zhafira (NPM: 2553041002, Kelas 3C)
- **Dosen Pengampu**: Dr. Siti Samhati, M.Pd. dan Septia Uswatun Hasanah, M.Pd.

## ✨ Fitur Utama

- **Realistic Book Flip Interaction**: Animasi buka halaman buku dengan dukungan drag/swipe pada layar sentuh serta tombol navigasi keyboard / kontrol UI.
- **Responsive Spread & Single Page**: Mode dua halaman (*spread*) di desktop & tablet lanskap, serta otomatis beralih ke mode satu halaman di layar sempit / mobile.
- **Daftar Isi & Navigasi Cepat**: Drawer navigasi daftar isi untuk melompat langsung ke halaman yang diinginkan.
- **Kuis & Latihan Interaktif**: Evaluasi pemahaman langsung di dalam modul dengan penilaian otomatis dan penjelasan jawaban.
- **Aset & Ilustrasi Ringan**: Gambar berformat modern (WebP & PNG) dengan modal lightbox untuk memperbesar gambar.
- **Pencarian Cepat**: Cari kata kunci dalam modul langsung dari bilah pencarian.
- **Aksesibilitas & Keyboard Navigation**: Navigasi via tombol panah (kiri/kanan), Esc untuk menutup modal, dan dukungan pembaca layar.

## 📁 Struktur Berkas

```
flipbook/
├── css/
│   ├── base.css        # Reset dan style dasar
│   ├── book.css        # Tata letak buku dan styling 3D flip
│   ├── pages.css       # Styling isi halaman dan tipografi
│   ├── tokens.css      # Variabel tema, warna, dan font
│   └── ui.css          # Kontrol UI, drawer, modal, kuis, dan loader
├── img/                # Ilustrasi dan aset gambar (PNG & WebP)
├── js/
│   ├── app.js          # Inisialisasi aplikasi, audio kontrol, dan interaksi UI
│   ├── content.js      # Konten modul & daftar halaman flipbook
│   ├── flip.js         # Logika transisi dan animasi flip halaman
│   └── icons.js        # Helper ikon SVG
├── index.html          # Halaman utama aplikasi
└── README.md           # Dokumentasi proyek
```

## 🚀 Cara Menjalankan

Karena proyek ini berbasis static HTML/CSS/JS murni, proyek dapat dijalankan langsung melalui web server lokal apa pun:

### Menggunakan Python:
```bash
python -m http.server 8000
```
Buka browser di `http://localhost:8000`

### Menggunakan VS Code Live Server:
Klik kanan pada `index.html` dan pilih **Open with Live Server**.

## 📄 Lisensi

Materi modul ditujukan untuk keperluan pembelajaran Bahasa Indonesia SMP/MTs.

## Musik latar

Klik tombol audio di toolbar, lalu **Putar musik** untuk mendengarkan instrumental lembut yang berulang. Panel yang sama menyediakan volume musik dan pengaturan efek suara halaman secara terpisah. Volume tersimpan di perangkat; musik dijeda saat tab ditinggalkan.

Musik lokal ada di `audio/ruang-baca.mp3` (sekitar 385 KB), tanpa layanan streaming tambahan. Cara mengganti atau membuat ulang musik dijelaskan di [audio/README.md](audio/README.md).
