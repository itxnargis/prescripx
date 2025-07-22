import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"
import { Camera, Save, Edit3, Mail, Phone, MapPin, Calendar, User, Shield } from "lucide-react"

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const updateUserProfileData = async () => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("name", userData.name)
      formData.append("phone", userData.phone)
      formData.append("address", JSON.stringify(userData.address))
      formData.append("gender", userData.gender)
      formData.append("dob", userData.dob)
      if (image) formData.append("image", image)

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { utoken: token },
      })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-32 h-32 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
            </div>
            {!isEdit && (
              <button
                onClick={() => setIsEdit(true)}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors duration-200"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-8 mb-8">
            <div className="relative">
              {isEdit ? (
                <label htmlFor="image" className="cursor-pointer group">
                  <div className="relative">
                    <img
                      className="w-32 h-32 rounded-2xl object-cover shadow-lg group-hover:opacity-75 transition-opacity duration-200"
                      src={image ? URL.createObjectURL(image) : userData.image}
                      alt="Profile"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden accept="image/*" />
                </label>
              ) : (
                <img
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                  src={userData.image || "/placeholder.svg"}
                  alt="Profile"
                />
              )}
            </div>

            <div className="flex-1 space-y-4">
              {isEdit ? (
                <input
                  className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
              )}

              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{userData.email}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>Contact Information</span>
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">Phone:</label>
                    {isEdit ? (
                      <input
                        className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        type="text"
                        value={userData.phone}
                        onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <div className="col-span-2 flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{userData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-start">
                    <label className="text-sm font-medium text-gray-700 pt-2">Address:</label>
                    {isEdit ? (
                      <div className="col-span-2 space-y-2">
                        <input
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          type="text"
                          placeholder="Address Line 1"
                          onChange={(e) =>
                            setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))
                          }
                          value={userData.address.line1}
                        />
                        <input
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          type="text"
                          placeholder="Address Line 2"
                          onChange={(e) =>
                            setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))
                          }
                          value={userData.address.line2}
                        />
                      </div>
                    ) : (
                      <div className="col-span-2 flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div className="text-gray-900">
                          <div>{userData.address.line1}</div>
                          {userData.address.line2 && <div>{userData.address.line2}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Personal Information</span>
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">Gender:</label>
                    {isEdit ? (
                      <select
                        className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                        value={userData.gender}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span className="col-span-2 text-gray-900">{userData.gender || "Not specified"}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">Birthday:</label>
                    {isEdit ? (
                      <input
                        className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        type="date"
                        onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                        value={userData.dob}
                      />
                    ) : (
                      <div className="col-span-2 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{userData.dob || "Not specified"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isEdit && (
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <button
                  onClick={() => {
                    setIsEdit(false)
                    setImage(null)
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={updateUserProfileData}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProfile
