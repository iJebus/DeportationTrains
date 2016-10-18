/**
This file is used convert the data from each person into an array of map layers.
Each layer is a multilinestring that represents a persons trail
*/

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

var overlayMaps = {}; //trail before people arrested
var displayMaps = {}; //higlight a trail bfore arrest
var arrestMaps = {}; //trail of arrested people
var arrestDisplay = {}; //highlights a trail after arrest

//creates a layer for each person when map is loaded
for (var people in mapData.geojson){
  var lines = getLines(people[z]);

  //each line is given a style
  var jsonlayer = L.geoJson(lines[0], {style: style}).addTo(map);
  var arrested = L.geoJson(lines[1], {style: arreststyle}).addTo(map);
  var displaylayer = L.geoJson(lines[0], {style: style2}).addTo(map);
  var arrestedDisplayLayer =  L.geoJson(lines[1], {style: arrestDisplayStyle}).addTo(map);

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
  overlayMaps[people[z]] = person;
  arrestMaps[people[z]] = arrestedperson;
  displayMaps[people[z]] = display;
  arrestDisplay[people[z]] = arrestedDisplay;
}

//reset layer so lines arn't already drawn, just add + remove all person layers
//seems strange :/
for(var t = 0; t < people.length; t++){
  overlayMaps[people[t]].addTo(map);
  map.removeLayer(overlayMaps[people[t]]);
  arrestMaps[people[t]].addTo(map);
  map.removeLayer(arrestMaps[people[t]]);
  displayMaps[people[t]].addTo(map);
  map.removeLayer(displayMaps[people[t]]);
  arrestDisplay[people[t]].addTo(map);
  map.removeLayer(arrestDisplay[people[t]]);
}

//getMarkers(); // add marks to the map




//a function to add the trail of all people to the map
