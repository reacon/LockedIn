# Generated by Django 5.1.4 on 2024-12-29 08:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_id', models.CharField(max_length=255, unique=True)),
                ('employer_name', models.CharField(max_length=255)),
                ('employer_logo', models.URLField(blank=True, null=True)),
                ('job_title', models.CharField(max_length=255)),
                ('job_description', models.TextField()),
                ('job_country', models.CharField(max_length=100)),
                ('job_city', models.CharField(max_length=100)),
                ('job_employment_type', models.CharField(blank=True, max_length=100, null=True)),
                ('job_apply_link', models.URLField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
