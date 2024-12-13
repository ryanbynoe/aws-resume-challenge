output "lambda_function_url" {
  description = "Lambda Function URL"
  value       = aws_lambda_function_url.url1.url_id
}