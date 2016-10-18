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
    populateFilters();
  });
});

// **** Personal map page logic ****
$('#personal-modal').on('shown.bs.modal', function (e) {
  personalMap = newTrainMap('secondary-map', 35, -95);
  var person = $('#name').val();
  populateMap(person);
})

$('#personal-modal').on('hidden.bs.modal', function (e) {
  personalMap.remove();
})

$('#name').change(function() {
  $('#personal-modal-label').text($(this).val());
  $('#personal-modal').modal('toggle')
});

// **** Filters logic ****
$("#reset").on("click", function () {
    $('select').val('');
});

$("#apply").on("click", function () {
  var filters = getActiveFilters();
  mainMap.remove();
  mainMap = newTrainMap('main-map', 38, -97);
  populateMap(null,filters);
});
