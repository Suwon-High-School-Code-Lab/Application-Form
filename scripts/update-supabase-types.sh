#!/usr/bin/env bash
set -e

mkdir -p src/lib/types

npx supabase gen types \
  --lang=typescript \
  --project-id "$PROJECT_REF" \
  >src/lib/types/database.types.ts