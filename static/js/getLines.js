/**
Search through a persons data and creates 2 geoJson MultiLineStrings
based on their positions before they were arrested and after they were arrested
*/
function getLines(name)
{
  var geojsonFeatures = []; //thing to be returned
  var arrested = false; //used as a flag when sifting through people
  var	coords = [];   //used to make the line string before arrested
  var arrestedCoords = []; //used to make line string after arrested
  var times = []; //need times as well
  var arrestedTimes = [];


     for(var i=0; i<mapData.geojson[name]['features'].length; i++) {
               if(mapData.geojson[name]['features'][i].properties.event == "Arrest") arrested = true; //flag if person gets arrested
               //gets array of lat and long
               var long= mapData.geojson[name]['features'][i].geometry.coordinates[0];
               var lat= mapData.geojson[name]['features'][i].geometry.coordinates[1];
               //console.log(long);
               //console.log(lat);
               if(arrested){ //when person is arrested we want to push coords to here
                   arrestedCoords.push(new L.LatLng(lat, long));
                   arrestedTimes.push(mapData.geojson[name]['features'][i].properties.time);
               }
               else{
                  coords.push(new L.LatLng(lat, long));
                  times.push(mapData.geojson[name]['features'][i].properties.time);
              }
      }
 //console.log(name);
 var man = coords.length;
 /*
 for(b = 0; b < man; b++){
    console.log(coords[b].lat)
 }*/
 if(man == 1){
   return 0 ;
 }

 arrested = false;
 coordsv2 = [];
 //repeat twice once for arrested data and one for before arrest
 for(var c = 0; c < 2; c++){
   coordsv2 = [];
   //console.log(coords);
   //console.log(arrestedCoords[0]);
   //console.log(name);
   if(c == 0){
     var tempCoords = coords;
     //if(typeof array != "undefined" && array != null && array.length > 0){
     //tempCoords.push(arrestedCoords[0]);
     var temptimes = times //.push(arrestedTimes[0]);
     var len = tempCoords.length;
     //console.log("the lat + "+  coords.lat);
   }
   else{
     var tempCoords = arrestedCoords;
     var temptimes = arrestedTimes;
     var len = arrestedCoords.length;
     //console.log("the lat + "+  arrestedCoords.lat);
    }

  var start = 0;
  var end = 0;
  //if(typeof tempCoords != "undefined" && tempCoords != null && tempCoords.length > 0){
    //continue;
  //}
  for(var m = 0; m < len-1; m++){
    //console.log(m);
    start = { x: tempCoords[m].lng,  y:tempCoords[m].lat};
    end = {x: tempCoords[m+1].lng, y:tempCoords[m+1].lat};
    //small bug to ignore when retieving coordinates
    if(start.x == end.x && start.y == end.y){
      continue;
    }

    //generate arc line from each pair of coordinates
    //each json line consists of ~100 new coordinates that were interpolated
    var generator = new arc.GreatCircle(start, end);
    var line = generator.Arc(100,{offset:10});
    var jsonline = line.json();
      if( jsonline.geometry.type == "MultiLineString"){
            coordsv2 = coordsv2.concat(jsonline.geometry.coordinates);
          }
      else{
            coordsv2 = coordsv2.concat([jsonline.geometry.coordinates]);
          }
      }

    var geojsonFeature = geojsonFeature = {
          "type": "Feature",
          "properties": {
          "name": name,
          "times": temptimes
        },
         "geometry": {
          "type": "MultiLineString",
          "coordinates":coordsv2
          }
        };
      geojsonFeatures.push(geojsonFeature);
    }

    return geojsonFeatures;
}

function getMarkers(){
  $.ajax({
    url: "data.geojson",
    async: false,
    dataType: "json",
    success: function(data){
      function onEachFeature(feature, layer) {
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

      for (var person in data.geojson) {
          var personGeoJson = L.geoJson(data.geojson[person], {
              pointToLayer: function (feature, latlng) {
                  return getMarker(feature, latlng); // surely we can replace the anon function directly with this?
              }
                 ,onEachFeature: onEachFeature
          })

          markers.push(personGeoJson);

          var personTimeLayer = L.timeDimension.layer.geoJson(personGeoJson, {
              updateTimeDimension: true,
              updateTimeDimensionMode: 'union', // timeline of only when events are occuring
              // updateTimeDimensionMode: 'extreme', // timeline of each day between earliest date and latest date
              addlastPoint: false,
              // duration: 'P1Y' // Hide points after this much time has expired since event i.e. one year later, remove this marker
              waitForReady: false
          });
          overlayMarkers[person] = personTimeLayer;
    }
   }});
}
