---
title = "Pixelfed Configuration"
summary = "A list of configuration settings for Pixelfed"
weight = 20
[menu]
[menu.docs]
identifier = "admin/installation"
parent = "admin"
---

# Configuration

Pixelfed, a platform built on the Laravel framework, uses Laravel's efficient configuration system. Sensitive settings like database credentials are stored in a .env file, separate from the codebase for security. These values are then loaded into PHP configuration files (`config/*.php`) for easy access within the application. 

::: warning
Laravel also caches these configurations to improve performance, avoiding the need to read the .env file on every request. This is why you need to run `php artisan config:cache && php artisan cache:clear` after updating `.env` or `config/*.php` files
:::

This setup allows Pixelfed to manage its settings effectively across different environments (development, staging, production) while keeping sensitive data secure. Changes to the .env file may require clearing Laravel's configuration cache to ensure the application uses the updated values.

---

[[toc]]

### App Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| APP_NAME                            | ""| The name/title for your site. |
| APP_DOMAIN                          | ""| The domain of your server, without `https://` |
| APP_URL                             | "https://localhost"           | The url of your server, used for generating urls. Should start with "https://" |
| APP_TIMEZONE                        | "UTC"                             | Application timezone. |
| APP_LOCALE                          | "en"                              | Application locale. |
| APP_FALLBACK_LOCALE                 | "en"                              | Fallback locale when the current one is unavailable. |
| APP_ENV                             | "production"                      | The app environment, keep it set to "production". |
| APP_DEBUG                           | "false"                           | Enable detailed error messages in debug mode. |
| FORCE_HTTPS_URLS | true | Force https url generation | Boolean |
| ADMIN_DOMAIN                        | "${APP_DOMAIN}"                   | Application domains used for routing for admin. |
| ENABLE_CONFIG_CACHE                | "true"                            | Enable or disable configuration caching. |
| OPEN_REGISTRATION                   | "true"                            | Enable new local account registrations. |
| ENFORCE_EMAIL_VERIFICATION         | "true"                            | Require email verification before user actions. |
| INSTANCE_DESCRIPTION                | "Pixelfed Glitch - Photo sharing for everyone" | Instance description. |
| TRUST_PROXIES                       | "*"                               | List of trusted proxy IP addresses. |
| RESTRICT_HTML_TYPES                 | "true"                            | Restrict allowed HTML types. |
| PASSPORT_PRIVATE_KEY                | ""| Passport private key for secure access tokens. |
| PASSPORT_PUBLIC_KEY                 | ""| Passport public key for secure access tokens. |

### Media Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| PF_OPTIMIZE_IMAGES                  | "true"                            | Enable image optimization on upload. |
| IMAGE_QUALITY                       | "80"                              | Image optimization quality (1-100). |
| PF_OPTIMIZE_VIDEOS                  | "true"                            | Enable video optimization on upload. |
| IMAGE_DRIVER                        | "gd"                              | Image processing driver: gd or imagick. |
| MEDIA_EXIF_DATABASE                 | "false"                           | Enable EXIF database for media. |


### User Limits
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| PF_MAX_USERS                       | "1000"                            | Maximum number of user accounts allowed. |
| PF_ENFORCE_MAX_USERS               | "true"                            | Enforce the maximum number of user accounts. |
| LIMIT_ACCOUNT_SIZE                  | "true"                            | Limit the size of user accounts. |
| ACCOUNT_DELETION                    | "true"                            | Enable account deletion. |
| ACCOUNT_DELETE_AFTER                | "false"                           | Delay account deletion or delete immediately. |
| MAX_ACCOUNT_SIZE                    | "1000000"                         | Maximum account size in kB. |
| MAX_PHOTO_SIZE                      | "15000"                           | Maximum photo size in kB. |
| MAX_ALBUM_LENGTH                    | "4"                               | Maximum number of photos per post. |
| MAX_AVATAR_SIZE                     | "2000"                            | Maximum avatar size in kB. |
| MAX_CAPTION_LENGTH                  | "500"                             | Maximum caption length for local posts. |
| MAX_BIO_LENGTH                      | "125"                             | Maximum bio length for user profiles. |
| MAX_NAME_LENGTH                     | "30"                              | Maximum length for user names. |
| MIN_PASSWORD_LENGTH | 8 | The min password length | Integer |
| PF_MAX_USER_BLOCKS | 50 | The max number of user blocks per account | Integer |
| PF_MAX_USER_MUTES | 50 | The max number of user mutes per account | Integer |
| PF_MAX_DOMAIN_BLOCKS | 50 | The max number of domain blocks per account | Integer |
| PF_MAX_COLLECTION_LENGTH | 100 | Max collection post limit | Integer |
| BANNED_USERNAMES                    | ""| List of banned usernames. |

