# Scripts

These scripts can be used to push a deployment to MFM, if you have valid credentials. Usually changes should go through a pull request, and let the workflow handle build and deployment. These scripts are here as documentation, to help illustrate what the workflow is actually doing, and also as an escape hatch if you need to push a hotfix without waiting for a PR merge.

Be careful, as using these will affect the production instance. Test your build locally before deploying.

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
