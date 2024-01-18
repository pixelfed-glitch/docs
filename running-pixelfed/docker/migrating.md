# Migrating to the new Pixelfed Docker setup

There is [*a lot* of changes](https://github.com/pixelfed/pixelfed/pull/4844) in how Pixelfed Docker/Docker Compose images work - it's a complete rewrite - with a bunch of breaking changes.

## Breaking changes

### A single `Dockerfile`

### Using `bind` volumes

The old `docker-compose.yml` configuration file [declared four anonymous Docker volumes](https://github.com/pixelfed/pixelfed/blob/b1ff44ca2f75c088a11576fb03b5bad2fbed4d5c/docker-compose.yml#L72-L76) for storing Pixelfed related data within.

These are no longer used, instead favoring a [Docker bind volume](https://docs.docker.com/storage/bind-mounts/) approach where content are stored directly on the server disk, outside
of a Docker volume.

The consequence of this change is that *all* data stored in the - now unsupported - Docker volumes will no longer be accessible by Pixelfed.

* The `db-data` volume *definitely* contain important data - it's your database after all!
* The `app-storage` volume *definitely* contain important data - it's files uploaded to - or seen by - your server!
* The `redis-data` volume *might* contain important data (depending on your configuration)
* The `app-bootstrap` volume does not contain any important data - all of it will be generated automatically in the new setup on startup. We will *not* be migrating this!

::: tip
Please see the [Migrating off anonymous Docker Compose volumes](#migrating-off-anonymous-docker-compose-volumes) section for how to move your data.
:::

## Migrating off anonymous Docker Compose volumes

::: info
This is a best-effort guide to help migrate off the old system, the operation is potentially rather complicated (and risky), so please do be careful!
:::

::: danger
***PLEASE MAKE SURE TO BACKUP YOUR SERVER AND DATA BEFORE ATTEMPTING A MIGRATION***

**YOUR INSTANCE WILL BE *DOWN* WHILE DOING THE MIGRATION, PLEASE PLAN ACCORDINGLY, DEPENDING ON DATA SIZE IT COULD TAKE ANYWHERE FROM 5 *MINUTES* TO 5 *HOURS***
:::

::: warning
**It's important to note that this is a *copy* operation - so disk usage will (temporarily) double while you migrate**
We provide a "migration container" for your convenience that can access both the new and old volumes, allowing you to copy the data into the setup.
:::

### 1) Backup

1. Make sure to backup your server (ideally *after* step 1 below has completed, but *before* is better than not at all!)
1. Capture the current Git version / Pixelfed release you are on (e.g. `git --no-pager log -1` outputs the commit reference as the 2nd word in first line)
1. Backup your `.env` file (we will do this in step 3 as well)
1. Backup your `docker-compose.yml` file (`cp docker-compose.yml docker-compose.yml.old`)
1. Read through the *entire* document before starting

### 2) Migrate `.env` file

The new `.env` file for Docker is a bit different from the old one (many new settings!) so the easiest is to grab the new `.env.docker` file and modify it from scratch again.

```bash
cp .env .env.old
wget -O .env.new https://raw.githubusercontent.com/pixelfed/pixelfed/dev/.env.docker
```

Then open your old `.env.old` configuration file, and for each of the key/value pairs within it, find and update the key in the new `.env.new` configuration file.

Don't worry though, the file might *look* different (and significantly larger) but it behaves *exactly* the way the old file did, it just has way more options!

::: tip
Don't worry if a key is missing in `.env.new`, you can add those key/value pairs back to the new file - ideally in the `Other configuration` section near the end of the file - but anywhere *should* be fine.
:::

This is a great time to review your settings and familiarize you with all the new settings.

::: info
In *particular* the following sections

* `PHP configuration` section (near the end of the file) where
  * The `DOCKER_APP_PHP_VERSION` settings controls your PHP version
  * The `PHP_MEMORY_LIMIT` settings controls your PHP memory limit
* `Docker Specific configuration` section (near the end of the file) where
  * The `DOCKER_ALL_HOST_DATA_ROOT_PATH` setting dictate where the new migrated data will live.
  * The `DOCKER_APP_RUN_ONE_TIME_SETUP_TASKS` controls if the `One time setup tasks` should run or not. We do *not* want this, since your Pixelfed instance already is set up!
* [Frequently Asked Question / FAQ](faq.md)
  * [How do I use my own Proxy server?](faq.md#how-do-i-use-my-own-proxy-server)
  * [How do I use my own SSL certificate?](faq.md#how-do-i-use-my-own-ssl-certificate)
:::

### 3) Stop containers

::: warning
This will take your Pixelfed instance offline
:::

Stop *all* running containers (web, worker, redis, db)

```bash
docker compose down
```

### 4) Update source code

Update your project to the latest release of Pixelfed by running

```bash
git pull origin $release
```

::: info
The `$release` can be any valid git reference like `dev`, `staging` or a [tagged release](https://github.com/pixelfed/pixelfed/releases) such as `v0.12.0`.
:::

### 5) Run migration container

You can access the Docker container with both old and new volumes by running the following command

```bash
docker compose -f docker-compose.migrate.yml run migrate bash
```

This will put you in the `/migrate` directory within the container, containing 8 directories like shown here

```plain
|-- app-storage
|   |-- new
|   `-- old
|-- db-data
|   |-- new
|   `-- old
`-- redis-data
    |-- new
    `-- old
```

### 6) Check the folders

#### Old folders

The following commands should all return *SOME* files and data - if they do not - then there might be an issue with the anonymous volume binding.

```bash
ls app-storage/old
ls db-data/old
ls redis-data/old
```

#### New folders

The following commands should all return *NO* files and data - if they contain data - you need to either delete it (backup first!) or skip that migration step.

If you haven't run `docker compose up` since you updated your project in step (2) - they should be empty and good to go.

```bash
ls app-storage/new
ls db-data/new
ls redis-data/new
```

### 7) Copy data

::: warning
This is where we potentially will double your disk usage (temporarily)
:::

Now we will copy the data from the old volumes, to the new ones.

The migration container has [`rsync`](https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories) installed - which is perfect for that kind of work!

**NOTE** It's important that the "source" (first path in the `rsync` command) has a trailing `/` - otherwise the directory layout will turn out wrong!

**NOTE** Depending on your server, these commands might take some time to finish, each command should provide a progress bar with rough time estimation.

**NOTE** `rsync` should preserve ownership, permissions, and symlinks correctly for you as well for all the files copied.

Lets copy the data by running the following commands:

```bash
rsync -avP app-storage/old/ app-storage/new
rsync -avP db-data/old/ db-data/new
rsync -avP redis-data/old/ redis-data/new
```

### 8) Sanity checking

Lets make sure everything copied over successfully!

Each *new* directory should contain *something* like (but not always exactly) the following - **NO** directory should have a single folder called `old`, if they do, the `rsync` commands above didn't work correctly - and you need to move the content of the `old` folder into the "root" of the `new` folder like shown a bit in the following sections.

The **redis-data/new** directory might also contain a `server.pid`

```bash
$ ls redis-data/new
appendonlydir
```

The **app-storage/new** directory should look *something* like this

```bash
$ ls app-storage/new
app  debugbar  docker  framework  logs  oauth-private.key  oauth-public.key  purify
```

The **db-data/new** directory should look *something* like this. There might be a lot of files, or very few files, but there *must* be a `mysql`, `performance_schema`, and `${DB_DATABASE}` (e.g. `pixelfed_prod` directory)

```bash
$ ls db-data/new
aria_log_control  ddl_recovery-backup.log  ib_buffer_pool  ib_logfile0  ibdata1  mariadb_upgrade_info  multi-master.info  mysql  performance_schema  pixelfed_prod  sys  undo001  undo002  undo003
```

If everything looks good, type `exit` to leave exit the migration container

### 9) Start containers

With all an updated Pixelfed (step 2), updated `.env` file (step 3), migrated data (step 4, 5, 6 and 7) we're ready to start things back up again.

But before we start your Pixelfed server back up again, lets put the new `.env` file we made in step 1 in its right place.

```bash
cp .env.new .env
```

#### The Database

First thing we want to try is to start up the database by running the following command and checking the logs

```bash
docker compose up -d db
docker compose logs --tail 250 --follow db
```

if there are no errors and the server isn't crashing, great! If you have an easy way of connecting to the Database via a GUI or CLI client, do that as well and verify the database and tables are all there.

#### Redis

Next thing we want to try is to start up the Redis server by running the following command and checking the logs

```bash
docker compose up -d redis
docker compose logs --tail 250 --follow redis
```

if there are no errors and the server isn't crashing, great!

#### Worker

Next thing we want to try is to start up the Worker server by running the following command and checking the logs

```bash
docker compose up -d worker
docker compose logs --tail 250 --follow worker
```

The container should output a *lot* of logs from the [docker-entrypoint system](customize.md#run-script-on-startup), but *eventually* you should see these messages

* `Configuration complete; ready for start up`
* `Horizon started successfully.`

If you see one or both of those messages, great, the worker seems to be running.

If the worker is crash looping, inspect the logs and try to resolve the issues.

You can consider the following additional steps:

* Enabling `DOCKER_APP_ENTRYPOINT_DEBUG` which will show even more log output to help understand whats going on
* Enabling `DOCKER_APP_ENSURE_OWNERSHIP_PATHS` against the path(s) that might have permission issues
* Fixing permission issues directly on the host since your data should all be in the `${DOCKER_ALL_HOST_DATA_ROOT_PATH}` folder (`./docker-compose-state/data` by default)

#### Web

The final service, `web`, which will bring your site back online! What a journey it has been.

Lets get to it, run these commands to start the `web` service and inspect the logs.

```bash
docker compose up -d web
docker compose logs --tail 250 --follow web
```

The output should be pretty much identical to that of the `worker`, so please see that section for debugging tips if the container is crash looping.

If the `web` service came online without issues, start the rest of the (optional) services, such as the `proxy`, if enabled, by running

```bash
docker compose up -d
docker compose logs --tail 250 --follow
```

If you changed anything in the `.env` file while debugging, some containers might restart now, thats perfectly fine.

### 10) Verify

With all services online, it's time to go to your browser and check everything is working

1. Upload and post a picture
1. Comment on a post
1. Like a post
1. Check Horizon (`https://${APP_DOMAIN}/horizon`) for any errors
1. Check the Docker compose logs via `docker compose logs --follow`

If everything looks fine, yay, you made it to the end! Lets do some cleanup

### 11) Final steps + cleanup

With everything working, please take a new snapshot/backup of your server *before* we do any cleanup. A post-migration snapshot is incredibly useful, since it contains both the old and new configuration + data, making any recovery much easier in a rollback scenario later.

Now, with all the data in the new folders, you can delete the old Docker Container volumes (if you want, completely optional)

List all volumes, and give them a look:

```bash
docker volume ls
```

The volumes we want to delete *ends* with the volume name (`db-data`, `app-storage`, `redis-data`, and `app-bootstrap`.) but has some prefix in front of them.

Once you have found the volumes in in the list, delete each of them by running:

```bash
docker volume rm $volume_name_in_column_two_of_the_output
```

You can also delete the `docker-compose.yml.old` and `.env.old` file since they are no longer needed

```bash
rm docker-compose.yml.old
rm .env.old
```

### Rollback

Oh no, something went wrong? No worries, we you got backups and a quick way back!

#### Move `docker-compose.yml` back

```bash
cp docker-compose.yml docker-compose.yml.new
cp docker-compose.yml.old docker-compose.yml
```

#### Move `.env` file back

```bash
cp env.old .env
```

#### Go back to old source code version

```bash
git checkout $commit_id_from_step_0
```

#### Start things back up

```bash
docker compose up -d
```

#### Verify it worked
