let productionData = [];
let targetProduction = 6000; // Default target bulanan
let chart;
let editingIndex = null;

// Fungsi untuk mengaktifkan input setelah memilih bulan
function enableInputs() {
  const monthSelect = document.getElementById('month').value;
  const targetInput = document.getElementById('target');
  const productionInput = document.getElementById('production');
  const addBtn = document.getElementById('add-btn');

  // Aktifkan input jika bulan dipilih
  if (monthSelect) {
    targetInput.disabled = false;
    productionInput.disabled = false;
    addBtn.disabled = false;
  } else {
    targetInput.disabled = true;
    productionInput.disabled = true;
    addBtn.disabled = true;
  }
}

// Fungsi untuk menambahkan data produksi yang diinputkan
function addProductionData() {
  const monthSelect = document.getElementById('month').value;
  const targetInput = document.getElementById('target').value;
  const productionInput = document.getElementById('production').value;

  if (monthSelect && targetInput && productionInput) {
    targetProduction = parseInt(targetInput);

    if (editingIndex === null) {
      // Menambahkan data baru
      const production = {
        month: monthSelect,
        actual: parseInt(productionInput)
      };
      productionData.push(production);
    } else {
      // Mengupdate data yang sedang diedit
      productionData[editingIndex].month = monthSelect;
      productionData[editingIndex].actual = parseInt(productionInput);
      editingIndex = null; // Reset editing
    }

    // Update grafik dan analisis
    updateChart();
    analyzePerformance();
    updateDataTable();

    // Mengosongkan form input setelah data ditambahkan
    document.getElementById('month').value = ''; // Reset bulan
    document.getElementById('production').value = '';

    // Menonaktifkan input setelah data ditambahkan
    document.getElementById('production').disabled = true;
    document.getElementById('add-btn').disabled = true;
  } else {
    alert("Harap masukkan semua data dengan benar.");
  }
}

// Fungsi untuk menghitung dan menganalisis pencapaian
function analyzePerformance() {
  let totalActual = productionData.reduce((acc, curr) => acc + curr.actual, 0);
  let totalTarget = targetProduction * productionData.length;
  let achievementPercentage = (totalActual / totalTarget) * 100;

  let analysisText = '';
  let warningText = '';
  let allAchieved = true;

  productionData.forEach(data => {
    if (data.actual < targetProduction) {
      warningText = 'Peringatan: Ada bulan yang pencapaiannya belum tercapai!';
      allAchieved = false;
    }
  });

  if (achievementPercentage >= 100) {
    analysisText = 'Target tercapai dengan baik!';
  } else if (achievementPercentage >= 80) {
    analysisText = 'Target hampir tercapai, perlu sedikit perbaikan.';
  } else {
    analysisText = 'Target tidak tercapai, perlu evaluasi lebih lanjut.';
  }

  document.getElementById('analysis').textContent = analysisText;

  // Menampilkan peringatan jika ada bulan yang tidak tercapai targetnya
  const warningElement = document.getElementById('warning');
  if (warningText) {
    warningElement.style.display = 'none'
  } else {
    warningElement.style.display = 'none';
  }
}

// Fungsi untuk mengupdate grafik
function updateChart() {
  const labels = productionData.map(item => item.month);
  const actualData = productionData.map(item => item.actual);
  const targetData = Array(productionData.length).fill(targetProduction);

  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById('chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Pencapaian Produksi',
          data: actualData,
          borderColor: '#00bcd4',
          fill: false,
          borderWidth: 2
        },
        {
          label: 'Target Produksi',
          data: targetData,
          borderColor: '#ff5722',
          fill: false,
          borderWidth: 2,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Fungsi untuk memperbarui tabel data produksi
function updateDataTable() {
  const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Clear the table body

  productionData.forEach((data, index) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${data.month}</td>
      <td>${data.actual}</td>
      <td>
        <button class="edit-btn" onclick="editData(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteData(${index})">Hapus</button>
      </td>
    `;
  });
}

// Fungsi untuk mengedit data produksi
function editData(index) {
  const data = productionData[index];
  document.getElementById('month').value = data.month;
  document.getElementById('production').value = data.actual;
  document.getElementById('target').value = targetProduction;
  editingIndex = index; // Set editing index

  // Aktifkan input setelah mengedit
  enableInputs();

  // Scroll ke bagian input
  document.getElementById('input-section').scrollIntoView({
    behavior: 'smooth', 
    block: 'start'
  });
}

// Fungsi untuk menghapus data produksi
function deleteData(index) {
  productionData.splice(index, 1); // Menghapus data berdasarkan index
  updateChart();
  analyzePerformance();
  updateDataTable();
}

// Inisialisasi grafik, analisis, dan tabel
updateChart();
analyzePerformance();
updateDataTable();
