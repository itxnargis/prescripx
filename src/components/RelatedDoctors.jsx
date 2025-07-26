"use client"

import { useContext, useEffect, useState, useCallback, memo } from "react"
import { useNavigate } from "react-router-dom"
import { Star, MapPin, Clock, ArrowRight, Users, Calendar, Award, Shield } from 'lucide-react'
import { AppContext } from "../context/AppContext"

const RelatedDoctors = memo(({ speciality, docId }) => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [relDoc, setRelDoc] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleDoctors, setVisibleDoctors] = useState(5)

  useEffect(() => {
    if (doctors?.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => 
        doc.speciality === speciality && doc._id !== docId
      )
      setRelDoc(doctorsData)
      setIsLoading(false)
    }
  }, [doctors, speciality, docId])

  const handleDoctorClick = useCallback((doctorId) => {
    // Track user interaction
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'doctor_selection',
        event_label: 'related_doctor_click'
      })
    }
    
    navigate(`/appointment/${doctorId}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [navigate])

  const handleViewMore = useCallback(() => {
    navigate("/doctors")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [navigate])

  const handleLoadMore = useCallback(() => {
    setVisibleDoctors(prev => prev + 5)
  }, [])

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white" aria-label="Loading related doctors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
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

  if (relDoc.length === 0) {
    return null
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
            "name": `${speciality} Doctors`,
            "description": `Find qualified ${speciality} specialists`,
            "numberOfItems": relDoc.length,
            "itemListElement": relDoc.slice(0, visibleDoctors).map((doctor, index) => ({
              "@type": "Person",
              "position": index + 1,
              "name": `Dr. ${doctor.name}`,
              "jobTitle": doctor.speciality,
              "image": doctor.image
            }))
          })
        }}
      />

      <section
        className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
        aria-labelledby="related-doctors-heading"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium text-sm">Related Specialists</span>
            </div>
            
            <h2 id="related-doctors-heading" className="text-3xl lg:text-4xl font-bold text-gray-900">
              More Doctors in{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {speciality}
              </span>
            </h2>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover other trusted specialists in the same field who can provide exceptional care 
              tailored to your specific needs.
            </p>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
            {relDoc.slice(0, visibleDoctors).map((doctor, index) => (
              <article
                key={doctor._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 
                         overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-[1.02] 
                         hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary/20"
                onClick={() => handleDoctorClick(doctor._id)}
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
                    className={`absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 rounded-full 
                              text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
                      doctor.available 
                        ? "bg-green-500/90 text-white shadow-lg" 
                        : "bg-gray-500/90 text-white"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        doctor.available ? "bg-green-200" : "bg-gray-300"
                      } animate-pulse`}
                    />
                    {doctor.available ? "Available" : "Busy"}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <button className="w-full bg-white/90 backdrop-blur-sm text-primary font-semibold py-2 px-4 
                                       rounded-lg hover:bg-white transition-all duration-200 flex items-center 
                                       justify-center space-x-2">
                        <span>Book Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-primary font-medium text-sm bg-primary/10 inline-block px-3 py-1 rounded-full">
                      {doctor.speciality}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-gray-400">(120+)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>5+ years</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>Healthcare Center</span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <button className="flex-1 bg-primary/10 text-primary text-xs font-medium py-2 px-3 rounded-lg 
                                     hover:bg-primary/20 transition-colors duration-200 flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Book
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-600 text-xs font-medium py-2 px-3 rounded-lg 
                                     hover:bg-gray-200 transition-colors duration-200">
                      View Profile
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More / View All Actions */}
          <div className="text-center space-y-4">
            {visibleDoctors < relDoc.length && (
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center space-x-2 bg-white border-2 border-primary/20 text-primary 
                         px-6 py-3 rounded-full font-semibold hover:bg-primary/5 hover:border-primary/30 
                         transition-all duration-300 transform hover:scale-105"
              >
                <span>Load More Doctors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {relDoc.length > 5 && (
              <div className="pt-4">
                <button
                  onClick={handleViewMore}
                  className="group inline-flex items-center space-x-3 bg-gradient-to-r from-primary to-blue-600 
                           hover:from-blue-600 hover:to-primary text-white px-8 py-4 rounded-full font-semibold 
                           shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>View All {speciality} Doctors</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>All doctors are verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Quick appointment booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Highly rated professionals</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
})

RelatedDoctors.displayName = 'RelatedDoctors'

export default RelatedDoctors
