function calculateSTL(frequency_MHz, loop_area_sq_m, length_m, diameter_mm, power_W) {
  var result = {};

  //result.radiation_resistance = 0.0000000338 * Math.pow((Math.pow(frequency_MHz, 2) * loop_area_sq_feet), 2);
  result.radiation_resistance = 0.0000000338 * Math.pow((Math.pow(frequency_MHz, 2) * 10.7639 * loop_area_sq_m), 2);
  result.loss_resistance = 0.000996 * Math.sqrt(frequency_MHz) * ((length_m*3.28084)/(diameter_mm/25.4));
  result.efficiency = result.radiation_resistance / (result.radiation_resistance + result.loss_resistance);
  result.inductance_H = 0.000000019 * (length_m*3.28084) * ( (7.353 * Math.log10( (96 * (length_m*3.28084)) / (Math.PI * (diameter_mm/25.4)) ) ) - 6.386 );
  result.inductive_reactance_ohms = 2 * Math.PI * frequency_MHz * (1000000 * result.inductance_H);
  result.tuning_capacitor_F = 1 / (2 * Math.PI * frequency_MHz * (1000000 * result.inductive_reactance_ohms));
  result.q_factor = result.inductive_reactance_ohms / ( 2 * (result.radiation_resistance + result.loss_resistance) );
  result.bandwidth_hz = (frequency_MHz * 1000000) / result.q_factor;
  result.distributed_capacity_pF = 0.82 * (length_m*3.28084);
  result.capacitor_potential_V = Math.sqrt(power_W * result.inductive_reactance_ohms * result.q_factor);
  result.minimum_plate_spacing_mm = result.capacitor_potential_V / 800;

  console.log(result);

  return result;
}

function STLSweep(start_frequency_MHz, end_frequency_MHz, step_size_MHz, loop_area_sq_feet, length_feet, diameter_inches, power_W) {
  var result = [];
  for ( var frequency_MHz = start_frequency_MHz; frequency_MHz <= end_frequency_MHz; frequency_MHz += step_size_MHz ) {
    thisResult = calculateSTL(frequency_MHz, loop_area_sq_feet, length_feet, diameter_inches, power_W);
    thisResult.frequency = frequency_MHz;
    result.push(thisResult);
  }
  return result;
}
