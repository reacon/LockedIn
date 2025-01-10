import React from "react";
import { useState } from "react";

const SearchForm = ({ handleSearch }) => {
  const [filters, setFilters] = useState({
    query: "",
    country: "",
    employer_name: "",
    job_title: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(filters, 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Search Jobs
          </label>
          <input
            type="text"
            name="query"
            placeholder="Enter keywords..."
            value={filters.query}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="job_title"
            placeholder="e.g. Software Engineer"
            value={filters.job_title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Company
          </label>
          <input
            type="text"
            name="employer_name"
            placeholder="Enter company name"
            value={filters.employer_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="space-y-2"> 
          <label className="block text-sm font-semibold text-gray-700">
            Country
          </label>
          <select
            name="country"
            value={filters.country}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Countries</option>
            <option value="us">United States</option>
            <option value="gb">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-md hover:shadow-lg"
          >
            Search Jobs
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
