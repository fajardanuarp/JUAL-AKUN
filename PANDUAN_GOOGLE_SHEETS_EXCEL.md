# 📊 Panduan Lengkap Sistem Pencatatan Penjualan Akun Berlangganan
**Untuk Google Sheets & Microsoft Excel (Otomatis & Terstruktur)**

Dokumen ini berisi panduan langkah demi langkah, struktur tabel, dan kumpulan rumus otomatis untuk mengelola bisnis penjualan akun berlangganan (Netflix, Spotify, YouTube Premium, Canva, dll).

---

## 📑 Struktur Lembar Kerja (Sheets)
Buat 3 lembar kerja (*sheet*) dalam satu file:
1. **`Daftar_Harga`** *(Master Data referensi paket & harga)*
2. **`Transaksi`** *(Tabel utama pencatatan penjualan & pelanggan)*
3. **`Dashboard`** *(Laporan ringkasan finansial & status pelanggan)*

---

## 1. Sheet `Daftar_Harga` (Master Data)

Buat tabel referensi di Sheet bernama **`Daftar_Harga`**:

| Kolom | Nama Kolom | Contoh Data | Tipe / Format | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **A** | **Jenis Paket** | `Netflix Premium 1 Bulan` | Teks | Nama unik paket |
| **B** | **Harga Modal (Keluar)** | `28.000` | Mata Uang (Rp) | Modal beli akun/slot |
| **C** | **Harga Jual (Masuk)** | `45.000` | Mata Uang (Rp) | Harga ke pelanggan |
| **D** | **Durasi (Hari)** | `30` | Angka Biasa | Durasi aktif dalam hari |

### Contoh Data Master:
| A (Jenis Paket) | B (Harga Modal) | C (Harga Jual) | D (Durasi Hari) |
| :--- | :--- | :--- | :--- |
| Netflix 1 Bulan (1 Profil) | 25.000 | 40.000 | 30 |
| Spotify Premium 1 Bulan | 12.000 | 25.000 | 30 |
| Spotify Premium 3 Bulan | 30.000 | 65.000 | 90 |
| YouTube Premium 1 Bulan | 8.000 | 20.000 | 30 |
| YouTube Premium 3 Bulan | 20.000 | 50.000 | 90 |
| Canva Pro 1 Tahun | 15.000 | 50.000 | 365 |
| ChatGPT Plus 1 Bulan | 280.000 | 350.000 | 30 |

---

## 2. Sheet `Transaksi` (Tabel Utama Penjualan)

Struktur kolom pada Sheet **`Transaksi`**:
- **Baris 1**: Judul Header (Kolom A s/d K)
- **Baris 2 dst**: Data Transaksi

### Daftar Kolom & Formula:

| Kolom | Nama Header | Tipe Data / Sumber | Formula / Rumus |
| :--- | :--- | :--- | :--- |
| **A** | **No** | Angka Urut | Manual `1, 2, 3...` atau `=ROW()-1` |
| **B** | **Nama Pelanggan** | Teks | Manual (Contoh: `Budi Santoso`) |
| **C** | **No WhatsApp** | Teks / Angka | Manual (Contoh: `6281234567890`) *(Pastikan diawali 62 tanpa spasi/-)* |
| **D** | **Chat WA** | Tautan Otomatis | **Rumus Link WA:** Lihat di bawah |
| **E** | **Jenis Paket** | Dropdown | Data Validation dari `Daftar_Harga!A2:A` |
| **F** | **Harga Jual (Masuk)** | Otomatis | **Rumus VLOOKUP/XLOOKUP** |
| **G** | **Harga Modal (Keluar)** | Otomatis | **Rumus VLOOKUP/XLOOKUP** |
| **H** | **Profit** | Otomatis | `=F2 - G2` |
| **I** | **Tanggal Pembelian** | Tanggal (YYYY-MM-DD) | Manual (Contoh: `2026-10-20`) |
| **J** | **Tanggal Kedaluwarsa** | Tanggal Otomatis | `=I2 + VLOOKUP(...)` |
| **K** | **Sisa Hari** | Angka Otomatis | `=J2 - TODAY()` |
| **L** | **Status** | Label Otomatis | Rumus IF bersarang / Status Tag |

---

## 3. Kumpulan Rumus Siap Pakai (Formula Cheat Sheet)

> **Catatan Penggunaan Koma (`,`) vs Titik Koma (`;`):**
> - Gunakan koma (`,`) jika settingan Google Sheets / Excel Anda bahasa **English (US)**.
> - Gunakan titik koma (`;`) jika settingan spreadsheet Anda bahasa **Indonesia**.
> *(Kedua versi disediakan di bawah).*

