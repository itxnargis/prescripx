"use client"

import { useContext, useEffect, useState, useCallback, memo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { assets } from "../../public/assets/assets"
import { toast } from "react-toastify"
import axios from "axios"
import RelatedDoctors from "../components/RelatedDoctors"
import { Calendar, Clock, MapPin, Star, Shield, Award, Users, CheckCircle, ArrowRight, Phone, MessageSquare, CreditCard, Info, ChevronRight, Stethoscope, Clipboard, Heart, AlertTriangle, User } from 'lucide-react'

const Appointment = memo(() => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [showBookingConfirm, setShowBookingConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState("about")

  // Fetch doctor information
  const fetchDocInfo = useCallback(() => {
    const docInfo = doctors.find((doc) => doc._id === docId)
    setDocInfo(docInfo)
    setIsLoading(false)
  }, [doctors, docId])

  // Generate available time slots
  const getAvailableSlots = useCallback(() => {
    if (!docInfo) return

    setDocSlots([])
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      let endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (i === 0) {
        currentDate.setHours(today.getHours() > 10 ? today.getHours() + 1 : 10)
        currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10, 0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
        const slotDate = `${day}_${month}_${year}`

        const isSlotAvailable = !(
          docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime)
        )

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      if (timeSlots.length > 0) {
        setDocSlots((prev) => [...prev, timeSlots])
      }
    }
  }, [docInfo])

  // Book appointment handler
  const bookAppointment = useCallback(async () => {
    if (!token) {
      toast.warn("Login to book an appointment")
      return navigate("/login")
    }

    if (!slotTime) {
      toast.error("Please select a time slot")
      return
    }

    // Track user interaction
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "book_appointment", {
        event_category: "engagement",
        event_label: `doctor_${docId}`,
      })
    }

    setIsBooking(true)

    try {
      const date = docSlots[slotIndex][0].dateTime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { utoken: token } },
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        setShowBookingConfirm(true)
        setTimeout(() => {
          navigate("/my-appointments")
        }, 2000)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || "Failed to book appointment")
    } finally {
      setIsBooking(false)
    }
  }, [docId, docSlots, getDoctorsData, navigate, slotIndex, slotTime, token, backendUrl])

  // Initialize data on component mount
  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo()
    }
  }, [doctors, docId, fetchDocInfo])

  // Generate slots when doctor info changes
  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo, getAvailableSlots])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex space-x-6">
                    <div className="w-48 h-48 bg-gray-200 rounded-2xl" />
                    <div className="flex-1 space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Doctor not found state
  if (!docInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/doctors")}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Browse All Doctors
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            name: `Dr. ${docInfo.name}`,
            image: docInfo.image,
            medicalSpecialty: docInfo.speciality,
            description: docInfo.about,
            availableService: {
              "@type": "MedicalProcedure",
              name: "Medical Consultation",
              description: `Consultation with Dr. ${docInfo.name}, ${docInfo.speciality}`,
            },
            priceRange: `${currencySymbol}${docInfo.fees}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: docInfo.address?.line1,
              addressLocality: docInfo.address?.city || "City",
              addressRegion: docInfo.address?.state || "State",
              addressCountry: "US",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Booking Confirmation Modal */}
        {showBookingConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                Your appointment with Dr. {docInfo.name} has been successfully booked.
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Redirecting to your appointments...</p>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Doctor Info Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Doctor Image */}
                    <div className="relative">
                      <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                        <img
                          className="w-full h-full object-cover"
                          src={docInfo.image || "/placeholder.svg?height=192&width=192&query=doctor portrait"}
                          alt={`Dr. ${docInfo.name}`}
                          loading="eager"
                          width="192"
                          height="192"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse" />
                        <span>Available</span>
                      </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h1 className="text-3xl font-bold text-gray-900">Dr. {docInfo.name}</h1>
                          <div className="flex items-center space-x-1">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <span className="text-sm text-blue-600 font-medium">Verified</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {docInfo.speciality}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {docInfo.degree}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>{docInfo.experience}</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-6 mb-6">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">4.9 (120+ reviews)</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>500+ patients treated</span>
                          </div>
                        </div>
                      </div>

                      {/* Doctor Bio */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                          <Info className="w-5 h-5 text-primary" />
                          <span>About Dr. {docInfo.name}</span>
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{docInfo.about}</p>
                      </div>

                      {/* Fee Information */}
                      <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-4 border border-primary/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Consultation Fee</p>
                              <p className="text-2xl font-bold text-gray-900">
                                {currencySymbol}
                                {docInfo.fees}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Per session</p>
                            <p className="text-sm text-green-600 font-medium">Insurance accepted</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex space-x-3">
                        <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200">
                          <Phone className="w-4 h-4" />
                          <span>Call Now</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center space-x-2 bg-green-50 text-green-600 px-4 py-3 rounded-lg font-medium hover:bg-green-100 transition-colors duration-200">
                          <MessageSquare className="w-4 h-4" />
                          <span>Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-t border-gray-200">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {[
                      { id: "about", label: "About", icon: <User className="w-4 h-4" /> },
                      { id: "services", label: "Services", icon: <Stethoscope className="w-4 h-4" /> },
                      { id: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" /> },
                      { id: "faq", label: "FAQ", icon: <Clipboard className="w-4 h-4" /> },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                          activeTab === tab.id
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {activeTab === "about" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Training</h3>
                        <ul className="space-y-4">
                          <li className="flex space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {docInfo.degree || "MD in Internal Medicine"}
                              </p>
                              <p className="text-sm text-gray-600">Harvard Medical School (2010-2014)</p>
                            </div>
                          </li>
                          <li className="flex space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Residency</p>
                              <p className="text-sm text-gray-600">Mayo Clinic (2014-2017)</p>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            "General Consultations",
                            "Preventive Care",
                            "Chronic Disease Management",
                            "Health Screenings",
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                        <div className="flex flex-wrap gap-3">
                          {["English", "Spanish", "French"].map((lang, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "services" && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          {
                            name: "General Consultation",
                            price: `${currencySymbol}${docInfo.fees}`,
                            duration: "30 min",
                            description: "Comprehensive health assessment and medical advice",
                          },
                          {
                            name: "Follow-up Visit",
                            price: `${currencySymbol}${Math.round(docInfo.fees * 0.7)}`,
                            duration: "20 min",
                            description: "Review progress and adjust treatment plans",
                          },
                          {
                            name: "Specialized Consultation",
                            price: `${currencySymbol}${Math.round(docInfo.fees * 1.5)}`,
                            duration: "45 min",
                            description: "In-depth consultation for specific health concerns",
                          },
                          {
                            name: "Telemedicine",
                            price: `${currencySymbol}${Math.round(docInfo.fees * 0.8)}`,
                            duration: "30 min",
                            description: "Virtual consultation from the comfort of your home",
                          },
                        ].map((service, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                              <span className="text-lg font-bold text-primary">{service.price}</span>
                            </div>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{service.duration}</span>
                              </div>
                              <button className="text-primary font-medium text-sm flex items-center space-x-1 hover:text-primary/80 transition-colors duration-200">
                                <span>Book Now</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="text-5xl font-bold text-gray-900">4.9</div>
                          <div>
                            <div className="flex items-center space-x-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">Based on 120+ reviews</p>
                          </div>
                        </div>
                        <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors duration-200">
                          Write a Review
                        </button>
                      </div>

                      <div className="space-y-6">
                        {[
                          {
                            name: "Sarah Johnson",
                            date: "2 weeks ago",
                            rating: 5,
                            comment:
                              "Dr. Smith is an exceptional doctor. Very thorough and takes time to listen to all concerns. Highly recommend!",
                          },
                          {
                            name: "Michael Chen",
                            date: "1 month ago",
                            rating: 5,
                            comment:
                              "Great experience with Dr. Smith. Very knowledgeable and explained everything clearly. The office staff was also very friendly.",
                          },
                          {
                            name: "Emily Davis",
                            date: "2 months ago",
                            rating: 4,
                            comment:
                              "Dr. Smith is very professional and caring. The only reason for 4 stars is the wait time was a bit long, but the care received was excellent.",
                          },
                        ].map((review, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300"
                          >
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {review.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{review.name}</p>
                                  <p className="text-xs text-gray-500">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                {[...Array(5 - review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-gray-300" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>

                      <div className="text-center">
                        <button className="text-primary font-medium flex items-center space-x-2 mx-auto hover:text-primary/80 transition-colors duration-200">
                          <span>View All Reviews</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "faq" && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {[
                          {
                            question: "What insurance plans do you accept?",
                            answer:
                              "We accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, and Medicare. Please contact our office to verify your specific plan coverage.",
                          },
                          {
                            question: "How long are typical appointments?",
                            answer:
                              "Initial consultations are typically 30 minutes, while follow-up appointments are usually 15-20 minutes. Specialized consultations may take up to 45 minutes depending on the complexity of the case.",
                          },
                          {
                            question: "Do you offer telemedicine appointments?",
                            answer:
                              "Yes, we offer secure video consultations for both new and existing patients. Telemedicine appointments can be booked directly through our online portal.",
                          },
                          {
                            question: "What is your cancellation policy?",
                            answer:
                              "We request that you notify us at least 24 hours in advance if you need to cancel or reschedule your appointment. Late cancellations or no-shows may incur a fee.",
                          },
                        ].map((faq, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                          >
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h4>
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Book Appointment</span>
                </h2>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Select Date</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {docSlots.map((daySlots, index) => {
                      const date = daySlots[0]?.dateTime
                      const isSelected = slotIndex === index
                      const isToday = index === 0

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSlotIndex(index)
                            setSlotTime("")
                          }}
                          className={`relative p-3 rounded-xl text-center transition-all duration-200 ${
                            isSelected
                              ? "bg-primary text-white shadow-lg scale-105"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105"
                          }`}
                          aria-label={`Select date ${date?.toLocaleDateString()}`}
                        >
                          {isToday && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
                          <div className="text-xs font-medium">{date && daysOfWeek[date.getDay()]}</div>
                          <div className="text-lg font-bold">{date && date.getDate()}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                {docSlots.length > 0 && docSlots[slotIndex] && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Available Times</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-hide">
                      {docSlots[slotIndex].map((slot, index) => {
                        const isSelected = slot.time === slotTime
                        return (
                          <button
                            key={index}
                            onClick={() => setSlotTime(slot.time)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? "bg-primary text-white shadow-md scale-105"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105"
                            }`}
                            aria-label={`Select time ${slot.time}`}
                          >
                            {slot.time}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Booking Summary */}
                {slotTime && (
                  <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-4 mb-6 border border-primary/10">
                    <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">Dr. {docInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {docSlots[slotIndex][0]?.dateTime.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{slotTime}</span>
                      </div>
                      <div className="flex justify-between border-t border-primary/20 pt-2 mt-2">
                        <span className="text-gray-600">Fee:</span>
                        <span className="font-bold text-lg">
                          {currencySymbol}
                          {docInfo.fees}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={bookAppointment}
                  disabled={!slotTime || isBooking}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-4 px-6 rounded-xl 
                           font-semibold hover:from-blue-600 hover:to-primary disabled:opacity-50 
                           disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 
                           disabled:transform-none flex items-center justify-center space-x-2"
                  aria-label="Book appointment"
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <span>Book Appointment</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Policy Note */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 text-center">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Your booking is protected by our cancellation policy
                  </p>
                </div>

                {/* Additional Info */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Free cancellation up to 24 hours before</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span>No-shows may incur a cancellation fee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Doctors Section */}
          <div className="mt-16">
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
          </div>
        </div>
      </div>
    </>
  )
})

Appointment.displayName = "Appointment"

export default Appointment
