import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kkvkjlkefoaofnmxcpog.supabase.co"

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdmtqbGtlZm9hb2ZubXhjcG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI2OTUyMzUsImV4cCI6MTk5ODI3MTIzNX0.CYwYy8dVFV5atgDEYJ3zvouHNes9BqWoRngDVQNSzYQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)