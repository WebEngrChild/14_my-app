/*
 Supabase
*/
variable "supabase_organization_slug" {
  type = string
}

variable "supabase_database_password" {
  type      = string
  sensitive = true
}
