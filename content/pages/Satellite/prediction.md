Title: Pass Predictor
Slug: pass-predictor
Author: Matt, M5MAT
Comments: true



<div class="form-group">
  <label for="sat">Select Satellite(s)</label>
  <select class="form-control" id="sat" onChange="updatePrediction()" multiple>
  </select>
</div>
<div class="form-group">
  <button class="btn" onclick="selectSats(fmSats)">FM Sats</button>
  <button class="btn" onclick="selectSats(linearSats)">Linear Sats</button>
  <button class="btn" onclick="selectSats(digitalSats)">Digital Sats</button>
</div>
*All times in UTC*
*AOS and LOS may be reversed!*
<table id="pass-table" class="table">
  <thead>
    <tr>
      <th>Satellite</th>
      <th>AOS</th>
      <th>LOS</th>
      <th>Duration</th>
      <th>Ele</th>
    </tr>
  </thead>
  <tbody>

  </tbody>
</table>

<script src="\media\node_modules\jspredict\satellite.js"></script>
<script src="\media\node_modules\jspredict\jspredict.js"></script>
<script src="\media\node_modules\moment\moment.js"></script>

<script>
  var timeDisplayFormat = "ddd, HH:mm:ss";

  // Set the Observer lat 51.9, lng -2.1, alt 100m
  var qth = [51.9166666667, -2.0833333333, 1];

  var fmSats = ["SAUDISAT 1C (SO-50)", "FOX-1D (AO-92)", "RADFXSAT (FOX-1B)", "DUCHIFAT-3"];
  var linearSats = ["NAYIF-1 (EO-88)", "OSCAR 7 (AO-7)", "JAS-2 (FO-29)", "FUNCUBE-1 (AO-73)", "XW-2A", "XW-2B", "XW-2F", "NUSAT-1 (FRESCO)", "JY1SAT (JO-97)"];
  var digitalSats = ["PCSAT (NO-44)", "LAPAN-A2", "BRICSAT2 (NO-103)", "PSAT2 (NO-104)", "ISS (ZARYA)"];

  // Load TLEs
  var tle = {};
  var sat_names = [];

  $.get("/media/tle/amateur.txt", function(txt) {
    var lines = txt.split("\n");

    for (var i = 0, len = lines.length; i < len; i=i+3) {
      sat_names.push(lines[i].trim());
      tle[lines[i].trim()] = [lines[i+1], lines[i+2]];
    }

    sat_names.sort();

    $.each(sat_names, function(index, value) {
      $('#sat').append("<option value=\"" + value + "\">" + value + "</option>")
    });

    console.log(tle);
  }).done(function() {
    updatePrediction();
  });

  function updatePrediction() {
    $("#pass-table > tbody tr").remove();
    var allPasses = [];

    $.each($('#sat').children("option:selected"), function(index, element) {
      var sat = element.value;
      console.log("Processing " + sat);

      var sat_tle = sat + "\n" + tle[sat][0] + "\n" + tle[sat][1];

      var passes = jspredict.transits(sat_tle, qth, moment(), moment().add(1, 'days'), 10, 10);

      $.each(passes, function(index, pass) {
        pass.satellite = sat;
        allPasses.push(pass);
      });
    });

    allPasses.sort(compare);

    console.log(allPasses);

    $.each(allPasses, function(index, element) {
      $('#pass-table > tbody:last-child').append(
        "<tr><td>" + element.satellite + "</td>" +
        "<td>" + moment.utc(element.start).format(timeDisplayFormat) + "<p class=\"font-weight-light\">AZ: " + element.minAzimuth.toFixed(0) + "&deg;</p></td>" +
        "<td>" + moment.utc(element.end).format(timeDisplayFormat) + "<p class=\"font-weight-light\">AZ: " + element.maxAzimuth.toFixed(0) + "&deg;</p></td>" +
        "<td>" + (element.duration/60000).toFixed(0) + " mins</td>" +
        "<td>" + element.maxElevation.toFixed(1) + "&deg;</td>" +
        "</tr>")
    });
  }

  function selectSats(satArr) {
    // Unselect all previously selected elements
    $.each($('#sat').children("option:selected"), function(index, element) {
      element.selected = false;
    });

    // Select all elements in satArr
    $.each(satArr, function(index, element) {
      $('#sat option[value=\'' + element + '\']').attr('selected', true);
    });

    // Update the prediction table
    updatePrediction();
  }

  function compare( a, b ) {
    if ( a.start < b.start ){
      return -1;
    }
    if ( a.start > b.start ){
      return 1;
    }
    return 0;
  }

</script>
