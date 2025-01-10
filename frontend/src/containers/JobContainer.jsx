/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { JobService } from "../services/JobService";
import JobList from "../components/JobList";
import SearchForm from "../components/SearchForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useJobs } from "../context/JobContext";

export const JobContainer = () => {
  const { jobs, setJobs } = useJobs();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currpage, setCurrpage] = useState(1);

  useEffect(() => {
    const loadJobs = async (page = 1) => {
      try {
        setLoading(true);
        const existingJobs = await JobService.getJobs(page);
        if (!existingJobs.jobs || existingJobs.jobs.length === 0) {
          console.log("Fetching new jobs");
          const data = await JobService.fetchJobs({}, page);
          setJobs(data.jobs);
          setPagination({
            count: data.count,
            next: data.next,
            previous: data.previous,
          });
          console.log(data);
        } else {
          setJobs(existingJobs.jobs);
          setPagination({
            count: existingJobs.count,
            next: existingJobs.next,
            previous: existingJobs.previous,
          });
          console.log(existingJobs);
        }
      } catch (error) {
        setError("Failed to load jobs");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [setJobs]);

  const fetch_next_prev = async (url) => {
    try {
      setLoading(true);
      const data = await JobService.fetch_by_url(url);
      setJobs(data.jobs);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
      setCurrpage((currpage) =>
        url === pagination.next ? currpage + 1 : currpage - 1
      );
    } catch (error) {
      setError("Failed to load jobs");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (filters, page = 1) => {
    try {
      setLoading(true);
      const data = await JobService.filterJobs(filters, page);
      setJobs(data.jobs);
      setCurrpage(page);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
      console.log(data);
    } catch (error) {
      setError("Failed to filter jobs");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleBookmark = async (job_id, is_bookmarked) => {
    try {
      let data;
      if (is_bookmarked) {
        data = await JobService.deleteBookmark(job_id);
      } else {
        data = await JobService.bookmarkJob(job_id);
      }
      setJobs(
        jobs.map((job) =>
          job_id === job.job_id ? { ...job, bookmarked: !is_bookmarked } : job
        )
      );

      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalPages = Math.ceil(pagination.count / 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20">
        {" "}
        {/* Add padding top to prevent navbar overlap */}
        <main className="max-w-6xl mx-auto px-4 pb-8">
          <SearchForm handleSearch={handleSearch} />
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <JobList
            jobs={jobs}
            loading={loading}
            error={error}
            handleBookmark={handleBookmark}
          />

          {!loading && !error && pagination.count > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => fetch_next_prev(pagination.previous)}
                disabled={!pagination.previous}
                className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currpage} of {totalPages}
              </span>
              <button
                onClick={() => fetch_next_prev(pagination.next)}
                disabled={!pagination.next}
                className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
