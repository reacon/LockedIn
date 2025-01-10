/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import GoogleLoginComponent from "../components/GoogleLoginComponent";
import Navbar from "../components/Navbar";
import {
  logoutWithGoogle,
  checkSession,
  authenticateWithGoogle,
} from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const AuthContainer = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchsession = async () => {
      try {
        const response = await checkSession();
        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    fetchsession();
  }, [navigate]);
  const handleLoginSuccess = async (response) => {
    const { credential } = response;
    try {
      const data = await authenticateWithGoogle(credential);
      setUser(data.user);
      navigate("/jobs");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await logoutWithGoogle();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div>
      {user ? (
        <div>
          <Navbar user={user} handleLogout={handleLogout} />
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen py-12">
          <div className="w-full max-w-3xl">
            {" "}
            {/* Increased max-width for desktop */}
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-[#4858E8] mb-2">
                LockedIn
              </h1>
              <p className="text-gray-600">
                Your gateway to endless opportunities
              </p>
            </div>
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#4858E8] to-[#9C42F5] text-white px-8 py-10">
                <h2 className="text-3xl font-semibold text-center mb-2">
                  Welcome Back!
                </h2>
                <p className="text-center text-blue-100">
                  Sign in to access your job search journey
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="text-[#4858E8] text-lg font-semibold mb-2">
                      Job Search
                    </h3>
                    <p className="text-gray-600">
                      Access thousands of listings
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <h3 className="text-[#9C42F5] text-lg font-semibold mb-2">
                      Track
                    </h3>
                    <p className="text-gray-600">Monitor applications</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="text-[#4858E8] text-lg font-semibold mb-2">
                      Save
                    </h3>
                    <p className="text-gray-600">Bookmark favorites</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <h3 className="text-[#9C42F5] text-lg font-semibold mb-2">
                      Connect
                    </h3>
                    <p className="text-gray-600">Network with employers</p>
                  </div>
                </div>

                {/* Welcome Section */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Welcome
                  </h2>
                  <p className="text-gray-600">Please sign in to continue</p>
                </div>

                {/* Login Button */}
                <div className="flex justify-center">
                  <GoogleLoginComponent onGoogleResponse={handleLoginSuccess} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthContainer;
