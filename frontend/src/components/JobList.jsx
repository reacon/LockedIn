import React, { useState } from "react";
import { useDragDrop } from "../context/DragDropContext";
import { Bookmark, BookmarkCheck } from "lucide-react";
import JobAnalysisModal from "./JobAnalysisModal";
import { Link } from "react-router-dom";

const JobList = ({ jobs, loading, error, handleBookmark }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const { setDraggedJob, setIsDragging } = useDragDrop();
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const toggle_bookmark = async (jobId, is_bookmarked) => {
    try {
      await handleBookmark(jobId, is_bookmarked);
    } catch (error) {
      console.error("Bookmark failed:");
    }
  };
  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    setIsDragging(true);
    e.currentTarget.classList.add("opacity-50");
  };
  const handleDragEnd = (e) => {
    setIsDragging(false);
    e.currentTarget.classList.remove("opacity-50");
  };
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <div
          key={job.job_id}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, job.job_id)}
          onDragEnd={handleDragEnd}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {job.employer_logo ? (
                  <img
                    src={job.employer_logo}
                    alt={job.employer_name}
                    className="w-12 h-12 object-contain rounded-lg mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                    <span className="text-gray-400 text-xl font-semibold">
                      {job.employer_name?.[0]}
                    </span>
                  </div>
                )}
                <div>
                  <Link
                    to={`/job/${job.job_id}`}
                    state={{ jobData: job }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                      {job.job_title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm">{job.employer_name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  toggle_bookmark(job.job_id, job.bookmarked);
                  console.log(job.bookmarked);
                }}
                className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {job.bookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-blue-600" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                )}
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {job.job_description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.job_employment_type && (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  {job.job_employment_type}
                </span>
              )}
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                {job.job_city}, {job.job_country}
              </span>
            </div>

            <div className="flex gap-4">
              <a
                href={job.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Apply Now
              </a>
              <button
                onClick={() => {
                  setSelectedJobId(job.job_id);
                  setIsModalOpen(true);
                }}
                className="flex-1 text-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Analyze Job
              </button>
            </div>
          </div>
        </div>
      ))}
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

export default JobList;
