# Supabase
```shell
export SUPABASE_ACCESS_TOKEN="sbp_xxxxx"
export TF_VAR_supabase_organization_slug="your-org-slug"
export TF_VAR_supabase_database_password="your-db-password"
```

# Vercel
```shell
export VERCEL_API_TOKEN="xxxxxxxx"
export TF_VAR_database_url='postgresql://...'
export TF_VAR_better_auth_secret="$(openssl rand -base64 32)"
```
