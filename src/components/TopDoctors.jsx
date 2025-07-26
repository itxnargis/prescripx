"use client"

import { useContext, useState, useCallback, memo } from "react"
import { useNavigate } from "react-router-dom"
import { Star, ArrowRight, Users, Award, Calendar, MapPin, Clock, Shield } from "lucide-react"
import { AppContext } from "../context/AppContext"

const TopDoctors = memo(() => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [visibleDoctors, setVisibleDoctors] = useState(8)

  const handleDoctorClick = useCallback(
    (doctorId) => {
      // Track user interaction
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "click", {
          event_category: "doctor_selection",
          event_label: "top_doctor_click",
        })
      }

      navigate(`/appointment/${doctorId}`)
      window.scrollTo({ top: 0, behavior: "smooth" })
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        className="relative py-20 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20"
        aria-labelledby="top-doctors-heading"
        role="region"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%239CA3AF%22 fillOpacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <Award className="w-4 h-4 mr-2" />
                Featured Specialists
              </span>
            </div>

            <h1 id="top-doctors-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Top Doctors to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Book
                </span>
                <span
                  className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-blue-200 to-indigo-200 
                               -skew-x-12 transform origin-bottom-left"
                />
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover and connect with our carefully curated network of{" "}
              <span className="font-semibold text-gray-800">trusted medical professionals</span> who are ready to
              provide exceptional care.
            </p>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {doctors.slice(0, visibleDoctors).map((doctor, index) => (
              <article
                key={doctor._id}
                className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 
                          overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-[1.02] 
                          ${hoveredCard === doctor._id ? "ring-2 ring-blue-500/20" : ""}`}
                onClick={() => handleDoctorClick(doctor._id)}
                onMouseEnter={() => setHoveredCard(doctor._id)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                tabIndex={0}
                aria-label={`Book appointment with Dr. ${doctor.name}, ${doctor.speciality}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleDoctorClick(doctor._id)
                  }
                }}
              >
                {/* Background Gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Doctor Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 aspect-square">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={doctor.image || "/placeholder.svg?height=300&width=300&query=professional doctor portrait"}
                    alt={`Dr. ${doctor.name} - ${doctor.speciality}`}
                    loading={index < 4 ? "eager" : "lazy"}
                    width="300"
                    height="300"
                  />

                  {/* Availability Badge */}
                  <div
                    className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs 
                              font-medium backdrop-blur-sm transition-all duration-300 ${
                                doctor.available ? "bg-green-500/90 text-white shadow-lg" : "bg-gray-500/90 text-white"
                              }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        doctor.available ? "bg-green-200" : "bg-gray-300"
                      } animate-pulse`}
                    />
                    {doctor.available ? "Available" : "Busy"}
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
                                transition-all duration-300 bg-black/20"
                  >
                    <button
                      className="bg-white/90 backdrop-blur-sm text-blue-600 font-semibold px-6 py-3 rounded-full 
                                     shadow-lg hover:bg-white hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                    </button>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-gray-600 font-medium text-sm bg-gray-50 inline-block px-3 py-1 rounded-full">
                      {doctor.speciality}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">4.8</span>
                      <span className="text-gray-400">(120+)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>5+ years</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>Healthcare Professional</span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-2 px-3 rounded-lg 
                                     hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      Book Now
                    </button>
                    <button
                      className="flex-1 bg-gray-100 text-gray-600 text-xs font-medium py-2 px-3 rounded-lg 
                                     hover:bg-gray-200 transition-colors duration-200"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More / View All */}
          <div className="text-center space-y-6">
            {visibleDoctors < doctors.length && (
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 bg-white border-2 border-blue-200 text-blue-600 
                         px-6 py-3 rounded-full font-semibold hover:bg-blue-50 hover:border-blue-300 
                         transition-all duration-300 transform hover:scale-105"
              >
                <span>Load More Doctors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div>
              <button
                onClick={handleViewAll}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 
                         hover:from-blue-100 hover:to-indigo-100 text-gray-700 hover:text-blue-600 px-8 py-4 
                         rounded-full font-semibold text-lg shadow-sm hover:shadow-lg transition-all duration-300 
                         transform hover:scale-105 border border-blue-200/50 hover:border-blue-300"
                aria-label="View all doctors"
              >
                <span>View All Doctors</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>All doctors verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>10,000+ satisfied patients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Top-rated professionals</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
})

TopDoctors.displayName = "TopDoctors"

export default TopDoctors
