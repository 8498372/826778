resource "aws_s3_bucket" "my-bucket" {
  bucket = "826778" 
  acl = "private" 
}

resource "aws_cloudfront_distribution" "my_distribution" {
  enabled         = true
  is_ipv6_enabled = true
  origin {
    domain_name = aws_s3_bucket.my-bucket.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.my-bucket.id}"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    target_origin_id = "S3-${aws_s3_bucket.my-bucket.id}"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 7200
    max_ttl                = 86400
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

}
