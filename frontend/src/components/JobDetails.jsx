/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { JobService } from "../services/JobService";
import { useJobs } from "../context/JobContext";
import JobAnalysisModal from "./JobAnalysisModal";

const JobDetails = () => {
  const { state } = useLocation();
  const { jobData: initialjobData } = state || {};
  const { jobs, setJobs } = useJobs();
  const [jobData, setjobData] = useState(initialjobData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  if (!jobData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center py-8 px-4 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">Job not found</p>
        </div>
      </div>
    );
  }
  const handleBookmark = async (jobId, is_bookmarked) => {
    if (is_bookmarked) {
      await JobService.deleteBookmark(jobId);
    } else {
      await JobService.bookmarkJob(jobId);
    }
    setJobs(
      jobs.map((job) =>
        job.job_id === jobId ? { ...job, bookmarked: !is_bookmarked } : job
      )
    );
    setjobData((prev) => ({
      ...prev,
      bookmarked: !is_bookmarked,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
      >
        ← Back to Jobs
      </Link>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              {jobData.employer_logo ? (
                <img
                  src={jobData.employer_logo}
                  alt={jobData.employer_name}
                  className="w-16 h-16 object-contain rounded-lg mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl font-semibold">
                    {jobData.employer_name?.[0]}
                  </span>
                </div>
              )}
              <div>
                <h1 className="font-bold text-2xl text-gray-900 mb-2">
                  {jobData.job_title}
                </h1>
                <p className="text-gray-600 text-lg">{jobData.employer_name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                handleBookmark(jobData.job_id, jobData.bookmarked);
              }}
              className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {jobData.bookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400 hover:text-blue-600" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {jobData.job_employment_type && (
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                {jobData.job_employment_type}
              </span>
            )}
            <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium">
              {jobData.job_city}, {jobData.job_country}
            </span>
          </div>

          <div className="prose max-w-none mb-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {jobData.job_description}
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href={jobData.job_apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Apply Now
            </a>
            <button
              onClick={() => {
                setSelectedJobId(jobData.job_id);
                setIsModalOpen(true);
              }}
              className="flex-1 text-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Analyze Job
            </button>
          </div>
        </div>
      </div>
      <div>
        <JobAnalysisModal
          jobId={selectedJobId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default JobDetails;
