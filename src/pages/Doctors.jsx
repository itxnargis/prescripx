"use client"

import { useContext, useEffect, useState, useCallback, memo, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import {
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  X,
  Users,
  Award,
  Stethoscope,
  Calendar,
} from "lucide-react"

const Doctors = memo(() => {
  const { speciality } = useParams()
  const [filterDoctor, setFilterDoctor] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    availability: null,
    gender: null,
    experience: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [bookingStates, setBookingStates] = useState({})
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const doctorsPerPage = 6 // Display 9 doctors per page (3 columns * 3 rows)

  const specialties = [
    { name: "General physician", icon: "🩺" },
    { name: "Gynaecologist", icon: "👩‍⚕️" },
    { name: "Dermatologist", icon: "🧴" },
    { name: "Pediatricians", icon: "👶" },
    { name: "Neurologist", icon: "🧠" },
    { name: "Gastroenterologist", icon: "🫀" },
  ]

  // Apply filters to doctors list
  const applyFilter = useCallback(() => {
    setIsLoading(true)
    let filtered = [...doctors]

    // Filter by specialty if provided
    if (speciality) {
      filtered = filtered.filter((doctor) => doctor.speciality === speciality)
    }

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (doctor) => doctor.name.toLowerCase().includes(term) || doctor.speciality.toLowerCase().includes(term),
      )
    }

    // Apply availability filter
    if (selectedFilters.availability) {
      filtered = filtered.filter((doctor) => {
        if (selectedFilters.availability === "available") return doctor.available
        return !doctor.available
      })
    }

    // Apply gender filter (assuming doctors have gender property)
    if (selectedFilters.gender) {
      filtered = filtered.filter((doctor) => doctor.gender === selectedFilters.gender)
    }

    // Apply experience filter (assuming doctors have experience property)
    if (selectedFilters.experience) {
      filtered = filtered.filter((doctor) => {
        const exp = Number.parseInt(doctor.experience?.replace(/\D/g, "") || "0")
        switch (selectedFilters.experience) {
          case "0-2":
            return exp >= 0 && exp <= 2
          case "3-5":
            return exp >= 3 && exp <= 5
          case "5+":
            return exp > 5
          default:
            return true
        }
      })
    }
    setFilterDoctor(filtered)
    setCurrentPage(1) // Reset to first page on filter change
    setIsLoading(false)
  }, [doctors, speciality, searchTerm, selectedFilters])

  // Initialize filters when doctors data changes
  useEffect(() => {
    if (doctors.length > 0) {
      applyFilter()
    }
  }, [doctors, speciality, applyFilter])

  // Handle specialty selection
  const handleSpecialityClick = useCallback(
    (specialtyName) => {
      // Track user interaction
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "filter_by_specialty", {
          event_category: "doctor_search",
          event_label: specialtyName || "all",
        })
      }
      if (speciality === specialtyName) {
        navigate("/doctors")
      } else {
        navigate(`/doctors/${specialtyName}`)
      }
      setShowFilter(false)
    },
    [navigate, speciality],
  )

  // Handle doctor selection - Updated to prevent busy doctor booking
  const handleDoctorClick = useCallback(
    (doctorId, isAvailable) => {
      // Prevent booking if doctor is not available
      if (!isAvailable) {
        return
      }
      // Optimistic UI update
      setBookingStates((prev) => ({ ...prev, [doctorId]: "booking" }))
      // Track user interaction
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "select_doctor", {
          event_category: "doctor_search",
          event_label: doctorId,
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

  // Handle search input change
  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm(e.target.value)
      // Debounce search to avoid too many re-renders
      const timer = setTimeout(() => {
        applyFilter()
      }, 300)
      return () => clearTimeout(timer)
    },
    [applyFilter],
  )

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterType, value) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType] === value ? null : value,
      }))
      // Apply filters after a short delay
      setTimeout(() => {
        applyFilter()
      }, 100)
    },
    [applyFilter],
  )

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedFilters({
      availability: null,
      gender: null,
      experience: null,
    })
    setTimeout(() => {
      applyFilter()
    }, 100)
  }, [applyFilter])

  // Get current doctors for the page
  const indexOfLastDoctor = currentPage * doctorsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
  const currentDoctors = useMemo(
    () => filterDoctor.slice(indexOfFirstDoctor, indexOfLastDoctor),
    [filterDoctor, indexOfFirstDoctor, indexOfLastDoctor],
  )

  // Calculate total pages
  const totalPages = Math.ceil(filterDoctor.length / doctorsPerPage)

  // Change page
  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), [])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            name: "PrescripX Doctor Directory",
            description: speciality
              ? `Find and book appointments with experienced ${speciality} specialists`
              : "Browse through our comprehensive directory of medical specialists and healthcare professionals",
            url: `https://prescripx.com/doctors${speciality ? `/${speciality}` : ""}`,
            medicalSpecialty: speciality || "Various medical specialties",
            availableService: {
              "@type": "MedicalProcedure",
              name: "Medical Consultation",
              description: "Book appointments with qualified healthcare professionals",
            },
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%239CA3AF%22 fillOpacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {speciality ? `${speciality} Specialists` : "All Doctors"}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  {speciality
                    ? `Find and book appointments with experienced ${speciality.toLowerCase()} specialists in your area.`
                    : "Browse through our comprehensive directory of medical specialists and healthcare professionals."}
                </p>
              </div>
            </div>
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search doctors by name or specialty..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
            {/* Results Count */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Users className="w-4 h-4" />
              <span>
                {filterDoctor.length} {filterDoctor.length === 1 ? "doctor" : "doctors"}
                {speciality && ` specializing in ${speciality}`}
              </span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Specialties */}
            <div className="lg:w-80 flex-shrink-0">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`lg:hidden w-full mb-6 flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                  showFilter
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-500 shadow-lg"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                }`}
              >
                <span className="font-semibold flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter Specialties
                </span>
                <div className={`w-5 h-5 transition-transform duration-300 ${showFilter ? "rotate-180" : ""}`}>
                  {showFilter ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              <div className={`space-y-3 ${showFilter ? "block" : "hidden lg:block"}`}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-500" />
                    Specialties
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSpecialityClick(null)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${
                        !speciality
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      <span className="text-lg">👨‍⚕️</span>
                      <span className="font-medium">All Doctors</span>
                      <span
                        className={`ml-auto text-xs px-2 py-1 rounded-full ${
                          !speciality ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {doctors.length}
                      </span>
                    </button>
                    {specialties.map((specialty) => {
                      const isActive = speciality === specialty.name
                      const count = doctors.filter((doc) => doc.speciality === specialty.name).length
                      return (
                        <button
                          key={specialty.name}
                          onClick={() => handleSpecialityClick(specialty.name)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          }`}
                        >
                          <span className="text-lg">{specialty.icon}</span>
                          <span className="font-medium">{specialty.name}</span>
                          <span
                            className={`ml-auto text-xs px-2 py-1 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}
                          >
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* Additional Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                  <div className="space-y-2">
                    {["0-2", "3-5", "5+"].map((exp) => (
                      <button
                        key={exp}
                        onClick={() => handleFilterChange("experience", exp)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-sm transition-colors duration-200 ${
                          selectedFilters.experience === exp
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{exp} Years</span>
                        {selectedFilters.experience === exp && <CheckCircle className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Main Content - Doctor Cards */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="animate-pulse space-y-4">
                        <div className="h-48 bg-gray-200 rounded-xl" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-5/6" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filterDoctor.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                  <p className="text-gray-500 mb-6">
                    {speciality
                      ? `No doctors found in ${speciality}. Try browsing all doctors or select a different specialty.`
                      : "No doctors match your search criteria. Try adjusting your filters."}
                  </p>
                  <button
                    onClick={() => {
                      resetFilters()
                      navigate("/doctors")
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    View All Doctors
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentDoctors.map((doctor, index) => (
                    <article
                      key={doctor._id}
                      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100
                                overflow-hidden transition-all duration-500 transform ${
                                  doctor.available
                                    ? `cursor-pointer hover:scale-[1.02] ${hoveredCard === doctor._id ? "ring-2 ring-blue-500/20" : ""}`
                                    : "opacity-75 cursor-not-allowed"
                                }`}
                      onClick={() => handleDoctorClick(doctor._id, doctor.available)}
                      onMouseEnter={() => doctor.available && setHoveredCard(doctor._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      role="button"
                      tabIndex={doctor.available ? 0 : -1}
                      aria-label={`${doctor.available ? "Book appointment with" : "Doctor currently unavailable"} Dr. ${doctor.name}, ${doctor.speciality}`}
                      onKeyDown={(e) => {
                        if (doctor.available && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault()
                          handleDoctorClick(doctor._id, doctor.available)
                        }
                      }}
                    >
                      {/* Background Gradient - Only for available doctors */}
                      {doctor.available && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      )}
                      {/* Doctor Image */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 aspect-square">
                        <img
                          className={`w-full h-full object-cover transition-transform duration-700 ${doctor.available ? "group-hover:scale-110" : "grayscale"}`}
                          src={
                            doctor.image || "/placeholder.svg?height=300&width=300&query=professional doctor portrait"
                          }
                          alt={`Dr. ${doctor.name} - ${doctor.speciality}`}
                          loading={index < 6 ? "eager" : "lazy"}
                          width="300"
                          height="300"
                        />
                        {/* Enhanced Availability Badge */}
                        <div
                          className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full
                                    text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
                                      doctor.available
                                        ? "bg-green-500/90 text-white shadow-lg"
                                        : "bg-red-500/90 text-white shadow-lg"
                                    }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${doctor.available ? "bg-green-200 animate-pulse" : "bg-red-200"}`}
                          />
                          {doctor.available ? "Available" : "Busy"}
                        </div>
                        {/* Overlay for busy doctors */}
                        {!doctor.available && (
                          <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
                            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                              <span className="text-sm font-medium text-gray-700">Currently Unavailable</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Doctor Info */}
                      <div className="p-6 space-y-3">
                        <div className="space-y-2">
                          <h3
                            className={`text-xl font-bold transition-colors duration-300 ${
                              doctor.available ? "text-gray-900 group-hover:text-blue-600" : "text-gray-600"
                            }`}
                          >
                            Dr. {doctor.name}
                          </h3>
                          <p className="text-gray-600 font-medium text-sm bg-gray-50 inline-block px-3 py-1 rounded-full">
                            {doctor.speciality}
                          </p>
                        </div>
                        {/* Rating */}
                        <div className="flex items-center space-x-1 text-sm">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <span className="text-gray-600">(120+)</span>
                        </div>
                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{doctor.address?.line1 || "Healthcare Professional"}</span>
                        </div>
                        {/* Quick Actions */}
                        <div className="pt-2">
                          <button
                            onClick={() => handleDoctorClick(doctor._id, doctor.available)}
                            disabled={!doctor.available || bookingStates[doctor._id] === "booking"}
                            className={`
                      w-full relative bg-blue-600 overflow-hidden rounded-xl font-semibold text-sm py-3 px-4
                      transition-all duration-300 transform${
                        doctor.available
                          ? `bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105${bookingStates[doctor._id] === "booking" ? "animate-pulse" : ""}`
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }
                    `}
                          >
                            {/* Animated Background Shine Effect - Only for available doctors */}
                            {doctor.available && !bookingStates[doctor._id] && (
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                     -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                              />
                            )}
                            {/* Button Content */}
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
                            {/* Pulse Ring Effect - Only for available doctors */}
                            {doctor.available && !bookingStates[doctor._id] && (
                              <div
                                className="absolute inset-0 rounded-xl ring-2 ring-blue-400 ring-opacity-0
                                     group-hover:ring-opacity-75 group-hover:animate-ping transition-all duration-300"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {/* Pagination */}
              {filterDoctor.length > doctorsPerPage && (
                <div className="mt-12 flex justify-center">
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300
                                bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronUp className="w-5 h-5 rotate-90" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border
                                ${
                                  currentPage === i + 1
                                    ? "border-primary bg-primary text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                } text-sm font-medium`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300
                                bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="w-5 h-5 rotate-90" />
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

Doctors.displayName = "Doctors"

export default Doctors
