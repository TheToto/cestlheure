# Generated by Django 3.0 on 2019-12-18 11:55

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('front', '0003_auto_20191218_0132'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cestlheure',
            name='author',
        ),
    ]
