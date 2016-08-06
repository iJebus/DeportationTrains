L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa'; // Set marker default to use font awesome

function populateFilters(data) {
    // Populates filters on initial page load, needs work
    for (var i in data.persons) {
        $('#passengers').append('<li><a href="#">' + data.persons[i] + '</a></li');
    }

    for (var i in data.trains) {
        $('#trains > select').append('<option>' + data.trains[i] + '</option');
    }
}

const icons = {
    'Residence': {
        'icon': 'home',
        'markerColor': 'green'
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
    return marker
}
