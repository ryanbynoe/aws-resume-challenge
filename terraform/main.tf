# Lambda Function
resource "aws_lambda_function" "visitor_function" {
  filename         = data.archive_file.zip.output_path
  source_code_hash = data.archive_file.zip.output_base64sha256
  function_name    = "visitor_function"
  role            = aws_iam_role.iam_lambda_tf.arn
  handler         = "visitor.handler"
  runtime         = "python3.13"  # Change as needed

}

resource "aws_iam_role" "iam_lambda_tf" {
  name = "iam_lambda_tf_v2"
  
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "resume_policy" {
  name        = "terraform_resume_policy_v2"
  path        = "/"
  description = "AWS IAM Policy for managing the resume project role"
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource": "arn:aws:logs:*:*:*",
        "Effect": "Allow"
      },
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Scan"  
        ],
        "Resource": "arn:aws:dynamodb:us-east-1:586794466344:table/Visitors" 
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role = aws_iam_role.iam_lambda_tf.name
  policy_arn = aws_iam_policy.resume_policy.arn
  
}

data "archive_file" "zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/visitor.py"
  output_path = "${path.module}/lambda/visitor.zip"
}

resource "aws_lambda_function_url" "url1" {
  function_name      = aws_lambda_function.visitor_function.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}