### Feature Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| INSTANCE_LANDING_SHOW_DIRECTORY | true | Enable the profile directory on the landing page | Boolean |
| INSTANCE_LANDING_SHOW_EXPLORE | true | Enable the popular post explore on the landing page | Boolean |
| INSTANCE_PUBLIC_HASHTAGS            | "false"                           | Allow anonymous access to hashtag feeds. |
| INSTANCE_CONTACT_FORM | false | Enable the admin contact form | Boolean |
| INSTANCE_CONTACT_EMAIL              | "__CHANGE_ME__"                   | The public contact email address for the instance. |
| INSTANCE_PUBLIC_LOCAL_TIMELINE      | "false"                           | Enable public local timeline. |
| INSTANCE_DISCOVER_PUBLIC | false | Enable public access to the Discover feature | Boolean |
| INSTANCE_PROFILE_EMBEDS | true | Enable the profile embed feature | Boolean |
| INSTANCE_POST_EMBEDS | true | Enable the post embed feature | Boolean |
| INSTANCE_SHOW_PEERS | false | Enable the api/v1/peers API endpoint | Boolean |
| STORIES_ENABLED                      | "false"                           | Enable the stories feature. |
| RESTRICTED_INSTANCE                 | "false"                           | Enable restricted instance. |
| PF_HIDE_NSFW_ON_PUBLIC_FEEDS | false | Hide sensitive posts from public/network feeds | Boolean |
| PF_ADMIN_INVITES_ENABLED | true | Enable the Admin Invites feature | Boolean |
| OAUTH_ENABLED                       | "true"                           | Enable oAuth support, required for mobile/3rd party apps |


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

### Instagram Import Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| PF_IMPORT_FROM_INSTAGRAM            | "true"                            | Allow importing posts from Instagram. |
| PF_IMPORT_IG_MAX_POSTS              | "1000"                            | Maximum number of posts to import from Instagram. |
| PF_IMPORT_IG_MAX_ATTEMPTS           | "-1"                              | Maximum number of Instagram import attempts. |
| PF_IMPORT_IG_ALLOW_VIDEO_POSTS      | "true"                            | Allow importing video posts from Instagram. |
| PF_IMPORT_IG_PERM_ADMIN_ONLY        | "false"                           | Limit Instagram imports to admin accounts only. |
| PF_IMPORT_IG_PERM_ADMIN_FOLLOWS_ONLY | "false"                         | Limit Instagram imports to admin-followed accounts. |
| PF_IMPORT_IG_PERM_MIN_ACCOUNT_AGE   | "1"                               | Minimum Instagram account age to allow imports. |
| PF_IMPORT_IG_PERM_MIN_FOLLOWER_COUNT| "0"                               | Minimum Instagram follower count to allow imports. |
| PF_IMPORT_IG_PERM_ONLY_USER_IDS     | ""| List of user IDs allowed for Instagram imports. |

### Database Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| DB_VERSION      | "11.4"                | Database version to use (as Docker tag).                              |
| DB_CONNECTION   | "mariadb"               | Default database connection type. Possible values: sqlite, mysql, mariadb, pgsql, sqlsrv.                          |
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
| INSTANCE_REPORTS_EMAIL_ENABLED | false | Send a report email to the admin account for new autospam/reports | Boolean |
| INSTANCE_REPORTS_EMAIL_ADDRESSES | NULL | A comma separated list of email addresses to deliver admin reports to | String |
| INSTANCE_REPORTS_EMAIL_AUTOSPAM | false | Enable autospam reports (requires INSTANCE_REPORTS_EMAIL_ENABLED) | Boolean |

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
| PF_LOCAL_AVATAR_TO_CLOUD | false | Store local avatars on S3 (Requires S3) | Boolean |
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

### Queue/Cache Settings
| .env key      | Default |  Description |
| ------------- | :-----------: | :----: |
| QUEUE_DRIVER    | "redis"               | Queue driver to use (e.g., sync, database, sqs, redis, etc.).       |
| SQS_KEY         | "your-public-key"     | AWS SQS public key (if using SQS).    |
| SQS_SECRET  | "your-secret-key"     | AWS SQS secret key (if using SQS). |
| SQS_PREFIX  | ""  | Prefix for AWS SQS.   |
| SQS_QUEUE      | "your-queue-name"     | AWS SQS queue name.  |
| SQS_REGION    | "us-east-1"           | AWS SQS region. |
| CACHE_DRIVER                        | "redis"                           | Default cache driver (e.g., file, redis). |
| CACHE_PREFIX                        | "${APP_NAME}_cache"               | Cache prefix, defaults to APP_NAME. |
| BROADCAST_DRIVER                    | "redis"                           | Default broadcaster for events (e.g., redis, pusher). |

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


## Docker Settings
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

