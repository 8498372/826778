resource "aws_api_gateway_rest_api" "api_gateway" {
  name = "api_gateway"
}

## start - resource_average_monthly_value
resource "aws_api_gateway_resource" "resource_average_monthly_value" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  path_part   = "amv"
}

resource "aws_api_gateway_method" "method_average_monthly_value" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.resource_average_monthly_value.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration_average_monthly_value" {
  rest_api_id             = aws_api_gateway_rest_api.api_gateway.id
  resource_id             = aws_api_gateway_resource.resource_average_monthly_value.id
  http_method             = aws_api_gateway_method.method_average_monthly_value.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.average_monthly_value_lambda_arn}"
}

resource "aws_api_gateway_deployment" "average_monthly_value" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  stage_name  = "DEV"
    depends_on = [
    aws_api_gateway_integration.integration_average_monthly_value,
  ]
}

resource "aws_lambda_permission" "apigw_processor_average_monthly_value" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "average_monthly_value"
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/*/*"
}

#stop - resource_average_monthly_value

## start - daily_national_estimate
resource "aws_api_gateway_resource" "resource_daily_national_estimate" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  path_part   = "dne"
}

resource "aws_api_gateway_method" "method_daily_national_estimate" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.resource_daily_national_estimate.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration_daily_national_estimate" {
  rest_api_id             = aws_api_gateway_rest_api.api_gateway.id
  resource_id             = aws_api_gateway_resource.resource_daily_national_estimate.id
  http_method             = aws_api_gateway_method.method_daily_national_estimate.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.daily_national_estimate_lambda_arn}"
}

resource "aws_api_gateway_deployment" "daily_national_estimate" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  stage_name  = "DEV"
    depends_on = [
    aws_api_gateway_integration.integration_daily_national_estimate,
  ]
}

resource "aws_lambda_permission" "apigw_processor_daily_national_estimate" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "daily_national_estimate"
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/*/*"
}

#stop - daily_national_estimate


## start - variance_metric_b
resource "aws_api_gateway_resource" "resource_variance_metric_b" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  path_part   = "vmb"
}

resource "aws_api_gateway_method" "method_variance_metric_b" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.resource_variance_metric_b.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration_variance_metric_b" {
  rest_api_id             = aws_api_gateway_rest_api.api_gateway.id
  resource_id             = aws_api_gateway_resource.resource_variance_metric_b.id
  http_method             = aws_api_gateway_method.method_variance_metric_b.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${var.variance_metric_b_lambda_arn}"
}

resource "aws_api_gateway_deployment" "variance_metric_b" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  stage_name  = "DEV"
    depends_on = [
    aws_api_gateway_integration.integration_variance_metric_b,
  ]
}

resource "aws_lambda_permission" "apigw_processor_variance_metric_b" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "variance_metric_b"
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/*/*"
}

#stop - variance_metric_b