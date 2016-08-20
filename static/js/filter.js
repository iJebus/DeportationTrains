$.getJSON('/static/data.geojson', function (data) {                                
    jsonData = data;  
    console.log(jsonData.geojson);
    var filters = {};
    // filters.selectedNationality = $( "#National" ).val();
    // filters.selectedTrain = $( "#Trains" ).val();
    filters.selectedTrain = "Westbound May-June 1919";
    //filters.selected = $( "#Offence" ).val();
    //if($("select[name='My_Saved_Shipping']").selectedIndex == 0)
    console.log(filters);
    for (var person in jsonData.geojson) {
        // var personStartPosition = jsonData.geojson[person]['properties']['start'];
        //var trainId = jsonData.geojson[person]['features'][0]['properties']['trainidentifier'];
        //console.log(personStartPosition);
        //console.log(trainId);
        //if(filters.selectedNationality
        // var filteredData = {};
        var filteredData = L.geoJson(jsonData.geojson[person].features, {
            filter: function(feature, layer) {
                return feature['properties']['trainidentifier'] === filters.selectedTrain;
            }
        });
        console.log(filteredData);
        /*if(personStartPosition !== filters.selectedNationality){
          continue;
        }
        
            else{
            console.log(personStartPosition);*/
            var personGeoJson = L.geoJson(data.geojson[person], {
            pointToLayer: function (feature, latlng) {
                // return getMarker(feature, latlng); // surely we can replace the anon function directly with this?
                return L.marker(latlng);
            }, 
            onEachFeature: onEachFeature
        });

        
    }});
// set all filters to its default values
/*$("#reset").on("click", function () {
    
    $('select').val('');
    //console.log(filters);
});
var filteredData = {};
        filteredData.train= L.geoJson(person, {
            filter: function(feature, layer) {
                return ['feature'][0]['properties']['trainidentifier'] = filters.selectedTrain;
            }
        });
        filteredData.nationality= L.geoJson(data, {
            filter: function(feature, layer) {
                return feature.properties.trainidentifier = filters.selectedTrain;
            }
        });
*/