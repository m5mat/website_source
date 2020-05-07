title: HF Magnetic Loop Antenna
description: >
    A copy of G4IZH's magnetic loop antenna.
date: 2019-04-11 23:00:00
links:
    description:  http://www.g4izh.co.uk/indoor-mag-loop-for-hf.html
phase: completed

<table>
  <tr>
    <td>
      <form action="javascript:calculate()">
        <label for="frequency">Frequency (MHz) <input type="text" name="frequency" id="frequency"></input></label><br />
        <label for="frequency">Loop Area (m²) <input type="text" name="area" id="area"></input></label><br />
        <label for="frequency">Loop Length (m) <input type="text" name="length" id="length"></input></label><br />
        <label for="frequency">Conductor Diameter (mm) <input type="text" name="diameter" id="diameter"></input></label><br />
        <label for="frequency">Power (Watts) <input type="text" name="power" id="power"></input></label><br />
        <input type="submit" />
      </form>
    </td>
    <td>
      <div class="results">
        Radiation Resistance (mΩ) = <span id="radiation_resistance"></span><br />
        Loss Resistance (mΩ) = <span id="loss_resistance"></span><br />
        Efficiency (%) = <span id="efficiency"></span><br />
        Inductance (μH) = <span id="inductance"></span><br />
        Inductive Reactance (Ω) = <span id="inductive_reactance"></span><br />
        Tuning Capacitor (pF) = <span id="tuning_capacitor"></span><br />
        Q Factor = <span id="q_factor"></span><br />
        Bandwidth (Hz) = <span id="bandwidth"></span><br />
        Distributed Capacitance (pF) = <span id="distributed_capacity"></span><br />
        Capacitor Potential (V) = <span id="capacitor_potential"></span><br />
        Minimum Plate Spacing (mm) = <span id="minimum_plate_spacing"></span>
      </div>
    </td>
  </tr>
</table>

<hr />

<table>
  <tr>
    <td>
      <form action="javascript:sweep()">
        <label for="frequency">Start Frequency (MHz) <input type="text" name="sweep_start_frequency" id="sweep_start_frequency"></input></label><br />
        <label for="frequency">End Frequency (MHz) <input type="text" name="sweep_end_frequency" id="sweep_end_frequency"></input></label><br />
        <label for="frequency">Step Size (MHz) <input type="text" name="sweep_step_size" id="sweep_step_size"></input></label><br />
        <label for="frequency">Loop Area (m²) <input type="text" name="sweep_area" id="sweep_area"></input></label><br />
        <label for="frequency">Loop Length (m) <input type="text" name="sweep_length" id="sweep_length"></input></label><br />
        <label for="frequency">Conductor Diameter (mm) <input type="text" name="sweep_diameter" id="sweep_diameter"></input></label><br />
        <label for="frequency">Power (Watts) <input type="text" name="sweep_power" id="sweep_power"></input></label><br />
        <input type="submit" />
      </form>
    </td>
    <td>
      Minimum Plate Spacing (mm) = <span id="sweep_minimum_plate_spacing"></span>
    </td>
  </tr>
</table>

<div style="width:100%;">
  <canvas id="q_chart_canvas"></canvas>
  <canvas id="capacitor_chart_canvas"></canvas>
</div>

