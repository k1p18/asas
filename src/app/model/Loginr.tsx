"use client";

import { useState } from "react";


const Loginr = () => {
    const [isLogin, setIsLogin] = useState(true);
  return (
    <>

    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-200 to-yellow-100 px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden transition-transform transform hover:scale-105 duration-300">
        {/* Tab Switcher */}
        <div className="flex bg-gray-50 border-b border-gray-200 rounded-t-xl overflow-hidden shadow-inner">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-4 px-6 text-lg font-semibold transition-all duration-300 focus:outline-none ${
              isLogin
                ? "text-red-600 border-b-4 border-red-600"
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-4 px-6 text-lg font-semibold transition-all duration-300 focus:outline-none ${
              !isLogin
                ? "text-red-600 border-b-4 border-red-600"
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Wrapper */}
        <div className="p-8 bg-white">
          {/* Login Form */}
          {isLogin && (
            <form className="space-y-6 transition-opacity duration-500 opacity-100">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition focus:shadow-lg"
                  placeholder="example@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition focus:shadow-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 duration-300"
              >
                Login
              </button>
            </form>
          )}

          {/* Register Form */}
          {!isLogin && (
            <form className="space-y-6 transition-opacity duration-500 opacity-100">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition focus:shadow-lg"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition focus:shadow-lg"
                  placeholder="example@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition focus:shadow-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition focus:shadow-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 duration-300"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </section>

</>
  )
}

export default Loginr