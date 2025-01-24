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

To disable the entire `ENTRYPOINT` you can set the variable `ENTRYPOINT_SKIP=1`.

To disable individual `ENTRYPOINT` scripts, you can add the filename to the space (`" "`) separated variable `ENTRYPOINT_SKIP_SCRIPTS`. (example: `ENTRYPOINT_SKIP_SCRIPTS="10-storage.sh 30-cache.sh"`)

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

## Docker Environment Variables

The following environment variables can be set in your .env file to change aspects of your Docker install.

### App Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| APP_NAME                            | ""| The name/title for your site. |
| APP_DOMAIN                          | ""| Application domain used for routing. |
| APP_URL                             | "https://${APP_DOMAIN}"           | URL for Artisan command line tool to generate URLs. |
| ADMIN_DOMAIN                        | "${APP_DOMAIN}"                   | Application domains used for routing for admin. |
| APP_ENV                             | "production"                      | The environment your application is running in. |
| APP_DEBUG                           | "false"                           | Enable detailed error messages in debug mode. |
| ENABLE_CONFIG_CACHE                | "true"                            | Enable or disable config cache. |
| OPEN_REGISTRATION                   | "true"                            | Enable new local account registrations. |
| ENFORCE_EMAIL_VERIFICATION         | "true"                            | Require email verification before user actions. |
| PF_MAX_USERS                       | "1000"                            | Maximum number of user accounts allowed. |
| PF_ENFORCE_MAX_USERS               | "true"                            | Enforce the maximum number of user accounts. |
| OAUTH_ENABLED                       | "false"                           | Enable OAuth integration. |
| APP_TIMEZONE                        | "UTC"                             | Application timezone. |
| APP_LOCALE                          | "en"                              | Application locale. |
| APP_FALLBACK_LOCALE                 | "en"                              | Fallback locale when the current one is unavailable. |
| LIMIT_ACCOUNT_SIZE                  | "true"                            | Limit the size of user accounts. |
| MAX_ACCOUNT_SIZE                    | "1000000"                         | Maximum account size in kB. |
| MAX_PHOTO_SIZE                      | "15000"                           | Maximum photo size in kB. |
| MAX_ALBUM_LENGTH                    | "4"                               | Maximum number of photos per post. |
| MAX_AVATAR_SIZE                     | "2000"                            | Maximum avatar size in kB. |
| MAX_CAPTION_LENGTH                  | "500"                             | Maximum caption length for local posts. |
| MAX_BIO_LENGTH                      | "125"                             | Maximum bio length for user profiles. |
| MAX_NAME_LENGTH                     | "30"                              | Maximum length for user names. |
| PF_OPTIMIZE_IMAGES                  | "true"                            | Enable image optimization on upload. |
| IMAGE_QUALITY                       | "80"                              | Image optimization quality (1-100). |
| PF_OPTIMIZE_VIDEOS                  | "true"                            | Enable video optimization on upload. |
| ACCOUNT_DELETION                    | "true"                            | Enable account deletion. |
| ACCOUNT_DELETE_AFTER                | "false"                           | Delay account deletion or delete immediately. |
| INSTANCE_DESCRIPTION                | "Pixelfed Glitch - Photo sharing for everyone" | Instance description. |
| INSTANCE_PUBLIC_HASHTAGS            | "false"                           | Enable public hashtags for the instance. |
| INSTANCE_CONTACT_EMAIL              | "__CHANGE_ME__"                   | Contact email address for the instance. |
| INSTANCE_PUBLIC_LOCAL_TIMELINE      | "false"                           | Enable public local timeline. |
| INSTANCE_REPORTS_EMAIL_ENABLED      | "false"                           | Enable email reports for auto-spam detections. |
| INSTANCE_REPORTS_EMAIL_ADDRESSES    | "your@email.example"             | Email addresses for spam detection reports. |
| INSTANCE_REPORTS_EMAIL_AUTOSPAM     | "false"                           | Send email reports on auto-spam. |
| BANNED_USERNAMES                    | ""| List of banned usernames. |
| STORIES_ENABLED                      | "false"                           | Enable stories feature. |
| RESTRICTED_INSTANCE                 | "false"                           | Enable restricted instance. |
| PF_IMPORT_FROM_INSTAGRAM            | "true"                            | Allow importing posts from Instagram. |
| PF_IMPORT_IG_MAX_POSTS              | "1000"                            | Maximum number of posts to import from Instagram. |
| PF_IMPORT_IG_MAX_ATTEMPTS           | "-1"                              | Maximum number of Instagram import attempts. |
| PF_IMPORT_IG_ALLOW_VIDEO_POSTS      | "true"                            | Allow importing video posts from Instagram. |
| PF_IMPORT_IG_PERM_ADMIN_ONLY        | "false"                           | Limit Instagram imports to admin accounts only. |
| PF_IMPORT_IG_PERM_ADMIN_FOLLOWS_ONLY | "false"                         | Limit Instagram imports to admin-followed accounts. |
| PF_IMPORT_IG_PERM_MIN_ACCOUNT_AGE   | "1"                               | Minimum Instagram account age to allow imports. |
| PF_IMPORT_IG_PERM_MIN_FOLLOWER_COUNT| "0"                               | Minimum Instagram follower count to allow imports. |
| PF_IMPORT_IG_PERM_ONLY_USER_IDS     | ""| List of user IDs allowed for Instagram imports. |
| MEDIA_EXIF_DATABASE                 | "false"                           | Enable EXIF database for media. |
| IMAGE_DRIVER                        | "gd"                              | Image processing driver: gd or imagick. |
| TRUST_PROXIES                       | "*"                               | List of trusted proxy IP addresses. |
| CACHE_DRIVER                        | "redis"                           | Default cache driver (e.g., file, redis). |
| CACHE_PREFIX                        | "${APP_NAME}_cache"               | Cache prefix, defaults to APP_NAME. |
| BROADCAST_DRIVER                    | "redis"                           | Default broadcaster for events (e.g., redis, pusher). |
| RESTRICT_HTML_TYPES                 | "true"                            | Restrict allowed HTML types. |
| PASSPORT_PRIVATE_KEY                | ""| Passport private key for secure access tokens. |
| PASSPORT_PUBLIC_KEY                 | ""| Passport public key for secure access tokens. |

