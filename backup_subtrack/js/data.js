/**
 * Data Storage & Master Data Referensi
 * Sistem Pencatatan Penjualan Akun Berlangganan
 */

const STORAGE_KEYS = {
  PACKAGES: 'subhub_master_packages_v1',
  TRANSACTIONS: 'subhub_transactions_v1'
};

// Data Awal Master Paket Berlangganan
const INITIAL_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Netflix 1 Bulan (1 Profil 4K UHD)',
    category: 'Streaming Video',
    costPrice: 26000,
    sellPrice: 42000,
    durationDays: 30
  },
  {
    id: 'pkg-2',
    name: 'Spotify Premium 1 Bulan (Individu)',
    category: 'Musik & Audio',
    costPrice: 12000,
    sellPrice: 25000,
    durationDays: 30
  },
  {
    id: 'pkg-3',
    name: 'Spotify Premium 3 Bulan',
    category: 'Musik & Audio',
    costPrice: 32000,
    sellPrice: 65000,
    durationDays: 90
  },
  {
    id: 'pkg-4',
    name: 'YouTube Premium 1 Bulan (No Ads)',
    category: 'Streaming Video',
    costPrice: 9000,
    sellPrice: 22000,
    durationDays: 30
  },
  {
    id: 'pkg-5',
    name: 'YouTube Premium 3 Bulan',
    category: 'Streaming Video',
    costPrice: 24000,
    sellPrice: 55000,
    durationDays: 90
  },
  {
    id: 'pkg-6',
    name: 'Canva Pro 1 Tahun (Invite Email)',
    category: 'Desain & Kreatif',
    costPrice: 15000,
    sellPrice: 50000,
    durationDays: 365
  },
  {
    id: 'pkg-7',
    name: 'ChatGPT Plus 1 Bulan (Shared/Private)',
    category: 'AI & Produktivitas',
    costPrice: 250000,
    sellPrice: 330000,
    durationDays: 30
  },
  {
    id: 'pkg-8',
    name: 'Disney+ Hotstar 1 Bulan',
    category: 'Streaming Video',
    costPrice: 30000,
    sellPrice: 48000,
    durationDays: 30
  }
];

// Helper untuk menghitung tanggal relatif hari ini
function getRelativeDateStr(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// Data Awal Transaksi Contoh
const INITIAL_TRANSACTIONS = [
  {
    id: 'trx-101',
    customerName: 'Budi Pratama',
    phone: '6281234567890',
    packageId: 'pkg-1',
    packageName: 'Netflix 1 Bulan (1 Profil 4K UHD)',
    sellPrice: 42000,
    costPrice: 26000,
    profit: 16000,
    purchaseDate: getRelativeDateStr(-25), // Beli 25 hari lalu, sisa 5 hari (Yellow warning)
    expireDate: getRelativeDateStr(5),
    notes: 'Profil 2 PIN: 4321'
  },
  {
    id: 'trx-102',
    customerName: 'Siti Rahmawati',
    phone: '6281987654321',
    packageId: 'pkg-2',
    packageName: 'Spotify Premium 1 Bulan (Individu)',
    sellPrice: 25000,
    costPrice: 12000,
    profit: 13000,
    purchaseDate: getRelativeDateStr(-2), // Beli 2 hari lalu, sisa 28 hari (Green)
    expireDate: getRelativeDateStr(28),
    notes: 'Akun sendiri family invite'
  },
  {
    id: 'trx-103',
    customerName: 'Dimas Wicaksono',
    phone: '6285711223344',
    packageId: 'pkg-4',
    packageName: 'YouTube Premium 1 Bulan (No Ads)',
    sellPrice: 22000,
    costPrice: 9000,
    profit: 13000,
    purchaseDate: getRelativeDateStr(-28), // Sisa 2 hari (Yellow warning)
    expireDate: getRelativeDateStr(2),
    notes: 'Perpanjangan bulan ke-2'
  },
  {
    id: 'trx-104',
    customerName: 'Amanda Putri',
    phone: '6282133445566',
    packageId: 'pkg-6',
    packageName: 'Canva Pro 1 Tahun (Invite Email)',
    sellPrice: 50000,
    costPrice: 15000,
    profit: 35000,
    purchaseDate: getRelativeDateStr(-60), // Masih sisa 305 hari (Green)
    expireDate: getRelativeDateStr(305),
    notes: 'Email: amanda.designer@gmail.com'
  },
  {
    id: 'trx-105',
    customerName: 'Kevin Sanjaya',
    phone: '6281399887766',
    packageId: 'pkg-1',
    packageName: 'Netflix 1 Bulan (1 Profil 4K UHD)',
    sellPrice: 42000,
    costPrice: 26000,
    profit: 16000,
    purchaseDate: getRelativeDateStr(-33), // Sudah expired 3 hari lalu (Red)
    expireDate: getRelativeDateStr(-3),
    notes: 'Sudah diinfokan via WA'
  },
  {
    id: 'trx-106',
    customerName: 'Rian Kurniawan',
    phone: '6285211992288',
    packageId: 'pkg-7',
    packageName: 'ChatGPT Plus 1 Bulan (Shared/Private)',
    sellPrice: 330000,
    costPrice: 250000,
    profit: 80000,
    purchaseDate: getRelativeDateStr(-10), // Sisa 20 hari (Green)
    expireDate: getRelativeDateStr(20),
    notes: 'Akun Dedicated Team'
  }
];

// Utility Formatter Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0);
}

// Utility Format Tanggal Indonesia
function formatIndoDate(dateString) {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Hitung Sisa Hari (Real-time countdown)
function calculateRemainingDays(expireDateStr) {
  if (!expireDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = expireDateStr.split('-');
  const expire = new Date(parts[0], parts[1] - 1, parts[2]);
  expire.setHours(0, 0, 0, 0);

  const diffTime = expire - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Hitung Status Berdasarkan Sisa Hari
function getStatusInfo(remainingDays) {
  if (remainingDays < 0) {
    return {
      status: 'expired',
      label: 'Kedaluwarsa',
      badgeClass: 'badge-expired',
      icon: '🔴',
      detail: `Lewat ${Math.abs(remainingDays)} hari`
    };
  } else if (remainingDays === 0) {
    return {
      status: 'warning',
      label: 'Habis Hari Ini',
      badgeClass: 'badge-warning',
      icon: '🟡',
      detail: '0 hari tersisa'
    };
  } else if (remainingDays <= 7) {
    return {
      status: 'warning',
      label: 'Segera Habis',
      badgeClass: 'badge-warning',
      icon: '🟡',
      detail: `${remainingDays} hari lagi`
    };
  } else {
    return {
      status: 'active',
      label: 'Aktif',
      badgeClass: 'badge-active',
      icon: '🟢',
      detail: `${remainingDays} hari lagi`
    };
  }
}

// Bersihkan nomor WhatsApp (Contoh: '0812...' -> '62812...')
function sanitizePhone(rawPhone) {
  if (!rawPhone) return '';
  let clean = rawPhone.toString().replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (clean.startsWith('8')) {
    clean = '62' + clean;
  }
  return clean;
}
