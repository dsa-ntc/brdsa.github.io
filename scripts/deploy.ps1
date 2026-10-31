# Check for necessary programs
if (-not (Get-Command curl -ErrorAction SilentlyContinue)) {
    Write-Error "Please install curl." -ErrorAction Stop
}
if (-not (Get-Command jq -ErrorAction SilentlyContinue)) {
    Write-Error "Please install jq." -ErrorAction Stop
}
if (-not (Get-Command rsync -ErrorAction SilentlyContinue)) {
    Write-Error "Please install rsync." -ErrorAction Stop
}

# --delete against an empty remote path would target the login home
if ([string]::IsNullOrEmpty($env:MFM_SCP_PATH)) {
    Write-Error "MFM_SCP_PATH is empty, refusing to run --delete." -ErrorAction Stop
}

# Connect to MFM to ensure shell access is active
$url = "https://members.mayfirst.org/cp/api.php"
$user = $env:MFM_USER
$password = $env:MFM_PASSWORD

$out = curl --silent "${url}" -X POST `
    -d "user_name=$user" -d "user_pass=$password" `
    -d "action=grant"

$exit = $out | jq .is_error
if ($exit -ne 0) {
    $out | jq
    exit 1
}

# Build website
npm run build

# Copy build to MFM server

# Get the file path from the env variable, then read its content
Get-Content -Path $env:MFM_SSH_KEY_PATH | Out-File -FilePath __TEMP_INPUT_KEY_FILE -Encoding ascii

# The rest of your ACL commands are perfect and should stay as they are.
icacls __TEMP_INPUT_KEY_FILE /reset
icacls __TEMP_INPUT_KEY_FILE /inheritance:r
icacls __TEMP_INPUT_KEY_FILE /grant:r "$env:USERNAME`:R"

# If you have the passphrase in an environment variable
$passphrase = $env:MFM_SSH_PASSPHRASE

# Use echo to pipe the passphrase to ssh-add
echo $passphrase | ssh-add __TEMP_INPUT_KEY_FILE

# Mirror build to MFM server. rsync --delete removes files that are no longer
# in the build; --delete-after keeps the old site up until the new files land.
# Set $env:DRY_RUN = "true" to only list what would change.
try {
    $dry = @()
    if ($env:DRY_RUN -eq "true") {
        $dry = @("-n")
        Write-Host "Dry run, nothing will be changed on the server."
    }

    # TODO: Windows rsync is usually the Git Bash or WSL one, which wants POSIX
    # paths (/c/Users/...) for the key file. Verify -e and the key path work.
    rsync -rltz --delete-after --itemize-changes @dry `
        -e "ssh -i __TEMP_INPUT_KEY_FILE -p $env:MFM_SSH_PORT -o StrictHostKeyChecking=accept-new" `
        build/ "${env:MFM_USER}@${env:MFM_SSH_HOST}:${env:MFM_SCP_PATH}/"
}
finally {
    Remove-Item __TEMP_INPUT_KEY_FILE
}