### Curated Onboarding
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| INSTANCE_CUR_REG| "false"               | Enable or disable curated onboarding. |
| INSTANCE_CUR_REG_RESEND_LIMIT                       | "5"                   | How many times a user may request resending of confirmation emails.   |
| INSTANCE_CUR_REG_CAPTCHA                             | "false"               | Enable or disable captcha during curated onboarding process.          |
| INSTANCE_CUR_REG_NOTIFY_ADMIN_ON_VERIFY_MPD         | "10"                  | Maximum number of notifications to send per day.                      |
| INSTANCE_CUR_REG_NOTIFY_ADMIN_ON_VERIFY             | "false"               | Send email reports on 'verify'. |
| INSTANCE_CUR_REG_NOTIFY_ADMIN_ON_VERIFY_BUNDLE      | "false"               | Send admin notifications on verify bundle.                           |
| INSTANCE_CUR_REG_NOTIFY_ADMIN_ON_USER_RESPONSE      | "false"               | Send notification on user response.   |

### Database Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DB_VERSION      | "11.4"                | Database version to use (as Docker tag).                              |
| DB_CONNECTION   | "mysql"               | Default database connection type. Possible values: sqlite, mysql, pgsql, sqlsrv.                          |
| DB_HOST         | "db"                  | Host for the database server.    |
| DB_USERNAME     | "pixelfed"            | Database username.               |
| DB_PASSWORD     | "__CHANGE_ME__"       | Database password (make sure it’s secure).                            |
| DB_DATABASE     | "pixelfed_prod"       | Name of the database to use.     |
| DB_PORT         | "3306"                | Port for the database connection. Default for MySQL/MariaDB is 3306.  |
| DB_APPLY_NEW_MIGRATIONS_AUTOMATICALLY               | "false"               | Automatically run migrations if new migrations are detected.          |
| DB_ATTR_SSL_CA  | ""                    | SSL CA file for MySQL connections (if applicable).                    |
| DB_ATTR_SSL_KEY | ""                    | SSL key file for MySQL connections (if applicable).                   |
| DB_ATTR_SSL_CERT| ""                    | SSL certificate file for MySQL connections (if applicable).          |
| DB_SSL_MODE     | "prefer"  | SSL mode for the database connection. Possible values: disable, allow, prefer, require, verify-ca, verify-full. |

