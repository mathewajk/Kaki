# Generated by Django 4.1.1 on 2022-11-15 18:54

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('kaki', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraccount',
            name='email',
            field=models.EmailField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='useraccount',
            name='userId',
            field=models.CharField(default=uuid.uuid4, editable=False, max_length=255, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='useraccount',
            name='username',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]