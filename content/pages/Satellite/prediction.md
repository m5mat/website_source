Title: Pass Predictor
Slug: pass-predictor
Author: Matt, M5MAT
Comments: true


<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<div class="form-row">
  <div class="col">
    <label for="locator">Locator</label>
    <input type="text" class="form-control" id="locator" onChange="updatePrediction()" value="IO81xw" />
  </div>
  <div class="col">
    <label for="ele">Minimum Elevation (&deg;)</label>
    <input type="text" class="form-control" id="ele" onChange="updatePrediction()" value="10" />
  </div>
  <div class="col">
    <label for="tz">Time Zone</label>
    <select class="form-control" id="tz" onChange="updatePrediction()">
    </select>
  </div>
</div>

<div class="form-group">
  <label for="sat">Satellite(s)</label>
  <select class="form-control" id="sat" onChange="updatePrediction()" multiple>
  </select>
  <span class="font-weight-light">Ctrl+Click to select multiple satellites or select a group below</span>
</div>
<div class="form-group">
  <button class="btn" onclick="selectSats(fmSats)">FM Sats</button>
  <button class="btn" onclick="selectSats(linearSats)">Linear Sats</button>
  <button class="btn" onclick="selectSats(digitalSats)">Digital Sats</button>
</div>

<ul class="nav nav-tabs justify-content-end" id="myTab" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="list-tab" data-toggle="tab" href="#list" role="tab" aria-controls="list" aria-selected="true"><i class="fas fa-list"></i></a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="timetable-tab" data-toggle="tab" href="#timetable" role="tab" aria-controls="timetable" aria-selected="false"><i class="fas fa-th"></i></a>
  </li>
</ul>

<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="list" role="tabpanel" aria-labelledby="list-tab">
    <i>All times in <span id="timezone-indicator">UTC</span></i>
    <table id="pass-table" class="table">
      <thead>
        <tr>
          <th>Satellite</th>
          <th>AOS</th>
          <th>LOS</th>
          <th>Duration</th>
          <th>Ele</th>
          <th></th>
        </tr>
      </thead>
      <tbody>

      </tbody>
    </table>
  </div>
  <div class="tab-pane fade" id="timetable" role="tabpanel" aria-labelledby="timetable-tab">
    <div class="timetable"></div>
  </div>
</div>

<div class="modal" id="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div id="polar-plot" style="width: 100%;"></div>
      </div>
    </div>
  </div>
</div>

<script src="/media/node_modules/jspredict/satellite.js"></script>
<script src="/media/node_modules/jspredict/jspredict.js"></script>
<script src="/media/node_modules/moment/moment.js"></script>
<script src="/media/node_modules/moment-timezone/builds/moment-timezone-with-data-10-year-range.min.js"></script>
<script src="/media/js/HamGridSquare.js"></script>
<script src="/media/js/FileSaver.min.js"></script>
<script src="/media/js/Blob.js"></script>
<script src="/media/js/ics.js"></script>
<script src="/media/js/timetable.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js"></script>

