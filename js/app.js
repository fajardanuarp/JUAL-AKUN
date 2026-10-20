/**
 * SubTrack Pro - Aplikasi Pencatatan Penjualan Akun Berlangganan
 * Logika Interaktif & State Management
 */

(function () {
  'use strict';

  // State Aplikasi
  let packages = [];
  let transactions = [];
  let activeFilters = {
    search: '',
    status: 'ALL',
    packageId: 'ALL'
  };

  // Elemen DOM
  const elements = {
    // Metrics
    statGrossRevenue: document.getElementById('statGrossRevenue'),
    statTotalCost: document.getElementById('statTotalCost'),
    statNetProfit: document.getElementById('statNetProfit'),
    statProfitMargin: document.getElementById('statProfitMargin'),
    statCountActive: document.getElementById('statCountActive'),
    statCountWarning: document.getElementById('statCountWarning'),
    statCountExpired: document.getElementById('statCountExpired'),
    statTotalTrans: document.getElementById('statTotalTrans'),

    // Urgent Alert
    urgentAlertBox: document.getElementById('urgentAlertBox'),
    urgentAlertTitle: document.getElementById('urgentAlertTitle'),
    btnFilterUrgent: document.getElementById('btnFilterUrgent'),

    // Toolbar & Filter
    searchInput: document.getElementById('searchInput'),
    btnClearSearch: document.getElementById('btnClearSearch'),
    statusFilter: document.getElementById('statusFilter'),
    packageFilter: document.getElementById('packageFilter'),
    btnExportCSV: document.getElementById('btnExportCSV'),
    btnResetSampleData: document.getElementById('btnResetSampleData'),
    btnResetFilters: document.getElementById('btnResetFilters'),

    // Transaction Summary Widget & Table Footer
    trxSummaryWidget: document.getElementById('trxSummaryWidget'),
    trxStatFilterBadge: document.getElementById('trxStatFilterBadge'),
    trxFilterNoticeText: document.getElementById('trxFilterNoticeText'),
    trxStatTotalSales: document.getElementById('trxStatTotalSales'),
    trxStatSalesSub: document.getElementById('trxStatSalesSub'),
    trxStatTotalCost: document.getElementById('trxStatTotalCost'),
    trxStatCostSub: document.getElementById('trxStatCostSub'),
    trxStatNetProfit: document.getElementById('trxStatNetProfit'),
    trxStatMargin: document.getElementById('trxStatMargin'),
    trxStatCount: document.getElementById('trxStatCount'),
    trxStatUnitsCount: document.getElementById('trxStatUnitsCount'),

    // Table
    transactionTableBody: document.getElementById('transactionTableBody'),
    transactionTableFoot: document.getElementById('transactionTableFoot'),
    tfootTotalItems: document.getElementById('tfootTotalItems'),
    tfootTotalRevenue: document.getElementById('tfootTotalRevenue'),
    tfootTotalCost: document.getElementById('tfootTotalCost'),
    tfootTotalProfit: document.getElementById('tfootTotalProfit'),
    tfootProfitMargin: document.getElementById('tfootProfitMargin'),
    tfootStatusBadges: document.getElementById('tfootStatusBadges'),
    emptyState: document.getElementById('emptyState'),

    // Modals
    modalTransaction: document.getElementById('modalTransaction'),
    modalTransactionTitle: document.getElementById('modalTransactionTitle'),
    formTransaction: document.getElementById('formTransaction'),
    btnOpenAddTransaction: document.getElementById('btnOpenAddTransaction'),

    modalPackages: document.getElementById('modalPackages'),
    btnOpenManagePackages: document.getElementById('btnOpenManagePackages'),
    formPackage: document.getElementById('formPackage'),
    packageTableBody: document.getElementById('packageTableBody'),
    packageFormTitle: document.getElementById('packageFormTitle'),
    btnCancelPkgEdit: document.getElementById('btnCancelPkgEdit'),

    modalSheetsGuide: document.getElementById('modalSheetsGuide'),
    btnOpenSheetsGuide: document.getElementById('btnOpenSheetsGuide'),

    // Inputs Transaksi
    editTrxId: document.getElementById('editTrxId'),
    inputCustomerName: document.getElementById('inputCustomerName'),
    inputCustomerPhone: document.getElementById('inputCustomerPhone'),
    inputPackage: document.getElementById('inputPackage'),
    inputQty: document.getElementById('inputQty'),
    btnQtyMinus: document.getElementById('btnQtyMinus'),
    btnQtyPlus: document.getElementById('btnQtyPlus'),
    inputSellPrice: document.getElementById('inputSellPrice'),
    inputCostPrice: document.getElementById('inputCostPrice'),
    previewTotalSell: document.getElementById('previewTotalSell'),
    previewTotalCost: document.getElementById('previewTotalCost'),
    previewProfit: document.getElementById('previewProfit'),
    previewSellFormula: document.getElementById('previewSellFormula'),
    previewCostFormula: document.getElementById('previewCostFormula'),
    previewMargin: document.getElementById('previewMargin'),
    inputPurchaseDate: document.getElementById('inputPurchaseDate'),
    inputExpireDate: document.getElementById('inputExpireDate'),
    inputNotes: document.getElementById('inputNotes'),

    // Inputs Paket
    editPkgId: document.getElementById('editPkgId'),
    pkgName: document.getElementById('pkgName'),
    pkgCategory: document.getElementById('pkgCategory'),
    pkgDuration: document.getElementById('pkgDuration'),
    pkgCost: document.getElementById('pkgCost'),
    pkgSell: document.getElementById('pkgSell'),

    // Simulator Modal & Profit
    inputCapitalAmount: document.getElementById('inputCapitalAmount'),
    simPresetChips: document.getElementById('simPresetChips'),
    simPackageStrategy: document.getElementById('simPackageStrategy'),
    simStrategyNote: document.getElementById('simStrategyNote'),
    simResultRevenue: document.getElementById('simResultRevenue'),
    simResultProfit: document.getElementById('simResultProfit'),
    simResultROI: document.getElementById('simResultROI'),
    simResultUnits: document.getElementById('simResultUnits'),
    simUsedCapital: document.getElementById('simUsedCapital'),
    simRemainingCapital: document.getElementById('simRemainingCapital'),
    simProgressBar: document.getElementById('simProgressBar'),
    simBreakdownBody: document.getElementById('simBreakdownBody')
  };

  /* ==========================================================================
     Inisialisasi & LocalStorage
     ========================================================================== */
  function initApp() {
    loadStorageData();
    populatePackageDropdowns();
    renderDashboard();
    renderTransactionsTable();
    initSimulator();
    setupEventListeners();
  }

  function loadStorageData() {
    const storedPackages = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    if (storedPackages) {
      try {
        packages = JSON.parse(storedPackages);
      } catch (e) {
        packages = [...INITIAL_PACKAGES];
      }
    } else {
      packages = [...INITIAL_PACKAGES];
      savePackages();
    }

    const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (storedTransactions) {
      try {
        transactions = JSON.parse(storedTransactions);
        // Pastikan kompatibilitas: inisialisasi qty jika belum ada
        transactions.forEach(t => {
          if (!t.qty || t.qty < 1) t.qty = 1;
        });
      } catch (e) {
        transactions = [...INITIAL_TRANSACTIONS];
      }
    } else {
      transactions = [...INITIAL_TRANSACTIONS];
      saveTransactions();
    }
  }

  function savePackages() {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  }

  function saveTransactions() {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  /* ==========================================================================
     Dashboard Metrics & Rekapitulasi
     ========================================================================== */
  function renderDashboard() {
    let grossRevenue = 0;
    let totalCost = 0;
    let netProfit = 0;

    let activeCount = 0;
    let warningCount = 0;
    let expiredCount = 0;

    transactions.forEach(trx => {
      const qty = Math.max(1, Number(trx.qty) || 1);
      const sell = Number(trx.sellPrice) || 0;
      const cost = Number(trx.costPrice) || 0;
      const totalSell = qty * sell;
      const totalCostTrx = qty * cost;
      const profit = totalSell - totalCostTrx;

      grossRevenue += totalSell;
      totalCost += totalCostTrx;
      netProfit += profit;

      const remainingDays = calculateRemainingDays(trx.expireDate);
      if (remainingDays < 0) {
        expiredCount++;
      } else if (remainingDays <= 7) {
        warningCount++;
      } else {
        activeCount++;
      }
    });

    // Tampilkan nilai finansial
    elements.statGrossRevenue.textContent = formatRupiah(grossRevenue);
    elements.statTotalCost.textContent = formatRupiah(totalCost);
    elements.statNetProfit.textContent = formatRupiah(netProfit);

    const marginPercent = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : 0;
    elements.statProfitMargin.textContent = `Margin Laba: ${marginPercent}%`;

    // Tampilkan counters status
    elements.statCountActive.textContent = activeCount;
    elements.statCountWarning.textContent = warningCount;
    elements.statCountExpired.textContent = expiredCount;
    elements.statTotalTrans.textContent = transactions.length;

    // Tampilkan Banner Peringatan jika ada akun 1-7 hari
    if (warningCount > 0) {
      elements.urgentAlertBox.style.display = 'flex';
      elements.urgentAlertTitle.textContent = `Perhatian: Ada ${warningCount} pelanggan yang masa aktifnya habis dalam 7 hari ke depan!`;
    } else {
      elements.urgentAlertBox.style.display = 'none';
    }
  }

  /* ==========================================================================
     Dropdown Paket
     ========================================================================== */
  function populatePackageDropdowns() {
    // Dropdown di Form Transaksi
    elements.inputPackage.innerHTML = '<option value="">-- Pilih Paket Langganan --</option>';
    // Dropdown di Filter Toolbar
    elements.packageFilter.innerHTML = '<option value="ALL">Semua Jenis Paket</option>';

    packages.forEach(pkg => {
      // Option untuk form
      const optForm = document.createElement('option');
      optForm.value = pkg.id;
      optForm.textContent = `${pkg.name} (${pkg.durationDays} hr) - ${formatRupiah(pkg.sellPrice)}`;
      elements.inputPackage.appendChild(optForm);

      // Option untuk filter
      const optFilter = document.createElement('option');
      optFilter.value = pkg.id;
      optFilter.textContent = pkg.name;
      elements.packageFilter.appendChild(optFilter);
    });

    // Perbarui juga pilihan di simulator modal
    populateSimulatorPackages();
    calculateSimulation();
  }

  /* ==========================================================================
     Tabel Transaksi & Filter
     ========================================================================== */
  function getFilteredTransactions() {
    return transactions.filter(trx => {
      // Filter Pencarian Teks
      if (activeFilters.search) {
        const query = activeFilters.search.toLowerCase();
        const matchName = trx.customerName.toLowerCase().includes(query);
        const matchPhone = trx.phone.includes(query);
        const matchPkg = trx.packageName.toLowerCase().includes(query);
        const matchNotes = (trx.notes || '').toLowerCase().includes(query);
        if (!matchName && !matchPhone && !matchPkg && !matchNotes) {
          return false;
        }
      }

      // Filter Paket
      if (activeFilters.packageId !== 'ALL' && trx.packageId !== activeFilters.packageId) {
        return false;
      }

      // Filter Status
      if (activeFilters.status !== 'ALL') {
        const remaining = calculateRemainingDays(trx.expireDate);
        if (activeFilters.status === 'ACTIVE' && remaining <= 7) return false;
        if (activeFilters.status === 'WARNING' && (remaining < 0 || remaining > 7)) return false;
        if (activeFilters.status === 'EXPIRED' && remaining >= 0) return false;
      }

      return true;
    });
  }

  function renderTransactionsTable() {
    const list = getFilteredTransactions();
    elements.transactionTableBody.innerHTML = '';

    // Hitung akumulasi statistik untuk data transaksi yang tampil / difilter
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let totalUnits = 0;
    let activeCount = 0;
    let warningCount = 0;
    let expiredCount = 0;

    list.forEach(trx => {
      const qty = Math.max(1, Number(trx.qty) || 1);
      const unitSell = Number(trx.sellPrice) || 0;
      const unitCost = Number(trx.costPrice) || 0;
      const rowTotalSell = qty * unitSell;
      const rowTotalCost = qty * unitCost;
      const rowProfit = rowTotalSell - rowTotalCost;

      totalRevenue += rowTotalSell;
      totalCost += rowTotalCost;
      totalProfit += rowProfit;
      totalUnits += qty;

      const remaining = calculateRemainingDays(trx.expireDate);
      if (remaining < 0) {
        expiredCount++;
      } else if (remaining <= 7) {
        warningCount++;
      } else {
        activeCount++;
      }
    });

    const isFiltered = Boolean(activeFilters.search || activeFilters.status !== 'ALL' || activeFilters.packageId !== 'ALL');
    const marginPct = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

    // Perbarui Widget Ringkasan Total Penjualan di atas tabel
    if (elements.trxStatTotalSales) elements.trxStatTotalSales.textContent = formatRupiah(totalRevenue);
    if (elements.trxStatTotalCost) elements.trxStatTotalCost.textContent = formatRupiah(totalCost);
    if (elements.trxStatNetProfit) elements.trxStatNetProfit.textContent = formatRupiah(totalProfit);
    if (elements.trxStatMargin) elements.trxStatMargin.textContent = `Margin: ${marginPct}%`;
    if (elements.trxStatCount) elements.trxStatCount.textContent = `${list.length} Transaksi`;
    if (elements.trxStatUnitsCount) elements.trxStatUnitsCount.textContent = `${totalUnits} Total Akun Terjual`;

    if (elements.trxFilterNoticeText) {
      if (isFiltered) {
        elements.trxFilterNoticeText.textContent = `Hasil Filter (${list.length} dari ${transactions.length} Transaksi)`;
      } else {
        elements.trxFilterNoticeText.textContent = `Semua Data (${transactions.length} Transaksi)`;
      }
    }

    if (list.length === 0) {
      elements.emptyState.style.display = 'block';
      if (elements.transactionTableFoot) elements.transactionTableFoot.style.display = 'none';
      return;
    }

    elements.emptyState.style.display = 'none';
    if (elements.transactionTableFoot) elements.transactionTableFoot.style.display = '';

    // Perbarui Footer Tabel (TFOOT)
    if (elements.tfootTotalRevenue) elements.tfootTotalRevenue.textContent = `+ ${formatRupiah(totalRevenue)}`;
    if (elements.tfootTotalCost) elements.tfootTotalCost.textContent = `Modal: ${formatRupiah(totalCost)}`;
    if (elements.tfootTotalProfit) elements.tfootTotalProfit.textContent = `+ ${formatRupiah(totalProfit)}`;
    if (elements.tfootProfitMargin) elements.tfootProfitMargin.textContent = `Margin: ${marginPct}%`;
    if (elements.tfootTotalItems) elements.tfootTotalItems.textContent = `${list.length} Transaksi (${totalUnits} Akun)`;
    if (elements.tfootStatusBadges) {
      elements.tfootStatusBadges.innerHTML = `
        <span class="status-mini-pill" title="Akun Masih Aktif">🟢 ${activeCount} Aktif</span>
        <span class="status-mini-pill" title="Segera Habis">🟡 ${warningCount} Habis</span>
        <span class="status-mini-pill" title="Kedaluwarsa">🔴 ${expiredCount} Exp</span>
      `;
    }

    list.forEach((trx, index) => {
      const qty = Math.max(1, Number(trx.qty) || 1);
      const unitSell = Number(trx.sellPrice) || 0;
      const unitCost = Number(trx.costPrice) || 0;
      const rowTotalSell = qty * unitSell;
      const rowTotalCost = qty * unitCost;
      const rowProfit = rowTotalSell - rowTotalCost;

      const remainingDays = calculateRemainingDays(trx.expireDate);
      const statusInfo = getStatusInfo(remainingDays);
      const cleanPhone = sanitizePhone(trx.phone);
      const waLink = generateWhatsAppLink(trx, remainingDays);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-dim" style="font-weight:600;">${index + 1}</td>
        <td>
          <span class="cust-name">${escapeHTML(trx.customerName)}</span>
          <span class="cust-phone">📱 ${escapeHTML(trx.phone)}</span>
        </td>
        <td>
          <div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
            <span class="pkg-badge">${escapeHTML(trx.packageName)}</span>
            ${qty > 1 ? `<span class="qty-badge" title="Kuantitas pesanan: ${qty} akun">x${qty} Akun</span>` : ''}
          </div>
          ${trx.notes ? `<span class="pkg-notes">📝 ${escapeHTML(trx.notes)}</span>` : ''}
        </td>
        <td>
          <div class="fin-cell">
            <span class="fin-total-sell" title="Total Penjualan (Uang Masuk)">+ ${formatRupiah(rowTotalSell)}</span>
            ${qty > 1 ? `<span class="fin-unit-detail">(${qty}x @ ${formatRupiah(unitSell)})</span>` : ''}
            <span class="fin-cost" title="Total Modal">Modal: ${formatRupiah(rowTotalCost)}</span>
          </div>
        </td>
        <td>
          <div class="profit-cell">
            <span class="profit-text" title="Total Profit Bersih">+ ${formatRupiah(rowProfit)}</span>
            <span class="profit-sub-pct">${rowTotalSell > 0 ? ((rowProfit / rowTotalSell) * 100).toFixed(0) + '% margin' : ''}</span>
          </div>
        </td>
        <td>
          <span class="date-expire">Kedaluwarsa: ${formatIndoDate(trx.expireDate)}</span>
          <span class="date-purchased">Beli: ${formatIndoDate(trx.purchaseDate)}</span>
        </td>
        <td>
          <div class="status-pill ${statusInfo.badgeClass}">
            <span>${statusInfo.icon}</span>
            <span>${statusInfo.label} (${statusInfo.detail})</span>
          </div>
        </td>
        <td class="text-right">
          <div class="action-buttons">
            <a href="${waLink}" target="_blank" rel="noopener" class="btn-wa" title="Kirim Chat Pengingat via WhatsApp">
              <span>💬 WA</span>
            </a>
            <button class="btn-icon-action btn-renew" onclick="window.SubTrackApp.quickRenew('${trx.id}')" title="Perpanjang Langganan (+ Durasi)">
              🔄
            </button>
            <button class="btn-icon-action" onclick="window.SubTrackApp.editTransaction('${trx.id}')" title="Edit Transaksi">
              ✏️
            </button>
            <button class="btn-icon-action btn-del" onclick="window.SubTrackApp.deleteTransaction('${trx.id}')" title="Hapus Transaksi">
              🗑️
            </button>
          </div>
        </td>
      `;
      elements.transactionTableBody.appendChild(tr);
    });
  }

  // Generator Link WhatsApp Otomatis dengan Pesan Ramah
  function generateWhatsAppLink(trx, remainingDays) {
    const cleanPhone = sanitizePhone(trx.phone);
    if (!cleanPhone) return '#';

    let message = '';
    const custName = trx.customerName;
    const pkgName = trx.packageName;
    const expDate = formatIndoDate(trx.expireDate);

    if (remainingDays < 0) {
      // Pesan untuk akun kedaluwarsa
      message = `Halo kak ${custName}, kami dari admin langganan. Menginfokan bahwa akun ${pkgName} kakak telah berakhir pada tanggal ${expDate}. Apakah ingin diaktifkan kembali kak? Terima kasih 🙏`;
    } else if (remainingDays === 0) {
      // Pesan untuk akun habis hari ini
      message = `🔔 PENTING: Halo kak ${custName}, masa aktif akun ${pkgName} kakak berakhir HARI INI (${expDate}). Mau langsung diperpanjang agar akses tidak terputus kak? Terima kasih 🙏`;
    } else if (remainingDays <= 7) {
      // Pesan pengingat masa aktif akan segera habis
      message = `🔔 Pengingat Perpanjangan: Halo kak ${custName}, sekadar mengingatkan masa aktif akun ${pkgName} kakak tersisa ${remainingDays} hari lagi (berakhir ${expDate}). Apakah mau langsung diperpanjang kak agar layanannya tetap lancar? Terima kasih 🙏`;
    } else {
      // Pesan informasi aktif reguler
      message = `Halo kak ${custName}, terima kasih telah berlangganan ${pkgName}. Akun aktif hingga ${expDate}. Jika butuh bantuan silakan hubungi kami ya kak! 🙏`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  /* ==========================================================================
     CRUD Transaksi
     ========================================================================== */
  function openAddTransactionModal() {
    elements.modalTransactionTitle.textContent = 'Catat Penjualan Akun Baru';
    elements.formTransaction.reset();
    elements.editTrxId.value = '';
    if (elements.inputQty) elements.inputQty.value = 1;

    // Default tanggal beli = hari ini
    const todayStr = new Date().toISOString().split('T')[0];
    elements.inputPurchaseDate.value = todayStr;
    elements.inputExpireDate.value = todayStr;
    updateProfitPreview();

    elements.modalTransaction.style.display = 'flex';
  }

  function editTransaction(id) {
    const trx = transactions.find(t => t.id === id);
    if (!trx) return;

    elements.modalTransactionTitle.textContent = 'Edit Data Transaksi';
    elements.editTrxId.value = trx.id;
    elements.inputCustomerName.value = trx.customerName;
    elements.inputCustomerPhone.value = trx.phone;
    elements.inputPackage.value = trx.packageId;
    if (elements.inputQty) elements.inputQty.value = trx.qty || 1;
    elements.inputSellPrice.value = trx.sellPrice;
    elements.inputCostPrice.value = trx.costPrice;
    elements.inputPurchaseDate.value = trx.purchaseDate;
    elements.inputExpireDate.value = trx.expireDate;
    elements.inputNotes.value = trx.notes || '';

    updateProfitPreview();
    elements.modalTransaction.style.display = 'flex';
  }

  function handlePackageSelectionChange() {
    const pkgId = elements.inputPackage.value;
    const selectedPkg = packages.find(p => p.id === pkgId);

    if (selectedPkg) {
      elements.inputSellPrice.value = selectedPkg.sellPrice;
      elements.inputCostPrice.value = selectedPkg.costPrice;

      // Hitung otomatis Tanggal Kedaluwarsa: Tanggal Beli + Durasi Paket
      const purchaseDateVal = elements.inputPurchaseDate.value || new Date().toISOString().split('T')[0];
      const purchaseDate = new Date(purchaseDateVal);
      purchaseDate.setDate(purchaseDate.getDate() + Number(selectedPkg.durationDays || 30));
      elements.inputExpireDate.value = purchaseDate.toISOString().split('T')[0];
    }
    updateProfitPreview();
  }

  function updateProfitPreview() {
    const qty = Math.max(1, Number(elements.inputQty?.value) || 1);
    const unitSell = Number(elements.inputSellPrice.value) || 0;
    const unitCost = Number(elements.inputCostPrice.value) || 0;
    const totalSell = qty * unitSell;
    const totalCost = qty * unitCost;
    const profit = totalSell - totalCost;

    if (elements.previewTotalSell) elements.previewTotalSell.textContent = formatRupiah(totalSell);
    if (elements.previewTotalCost) elements.previewTotalCost.textContent = formatRupiah(totalCost);
    if (elements.previewProfit) elements.previewProfit.textContent = formatRupiah(profit);
    if (elements.previewSellFormula) elements.previewSellFormula.textContent = `${qty} x ${formatRupiah(unitSell)}`;
    if (elements.previewCostFormula) elements.previewCostFormula.textContent = `${qty} x ${formatRupiah(unitCost)}`;
    if (elements.previewMargin) {
      const margin = totalSell > 0 ? ((profit / totalSell) * 100).toFixed(1) : 0;
      elements.previewMargin.textContent = `Margin: ${margin}%`;
    }
  }

  function handleSaveTransaction(e) {
    e.preventDefault();

    const editId = elements.editTrxId.value;
    const pkgId = elements.inputPackage.value;
    const selectedPkg = packages.find(p => p.id === pkgId);

    const qty = Math.max(1, Number(elements.inputQty?.value) || 1);
    const unitSell = Number(elements.inputSellPrice.value) || 0;
    const unitCost = Number(elements.inputCostPrice.value) || 0;
    const totalSell = qty * unitSell;
    const totalCost = qty * unitCost;
    const profit = totalSell - totalCost;

    const trxData = {
      id: editId || 'trx-' + Date.now(),
      customerName: elements.inputCustomerName.value.trim(),
      phone: sanitizePhone(elements.inputCustomerPhone.value.trim()),
      packageId: pkgId,
      packageName: selectedPkg ? selectedPkg.name : 'Paket Kustom',
      qty: qty,
      sellPrice: unitSell,
      costPrice: unitCost,
      totalSell: totalSell,
      totalCost: totalCost,
      profit: profit,
      purchaseDate: elements.inputPurchaseDate.value,
      expireDate: elements.inputExpireDate.value,
      notes: elements.inputNotes.value.trim()
    };

    if (editId) {
      const idx = transactions.findIndex(t => t.id === editId);
      if (idx !== -1) {
        transactions[idx] = trxData;
      }
    } else {
      transactions.unshift(trxData);
    }

    saveTransactions();
    renderDashboard();
    renderTransactionsTable();
    closeAllModals();
  }

  function deleteTransaction(id) {
    const trx = transactions.find(t => t.id === id);
    if (!trx) return;

    if (confirm(`Yakin ingin menghapus catatan penjualan untuk "${trx.customerName}" (${trx.packageName})?`)) {
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions();
      renderDashboard();
      renderTransactionsTable();
    }
  }

  // Fitur 1-Click Perpanjang (Quick Renew)
  function quickRenew(id) {
    const trx = transactions.find(t => t.id === id);
    if (!trx) return;

    const pkg = packages.find(p => p.id === trx.packageId);
    const duration = pkg ? Number(pkg.durationDays) : 30;

    // Tentukan tanggal mulai perpanjangan:
    // Jika masih aktif di masa depan, tambahkan dari expireDate saat ini.
    // Jika sudah kedaluwarsa, mulai perpanjang dari hari ini.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let baseDate = new Date(trx.expireDate);
    if (isNaN(baseDate.getTime()) || baseDate < today) {
      baseDate = new Date();
    }

    baseDate.setDate(baseDate.getDate() + duration);
    const newExpireDate = baseDate.toISOString().split('T')[0];

    if (confirm(`Perpanjang langganan ${trx.customerName} (${trx.packageName}) selama +${duration} hari?\n\nTanggal berakhir baru: ${formatIndoDate(newExpireDate)}`)) {
      trx.expireDate = newExpireDate;
      trx.notes = (trx.notes ? trx.notes + ' | ' : '') + `Diperpanjang pada ${formatIndoDate(new Date().toISOString().split('T')[0])}`;
      
      saveTransactions();
      renderDashboard();
      renderTransactionsTable();
      alert(`Berhasil memperpanjang langganan! Masa aktif kini hingga ${formatIndoDate(newExpireDate)}.`);
    }
  }

  /* ==========================================================================
     CRUD Master Data Paket (Daftar Harga)
     ========================================================================== */
  function openPackagesModal() {
    renderPackageTable();
    resetPackageForm();
    elements.modalPackages.style.display = 'flex';
  }

  function renderPackageTable() {
    elements.packageTableBody.innerHTML = '';
    packages.forEach(pkg => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${escapeHTML(pkg.name)}</strong>
          <span style="display:block; font-size:0.72rem; color:var(--text-dim);">${escapeHTML(pkg.category || '-')}</span>
        </td>
        <td style="color:var(--text-muted);">${formatRupiah(pkg.costPrice)}</td>
        <td style="color:#34D399; font-weight:600;">${formatRupiah(pkg.sellPrice)}</td>
        <td>${pkg.durationDays} hr</td>
        <td>
          <div style="display:flex; gap:4px;">
            <button class="btn-icon-action" onclick="window.SubTrackApp.editPackage('${pkg.id}')" title="Edit Paket">✏️</button>
            <button class="btn-icon-action btn-del" onclick="window.SubTrackApp.deletePackage('${pkg.id}')" title="Hapus Paket">🗑️</button>
          </div>
        </td>
      `;
      elements.packageTableBody.appendChild(tr);
    });
  }

  function resetPackageForm() {
    elements.formPackage.reset();
    elements.editPkgId.value = '';
    elements.packageFormTitle.textContent = '+ Tambah Paket Baru';
    elements.btnCancelPkgEdit.style.display = 'none';
  }

  function editPackage(id) {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;

    elements.editPkgId.value = pkg.id;
    elements.pkgName.value = pkg.name;
    elements.pkgCategory.value = pkg.category || '';
    elements.pkgDuration.value = pkg.durationDays;
    elements.pkgCost.value = pkg.costPrice;
    elements.pkgSell.value = pkg.sellPrice;

    elements.packageFormTitle.textContent = '✏️ Edit Paket';
    elements.btnCancelPkgEdit.style.display = 'inline-flex';
  }

  function handleSavePackage(e) {
    e.preventDefault();

    const editId = elements.editPkgId.value;
    const pkgData = {
      id: editId || 'pkg-' + Date.now(),
      name: elements.pkgName.value.trim(),
      category: elements.pkgCategory.value.trim(),
      durationDays: Number(elements.pkgDuration.value) || 30,
      costPrice: Number(elements.pkgCost.value) || 0,
      sellPrice: Number(elements.pkgSell.value) || 0
    };

    if (editId) {
      const idx = packages.findIndex(p => p.id === editId);
      if (idx !== -1) packages[idx] = pkgData;
    } else {
      packages.push(pkgData);
    }

    savePackages();
    populatePackageDropdowns();
    renderPackageTable();
    resetPackageForm();
  }

  function deletePackage(id) {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;

    if (confirm(`Hapus paket "${pkg.name}" dari master data?`)) {
      packages = packages.filter(p => p.id !== id);
      savePackages();
      populatePackageDropdowns();
      renderPackageTable();
    }
  }

  /* ==========================================================================
     Export ke Excel / CSV
     ========================================================================== */
  function exportToCSV() {
    if (transactions.length === 0) {
      alert('Tidak ada data transaksi untuk diekspor.');
      return;
    }

    // Header CSV
    const headers = [
      'No',
      'Nama Pelanggan',
      'No WhatsApp',
      'Jenis Paket',
      'Jumlah (Qty)',
      'Harga Satuan (Rp)',
      'Total Penjualan / Uang Masuk (Rp)',
      'Modal Satuan (Rp)',
      'Total Modal (Rp)',
      'Total Profit (Rp)',
      'Tanggal Pembelian',
      'Tanggal Kedaluwarsa',
      'Sisa Hari',
      'Status',
      'Catatan'
    ];

    let sumUnits = 0;
    let sumRevenue = 0;
    let sumCost = 0;
    let sumProfit = 0;

    const rows = transactions.map((t, idx) => {
      const qty = Math.max(1, Number(t.qty) || 1);
      const unitSell = Number(t.sellPrice) || 0;
      const unitCost = Number(t.costPrice) || 0;
      const totalSell = qty * unitSell;
      const totalCostTrx = qty * unitCost;
      const profit = totalSell - totalCostTrx;

      sumUnits += qty;
      sumRevenue += totalSell;
      sumCost += totalCostTrx;
      sumProfit += profit;

      const remaining = calculateRemainingDays(t.expireDate);
      const statusInfo = getStatusInfo(remaining);
      return [
        idx + 1,
        `"${(t.customerName || '').replace(/"/g, '""')}"`,
        `"${t.phone || ''}"`,
        `"${(t.packageName || '').replace(/"/g, '""')}"`,
        qty,
        unitSell,
        totalSell,
        unitCost,
        totalCostTrx,
        profit,
        t.purchaseDate,
        t.expireDate,
        remaining,
        `"${statusInfo.label}"`,
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ];
    });

    // Baris Total Ringkasan pada CSV
    rows.push([
      '"TOTAL"',
      '""',
      '""',
      `"Total ${transactions.length} Transaksi"`,
      sumUnits,
      '""',
      sumRevenue,
      '""',
      sumCost,
      sumProfit,
      '""',
      '""',
      '""',
      '""',
      '""'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pencatatan_Penjualan_Akun_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ==========================================================================
     Simulasi Modal & Proyeksi Keuntungan
     ========================================================================== */
  function initSimulator() {
    populateSimulatorPackages();
    calculateSimulation();
  }

  function populateSimulatorPackages() {
    if (!elements.simPackageStrategy) return;
    
    const previousVal = elements.simPackageStrategy.value || 'OPTIMAL';
    
    elements.simPackageStrategy.innerHTML = `
      <option value="OPTIMAL">⭐ Rekomendasi Profit Tertinggi (Optimal ROI)</option>
      <option value="MIXED">🎯 Campuran Paket Populer (Diversifikasi)</option>
    `;

    packages.forEach(pkg => {
      const margin = pkg.costPrice > 0 ? (((pkg.sellPrice - pkg.costPrice) / pkg.costPrice) * 100).toFixed(0) : 0;
      const opt = document.createElement('option');
      opt.value = pkg.id;
      opt.textContent = `📦 ${pkg.name} (Modal: ${formatRupiah(pkg.costPrice)}, Jual: ${formatRupiah(pkg.sellPrice)} | Margin: +${margin}%)`;
      elements.simPackageStrategy.appendChild(opt);
    });

    if (Array.from(elements.simPackageStrategy.options).some(o => o.value === previousVal)) {
      elements.simPackageStrategy.value = previousVal;
    } else {
      elements.simPackageStrategy.value = 'OPTIMAL';
    }
  }

  function calculateSimulation() {
    if (!elements.inputCapitalAmount || !elements.simPackageStrategy) return;

    const capital = Math.max(0, Number(elements.inputCapitalAmount.value) || 0);
    const strategy = elements.simPackageStrategy.value;

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalUnits = 0;
    let usedCapital = 0;
    let remainingCapital = capital;
    let breakdownList = [];
    let noteText = '';

    if (capital <= 0 || packages.length === 0) {
      updateSimulatorUI({
        totalRevenue: 0,
        totalProfit: 0,
        roi: 0,
        totalUnits: 0,
        usedCapital: 0,
        remainingCapital: capital,
        breakdownList: [],
        noteText: 'Silakan masukkan jumlah modal Anda di atas untuk melihat proyeksi keuntungan dan omzet.'
      });
      return;
    }

    if (strategy === 'OPTIMAL') {
      const sorted = [...packages].sort((a, b) => {
        const marginA = (a.sellPrice - a.costPrice) / Math.max(1, a.costPrice);
        const marginB = (b.sellPrice - b.costPrice) / Math.max(1, b.costPrice);
        return marginB - marginA;
      });

      const bestPkg = sorted[0];
      const marginPct = (((bestPkg.sellPrice - bestPkg.costPrice) / bestPkg.costPrice) * 100).toFixed(0);
      const qty = Math.floor(capital / bestPkg.costPrice);

      if (qty > 0) {
        usedCapital = qty * bestPkg.costPrice;
        remainingCapital = capital - usedCapital;
        totalRevenue = qty * bestPkg.sellPrice;
        totalProfit = totalRevenue - usedCapital;
        totalUnits = qty;

        breakdownList.push({
          pkg: bestPkg,
          qty,
          subCost: usedCapital,
          subRevenue: totalRevenue,
          subProfit: totalProfit,
          marginPct
        });

        noteText = `⭐ Strategi Optimal: Seluruh modal dialokasikan untuk kulakan "${bestPkg.name}" yang memiliki margin laba tertinggi di katalog Anda (+${marginPct}%).`;
      } else {
        noteText = `Modal Rp ${capital.toLocaleString('id-ID')} belum mencukupi untuk kulakan paket dengan profit tertinggi ("${bestPkg.name}" butuh modal minimal ${formatRupiah(bestPkg.costPrice)}).`;
      }

    } else if (strategy === 'MIXED') {
      const validPackages = packages.filter(p => p.costPrice <= capital);

      if (validPackages.length === 0) {
        noteText = `Modal Rp ${capital.toLocaleString('id-ID')} belum mencukupi untuk membeli 1 unit dari paket manapun. Modal termurah adalah ${formatRupiah(Math.min(...packages.map(p => p.costPrice)))}.`;
      } else {
        let tempCapital = capital;
        const sharePerPkg = Math.floor(capital / validPackages.length);

        validPackages.forEach(pkg => {
          let qty = Math.floor(sharePerPkg / pkg.costPrice);
          if (qty > 0) {
            const cost = qty * pkg.costPrice;
            tempCapital -= cost;
            const rev = qty * pkg.sellPrice;
            const prof = rev - cost;
            const marginPct = (((pkg.sellPrice - pkg.costPrice) / pkg.costPrice) * 100).toFixed(0);

            usedCapital += cost;
            totalRevenue += rev;
            totalProfit += prof;
            totalUnits += qty;

            breakdownList.push({
              pkg,
              qty,
              subCost: cost,
              subRevenue: rev,
              subProfit: prof,
              marginPct
            });
          }
        });

        const cheapest = [...validPackages].sort((a, b) => a.costPrice - b.costPrice)[0];
        if (tempCapital >= cheapest.costPrice) {
          const extraQty = Math.floor(tempCapital / cheapest.costPrice);
          const extraCost = extraQty * cheapest.costPrice;
          const extraRev = extraQty * cheapest.sellPrice;
          const extraProf = extraRev - extraCost;

          usedCapital += extraCost;
          totalRevenue += extraRev;
          totalProfit += extraProf;
          totalUnits += extraQty;

          const existing = breakdownList.find(b => b.pkg.id === cheapest.id);
          if (existing) {
            existing.qty += extraQty;
            existing.subCost += extraCost;
            existing.subRevenue += extraRev;
            existing.subProfit += extraProf;
          } else {
            breakdownList.push({
              pkg: cheapest,
              qty: extraQty,
              subCost: extraCost,
              subRevenue: extraRev,
              subProfit: extraProf,
              marginPct: (((cheapest.sellPrice - cheapest.costPrice) / cheapest.costPrice) * 100).toFixed(0)
            });
          }
        }

        remainingCapital = capital - usedCapital;
        noteText = `🎯 Strategi Campuran: Modal Anda disebarkan ke ${breakdownList.length} jenis paket berbeda agar variasi produk lebih lengkap dan risiko minim.`;
      }

    } else {
      const selectedPkg = packages.find(p => p.id === strategy);
      if (selectedPkg) {
        const qty = Math.floor(capital / selectedPkg.costPrice);
        const marginPct = (((selectedPkg.sellPrice - selectedPkg.costPrice) / selectedPkg.costPrice) * 100).toFixed(0);

        if (qty > 0) {
          usedCapital = qty * selectedPkg.costPrice;
          remainingCapital = capital - usedCapital;
          totalRevenue = qty * selectedPkg.sellPrice;
          totalProfit = totalRevenue - usedCapital;
          totalUnits = qty;

          breakdownList.push({
            pkg: selectedPkg,
            qty,
            subCost: usedCapital,
            subRevenue: totalRevenue,
            subProfit: totalProfit,
            marginPct
          });

          noteText = `Simulasi khusus untuk modal pengadaan akun "${selectedPkg.name}". Anda dapat kulakan ${qty} akun dengan modal ${formatRupiah(usedCapital)}.`;
        } else {
          noteText = `Modal Rp ${capital.toLocaleString('id-ID')} belum mencukupi untuk kulakan paket "${selectedPkg.name}" (Modal per akun: ${formatRupiah(selectedPkg.costPrice)}).`;
        }
      }
    }

    const roi = usedCapital > 0 ? ((totalProfit / usedCapital) * 100) : 0;

    updateSimulatorUI({
      totalRevenue,
      totalProfit,
      roi,
      totalUnits,
      usedCapital,
      remainingCapital,
      breakdownList,
      noteText
    });
  }

  function updateSimulatorUI(res) {
    if (elements.simResultRevenue) elements.simResultRevenue.textContent = formatRupiah(res.totalRevenue);
    if (elements.simResultProfit) elements.simResultProfit.textContent = formatRupiah(res.totalProfit);
    if (elements.simResultROI) elements.simResultROI.textContent = `+${res.roi.toFixed(1)}%`;
    if (elements.simResultUnits) elements.simResultUnits.textContent = `${res.totalUnits} Akun`;

    if (elements.simUsedCapital) elements.simUsedCapital.textContent = formatRupiah(res.usedCapital);
    if (elements.simRemainingCapital) elements.simRemainingCapital.textContent = formatRupiah(res.remainingCapital);

    const totalCap = res.usedCapital + res.remainingCapital;
    const pct = totalCap > 0 ? (res.usedCapital / totalCap) * 100 : 0;
    if (elements.simProgressBar) elements.simProgressBar.style.width = `${pct}%`;

    if (elements.simStrategyNote) elements.simStrategyNote.textContent = res.noteText;

    if (elements.simBreakdownBody) {
      if (res.breakdownList.length === 0) {
        elements.simBreakdownBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; color: var(--color-text-muted); padding: 24px;">
              Tidak ada paket yang terbeli dengan modal ini. Silakan tingkatkan nominal modal di atas.
            </td>
          </tr>
        `;
      } else {
        elements.simBreakdownBody.innerHTML = res.breakdownList.map(item => `
          <tr>
            <td>
              <strong>${escapeHTML(item.pkg.name)}</strong>
              <div style="font-size:0.75rem;color:var(--color-text-muted);">${escapeHTML(item.pkg.category || 'Streaming')} &bull; ${item.pkg.durationDays} Hari</div>
            </td>
            <td>${formatRupiah(item.pkg.costPrice)}</td>
            <td>${formatRupiah(item.pkg.sellPrice)}</td>
            <td style="color:var(--color-primary);font-weight:700;">+ ${formatRupiah(item.pkg.sellPrice - item.pkg.costPrice)}</td>
            <td><span class="status-pill badge-active">+${item.marginPct}%</span></td>
            <td style="font-weight:800;font-size:1rem;color:var(--color-blue);">${item.qty} Akun</td>
            <td>${formatRupiah(item.subCost)}</td>
            <td style="color:#10b981;font-weight:700;">+ ${formatRupiah(item.subRevenue)}</td>
            <td style="color:var(--color-primary);font-weight:900;">+ ${formatRupiah(item.subProfit)}</td>
          </tr>
        `).join('');
      }
    }
  }

  /* ==========================================================================
     Event Listeners & Modal Controls
     ========================================================================== */
  function setupEventListeners() {
    // Simulator events
    if (elements.inputCapitalAmount) {
      elements.inputCapitalAmount.addEventListener('input', () => {
        // sync preset chips
        const val = Number(elements.inputCapitalAmount.value);
        if (elements.simPresetChips) {
          elements.simPresetChips.querySelectorAll('.preset-chip').forEach(c => {
            if (Number(c.dataset.amount) === val) {
              c.classList.add('active');
            } else {
              c.classList.remove('active');
            }
          });
        }
        calculateSimulation();
      });
    }

    if (elements.simPackageStrategy) {
      elements.simPackageStrategy.addEventListener('change', calculateSimulation);
    }

    if (elements.simPresetChips) {
      elements.simPresetChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.preset-chip');
        if (!chip) return;
        elements.simPresetChips.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (elements.inputCapitalAmount) {
          elements.inputCapitalAmount.value = chip.dataset.amount;
        }
        calculateSimulation();
      });
    }
    // Open Modals
    elements.btnOpenAddTransaction.addEventListener('click', openAddTransactionModal);
    elements.btnOpenManagePackages.addEventListener('click', openPackagesModal);
    elements.btnOpenSheetsGuide.addEventListener('click', () => {
      elements.modalSheetsGuide.style.display = 'flex';
    });

    // Close Modals
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    });

    // Forms
    elements.formTransaction.addEventListener('submit', handleSaveTransaction);
    elements.formPackage.addEventListener('submit', handleSavePackage);
    elements.btnCancelPkgEdit.addEventListener('click', resetPackageForm);

    // Interactive form events
    elements.inputPackage.addEventListener('change', handlePackageSelectionChange);
    elements.inputPurchaseDate.addEventListener('change', handlePackageSelectionChange);
    if (elements.inputQty) elements.inputQty.addEventListener('input', updateProfitPreview);
    if (elements.btnQtyMinus) {
      elements.btnQtyMinus.addEventListener('click', () => {
        const cur = Math.max(1, (Number(elements.inputQty.value) || 1) - 1);
        elements.inputQty.value = cur;
        updateProfitPreview();
      });
    }
    if (elements.btnQtyPlus) {
      elements.btnQtyPlus.addEventListener('click', () => {
        const cur = Math.max(1, (Number(elements.inputQty.value) || 1) + 1);
        elements.inputQty.value = cur;
        updateProfitPreview();
      });
    }
    elements.inputSellPrice.addEventListener('input', updateProfitPreview);
    elements.inputCostPrice.addEventListener('input', updateProfitPreview);

    // Search & Filter
    elements.searchInput.addEventListener('input', (e) => {
      activeFilters.search = e.target.value.trim();
      elements.btnClearSearch.style.display = activeFilters.search ? 'block' : 'none';
      renderTransactionsTable();
    });

    elements.btnClearSearch.addEventListener('click', () => {
      elements.searchInput.value = '';
      activeFilters.search = '';
      elements.btnClearSearch.style.display = 'none';
      renderTransactionsTable();
    });

    elements.statusFilter.addEventListener('change', (e) => {
      activeFilters.status = e.target.value;
      renderTransactionsTable();
    });

    elements.packageFilter.addEventListener('change', (e) => {
      activeFilters.packageId = e.target.value;
      renderTransactionsTable();
    });

    elements.btnFilterUrgent.addEventListener('click', () => {
      elements.statusFilter.value = 'WARNING';
      activeFilters.status = 'WARNING';
      renderTransactionsTable();
      elements.statusFilter.scrollIntoView({ behavior: 'smooth' });
    });

    elements.btnResetFilters.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.statusFilter.value = 'ALL';
      elements.packageFilter.value = 'ALL';
      activeFilters.search = '';
      activeFilters.status = 'ALL';
      activeFilters.packageId = 'ALL';
      elements.btnClearSearch.style.display = 'none';
      renderTransactionsTable();
    });

    // Toolbar buttons
    elements.btnExportCSV.addEventListener('click', exportToCSV);
    elements.btnResetSampleData.addEventListener('click', () => {
      if (confirm('Muat ulang data contoh awal? Catatan yang baru saja Anda buat akan direset.')) {
        localStorage.removeItem(STORAGE_KEYS.PACKAGES);
        localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
        initApp();
      }
    });

    // Keyboard ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });
  }

  function closeAllModals() {
    elements.modalTransaction.style.display = 'none';
    elements.modalPackages.style.display = 'none';
    elements.modalSheetsGuide.style.display = 'none';
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Ekspos fungsi global untuk aksi di baris tabel
  window.SubTrackApp = {
    editTransaction,
    deleteTransaction,
    quickRenew,
    editPackage,
    deletePackage
  };

  // Jalankan aplikasi saat DOM siap
  document.addEventListener('DOMContentLoaded', initApp);
})();
