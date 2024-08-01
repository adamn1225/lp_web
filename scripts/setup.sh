#!/bin/bash

# Exit on error
set -e

# Print commands
set -x

# Ensure the script is run from the project root
cd "$(dirname "$0")"

# Install project dependencies
pnpm install

# Build the project
pnpm build

# Additional setup steps
# For example, setting up environment variables
echo "VITE_API_TOKEN=${VITE_API_TOKEN}" > .env.development

# Print a success message
echo "Setup completed successfully."