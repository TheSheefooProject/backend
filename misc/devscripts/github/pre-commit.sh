#!/bin/sh
# This script when enabled will prevent the developer from pushing directly to main or production!
# That is without getting a PR approved.


branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "main" ] || [ "$branch" = "production" ]; then
  echo "You can't commit directly to master branch"
  exit 1
fi