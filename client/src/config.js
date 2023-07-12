module.exports={
  drawerWidth:240,
  navItems:['Home', 'About', 'Contact'],
  axis : [{id:1,value:'apl',axis:'last apl'},{id:2,value:'razi',axis:'last razi'},{id:3,value:'apl&razi',axis:'last apl + razi'},{id:4,value:'performance',axis:'last performance evaluation'}],
  chartConfig:{
    maintainAspectRatio: true,
    responsive: true,
    interaction: {
      mode: 'nearest'
    },
    plugins: {
      datalabels: {
        font: {
          size: 15,
          weight: 300
        },
        color: (context, args) => {
          return '#fff';
        }
      },
      legend: {
        display: false
      },
      title: {
        display: true
      },
      tooltip: {
        // filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
        callbacks: {
          label: (tooltipItems) => {
            return (tooltipItems.raw?.label+". " + tooltipItems.raw?.name?.can_nombre) || tooltipItems.raw?.label;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: false, text: '9 Box' },
        beginAtZero: true,
        min:0,
        max:101,
        grid: {
          display: false,
          drawOnChartArea:false,
          drawBorder:false,
          drawTicks:false,
          lineWidth:0,
          textStrokeWidth:0
        },
        ticks: {
          display: false
        },
        border:{
          display:false,
         },
      },
      y: {
        beginAtZero: true,
        title: { display: false, text: '9 Box' },
        min:0,
        max:102,
        grid: {
          display: false,
          drawOnChartArea:false,
          drawBorder:false,
          drawTicks:false,
          lineWidth:0,
          textStrokeWidth:0
        },
        border:{
         display:false,
        },
        ticks: {
          display: false
        }
      }
    }
  }
  
}