import unittest
from unittest.mock import patch
from index import handler, retrieve_average_monthly_value

class TestLambdaFunction(unittest.TestCase):
    @patch('index.create_engine', return_value=None)
    @patch('index.sessionmaker')
    def test_valid_country_code(self, mock_sessionmaker, mock_create_engine):
        event = {
            "queryStringParameters": {
                "c_id": "AAA"
            }
        }
        context = {}

        with patch('index.retrieve_average_monthly_value', return_value='[{"region_name": "Region 1", "month": "2022-06", "avg_fcs": 0.5, "avg_rcsi": 0.5, "avg_market_access": 0.5, "avg_health_access": 0.5}]'):
            response = handler(event, context)
        self.assertEqual(response["statusCode"], 200)
        self.assertIn("avg_fcs", response["body"])  

    @patch('index.create_engine', return_value=None)
    @patch('index.sessionmaker')
    def test_invalid_country_code(self, mock_sessionmaker, mock_create_engine):
        event = {
            "queryStringParameters": {
                "c_id": "XYZ"
            }
        }
        context = {}

        with patch('index.retrieve_average_monthly_value', return_value='[]'):
            response = handler(event, context)

        self.assertEqual(response["statusCode"], 404)
        self.assertEqual(response["body"], "Country not found")

if __name__ == '__main__':
    unittest.main()
