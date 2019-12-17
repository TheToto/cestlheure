# C'est L'heure Messenger Bot

```shell script
# Launch server
python manage.py runserver
# Launch server with fb bot
ENABLE_BOT=true python manage.py runserver 
```

### .env file
ENABLE_BOT=false \
THREAD_ID_CESTLHEURE=fb_thread_to_listen

BOT_LOGIN=fb_email \
BOT_PASSWORD=fb_password \
BOT_TOTP=fb_totp