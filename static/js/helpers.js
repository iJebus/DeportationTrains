L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa'; // Set marker default to use font awesome

function populateFilters(mapData) {
    /*
    // Populates filters on initial page load, needs work
    for (var i in mapData.filters.deportees) {
        $('#passengers').append('<option>' + mapData.filters.deportees[i] + '</option');
        //$('#passengers').append('<li><a href="#">' + mapData.filters.deportees[i] + '</a></li');
    }
    for (var i in mapData.filters.trains) {
        $('#trains').append('<option>' + mapData.filters.trains[i] + '</option');
    }
    for(var persons in mapData.filters){
        var ethnicity = mapData.geojson[persons]['properties']['ethnicity'];
        $("#nationality > option").each(function() {
    //alert(this.text + ' ' + this.value);
            //var exist = false;
            if( this.value === ethnicity ){
                return false;
                else
                    $('#nationality').append('<option>' + ethnicity + '</option'); 
            }});
    //for (var i in mapData.geojson[persons]['properties']['ethinicity']){
       
    }
    console.log(mapData.filters);
    for(var persons in mapData.geojson){
      var offence  = mapData.geojson[persons]['properties']['justificationforremovalprimary'];
        $('#offence').append('<option>' + offence + '</option');
    }
    */
    for (var filter in mapData.filters) {
        var target = '#' + filter;
        if ( $( target ).length ) {
            for (var option in mapData.filters[filter]) {
                $(target).append('<option>' + mapData.filters[filter][option] + '</option');
            }
        }
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
