"use client"

import { useContext, useState, useCallback, memo } from "react"
import { useNavigate } from "react-router-dom"
import { Star, ArrowRight, Users, Award, Calendar, MapPin, Clock, Shield } from "lucide-react"
import { AppContext } from "../context/AppContext"

const TopDoctors = memo(() => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [visibleDoctors, setVisibleDoctors] = useState(9)
  const [bookingStates, setBookingStates] = useState({})

  const handleDoctorClick = useCallback(
    (doctorId, isAvailable) => {
      // Prevent booking if doctor is not available
      if (!isAvailable) {
        return
      }

      // Optimistic UI update
      setBookingStates(prev => ({ ...prev, [doctorId]: 'booking' }))

      // Track user interaction
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "click", {
          event_category: "doctor_selection",
          event_label: "top_doctor_click",
        })
      }

      // Simulate booking process with instant feedback
      setTimeout(() => {
        navigate(`/appointment/${doctorId}`)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 300)
    },
    [navigate],
  )

  const handleViewAll = useCallback(() => {
    navigate("/doctors")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [navigate])

  const handleLoadMore = useCallback(() => {
    setVisibleDoctors((prev) => Math.min(prev + 4, doctors.length))
  }, [doctors.length])

  if (!doctors || doctors.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse space-y-8">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="h-48 bg-gray-200 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Top Doctors",
            description: "Featured medical professionals with highest ratings",
            numberOfItems: Math.min(visibleDoctors, doctors.length),
            itemListElement: doctors.slice(0, visibleDoctors).map((doctor, index) => ({
              "@type": "Person",
              position: index + 1,
              name: `Dr. ${doctor.name}`,
              jobTitle: doctor.speciality,
              image: doctor.image,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "120",
              },
            })),
          }),
        }}
      />

      <section
        className="relative py-16 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30"
        aria-labelledby="top-doctors-heading"
        role="region"
      >
        {/* Optimized Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Simplified Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <Award className="w-3.5 h-3.5 mr-1.5" />
                Top Rated
              </span>
            </div>

            <h1 id="top-doctors-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Book with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Top Doctors
                </span>
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Connect with trusted medical professionals in just one click
            </p>
          </div>

          {/* Enhanced Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {doctors.slice(0, visibleDoctors).map((doctor, index) => (
              <article
                key={doctor._id}
                className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 
                          overflow-hidden transition-all duration-300 transform 
                          ${doctor.available ? 'hover:scale-[1.02]' : 'opacity-75'} 
                          ${hoveredCard === doctor._id ? "ring-2 ring-blue-500/20 shadow-xl" : ""}`}
                onMouseEnter={() => doctor.available && setHoveredCard(doctor._id)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                tabIndex={doctor.available ? 0 : -1}
                aria-label={`${doctor.available ? 'Book appointment with' : 'Doctor currently unavailable'} Dr. ${doctor.name}, ${doctor.speciality}`}
              >
                {/* Doctor Image with Optimized Loading */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 aspect-[4/3]">
                  <img
                    className={`w-full h-full object-cover transition-transform duration-500 
                              ${doctor.available ? 'group-hover:scale-105' : 'grayscale'}`}
                    src={doctor.image || "/placeholder.svg?height=240&width=320&query=professional doctor portrait"}
                    alt={`Dr. ${doctor.name}`}
                    loading={index < 4 ? "eager" : "lazy"}
                    width="320"
                    height="240"
                  />

                  {/* Enhanced Availability Badge */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs 
                              font-medium backdrop-blur-sm ${
                                doctor.available 
                                  ? "bg-green-500/90 text-white" 
                                  : "bg-red-500/90 text-white"
                              }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      doctor.available ? "bg-green-200 animate-pulse" : "bg-red-200"
                    }`} />
                    {doctor.available ? "Available" : "Busy"}
                  </div>

                  {/* Overlay for busy doctors */}
                  {!doctor.available && (
                    <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-gray-700">Currently Unavailable</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Streamlined Doctor Info */}
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      {doctor.speciality}
                    </p>
                  </div>

                  {/* Simplified Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-700">4.8</span>
                      <span className="text-gray-400">(120+)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>5+ years</span>
                    </div>
                  </div>

                  {/* ENHANCED BOOK NOW BUTTON - Updated Logic */}
                  <button
                    onClick={() => handleDoctorClick(doctor._id, doctor.available)}
                    disabled={!doctor.available || bookingStates[doctor._id] === 'booking'}
                    className={`
                      w-full relative overflow-hidden rounded-xl font-semibold text-sm py-3 px-4
                      transition-all duration-300 transform
                      ${doctor.available 
                        ? `bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105
                           ${bookingStates[doctor._id] === 'booking' ? 'animate-pulse' : ''}`
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {/* Animated Background Shine Effect - Only for available doctors */}
                    {doctor.available && !bookingStates[doctor._id] && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    
                    {/* Button Content */}
                    <div className="relative flex items-center justify-center gap-2">
                      {bookingStates[doctor._id] === 'booking' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Booking...</span>
                        </>
                      ) : doctor.available ? (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Book Now</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Currently Busy</span>
                        </>
                      )}
                    </div>

                    {/* Pulse Ring Effect - Only for available doctors */}
                    {doctor.available && !bookingStates[doctor._id] && (
                      <div className="absolute inset-0 rounded-xl ring-2 ring-blue-400 ring-opacity-0 
                                    group-hover:ring-opacity-75 group-hover:animate-ping transition-all duration-300" />
                    )}
                  </button>

                  {/* Quick Info */}
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-1">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>Verified</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>Available Online</span>
                    </div>
                    {!doctor.available && (
                      <div className="flex items-center gap-1 text-red-500">
                        <Clock className="w-3 h-3" />
                        <span>Busy</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Simplified Load More / View All */}
          <div className="text-center space-y-4">
            {visibleDoctors < doctors.length && (
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 
                         px-6 py-2.5 rounded-full font-medium hover:bg-blue-50 hover:border-blue-300 
                         transition-all duration-200 transform hover:scale-105"
              >
                <span>Show More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div>
              <button
                onClick={handleViewAll}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-gray-50 to-blue-50 
                         text-gray-700 hover:text-blue-600 px-6 py-3 rounded-full font-semibold 
                         border border-gray-200 hover:border-blue-300 transition-all duration-300 
                         transform hover:scale-105"
              >
                <span>View All Doctors</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
})

TopDoctors.displayName = "TopDoctors"

export default TopDoctors