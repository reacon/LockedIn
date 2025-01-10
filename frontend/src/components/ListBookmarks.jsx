import React from "react";

const ListBookmarks = ({ bookmarks, error, handleBookmark }) => {
  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p className="text-lg">No bookmarked jobs found</p>
        <p className="mt-2">Jobs you bookmark will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.job_id}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {bookmark.employer_logo && (
                <img
                  src={bookmark.employer_logo}
                  alt={bookmark.employer_name}
                  className="w-12 h-12 object-contain mr-4"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{bookmark.job_title}</h3>
                <p className="text-gray-600">{bookmark.employer_name}</p>
              </div>
            </div>
            <button
              onClick={() => handleBookmark(bookmark.job_id, true)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700">
              {bookmark.job_description.slice(0, 150)}...
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {bookmark.job_employment_type && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {bookmark.job_employment_type}
              </span>
            )}
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {bookmark.job_city}, {bookmark.job_country}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <a
              href={bookmark.job_apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block
            bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {" "}
              Apply Now
            </a>
            <span className="text-sm text-gray-500">
              Added {new Date(bookmark.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListBookmarks;
