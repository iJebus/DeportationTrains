import export


def test_offset_date():
    assert export.offset_date('05', '01', '1991', 5) == '1996-01-05'


# Disabled until proper handling is enabled
# def test_offset_date_2():
#     try:
#         export.offset_date('05', 'ss', '1991', 10)
#         assert False
#     except ValueError:
#         assert True

# Disabled until proper handling is enabled
# def test_offset_date_3():
#     try:
#         result = export.offset_date('05', '01', '191', 0) != '191-01-05'  # invalid data format should throw exception
#         assert False
#     except KeyError:
#         assert True


def test_date_certainty():
    assert export.date_certainty('05', '01', '1991') == 'Exact'


def test_date_certainty_2():
    assert export.date_certainty('05', 0, '1991') == 'Estimated'


def test_date_certainty_3():
    assert export.date_certainty('sdas', '', '1991') == 'Estimated'


def test_generate_deportee_feature_collection():
    pass  # Todo


def test_valid_feature():
    good_input = {
        'gsx$long': {
            '$t': '150.44'
        },
        'gsx$lat': {
            '$t': '42.524'
        },
        'gsx$startyear': {
            '$t': '1918'
        }
    }
    assert export.valid_feature(good_input)


def test_valid_feature_2():
    bad_input = {
        'gsx$long': {
            '$fft': '150.44'
        },
        'gsx$ldfasdfasdat': {
            '$t': '42.5df24'
        },
        'gsxasfyear': {
            '$t': '1918'
        }
    }
    try:
        assert export.valid_feature(bad_input)
    except KeyError:
        assert True


def test_generate_deportee_features():
    pass  # Todo


def test_generate_feature():
    row = {'gsx$notes': {'$t': ''}, 'gsx$place': {'$t': 'SS Siberia'}, 'gsx$endday': {'$t': ''}, 'gsx$startday': {'$t': '6'}, 'gsx$trainidentifier': {'$t': 'Eastbound January 1915'}, 'gsx$geometrytype': {'$t': ''}, 'gsx$status': {'$t': 'DEPORTEE'}, 'gsx$event': {'$t': 'Deportation international exiting'}, 'category': [{'term': 'http://schemas.google.com/spreadsheets/2006#list', 'scheme': 'http://schemas.google.com/spreadsheets/2006'}], 'gsx$long': {'$t': '-122.4192704'}, 'gsx$city': {'$t': 'San Francisco'}, 'gsx$endmonth': {'$t': ''}, 'gsx$datecertainty': {'$t': 'Exact'}, 'gsx$country': {'$t': 'USA'}, 'content': {'type': 'text', '$t': 'uniquepersonidentifier: 131, lat: 37.7792768, long: -122.4192704, trainidentifier: Eastbound January 1915, event: Deportation international exiting, status: DEPORTEE, place: SS Siberia, city: San Francisco, state: California, country: USA, startyear: 1915, startmonth: 2, startday: 6, datecertainty: Exact'}, 'gsx$uniquepersonidentifier': {'$t': '131'}, 'gsx$name': {'$t': 'Yuen Chung'}, 'gsx$startmonth': {'$t': '2'}, 'gsx$lat': {'$t': '37.7792768'}, 'id': {'$t': 'https://spreadsheets.google.com/feeds/list/1DdH4tBFFRlbk4kZ_oik6-M7jUJIrC1UtqYOs2yVy9-s/3/public/full/2mry77'}, 'link': [{'href': 'https://spreadsheets.google.com/feeds/list/1DdH4tBFFRlbk4kZ_oik6-M7jUJIrC1UtqYOs2yVy9-s/3/public/full/2mry77', 'rel': 'self', 'type': 'application/atom+xml'}], 'gsx$endyear': {'$t': ''}, 'updated': {'$t': '2016-10-15T09:36:23.768Z'}, 'title': {'type': 'text', '$t': 'Yuen Chung'}, 'gsx$state': {'$t': 'California'}, 'gsx$startyear': {'$t': '1915'}}
    feature = export.generate_feature(row)
    expected = {
        'geometry': {
            'type': 'Point',
            'coordinates': [-122.4192704, 37.7792768]
        },
        'properties': {
            'event': 'Deportation international exiting',
            'trainidentifier': 'Eastbound January 1915',
            'state': 'California',
            'status': 'DEPORTEE',
            'place': 'SS Siberia',
            'time': '2015-2-6',
            'startday': '6',
            'startmonth': '2',
            'startyear': '1915',
            'country': 'USA',
            'name': 'Yuen Chung',
            'endyear': '',
            'notes': '',
            'endmonth': '',
            'datecertainty':
            'Exact',
            'city': 'San Francisco',
            'endday': ''
        },
        'type': 'Feature', 'id': '131'
    }
    assert feature == expected