### Mail Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| MAIL_MAILER     | "smtp"  | Previously MAIL_DRIVER. Mailer to use for sending emails. Possible values: smtp, sendmail, mailgun, mandrill, ses, sparkpost, log, array. |
| MAIL_HOST       | "smtp.mailgun.org"    | SMTP server host address.       |
| MAIL_PORT       | "587"                 | SMTP port for email delivery.     |
| MAIL_FROM_ADDRESS    | "__CHANGE_ME__"       | Default sender email address.    |
| MAIL_FROM_NAME  | "${APP_NAME}"         | Default sender name for outgoing emails.                              |
| MAIL_USERNAME    | ""                    | SMTP server username for authentication (if applicable).             |
| MAIL_PASSWORD    | ""                    | SMTP server password for authentication (if applicable).             |
| MAIL_ENCRYPTION  | "tls"                 | Encryption protocol for SMTP email delivery.                         |

### Redis Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| REDIS_CLIENT    | "phpredis"            | Redis client to use.             |
| REDIS_SCHEME    | "tcp"                 | Redis communication protocol.    |
| REDIS_HOST      | "redis"               | Host for the Redis server.       |
| REDIS_PASSWORD  | ""                    | Redis password (if applicable).  |
| REDIS_PORT      | "6379"                | Port for the Redis server.       |
| REDIS_DATABASE  | "0"                   | Redis database to use.           |

### Experimental Features
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| EXP_TOP         | "false"               | Enable or disable text-only posts (alpha).                            |
| EXP_POLLS       | "false"               | Enable or disable poll statuses (alpha).                              |
| EXP_CPT         | "false"               | Enable or disable cached public timeline (beta).                      |
| EXP_EMC         | "true"                | Enable or disable Mastodon API compatibility (alpha).                |

### ActivityPub Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| ACTIVITY_PUB    | "true"                | Enable or disable ActivityPub protocol.                              |
| AP_REMOTE_FOLLOW| "true"                | Enable or disable remote follow in ActivityPub.                       |
| AP_SHAREDINBOX  | "true"                | Enable or disable shared inbox in ActivityPub.                        |
| AP_INBOX        | "true"                | Enable or disable inbox in ActivityPub.                              |
| AP_OUTBOX       | "true"                | Enable or disable outbox in ActivityPub.                             |

### Federation Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| ATOM_FEEDS      | "true"                | Enable or disable Atom feeds for posts.                              |
| NODEINFO        | "true"                | Enable or disable NodeInfo API. |
| WEBFINGER       | "true"                | Enable or disable WebFinger API.|

### Storage Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| PF_ENABLE_CLOUD | "false"               | Enable or disable cloud storage for media (like S3, DigitalOcean).    |
| FILESYSTEM_CLOUD| "s3"                  | Cloud storage driver for media (e.g., S3).                           |
| MEDIA_DELETE_LOCAL_AFTER_CLOUD                      | "true"                | Delete local media after upload to cloud storage.                      |
| AWS_ACCESS_KEY_ID    | ""                    | AWS access key ID for cloud storage (if using S3).                   |
| AWS_SECRET_ACCESS_KEY| ""                    | AWS secret access key for cloud storage (if using S3).               |
| AWS_DEFAULT_REGION   | ""                    | AWS region for cloud storage (if using S3).                          |
| AWS_BUCKET      | ""                    | AWS bucket name for cloud storage (if using S3).                      |
| AWS_URL         | ""                    | AWS URL for the storage endpoint (if using S3).                      |
| AWS_ENDPOINT    | ""                    | AWS endpoint for cloud storage (if using S3).                         |
| AWS_USE_PATH_STYLE_ENDPOINT                         | "false"               | Whether to use path style endpoints for AWS S3.                       |

### CoStar Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| CS_BLOCKED_DOMAINS   | ""                    | Comma-separated list of domains to block.                             |
| CS_CW_DOMAINS   | ""                    | Comma-separated list of domains to add warnings.                     |
| CS_UNLISTED_DOMAINS  | ""                    | Comma-separated list of domains to remove from public timelines.     |
| CS_BLOCKED_KEYWORDS  | ""                    | Comma-separated list of keywords to block.                            |
| CS_CW_KEYWORDS  | ""                    | Comma-separated list of keywords to add warnings.                     |
| CS_UNLISTED_KEYWORDS | ""                    | Comma-separated list of keywords to remove from public timelines.     |
| CS_BLOCKED_ACTOR| ""                    | List of blocked actors.         |
| CS_CW_ACTOR     | ""                    | List of actors to add warnings. |
| CS_UNLISTED_ACTOR    | ""                    | List of actors to remove from public timelines.                       |

