# PRD: Public Booking System + Protected Admin Area

Tanggal: 15 Juni 2026  
Project: Suma Barbershop POS/Dashboard  
Status: Draft PRD  

## 1. Ringkasan

Suma Barbershop akan memiliki sistem booking pelanggan yang berada di website yang sama dengan sistem admin/POS/dashboard, bukan subdomain terpisah. Halaman booking akan bersifat publik dan dapat diakses langsung dari Instagram, link-in-bio, WhatsApp, atau platform lainnya melalui URL seperti `/booking`.

Area admin, POS, dashboard, produk, riwayat transaksi, laporan, profil, dan pengaturan harus dilindungi oleh login admin. Jika pengguna umum mencoba mengakses area admin secara langsung, sistem harus mengarahkan mereka ke halaman login dan tidak menampilkan data admin.

Untuk tahap awal, autentikasi menggunakan akun admin dummy yang berjalan di sisi frontend. Tujuannya bukan keamanan produksi penuh, tetapi untuk memvalidasi alur akses, UX login, protected route, dan pemisahan area publik vs privat sebelum integrasi backend.

## 2. Tujuan

1. Menyediakan halaman booking publik di dalam website utama.
2. Memastikan link dari Instagram/platform lain dapat langsung menuju halaman booking tanpa melewati dashboard/admin.
3. Melindungi semua halaman admin dari akses pengguna yang belum login.
4. Menyediakan akun admin dummy untuk simulasi login.
5. Menampilkan perilaku yang jelas ketika pengguna umum mencoba memaksa masuk ke area admin.
6. Menjaga struktur tetap satu website/satu deployment agar mudah dikembangkan.

## 3. Non-Tujuan

Untuk PRD tahap ini, hal berikut belum menjadi target utama:

1. Autentikasi backend sungguhan.
2. Role-based access control multi-role seperti owner, kasir, barber, supervisor.
3. OTP, email verification, reset password, atau social login.
4. Payment online untuk booking.
5. SEO optimization untuk halaman booking.
6. Integrasi kalender eksternal seperti Google Calendar.
7. Notifikasi WhatsApp/SMS otomatis.
8. Sinkronisasi database real-time produksi.

## 4. Prinsip Produk

1. **Public booking, private admin**  
   Pelanggan boleh mengakses booking tanpa login, sedangkan admin wajib login.

2. **Satu website, beda area**  
   Booking dan admin berada di domain yang sama, tetapi dipisahkan oleh route.

3. **Default cabang Malang**  
   Untuk tahap awal, sistem booking publik menggunakan Suma Barber cabang Malang sebagai cabang default.

4. **Instagram-first traffic**  
   Halaman booking dioptimalkan untuk orang yang datang dari link langsung, bukan dari search engine.

5. **Dummy auth cukup untuk validasi UX**  
   Karena tahap ini masih MVP/prototype, dummy credential boleh digunakan selama alur login/logout/protected route terasa nyata.

6. **Jangan bocorkan UI admin sebelum login**  
   Jika belum login, pengguna tidak boleh melihat layout admin, sidebar, topbar, atau data dummy admin.

## 5. Target Pengguna

### 5.1 Pelanggan

Orang yang menemukan Suma Barbershop dari Instagram, WhatsApp, Google Maps, atau platform lain dan ingin melakukan booking layanan.

Kebutuhan utama:
- Melihat layanan yang tersedia.
- Melihat harga layanan sejak awal.
- Memilih barber atau memilih otomatis.
- Memilih tanggal dan jam.
- Mengisi nama dan nomor WhatsApp.
- Mengirim booking.
- Mendapat konfirmasi bahwa booking tercatat.

### 5.2 Admin/Owner/Kasir

Pengguna internal yang mengakses dashboard/POS untuk operasional barbershop.

Kebutuhan utama:
- Login sebelum masuk area admin.
- Melihat dashboard setelah login berhasil.
- Tidak perlu login ulang selama sesi masih aktif.
- Bisa logout.
- Jika belum login dan membuka URL admin langsung, diarahkan ke login.

## 6. Route dan Akses

### 6.1 Route Publik

Route berikut dapat diakses tanpa login:

| Route | Fungsi | Akses |
|---|---|---|
| `/booking` | Halaman booking pelanggan | Publik |
| `/login` | Login admin | Publik |

Opsional untuk tahap lanjut:

| Route | Fungsi | Akses |
|---|---|---|
| `/booking/success` | Halaman sukses setelah booking | Publik |
| `/booking/:bookingId` | Detail booking pelanggan | Publik terbatas / tokenized |

### 6.2 Route Privat/Admin

Route berikut hanya dapat diakses setelah login admin:

