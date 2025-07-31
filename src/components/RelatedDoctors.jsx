import { useContext, useEffect, useState, useCallback, memo } from "react"
import { useNavigate } from "react-router-dom"
import { Star, MapPin, Clock, ArrowRight, Users, Calendar, Shield } from 'lucide-react'
import { AppContext } from "../context/AppContext"

const RelatedDoctors = memo(({ speciality, docId }) => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [relDoc, setRelDoc] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleDoctors, setVisibleDoctors] = useState(5)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [bookingStates, setBookingStates] = useState({})

  useEffect(() => {
    if (doctors?.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
      setRelDoc(doctorsData)
      setIsLoading(false)
    }
  }, [doctors, speciality, docId])

  const handleDoctorClick = useCallback(
    (doctorId, isAvailable) => {
      if (!isAvailable) {
        return
      }
      setBookingStates((prev) => ({ ...prev, [doctorId]: "booking" }))

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "click", {
          event_category: "doctor_selection",
          event_label: "related_doctor_click",
        })
      }

      setTimeout(() => {
        navigate(`/appointment/${doctorId}`)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 300)
    },
    [navigate],
  )

  const handleViewMore = useCallback(() => {
    navigate("/doctors")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [navigate])

  const handleLoadMore = useCallback(() => {
    setVisibleDoctors((prev) => prev + 5)
  }, [])

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${speciality} Doctors`,
            description: `Find qualified ${speciality} specialists`,
            numberOfItems: relDoc.length,
            itemListElement: relDoc.slice(0, visibleDoctors).map((doctor, index) => ({
              "@type": "Person",
              position: index + 1,
              name: `Dr. ${doctor.name}`,
              jobTitle: doctor.speciality,
              image: doctor.image,
            })),
          }),
        }}
      />
      <section
        className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
        aria-labelledby="related-doctors-heading"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Discover other trusted specialists in the same field who can provide exceptional care tailored to your
              specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {relDoc.slice(0, visibleDoctors).map((doctor, index) => (
              <article
                key={doctor._id}
                className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100
                           overflow-hidden transition-all duration-300 transform ${doctor.available ? "hover:scale-[1.02]" : "opacity-75"
                  } ${hoveredCard === doctor._id ? "ring-2 ring-blue-500/20 shadow-xl" : ""}`}
                onMouseEnter={() => doctor.available && setHoveredCard(doctor._id)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                tabIndex={doctor.available ? 0 : -1}
                aria-label={`${doctor.available ? "Book appointment with" : "Doctor currently unavailable"} Dr. ${doctor.name
                  }, ${doctor.speciality}`}
                aria-disabled={!doctor.available}
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 aspect-[4/3]">
                  <img
                    className={`w-full h-full object-cover transition-transform duration-500 ${doctor.available ? "group-hover:scale-105" : "grayscale"
                      }`}
                    src={doctor.image || "/placeholder.svg?height=240&width=320&query=professional doctor portrait"}
                    alt={`Dr. ${doctor.name}`}
                    loading={index < 4 ? "eager" : "lazy"}
                    width="320"
                    height="240"
                  />
                  <div
                    className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                               font-medium backdrop-blur-sm ${doctor.available ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${doctor.available ? "bg-green-200 animate-pulse" : "bg-red-200"
                        }`}
                    />
                    {doctor.available ? "Available" : "Busy"}
                  </div>
                  {!doctor.available && (
                    <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-gray-700">Currently Unavailable</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Dr. {doctor.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{doctor.speciality}</p>
                  </div>
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
                  <button
                    onClick={() => handleDoctorClick(doctor._id, doctor.available)}
                    disabled={!doctor.available || bookingStates[doctor._id] === "booking"}
                    className={`
                      w-full relative overflow-hidden rounded-xl font-semibold text-sm py-3 px-4
                      transition-all duration-300 transform text-blue-600 ${doctor.available
                        ? `bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105${bookingStates[doctor._id] === "booking" ? "animate-pulse" : ""
                        }`
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {doctor.available && !bookingStates[doctor._id] && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    <div className="relative flex items-center justify-center gap-2">
                      {bookingStates[doctor._id] === "booking" ? (
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
                    {doctor.available && !bookingStates[doctor._id] && (
                      <div className="absolute inset-0 rounded-xl ring-2 ring-blue-400 ring-opacity-0                                     group-hover:ring-opacity-75 group-hover:animate-ping transition-all duration-300" />
                    )}
                  </button>
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

          <div className="text-center space-y-4">
            {visibleDoctors < relDoc.length && (
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
                onClick={handleViewMore}
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

RelatedDoctors.displayName = "RelatedDoctors"

export default RelatedDoctors
