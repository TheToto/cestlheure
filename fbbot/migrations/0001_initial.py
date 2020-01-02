# Generated by Django 3.0 on 2019-12-14 18:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('uid', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('nickname', models.CharField(max_length=50, null=True)),
                ('url', models.URLField(null=True)),
                ('photo_url', models.URLField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('uid', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('text', models.TextField(null=True)),
                ('time', models.DateTimeField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='fbbot.User')),
            ],
        ),
    ]
