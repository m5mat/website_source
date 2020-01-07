Chart.pluginService.register({
  // This works to colour the backgournd
  beforeDraw: function (chart, easing) {

  if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
    var ctx = chart.chart.ctx;
    var chartArea = chart.chartArea;

    var meta = chart.getDatasetMeta(1);

    console.log("chart", chart);

    meta.data.forEach(function (element) {
      var start = element._model.x;
      var stop  = element._model.x + 10;

      ctx.save();
      ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
      console.log (chartArea);
      ctx.fillRect(start, chartArea.top, stop - start, chartArea.bottom - chartArea.top);
      ctx.restore();
    });

    console.log("run_periods", chart.config.options.run_periods);


    }
  }
});

/*
var ctx = document.getElementById("myLine").getContext('2d');

input = {

  type: 'line',
  data: {

    labels:  ['Jan','Feb','Mar','Apr','May'],
    datasets: [{
      data: [9,6,9,3,5,7],
      label: "Dataset 1",
      borderColor: "#3e95cd",
      fill: false
      }]
    },

    options: {
      responsive:true,
      animation : false,
      bezierCurve : true,
      chartArea: {
        backgroundColor: 'rgba(251, 85, 85, 0.4)'
      },

      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:false
            }
          }]
        },
    }
}

var myLine = new Chart(ctx, input);
*/
