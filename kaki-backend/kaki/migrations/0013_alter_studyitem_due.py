# Generated by Django 4.1.1 on 2022-12-08 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kaki', '0012_studyitem_seen'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studyitem',
            name='due',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]