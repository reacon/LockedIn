/* eslint-disable no-unused-vars */
import React from "react";
import { JobService } from "../services/JobService";
import ListBookmarks from "../components/ListBookmarks";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BookmarksContainer = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currpage, setCurrpage] = useState(1);

  useEffect(() => {
    const handleListBookmarks = async (page = 1) => {
      try {
        const data = await JobService.getBookmarkedJobs(page);
        setBookmarks(data.jobs);
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    handleListBookmarks();
  }, []);

  const fetchbyurl = async (url) => {
    try {
      const data = await JobService.fetch_by_url(url);
      setBookmarks(data.jobs);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
      setCurrpage((currpage) =>
        url === pagination.next ? currpage + 1 : currpage - 1
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleBookmark = async (jobId) => {
    try {
      await JobService.deleteBookmark(jobId);
      setBookmarks(bookmarks.filter((job) => job.job_id !== jobId));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const totalPages = Math.ceil(pagination.count / 5);

  return (
    <main className="max-w-6xl mx-auto px-4 pb-8">
      <h1 className="text-2xl font-bold mb-6 pt-20">Bookmarked Jobs</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <ListBookmarks
        bookmarks={bookmarks}
        error={error}
        handleBookmark={handleBookmark}
      />

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => fetchbyurl(pagination.previous)}
          disabled={!pagination.previous}
          className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <span className="text-sm">
          Page {currpage} of {totalPages}
        </span>
        <button
          onClick={() => {
            fetchbyurl(pagination.next);
          }}
          disabled={!pagination.next}
          className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </main>
  );
};

export default BookmarksContainer;
