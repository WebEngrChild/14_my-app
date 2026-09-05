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

/*
 Vercel
*/
variable "database_url" {
  type      = string
  sensitive = true
}

variable "better_auth_secret" {
  type      = string
  sensitive = true
}

variable "better_auth_url" {
  type = string
}
