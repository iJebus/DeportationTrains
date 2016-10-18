// **** Filter helpers ****
function populateFilters() {
  for (var filter in mapData.filters) {
        var target = '#' + filter;
        if ( $( target ).length ) {
            for (var option in mapData.filters[filter]) {
                $(target).append('<option>' + mapData.filters[filter][option] + '</option');
            }
        }
    }
}

function getActiveFilters() {
  var selectedFilters = {};
  var filters = $("#filters select").toArray();
  for (var i in filters) {
    if (filters[i].value) {
      selectedFilters[filters[i].id] = filters[i].value;
    }
  }
  return selectedFilters;
}

// **** Map helpers ****
function addBasemap(map) {
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
  }).addTo(map);
}

function addTimeDimension(map) {
  var timeDimension = new L.TimeDimension();
  map.timeDimension = timeDimension;
  var player = new L.TimeDimension.Player({
      transitionTime: 1000,
      loop: false,
      startOver: true
  }, timeDimension);
  var timeDimensionControlOptions = {
      player: player,
      timeDimension: timeDimension,
      position: 'bottomleft',
      autoPlay: false,
      minSpeed: 1,
      speedStep: 1,
      maxSpeed: 5,
      timeSliderDragUpdate: true
  };
  var timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);
  map.addControl(timeDimensionControl);
  var icon = L.icon({
      iconUrl: '/static/img/png/people.png',
      iconSize: [22, 22],
      iconAnchor: [5, 25]
  });
}

function addMap(target, start_lat, start_long) {
  // Create Leaflet map object with defined bounds, view and zoom
  return L.map(target, {
      maxBounds: L.latLngBounds(
          L.latLng(-90, -180),
          L.latLng(90, 180)
      )
  }).setView([start_lat, start_long], 4);
}

function newTrainMap(target, start_lat, start_long) {
  var map = addMap(target, start_lat, start_long);
  addBasemap(map);
  addTimeDimension(map);
  return map;
}

var overlayMaps = {}; //trail before people arrested
var displayMaps = {}; //higlight a trail bfore arrest
var arrestMaps = {}; //trail of arrested people
var arrestDisplay = {}; //highlights a trail after arrest
var list;

//creates all the geojson lines, time dimensions
function populateMap(p, filters){
  overlayMaps = {}; //trail before people arrested
  displayMaps = {}; //higlight a trail bfore arrest
  arrestMaps = {}; //trail of arrested people
  arrestDisplay = {}; //highlights a trail after arrest
  var map1;
  if(!p) map1 = mainMap;
  for (var person in mapData.geojson){
    if(p){
      if(person != p) continue;
      else{
        map1 = personalMap;
      }
    }
    if (filters) {
      var matched = 0;
      var activeFilters = Object.keys(filters).length;
      for (var filter in filters) {
        if (filters[filter] === mapData.geojson[person].properties[filter]) {
           matched += 1;
        }
      }
      if (!(matched === activeFilters)) {
          continue;
      }
    }

    var lines = getLines(person);
    //each line is given a style
    var jsonlayer = L.geoJson(lines[0], {style: style}).addTo(map1);
    var arrested = L.geoJson(lines[1], {style: arreststyle}).addTo(map1);
    var displaylayer = L.geoJson(lines[0], {style: style2}).addTo(map1);
    var arrestedDisplayLayer =  L.geoJson(lines[1], {style: arrestDisplayStyle}).addTo(map1);

    //create a time dimension layer for each line so it can be animated
    var person = L.timeDimension.layer.geoJson(jsonlayer, {
        updateTimeDimension: true,
        updateTimeDimensionMode: 'union',
        addlastPoint: false,
        waitForReady: false
    });
    var arrestedperson = L.timeDimension.layer.geoJson(arrested, {
        updateTimeDimension: true,
        updateTimeDimensionMode: 'union',
        addlastPoint: false,
        waitForReady: false
    });
    var display = L.timeDimension.layer.geoJson(displaylayer, {
        updateTimeDimension: true,
        updateTimeDimensionMode: 'union',
        addlastPoint: false,
        duration: "P1D", //we only want the line to highlight breifly
        waitForReady: true
    });
    var arrestedDisplay = L.timeDimension.layer.geoJson(arrestedDisplayLayer, {
        updateTimeDimension: true,
        updateTimeDimensionMode: 'union',
        addlastPoint: false,
        duration: "P1D", //we only want the line to highlight breifly
        waitForReady: true
    });
    //add all the layers to an array so we can add and remove them at will
    overlayMaps[person] = person;
    arrestMaps[person] = arrestedperson;
    displayMaps[person] = display;
    arrestDisplay[person] = arrestedDisplay;

    overlayMaps[person].addTo(map1);
    map1.removeLayer(overlayMaps[person]);
    arrestMaps[person].addTo(map1);
    map1.removeLayer(arrestMaps[person]);
    displayMaps[person].addTo(map1);
    map1.removeLayer(displayMaps[person]);
    arrestDisplay[person].addTo(map1);
    map1.removeLayer(arrestDisplay[person]);

    overlayMaps[person].addTo(map1);
    arrestMaps[person].addTo(map1);
    displayMaps[person].addTo(map1);
    arrestDisplay[person].addTo(map1);
  }

}



