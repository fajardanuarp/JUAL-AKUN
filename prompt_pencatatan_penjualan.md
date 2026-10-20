# Prompt Pembuatan Sistem Pencatatan Penjualan Akun

Salin dan gunakan teks di bawah ini sebagai instruksi (prompt) untuk AI atau pengembang sistem Anda:

***

**Tugas:** 
Bertindaklah sebagai ahli pembuat sistem pencatatan (Excel/Google Sheets) atau pengembang aplikasi. Saya ingin membuat sistem pencatatan penjualan akun berlangganan yang otomatis dan terstruktur. 

Sistem ini harus memiliki beberapa bagian atau *sheet* berikut:

### 1. Sheet Daftar Harga (Master Data)
Berisi referensi produk agar saat input data bisa otomatis. Kolom yang dibutuhkan:
*   **Jenis Paket**
*   **Harga Modal / Uang Keluar**
*   **Harga Jual / Uang Masuk**
*   **Durasi Paket** (dalam hari atau bulan)

### 2. Sheet Pencatatan Transaksi & Pelanggan (Tabel Utama)
Ini adalah tabel utama tempat saya mencatat penjualan harian. Saya ingin struktur tabelnya mencakup:
*   **No**
*   **Nama Pelanggan**
*   **No HP** (disertai format otomatis untuk tautan WhatsApp jika memungkinkan)
*   **Jenis Paket** (berupa *dropdown list* yang mengambil data dari Sheet Daftar Harga)
*   **Harga / Uang Masuk** (Otomatis terisi berdasarkan Jenis Paket)
*   **Uang Keluar** (Modal untuk akun tersebut)
*   **Profit** (Otomatis: Harga/Uang Masuk dikurangi Uang Keluar)
*   **Tanggal Pembelian**
*   **Masa Aktif** (Tanggal kedaluwarsa akun, dihitung otomatis dari tanggal pembelian + durasi paket)
*   **Sisa Masa Aktif** (Otomatis menghitung mundur jumlah hari dari hari ini menuju tanggal kedaluwarsa)

### 3. Fitur Pemberitahuan / Notifikasi Masa Aktif
Saya membutuhkan sistem peringatan visual (seperti *Conditional Formatting* di Google Sheets/Excel) pada kolom **Sisa Masa Aktif**. Indikator warnanya adalah:
*   🟢 **Hijau:** Masih aktif (Sisa masa aktif > 7 hari)
*   🟡 **Kuning:** Peringatan (Sisa masa aktif 1 - 7 hari) - Waktunya mengingatkan pembeli.
*   🔴 **Merah:** Kedaluwarsa (Sisa masa aktif 0 hari atau minus).

### 4. Laporan Keuangan Sederhana (Dashboard)
Sistem harus memiliki ringkasan (rekapitulasi) untuk melihat:
*   Total Uang Masuk
*   Total Uang Keluar
*   Total Keuntungan (Profit)

**Instruksi Tambahan:**
Tolong buatkan panduan langkah demi langkah cara membuatnya di Google Sheets atau Excel. Sertakan juga rumus-rumus (formula) yang tepat untuk:
1. Menghitung tanggal kedaluwarsa (Masa Aktif).
2. Menghitung sisa hari (Sisa Masa Aktif) secara *real-time*.
3. Pencarian harga otomatis (menggunakan VLOOKUP, XLOOKUP, atau INDEX MATCH).
4. Aturan pembuatan pewarnaan otomatis (*Conditional Formatting*).

***