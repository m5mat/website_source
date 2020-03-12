(function (L, d3, satelliteJs) {
  var RADIANS = Math.PI / 180;
  var DEGREES = 180 / Math.PI;
  var R_EARTH = 6378.137; // equatorial radius (km)

  /* =============================================== */
  /* =============== CLOCK ========================= */
  /* =============================================== */

  /**
   * Factory function for keeping track of elapsed time and rates.
   */
  function Clock() {
    this._rate = 0.001; // 1ms elapsed : 60sec simulated
    this._date = d3.now();
    this._elapsed = 0;
  };

  Clock.prototype.date = function (timeInMs) {
    if (!arguments.length) return this._date + (this._elapsed * this._rate);
    this._date = timeInMs;
    return this;
  };

  Clock.prototype.elapsed = function (ms) {
    if (!arguments.length) return this._date - d3.now(); // calculates elapsed
    this._elapsed = ms;
    return this;
  };

  Clock.prototype.rate = function (secondsPerMsElapsed) {
    if (!arguments.length) return this._rate;
    this._rate = secondsPerMsElapsed;
    return this;
  };

  /* ==================================================== */
  /* =============== CONVERSION ========================= */
  /* ==================================================== */

  function satrecToFeature(satrec, date, props) {
    var properties = props || {};
    var positionAndVelocity = satelliteJs.propagate(satrec, date);
    var gmst = satelliteJs.gstime(date);
    var positionGd = satelliteJs.eciToGeodetic(positionAndVelocity.position, gmst);
    properties.height = positionGd.height;
    return {
      type: 'Feature',
      properties: properties,
      geometry: {
        type: 'Point',
        coordinates: [
          positionGd.longitude * DEGREES,
          positionGd.latitude * DEGREES
        ]
      }
    };
  };
  /* ==================================================== */
  /* =============== TLE ================================ */
  /* ==================================================== */

  /**
   * Factory function for working with TLE.
   */
  function TLE() {
    this._properties;
    this._date;
  };
  TLE.prototype._lines = function (arry) {
    return arry.slice(0, 2);
  };

  TLE.prototype.satrecs = function (tles) {
    return tles.map(function (d) {
      return satelliteJs.twoline2satrec.apply(null, this._lines(d));
    });
  };

  TLE.prototype.features = function (tles) {
    var date = this._date || d3.now();

    return tles.map(function (d) {
      var satrec = satelliteJs.twoline2satrec.apply(null, this._lines(d));
      return satrecToFeature(satrec, date, this._properties(d));
    });
  };

  TLE.prototype.lines = function (func) {
    if (!arguments.length) return this._lines;
    this._lines = func;
    return this;
  };

  TLE.prototype.properties = function (func) {
    if (!arguments.length) return this._properties;
    this._properties = func;
    return this;
  };

  TLE.prototype.date = function (ms) {
    if (!arguments.length) return this._date;
    this._date = ms;
    return this;
  };


  /* ==================================================== */
  /* =============== PARSE ============================== */
  /* ==================================================== */

  /**
   * Parses text file string of tle into groups.
   * @return {string[][]} Like [['tle line 1', 'tle line 2'], ...]
   */
  function parseTle(tleString) {
    // remove last newline so that we can properly split all the lines
    var lines = tleString.replace(/\r?\n$/g, '').split(/\r?\n/);

    return lines.reduce(function (acc, cur, index) {
      if (index % 3 === 0) acc.push([]);
      acc[acc.length - 1].push(cur);
      return acc;
    }, []);
  };


  /* ==================================================== */
  /* =============== SATELLITE ========================== */
  /* ==================================================== */

  /**
   * Satellite factory function that wraps satellitejs functionality
   * and can compute footprints based on TLE and date
   *
   * @param {string[][]} tle two-line element
   * @param {Date} date date to propagate with TLE
   */
  function Satellite(tle, date) {
    this._satrec = satelliteJs.twoline2satrec(tle[1], tle[2]);
    this._satNum = this._satrec.satnum; // NORAD Catalog Number

    this._altitude; // km
    this._position = {
      lat: null,
      lng: null
    };
    this._halfAngle; // degrees
    this._date;
    this._gmst;

    this.setDate(date);
    this.update();
    this._orbitType = this.orbitTypeFromAlt(this._altitude); // LEO, MEO, or GEO
  };

  /**
   * Updates satellite position and altitude based on current TLE and date
   */
  Satellite.prototype.update = function () {
    var positionAndVelocity = satelliteJs.propagate(this._satrec, this._date);
    var positionGd = satelliteJs.eciToGeodetic(positionAndVelocity.position, this._gmst);

    this._position = {
      lat: positionGd.latitude * DEGREES,
      lng: positionGd.longitude * DEGREES
    };
    this._altitude = positionGd.height;
    return this;
  };

  /**
   * @returns {GeoJSON.Polygon} GeoJSON describing the satellite's current footprint on the Earth
   */
  Satellite.prototype.getFootprint = function () {
    var theta = this._halfAngle * RADIANS;

    coreAngle = this._coreAngle(theta, this._altitude, R_EARTH) * DEGREES;

    return d3.geoCircle()
      .center([this._position.lng, this._position.lat])
      .radius(coreAngle)();
  };

  /**
   * A conical satellite with half angle casts a circle on the Earth. Find the angle
   * from the center of the earth to the radius of this circle
   * @param {number} theta: Satellite half angle in radians
   * @param {number} altitude Satellite altitude
   * @param {number} r Earth radius
   * @returns {number} core angle in radians
   */
  Satellite.prototype._coreAngle = function (theta, altitude, r) {
    // if FOV is larger than Earth, assume it goes to the tangential point
    if (Math.sin(theta) > r / (altitude + r)) {
      return Math.acos(r / (r + altitude));
    }
    return Math.abs(Math.asin((r + altitude) * Math.sin(theta) / r)) - theta;
  };

  Satellite.prototype.halfAngle = function (halfAngle) {
    if (!arguments.length) return this._halfAngle;
    this._halfAngle = halfAngle;
    return this;
  };

  Satellite.prototype.satNum = function (satNum) {
    if (!arguments.length) return this._satNum;
    this._satNum = satNum;
    return this;
  };

  Satellite.prototype.altitude = function (altitude) {
    if (!arguments.length) return this._altitude;
    this._altitude = altitude;
    return this;
  };

  Satellite.prototype.position = function (position) {
    if (!arguments.length) return this._position;
    this._position = position;
    return this;
  };

  Satellite.prototype.getOrbitType = function () {
    return this._orbitType;
  };

  /**
   * sets both the date and the Greenwich Mean Sidereal Time
   * @param {Date} date
   */
  Satellite.prototype.setDate = function (date) {
    this._date = date;
    this._gmst = satelliteJs.gstime(date);
    return this;
  };

  /**
   * Maps an altitude to a type of satellite
   * @param {number} altitude (in KM)
   * @returns {'LEO' | 'MEO' | 'GEO'}
   */
  Satellite.prototype.orbitTypeFromAlt = function (altitude) {
    this._altitude = altitude || this._altitude;
    return this._altitude < 1200 ? 'LEO' : this._altitude > 22000 ? 'GEO' : 'MEO';
  };


  /* =============================================== */
  /* =================== GLOBE ===================== */
  /* =============================================== */

  // Approximate date the tle data was aquired from https://www.space-track.org/#recent
  var TLE_DATA_DATE = new Date(2018, 0, 26).getTime();

  var activeClock;
  var sats;

  var svg = d3.select('#globe');

  var marginTop = 0;
  var width = svg.attr('width');
  var height = svg.attr('height') - marginTop;

  var projection = d3.geoMercator()

  .translate([width / 2, height / 2 + marginTop])
  .precision(0.1);

  var geoPath = d3.geoPath()
    .projection(projection);

  svg.append('text')
    .attr('class', 'date-counter')
    .attr('x', 10)
    .attr('y', 20)
    .attr('height', 20)
    .attr('fill', '#222222');

  svg.append('path')
  .datum({
    type: 'Sphere'
  })
    .style('cursor', 'grab')
    .attr('fill', 'lightblue')
    .attr('d', geoPath);

  function initGlobe() {
    d3.json('/media/js/world-110m.txt').then(function (worldData) {
      svg.selectAll('.segment')
        .data(topojson.feature(worldData, worldData.objects.countries).features)
        .enter().append('path')
        .style('cursor', 'grab')
        .attr('class', 'segment')
        .attr('d', geoPath)
        .style('stroke', '#888')
        .style('stroke-width', '1px')
        .style('fill', '#e5e5e5')
        .style('opacity', '.6');
    });
  }

  function updateSats(date) {
    sats.forEach(function (sat) {
      return sat.setDate(date).update()
    });
    return sats
  };

  /**
   * Create satellite objects for each record in the TLEs and begin animation
   * @param {string[][]} parsedTles
   */
  function initSats(parsedTles) {
    activeClock = new Clock()
      .rate(1000)
      .date(TLE_DATA_DATE);
    sats = parsedTles.map(function (tle) {
      var sat = new Satellite(tle, new Date(2018, 0, 26));
      sat.halfAngle(sat.getOrbitType() === 'LEO' ? Math.random() * (30 - 15) + 15 : Math.random() * 4 + 1);
      return sat;
    });

    window.requestAnimationFrame(animateSats);
    return sats;
  };

  function draw() {
    redrawGlobe();
    svg.selectAll('.footprint')
      .data(sats, function (sat) {
        return sat.satNum();
      })
      .join(
        function (enter) {
          return enter.append('path')
            .attr('class', function (sat) {
              return 'footprint footprint--' + sat.getOrbitType()
            })
            .style('cursor', 'grab');
        }
      ).attr('d', function (sat) {
        return geoPath(sat.getFootprint());
      });
  };

  function redrawGlobe() {
    svg.selectAll('.segment')
      .attr('d', geoPath);
  }

  var m0;
  var o0;

  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = projection.rotate();
    d3.event.preventDefault();
  };

  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY];
      const o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      projection.rotate(o1);
      draw();
    }
  };

  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }

  svg.on('mousedown', mousedown);
  d3.select(window)
    .on('mousemove', mousemove)
    .on('mouseup', mouseup);

  function animateSats(elapsed) {
    var dateInMs = activeClock.elapsed(elapsed)
      .date();
    var date = new Date(dateInMs);
    svg.select('.date-counter').text('' + date);

    updateSats(date);
    draw();
    window.requestAnimationFrame(animateSats);
  }

  initGlobe();

  d3.text('tles.txt')
    .then(parseTle)
    .then(initSats);

}(window.L, window.d3, window.satellite))
