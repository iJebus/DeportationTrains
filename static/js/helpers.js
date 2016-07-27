function populateFilters(data) {
    // Populates filters on initial page load, needs work
    for (var i in data.persons) {
        $('#passengers').append('<li><a href="#">' + data.persons[i] + '</a></li');
    }

    for (var i in data.trains) {
        $('#trains > select').append('<option>' + data.trains[i] + '</option');
    }
}

function filterFeature(filter) {
    // Early start on with clearing layers based on content
    var result = []
    mymap.eachLayer(function (layer) {
        if (!(layer.options.id)) result.push(layer);
        // mymap.removeLayer(layer);
    })
    return result;
}

function getMarker(feature, latlng) {
    var iconOptions = {
        iconAnchor: [16, 16],
    };

    var markerOptions = {
        riseOnHover: true // irrelevant at this point as using hollow icons, you can't tell what's on top
    };

    if (feature.properties.event === 'Arrest') {
        iconOptions.iconUrl = '/static/img/png/criminal.png';
    } else if (feature.properties.event === 'Birth') {
        iconOptions.iconUrl = '/static/img/png/people.png';
    } else if (feature.properties.event === 'Detention') {
        iconOptions.iconUrl = '/static/img/png/policeman.png';
    } else if (feature.properties.event === 'Migration') {
        iconOptions.iconUrl = '/static/img/png/transport.png';
    } else if (feature.properties.event === 'Residence') {
        iconOptions.iconUrl = '/static/img/png/internet.png';
    } else {
        iconOptions.iconUrl = '/static/img/marker-icon.png'; // use as default until we have all custom icons
        iconOptions.shadowUrl = '/static/img/marker-shadow.png';
    }

    if (feature.properties.datecertainty !== 'Exact') {
        iconOptions.className = "icon--uncertain";
    }

    markerOptions.icon = L.icon(iconOptions);

    return L.marker(latlng, markerOptions);
}