### A. Rumus Link WhatsApp Otomatis (Kolom D)
Menghasilkan tombol/link yang saat diklik langsung membuka chat WhatsApp dengan pesan ramah:

**Versi Indonesia (`;`):**
```excel
=IF(ISBLANK(C2);"";HYPERLINK("https://wa.me/"&SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(TEXT(C2;"0");"+";"");"-";"");" ";"")&"?text=Halo%20kak%20"&ENCODEURL(B2)&",%20terima%20kasih%20telah%20order%20"&ENCODEURL(E2); "💬 Chat WA"))
```

**Versi English (`,`):**
```excel
=IF(ISBLANK(C2), "", HYPERLINK("https://wa.me/"&SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(TEXT(C2,"0"),"+",""),"-","")," ","")&"?text=Halo%20kak%20"&ENCODEURL(B2)&",%20terima%20kasih%20telah%20order%20"&ENCODEURL(E2), "💬 Chat WA"))
```

---

### B. Rumus Harga Jual / Uang Masuk Otomatis (Kolom F)
Mencari harga jual berdasarkan Jenis Paket yang dipilih di kolom E:

**Opsi 1: Menggunakan XLOOKUP (Paling Modern - Google Sheets & Excel 365)**
```excel
=IF(E2=""; 0; XLOOKUP(E2; Daftar_Harga!$A$2:$A$100; Daftar_Harga!$C$2:$C$100; 0))
```

**Opsi 2: Menggunakan VLOOKUP (Kompatibel Semua Versi Excel)**
- Versi Indonesia:
```excel
=IF(ISBLANK(E2); 0; VLOOKUP(E2; Daftar_Harga!$A$2:$D$100; 3; FALSE))
```
- Versi English:
```excel
=IF(ISBLANK(E2), 0, VLOOKUP(E2, Daftar_Harga!$A$2:$D$100, 3, FALSE))
```

---

### C. Rumus Modal / Uang Keluar Otomatis (Kolom G)
Mengambil harga modal dari kolom ke-2 `Daftar_Harga`:

- Versi Indonesia:
```excel
=IF(ISBLANK(E2); 0; VLOOKUP(E2; Daftar_Harga!$A$2:$D$100; 2; FALSE))
```
- Versi English:
```excel
=IF(ISBLANK(E2), 0, VLOOKUP(E2, Daftar_Harga!$A$2:$D$100, 2, FALSE))
```

---

### D. Rumus Profit / Keuntungan (Kolom H)
- Formula:
```excel
=IF(ISBLANK(E2); 0; F2 - G2)
```

---

### E. Rumus Tanggal Kedaluwarsa / Masa Aktif (Kolom J)
Menghitung tanggal berakhir = Tanggal Pembelian (Kolom I) + Durasi Hari dari Master Data:

- Versi Indonesia:
```excel
=IF(OR(ISBLANK(I2); ISBLANK(E2)); ""; I2 + VLOOKUP(E2; Daftar_Harga!$A$2:$D$100; 4; FALSE))
```
- Versi English:
```excel
=IF(OR(ISBLANK(I2), ISBLANK(E2)), "", I2 + VLOOKUP(E2, Daftar_Harga!$A$2:$D$100, 4, FALSE))
```

---

### F. Rumus Sisa Masa Aktif (Kolom K)
Menghitung sisa hari secara real-time mundur:

- Versi Indonesia:
```excel
=IF(ISBLANK(J2); ""; J2 - TODAY())
```
- Versi English:
```excel
=IF(ISBLANK(J2), "", J2 - TODAY())
```

---

### G. Rumus Status Teks (Kolom L)
Menampilkan badge status teks:

- Versi Indonesia:
```excel
=IF(ISBLANK(K2);""; IF(K2<0; "🔴 Expired"; IF(K2=0; "🔴 Habis Hari Ini"; IF(K2<=7; "🟡 Akan Habis ("&K2&" hr)"; "🟢 Aktif ("&K2&" hr)"))))
```
- Versi English:
```excel
=IF(ISBLANK(K2),"", IF(K2<0, "🔴 Expired", IF(K2=0, "🔴 Habis Hari Ini", IF(K2<=7, "🟡 Akan Habis ("&K2&" hr)", "🟢 Aktif ("&K2&" hr)"))))
```

---

## 4. Panduan Format Bersyarat (*Conditional Formatting*)

Atur pewarnaan otomatis pada kolom **Sisa Masa Aktif (Kolom K)** atau seluruh baris:

