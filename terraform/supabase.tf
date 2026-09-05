resource "supabase_project" "main" {
  organization_id   = var.supabase_organization_slug
  name              = "my-app"
  database_password = var.supabase_database_password
  region            = "ap-northeast-1"

  lifecycle {
    ignore_changes = [
      database_password
    ]
  }
}
