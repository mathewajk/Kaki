# Generated by Django 4.1.1 on 2022-11-22 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kaki', '0003_remove_vocabitem_learned_alter_vocabitem_pitch'),
    ]

    operations = [
        migrations.AddField(
            model_name='vocabitem',
            name='addl_pitch',
            field=models.CharField(default='', max_length=25),
        ),
        migrations.AddField(
            model_name='vocabitem',
            name='addl_pos',
            field=models.CharField(default='', max_length=50),
        ),
    ]