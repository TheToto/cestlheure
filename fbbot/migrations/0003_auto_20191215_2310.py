# Generated by Django 3.0 on 2019-12-15 22:10

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('fbbot', '0002_user_color'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'get_latest_by': 'time', 'ordering': ['-time']},
        ),
    ]