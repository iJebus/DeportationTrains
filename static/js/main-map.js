// Map Config
L.Icon.Default.imagePath = 'img';

// Initial view and map init
var mymap = L.map('main-map', {
    maxBounds: L.latLngBounds(
        L.latLng(-90, -180), 
        L.latLng(90, 180)
    )
}).setView([0, 0], 1);

// Basemap
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);


/*L.marker([51.5, -0.09]).addTo(mymap)
    .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(mymap).bindPopup("I am a circle.");

L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap).bindPopup("I am a polygon.");*/


/*var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);*/

// var myLayer = L.geoJson().addTo(mymap);

$.getJSON('static/data.geojson', function (data) {
    jsonData = data;

    for (var i in data.persons) {
        $('#persons > select').append('<option>' + data.persons[i] + '</option');
    }

    for (var i in data.trains) {
        $('#trains > select').append('<option>' + data.trains[i] + '</option');
    }

    var numberOfItems = data.persons.length;
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, numberOfItems);
    rainbow.setSpectrum('red', 'black');


    var i = 1;
    for (var person in data.geojson) {
        var hexColour = rainbow.colourAt(i);
        /*L.geoJson(data.geojson[person].features, {
            onEachFeature: onEachFeature,
            style: {
                "color": '#' + hexColour
            }
        }).addTo(mymap);
        */

        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: '#' + hexColour,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        L.geoJson(data.geojson[person].features, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature
        }).addTo(mymap);

        i++;
    }

    /* for (var i=0; i<data['Luey Mo']['features'].length; i++) {
        myLayer.addData(data['Luey Mo']['features'][i]);
    }*/
})

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

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

function filterFeature(filter) {
    /* Experimenting with clearing layers based on content */
    var result = []
    mymap.eachLayer(function (layer) {
        if (!(layer.options.id)) result.push(layer);
        // mymap.removeLayer(layer);
    })
    return result;
}