function readAdiManifest(file, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.onload = function() {
      if(rawFile.status == 200) {
        // success!
        var allText = rawFile.responseText;
        var lines = allText.split('\n');

        // Work out the relative path to the manifest file and pre-pend it to the requests for adif files
        var path = file.substring(0, file.lastIndexOf("/"));

        for(var i = 0;i < lines.length;i++){
          //console.log(path + "/" + lines[i]);
          readTextFile(path + "/" + lines[i], callback);
        }
      } else {
        // something went wrong
        //console.log("oops", rawFile);
      }
    }

    rawFile.open("GET", file);
    rawFile.send();
}

function readTextFile(file, callback)
{
  var log = [];
    var rawFile = new XMLHttpRequest();
    rawFile.onload = function ()
    {
           if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var lines = allText.toUpperCase().split('<EOR>');
                for(var i = 0;i < lines.length;i++){
                  //console.log("Parsing " + i + ": " + lines[i]);
                    if ( lines[i].match(/<[A-Z0-9_]+:[0-9]+>.*/i) ) {
                      var record = {};
                      if ( lines[i].match(/<QSO_DATE:[0-9]+>([0-9]+)/i) ) {
                        record.date = lines[i].match(/<QSO_DATE:[0-9]+>([0-9]+)/i)[1];
                      }
                      if ( lines[i].match(/<TIME_ON:[0-9]+>([0-9]{4})/i) ) {
                        record.time = lines[i].match(/<TIME_ON:[0-9]+>([0-9]{4})/i)[1];
                      }
                      if ( lines[i].match(/<BAND:[0-9]+>([0-9a-zA-Z]+)/i) ) {
                        record.band = lines[i].match(/<BAND:[0-9]+>([0-9a-zA-Z]+)/i)[1];
                      }
                      if ( lines[i].match(/<FREQ:[0-9]+>([0-9.]+)/i) ) {
                        record.frequency = parseFloat(lines[i].match(/<FREQ:[0-9]+>([0-9.]+)/i)[1]);
                      }
                      if ( lines[i].match(/<MODE:[0-9]+>([0-9a-zA-Z]+)/i) ) {
                        record.mode = lines[i].match(/<MODE:[0-9]+>([0-9a-zA-Z]+)/i)[1];
                      }
                      if ( lines[i].match(/<CALL:[0-9]+>([0-9A-Z\/-]+)/i) ) {
                        record.callsign = lines[i].match(/<CALL:[0-9]+>([0-9A-Z\/-]+)/i)[1];
                      }
                      if ( lines[i].match(/<RST_SENT:[0-9]+>([0-9]{2,3})/i) ) {
                        record.rst_tx = parseInt(lines[i].match(/<RST_SENT:[0-9]+>([0-9]{2,3})/i)[1], 10);
                      }
                      if ( lines[i].match(/<STX:[0-9]+>([0-9]{1,4})/i) ) {
                        record.serial_tx = parseInt(lines[i].match(/<STX:[0-9]+>([0-9]{1,4})/i)[1], 10).pad(3);
                      }
                      if ( lines[i].match(/<RST_RCVD:[0-9]+>([0-9]{2,3})/i) ) {
                        record.rst_rx = parseInt(lines[i].match(/<RST_RCVD:[0-9]+>([0-9]{2,3})/i)[1], 10);
                      }
                      if ( lines[i].match(/<SRX:[0-9]+>([0-9]{1,4})/i) ) {
                        record.serial_rx = parseInt(lines[i].match(/<SRX:[0-9]+>([0-9]{1,4})/i)[1], 10).pad(3);
                      }
                      if ( lines[i].match(/<QSO_PTS:[0-9]+>([0-9]{1,4})/i) ) {
                        record.points = parseInt(lines[i].match(/<QSO_PTS:[0-9]+>([0-9]{1,4})/i)[1], 10);
                      }
                      if ( lines[i].match(/<GRIDSQUARE:[0-9]+>([0-9A-Za-z]{4,6})/i) ) {
                        record.locator = lines[i].match(/<GRIDSQUARE:[0-9]+>([0-9A-Za-z]{4,6})/i)[1];
                          // If we have a six-figure locator then make sure the last two letters are lower-case (for HamLocator.js)
                          if ( record.locator.length == 6 ) {
                            record.locator = record.locator.charAt(0) +
                          record.locator.charAt(1) +
                          record.locator.charAt(2) +
                          record.locator.charAt(3) +
                          record.locator.charAt(4).toLowerCase() +
                          record.locator.charAt(5).toLowerCase();
                            //console.log(record.locator);
                          }
                        var latLon = gridSquareToLatLon(record.locator);
                        record.latitude = latLon[0];
                        record.longitude = latLon[1];
                      }
                      if ( lines[i].match(/<TX_PWR:[0-9]+>([0-9]{1,4})/) ) {
                         record.tx_power = parseInt(lines[i].match(/<TX_PWR:[0-9]+>([0-9]{1,4})/)[1], 10);
                      }
                      if ( lines[i].match(/<OPERATOR:[0-9]+>([0-9a-zA-Z\/-]+)/) ) {
                         record.operator = lines[i].match(/<OPERATOR:[0-9]+>([0-9a-zA-Z\/-]+)/)[1];
                      }
                      if ( lines[i].match(/<QSO_PTS:[0-9]+>([0-9]+)/) ) {
                        record.points = parseInt(lines[i].match(/<QSO_PTS:[0-9]+>([0-9]+)/)[1], 10);
                      }

                      // Process QSL info
                      record.qsl = {};
                      if ( lines[i].match(/<LOTW_QSL_SENT:1>([YN])/) ) {
                        record.qsl.lotw_sent = lines[i].match(/<LOTW_QSL_SENT:1>([YN])/)[1];
                      }
                      if ( lines[i].match(/<LOTW_QSL_RCVD:1>([YNR])/) ) {
                        record.qsl.lotw_rcvd = lines[i].match(/<LOTW_QSL_RCVD:1>([YNR])/)[1];
                      }
                      if ( lines[i].match(/<EQSL_QSL_SENT:1>([YN])/) ) {
                        record.qsl.eqsl_sent = lines[i].match(/<EQSL_QSL_SENT:1>([YN])/)[1];
                      }
                      if ( lines[i].match(/<EQSL_QSL_RCVD:1>([YNR])/) ) {
                        record.qsl.eqsl_rcvd = lines[i].match(/<EQSL_QSL_RCVD:1>([YNR])/)[1];
                      }

    // TODO: Lat/Lon needs converting to decimal notation. For now, just use gridsquare, if present
//			if ( lines[i].match(/<LAT:[0-9]+>[NS][0-9]{2,3] [0-9]{2}.[0-9]{3}/) ) {
//			  record.latitude = lines[i].match(/<LAT:[0-9]+>[NS][0-9]{2,3] [0-9]{2}.[0-9]{3}/)[1];
//			}
//                        if ( lines[i].match(/<LON:[0-9]+>[EW][0-9]{2,3] [0-9]{2}.[0-9]{3}/) ) {
//                          record.longitude = lines[i].match(/<LON:[0-9]+>[EW][0-9]{2,3] [0-9]{2}.[0-9]{3}/)[1];
//                        }
                      //console.log(record);
                      log.push(record);
                    }

                }
  callback(log);
            }
    }
    rawFile.open("GET", file);
    rawFile.send();
}

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
