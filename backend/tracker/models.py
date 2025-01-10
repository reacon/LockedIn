from django.db import models # type: ignore
from django.contrib.auth.models import User # type: ignore

class Job(models.Model):
    job_id = models.CharField(max_length=255, primary_key=True)
    employer_name = models.CharField(max_length=255)
    employer_logo = models.URLField(null=True, blank=True)
    job_title = models.CharField(max_length=255)
    job_description = models.TextField()
    job_country = models.CharField(max_length=100)
    job_city = models.CharField(max_length=100)
    job_employment_type = models.CharField(max_length=100, null=True, blank=True)
    job_apply_link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    

    class Meta:
        ordering = ['-created_at']

class Bookmarks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')