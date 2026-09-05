terraform {
  required_version = ">= 1.11.0"

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "1.10.1"
    }

    vercel = {
      source  = "vercel/vercel"
      version = "~> 5.14"
    }
  }
}

provider "supabase" {}

provider "vercel" {}