<script src="/media/js/calculators/small-transmitting-loop.js"></script>
<script src="/media/js/chart.min.js"></script>
<script>
  // Q chart
  var q_chart_config = {
    data: {
      labels: [],
      datasets: [{
        label: 'Q Factor',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
        yAxisID: 'y-axis-1',
        fill: false,
      },{
        label: 'Efficiency',
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        data: [],
        yAxisID: 'y-axis-2',
        fill: false,
      }]
    },
    options: {
      scales: {
						yAxes: [{
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'left',
							id: 'y-axis-1',
						}, {
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'right',
							id: 'y-axis-2',

							// grid line settings
							gridLines: {
								drawOnChartArea: false, // only want the grid lines for one axis to show up
							},
						}],
					}
    }
  };

  // Capacitor chart
  var capacitor_chart_config = {
    data: {
      labels: [],
      datasets: [{
        label: 'Tuning Capacitor Value (pF)',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
        yAxisID: 'y-axis-1',
        fill: false,
      },{
        label: 'Tuning Capacitor Potential (V)',
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        data: [],
        yAxisID: 'y-axis-2',
        fill: false,
      }]
    },
    options: {
      scales: {
						yAxes: [{
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'left',
							id: 'y-axis-1',
						}, {
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'right',
							id: 'y-axis-2',

							// grid line settings
							gridLines: {
								drawOnChartArea: false, // only want the grid lines for one axis to show up
							},
						}],
					}
    }
  };

  function calculate() {
    result = calculateSTL(document.getElementById("frequency").value, document.getElementById("area").value, document.getElementById("length").value, document.getElementById("diameter").value, document.getElementById("power").value);
    document.getElementById("radiation_resistance").innerHTML = (result.radiation_resistance * 1e3).toFixed(2);
    document.getElementById("loss_resistance").innerHTML = (result.loss_resistance * 1e3).toFixed(2);
    document.getElementById("efficiency").innerHTML = (result.efficiency * 100).toFixed(2);
    document.getElementById("inductance").innerHTML = (result.inductance_H * 1e6).toFixed(2);
    document.getElementById("inductive_reactance").innerHTML = result.inductive_reactance_ohms.toFixed(2);
    document.getElementById("tuning_capacitor").innerHTML = (result.tuning_capacitor_F * 1e12).toFixed(3);
    document.getElementById("q_factor").innerHTML = result.q_factor.toFixed(1);
    document.getElementById("bandwidth").innerHTML = Math.round(result.bandwidth_hz);
    document.getElementById("distributed_capacity").innerHTML = (result.distributed_capacity_pF).toFixed(3);
    document.getElementById("capacitor_potential").innerHTML = Math.round(result.capacitor_potential_V);
    document.getElementById("minimum_plate_spacing").innerHTML = (result.minimum_plate_spacing_mm).toFixed(1);
  }

  function sweep() {
    result = STLSweep(
                parseFloat(document.getElementById("sweep_start_frequency").value),
                parseFloat(document.getElementById("sweep_end_frequency").value),
                parseFloat(document.getElementById("sweep_step_size").value),
                parseFloat(document.getElementById("sweep_area").value),
                parseFloat(document.getElementById("sweep_length").value),
                parseFloat(document.getElementById("sweep_diameter").value),
                parseFloat(document.getElementById("sweep_power").value)
              );
    q_chart_config.data.labels = [];
    q_chart_config.data.datasets[0].data = [];
    q_chart_config.data.datasets[1].data = [];

    capacitor_chart_config.data.labels = [];
    capacitor_chart_config.data.datasets[0].data = [];
    capacitor_chart_config.data.datasets[1].data = [];

    plateSpacing = 0;

    for ( var i = 0; i < result.length; i++ ) {
      console.log()
      q_chart_config.data.labels.push(result[i].frequency + "MHz");
      q_chart_config.data.datasets[0].data.push(result[i].q_factor);
      q_chart_config.data.datasets[1].data.push(result[i].efficiency * 100);

      capacitor_chart_config.data.labels.push(result[i].frequency + "MHz");
      capacitor_chart_config.data.datasets[0].data.push(result[i].tuning_capacitor_F*1e12);
      capacitor_chart_config.data.datasets[1].data.push(result[i].capacitor_potential_V);

      if ( parseFloat(result[i].minimum_plate_spacing_mm) > plateSpacing ) {
        plateSpacing = parseFloat(result[i].minimum_plate_spacing_mm);
      }
    }

    console.log(q_chart_config);

    var q_chart_ctx = document.getElementById('q_chart_canvas').getContext('2d');
    window.q_chart = new Chart.Line(q_chart_ctx, q_chart_config);
    window.q_chart.update();

    var capacitor_chart_ctx = document.getElementById('capacitor_chart_canvas').getContext('2d');
    window.capacitor_chart = new Chart.Line(capacitor_chart_ctx, capacitor_chart_config);
    window.capacitor_chart.update();

    document.getElementById("sweep_minimum_plate_spacing").innerHTML = Math.ceil(plateSpacing*10)/10;
  }

  calculateSTL(14.15, 0.5625, 3, 22, 20);
  var sweepResults = STLSweep(10, 30, 0.5, 0.5625, 3, 22, 20);
  console.log(sweepResults);
</script>
