"use client"


import { useContext, useEffect, useState, useCallback, memo } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowRight, AlertTriangle } from "lucide-react"

const Login = memo(() => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [authMode, setAuthMode] = useState<"signup" | "login">("signup")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null)

  // Validate form fields
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

  // Check password strength
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

  // Handle form submission
  const onSubmitHandler = useCallback(
    async (event) => {
      event.preventDefault()

      if (!validateForm()) return

      // Track user interaction
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

  // Handle input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear error when user types
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }

      // Check password strength
      if (name === "password") {
        checkPasswordStrength(value)
      }
    },
    [errors, checkPasswordStrength],
  )

  // Toggle auth mode
  const toggleAuthMode = useCallback(() => {
    setAuthMode((prev) => (prev === "signup" ? "login" : "signup"))
    setErrors({})
    setPasswordStrength(null)
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [token, navigate])

  return (
    <>
      {/* Structured Data for SEO */}
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
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        </div>

        <div className="relative max-w-md w-full space-y-8">
          {/* Header */}
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

          {/* Auth Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
          >
            {/* Name Field (Sign Up only) */}
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
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                      errors.name ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
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

            {/* Email Field */}
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
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
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

            {/* Password Field */}
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
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
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

              {/* Password Strength Indicator (Sign Up only) */}
              {authMode === "signup" && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          passwordStrength === "weak"
                            ? "bg-red-500 w-1/3"
                            : passwordStrength === "medium"
                              ? "bg-yellow-500 w-2/3"
                              : "bg-green-500 w-full"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength === "weak"
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

              {/* Forgot Password Link (Login only) */}
              {authMode === "login" && (
                <div className="text-right">
                  <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            {/* Submit Button */}
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

            {/* Social Login Options */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg 
                         hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg 
                         hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                Facebook
              </button>
            </div>

            {/* Toggle Auth Mode */}
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

          {/* Privacy Notice */}
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
