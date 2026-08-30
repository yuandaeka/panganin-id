# To-Do List & Implementation Roadmap for AI Agent

Berikut adalah daftar tugas terstruktur untuk mengembangkan folder HTML PANGANIFY yang sudah ada. Instruksikan AI Agent untuk menyelesaikan poin-poin ini secara bertahap:

## [Phase 1: Refactoring & Layout Adjustment]
- [x] **Fix 1.1**: Periksa struktur file HTML utama, pastikan bagian *Edukasi Global & Berita Gizi* sudah berada di urutan paling bawah halaman Beranda (di bawah modul Jadwal Menu MBG).
- [x] **Fix 1.2**: Pastikan seluruh class Tailwind CSS menggunakan rasio *rounded corners* yang konsisten (utilitas `rounded-2xl` atau `rounded-3xl` untuk mencocokkan style Foomly).
- [x] **Fix 1.3**: Validasi kegunaan tombol kapsul agar memenuhi standar *Thumb Zone* (minimal tinggi tombol `h-12` atau `h-14` pada resolusi mobile).

## [Phase 2: AI Portion Planner Enhancement]
- [x] **Task 2.1**: Tambahkan elemen `<input type="text">` tersembunyi (`hidden`) di bawah select menu hidangan utama untuk input manual.
- [x] **Task 2.2**: Tulis logika JavaScript sederhana: Jika nilai select option == 'manual', hilangkan class `hidden` pada input text tersebut. (Implementasi React: Standard conditional state rendering).
- [x] **Task 2.3**: Buat komponen badge Tailwind CSS dengan efek animasi `animate-pulse` bertuliskan "✨ AI Generated" di atas panel rumpun estimasi bahan baku.

## [Phase 3: Interactive Simulations & State Management]
- [x] **Task 3.1**: Sempurnakan fungsi simulator kamera HACCP. Pastikan transisi perpindahan dari deteksi wadah berbahaya (styrofoam/kresek seblak) ke wadah aman berjalan lancar saat disimulasikan (klik tombol ganti objek).
- [x] **Task 3.2**: Sambungkan input jumlah porsi (slider/range input) agar secara langsung mengubah angka estimasi berat bahan baku (Beras, Ayam, Bawang) secara proporsional lewat JavaScript math perkalian dasar.
- [x] **Task 3.3**: Pastikan jendela *Panganify AI Chatbot* dapat melakukan *toggle slide-up* dan *slide-down* dengan mulus tanpa merusak susunan Bottom Navigation Bar.

## [Phase 4: Responsive Verification]
- [x] **Test 4.1**: Hapus frame pembatas HP statis jika masih ada. Gunakan utility responsive Tailwind (`sm:`, `md:`, `lg:`) agar layout melebar secara alami di desktop menjadi tampilan multi-kolom yang rapi.
- [x] **Test 4.2**: Pastikan semua aset ikon berbasis `.svg` tidak pecah saat disimulasikan pada resolusi layar layar lebar.