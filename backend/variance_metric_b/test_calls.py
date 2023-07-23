from .index import handler


def test_response():
    result = handler({}, None)

    status_code = result['statusCode']
    assert status_code == 404