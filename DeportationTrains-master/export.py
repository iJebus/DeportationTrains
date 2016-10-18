#!/usr/bin/env python3
"""Create GeoJSON export of public DeportationTrains Google Sheets data."""
import json
import re
import requests


BASE_URL = (
    'https://spreadsheets.google.com/feeds/list/'
    '1DdH4tBFFRlbk4kZ_oik6-M7jUJIrC1UtqYOs2yVy9-s/{sheet}/public/full?alt=json'
)

PEOPLE_URL = BASE_URL.format(sheet=1)
DOCUMENTS_URL = BASE_URL.format(sheet=2)
MAP_ENGINE_URL = BASE_URL.format(sheet=3)


def offset_date(day: str, month: str, year: str, offset: int) -> str:
    """Constructs a valid ISO 8601 date string from day, month and year
    values. If a provided day or month value is empty space (.e.g ' ') or
    falsy (e.g. ''), defaults to the middle value for that given period. The
    year value is offset to work around pre-1970 date issues in
    Leaflet.TimeDimension.

    Args:
        day: Day of the month (DD, e.g., 03).
        month: Month of the year (MM, e.g., 11).
        year: Any year (YYYY, e.g., 1901).
        offset: A postive number of years to offset the year by (e.g., 52).
    Returns:
        Valid date string as per ISO 8601 (YYYY-MM-DD, e.g., 1901-11-03).
    """
    time = [
        str(int(year) + offset),
        month.strip() or '06',
        day.strip() or '15'
    ]
    return '-'.join(time)
    # todo proper handling of missing values or incorrect values e.g. 'aa'


def date_certainty(day: str, month: str, year: str) -> str:
    """Determine if a date should be considered exact or not."""
    try:
        if int(day) and int(month) and int(year):
            return 'Exact'
        else:
            return 'Estimated'
    except ValueError as e:
        return 'Estimated'
    # todo proper handling of missing values or incorrect values e.g. 'aa'


def generate_deportee_feature_collection(deportee_map_data, deportee_properties_data, deportee_documents_data):
    """Return a GeoJSON feature collection for a given individual."""
    deportee = {
        'features': generate_deportee_features(deportee_map_data),
        'properties': generate_deportee_properties(deportee_properties_data),
        'documents': generate_deportee_documents(deportee_documents_data),
        'type': 'FeatureCollection'
    }
    return deportee


def valid_feature(row):
    try:
        return (
            float(row['gsx$long']['$t'].strip()) and
            float(row['gsx$lat']['$t'].strip()) and
            int(row['gsx$startyear']['$t'].strip())
        )
    except ValueError:
        return False


def generate_deportee_features(deportee_map_data):
    features = [
        generate_feature(row) for row in deportee_map_data if valid_feature(row)
    ]
    return features


def generate_feature(row):
    """
    Generates a geojson feature from row data provided by a google spreadsheets
    json export.

    Input: Row from google sheets in json
    Output: geojson feature object

    Notes: Alternative method to look into is looping over keys beginning with 'gsx$',
    but this doesn't seem necessary given the low number of keys and low likelyhood
    of big schema changes.
    """

    datecertainty = row['gsx$datecertainty']['$t'] or date_certainty(
        row['gsx$startday']['$t'],
        row['gsx$startmonth']['$t'],
        row['gsx$startyear']['$t']
    )

    time = offset_date(
        row['gsx$startday']['$t'],
        row['gsx$startmonth']['$t'],
        row['gsx$startyear']['$t'],
        100
    )

    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [float(row['gsx$long']['$t']), float(row['gsx$lat']['$t'])]
        },
        "properties": {
            "name": row['gsx$name']['$t'],
            "status": row['gsx$status']['$t'],
            "event": row['gsx$event']['$t'],
            "startyear": row['gsx$startyear']['$t'],
            "time": time,
            "endyear": row['gsx$endyear']['$t'],
            "startmonth": row['gsx$startmonth']['$t'],
            "endmonth": row['gsx$endmonth']['$t'],
            "startday": row['gsx$startday']['$t'],
            "endday": row['gsx$endday']['$t'],
            "datecertainty": datecertainty,
            "place": row['gsx$place']['$t'],
            "city": row['gsx$city']['$t'],
            "state": row['gsx$state']['$t'],
            "country": row['gsx$country']['$t'],
            "notes": row['gsx$notes']['$t'],
            "trainidentifier": row['gsx$trainidentifier']['$t']
        },
        "id": row['gsx$uniquepersonidentifier']['$t']
    }
    return feature


def generate_deportee_properties(deportee_properties_data):
    properties = {}
    for value in deportee_properties_data[0]:
        if 'gsx$' in value:
            value_name = value[4:]
            properties[value_name] = deportee_properties_data[0][value]['$t']
    return properties


def export_output(output, file_path='static/data.geojson'):
    with open(file_path, 'w') as file:
        json.dump(output, file, sort_keys=True, indent=4)


def generate_filters(properties_data):  # clean this up
    filter_types = [x for x in properties_data[0].keys() if 'gsx$' in x]
    output = {}
    for _filter in filter_types:
        output[_filter[4:]] = sorted(list(set(
            [x[_filter]['$t'] for x in properties_data if x[_filter]['$t']]
        )))
    return output


def generate_deportee_documents(deportee_documents_data):
    unique_documents = list(
        set([x['gsx$filenamenumber']['$t'] for x in deportee_documents_data])
    )
    remove_empty = [x for x in unique_documents if re.match('^DSCN', x)]
    return remove_empty


def main():
    """Main execution body."""
    map_data = requests.get(MAP_ENGINE_URL).json()['feed']['entry']
    properties_data = requests.get(PEOPLE_URL).json()['feed']['entry']
    documents_data = requests.get(DOCUMENTS_URL).json()['feed']['entry']

    output = {
        "filters": generate_filters(properties_data),
        "geojson": {}
    }

    for deportee in output['filters']['name']:
        deportee_map_data = [row for row in map_data if row['gsx$name']['$t'] == deportee]
        deportee_properties_data = [row for row in properties_data if row['gsx$name']['$t'] == deportee]
        deportee_documents_data = [row for row in documents_data if row['gsx$person']['$t'] == deportee]
        if deportee_map_data:  # What to do if name but no data?
            output['geojson'][deportee] = generate_deportee_feature_collection(
                deportee_map_data,
                deportee_properties_data,
                deportee_documents_data
            )

    export_output(output)


if __name__ == "__main__":
    # Todo: cli interface?
    main()
