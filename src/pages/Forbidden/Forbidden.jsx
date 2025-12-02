// components/Forbidden.jsx
import { Link } from "react-router";
import { Truck, AlertTriangle, Home, ArrowLeft } from "lucide-react";

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-300 via-white to-orange-500 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Main Icon */}
        <div className="mb-8 relative">
          <div className="mx-auto w-32 h-32 md:w-40 md:h-40 bg-red-300 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-red-600" />
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <Truck className="w-20 h-20 text-orange-500 rotate-12 opacity-30" />
          </div>
        </div>

        {/* 403 Badge */}
        <div className="mb-6 inline-flex items-center gap-3 px-6 py-3 bg-red-100 rounded-full">
          <span className="text-4xl md:text-5xl font-bold text-red-600">403</span>
          <span className="text-red-600 font-semibold text-lg">Forbidden</span>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Oops! Access Restricted
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
          Sorry, you don't have permission to access this page. 
          This area is restricted to <span className="font-bold text-orange-600">Admin</span> or 
          authorized personnel only.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-4 rounded-lg transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 " />
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default Forbidden;