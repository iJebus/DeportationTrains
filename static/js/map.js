// Map Config
L.Icon.Default.imagePath = '/static/img'; // Non-default path to image folder

// Initial map view parameters and map initialisation
var mymap = L.map('main-map', {
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
}).addTo(mymap);

// Loading train passenger data
$.getJSON('/static/data.geojson', function (data) {
    json = data; // Setting global variable for easier debugging

    populateFilters(data);

    var numberOfItems = data.persons.length;

    for (var person in data.geojson) {
        L.geoJson(data.geojson[person].features, {
            onEachFeature: onEachFeature,
        }).addTo(mymap);

        L.geoJson(data.geojson[person].features, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng);
            },
            onEachFeature: onEachFeature
        }).addTo(mymap);
    }
})

// Attaches data to each point on click/popup, we may/may not actually want this on the main map; maybe just the person and a link to their page/map. Option for a modal popup?.
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
