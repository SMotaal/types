# @smotaal.io

## Package Scripts

### `prepare`

> The prepare script will be run before publishing, so that users can consume the functionality without requiring them to compile it themselves. In dev mode (ie, locally running npm install), it’ll run this script as well, so that you can test it easily.

```json
{
  "scripts": {
    "prepare": "node -e \"$npm_package_scripts_prepare_node\"",
    "prepare@node": "child_process.exec('npm ls --json').stdout.pipe(fs.createWriteStream('packages.json', {flags: 'w'}))",
    "prepare@sh": "npm ls --json >| packages.json || true",
    "prepare@zsh": "npm ls --json >! packages.json || true"
  }
}
```