//style signifies a persons trail before arrest
var style = {
  "color": "blue",
    "weight": 3,
    "opacity": 0.3
};

//style is used to highlight most recently added trail breifly (before arrest)
var style2 = {
  "color": "blue",
    "weight": 3,
    "opacity": 1
};

//style is used to show trail of person after arrest
var arreststyle = {
    "color": "red",
    "weight": 3,
    "opacity": 0.3
};

//style used to higlight modt recently added trail (arrest)
var arrestDisplayStyle = {
    "color": "red",
    "weight": 3,
    "opacity": 1
};




//old code with markers

/*
function populateMap(p, filters) {
  if (p) {
    var personGeoJson = L.geoJson(mapData.geojson[p], {
      pointToLayer: function (feature, latlng) {
        return getMarker(feature, latlng);
      },
      onEachFeature: onEachFeature
    })

    var personTimeLayer = addTimeLayer(personGeoJson);
    personTimeLayer.addTo(personalMap);
  } else if (filters) {
    for (var person in mapData.geojson) {
      var matched = 0;
      var activeFilters = Object.keys(filters).length;
      for (var filter in filters) {
        if (filters[filter] === mapData.geojson[person].properties[filter]) {
           matched += 1;
        }
      }
      if (matched === activeFilters) {
          var personGeoJson = L.geoJson(mapData.geojson[person], {
            pointToLayer: function (feature, latlng) {
              return getMarker(feature, latlng);
            },
            onEachFeature: onEachFeature
          });

          var personTimeLayer = addTimeLayer(personGeoJson);
          personTimeLayer.addTo(mainMap);
        }
      }
  } else {
    // Adds each person to the map, with custom icons
    for (var person in mapData.geojson) {
      var personGeoJson = L.geoJson(mapData.geojson[person], {
        pointToLayer: function (feature, latlng) {
          return getMarker(feature, latlng);
        },
        onEachFeature: onEachFeature
      });

      var personTimeLayer = addTimeLayer(personGeoJson);
      personTimeLayer.addTo(mainMap);
    }
  }
}

function addTimeLayer(personGeoJson) {
  return L.timeDimension.layer.geoJson(personGeoJson, {
        updateTimeDimension: true,
        updateTimeDimensionMode: 'union', // timeline of only events occuring
        // timeline of each day between earliest date and latest date
        // updateTimeDimensionMode: 'extreme',
        addlastPoint: false,
        // duration: 'P1Y' // Remove points after this duration expired
        // waitForReady: true,
      })
}



function onEachFeature(feature, layer) {
  // Attaches data to each point on click/popup
  // we may/may not actually want this on the main map
  // maybe just the person and a link to their page/map.
  // Option for a modal popup?
    var table = document.createElement('table');
    table.className = "table";
    for (var i in feature.properties) {
        var row = document.createElement('tr');
        var title = document.createElement('td');
        var value = document.createElement('td');
        title.innerHTML = i;
        value.innerHTML = feature.properties[i];
        row.appendChild(title);
        row.appendChild(value);
        table.appendChild(row);
    }
    layer.bindPopup(table);
}

// **** Icon helpers ****
L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa'; // Set marker default to use font awesome

const icons = {
  'Detention 1': {
      'icon': 'chain',
      'markerColor': 'red'
  },
  'Detention 2': {
      'icon': 'chain',
      'markerColor': 'red'
  },
  'Parole': {
      'icon': 'chain-broken',
      'markerColor': 'red'
  },
  'Arrest': {
      'icon': 'university',
      'markerColor': 'red'
  },
  'Birth': {
      'icon': 'child',
      'markerColor': 'blue'
  },
  'Deportation Main Line': {
      'icon': 'train',
      'markerColor': 'red'
  },
  'Deportation International Exiting': {
      'icon': 'sign-out',
      'markerColor': 'red'
  },
  'Deportation International Transfer': {
      'icon': 'ship',
      'markerColor': 'red'
  },
  'Migration': {
      'icon': 'ship',
      'markerColor': 'blue'
  },
  'Labor': {
      'icon': 'usd',
      'markerColor': 'blue'
  },
  'Final Destination': {
      'icon': 'circle',
      'markerColor': 'red'
  },
  'Detention': {
      'icon': 'exclamation-triangle',
      'markerColor': 'red'
  },
  'Residence': {
      'icon': 'home',
      'markerColor': 'green'
  },
  'Living in China': {
      'icon': 'home',
      'markerColor': 'green'
  },
  'Arrival in USA': {
      'icon': 'sign-in',
      'markerColor': 'blue'
  },
  'Generic': {
      'icon': 'map-marker',
      'markerColor': 'blue'
  }
}

function getMarker(feature, latlng) {
  if (icons.hasOwnProperty(feature.properties.event)) {
      var iconOptions = Object.create(icons[feature.properties.event]);
  } else {
      var iconOptions = Object.create(icons['Generic']);
  }

  if (feature.properties.datecertainty !== "Exact") {
      iconOptions.extraClasses = "icon--uncertain";
  }

  var icon = L.AwesomeMarkers.icon(iconOptions);
  var marker = L.marker(latlng, {icon: icon});
  return marker;
}
*/
