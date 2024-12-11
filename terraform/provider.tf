terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.80.0"
    }
  }
}

provider "aws" {
  profile = "PowerUserAccess-586794466344"
  region  = "us-east-1"
}