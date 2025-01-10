/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, BookmarkIcon, LogOut, Briefcase } from "lucide-react";
import { JobService } from "../services/JobService";
import { useDragDrop } from "../context/DragDropContext";
import { useJobs } from "../context/JobContext";

const Navbar = ({ user, handleLogout }) => {
  const { draggedJob, setDraggedJob, setIsDragging } = useDragDrop();
  const navigate = useNavigate();
  // const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { jobs, setJobs } = useJobs();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };
  const handleBookmark = async (jobId) => {
    await JobService.bookmarkJob(jobId);
    setJobs(
      jobs.map((job) =>
        job.job_id === jobId ? { ...job, bookmarked: true } : job
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-blue-100", "scale-105");
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-100", "scale-105");
  };
  const handleDragDrop = async (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-100", "scale-105");
    setDraggedJob(null);
    setIsDragging(false);
    if (draggedJob) {
      await handleBookmark(draggedJob);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                LockedIn
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <button
                onClick={() => navigate("/jobs")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Jobs
              </button>
              <button
                onDragOver={handleDragOver}
                onDrop={handleDragDrop}
                onDragLeave={handleDragLeave}
                onClick={() => navigate("/bookmarks")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Bookmarks
              </button>
            </div>
          </div>

          {/* User profile section */}
          <div className="flex items-center">
            {/* {location.pathname === "/bookmarks" ? (
              <button
                onClick={() => navigate("/jobs")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm fontmedium transition-colors duration-200 flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1 pt-1" />
                Jobs
              </button>
            ) : (
              <></>
            )} */}
            {/* User profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={toggleProfile}
                  className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="ml-2 text-gray-700 text-sm hidden md:block">
                    {user.name}
                  </span>
                </button>
              </div>

              {/* Profile dropdown panel */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                navigate("/jobs");
                setIsMenuOpen(false);
              }}
              className="w-full text-left text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium items-center"
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Jobs
            </button>
            <button
              onClick={() => {
                navigate("/bookmarks");
                setIsMenuOpen(false);
              }}
              className="w-full text-left text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium items-center"
            >
              <BookmarkIcon className="h-5 w-5 mr-2" />
              Bookmarks
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// /* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Menu, X, BookmarkIcon, User, LogOut, Briefcase } from "lucide-react";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   return (
//     <nav className="bg-white shadow-lg fixed w-full top-0 z-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo and primary nav */}
//           <div className="flex items-center">
//             <div
//               className="flex-shrink-0 flex items-center cursor-pointer"
//               onClick={() => navigate("/jobs")}
//             >
//               <Briefcase className="h-8 w-8 text-blue-600" />
//               <span className="ml-2 text-xl font-bold text-gray-900">
//                 JobHub
//               </span>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:ml-6 md:flex md:space-x-4">
//               <button
//                 onClick={() => navigate("/jobs")}
//                 className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
//               >
//                 <Briefcase className="h-4 w-4 mr-2" />
//                 Jobs
//               </button>
//               <button
//                 onClick={() => navigate("/bookmarks")}
//                 className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
//               >
//                 <BookmarkIcon className="h-4 w-4 mr-2" />
//                 Bookmarks
//               </button>
//             </div>
//           </div>

//           {/* Mobile navigation */}
//           <div className="flex items-center md:hidden">
//             {location.pathname === "/bookmarks" ? (
//               <button
//                 onClick={() => navigate("/jobs")}
//                 className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
//               >
//                 <Briefcase className="h-5 w-5" />
//               </button>
//             ) : (
//               <button
//                 onClick={() => navigate("/bookmarks")}
//                 className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
//               >
//                 <BookmarkIcon className="h-5 w-5" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };
// export default Navbar;
