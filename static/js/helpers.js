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
