/* ============================================================
   Content data: module material, faithful to modul-oi.docx
   Faces = single book pages (2 faces form a spread on desktop)
   ============================================================ */
(function () {
  'use strict';

  var A = 'img/';

  window.FB_CONTENT = {
    meta: {
      title: 'Menulis Teks Legenda',
      subtitle: 'Kosakata Denotatif, Konotatif, dan Kiasan',
      subject: 'Bahasa Indonesia SMP/MTs Kelas IX',
      bab: 'Bab IV Meneladani Pesan Moral dalam Legenda',
      subbab: 'Subbab E, Buku Siswa hlm. 173 sampai 176',
      penyusun: 'Khansa Salma Zhafira',
      npm: '2553041002',
      kelas: '3C',
      dosen: 'Dr. Siti Samhati, M.Pd. dan Septia Uswatun Hasanah, M.Pd.'
    },

    /* ---------- 16 faces ---------- */
    faces: [
      /* 1. Cover */
      {
        id: 'cover', cls: 'face-cover', floats: ['a01:el'],
        html:
          '<div class="cover">' +
            '<div class="cover__art rv" data-lightbox="img/a02.png" data-caption="Maskot buku: karakter kawaii dari lembar aset modul" role="button" tabindex="0" aria-label="Perbesar ilustrasi maskot"><span class="cover__blob"></span><img src="' + A + 'a02.png" alt="Ilustrasi karakter maskot buku" width="196" height="200" fetchpriority="high"></div>' +
            '<span class="cover__kicker rv" style="--rvd:80ms">Modul Ajar</span>' +
            '<h1 class="cover__title rv" style="--rvd:160ms">Menulis Teks Legenda</h1>' +
            '<p class="cover__sub rv" style="--rvd:240ms">dengan Kosakata <span class="accent">Denotatif</span>, <span class="accent">Konotatif</span>, dan <span class="accent">Kiasan</span></p>' +
            '<div class="cover__meta rv" style="--rvd:320ms">' +
              '<p><strong>Bahasa Indonesia SMP/MTs Kelas IX</strong></p>' +
              '<p>Bab IV Meneladani Pesan Moral dalam Legenda, Subbab E (Buku Siswa hlm. 173 sampai 176)</p>' +
              '<p>Penyusun: Khansa Salma Zhafira, NPM 2553041002, Kelas 3C</p>' +
              '<p>Dosen pengampu: Dr. Siti Samhati, M.Pd. dan Septia Uswatun Hasanah, M.Pd.</p>' +
            '</div>' +
          '</div>'
      },

      /* 2. Daftar isi */
      {
        id: 'toc', cls: 'face-toc', floats: ['a15:er'],
        html:
          '<span class="kicker">Navigasi Buku</span>' +
          '<h2>Daftar Isi</h2>' +
          '<div class="toc toc--compact" id="tocList"></div>' +
          '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">' +
            '<button class="tbtn tbtn--primary" id="tocQuizBtn">' + icon('quiz') + '<span class="tbtn__label">Uji Pemahaman</span></button>' +
            '<button class="tbtn" id="tocResumeBtn">' + icon('bookmark') + '<span class="tbtn__label">Lanjut Membaca</span></button>' +
          '</div>'
      },

      /* 3. A. Informasi Umum */
      {
        id: 'info', floats: ['a13:br'],
        html:
          '<span class="kicker">Bagian A</span>' +
          '<h2>Informasi Umum</h2>' +
          '<table class="dtable">' +
            '<tbody>' +
              '<tr><td>Mata Pelajaran</td><td>Bahasa Indonesia</td></tr>' +
              '<tr><td>Jenjang / Kelas / Fase</td><td>SMP / IX / D</td></tr>' +
              '<tr><td>Elemen</td><td>Menulis, didukung elemen Membaca dan Memirsa serta Menyimak</td></tr>' +
              '<tr><td>Alokasi Waktu</td><td>Pembelajaran berbasis proyek (proyek: menulis ulang legenda daerah) dengan inkuiri melalui wawancara</td></tr>' +
              '<tr><td>Sarana dan Prasarana</td><td>Buku Siswa Bahasa Indonesia Kelas IX (Edisi Revisi, 2025), KBBI Daring edisi VI, EYD Edisi Kelima, LKPD (Lampiran 2), papan tulis/proyektor, alat perekam (opsional)</td></tr>' +
              '<tr><td>Target Peserta Didik</td><td>Peserta didik reguler</td></tr>' +
            '</tbody>' +
          '</table>' +
          '<p class="small" style="margin-top:12px">Proyek utamamu: menulis ulang legenda daerahmu sendiri, lengkap dengan pesan kepedulian.</p>'
      },

      /* 4. B. CP dan Tujuan */
      {
        id: 'cp', floats: ['a03:bl'],
        html:
          '<span class="kicker">Bagian B</span>' +
          '<h2>Capaian dan Tujuan</h2>' +
          '<div class="card card--mint" style="margin-bottom:12px">' +
            '<h3>' + icon('target') + 'Capaian Pembelajaran, Fase D, Elemen Menulis</h3>' +
            '<p>Pada akhir Fase D, peserta didik mampu menulis berbagai jenis teks fiksi dan nonfiksi untuk menyampaikan gagasan, pandangan, pesan, dan pengalaman. Peserta didik memperhatikan struktur teks, kaidah kebahasaan, pilihan kata, dan ejaan, serta mampu menyunting tulisan sendiri maupun tulisan temannya.</p>' +
          '</div>' +
          '<div class="card card--peach" style="margin-bottom:12px">' +
            '<h3>' + icon('spark') + 'Keterkaitan dengan subbab ini</h3>' +
            '<p>Peserta didik menulis teks legenda (teks naratif fiksi) yang memuat ungkapan kepedulian, dengan pilihan kata berupa kosakata denotatif, konotatif, dan kiasan, lalu menyuntingnya.</p>' +
          '</div>' +
          '<div class="card card--rose">' +
            '<h3>' + icon('flag') + 'Tujuan Pembelajaran</h3>' +
            '<p>Peserta didik menulis ungkapan kepedulian dalam teks legenda menggunakan kosakata denotatif, konotatif, dan kiasan secara tepat.</p>' +
          '</div>'
      },

      /* 5. Indikator + Pemahaman Bermakna */
      {
        id: 'indikator', floats: ['a06:el'],
        html:
          '<span class="kicker">Bagian B dan C</span>' +
          '<h2>Indikator Pembelajaran</h2>' +
          '<ol class="blist blist--num">' +
            '<li>Mewawancarai narasumber dan mencatat informasi legenda daerah dengan pertanyaan yang tepat (Kegiatan 10).</li>' +
            '<li>Membedakan makna denotatif, konotatif, dan kiasan pada kalimat-kalimat legenda.</li>' +
            '<li>Menyusun kerangka legenda (awal, isi, penutup) yang memuat pesan moral dan kepedulian (Latihan 9).</li>' +
            '<li>Mengembangkan kerangka menjadi legenda utuh dengan diksi yang tepat (Latihan 10).</li>' +
            '<li>Menyunting naskah teman menggunakan KBBI VI dan EYD Edisi Kelima (Latihan 11).</li>' +
          '</ol>' +
          '<div class="card card--lav" style="margin-top:14px">' +
            '<h3>' + icon('heart') + 'Pemahaman Bermakna</h3>' +
            '<p>Legenda adalah warisan budaya yang menyimpan nilai kepedulian; menulis ulang legenda membantu menjaganya tetap hidup.</p>' +
            '<p style="margin-top:6px">Pilihan kata menentukan rasa dan kekuatan cerita: kata lugas (denotatif) menjelaskan peristiwa, kata bernilai rasa (konotatif) dan kiasan membangun suasana serta pesan.</p>' +
          '</div>'
      },

      /* 6. Pertanyaan Pemantik */
      {
        id: 'pemantik', floats: ['a17:br'],
        html:
          '<span class="kicker">Bagian C.2</span>' +
          '<h2>Pertanyaan Pemantik</h2>' +
          '<p class="lead">Baca pelan-pelan, simpan di kepala, dan bawa jawabannya saat berdiskusi di kelas.</p>' +
          '<div class="pemantik-list" style="display:grid;gap:12px;margin-top:12px">' +
            '<div class="card card--peach pemantik-card" tabindex="0" role="button" aria-pressed="false">' +
              '<span class="chip chip--peach">Pemantik 1</span>' +
              '<p style="margin:8px 0 0;font-weight:600">Apa legenda yang ada di daerahmu, dan mengapa cerita itu masih diceritakan?</p>' +
            '</div>' +
            '<div class="card card--mint pemantik-card" tabindex="0" role="button" aria-pressed="false">' +
              '<span class="chip chip--mint">Pemantik 2</span>' +
              '<p style="margin:8px 0 0;font-weight:600">Kapan sebuah cerita sebaiknya memakai kata yang lugas, dan kapan memakai kata berkias?</p>' +
            '</div>' +
            '<div class="card card--lav pemantik-card" tabindex="0" role="button" aria-pressed="false">' +
              '<span class="chip chip--lav">Pemantik 3</span>' +
              '<p style="margin:8px 0 0;font-weight:600">Nilai kepedulian apa yang ingin kamu wariskan lewat legenda yang kamu tulis?</p>' +
            '</div>' +
          '</div>'
      },

      /* 7. Pertemuan 1 */
      {
        id: 'p1', floats: ['a11:el'],
        html:
          '<span class="kicker">Kegiatan Pembelajaran</span>' +
          '<h2>Pertemuan 1: Mengumpulkan Bahan Legenda</h2>' +
          '<p class="small">Kegiatan 10, hlm. 173. Alokasi 2 JP.</p>' +
          '<div class="steps">' +
            '<div class="step"><span class="step__num">1</span><div class="step__body"><span class="step__tag">Pembuka, 10 menit</span><p>Salam, doa, presensi. Guru menampilkan pertanyaan pemantik 1. Peserta didik mengisi asesmen diagnostik singkat (Bagian D.1). Guru menyampaikan tujuan dan proyek: menulis ulang legenda daerah.</p></div></div>' +
            '<div class="step"><span class="step__num">2</span><div class="step__body"><span class="step__tag">Inti, 60 menit</span><p>Membaca kembali satu legenda dari Bab IV dan menandai bagian yang memuat kepedulian. Guru memodelkan wawancara: tiga pertanyaan dari buku ditambah pertanyaan penggali (siapa tokohnya, apa pesan yang diwariskan). Berpasangan, peserta didik berlatih wawancara dan mengisi LKPD Bagian 1. Tugas: mewawancarai orang yang dituakan atau mencari legenda daerah dari sumber tepercaya sebelum pertemuan 2.</p></div></div>' +
            '<div class="step"><span class="step__num">3</span><div class="step__body"><span class="step__tag">Penutup, 10 menit</span><p>Peserta didik menyebutkan satu hal yang diperoleh. Guru menegaskan etika wawancara (izin, santun, mencatat nama narasumber). Doa dan salam.</p></div></div>' +
          '</div>'
      },

      /* 8. Kartu wawancara */
      {
        id: 'wawancara', floats: ['a04:tr'],
        html:
          '<span class="kicker">Kartu Latihan</span>' +
          '<h2>Berani Bertanya?</h2>' +
          '<p class="lead">Tiga pertanyaan pembuka dari buku, ditambah pertanyaan penggali dari guru.</p>' +
          '<div class="interview" style="margin-top:12px">' +
            '<div class="qa qa--q"><span class="qa__bubble">T</span><p>Apakah tempat ini memiliki legenda?</p></div>' +
            '<div class="qa qa--q"><span class="qa__bubble">T</span><p>Bagaimana ceritanya?</p></div>' +
            '<div class="qa qa--q"><span class="qa__bubble">T</span><p>Adakah legenda lain?</p></div>' +
            '<div class="qa qa--a"><span class="qa__bubble">G</span><p>Pertanyaan penggali: siapa tokohnya, apa pesan yang diwariskan?</p></div>' +
          '</div>' +
          '<div class="card card--rose" style="margin-top:14px">' +
            '<h3>' + icon('heart') + 'Etika wawancara</h3>' +
            '<div class="check" id="etikaCheck">' +
              '<label class="check__item"><input type="checkbox"><span class="check__box">' + icon('check') + '</span><span class="check__text">Meminta izin sebelum mewawancarai</span></label>' +
              '<label class="check__item"><input type="checkbox"><span class="check__box">' + icon('check') + '</span><span class="check__text">Bertanya dan bersikap dengan santun</span></label>' +
              '<label class="check__item"><input type="checkbox"><span class="check__box">' + icon('check') + '</span><span class="check__text">Mencatat nama narasumber</span></label>' +
            '</div>' +
          '</div>'
      },

      /* 9. Pertemuan 2 */
      {
        id: 'p2', floats: ['a07:tr'],
        html:
          '<span class="kicker">Kegiatan Pembelajaran</span>' +
          '<h2>Pertemuan 2: Kosakata dan Kerangka</h2>' +
          '<p class="small">Latihan 9, hlm. 174. Alokasi 2 JP.</p>' +
          '<div class="steps">' +
            '<div class="step"><span class="step__num">1</span><div class="step__body"><span class="step__tag">Pembuka, 10 menit</span><p>Peserta didik melaporkan hasil wawancara dalam satu kalimat. Guru mengajukan pertanyaan pemantik 2 dengan dua kalimat contoh yang berbeda rasa, misalnya "Raja itu mati" dan "Raja itu wafat".</p></div></div>' +
            '<div class="step"><span class="step__num">2</span><div class="step__body"><span class="step__tag">Inti, 60 menit</span><p>Guru menjelaskan makna denotatif, konotatif, dan kiasan memakai Lampiran 1 dan contoh dari legenda. Peserta didik mengerjakan LKPD Bagian 2 (mengidentifikasi jenis makna pada enam kalimat), lalu dibahas bersama. Guru menjelaskan struktur awal, isi, penutup beserta tempat pesan kepedulian. Peserta didik menyusun kerangka legenda daerahnya (Latihan 9, LKPD Bagian 3) dan menandai tiga tempat yang akan memakai kata konotatif atau kiasan.</p></div></div>' +
            '<div class="step"><span class="step__num">3</span><div class="step__body"><span class="step__tag">Penutup, 10 menit</span><p>Beberapa peserta didik membacakan inti ceritanya. Guru memberi umpan balik singkat pada kerangka. Peserta didik menyiapkan draf cerita.</p></div></div>' +
          '</div>'
      },

      /* 10. Pertemuan 3 */
      {
        id: 'p3', floats: ['a19:bl'],
        html:
          '<span class="kicker">Kegiatan Pembelajaran</span>' +
          '<h2>Pertemuan 3: Menulis dan Menyunting</h2>' +
          '<p class="small">Latihan 10 dan 11, hlm. 175. Alokasi 2 JP.</p>' +
          '<div class="steps">' +
            '<div class="step"><span class="step__num">1</span><div class="step__body"><span class="step__tag">Pembuka, 10 menit</span><p>Guru mengulas pembeda denotatif, konotatif, kiasan dan mengajukan pertanyaan pemantik 3. Peserta didik menyiapkan kerangka.</p></div></div>' +
            '<div class="step"><span class="step__num">2</span><div class="step__body"><span class="step__tag">Inti, 60 menit</span><p>Mengembangkan kerangka menjadi legenda utuh dan berjudul menarik (Latihan 10). Bila belum selesai, penulisan dilanjutkan sebagai tugas. Bertukar naskah dengan teman sebangku dan menyunting memakai LKPD Bagian 4, dengan KBBI VI untuk pilihan kata dan EYD Edisi Kelima untuk ejaan (Latihan 11). Memperbaiki naskah berdasarkan masukan.</p></div></div>' +
            '<div class="step"><span class="step__num">3</span><div class="step__body"><span class="step__tag">Penutup, 10 menit</span><p>Refleksi (Bagian F). Pengumpulan naskah akhir sebagai asesmen sumatif. Guru menutup dengan menegaskan nilai kepedulian dalam legenda.</p></div></div>' +
          '</div>'
      },

      /* 11. Lampiran 1.1 Legenda & struktur */
      {
        id: 'struktur', floats: ['a08:tl'],
        html:
          '<span class="kicker">Lampiran 1, Bahan Ajar</span>' +
          '<h2>Legenda dan Strukturnya</h2>' +
          '<div class="card card--tint" style="margin-bottom:12px">' +
            '<p>Legenda adalah cerita rakyat yang dianggap pernah terjadi oleh masyarakat pemiliknya, berkaitan dengan asal-usul tempat, tokoh, atau peristiwa, dan diwariskan secara turun-temurun. Legenda bersifat anonim dan sering memiliki versi yang berbeda.</p>' +
          '</div>' +
          '<p class="small">Struktur yang digunakan dalam Latihan 9:</p>' +
          '<div class="schart" id="schartHot">' +
            '<div class="schart__row"><span class="schart__label schart__label--a">Awal</span><div class="schart__box" style="position:relative">Pengenalan tempat atau tokoh dan latar (waktu, tempat) serta awal persoalan.<button class="hotspot" style="top:50%;right:10px" aria-label="Penjelasan bagian awal" aria-expanded="false">i</button><span class="hotspot__pop hotspot__pop--left">Bagian ini memperkenalkan latar dan awal persoalan yang kemudian memicu peristiwa.</span></div></div>' +
            '<div class="schart__arrow">' + icon('chevD') + '</div>' +
            '<div class="schart__row"><span class="schart__label schart__label--b">Isi</span><div class="schart__box" style="position:relative">Rangkaian peristiwa dan konflik; tokoh menunjukkan sikap, termasuk sikap peduli atau tidak peduli.<button class="hotspot" style="top:50%;right:10px" aria-label="Penjelasan bagian isi" aria-expanded="false">i</button><span class="hotspot__pop hotspot__pop--left">Tempat menggambarkan sikap tokoh: di sinilah ungkapan kepedulian paling banyak muncul.</span></div></div>' +
            '<div class="schart__arrow">' + icon('chevD') + '</div>' +
            '<div class="schart__row"><span class="schart__label schart__label--c">Penutup</span><div class="schart__box" style="position:relative">Penyelesaian, asal-usul yang diceritakan, dan pesan moral.<button class="hotspot" style="top:50%;right:10px" aria-label="Penjelasan bagian penutup" aria-expanded="false">i</button><span class="hotspot__pop hotspot__pop--left">Pesan moral dan nilai kepedulian ditutupkan kepada pembaca pada bagian ini.</span></div></div>' +
          '</div>'
      },

      /* 12. Lampiran 1.2 Makna: denotatif dan konotatif */
      {
        id: 'makna', floats: ['a09:bl'],
        html:
          '<span class="kicker">Lampiran 1, Bahan Ajar</span>' +
          '<h2>Tiga Jenis Makna</h2>' +
          '<p class="lead">Dua jenis pertama dulu, lalu kiasan di halaman berikutnya.</p>' +
          '<div class="wtypes">' +
            '<div class="wtype wtype--den"><span class="wtype__name">' + icon('bookOpen') + 'Denotatif</span><p style="margin:0">Makna lugas, sesuai arti kata di kamus, tanpa nilai rasa tambahan.</p><p class="ex">"Pohon beringin itu tumbuh di tengah alun-alun."</p><p class="fn">Fungsi: menjelaskan latar, tokoh, dan peristiwa secara jelas.</p></div>' +
            '<div class="wtype wtype--kon"><span class="wtype__name">' + icon('heart') + 'Konotatif</span><p style="margin:0">Makna tambahan berupa nilai rasa (hormat, haru, kasar, iba) yang melekat pada kata.</p><p class="ex">"Sang pangeran gugur membela desanya." (gugur: terhormat, heroik)</p><p class="ex">"Gubuk reyot itu menjadi tempat berlindung." (gubuk reyot: menimbulkan iba)</p><p class="fn">Fungsi: membangun suasana dan sikap pada tokoh.</p></div>' +
          '</div>'
      },

      /* 13. Lampiran 1.2 Makna: kiasan */
      {
        id: 'kiasan', floats: ['a10:er'],
        html:
          '<span class="kicker">Lampiran 1, Bahan Ajar</span>' +
          '<h2>Kiasan</h2>' +
          '<div class="wtypes">' +
            '<div class="wtype wtype--kia"><span class="wtype__name">' + icon('spark') + 'Kiasan</span><p style="margin:0">Makna bukan sebenarnya; membandingkan atau melambangkan sesuatu dengan hal lain (majas, ungkapan, perumpamaan).</p><p class="ex">"Hatinya sekeras batu." (simile)</p><p class="ex">"Kabar itu bagai petir di siang bolong." (perumpamaan)</p><p class="fn">Fungsi: menguatkan emosi dan memperindah cerita.</p></div>' +
          '</div>' +
          '<div class="card card--lav" style="margin-top:12px">' +
            '<h3>' + icon('bulb') + 'Cara cepat membedakan</h3>' +
            '<p>Denotatif bisa ditemukan di kamus apa adanya. Konotatif masih kata yang sama, tetapi membawa rasa. Kiasan berpindah makna lewat perbandingan atau lambang.</p>' +
          '</div>'
      },

      /* 14. Lampiran 1.3 Majas */
      {
        id: 'majas', floats: ['a05:er'],
        html:
          '<span class="kicker">Lampiran 1, Bahan Ajar</span>' +
          '<h2>Majas yang Sering Muncul</h2>' +
          '<div class="majas">' +
            '<div class="majas__row"><span class="majas__name">Personifikasi</span><span class="majas__def">Benda atau alam diberi sifat manusia. <em>"Sungai itu menangis menyaksikan kepergian sang putri."</em></span></div>' +
            '<div class="majas__row"><span class="majas__name">Metafora</span><span class="majas__def">Perbandingan langsung tanpa kata pembanding. <em>"Sang raja adalah pelita bagi rakyatnya."</em></span></div>' +
            '<div class="majas__row"><span class="majas__name">Simile</span><span class="majas__def">Perbandingan dengan kata seperti, bagai, laksana. <em>"Air matanya mengalir bagai hujan."</em></span></div>' +
            '<div class="majas__row"><span class="majas__name">Hiperbola</span><span class="majas__def">Pernyataan dilebih-lebihkan. <em>"Teriakannya menggetarkan seisi hutan."</em></span></div>' +
            '<div class="majas__row"><span class="majas__name">Idiom</span><span class="majas__def">Gabungan kata dengan makna tetap. <em>"Ia tulang punggung keluarganya."</em></span></div>' +
          '</div>' +
          '<div class="card card--mint" style="margin-top:12px">' +
            '<p style="margin:0">Temukan kelima majas ini saat membaca legenda dari Bab IV, lalu coba pakai satu atau dua di dalam ceritamu sendiri.</p>' +
          '</div>'
      },

      /* 15. Tips Memilih Kata */
      {
        id: 'tips', floats: ['a16:elb'],
        html:
          '<span class="kicker">Lampiran 1, Bahan Ajar</span>' +
          '<h2>Tips Memilih Kata</h2>' +
          '<div class="tips" style="margin-top:12px">' +
            '<div class="tip">' + icon('bookOpen') + '<p>Gunakan <strong>denotatif</strong> untuk menjelaskan peristiwa, latar, dan urutan kejadian agar pembaca tidak bingung.</p></div>' +
            '<div class="tip">' + icon('heart') + '<p>Gunakan <strong>konotatif</strong> untuk menentukan rasa terhadap tokoh atau peristiwa (hormat, iba, marah).</p></div>' +
            '<div class="tip">' + icon('spark') + '<p>Gunakan <strong>kiasan</strong> pada bagian yang ingin ditekankan, misalnya puncak konflik atau pesan kepedulian, dan jangan berlebihan.</p></div>' +
            '<div class="tip">' + icon('zoom') + '<p>Periksa makna kata di <strong>KBBI VI</strong> dan ejaan di <strong>EYD Edisi Kelima</strong>.</p></div>' +
          '</div>' +
          '<div class="card card--peach" style="margin-top:14px">' +
            '<h3>' + icon('bulb') + 'Ingat</h3>' +
            '<p>Kata lugas menjaga cerita tetap jelas, kata bernilai rasa dan kiasan menjaga cerita tetap hidup. Keduanya dipakai bergantian, bukan saling menggantikan.</p>' +
          '</div>'
      },

      /* 15. Contoh perubahan kalimat */
      {
        id: 'contoh', floats: ['a12:bl'],
        html:
          '<span class="kicker">Lampiran 1, Bahan Ajar</span>' +
          '<h2>Mengungkapkan Kepedulian</h2>' +
          '<p class="lead">Contoh perubahan kalimat dari lugas menjadi bernilai rasa dan berkias.</p>' +
          '<div class="morph" style="margin-top:12px">' +
            '<div class="morph__item">' +
              '<span class="morph__tag">Sebelum (denotatif)</span>' +
              '<div class="morph__before">Raja memberi bantuan kepada warga yang kekeringan.</div>' +
              '<span class="morph__arrow">' + icon('chevD') + '</span>' +
              '<span class="morph__tag" style="color:#7E5527">Sesudah (konotatif dan kiasan)</span>' +
              '<div class="morph__after">Raja mengulurkan tangan kepada warganya yang dilanda kekeringan, seperti ayah menggendong anak yang kelelahan.</div>' +
            '</div>' +
            '<div class="morph__item">' +
              '<span class="morph__tag">Sebelum (denotatif)</span>' +
              '<div class="morph__before">Ibu itu sedih karena anaknya pergi.</div>' +
              '<span class="morph__arrow">' + icon('chevD') + '</span>' +
              '<span class="morph__tag" style="color:#7E5527">Sesudah (konotatif dan kiasan)</span>' +
              '<div class="morph__after">Hati sang ibu remuk redam ketika anaknya melangkah pergi.</div>' +
            '</div>' +
          '</div>'
      },

      /* 16. Rangkuman + Daftar Pustaka */
      {
        id: 'penutup', floats: ['a14:tr', 'a20:erb'],
        html:
          '<span class="kicker">Penutup</span>' +
          '<h2>Rangkuman Perjalananmu</h2>' +
          '<ol class="blist blist--num">' +
            '<li>Mengumpulkan bahan legenda lewat wawancara dengan etika yang santun.</li>' +
            '<li>Membedakan makna denotatif, konotatif, dan kiasan pada kalimat legenda.</li>' +
            '<li>Menyusun kerangka awal, isi, penutup yang memuat pesan moral dan kepedulian.</li>' +
            '<li>Mengembangkan kerangka menjadi legenda utuh dengan diksi yang tepat.</li>' +
            '<li>Menyunting naskah sendiri dan naskah teman dengan KBBI VI dan EYD Edisi Kelima.</li>' +
          '</ol>' +
          '<div class="card card--lav" style="margin-top:8px">' +
            '<h3>' + icon('quiz') + 'Uji pemahamanmu</h3>' +
            '<p>Ada sepuluh pertanyaan singkat yang seluruhnya diambil dari modul ini.</p>' +
            '<button class="tbtn tbtn--primary" id="quizCtaBtn" style="margin-top:2px">' + icon('quiz') + '<span class="tbtn__label">Mulai Kuis</span></button>' +
          '</div>' +
          '<details class="card card--tint" style="margin-top:10px">' +
            '<summary style="cursor:pointer;font-weight:700;color:var(--rose-ink);font-family:var(--font-display)">Daftar Pustaka</summary>' +
            '<div class="small" style="margin-top:8px;line-height:1.6">' +
              '<p>Badan Pengembangan dan Pembinaan Bahasa. (2022). Ejaan Bahasa Indonesia yang Disempurnakan (EYD) Edisi Kelima. Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. ejaan.kemdikbud.go.id</p>' +
              '<p>Badan Standar, Kurikulum, dan Asesmen Pendidikan. (2025). Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran. Kementerian Pendidikan Dasar dan Menengah.</p>' +
              '<p>Fauziah, S., Suprihatin, D., dan Triyadi, S. (2024). Analisis makna denotasi dan konotasi pada buku cerpen Pasukan Jumat Berbagi sebagai bahan ajar handout di SMP. Jurnal Ilmiah Profesi Pendidikan, 9(3), 2392 sampai 2406.</p>' +
              '<p>Islamawati, Y., dan Maman. (2025). Bahasa Indonesia untuk SMP/MTs Kelas IX (Edisi Revisi). Pusat Perbukuan, Kementerian Pendidikan Dasar dan Menengah. buku.kemendikdasmen.go.id</p>' +
            '</div>' +
          '</details>' +
          '<p class="small" style="margin-top:10px">Catatan: bagian D. Asesmen pada dokumen modul tidak memuat rincian tambahan.</p>'
      }
    ],

    /* ---------- TOC ---------- */
    toc: [
      { face: 3,  name: 'Informasi Umum', desc: 'Peta modul: jenjang, elemen, sarana' },
      { face: 4,  name: 'Capaian dan Tujuan', desc: 'CP Fase D dan tujuan pembelajaran' },
      { face: 5,  name: 'Indikator', desc: 'Lima subtujuan dan pemahaman bermakna' },
      { face: 6,  name: 'Pertanyaan Pemantik', desc: 'Tiga pertanyaan pembuka' },
      { face: 7,  name: 'Pertemuan 1', desc: 'Mengumpulkan bahan legenda' },
      { face: 8,  name: 'Kartu Wawancara', desc: 'Pertanyaan dan etika wawancara' },
      { face: 9,  name: 'Pertemuan 2', desc: 'Kosakata dan kerangka legenda' },
      { face: 10, name: 'Pertemuan 3', desc: 'Menulis dan menyunting' },
      { face: 11, name: 'Legenda dan Struktur', desc: 'Pengertian dan struktur awal, isi, penutup' },
      { face: 12, name: 'Tiga Jenis Makna', desc: 'Denotatif dan konotatif' },
      { face: 13, name: 'Kiasan', desc: 'Makna perbandingan dan lambang' },
      { face: 14, name: 'Majas dalam Legenda', desc: 'Lima majas beserta contohnya' },
      { face: 15, name: 'Tips Memilih Kata', desc: 'Empat kiat memilih kata' },
      { face: 16, name: 'Contoh Perubahan', desc: 'Dari lugas ke bernilai rasa' },
      { face: 17, name: 'Rangkuman', desc: 'Rekap dan daftar pustaka' }
    ],

    /* ---------- Quiz (all sourced from the module) ---------- */
    quiz: [
      {
        q: 'Cerita rakyat yang dianggap pernah terjadi oleh masyarakat pemiliknya, berkaitan dengan asal-usul tempat, tokoh, atau peristiwa, dan diwariskan turun-temurun disebut...',
        opts: ['Legenda', 'Fabel', 'Cerpen', 'Pantun'], a: 0,
        fb: 'Legenda bersifat anonim dan sering memiliki versi yang berbeda.'
      },
      {
        q: 'Bagian struktur legenda yang memuat penyelesaian, asal-usul yang diceritakan, dan pesan moral adalah...',
        opts: ['Awal', 'Isi', 'Penutup', 'Resolusi'], a: 2,
        fb: 'Struktur Latihan 9: awal, isi, penutup. Pesan moral ada di penutup.'
      },
      {
        q: '"Sang pangeran gugur membela desanya." Kata gugur termasuk makna...',
        opts: ['Denotatif', 'Konotatif', 'Kiasan', 'Istilah teknis'], a: 1,
        fb: 'Gugur membawa nilai rasa terhormat dan heroik, itu ciri makna konotatif.'
      },
      {
        q: '"Hatinya sekeras batu." Kalimat ini memakai majas...',
        opts: ['Personifikasi', 'Hiperbola', 'Simile', 'Idiom'], a: 2,
        fb: 'Simile membandingkan dengan kata seperti, bagai, atau laksana.'
      },
      {
        q: '"Sungai itu menangis menyaksikan kepergian sang putri." Majas ini adalah...',
        opts: ['Personifikasi', 'Metafora', 'Simile', 'Hiperbola'], a: 0,
        fb: 'Sungai diberi sifat manusia (menangis), itu personifikasi.'
      },
      {
        q: '"Sang raja adalah pelita bagi rakyatnya." Majas ini adalah...',
        opts: ['Simile', 'Metafora', 'Idiom', 'Personifikasi'], a: 1,
        fb: 'Perbandingan langsung tanpa kata pembanding disebut metafora.'
      },
      {
        q: '"Teriakannya menggetarkan seisi hutan." Majas ini adalah...',
        opts: ['Hiperbola', 'Personifikasi', 'Metafora', 'Simile'], a: 0,
        fb: 'Pernyataan yang dilebih-lebihkan disebut hiperbola.'
      },
      {
        q: '"Ia tulang punggung keluarganya." Ungkapan ini adalah...',
        opts: ['Simile', 'Hiperbola', 'Idiom', 'Personifikasi'], a: 2,
        fb: 'Idiom adalah gabungan kata dengan makna tetap.'
      },
      {
        q: 'Sebelum menulis, kerangka legenda disusun menjadi tiga bagian, yaitu...',
        opts: ['Judul, gambar, pesan', 'Awal, isi, penutup', 'Pembuka, inti, latihan', 'Tema, alur, sudut pandang'], a: 1,
        fb: 'Struktur Latihan 9: awal, isi, penutup.'
      },
      {
        q: 'Saat menyunting naskah teman, rujukan pilihan kata dan ejaan yang dipakai adalah...',
        opts: ['KBBI VI dan EYD Edisi Kelima', 'KBBI VI dan EYD Edisi Keempat', 'Kamus Inggris dan EYD Edisi Kelima', 'Buku guru dan LKPD'], a: 0,
        fb: 'Latihan 11: KBBI VI untuk pilihan kata, EYD Edisi Kelima untuk ejaan.'
      }
    ]
  };
})();