| Route | Fungsi | Akses |
|---|---|---|
| `/` | Dashboard | Admin login |
| `/pos` | POS kasir | Admin login |
| `/products` | Produk & stok | Admin login |
| `/history` | Riwayat transaksi | Admin login |
| `/reports` | Laporan | Admin login |
| `/settings` | Pengaturan | Admin login |
| `/profile` | Profil admin | Admin login |

## 7. Alur Autentikasi Dummy

### 7.1 Dummy Credential

Akun dummy yang disarankan:

```text
Email: admin@suma.test
Password: admin123
Cabang: Suma Barbershop - Cabang Utama
```

Catatan:
- Credential ini hanya untuk development/demo.
- Harus ditandai jelas di PRD/komentar internal bahwa ini bukan autentikasi produksi.

### 7.2 Login Berhasil

Ketika admin mengisi email dan password yang benar:

1. Sistem menyimpan status autentikasi di browser storage atau auth state dummy.
2. Sistem menyimpan profil admin dummy minimal:
   - nama admin,
   - email,
   - cabang aktif,
   - role `admin`.
3. Admin diarahkan ke dashboard `/`.

### 7.3 Login Gagal

Jika email/password salah:

1. Tetap di halaman login.
2. Tampilkan error message yang jelas, misalnya:  
   `Email atau password admin tidak sesuai.`
3. Jangan arahkan ke dashboard.

### 7.4 Sudah Login Membuka `/login`

Jika admin sudah login lalu membuka `/login`:

1. Sistem langsung redirect ke `/`.
2. Halaman login tidak perlu ditampilkan lagi.

### 7.5 Belum Login Membuka Area Admin

Jika pengguna belum login dan membuka route admin seperti `/pos`, `/products`, atau `/history`:

1. Sistem redirect ke `/login`.
2. Sistem dapat menyimpan target awal, misalnya `/pos`.
3. Setelah login berhasil, admin dapat diarahkan kembali ke target awal tersebut.
4. Jika redirect target tidak dibuat di tahap awal, fallback ke `/` masih diterima.

### 7.6 Logout

Ketika admin klik logout:

1. Status login dummy dihapus.
2. Profil admin dummy dihapus.
3. Sistem redirect ke `/login`.
4. Setelah logout, membuka route admin harus kembali diarahkan ke `/login`.

## 8. Alur Booking Publik

### 8.1 Entry Point

Pelanggan datang dari:
- Instagram bio link,
- Instagram story link,
- WhatsApp broadcast,
- QR code di toko,
- platform lainnya.

Link utama:

```text
https://domain-suma.com/booking
```

### 8.2 Booking Flow MVP

Alur booking minimum:

1. Pelanggan membuka `/booking`.
2. Pelanggan melihat hero/brand Suma Barber cabang Malang.
3. Pelanggan melihat menu harga layanan sejak awal.
4. Pelanggan memilih layanan.
5. Pelanggan memilih tanggal.
6. Pelanggan memilih jam tersedia.
7. Pelanggan memilih barber atau opsi “bebas barber”.
8. Pelanggan mengisi data:
   - nama,
   - nomor WhatsApp secara manual,
   - catatan opsional.
9. Pelanggan menekan tombol konfirmasi booking.
10. Sistem menampilkan ringkasan booking.
11. Pelanggan melihat pesan sukses dengan status booking `pending`.

### 8.3 Data Booking MVP

Data booking minimal:

| Field | Keterangan |
|---|---|
| `bookingId` | ID unik booking dummy |
| `customerName` | Nama pelanggan |
| `phone` | Nomor WhatsApp |
| `serviceId` | Layanan yang dipilih |
| `serviceName` | Nama layanan |
| `barberId` | Barber yang dipilih, opsional |
| `barberName` | Nama barber, opsional |
| `date` | Tanggal booking |
| `time` | Jam booking |
| `notes` | Catatan pelanggan |
| `status` | Default `pending`; tahap lanjut dapat menjadi `confirmed`, `cancelled`, atau `completed` |
| `createdAt` | Waktu booking dibuat |

### 8.4 Cabang Default

Untuk MVP, halaman booking publik menggunakan cabang default:

```text
Suma Barber Malang
```

Implikasi:
- Pelanggan tidak perlu memilih cabang terlebih dahulu.
- Semua layanan, harga, slot, dan konteks booking mengacu ke cabang Malang.
- Jika nanti multi-cabang dibutuhkan, pemilihan cabang dapat ditambahkan sebelum pemilihan layanan.

### 8.5 Status Booking Default

Semua booking baru memiliki status awal:

```text
pending
```

Makna status `pending`:
- Booking sudah dikirim oleh pelanggan.
- Booking belum dikonfirmasi manual oleh admin.
- Di tahap MVP, pelanggan cukup melihat pesan bahwa permintaan booking berhasil dikirim dan menunggu konfirmasi.

### 8.6 Input WhatsApp Manual

