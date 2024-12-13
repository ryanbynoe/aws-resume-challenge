variable "dynamo_db_arn" {
    type = string
  
}

variable "domain_name" {
  description = "My domain name"
  type        = string
}

variable "bucket_name" {
  description = "Name of the S3 bucket hosting your resume"
  type        = string
}