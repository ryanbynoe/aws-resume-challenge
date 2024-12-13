locals {
  role_version = try(data.aws_iam_role.existing_role[0].name, "") != "" ? "v3" : "v2"
  policy_version = try(data.aws_iam_role.existing_role[0].name, "") != "" ? "v3" : "v2"
}