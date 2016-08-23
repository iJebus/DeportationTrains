// **** Global variables ****
var mainMap,
    personalMap,
    mapData;

// **** Main map page logic ****
$( document ).ready(function() {
  $.getJSON('/static/data.geojson', function (data) {
    mapData = data;
  }).done(function() {
    mainMap = newTrainMap('main-map', 38, -97);
    populateMap();
  });
});

// **** Personal map page logic ****
$('#myModal').on('shown.bs.modal', function (e) {
  personalMap = newTrainMap('secondary-map', 35, -95);
  populateMap('Luey Mo');
})

$('#myModal').on('hidden.bs.modal', function (e) {
  personalMap.remove();
})