### Logging Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| LOG_CHANNEL     | "stderr"              | Log channel to output logs (e.g., stack, single, daily, stderr, syslog, etc.).                           |
| LOG_LEVEL       | "debug"               | Level of log messages to capture (e.g., debug, info, warning, error, etc.).                              |
| LOG_STDERR_FORMATTER | ""                    | Custom formatter for stderr log. |
| LOG_SLACK_WEBHOOK_URL| ""                    | Slack webhook URL for sending logs.  |

### Queue Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| QUEUE_DRIVER    | "redis"               | Queue driver to use (e.g., sync, database, sqs, redis, etc.).       |
| SQS_KEY         | "your-public-key"     | AWS SQS public key (if using SQS).    |
| SQS_SECRET  | "your-secret-key"     | AWS SQS secret key (if using SQS). |
| SQS_PREFIX  | ""  | Prefix for AWS SQS.   |
| SQS_QUEUE      | "your-queue-name"     | AWS SQS queue name.  |
| SQS_REGION    | "us-east-1"           | AWS SQS region. |

### Session Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| SESSION_DRIVER   | "redis"               | Session driver to use (e.g., file, cookie, database, redis, etc.).  |
| SESSION_LIFETIME | "86400"  | Session lifetime in minutes.     |
| SESSION_DOMAIN  | "${APP_DOMAIN}" | Session domain for cookies.      |

### Horizon Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| HORIZON_PREFIX | "horizon-"   | Prefix for Horizon data in Redis.|
| HORIZON_DARKMODE                        | "false"    | Enables dark mode for Horizon. |
| HORIZON_MEMORY_LIMIT                    | "64" | Max memory in MB for Horizon worker. |
| HORIZON_BALANCE_STRATEGY                | "auto"    | Horizon balance strategy. |
| HORIZON_MIN_PROCESSES                   | "1"   | Minimum number of Horizon processes. |
| HORIZON_MAX_PROCESSES                   | "20"  | Maximum number of Horizon processes. |
| HORIZON_SUPERVISOR_MEMORY               | "64"  | Memory limit for Horizon supervisor. |
| HORIZON_SUPERVISOR_TRIES                | "3"   | Number of tries for Horizon supervisor. |
| HORIZON_SUPERVISOR_NICE                 | "0"   | Nice value for Horizon supervisor. |
| HORIZON_SUPERVISOR_TIMEOUT              | "300" | Timeout for Horizon supervisor in seconds. |

### Shared Docker Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| APP_KEY | (auto-generated) | Random 32-character encryption key. |
| DOCKER_ALL_CONTAINER_NAME_PREFIX       | "${APP_DOMAIN}"                            | Prefix for container names. |
| DOCKER_ALL_DEFAULT_HEALTHCHECK_INTERVAL | "10s" | Default health check interval for all services. |
| DOCKER_ALL_HOST_ROOT_PATH              | "./docker-compose-state"                   | Path where all container data is stored. |
| DOCKER_ALL_HOST_DATA_ROOT_PATH         | "${DOCKER_ALL_HOST_ROOT_PATH}/data"        | Path where container data is stored. |
| DOCKER_ALL_HOST_CONFIG_ROOT_PATH       | "${DOCKER_ALL_HOST_ROOT_PATH}/config"      | Path where container config is stored. |
| DOCKER_ALL_HOST_OVERRIDES_PATH         | "${DOCKER_ALL_HOST_ROOT_PATH}/overrides"   | Path where container overrides are stored. |
| TZ | "${APP_TIMEZONE}" | Timezone used by all containers. |

