# Design System & Architecture Specification: PANGANIN Mobile-First App

## 1. Overview & UI/UX Philosophy
PANGANIN (Pangan Aman dan Terintegrasi) dirancang dengan pendekatan **Mobile-First & Responsif**, mengadopsi estetika premium, bersih, dan berorientasi pada kartu (card-based layout) mirip dengan style *Foomly*. 
Aplikasi ini memprioritaskan jangkauan area jempol (Thumb Zone) untuk operasional dapur massal, pedagang, dan keluarga di lapangan.

## 2. Palet Warna & Tipografi
- **Primary Color:** Deep Emerald Green (`#047857`) -> Digunakan untuk tombol aksi utama (CTA) berbentuk kapsul/elips, header aktif, dan identitas brand.
- **Secondary Color:** Warm Amber/Orange (`#F59E0B`) -> Digunakan untuk indikator gizi, peringatan bahaya ringan, atau badge.
- **Background:** Pure White (`#FFFFFF`) untuk kartu konten, dan Soft Gray/Sage Tint (`#F3F4F6` / `#F0FDF4`) untuk latar belakang halaman.
- **Typography:** Menggunakan font Sans-Serif modern (Inter/Roboto) dengan kontras yang kuat antara judul tebal (bold black) dan deskripsi abu-abu.

## 3. Komponen Utama & Aturan Layout (Sesuai Basis HTML)

### A. Bottom Navigation Bar (Sticky Custom Menu)
- Terdiri dari 4 Tab: `Home`, `AI HACCP Scan`, `Blockchain Ledger`, dan `Profile`.
- Di bagian tengah navigasi terintegrasi **Floating Action Button (FAB) berbentuk bulat warna Emerald** untuk membuka *Panganin AI Chatbot* secara instan via jendela *slide-up*.

### B. AI Portion & Recipe Planner Component
- **Pilihan Hidangan:** Dropdown menu yang wajib memiliki opsi kustom: `"✍️ Tulis Hidangan Sendiri (Input Manual)..."`.
- **Dinamis Input:** Jika opsi kustom dipilih, field text input manual akan muncul secara *toggle*.
- **Estimasi Bahan Baku:** Output wajib menampilkan **Badge "AI Generated"** dengan efek animasi *pulsing light* hijau untuk menegaskan pemrosesan cerdas.

### C. AI HACCP Photo Scanner Simulator
- Tampilan mode kamera *full-screen phone view* dengan *overlay grid lines*.
- Menampilkan visual deteksi kotak pembanting (*bounding box*):
  - 🔴 **Merah (Hazard):** Wadah styrofoam, plastik kresek hitam untuk makanan panas (seblak/warmindo).
  - 🟢 **Hijau (Safe):** Wadah Stainless Steel, kotak makan plastik kode 5 (PP food-grade).
- Mengeluarkan output berupa *Digital HACCP Checklist* kelayakan tempat, bahan, dan wadah.

### D. Blockchain Supply Chain & Waste Tracking
- **Supply Chain:** Visualisasi peta lokal terintegrasi kartu informasi harga pangan valid langsung dari petani lokal (mencegah manipulasi harga/tengkulak).
- **Waste Tracking:** Linimasa pengiriman (*stepper tracker*) dari sisa dapur menuju mitra pengolahan kompos/eco-enzyme.

### E. Edukasi Global & Berita Gizi
- **Posisi:** **Wajib diletakkan di bagian paling bawah halaman Beranda (Home Screen)**, di bawah widget jadwal harian makanan MBG.
- **Visual:** Horizontal scrolling card carousel yang menampilkan tips memasak porsi besar, ketahanan makanan dingin, dan info zat kimia wadah.