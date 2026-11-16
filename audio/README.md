# Ruang Baca

Musik instrumental orisinal untuk flipbook ini, dibuat secara sintetis tanpa sampel atau rekaman pihak ketiga. Durasi satu putaran 24 detik, tanpa vokal, dan diputar berulang.

Berkas lokal: `ruang-baca.mp3`. Untuk mengganti musik, ganti berkas tersebut atau ubah atribut `src` pada `#backgroundMusic` di `index.html`.

Sumber komposisi: `tools/generate_backsound.py`. Regenerasi memerlukan Python dengan NumPy dan FFmpeg pada PATH; jalankan `python tools/generate_backsound.py` dari folder proyek. Pengunjung tidak memerlukan dependensi ini.

Musik dimulai lewat tombol **Putar musik** di pengaturan audio. Volume disimpan di perangkat. Musik dijeda saat tab disembunyikan dan dilanjutkan saat kembali jika sebelumnya diputar.
