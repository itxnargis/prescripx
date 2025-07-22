import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, CreditCard, X, CheckCircle, AlertCircle, Phone, MessageSquare } from 'lucide-react'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [payingId, setPayingId] = useState(null)

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: { utoken: token }
      })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId)
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { utoken: token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setCancellingId(null)
    }
  }

  const initPay = (order) => {
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
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay',
            response,
            { headers: { utoken: token } }
          )
          if (data.success) {
            getUserAppointments()
            toast.success('Payment successful!')
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      setPayingId(appointmentId)
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-razorpay',
        { appointmentId },
        { headers: { utoken: token } }
      )
      if (data.success) {
        initPay(data.order)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setPayingId(null)
    }
  }

  const getStatusConfig = (appointment) => {
    if (appointment.cancelled) {
      return {
        status: 'Cancelled',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: X
      }
    }
    if (appointment.isCompleted) {
      return {
        status: 'Completed',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle
      }
    }
    if (appointment.payment) {
      return {
        status: 'Confirmed',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: CheckCircle
      }
    }
    return {
      status: 'Pending Payment',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: AlertCircle
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-64"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your upcoming and past appointments</p>
      </div>

      <div className="space-y-6">
        {appointments.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-6">You haven't booked any appointments yet.</p>
            <button
              onClick={() => navigate('/doctors')}
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              <span>Book Appointment</span>
            </button>
          </div>
        ) : (
          appointments.map((appointment, index) => {
            const statusConfig = getStatusConfig(appointment)
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${statusConfig.borderColor}`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="flex-shrink-0">
                      <img
                        className="w-24 h-24 rounded-xl object-cover bg-gradient-to-br from-blue-50 to-indigo-50"
                        src={appointment.docData.image || "/placeholder.svg"}
                        alt={`Dr. ${appointment.docData.name}`}
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Dr. {appointment.docData.name}
                        </h3>
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
                          <div className={`px-4 py-2 rounded-lg text-center font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            Paid
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">Call</span>
                            </button>
                            <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
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
                            className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {payingId === appointment._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
                            className="flex items-center justify-center space-x-2 border border-red-300 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {cancellingId === appointment._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
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
                        <div className={`px-4 py-2 rounded-lg text-center font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          Appointment Cancelled
                        </div>
                      )}

                      {appointment.isCompleted && (
                        <div className={`px-4 py-2 rounded-lg text-center font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
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
    </div>
  )
}

export default MyAppointments
