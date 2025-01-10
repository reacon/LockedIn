from django.shortcuts import render # type: ignore
from rest_framework import viewsets # type: ignore
from rest_framework.decorators import action, permission_classes # type: ignore
from rest_framework.response import Response# type: ignore 
from rest_framework.permissions import IsAuthenticated# type: ignore
from django.conf import settings# type: ignore
import requests # type: ignore
from .models import Job, Bookmarks# type: ignore
from .serializers import JobSerializer
from django.db.models import Q # type: ignore
from rest_framework.pagination import PageNumberPagination # type: ignore
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from openai import OpenAI


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    

    def paginated_response(self, queryset):
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page,many=True)
            response_data = self.get_paginated_response(serializer.data)

            return Response({
                'jobs': response_data.data['results'],
                'count': response_data.data['count'],
                'next': response_data.data['next'],
                'previous': response_data.data['previous']
            })
        serializer = self.get_serializer(queryset,many=True)
        return Response({
            'jobs': serializer.data,    
            'total': len(serializer.data),
            'next': None,
            'previous': None
            })


    def fetch_filter_jobs(self,request): 
        url = "https://jsearch.p.rapidapi.com/search"
        query = request.GET.get('query', 'Software Developer')
        country = request.GET.get('country', 'US')

        params = {
            "query": query,
            "page": "1",
            "num_pages": "1",
            
        }  
            
        if country:
            params['country'] = country

        headers = {
            'x-rapidapi-key': settings.RAPID_API_KEY,
            'x-rapidapi-host': "jsearch.p.rapidapi.com"
        }
        response = requests.get(url, headers=headers, params=params)
        job_data = response.json()
    

        for job in job_data['data']:
            Job.objects.get_or_create(
                job_id = job['job_id'],
                defaults={ 
                    'employer_name': job['employer_name'],
                    'employer_logo': job.get('employer_logo'),
                    'job_title': job['job_title'],
                    'job_description': job['job_description'],
                    'job_country': job.get('job_country', 'Unknown'),
                    'job_city': job.get('job_city', 'Unknown'),
                    'job_employment_type': job.get('job_employment_type'),
                    'job_apply_link': job['job_apply_link']}
            )


    
    
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        return self.paginated_response(queryset)

    @action(detail = False, methods= ['get'])
    def fetch_jobs(self,request):
        try:
            url = "https://jsearch.p.rapidapi.com/search"
            query = request.GET.get('query', 'Software Developer')
            country = request.GET.get('country', 'US')

            params = {
               "query": query,
                "page": "1",
                "num_pages": "1",
              
            }  
              
            if country:
                params['country'] = country

            headers = {
                'x-rapidapi-key': settings.RAPID_API_KEY,
                'x-rapidapi-host': "jsearch.p.rapidapi.com"
            }
            response = requests.get(url, headers=headers, params=params)
            job_data = response.json()
        

            for job in job_data['data']:
                Job.objects.get_or_create(
                    job_id = job['job_id'],
                    defaults={ 
                     'employer_name': job['employer_name'],
                        'employer_logo': job.get('employer_logo'),
                        'job_title': job['job_title'],
                        'job_description': job['job_description'],
                        'job_country': job.get('job_country', 'Unknown'),
                        'job_city': job.get('job_city', 'Unknown'),
                        'job_employment_type': job.get('job_employment_type'),
                        'job_apply_link': job['job_apply_link']}
                )
                queryset = self.queryset
                return self.paginated_response(queryset)    
        
        except Exception as e:
            return Response({'error': str(e)}, status=500) 

    @action(detail = False, methods= ['get'])
    def filter_jobs(self,request):
        try:
            query = request.GET.get('query', '')
            country = request.GET.get('country', '')
            employer_name = request.GET.get('employer_name', '')
            job_title = request.GET.get('job_title', '')

            filterQueryset = Q()

            if employer_name:
                filterQueryset &= Q(employer_name__icontains=employer_name)
            if job_title:
                filterQueryset &= Q(job_title__icontains=job_title)
            if country: 
                filterQueryset &= Q(job_country__icontains=country)
            
            if query:
                filterQueryset &= Q(job_title__icontains=query) | Q(employer_name__icontains=query) | Q(job_country__icontains=query)


            queryset = self.queryset.filter(filterQueryset) if filterQueryset else self.queryset

            if queryset.count() == 0:
                self.fetch_jobs(request)
                queryset = self.queryset.filter(filterQueryset) if filterQueryset else self.queryset    
            
            return self.paginated_response(queryset)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail = False, methods= ['get'])
    def get_bookmarks(self,request):
        bookmarks = Job.objects.filter(bookmarks__user = request.user)
        return self.paginated_response(bookmarks)
    
    @action(detail = True, methods= ['post'])
    def bookmark_job(self,request,pk=None):
        job = self.get_object()
        bookmark, created = Bookmarks.objects.get_or_create(job = job,user = request.user)
        if created:
            return Response({'status': 'job bookmarked'})
        return Response({'status': 'bookmark already exists'})
    

    @action(detail= True, methods= ['delete'])
    def delete_bookmark(self,request,pk = None):
        job = self.get_object()
        try:
            bookmark = Bookmarks.objects.get(
                user=request.user,
                job=job
            )
            bookmark.delete()
            return Response({'status': 'bookmark deleted'})
        except Bookmark.DoesNotExist:
            return Response({'status': 'bookmark not found'}, status=404)

    @action(detail=True,methods=['post'])
    def analyze(self,request,pk = None):
        job = self.get_object()
        analysis_type = request.data.get("analysis_type","general")

        try:    
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            prompts = {
                    'general': (
                    "You are a professional job analyst. Provide a comprehensive analysis "
                    "of this job posting, including key responsibilities, company culture, "
                    f"and potential growth opportunities:\n\n{job.job_description}"
                ),
                'skills': (
                    "You are a career advisor. Create a structured list of:\n"
                    "1. Required technical skills\n"
                    "2. Required soft skills\n"
                    "3. Preferred qualifications\n"
                    "4. Experience requirements\n"
                    f"Based on this job posting:\n\n{job.job_description}"
                ),
                'cover_letter': (
                    "You are a professional resume writer. Suggest specific points to include "
                    "in a cover letter, including:\n"
                    "1. Key experiences to highlight\n"
                    "2. Specific achievements that would be relevant\n"
                    "3. How to align with the company's values\n"
                    f"Based on this job posting:\n\n{job.job_description}"
                )
                }

            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system", "content": "You are a helpful assistant who provides information regarding analysis about job applications and how to preprare for them."
                    },
                    {
                        "role": "user",
                        "content": prompts[analysis_type]
                    }
                ],
                temperature=0.7,
                
            )
            analysis = completion.choices[0].message.content
            print(analysis)

            return Response({
                "job_id": job.job_id,
                "analysis_type": analysis_type,
                'analysis': analysis
            })

            
        except Exception as e:
            return Response({
                'error': 'An unexpected error occurred',
                'details': str(e),
                'error_code': 'GENERAL_ERROR'
            })


