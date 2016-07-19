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

function getIcon(feature, latlng) {
    if (feature.properties.event === 'Arrest') {
        return L.marker(latlng, {icon: arrestIcon});
    } else if (feature.properties.event === 'Birth') {
        return L.marker(latlng, {icon: birthIcon});
    } else if (feature.properties.event === 'Detention') {
        return L.marker(latlng, {icon: detentionIcon});
    } else if (feature.properties.event === 'Migration') {
        return L.marker(latlng, {icon: migrationIcon});
    } else if (feature.properties.event === 'Residence') {
        return L.marker(latlng, {icon: residenceIcon});
    } else {
        return L.marker(latlng);
    }
}
