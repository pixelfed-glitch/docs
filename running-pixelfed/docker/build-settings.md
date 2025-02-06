# Pixelfed + Docker customization

::: tip If anything is confusing, unclear, missing, or maybe even wrong on this page, then *please* let us know [by submitting a bug report](https://github.com/pixelfed-glitch/pixelfed/issues/new) :heart:
:::

::: tip Most, if not all, configuration options for both Pixelfed and Docker is included and documented in the `.env.docker` (or `.env` file once you copied it during the installation)
It's highly recommended to give it a read from top to bottom, or trying to search it for the thing you would like to change.

We of course aim for this page to cover *everything*, and if we missed anything, please submit a Pull Request or a ticket for us :heart:
:::

## Run script on startup (ENTRYPOINT)

When a Pixelfed container starts up, the [`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) script will

1. Search the `/docker/entrypoint.d/` directory for files and for each file (in lexical order).
1. Check if the file is executable.
    1. If the file is *not* executable, print an error and exit the container.
1. If the file has the extension `.envsh`, the file will be [sourced](https://superuser.com/a/46146).
1. If the file has the extension `.sh`, the file will be run like a regular script.
1. Any other file extension will log a warning and be ignored.

### Debugging

You can set the environment variable `DOCKER_APP_ENTRYPOINT_DEBUG=1` to show the verbose output of each `entrypoint.d` script is doing.

### Included scripts

* `01-permissions.sh` (optionally) ensures permissions for files are corrected (see [fixing ownership on startup](#fixing-ownership-on-startup)).
* `02-check-config.sh` Ensures your `.env` file is valid - like missing quotes or syntax errors.
* `04-defaults.envsh` calculates Docker container environment variables needed for [templating](#templating) configuration files.
* `05-templating.sh` renders [template](#templating) configuration files.
* `10-storage.sh` ensures Pixelfed storage related permissions and commands are run.
* `11-first-time-setup.sh` automatically runs all "one time setup" steps for a new Pixelfed server.
* `12-migrations.sh` optionally run database migrations on container start up.
* `20-horizon.sh` ensures [Laravel Horizon](https://laravel.com/docs/master/horizon) used by Pixelfed is configured.
* `30-cache.sh` ensures all Pixelfed caches (router, view, config) are primed.

### Disabling `ENTRYPOINT` or individual scripts

To disable the entire `ENTRYPOINT` you can set the variable `ENTRYPOINT_SKIP_SCRIPTS=any`.

To disable individual `ENTRYPOINT` scripts, you can add the filename to the space (`" "`) separated variable `ENTRYPOINT_SKIP_SCRIPTS`. (example: `ENTRYPOINT_SKIP_SCRIPTS="10-storage.sh 30-cache.sh"`)

::: warning
Be weary that the `web` container will still need to run `04-defaults.envsh` and `05-templating.sh` at the bare minimum, to have all files and variables ready.

You can run those like this :
`ENTRYPOINT_SKIP_SCRIPTS="04-defaults.envsh 05-templating.sh"`
:::

## Override anything and everything

::: tip
With the default Pixelfed `docker-compose.yml` the `overrides` bind mount is enabled by default for both `web` and `worker` service.

The `overrides` folder on the host machine is in `./docker-compose-state/overrides` and can be changed via `DOCKER_APP_HOST_OVERRIDES_PATH` in the `.env` file.
:::

If you mount a bind volume (can be read-only) in `/docker/overrides` then all files and directories within that directory will be copied on top of `/`.

This enables you to create or override *anything* within the container during container startup.

The copy operation happens as one of the first things in the `ENTRYPOINT` so you can put even override [templates](#templating) and the [included `ENTRYPOINT` scripts](#run-script-on-startup-entrypoint) - or add new ones!

Of course it can also be used to override `php.ini`, `index.php` or any other config/script files you would want to.

### Override examples

1. To override `/usr/local/etc/php/php.ini` in the container, put the source file in `./docker-compose-state/overrides/usr/local/etc/php/php.ini`.
1. To create `/a/fantastic/example.txt` in the container put the source file in `./docker-compose-state/overrides/a/fantastic/example.txt`.
1. To override the default `/docker/templates/php.ini` template, put the source file in `./docker-compose-state/overrides/docker/templates/php.ini`.
1. To override `/a/path/inside/the/container`, put the source file in `./docker-compose-state/overrides/a/path/inside/the/container`.

## Templating

The Docker container can do some basic templating (more like variable replacement) as part of the entrypoint scripts via [gomplate](https://docs.gomplate.ca/).

Any file in the `/docker/templates/` directory will be templated and written to the proper directory.

### File path examples

1. To template `/usr/local/etc/php/php.ini` in the container, put the source file in `/docker/templates/usr/local/etc/php/php.ini`.
1. To template `/a/fantastic/example.txt` in the container put the source file in `/docker/templates/a/fantastic/example.txt`.
1. To template `/some/path/anywhere` in the container, put the source file in `/docker/templates/some/path/anywhere`.

### Available variables

Variables available for templating are sourced (in order, so *last* source takes precedence) like this:

1. `env:` in your `docker-compose.yml` or `-e` in your `docker run` / `docker compose run` commands.
1. Any exported variables in `.envsh` files loaded *before* `05-templating.sh` (e.g., any file with `04-`, `03-`, `02-`, `01-` or `00-` prefix).
1. All key and value pairs in `/var/www/.env.docker` (default values, you should not edit this file!)
1. All key and value pairs in `/var/www/.env`.

### Template guide 101

Please see the [`gomplate` documentation](https://docs.gomplate.ca/) for a comprehensive overview.

The most frequent use case you have is likely to print an environment variable (or a default value if it's missing), so this is how to do that:

* <code v-pre>{{ getenv "VAR_NAME" }}</code> print an environment variable and **fail** if the variable is not set. ([docs](https://docs.gomplate.ca/functions/env/#envgetenv))
* <code v-pre>{{ getenv "VAR_NAME" "default" }}</code> print an environment variable and print `default` if the variable is not set. ([docs](https://docs.gomplate.ca/functions/env/#envgetenv))

The script will *fail* if you reference a variable that does not exist (and doesn't have a default value) in a template.

Please see the

* [`gomplate` syntax documentation](https://docs.gomplate.ca/syntax/)
* [`gomplate` functions documentation](https://docs.gomplate.ca/functions/)

## Fixing ownership on startup

You can set the environment variable `DOCKER_APP_ENSURE_OWNERSHIP_PATHS` to a list of paths that should have their `$USER` and `$GROUP` ownership changed to the configured runtime user and group during container bootstrapping.

The variable is a space-delimited list shown below and accepts both relative and absolute paths:

* `DOCKER_APP_ENSURE_OWNERSHIP_PATHS="./storage ./bootstrap"`
* `DOCKER_APP_ENSURE_OWNERSHIP_PATHS="/some/other/folder"`

## One-time setup tasks

:::tip
The script stores `lock` files in the `storage/docker/once` folder to ensure that these tasks are only run once, so for new Pixelfed servers, you do not need to disable this behavior!
:::

The Docker container will by default try to run the required [One-time setup tasks](../native/installation.md#one-time-setup-tasks) for you on startup.

If your Pixelfed server already have run these tasks, you must disable this by setting `DOCKER_APP_RUN_ONE_TIME_SETUP_TASKS=0` in your `.env` file.

## Automatic database migrations

The init script will by default only *detect* if there are new database migrations - but not apply them - as these can potentially be destructive or take a long time to apply.

By setting `DB_APPLY_NEW_MIGRATIONS_AUTOMATICALLY=1` in your `.env` file, the script will automatically apply new migrations when they are detected.

## Build Arguments

The Pixelfed Dockerfile utilizes [Docker Multi-stage builds](https://docs.docker.com/build/building/multi-stage/) and [Build arguments](https://docs.docker.com/build/guide/build-args/).

Using *build arguments* allows us to create a flexible and more maintainable Dockerfile, supporting [multiple runtimes](runtimes.md) ([FPM](runtimes.md#fpm), [Nginx](runtimes.md#nginx-fpm), [Apache + mod_php](runtimes.md#apache)) and end-user flexibility without having to fork or copy the Dockerfile.

*Build arguments* can be configured using `--build-arg 'name=value'` for `docker build`, `docker compose build` and `docker buildx build`. For `docker-compose.yml`, the `args` key for [`build`](https://docs.docker.com/compose/compose-file/compose-file-v3/#build) can be used.

| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| PHP_PECL_EXTENSIONS | "imagick redis" | Initial PECL extensions to install via `pecl install`. | 
| PHP_EXTENSIONS | "intl bcmath zip pcntl exif curl gd" | Initial PHP Extensions to install via `docker-php-ext-install`. | 
| PHP_EXTENSIONS_DATABASE | "pdo_pgsql pdo_mysql pdo_sqlite" | Initial PHP database extensions to install. | 
| COMPOSER_VERSION | "2.6" | The version of Composer to install. | 
| NGINX_VERSION | "1.25.3" | The version of Nginx to use when targeting [`nginx-runtime`](runtimes.md#nginx-fpm). | 
| FOREGO_VERSION | "0.17.2" | The version of [`forego`](https://github.com/ddollar/forego) to install. | 
| GOMPLATE_VERSION | "v3.11.6" | The version of [`goplate`](https://github.com/hairyhenderson/gomplate) to install. | 
| DOTENV_LINTER_VERSION | "v3.2.0" | Version of [`dotenv-linter`](https://github.com/dotenv-linter/dotenv-linter) to install. | 
