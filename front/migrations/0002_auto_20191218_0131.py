# Generated by Django 3.0 on 2019-12-18 00:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('fbbot', '0003_auto_20191215_2310'),
        ('front', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cestlheure',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fbbot.User'),
        ),
    ]