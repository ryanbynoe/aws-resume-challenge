terraform {
  backend "s3" {
    bucket = "ryanbynoe-terraform-state"  
    key    = "resume/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-state-lock"
  }
}