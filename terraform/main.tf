# Define the provider block for AWS
provider "aws" {
  region = "eu-south-1"  # Change this to your desired AWS region
  # Add any additional configuration for your AWS provider if needed
}

# Define variables to make the configuration more flexible
variable "aws_region" {
  default = "eu-south-1"
}

module "rds" {
  source = "./modules/rds"
  password = var.db_pwd
  username = var.db_user
}

module "lambdas" {
  source = "./modules/lambdas"
  db_host = var.db_host
  db_user = var.db_user
  db_password = var.db_pwd
  db_name = var.db_name
  retrieve_hungermap_data_lambda = var.retrieve_hungermap_data_lambda
  average_monthly_value_lambda = var.average_monthly_value_lambda
  daily_national_estimate_lambda = var.daily_national_estimate_lambda
  variance_metric_b_lambda = var.variance_metric_b_lambda
}


module "apigtw" {
  source = "./modules/apigtw"
  average_monthly_value_lambda_arn    = module.lambdas.average_monthly_value
  daily_national_estimate_lambda_arn    = module.lambdas.daily_national_estimate
  variance_metric_b_lambda_arn    = module.lambdas.variance_metric_b
}

module "fe" {
  source = "./modules/fe"
}
