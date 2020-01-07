/*
 * L.Maidenhead displays a Maidenhead Locator of lines on the map.
 */

L.Maidenhead = L.LayerGroup.extend({
  grids: {
    worked: [],
    confirmed: []
  },

	options: {
		// Line and label color
		color: 'rgba(255, 0, 0, 0.4)',
		// Redraw on move or moveend
		redraw: 'move'
	},

	initialize: function (grids, options) {
		L.LayerGroup.prototype.initialize.call(this);
		L.Util.setOptions(this, options);
    this.grids = grids;
	},

	onAdd: function (map) {
		this._map = map;
		var grid = this.redraw();
		this._map.on('viewreset '+ this.options.redraw, function () {
			grid.redraw();
		});

		this.eachLayer(map.addLayer, map);
	},

	onRemove: function (map) {
		// remove layer listeners and elements
		map.off('viewreset '+ this.options.redraw, this.map);
		this.eachLayer(this.removeLayer, this);
	},

	redraw: function () {
		var d3 =         new Array(20,10,10,10,10,10,1 ,1 ,1 ,1 ,1/24,1/24,1/24,1/24,1/24,1/240,1/240,1/240,1/240,1/240/24,1/240/24 );
		var lat_cor =    new Array(0 ,8 ,8 ,8 ,10,14,6 ,8 ,8 ,8 ,1.4 ,2.5 ,3   ,3.5 ,4   ,4    ,3.5  ,3.5  ,3    ,1.8     ,1.6      );
		var bounds = this._map.getBounds();
		var zoom = this._map.getZoom();
		var unit = d3[zoom];
		var lcor = lat_cor[zoom];
		var w = bounds.getWest();
		var e = bounds.getEast();
		var n = bounds.getNorth();
		var s = bounds.getSouth();
		if (zoom==1) {var c = 2;} else {var c = 0.1;}
		if (n > 85) n = 85;
		if (s < -85) s = -85;
		var left = Math.floor(w/(unit*2))*(unit*2);
		var right = Math.ceil(e/(unit*2))*(unit*2);
		var top = Math.ceil(n/unit)*unit;
		var bottom = Math.floor(s/unit)*unit;
		this.eachLayer(this.removeLayer, this);

    // Build up arrays of grid squares and fields
    var grid_two = [];
    var grid_two_confirmed = [];
    var grid_four = [];
    var grid_four_confirmed = [];

    this.grids.worked.forEach(function(grid) {
      grid_two.push(grid.substring(0,4).toUpperCase());
      grid_four.push(grid.substring(0,6).toUpperCase());
    });

    this.grids.confirmed.forEach(function(grid) {
      grid_two_confirmed.push(grid.substring(0,4).toUpperCase());
      grid_four_confirmed.push(grid.substring(0,6).toUpperCase());
    });

    console.log("grid_two", grid_two);
    console.log("grid_two_confirmed", grid_two_confirmed);
    console.log("grid_four", grid_four);
    console.log("grid_four_confirmed", grid_four_confirmed);


		for (var gridLon = left; gridLon < right; gridLon += (unit*2)) {
			for (var gridLat = bottom; gridLat < top; gridLat += unit) {
			var bounds = [[gridLat,gridLon],[gridLat+unit,gridLon+(unit*2)]];

      console.log("Checking:", bounds);
      console.log("Locator:", this._getLocator(gridLon+unit,gridLat+unit/2));

			if(grid_two.includes(this._getLocator(gridLon+unit,gridLat+unit/2)) || grid_four.includes(this._getLocator(gridLon+unit,gridLat+unit/2))) {

        console.log("Found!");

				if(grid_two_confirmed.includes(this._getLocator(gridLon+unit,gridLat+unit/2)) || grid_four_confirmed.includes(this._getLocator(gridLon+unit,gridLat+unit/2))) {

					this.addLayer(L.rectangle(bounds, {color: 'rgb(144,238,144)', weight: 1, fillOpacity: 0.6, fill:true, interactive: false}));
				} else {

				this.addLayer(L.rectangle(bounds, {color: this.options.color, weight: 1, fillOpacity: 0.6, fill:true, interactive: false}));
				}
			} else {
				this.addLayer(L.rectangle(bounds, {color: this.options.color, weight: 1, fill:false, interactive: false}));
			}
			//var pont = map.latLngToLayerPoint([gridLat,gridLon]);
			//console.log(pont.x);
			this.addLayer(this._getLabel(gridLon+unit-(unit/lcor),gridLat+(unit/2)+(unit/lcor*c)));
			}
		}
		return this;
	},

	_getLabel: function(lon,lat) {
	  var title_size = new Array(0 ,10,12,16,20,26,12,16,24,36,12  ,14  ,20  ,36  ,60  ,12   ,20   ,36   ,60   ,12      ,24       );
	  var zoom = this._map.getZoom();
	  var size = title_size[zoom]+'px';
	  var title = '<span style="cursor: default;"><font style="color:'+this.options.color+'; font-size:'+size+'; font-weight: 900; word-wrap: normal;">' + this._getLocator(lon,lat) + '</font></span>';
      var myIcon = L.divIcon({className: 'my-div-icon', html: title});
      var marker = L.marker([lat,lon], {icon: myIcon}, clickable=false);
      return marker;
	},

	_getLocator: function(lon,lat) {
	  var ydiv_arr=new Array(10, 1, 1/24, 1/240, 1/240/24);
	  var d1 = "ABCDEFGHIJKLMNOPQR".split("");
	  var d2 = "ABCDEFGHIJKLMNOPQRSTUVWX".split("");
	  var d4 =         new Array(0 ,1 ,1 ,1 ,1 ,1 ,2 ,2 ,2 ,2 ,3   ,3   ,3   ,3   ,3   ,4    ,4    ,4    ,4    ,5       ,5        );
      var locator = "";
      var x = lon;
      var y = lat;
      var precision = d4[this._map.getZoom()];
      while (x < -180) {x += 360;}
      while (x > 180) {x -=360;}
      x = x + 180;
      y = y + 90;
      locator = locator + d1[Math.floor(x/20)] + d1[Math.floor(y/10)];
      for (var i=0; i<4; i=i+1) {
		if (precision > i+1) {
        rlon = x%(ydiv_arr[i]*2);
        rlat = y%(ydiv_arr[i]);
			if ((i%2)==0) {
				locator += Math.floor(rlon/(ydiv_arr[i+1]*2)) +""+ Math.floor(rlat/(ydiv_arr[i+1]));
			} else {
				locator += d2[Math.floor(rlon/(ydiv_arr[i+1]*2))] +""+ d2[Math.floor(rlat/(ydiv_arr[i+1]))];
			}
		}
	  }
      return locator;
	},




});

// Grids should be an object of two arrays, grids are expected to be 6-figure grids:
//
// { worked: ["AB01cd", "EF23gh"], confirmed: ["AB01cd"] }
//
L.maidenhead = function (grids, options) {
	return new L.Maidenhead(grids, options);
};
