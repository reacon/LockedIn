# Generated by Django 5.1.4 on 2025-01-02 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0004_job_bookmarked'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='id',
        ),
        migrations.AlterField(
            model_name='job',
            name='job_id',
            field=models.CharField(max_length=255, primary_key=True, serialize=False),
        ),
    ]
