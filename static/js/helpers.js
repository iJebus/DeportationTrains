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
    return marker
}
