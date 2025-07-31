import { useContext, useEffect, useState, useCallback, memo } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  X,
  CheckCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Stethoscope,
} from "lucide-react"

const MyAppointments = memo(() => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [payingId, setPayingId] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = useCallback(
    (slotDate) => {
      const dateArray = slotDate.split("_")
      return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`
    },
    [months],
  )

  const getUserAppointments = useCallback(async () => {
    try {
      setIsLoading(true)

      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { utoken: token },
      })

      if (data.success) {
        const sortedAppointments = data.appointments.sort((a, b) => {
          const dateA = a.slotDate.split("_").map(Number)
          const dateB = b.slotDate.split("_").map(Number)

          if (dateA[2] !== dateB[2]) return dateB[2] - dateA[2]
          if (dateA[1] !== dateB[1]) return dateB[1] - dateA[1]
          if (dateA[0] !== dateB[0]) return dateB[0] - dateA[0]

          return a.slotTime.localeCompare(b.slotTime)
        })

        setAppointments(sortedAppointments)
        applyFilter(sortedAppointments, activeFilter)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Failed to fetch appointments")
    } finally {
      setIsLoading(false)
    }
  }, [backendUrl, token, activeFilter])

  const applyFilter = useCallback((appointments, filter) => {
    switch (filter) {
      case "upcoming":
        setFilteredAppointments(appointments.filter((app) => !app.cancelled && !app.isCompleted))
        break
      case "completed":
        setFilteredAppointments(appointments.filter((app) => app.isCompleted))
        break
      case "cancelled":
        setFilteredAppointments(appointments.filter((app) => app.cancelled))
        break
      default:
        setFilteredAppointments(appointments)
    }
  }, [])

  const handleFilterChange = useCallback(
    (filter) => {
      setActiveFilter(filter)
      applyFilter(appointments, filter)
      setShowFilterMenu(false)
    },
    [appointments, applyFilter],
  )

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      try {
        setCancellingId(appointmentId)

        const { data } = await axios.post(
          `${backendUrl}/api/user/cancel-appointment`,
          { appointmentId },
          { headers: { utoken: token } },
        )

        if (data.success) {
          toast.success(data.message)
          getUserAppointments()
          getDoctorsData()

          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "cancel_appointment", {
              event_category: "appointment",
              event_labelId,
            })
          }
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error(error)
        toast.error(error.message || "Failed to cancel appointment")
      } finally {
        setCancellingId(null)
      }
    },
    [backendUrl, token, getUserAppointments, getDoctorsData],
  )

  const initPay = useCallback(
    (order) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Appointment Payment",
        description: "Appointment Payment",
        order_id: order.id,
        receipt: order.receipt,
        handler: async (response) => {
          try {
            const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, response, {
              headers: { utoken: token },
            })

            if (data.success) {
              getUserAppointments()
              toast.success("Payment successful!")

              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "payment_complete", {
                  event_category: "appointment",
                  event_label: order.receipt,
                  value: order.amount / 100,
                })
              }
            }
          } catch (error) {
            toast.error(error.message || "Payment verification failed")
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    },
    [backendUrl, token, getUserAppointments],
  )

  const appointmentRazorpay = useCallback(
    async (appointmentId) => {
      try {
        setPayingId(appointmentId)

        const { data } = await axios.post(
          `${backendUrl}/api/user/payment-razorpay`,
          { appointmentId },
          { headers: { utoken: token } },
        )

        if (data.success) {
          initPay(data.order)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error(error)
        toast.error(error.message || "Payment initialization failed")
      } finally {
        setPayingId(null)
      }
    },
    [backendUrl, token, initPay],
  )

  const getStatusConfig = useCallback((appointment) => {
    if (appointment.cancelled) {
      return {
        status: "Cancelled",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: X,
      }
    }

    if (appointment.isCompleted) {
      return {
        status: "Completed",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: CheckCircle,
      }
    }

    if (appointment.payment) {
      return {
        status: "Confirmed",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: CheckCircle,
      }
    }

    return {
      status: "Pending Payment",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      icon: AlertTriangle,
    }
  }, [])

  const isUpcoming = useCallback((appointment) => {
    if (appointment.cancelled || appointment.isCompleted) return false

    const [day, month, year] = appointment.slotDate.split("_").map(Number)
    const [hours, minutes] = appointment.slotTime.split(":").map(Number)

    const appointmentDate = new Date(year, month - 1, day, hours, minutes)
    const now = new Date()

    return appointmentDate > now
  }, [])

  useEffect(() => {
    if (token) {
      getUserAppointments()
    } else {
      navigate("/login")
    }
  }, [token, getUserAppointments, navigate])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-64" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "My Appointments - PrescripX",
            description: "Manage your upcoming and past medical appointments with PrescripX",
          }),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-16">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600">Manage your upcoming and past appointments</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 
                       text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>
                {activeFilter === "all"
                  ? "All Appointments"
                  : activeFilter === "upcoming"
                    ? "Upcoming"
                    : activeFilter === "completed"
                      ? "Completed"
                      : "Cancelled"}
              </span>
              {showFilterMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                <div className="py-1">
                  {[
                    { id: "all", label: "All Appointments" },
                    { id: "upcoming", label: "Upcoming" },
                    { id: "completed", label: "Completed" },
                    { id: "cancelled", label: "Cancelled" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => handleFilterChange(filter.id)}
                      className={`block w-full text-left px-4 py-2 text-sm ${activeFilter === filter.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500 mb-6">
                {activeFilter === "all"
                  ? "You haven't booked any appointments yet."
                  : activeFilter === "upcoming"
                    ? "You don't have any upcoming appointments."
                    : activeFilter === "completed"
                      ? "You don't have any completed appointments."
                      : "You don't have any cancelled appointments."}
              </p>
              <button
                onClick={() => navigate("/doctors")}
                className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg 
                         font-medium hover:bg-primary/90 transition-colors duration-200"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            filteredAppointments.map((appointment, index) => {
              const statusConfig = getStatusConfig(appointment)
              const StatusIcon = statusConfig.icon
              const isUpcomingAppointment = isUpcoming(appointment)

              return (
                <div
                  key={appointment._id}
                  className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${statusConfig.borderColor
                    } ${isUpcomingAppointment ? "border-l-4 border-l-primary" : ""}`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="flex-shrink-0">
                        <img
                          className="w-24 h-24 rounded-xl object-cover bg-gradient-to-br from-blue-50 to-indigo-50"
                          src={appointment.docData.image || "/placeholder.svg?height=96&width=96&query=doctor portrait"}
                          alt={`Dr. ${appointment.docData.name}`}
                          loading="lazy"
                          width="96"
                          height="96"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Dr. {appointment.docData.name}</h3>
                          <p className="text-primary font-medium">{appointment.docData.speciality}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{slotDateFormat(appointment.slotDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.slotTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.docData.address.line1}</span>
                          </div>
                          <div className={`flex items-center space-x-2 ${statusConfig.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium">{statusConfig.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 lg:min-w-[200px]">
                        {!appointment.cancelled && appointment.payment && !appointment.isCompleted && (
                          <>
                            <div
                              className={`px-4 py-2 rounded-lg text-center font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                            >
                              Paid
                            </div>
                            <div className="flex space-x-2">
                              <button
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border 
                                         border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 
                                         transition-colors duration-200"
                              >
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">Call</span>
                              </button>
                              <button
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border 
                                         border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 
                                         transition-colors duration-200"
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm">Chat</span>
                              </button>
                            </div>
                          </>
                        )}

                        {!appointment.cancelled && !appointment.payment && !appointment.isCompleted && (
                          <>
                            <button
                              onClick={() => appointmentRazorpay(appointment._id)}
                              disabled={payingId === appointment._id}
                              className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 
                                       rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 
                                       disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              {payingId === appointment._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-4 h-4" />
                                  <span>Pay Online</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => cancelAppointment(appointment._id)}
                              disabled={cancellingId === appointment._id}
                              className="flex items-center justify-center space-x-2 border border-red-300 text-red-600 
                                       px-4 py-2 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 
                                       disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              {cancellingId === appointment._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                                  <span>Cancelling...</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4" />
                                  <span>Cancel</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {appointment.cancelled && !appointment.isCompleted && (
                          <div
                            className={`px-4 py-2 rounded-lg text-center font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            Appointment Cancelled
                          </div>
                        )}

                        {appointment.isCompleted && (
                          <div
                            className={`px-4 py-2 rounded-lg text-center font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {filteredAppointments.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/doctors")}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-blue-600 
                       text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-primary 
                       transition-all duration-300 transform hover:scale-105"
            >
              <Stethoscope className="w-5 h-5" />
              <span>Book New Appointment</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
})

MyAppointments.displayName = "MyAppointments"

export default MyAppointments