### Docker App Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DOCKER_APP_RELEASE                     | "latest"   | Docker tag prefix for image pulls. |
| DOCKER_APP_PHP_VERSION                 | "8.4" | PHP version for the app container. |
| DOCKER_APP_RUNTIME                     | "apache"   | Runtime for the app container. |
| DOCKER_WORKER_RUNTIME                  | "fpm" | Runtime for the worker container. |
| DOCKER_APP_DEBIAN_RELEASE              | "bookworm" | Debian release variant for the PHP Docker image. |
| DOCKER_APP_BASE_TYPE                   | "apache"   | Base type for the app container image. |
| DOCKER_APP_IMAGE                       | "ghcr.io/pixelfed-glitch/pixelfed"         | Pixelfed app image. |
| DOCKER_APP_TAG                         | "${DOCKER_APP_RUNTIME}-${DOCKER_APP_RELEASE}" | Image tag for Pixelfed web container. |
| DOCKER_WORKER_IMAGE                    | "ghcr.io/pixelfed-glitch/pixelfed"         | Pixelfed worker image. |
| DOCKER_WORKER_TAG                      | "${DOCKER_WORKER_RUNTIME}-${DOCKER_APP_RELEASE}" | Image tag for Pixelfed worker container. |
| DOCKER_CRON_IMAGE                      | "ghcr.io/pixelfed-glitch/pixelfed"         | Pixelfed cron image. |
| DOCKER_CRON_TAG                        | "${DOCKER_WORKER_RUNTIME}-${DOCKER_APP_RELEASE}" | Image tag for Pixelfed cron container. |
| DOCKER_APP_HOST_STORAGE_PATH           | "${DOCKER_ALL_HOST_DATA_ROOT_PATH}/pixelfed/storage" | Path for Pixelfed storage data. |
| DOCKER_APP_HOST_CACHE_PATH             | "${DOCKER_ALL_HOST_DATA_ROOT_PATH}/pixelfed/cache" | Path for Pixelfed cache data. |
| DOCKER_APP_RUN_ONE_TIME_SETUP_TASKS | "1" | Run one-time setup tasks for Pixelfed. |
| DOCKER_APP_ENSURE_OWNERSHIP_PATHS | "" | Paths to chown recursively inside containers. |
| DOCKER_APP_ENTRYPOINT_DEBUG            | "0"   | Enable entrypoint debug mode. |
| DOCKER_APP_ENTRYPOINT_SHOW_TEMPLATE_DIFF | "1" | Show template diff when applying entrypoints. |
| DOCKER_APP_APT_PACKAGES_EXTRA          | ""    | Extra APT packages to install during build. |
| DOCKER_APP_PHP_PECL_EXTENSIONS_EXTRA   | ""    | Extra PECL extensions to install during build. |
| DOCKER_APP_PHP_EXTENSIONS_EXTRA        | ""    | Extra PHP extensions to install during build. |
| DOCKER_APP_PHP_MEMORY_LIMIT            | "256M"| Memory limit for PHP inside the container. |
| DOCKER_APP_PHP_ERROR_REPORTING         | "E_ALL & ~E_DEPRECATED & ~E_STRICT"         | Error reporting level for PHP. |
| DOCKER_APP_PHP_DISPLAY_ERRORS          | "off" | Enable or disable PHP error display. |
| DOCKER_APP_PHP_OPCACHE_ENABLE          | "1"   | Enable PHP OPcache. |
| DOCKER_APP_PHP_OPCACHE_VALIDATE_TIMESTAMPS | "0" | Validate PHP OPcache timestamps. |
| DOCKER_APP_PHP_OPCACHE_REVALIDATE_FREQ | "2"   | OPcache revalidation frequency. |
| DOCKER_APP_BUILD_FRONTEND              | "0"   | Build frontend during Docker image build. |
| DOCKER_APP_PHP_FPM_PM                  | "dynamic"  | PHP-FPM process manager. |
| DOCKER_APP_PHP_FPM_PM_MAX_CHILDREN     | "5"   | Max child processes for PHP-FPM. |
| DOCKER_APP_PHP_FPM_PM_START_SERVERS    | "2"   | Starting number of PHP-FPM child processes. |
| DOCKER_APP_PHP_FPM_PM_MIN_SPARE_SERVERS | "1"  | Minimum number of idle PHP-FPM child processes. |
| DOCKER_APP_PHP_FPM_PM_MAX_SPARE_SERVERS | "3"  | Maximum number of idle PHP-FPM child processes. |