Nomor WhatsApp pelanggan diinput manual tanpa verifikasi OTP.

Aturan MVP:
- Field nomor WhatsApp wajib diisi.
- Tidak perlu verifikasi kode.
- Validasi cukup memastikan field tidak kosong dan format nomor masuk akal.

### 8.7 Deposit dan Pembayaran

Tahap MVP tidak membutuhkan deposit atau payment online.

Implikasi:
- Pelanggan tidak diarahkan ke pembayaran.
- Booking selesai setelah form dikirim.
- Pembayaran tetap dilakukan di tempat atau melalui proses manual di luar sistem booking.

## 8A. Pricelist Suma Barber Malang

Halaman booking wajib menampilkan menu harga layanan sejak awal agar pelanggan dapat memahami pilihan sebelum menentukan jadwal.

Sumber awal: `public/pricelist-suma-malang.png`.

Hasil ekstraksi OCR:

| Kategori | Layanan | Harga |
|---|---|---:|
| Haircut | Gentleman’s Cut — haircut + hairwash + head massage + face mask | 40 K |
| Hairstyling | Perm + Gentleman’s Cut | 180 K |
| Hairstyling | Korean Perm + Gentleman’s Cut | 310 K |
| Hairstyling | Down Perm | 120 K |
| Hair Coloring | Full Hair Coloring | 250 K |
| Hair Coloring | Full Hair Bleach | 270 K |
| Hair Coloring | Highlight | 290 K |
| Hair Coloring | Polish (Semir) | 90 K |

Catatan:
- Item terakhir sudah dikonfirmasi sebagai `Polish (Semir)`.
- Format harga pada UI dapat ditampilkan sebagai `Rp40.000`, `Rp180.000`, dan seterusnya agar lebih familiar bagi pelanggan Indonesia.

## 9. Booking Availability Logic MVP

Untuk tahap dummy, slot booking dapat dibuat statis.

Contoh aturan:

1. Jam operasional: 10:00–21:00.
2. Interval slot: 30 menit atau 60 menit.
3. Beberapa slot dibuat unavailable untuk simulasi.
4. Jika slot dipilih, tampilkan di ringkasan.
5. Belum perlu mencegah double booking secara backend.

Rekomendasi MVP:
- Gunakan data slot dummy dulu.
- Simulasikan status slot: `available`, `limited`, `booked`.
- Slot `booked` tidak bisa dipilih.

## 10. Admin Booking Management — Tahap Lanjut

Walaupun PRD ini fokus pada public booking + protected admin area, sistem sebaiknya disiapkan agar nanti admin bisa mengelola booking.

Fitur tahap lanjut:

1. Menu admin baru: `/bookings`.
2. Admin melihat daftar booking masuk.
3. Admin bisa mengubah status booking:
   - pending,
   - confirmed,
   - cancelled,
   - completed,
   - no-show.
4. Admin bisa filter booking berdasarkan tanggal/status/barber.
5. Booking yang selesai bisa dikonversi menjadi transaksi POS.

Untuk MVP pertama, halaman admin booking belum wajib dibuat jika scope ingin tetap kecil.

## 11. UX Requirements

### 11.1 Booking Page

Halaman booking harus:

1. Mengutamakan layout mobile-first karena mayoritas traffic booking berasal dari Instagram/link-in-bio.
2. Cepat dipahami dalam 5 detik pertama.
3. Memiliki CTA jelas: `Booking Sekarang` atau `Pilih Jadwal`.
4. Menggunakan visual brand Suma: hijau tua, gold/coklat, premium heritage.
5. Tidak menampilkan sidebar/topbar admin.
6. Tidak membutuhkan login pelanggan.
7. Menampilkan menu dan harga layanan Suma Barber Malang sejak awal.
8. Menjelaskan bahwa booking berstatus pending dan menunggu konfirmasi admin.

### 11.2 Login Page

Halaman login harus:

1. Menjelaskan bahwa akses hanya untuk owner/admin.
2. Menampilkan error jika credential salah.
3. Mengarahkan admin ke dashboard jika berhasil.
4. Jika memungkinkan, menampilkan hint credential dummy selama development/demo.

### 11.3 Protected Route Behavior

Ketika pengguna umum mencoba membuka area admin:

1. Jangan tampilkan layout admin sedetik pun jika belum login.
2. Redirect ke `/login`.
3. Bisa tampilkan teks kecil di login:  
   `Silakan login sebagai admin untuk mengakses halaman tersebut.`

## 12. Technical Product Requirements

Tanpa menentukan implementasi code detail, sistem membutuhkan komponen konsep berikut:

1. **Auth state dummy**  
   Menyimpan status login admin dan data profil dummy.

2. **Protected route wrapper**  
   Membungkus semua route admin dan memeriksa apakah user sudah login.

