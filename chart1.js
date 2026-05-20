
const chart1 = document.getElementById('chart1').getContext('2d');
new Chart(chart1, {
  type: 'line',
  data: {
    labels: ['2021','2022','2023','2024','2025'],
    datasets: [
      {
        label: 'Analyses',
        data: [12, 18, 14, 22, 25],
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13,110,253,0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Scanners',
        data: [8, 12, 10, 16, 17],
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220,53,69,0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Rendez‑vous',
        data: [15, 13, 17, 20, 19],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40,167,69,0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Évolution des Activités Médicales (2021–2025)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Nombre d’activités' }
      },
      x: {
        title: { display: true, text: 'Années' }
      }
    }
  }
});
