[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![CircleCI](https://circleci.com/gh/umm-projects/scripts/tree/master.svg?style=svg)](https://circleci.com/gh/umm-projects/scripts/tree/master)

# scripts

Scripts for umm modules.

## Script list

* init
* module/install
* module/uninstall
* project/deploy
* project/remove

## Library list

* info
* synchronize

## Usage

### package.json

#### Normal

```json
{

  "scripts": {
    "umm:init": "$(npm bin)/umm-init",
    "umm:module:install": "$(npm bin)/umm-module-install",
    "umm:module:uninstall": "$(npm bin)/umm-module-uninstall",
    "postinstall": "npm run --silent umm:install",
    "postuninstall": "npm run --silent umm:uninstall"
  },

}
```

* Automatic deployment by `umm:module:install`.
* Copy assets to `Assets/Modules/<module_name>/` from `Assets/` in modules excepts listed in `.npmignore`.

#### Customized

```json
{

  "scripts": {
    "umm:init": "$(npm bin)/umm-init",
    "umm:module:install": "$(npm bin)/umm-module-install",
    "umm:module:uninstall": "$(npm bin)/umm-module-uninstall",
    "postinstall": "npm run --silent umm:install && node ./scripts/postinstall.js",
    "postuninstall": "npm run --silent umm:uninstall"
  },

}
```

* Append calling script into `postinstall` section if you need to customized deploy.

#### Deploy as sub project

```json
{

  "scripts": {
    "umm:init": "$(npm bin)/umm-init",
    "umm:project:deploy": "$(npm bin)/umm-project-deploy",
    "umm:project:remove": "$(npm bin)/umm-project-remove",
    "postinstall": "npm run --silent project:deploy",
    "postuninstall": "npm run --silent project:remove"
  },

}
```

* Automatic deployment by `umm:project:deploy`
* Copy assets to `Assets/Projects/<module_name>/` from `Assets/` in modules excepts listed in `.npmignore`.

### Sample for `postinstall.js`

```javascript
const umm = require('@umm/scripts');

umm.libraries.synchronize("path/to/source", "path/to/destination");
```

## Signature

### `libraries.synchronize(source_path, destination_path, [patterns], [overwrite_options], [callback])`

* Synchronize assets flexiblly.

#### Arguments of `libraries.synchronize`

| Argument | Type | Description |
| --- | --- | --- |
| source_path | `{String}` | Copy source path |
| destination_path | `{String}` | Copy destination path |
| patterns | `{Array<String|Object>}` | Specification patterns as array of string or object |
| overwrite_options | `{Object}` | Overwrite default options |
| callback | `{Function}` | Callback function |

##### Details of patterns

| Key | Type | Description | Default |
| --- | --- | --- | --- |
| pattern | `{String}` | Designation patterns as glob. | - |
| overwrite | `{Boolean}` | Overwrite files if already exists. | true |
| remove_source | `{Boolean}` | Remove source files when finish copy. | false |
| remove_empty_source_directory | `{Boolean}` | Remove empty directory in source path after finish processing `remove_source`. | false |
| remove_deleted_files | `{Boolean}` | Remove files that do not exist on the source path. | false |

##### Details of overwrite_options

* Parameters are ignored if specified by patterns.

| Key | Type | Description | Default |
| --- | --- | --- | --- |
| overwrite | `{Boolean}` | Overwrite files if already exists. | true |
| remove_source | `{Boolean}` | Remove source files when finish copy. | false |
| remove_empty_source_directory | `{Boolean}` | Remove empty directory in source path after finish processing `remove_source`. | false |
| remove_deleted_files | `{Boolean}` | Remove files that do not exist on the source path. | false |

### `libraries.info`

* Information of module as JavaScript `Object`.

#### Details of `libraries.info`

| Key | Type | Description |
| --- | --- | --- |
| npm_package_name | `{String}` | Name of npm package. |
| has_scope | `{Boolean}` | Package name has scope? (Package name has `@` character if scoped.) |
| development_install | `{Boolean}` | Set `true` if installation process is development. |
| module_name | `{String}` | Module name. |
| scope | `{String}` | Scope of module. |
| name | `{String}` | Name of module. |
| package_path | `{String}` | Path to package install. |
| base_path | `{String}` | Path of project. |

#### Example

```javascript
{
  npm_package_name: "@umm/sample_module",
  has_scope: true,
  development_install: false,
  module_name: "umm@sample_module",
  scope: "umm",
  name: "sample_module",
  package_path: "/Users/monry/Development/git/monry/some_project/node_modules/@umm/sample_module",
  base_path: "/Users/monry/Development/git/monry/some_project",
}
```

# License

Copyright (c) 2018 Tetsuya Mori

Released under the MIT license, see [LICENSE.txt](LICENSE.txt)
