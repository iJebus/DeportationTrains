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
  var person_name = $('#name').val();
  var person = mapData.geojson[person_name]
  populatePersonalDetails(person);
  //console.log(person);
  populateMap(person);
})

$('#personal-modal').on('hidden.bs.modal', function (e) {
  personalMap.remove();
  resetPersonalDetails();
})

$('#name').change(function() {
  $('#personal-modal-label').text($(this).val());
  $('#personal-modal').modal('toggle')
});

// **** Filters logic ****
function reset_filters() {
    $('select').val('');
}

function apply_filters() {
  var filters = getActiveFilters();
  mainMap.remove();
  mainMap = newTrainMap('main-map', 38, -97);
  populateMap(null, filters);
}

$("#reset").on("click", function () {
    reset_filters();
    apply_filters();
});

$("#apply").on("click", function () {
    apply_filters();
});
