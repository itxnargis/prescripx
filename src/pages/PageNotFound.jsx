import { Home, ArrowLeft, Stethoscope, Calendar } from "lucide-react"

const PageNotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleGoBack = () => {
    window.history.back()
  }

  

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* 404 Number */}
          <div className="text-6xl font-bold text-gray-300 mb-6">404</div>

          {/* Icon */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>

          {/* Message */}
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-primary transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </button>
            
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/my-appointments"
                className="flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors duration-200"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </a>
              <a
                href="/doctors"
                className="flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors duration-200"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Find Doctors</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound