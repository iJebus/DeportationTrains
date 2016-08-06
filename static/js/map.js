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
    // mapData = data; // Make available globally for other functions to use later
    populateFilters(data); // Add passengers and filter fields

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

    // Adds each person to the map, with custom icons
    for (var person in data.geojson) {
        var personGeoJson = L.geoJson(data.geojson[person], {
            pointToLayer: function (feature, latlng) {
                return getMarker(feature, latlng); // surely we can replace the anon function directly with this?
            },
            onEachFeature: onEachFeature
        })

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
})
