import axios from "axios"

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': document.cookie.split('csrftoken=')[1]?.split(';')[0] || ''
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

export const JobService = {
    getJobs: async ( page = 1) => {
        try{
            const response = await api.get('/api/jobs/' , {params: {page}});
            console.log(response.data);
            return response.data;
            
        } catch(error){ 
            console.error('Job retrieval failed:', error);
            throw error;
        }
    },

    fetchJobs: async (searchParams = {},page = 1) => {
        try {
            console.log('Fetching jobs...');    
            const response = await api.get('/api/jobs/fetch_jobs/' , {params: {...searchParams , page}});
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Job retrieval failed:', error);
            throw error;
        }
    },
    
    filterJobs: async (filters = {},page = 1) => {
        try{
            const response = await api.get('/api/jobs/filter_jobs/', {params: {...filters,page}});
            return response.data
        }
        catch(error){
            console.error('Job retrieval failed:', error);
            throw error;
    }

    
},  fetch_by_url: async (url) => {
        try {
            const response = await axios.get(url, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Job retrieval failed:', error);
            throw error;
        }
    },
    bookmarkJob: async (jobId) => {
        try{
            const response = await api.post(`/api/jobs/${jobId}/bookmark_job/`);
            return response.data 
        } catch(error){ 
            console.error('Job bookmark failed:', error);
            throw error;
        }
    },
    deleteBookmark: async (jobId) => {
        try{
            const response = await api.delete(`/api/jobs/${jobId}/delete_bookmark/`);
            return response.data 
        } catch(error){ 
            console.error('Job bookmark failed:', error);
            throw error;
        }
    },
    getBookmarkedJobs: async (page = 1) => {
        try{
            const response = await api.get('/api/jobs/get_bookmarks/',{params: {page}});
            return response.data;
        } catch(error){ 
            console.error('Job retrieval failed:', error);
            throw error;
        }
    },
    analyze_job: async (jobId,analysis_Type) => {
        try{
            const response = await api.post(`/api/jobs/${jobId}/analyze/`, {analysis_type: analysis_Type})
            return response.data
        } catch(error){ 
            console.error('Job retrieval failed:', error);
            throw error;
        }
    },
}


    
