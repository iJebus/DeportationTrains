// Map Config
L.Icon.Default.imagePath = '/static/img'; // Non-default path to image folder

// Initial map view parameters and map initialisation
var map = L.map('main-map', {
    maxBounds: L.latLngBounds(
        L.latLng(-90, -180),
        L.latLng(90, 180)
    )
}).setView([38, -97], 4);

// Configuration and setting of basemap
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

// TIME STUFF
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

$.getJSON('/static/data.geojson', function (data) {
    //jsonData=data;
    mapData = data; // Make available globally for other functions to use later
    populateFilters(mapData); // Add passengers and filter fields
    console.log(mapData.geojson);
    $("#apply").click(function() {
           filter();
       });
    

    // Attaches data to each point on click/popup, we may/may not actually want this on the main map; maybe just the person and a link to their page/map. Option for a modal popup?
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
//    function layerFilter(feature) {
// 
//          if (feature.properties.trainid === filters.selectedTrain && feature.properties.ethnicity === filters.selectedNationality) return true;
//          
//          
//               }

    // Adds each person to the map, with custom icons
    
    function filter() { // if a filter exists, set value in the filters object
        filters = {};
        for (var filter in $( "select option:selected" )) {
            console.log(filter.text);
        }
        if ($( "#trains" ).val()) filters.trainid = $( "#trains" ).val(); //"Westbound May-June 1919";
        if ($( "#nationality" ).val()) filters.ethnicity = $( "#nationality" ).val();
        console.log(filters);
        
        
    
        for (var person in mapData.geojson) {
            //for (var person in mapData.geojson) {  
//          var filtered = L.geoJson(mapData.geojson[person], {filter: layerFilter}).addTo(map);
//
          var personGeoJson = L.geoJson(data.geojson[person], {
            pointToLayer: function (feature, latlng) {
                return getMarker(feature, latlng); // surely we can replace the anon function directly with this?
            },
              filter: function(feature,layer) {
                  var matched = 0; // Init number of matched filters to 0
                  var activeFilters = Object.keys(filters).length; // Init the number of filters being used
                  for (var filter in filters) {
                      if (filters[filter] === data.geojson[person].properties[filter]) {
                          matched += 1;
                      }
                  }
                  if (matched === activeFilters) {
                      return true;
                  }
                // return feature.properties.trainidentifier === filters.selectedTrain     
              },
//            filter: function(feature, layer) {
//                return feature['properties']['trainid'] == filters.selectedTrain;
//            },
            onEachFeature: onEachFeature
        }).addTo(map);
        var personTimeLayer = L.timeDimension.layer.geoJson(personGeoJson, {    
            updateTimeDimension: true,
            updateTimeDimensionMode: 'union', // timeline of only when events are occuring
            // updateTimeDimensionMode: 'extreme', // timeline of each day between earliest date and latest date
            addlastPoint: false,
            // duration: 'P1Y' // Hide points after this much time has expired since event i.e. one year later, remove this marker
            // waitForReady: true,
        });
        personTimeLayer.addTo(map);
        }
    }
    });
    
        
//        for (var person in mapData.geojson) {
//          filteredData = L.geoJson(mapData.geojson[person], {
//            filter: function(feature, layer) {
//                //return ( feature['properties']['ethnicity'] ===filters.selectedNationality && feature['properties']['trainidentifier'] === filters.selectedTrain);
//                return feature['properties']['trainid'] === filters.selectedTrain //&& feature['properties']['ethnicity'] ===filters.selectedNationality);
//                //return feature['properties']['ethnicity'] === filters.selectedNationality;
//            }
//        });
//            filteredData.addTo(map);
//            console.log(filteredData);
//         personGeoJson = L.geoJson(filteredData, {
//            pointToLayer: function (feature, latlng) {
//                return getMarker(feature, latlng); // surely we can replace the anon function directly with this?
//                
//                //return L.marker(latlng);
//            },
//            
////            filter: function(feature, layer) {
////                //if($('select').val === "null")
////                  //  {return;}
////                //else{
////                return ( feature['properties']['ethnicity'] ===filters.selectedNationality &&feature['properties']['trainidentifier'] === filters.selectedTrain);
////            },
//             //mapData.geojson[perso]
//            onEachFeature: onEachFeature}).addTo(map);
//       
        
        
//$(document).ready(function() {
//      $("#apply").click( function(){ 
 
$("#reset").on("click", function () {
    
    $('select').val('');
    //console.log(filters);
});
/*for (var person in jsonData.geojson) {
start = L.geoJson(jsonData.geojson['Hannah Sullivan'], {
    filter: function(feature, layer) {
                return feature['properties']['start'] ;
            }
})
console.log(start)
feature['properties']['ethnicity'] ===filters.selectedNationality &&*/
//for (var person in mapData.geojson) { 
//    filter: function(feature,layer){
//        return feature['properties']['ethnicity'] ===$( "#Natonality" ).val();
//    }
//}
//for (var person in mapData.geojson) { 
//var polyLayer = L.geoJson(mapData.geojson.person, {filter: filter1}).addTo(map);
//}
//function filter1(feature){
//    if(feature['properties']['ethnicity'] ===$( "#Natonality" ).val();)
//            return true;
//    }
//
//    }
//for (var person in mapData.geojson) {
//L.geoJson(someFeatures, {
//    filter: function(feature, layer) {
//        return feature.properties.show_on_map;
//    }
//}).addTo(map);
//}
//for (var person in mapData.geojson) {  
//L.geoJson(mapData.geojson[person], {filter: layerFilter}).addTo(map);
//}
//function layerFilter(feature) {
// 
//  if (feature.properties.show === "yes") return true
//}