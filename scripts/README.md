# Scripts

These scripts can be used to push a deployment to MFM, if you have valid credentials. Usually changes should go through a pull request, and let the workflow handle build and deployment. These scripts are here as documentation, to help illustrate what the workflow is actually doing, and also as an escape hatch if you need to push a hotfix without waiting for a PR merge.

Be careful, as using these will affect the production instance. Test your build locally before deploying.

The upload step uses `rsync --delete-after`, so the server becomes an exact mirror of `build/`: files that no longer exist in the build are deleted from the server, after the new files have been uploaded. Anything on the server under `MFM_SCP_PATH` that is not in `build/` will be removed. Both scripts refuse to run if `MFM_SCP_PATH` is empty, and need `rsync` installed locally.

To see what would be added and deleted without changing anything, set `DRY_RUN=true`. Do this first if you are unsure.

`DRY_RUN=true mise exec -- bash .\scripts\deploy.sh`

or on Windows

`$env:DRY_RUN = "true"; mise exec -- pwsh .\scripts\deploy.ps1`

In the output, lines starting with `*deleting` are files that would be removed.

If you are using `mise`, you can run these scripts using environment variables from a local `.env` file.

`mise exec -- bash .\scripts\deploy.sh`

or on Windows

`mise exec -- pwsh .\scripts\deploy.ps1`

and the `.env` in your project root might look like

```
export MFM_USER=
export MFM_PASSWORD=
export MFM_SSH_KEY_PATH=path\\to\\key
export MFM_SSH_HOST=shell.mayfirst.org
export MFM_SSH_PORT=22
export MFM_SCP_PATH=web
```