3. **Public route group**  
   Route `/booking` dan `/login` tetap bisa diakses publik.

4. **Guest redirect handling**  
   User belum login yang membuka route admin diarahkan ke login.

5. **Already-authenticated redirect**  
   Admin yang sudah login tidak perlu melihat login lagi.

6. **Logout action**  
   Menghapus auth dummy dan mengarahkan ke login.

7. **Booking data service dummy**  
   Mengelola layanan, barber, slot, dan booking dummy agar mudah diganti backend nanti.

## 13. Acceptance Criteria

### 13.1 Public Booking

- Pengguna bisa membuka `/booking` tanpa login.
- Halaman `/booking` tidak menampilkan layout admin.
- Halaman `/booking` menampilkan pricelist Suma Barber Malang sejak awal.
- Pengguna bisa menjalani alur pilih layanan, tanggal, jam, isi data, dan melihat konfirmasi sukses dalam versi dummy.
- Booking baru tercatat dengan status awal `pending`.
- Nomor WhatsApp diinput manual tanpa OTP.
- Tidak ada langkah deposit atau payment online.
- Link `/booking` layak dipakai sebagai link Instagram bio/story.

### 13.2 Admin Auth

- Pengguna belum login yang membuka `/`, `/pos`, `/products`, `/history`, `/reports`, `/settings`, atau `/profile` diarahkan ke `/login`.
- Login dengan credential dummy benar berhasil masuk dashboard.
- Login dengan credential salah menampilkan error dan tidak masuk dashboard.
- Admin yang sudah login bisa membuka semua area admin.
- Admin yang sudah login membuka `/login` diarahkan ke `/`.
- Logout menghapus sesi dummy dan mencegah akses admin sampai login lagi.

### 13.3 UX/Security Perception

- Pengguna umum yang memaksa buka URL admin tidak melihat data admin.
- Sistem terasa seperti memiliki area publik dan area privat yang jelas.
- Tidak ada kebutuhan subdomain.

## 14. Risks & Trade-offs

### 14.1 Dummy Auth Bukan Security Produksi

Frontend-only dummy auth bisa dimanipulasi oleh user teknis. Ini diterima untuk tahap MVP/demo, tetapi tidak cukup untuk produksi.

Mitigasi:
- Tandai sebagai dummy auth.
- Jangan pakai data sensitif produksi.
- Rencanakan migrasi ke backend auth sebelum go-live produksi.

### 14.2 Satu Website Menggabungkan Public dan Admin

Satu website lebih mudah dikelola, tetapi membutuhkan route guard yang rapi agar area admin tidak bocor.

Mitigasi:
- Route publik dan privat dipisah secara eksplisit.
- Layout admin hanya dirender setelah auth valid.

### 14.3 SEO Tidak Jadi Fokus

Karena traffic utama berasal dari Instagram/platform langsung, SEO bukan prioritas awal.

Mitigasi:
- Pastikan link sharing tetap bagus.
- Nanti bisa tambah meta tags basic untuk preview sosial.

## 15. Rekomendasi Urutan Implementasi

1. Buat auth dummy dan protected route untuk admin.
2. Update login agar memvalidasi dummy credential.
3. Tambah logout di area admin.
4. Buat route publik `/booking` tanpa admin layout.
5. Buat UI booking MVP dengan data dummy.
6. Tambah booking success state/page.
7. Setelah alur publik stabil, rancang halaman admin `/bookings`.
8. Setelah MVP tervalidasi, ganti dummy service dengan backend/database.

## 16. Open Questions

1. Apakah pelanggan harus memilih barber tertentu, atau cukup “barber tersedia otomatis” untuk MVP?
2. Apakah harga perlu ditampilkan persis format `40 K` atau format Indonesia `Rp40.000`?
3. Apakah admin perlu menerima notifikasi manual dari booking pending pada tahap MVP, atau cukup tercatat di UI dummy?

## 17. Keputusan Awal

Keputusan yang sudah disepakati:

1. Sistem booking berada dalam satu website, bukan subdomain.
2. Halaman booking publik dapat diakses dari Instagram/platform lain.
3. SEO bukan prioritas utama untuk tahap awal.
4. Area admin menggunakan pendekatan protected route.
5. Akan ada akun admin dummy untuk simulasi login.
6. Jika user belum login sebagai admin, mereka tidak boleh masuk area admin.
7. Cabang default untuk booking adalah Suma Barber Malang.
8. Booking baru berstatus `pending` terlebih dahulu.
9. Nomor WhatsApp pelanggan diinput manual tanpa OTP.
10. Tidak ada deposit/payment online pada MVP.
11. Halaman booking harus menampilkan menu harga layanan sejak awal.
12. Layout booking harus mengutamakan pengalaman mobile-first.
13. Item pricelist terakhir dikonfirmasi sebagai `Polish (Semir)`.
