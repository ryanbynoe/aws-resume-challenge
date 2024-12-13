# Check if role exists
data "aws_iam_role" "existing_role" {
  name = "iam_lambda_tf_v2"
  count = length(regexall(".*EntityAlreadyExists.*", try(aws_iam_role.iam_lambda_tf.id, ""))) > 0 ? 1 : 0
}

data "aws_acm_certificate" "resume_cert" {
  domain      = "ryanonacloud.com"
  statuses    = ["ISSUED"]
  most_recent = true
}

data "aws_route53_zone" "primary" {
  zone_id = "Z07898352V0DIDKH0QFL3"
}