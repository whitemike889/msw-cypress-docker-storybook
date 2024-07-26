#!/usr/bin/env bash

# This method is used in this file to spit out our custom error messages and exit the script with error code 1
error_exit()
{
  echo "$1" 1>&2
  exit 1
}

# remove previous diffs
find packages/storybook/cypress -type d -name "__diff_output__" -exec rm -rf {} +

# build the app
npx nx run-many --target=build --exclude=test-repo,@aislinn/storybook &
B_PID=$!

wait $B_PID

if [ $? -ne 0 ]; then
  error_exit "build failed"
fi

# Cleaning Storybook
npx nx run @aislinn/storybook:clean &
SBC_PID=$!

echo "Cleaning Storybook $SBC_PID"
wait $SBC_PID

if [ $? -ne 0 ]; then
  error_exit "Cleaning Storybook failed"
fi

# Rebuilding Storybook
export STORYBOOK_ORIGIN='.'
npx nx run @aislinn/storybook:build-storybook --skip-nx-cache  &
SB_PID=$!

echo "building Storybook $SB_PID"

# Wait until storybook is rebuilt
wait $SB_PID

if [ $? -ne 0 ]; then
  error_exit "Building Storybook failed"
fi

export CYPRESS_VERSION=$(npx cypress version --component binary) 
export NODE_VERSION=$(cat .nvmrc | tr -d 'v') 

# JENKINS_URL is an env attribute provided by Jenkins in the CI pipeline
isJenkins="${JENKINS_URL}"

IS_PIPELINE=""
# -z returns true if length of string is 0, otherwise returns false
if [[ ! -z "$isJenkins" ]]; then
  IS_PIPELINE="true"
  echo "Visual regression tests running in CI pipeline..."
else
  echo "Visual regression tests running locally..."
fi

# Check if we want to update snapshots from the command line arguments
if [[ ! -z "${IS_UPDATE}" ]]; then
  echo "Snapshots will be updated..."
else
  echo "Snapshots will not be updated..."
fi

# Only do basic setup on local machines
if [[ -z "$IS_PIPELINE" ]]; then

  # Check if Docker is installed
  if [ -x "$(command -v docker)" ]; then
      echo "Docker Installed! Please ensure you have the latest version of Docker Desktop."
  else
      error_exit "Install Docker: https://docs.docker.com/docker-for-mac/install/"
  fi

  # This block should open Docker automatically if it's not already running, but sometimes it doesn't work locally :shakes-fist:
  if (! docker stats --no-stream ); then
    # On Mac OS this would be the terminal command to launch Docker
    open /Applications/Docker.app
    # Wait until Docker daemon is running and has completed initialisation
    while (! docker stats --no-stream ); do
      # Docker takes a few seconds to initialize
      echo "If Docker doesn't open automatically, please launch it manually now..."
      sleep 5
    done
  fi

  # Log into docker repo automatically and stop the script if the login fails
  if docker login; then
      : # If login works, do nothing, as this command will spit out a "Login Succeeded" message anyway
  else
      error_exit "Please login to docker to use this script."
  fi
fi

# Running visual regression tests and exiting docker on receiving the exit code from cypress
docker compose up --renew-anon-volumes --exit-code-from cypress