def test_generate_deportee_properties():
    properties_data = [{'gsx$marriagestatus': {'$t': 'Single'}, 'gsx$citizenship': {'$t': 'China'}, 'gsx$documentrefernce': {'$t': 'Yuen Chung - 17; DSCN7735.JPG'}, 'gsx$justificationforremovalsecondary': {'$t': ''}, 'gsx$ethnicity': {'$t': 'Chinese'}, 'link': [{'href': 'https://spreadsheets.google.com/feeds/list/1DdH4tBFFRlbk4kZ_oik6-M7jUJIrC1UtqYOs2yVy9-s/1/public/full/hps2g', 'rel': 'self', 'type': 'application/atom+xml'}], 'title': {'type': 'text', '$t': 'Yuen Chung'}, 'gsx$occupation3': {'$t': ''}, 'gsx$occupation2': {'$t': ''}, 'gsx$notesdocument': {'$t': ''}, 'gsx$casefilenumber': {'$t': '53855/23'}, 'gsx$justificationforremovalprimary': {'$t': 'Violation of Chinese Exclusion Act'}, 'content': {'type': 'text', '$t': 'uniqueid: 131, trainid: Eastbound January 1915, citizenship: China, ethnicity: Chinese, sex: M, birthyear: 1876, occupation1: Laborer, marriagestatus: Single, travelingwithchildrennumber: N, literate: N, justificationforremovalprimary: Violation of Chinese Exclusion Act, documentrefernce: Yuen Chung - 17; DSCN7735.JPG, aliasesothernames: Foh Ying, Yuen Hoy Yick, casefilenumber: 53855/23'}, 'gsx$sex': {'$t': 'M'}, 'gsx$name': {'$t': 'Yuen Chung'}, 'gsx$occupation1': {'$t': 'Laborer'}, 'gsx$birthyear': {'$t': '1876'}, 'gsx$birthmonth': {'$t': ''}, 'id': {'$t': 'https://spreadsheets.google.com/feeds/list/1DdH4tBFFRlbk4kZ_oik6-M7jUJIrC1UtqYOs2yVy9-s/1/public/full/hps2g'}, 'gsx$travelingwithchildrennumber': {'$t': 'N'}, 'gsx$literate': {'$t': 'N'}, 'gsx$uniqueid': {'$t': '131'}, 'gsx$justificationforremovaltertiary': {'$t': ''}, 'updated': {'$t': '2016-10-15T09:36:23.768Z'}, 'gsx$trainid': {'$t': 'Eastbound January 1915'}, 'gsx$birthdate': {'$t': ''}, 'gsx$aliasesothernames': {'$t': 'Foh Ying, Yuen Hoy Yick'}, 'category': [{'term': 'http://schemas.google.com/spreadsheets/2006#list', 'scheme': 'http://schemas.google.com/spreadsheets/2006'}]}]
    output = export.generate_deportee_properties(properties_data)
    expected = {'citizenship': 'China', 'travelingwithchildrennumber': 'N', 'literate': 'N', 'name': 'Yuen Chung', 'uniqueid': '131', 'justificationforremovalsecondary': '', 'occupation2': '', 'birthmonth': '', 'birthyear': '1876', 'sex': 'M', 'casefilenumber': '53855/23', 'documentrefernce': 'Yuen Chung - 17; DSCN7735.JPG', 'notesdocument': '', 'occupation1': 'Laborer', 'ethnicity': 'Chinese', 'trainid': 'Eastbound January 1915', 'marriagestatus': 'Single', 'aliasesothernames': 'Foh Ying, Yuen Hoy Yick', 'occupation3': '', 'justificationforremovalprimary': 'Violation of Chinese Exclusion Act', 'birthdate': '', 'justificationforremovaltertiary': ''}
    assert output == expected


def test_generate_deportee_properties_2():
    properties_data = "bad"
    output = export.generate_deportee_properties(properties_data)
    expected = {}
    assert output == expected


def test_export_output():
    import json
    file_path = 'tmp/test_export_output.json'  # tmp folder needed to be created
    output = {
        "filters": {
            "aliasesothernames": [
                "Alice Josephine Barry",
                "Angela Ferreri, Angela Ferrara",
                "Antonio Pontiliie, Antonio Pontierre"
            ],
            "birthdate": [
                "15",
                "20",
                "27",
                "30",
                "4"
            ]
        }
    }  # make this more realistic
    export.export_output(output, file_path=file_path)
    with open(file_path) as f:
        data = f.read()
    assert output == json.loads(data)


# check how the function deals with non json files and output,
# not sure if matters
def test_export_output_2():
    import json
    file_path = 'tmp/test_export_output_2.xml'
    notJsonOutput = 674
    try:
        export.export_output(notJsonOutput, file_path=file_path)
    except KeyError:
        assert True
    with open(file_path) as f:
        data = f.read()
    assert notJsonOutput == json.loads(data)


def test_generate_filters():
    import requests
    BASE_URL = (
        'https://spreadsheets.google.com/feeds/list/'
        '1DdH4tBFFRlbk4kZ_oik6-M7jUJIrC1UtqYOs2yVy9-s/{sheet}/public/full?alt=json'
    )
    PEOPLE_URL = BASE_URL.format(sheet=1)
    properties_data = requests.get(PEOPLE_URL).json()['feed']['entry']  # retrieve data from spreadsheet
    output = {"filters": export.generate_filters(properties_data)}
    assert len(output['filters']) == 22  # the number of different filters in spreadsheet, errm not sure how else to test