### Docker Redis Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DOCKER_REDIS_PROFILE                   | ""    | Disable Redis service if set to non-empty value. |
| DOCKER_REDIS_VERSION                   | "7.4.2"    | Redis version to use in Docker image. |
| DOCKER_REDIS_HOST_DATA_PATH            | "${DOCKER_ALL_HOST_DATA_ROOT_PATH}/redis"  | Path where Redis container stores data. |
| DOCKER_REDIS_HOST_PORT                 | "${REDIS_PORT}"                            | Port for Redis container on host. |
| DOCKER_REDIS_CONFIG_FILE               | "/etc/redis/redis.conf"                    | Redis config file path. |
| DOCKER_REDIS_HEALTHCHECK_INTERVAL      | "${DOCKER_ALL_DEFAULT_HEALTHCHECK_INTERVAL}" | Health check interval for Redis service. |


### Docker DB Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DOCKER_DB_PROFILE                      | ""    | Disable DB service if set to non-empty value. |
| DOCKER_DB_IMAGE                        | "mariadb:${DB_VERSION}"                    | Docker image for DB service. |
| DOCKER_DB_COMMAND                      | "--default-authentication-plugin=mysql_native_password --old-mode=''" | DB server command. |
| DOCKER_DB_HOST_DATA_PATH               | "${DOCKER_ALL_HOST_DATA_ROOT_PATH}/db"     | Path for DB container data. |
| DOCKER_DB_CONTAINER_DATA_PATH          | "/var/lib/mysql"                           | Path for DB container data. |
| DOCKER_DB_HOST_PORT                    | "${DB_PORT}"                               | Host port for DB service. |
| DOCKER_DB_CONTAINER_PORT               | "${DB_PORT}"                               | Container port for DB service. |
| DOCKER_DB_ROOT_PASSWORD                | "${DB_PASSWORD}"                           | Root password for DB service. |
| DOCKER_DB_HEALTHCHECK_INTERVAL         | "${DOCKER_ALL_DEFAULT_HEALTHCHECK_INTERVAL}" | Health check interval for DB service. |

### Docker Web Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DOCKER_WEB_PROFILE                     | ""    | Disable web service if set to non-empty value. |
| DOCKER_WEB_PORT_EXTERNAL_HTTP          | "8080"| External port for HTTP traffic on web container. |
| DOCKER_WEB_HEALTHCHECK_INTERVAL        | "${DOCKER_ALL_DEFAULT_HEALTHCHECK_INTERVAL}" | Health check interval for web service. |

### Docker Worker Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DOCKER_WORKER_PROFILE | "" | Disable worker if set to a non-empty value |
| DOCKER_WORKER_HEALTHCHECK_INTERVAL     | "${DOCKER_ALL_DEFAULT_HEALTHCHECK_INTERVAL}" | Health check interval for worker service. |

### Docker Cron Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DOCKER_CRON_PROFILE | "" | Disable cron service if set to non-empty value. |


### Docker Proxy Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DOCKER_PROXY_PROFILE | "" | Disable proxy service if set to non-empty value. |
| DOCKER_PROXY_ACME_PROFILE | "${DOCKER_PROXY_PROFILE:-}" | Proxy Acme profile for LetsEncrypt. |
| DOCKER_PROXY_VERSION | "1.6.4" | Nginx Proxy version. |
| DOCKER_PROXY_HEALTHCHECK_INTERVAL      | "${DOCKER_ALL_DEFAULT_HEALTHCHECK_INTERVAL}" | Health check interval for proxy service. |
| DOCKER_PROXY_HOST_PORT_HTTP            | "80"  | Host port for HTTP traffic on proxy. |
| DOCKER_PROXY_HOST_PORT_HTTPS           | "443" | Host port for HTTPS traffic on proxy. |
| DOCKER_PROXY_HOST_DOCKER_SOCKET_PATH   | "/var/run/docker.sock"                     | Docker socket path on host. |
| DOCKER_PROXY_LETSENCRYPT_HOST          | "${APP_DOMAIN}"                            | LetsEncrypt host for proxy. |
| DOCKER_PROXY_LETSENCRYPT_EMAIL         | "${INSTANCE_CONTACT_EMAIL:?error}"        | Email for LetsEncrypt certificate requests. |
| DOCKER_PROXY_LETSENCRYPT_TEST          | "1"   | Enable LetsEncrypt staging servers. | 

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
