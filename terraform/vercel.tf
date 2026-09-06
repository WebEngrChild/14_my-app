resource "vercel_project" "web" {
  name           = "my-app"
  framework      = "nextjs"
  root_directory = "apps/web"

  git_repository = {
    type              = "github"
    repo              = "WebEngrChild/14_my-app"
    production_branch = "main"
  }
}

resource "vercel_project_environment_variable" "database_url" {
  project_id = vercel_project.web.id

  key              = "DATABASE_URL"
  value_wo         = var.database_url
  value_wo_version = 2

  target    = ["production"]
  sensitive = true
}

resource "vercel_project_environment_variable" "better_auth_secret" {
  project_id = vercel_project.web.id

  key              = "BETTER_AUTH_SECRET"
  value_wo         = var.better_auth_secret
  value_wo_version = 2

  target    = ["production"]
  sensitive = true
}

resource "vercel_project_environment_variable" "better_auth_url" {
  project_id = vercel_project.web.id

  key   = "BETTER_AUTH_URL"
  value = var.better_auth_url

  target    = ["production"]
  sensitive = false
}
