import export


def test_offset_date():
    assert export.offset_date('05', '01', '1991', 5) == '1996-01-05'


def test_date_certainty():
    assert export.date_certainty('05', '01', '1991') == 'Exact'


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


def test_generate_deportee_features():
    pass  # Todo


def test_generate_feature():
    pass  # Todo


def test_generate_deportee_properties():
    pass  # Todo


def test_export_output():
    import json
    file_path = '/tmp/test_export_output.json'
    output = {'a': '1', 'b': '2', 'c': '3'}  # make this more realistic
    export.export_output(output, file_path=file_path)
    with open(file_path) as f:
        data = f.read()
    assert output == json.loads(data)


def test_generate_filters():
    pass  # Todo