<script>
  var timeDisplayFormat = "ddd, HH:mm:ss";

  if(typeof Cookies.get('locator') !== "undefined") {
    $('#locator').val(Cookies.get('locator'));
  }

  if(typeof Cookies.get('minElevation') !== "undefined") {
    $('#ele').val(Cookies.get('minElevation'));
  }

  // Load TZ names
  $.each(moment.tz.names(), function(index, name) {
      var selected = "";
      if (name == Cookies.get('tz') || ( typeof Cookies.get('tz') === "undefined" && name == moment.tz.guess() ) ) {
        selected = " selected";
      }
      $('#tz').append("<option value=\"" + name + "\" " + selected + ">" + name + "</option>")
  });


  // Set the QTH
  var qth = [HamGridSquare.toLatLon($('#locator').val())[0], HamGridSquare.toLatLon($('#locator').val())[1], 1];

  // Set up satellite groups
  var fmSats = ["SAUDISAT 1C (SO-50)", "FOX-1D (AO-92)", "RADFXSAT (FOX-1B)", "DUCHIFAT-3"];
  var linearSats = ["NAYIF-1 (EO-88)", "OSCAR 7 (AO-7)", "JAS-2 (FO-29)", "FUNCUBE-1 (AO-73)", "XW-2A", "XW-2B", "XW-2F", "NUSAT-1 (FRESCO)", "JY1SAT (JO-97)"];
  var digitalSats = ["PCSAT (NO-44)", "LAPAN-A2", "BRICSAT2 (NO-103)", "PSAT2 (NO-104)", "ISS (ZARYA)"];

  // Load TLEs
  var tle = {};
  var sat_names = [];

  // Initialise the timetable view
  var timetable = new Timetable();
  timetable.setScope(0, 23); // optional, only whole hours between 0 and 23

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
    var locator = $('#locator').val();
    var minElevation = $('#ele').val();
    var tz = $('#tz').children("option:selected").val();

    Cookies.set('locator', locator);
    Cookies.set('minElevation', minElevation);
    Cookies.set('tz', tz);

    $('#timezone-indicator').html(tz);

    qth = [HamGridSquare.toLatLon(locator)[0], HamGridSquare.toLatLon(locator)[1], 1];

    // Clear out any old data
    $("#pass-table > tbody tr").remove();
    var allPasses = [];
    timetable.locations = [];
    timetable.events = [];

    $.each($('#sat').children("option:selected"), function(index, element) {
      var sat = element.value;
      console.log("Processing " + sat);

      timetable.addLocations([sat]);

      var sat_tle = sat + "\n" + tle[sat][0] + "\n" + tle[sat][1];

      var passes = jspredict.transits(sat_tle, qth, moment(), moment().add(1, 'days'), minElevation, 10);

      $.each(passes, function(index, pass) {
        pass.satellite = sat;
        pass.aos = jspredict.observe(sat_tle, qth, pass.start);
        pass.los = jspredict.observe(sat_tle, qth, pass.end);
        allPasses.push(pass);
        console.log(pass);
        timetable.addEvent(
          null,
          sat,
          new Date(pass.start),
          new Date(pass.end)
        );
        console.log(timetable);
      });
    });

    allPasses.sort(compare);

    console.log(allPasses);

    $.each(allPasses, function(index, element) {
      var calTitle = element.satellite;
      var calDescription = "AZ: " + element.aos.azimuth.toFixed(0) + "&deg; -> " + element.los.azimuth.toFixed(0) + "&deg;, EL: " + element.maxElevation.toFixed(1) + "&deg;";
      var calStart = moment.utc(element.start).format();
      var calEnd = moment.utc(element.end).format();

      $('#pass-table > tbody:last-child').append(
        "<tr><td>" + element.satellite + "</td>" +
        "<td>" + moment.utc(element.start).tz(tz).format(timeDisplayFormat) + "<p class=\"font-weight-light\">AZ: " + element.aos.azimuth.toFixed(0) + "&deg;</p></td>" +
        "<td>" + moment.utc(element.end).tz(tz).format(timeDisplayFormat) + "<p class=\"font-weight-light\">AZ: " + element.los.azimuth.toFixed(0) + "&deg;</p></td>" +
        "<td>" + (element.duration/60000).toFixed(0) + " mins</td>" +
        "<td>" + element.maxElevation.toFixed(1) + "&deg;</td>" +
        "<td><a href='javascript:downloadIcal(\"" + calTitle + "\", \"" + calDescription + "\", \"" + locator + "\", \"" + calStart + "\", \"" + calEnd + "\")'><i class='far fa-calendar-plus'></i></a>&nbsp;" +
        "<a href='javascript:polarPlot([[" + element.aos.azimuth + ",0,\"AOS\"],[" + element.apexAzimuth + "," + element.maxElevation + ",\"TCA\"],[" + element.los.azimuth + ",0,\"LOS\"]])'><i class='fas fa-globe'></i></a>" +
        "</td>" +
        "</tr>")
    });

    // Render the timetable
    var renderer = new Timetable.Renderer(timetable);
    renderer.draw('.timetable'); // any css selector
  }

  function selectSats(satArr) {
    // Unselect all previously selected elements
    $('#sat').children("option:selected").removeAttr('selected');

    // Select all elements in satArr
    $.each(satArr, function(index, element) {
      $('#sat option[value=\'' + element + '\']').attr('selected', true);
    });

    // Update the prediction table
    updatePrediction();
  }

  function downloadIcal(subject, description, location, begin, end) {
    console.log("Generating ics");
    var cal = ics();
    cal.addEvent(subject, description, location, begin, end);
    console.log(cal);
    cal.download(subject + "-" + begin);
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

  function polarPlot(plotData) {
    var data = [
      {
        type: "scatterpolar",
        mode: "lines+text",
        r: [],
        theta: [],
        text: [],
        textposition: [],
        textfont: {
          size: 20
        },
        line: {
          color: "#ff66ab"
        },
        marker: {
          color: "#8090c7",
          symbol: "square",
          size: 8
        },
        subplot: "polar"
      }
    ];

    $.each(plotData, function(index, element) {
        data[0].text.push(element[2]);
        data[0].r.push(element[1]);
        data[0].theta.push(element[0]);
        if ( element[0] < 90 ) {
          data[0].textposition.push("top right");
        } else if (element[0] < 180) {
          data[0].textposition.push("bottom right");
        } else if (element[0] < 270) {
          data[0].textposition.push("bottom left");
        } else {
          data[0].textposition.push("top left");
        }
    });

    var layout = {
      showlegend: false,
      height: 600,
      polar: {
        domain: {
          x: [0,0],
          y: [0,0]
        },
        radialaxis: {
          visible: false,
          rangemode: "tozero",
          range: [90, 0]
        },
        angularaxis: {
          tickfont: {
            size: 16
          },
          direction: "clockwise"
        }
      }
    }

    $('#modal').modal('show');
    console.log(Plotly.newPlot('polar-plot', data, layout));

  }

</script>