1. Blok kolom **K2:K1000** (atau pilih sel `K2:K`).
2. Masuk ke menu:
   - **Google Sheets**: `Format` > `Conditional formatting` (Format bersyarat).
   - **Excel**: `Home` > `Conditional Formatting` > `New Rule`.
3. Tambahkan 3 aturan pewarnaan berikut:

### 🟢 Aturan 1: Akun Masih Aktif (Hijau)
- **Format rules / Tipe Aturan**: `Greater than` (Lebih besar dari).
- **Nilai**: `7`
- **Warna Format**:
  - Background: Hijau muda (`#E6F4EA` atau `#D4EDDA`)
  - Warna Teks: Hijau tua (`#137333` atau `#155724`)

### 🟡 Aturan 2: Peringatan Akan Kedaluwarsa (Kuning)
- **Format rules / Tipe Aturan**: `Is between` (Antara).
- **Nilai**: `0` dan `7`  *(atau 1 s/d 7)*
- **Warna Format**:
  - Background: Kuning muda (`#FEF7E0` atau `#FFF3CD`)
  - Warna Teks: Cokelat/Kuning tua (`#B06000` atau `#856404`)

### 🔴 Aturan 3: Sudah Kedaluwarsa / Expired (Merah)
- **Format rules / Tipe Aturan**: `Less than` (Kurang dari).
- **Nilai**: `0` *(atau `Less than or equal to 0`)*
- **Warna Format**:
  - Background: Merah muda (`#FCE8E6` atau `#F8D7DA`)
  - Warna Teks: Merah tua (`#C5221F` atau `#721C24`)

---

## 5. Cara Membuat Dropdown Jenis Paket (Data Validation)

1. Di Sheet **`Transaksi`**, seleksi sel **`E2:E1000`**.
2. Buka menu **Data** > **Data validation** (Validasi Data) > **Add rule** (Tambah aturan).
3. Pada kriteria pemilihan:
   - **Kriteria**: `Dropdown (from a range)` / `Daftar dari rentang`.
   - **Rentang**: Masukkan `=Daftar_Harga!$A$2:$A$100`.
4. Klik **Done / Simpan**. Sekarang kolom E sudah memiliki dropdown otomatis dari daftar harga!

---

## 6. Sheet `Dashboard` (Rekapitulasi Finansial & Operasional)

Buat Sheet ke-3 bernama **`Dashboard`** dengan kartu ringkasan rumus berikut:

| Metrik | Deskripsi | Rumus (Google Sheets / Excel) |
| :--- | :--- | :--- |
| **Total Omzet (Uang Masuk)** | Penjumlahan semua uang masuk | `=SUM(Transaksi!F2:F)` |
| **Total Modal (Uang Keluar)** | Penjumlahan semua modal | `=SUM(Transaksi!G2:G)` |
| **Total Keuntungan Bersih** | Total Profit | `=SUM(Transaksi!H2:H)` |
| **Margin Keuntungan (%)** | Persentase laba | `=IF(B2>0; B4/B2; 0)` *(Format Persen %)* |
| **Total Transaksi** | Total penjualan tercatat | `=COUNTA(Transaksi!B2:B)` |
| **Akun Aktif (🟢)** | Sisa hari > 7 | `=COUNTIF(Transaksi!K2:K; ">7")` |
| **Akan Habis (🟡 1-7 Hari)** | Perlu diingatkan perpanjangan | `=COUNTIFS(Transaksi!K2:K; ">=0"; Transaksi!K2:K; "<=7")` |
| **Kedaluwarsa (🔴 Expired)** | Sudah lewat masa aktif | `=COUNTIF(Transaksi!K2:K; "<0")` |

---

## 💡 Tips Tambahan untuk Bisnis Penjualan Akun
1. **Pesan WhatsApp Template Follow-Up**: Anda bisa membuat link wa otomatis khusus untuk peringatan perpanjangan bagi pelanggan yang sisa harinya ≤ 7 hari:
   ```excel
   =IF(AND(K2<=7; K2>=0); HYPERLINK("https://wa.me/"&C2&"?text=Halo%20kak%20"&ENCODEURL(B2)&",%20akun%20"&ENCODEURL(E2)&"%20kakak%20akan%20berakhir%20dalam%20"&K2&"%20hari%20lagi.%20Mau%20langsung%20diperpanjang%20agar%20tidak%20terputus?"; "🔔 Kirim Peringatan WA"); "-")
   ```
2. **Kunci Header Baris**: Di menu `View` > `Freeze` > `1 row` agar saat scroll ke bawah judul kolom tetap terlihat.
3. **Format Angka Rupiah**: Seleksi kolom Finansial (F, G, H), klik menu `Format` > `Number` > `Currency` (Rupiah).
