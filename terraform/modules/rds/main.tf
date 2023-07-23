# Create the RDS instance
resource "aws_db_instance" "postgres_instance" {
  identifier             = "test"  # Replace with your desired DB instance identifier
  engine                 = "postgres"
  instance_class         = "db.t3.micro"  # Replace with your desired instance type
  allocated_storage      = 20  # Replace with your desired storage size (in GB)
  storage_type           = "gp3"
  username               = "${var.username}"  # Replace with your desired database username
  password               = "${var.password}"  # Replace with your desired database password
  db_name                   = "postgres"  # Replace with your desired database name
  parameter_group_name   = "default.postgres14"  # Replace with your desired parameter group
  backup_retention_period = 7  # Replace with the number of days to retain backups

  # Replace the following values with your preferred maintenance window schedule
  maintenance_window = "Mon:03:00-Mon:04:00"
  skip_final_snapshot = true  # Change this to false if you want a final snapshot upon termination
  tags = {
    Name = "My PostgreSQL Database"
  }
}
