import { useContext, useEffect, useState, useCallback, memo } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowRight, AlertTriangle } from "lucide-react"

const Login = memo(() => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [authMode, setAuthMode] = useState("signup")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(null)

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (authMode === "signup" && !formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [authMode, formData])

  const checkPasswordStrength = useCallback((password) => {
    if (!password) {
      setPasswordStrength(null)
      return
    }

    const hasLowerCase = /[a-z]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const strength = (hasLowerCase ? 1 : 0) + (hasUpperCase ? 1 : 0) + (hasNumbers ? 1 : 0) + (hasSpecialChars ? 1 : 0)

    if (password.length < 6) {
      setPasswordStrength("weak")
    } else if (strength <= 2) {
      setPasswordStrength("weak")
    } else if (strength === 3) {
      setPasswordStrength("medium")
    } else {
      setPasswordStrength("strong")
    }
  }, [])

  const onSubmitHandler = useCallback(
    async (event) => {
      event.preventDefault()

      if (!validateForm()) return

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", authMode === "signup" ? "sign_up" : "login", {
          event_category: "authentication",
        })
      }

      setIsLoading(true)

      try {
        if (authMode === "signup") {
          const { data } = await axios.post(`${backendUrl}/api/user/register`, {
            name: formData.name,
            password: formData.password,
            email: formData.email,
          })

          if (data.success) {
            localStorage.setItem("utoken", data.token)
            setToken(data.token)
            toast.success("Account created successfully!")
          } else {
            toast.error(data.message)
          }
        } else {
          const { data } = await axios.post(`${backendUrl}/api/user/login`, {
            password: formData.password,
            email: formData.email,
          })

          if (data.success) {
            localStorage.setItem("utoken", data.token)
            setToken(data.token)
            navigate("/")
            toast.success("Welcome back!")
          } else {
            toast.error(data.message)
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    },
    [authMode, backendUrl, formData, navigate, setToken, validateForm],
  )

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }

      if (name === "password") {
        checkPasswordStrength(value)
      }
    },
    [errors, checkPasswordStrength],
  )

  const toggleAuthMode = useCallback(() => {
    setAuthMode((prev) => (prev === "signup" ? "login" : "signup"))
    setErrors({})
    setPasswordStrength(null)
  }, [])

  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [token, navigate])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: authMode === "signup" ? "Create Account - PrescripX" : "Sign In - PrescripX",
            description:
              authMode === "signup"
                ? "Create your PrescripX account to book appointments with trusted doctors"
                : "Sign in to your PrescripX account to manage your appointments and healthcare",
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        </div>

        <div className="relative max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {authMode === "signup" ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="mt-2 text-gray-600">
                {authMode === "signup"
                  ? "Join thousands of patients who trust our platform"
                  : "Sign in to book your next appointment"}
              </p>
            </div>
          </div>

          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
          >
            {authMode === "signup" && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    name="name"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    placeholder="Enter your full name"
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                  placeholder="Enter your email"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  name="password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                  placeholder="Enter your password"
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}

              {authMode === "signup" && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength === "weak"
                            ? "bg-red-500 w-1/3"
                            : passwordStrength === "medium"
                              ? "bg-yellow-500 w-2/3"
                              : "bg-green-500 w-full"
                          }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${passwordStrength === "weak"
                          ? "text-red-600"
                          : passwordStrength === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                    >
                      {passwordStrength === "weak" ? "Weak" : passwordStrength === "medium" ? "Medium" : "Strong"}
                    </span>
                  </div>
                </div>
              )}


            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center space-x-2 py-3 px-4 border 
                       border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r 
                       from-primary to-blue-600 hover:from-blue-600 hover:to-primary focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 
                       disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{authMode === "signup" ? "Create Account" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {authMode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="font-medium text-primary hover:text-blue-600 transition-colors duration-200"
                >
                  {authMode === "signup" ? "Sign in here" : "Create one now"}
                </button>
              </p>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
              . Your data is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </>
  )
})

Login.displayName = "Login"

export default Login
