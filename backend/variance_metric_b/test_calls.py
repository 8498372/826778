import unittest
from unittest.mock import patch
from index import handler, variance_metric_b

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

        with patch('index.variance_metric_b', return_value='[{"date": "2023-06-30","average_prevalence": 0.37098076516342515, "prevalence_variance": 0.023467528928487677},{"date": "2023-06-29", "average_prevalence": 0.37804659517617833,"prevalence_variance": 0.022824611793914467}]'):
            response = handler(event, context)
        self.assertEqual(response["statusCode"], 200)
        self.assertIn("average_prevalence", response["body"])  

    @patch('index.create_engine', return_value=None)
    @patch('index.sessionmaker')
    def test_invalid_country_code(self, mock_sessionmaker, mock_create_engine):
        event = {
            "queryStringParameters": {
                "c_id": "XYZ"
            }
        }
        context = {}

        with patch('index.variance_metric_b', return_value='[]'):
            response = handler(event, context)

        self.assertEqual(response["statusCode"], 404)
        self.assertEqual(response["body"], "Country not found")

if __name__ == '__main__':
    unittest.main()
