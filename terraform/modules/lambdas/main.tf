resource "aws_lambda_function" "retrieve_data" {
  function_name = "retrieve_hungermap_data"
  handler = "index.handler"  # Replace with your Python function and handler
  runtime = "python3.10"
  filename = "${var.retrieve_hungermap_data_lambda}"  # Replace with the path to your Python code ZIP file
  role = aws_iam_role.lambda_execution.arn
  timeout = 600  # Increase the timeout to 10 minutes (600 seconds)
  environment {
    variables = {
      DB_HOST     = "${var.db_host}"
      DB_NAME     = "${var.db_name}"
      DB_USER     = "${var.db_user}"
      DB_PASSWORD = "${var.db_password}"
      # Add other environment variables if needed
    }
  }
  vpc_config {
    subnet_ids         = ["subnet-892fcce0", "subnet-ba676ac2", "subnet-2fa78b65"]  # Replace with your desired subnet IDs
    security_group_ids = ["sg-bfd328d4"]  # Replace with your desired security group IDs
  }
}

resource "aws_lambda_function" "average_monthly_value" {
  function_name = "average_monthly_value"
  handler = "index.handler"  # Replace with your Python function and handler
  runtime = "python3.10"
  filename = "${var.average_monthly_value_lambda}"  # Replace with the path to your Python code ZIP file
  role = aws_iam_role.lambda_execution.arn
  timeout = 30 
  layers = ["arn:aws:lambda:eu-south-1:744297168338:layer:sqlalchemy:1"]
  environment {
    variables = {
      DB_HOST     = "${var.db_host}"
      DB_NAME     = "${var.db_name}"
      DB_USER     = "${var.db_user}"
      DB_PASSWORD = "${var.db_password}"
      # Add other environment variables if needed
    }
  }
  vpc_config {
    subnet_ids         = ["subnet-892fcce0", "subnet-ba676ac2", "subnet-2fa78b65"]  # Replace with your desired subnet IDs
    security_group_ids = ["sg-bfd328d4"]  # Replace with your desired security group IDs
  }
}

output "average_monthly_value" {
  value = aws_lambda_function.average_monthly_value.invoke_arn
}

resource "aws_lambda_function" "daily_national_estimate" {
  function_name = "daily_national_estimate"
  handler = "index.handler"  # Replace with your Python function and handler
  runtime = "python3.10"
  filename = "${var.daily_national_estimate_lambda}"  # Replace with the path to your Python code ZIP file
  role = aws_iam_role.lambda_execution.arn
  timeout = 30
  layers = ["arn:aws:lambda:eu-south-1:744297168338:layer:sqlalchemy:1"]
  environment {
    variables = {
      DB_HOST     = "${var.db_host}"
      DB_NAME     = "${var.db_name}"
      DB_USER     = "${var.db_user}"
      DB_PASSWORD = "${var.db_password}"
      # Add other environment variables if needed
    }
  }
  vpc_config {
    subnet_ids         = ["subnet-892fcce0", "subnet-ba676ac2", "subnet-2fa78b65"]  # Replace with your desired subnet IDs
    security_group_ids = ["sg-bfd328d4"]  # Replace with your desired security group IDs
  }
}

output "daily_national_estimate" {
  value = aws_lambda_function.daily_national_estimate.invoke_arn
}

resource "aws_lambda_function" "variance_metric_b" {
  function_name = "variance_metric_b"
  handler = "index.handler"  # Replace with your Python function and handler
  runtime = "python3.10"
  filename = "${var.variance_metric_b_lambda}"  # Replace with the path to your Python code ZIP file
  role = aws_iam_role.lambda_execution.arn
  timeout = 30
  layers = ["arn:aws:lambda:eu-south-1:744297168338:layer:sqlalchemy:1"]
  environment {
    variables = {
      DB_HOST     = "${var.db_host}"
      DB_NAME     = "${var.db_name}"
      DB_USER     = "${var.db_user}"
      DB_PASSWORD = "${var.db_password}"
      # Add other environment variables if needed
    }
  }
  vpc_config {
    subnet_ids         = ["subnet-892fcce0", "subnet-ba676ac2", "subnet-2fa78b65"]  # Replace with your desired subnet IDs
    security_group_ids = ["sg-bfd328d4"]  # Replace with your desired security group IDs
  }
}

output "variance_metric_b" {
  value = aws_lambda_function.variance_metric_b.invoke_arn
}


resource "aws_iam_role" "lambda_execution" {
  name = "lambda-execution-db-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_execution_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role = aws_iam_role.lambda_execution.name
}

resource "aws_iam_role_policy_attachment" "lambda_rds_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonRDSDataFullAccess"  # Replace with a suitable RDS access policy
  role       = aws_iam_role.lambda_execution.name
}

resource "aws_iam_role_policy_attachment" "lambda_network_interface_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"  # AWS-managed policy with CreateNetworkInterface permission
  role       = aws_iam_role.lambda_execution.name
}
