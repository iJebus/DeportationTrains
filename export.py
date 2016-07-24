"""Create GeoJSON export of public DeportationTrains Google Sheets data."""
import json
import requests


gsheets = 'https://spreadsheets.google.com/feeds/list/1PdSBY70PJal_xMjLy_igDddDwgbGQC_URlIJelAHKXE/3/public/full?alt=json'

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

    def create_time(day, month, year, offset):
        _time = [
            str(int(year) + offset),
            month or '01',
            day or '01'
        ]
        return '-'.join(_time)

    time = create_time(
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
            "datecertainty": row['gsx$datecertainty']['$t'],
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

def generate_deportee_feature_collection(name, data):
    """Generate GeoJSON feature collection for given individual and data."""
    feature_collection = {
        "type": "FeatureCollection",
        "features": [],
        "properties": {}
    }
    feature_collection['features'] = [generate_feature(row) for row in data if row['gsx$name']['$t'] == name]
    feature_collection['properties']['start'] = feature_collection['features'][0]['properties']['country']
    feature_collection['properties']['end'] = feature_collection['features'][-1]['properties']['country']
    return feature_collection

def main():
    """Main execution body."""
    r = requests.get(gsheets)
    data = r.json()['feed']['entry']
    deportees = list(set([x['gsx$name']['$t'] for x in data]))
    trains = list(set([x['gsx$trainidentifier']['$t'] for x in data]))
    wrapper = {
        "trains": trains,
        "persons": deportees,
        "geojson": {}
    }

    for deportee in deportees:
         deportee_feature_collection = generate_deportee_feature_collection(deportee, data)
         wrapper['geojson'][deportee] = deportee_feature_collection

    with open('static/data.geojson', 'w') as output:
        json.dump(wrapper, output, sort_keys=True, indent=4)

if __name__ == "__main__":
    main()
