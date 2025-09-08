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

# Copy build to MFM server
echo "${MFM_SSH_KEY_PATH}" >__TEMP_INPUT_KEY_FILE
chmod 600 __TEMP_INPUT_KEY_FILE

scp -o StrictHostKeyChecking=no -v \
  -i __TEMP_INPUT_KEY_FILE -P "${MFM_SSH_PORT}" \
  -r ./build/* "${MFM_USER}"@"${MFM_SSH_HOST}":"${MFM_SCP_PATH}"

rm __TEMP_INPUT_KEY_FILE