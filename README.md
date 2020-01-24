# C'est L'heure Messenger Bot

```shell script
# Launch server
python manage.py runserver
# Launch server with fb bot
ENABLE_BOT=true python manage.py runserver 
```

### .env file
```
ENABLE_BOT=<true or false>
THREAD_ID_CESTLHEURE=<game thread id>
THREAD_ID_BOT=<bot user id>

BOT_LOGIN=<bot facebook email>
BOT_PASSWORD=<bot password>
BOT_TOTP=<bot totp key>

WEBSITE_ROOT=<root of website>

# Specified in docker-compose.yml
DB_NAME=db_cestlheure
DB_USER=cestlheure
DB_PASSWORD=1234cestlheure1234
DB_HOST=db
DB_PORT=5432

REDIS_HOST=redis
DJANGO_SECRET=<django secret key>
```
