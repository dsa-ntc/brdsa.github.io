#!/bin/sh

# Check for necessary programs
! which curl >/dev/null && printf "Please install curl.\n" && exit 1
! which jq >/dev/null && printf "Please install jq.\n" && exit 1

# Connect to MFM to ensure shell access is active
url=https://members.mayfirst.org/cp/api.php
user="$MFM_USER"
password="$MFM_PASSWORD"

echo $MFM_USER

out=$(
  curl --silent "${url}" -X POST \
    -d "user_name=$user" -d "user_pass=$password" \
    -d "action=grant"
)
exit=$(echo "$out" | jq .is_error)
if [ "$exit" != "0" ]; then
  echo "$out" | jq
  exit 1
fi

# Build website
npm run build

# Mirror build to MFM server. rsync --delete removes files that are no longer
# in the build; --delete-after keeps the old site up until the new files land.
# Set DRY_RUN=true to only list what would change.
! which rsync >/dev/null && printf "Please install rsync.\n" && exit 1

# --delete against an empty remote path would target the login home
test -n "${MFM_SCP_PATH}" || {
  printf "MFM_SCP_PATH is empty, refusing to run --delete.\n"
  exit 1
}

# ssh refuses keys that other users can read, so work on a private copy
cp "${MFM_SSH_KEY_PATH}" __TEMP_INPUT_KEY_FILE
chmod 600 __TEMP_INPUT_KEY_FILE
trap 'rm -f __TEMP_INPUT_KEY_FILE' EXIT

dry=""
if [ "${DRY_RUN}" = "true" ]; then
  dry="-n"
  printf "Dry run, nothing will be changed on the server.\n"
fi

# $dry is intentionally unquoted so it vanishes when empty
rsync -rltz --delete-after --itemize-changes $dry \
  -e "ssh -i __TEMP_INPUT_KEY_FILE -p ${MFM_SSH_PORT} -o StrictHostKeyChecking=accept-new" \
  build/ "${MFM_USER}"@"${MFM_SSH_HOST}":"${MFM_SCP_PATH}"/