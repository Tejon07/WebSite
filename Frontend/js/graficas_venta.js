document.addEventListener('DOMContentLoaded', function() {
  // Menú móvil
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  
  menuToggle.addEventListener('click', function() {
    sidebar.classList.toggle('active');
  });

  // Gráfico de ventas mensuales en Bs.
  const salesCtx = document.getElementById('salesChart').getContext('2d');
  const salesChart = new Chart(salesCtx, {
    type: 'bar',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: 'Ventas en Bolivianos',
        data: [18500, 19200, 20100, 21500, 22300, 23000, 24580, 24000, 22800, 23500, 24200, 25800],
        backgroundColor: 'rgba(115, 198, 182, 0.7)',
        borderColor: 'rgba(115, 198, 182, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Bs. ' + context.raw.toLocaleString('es-BO');
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'Bs. ' + value.toLocaleString('es-BO');
            }
          }
        }
      }
    }
  });

  // Gráfico de categorías en Bs.
  const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
  const categoriesChart = new Chart(categoriesCtx, {
    type: 'doughnut',
    data: {
      labels: ['Abrigos', 'Vestidos', 'Camisas', 'Pantalones', 'Chaquetas', 'Accesorios'],
      datasets: [{
        data: [8500, 7200, 5800, 4500, 3800, 2500],
        backgroundColor: [
          'rgba(115, 198, 182, 0.7)',
          'rgba(171, 235, 198, 0.7)',
          'rgba(90, 168, 149, 0.7)',
          'rgba(44, 62, 80, 0.7)',
          'rgba(149, 165, 166, 0.7)',
          'rgba(39, 174, 96, 0.7)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Bs. ' + context.raw.toLocaleString('es-BO');
            }
          }
        }
      },
      cutout: '70%'
    }
  });

  // Botones de período
  const periodBtns = document.querySelectorAll('.period-btn');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      periodBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Aquí podrías actualizar los gráficos según el período seleccionado
      // Por simplicidad, en este ejemplo no lo implementamos
    });
  });
});