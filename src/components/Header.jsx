"use client"

import { useState, useEffect, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Star, Users, Shield, Clock, CheckCircle, Play } from 'lucide-react'
import { assets } from '../assets/assets'

const Header = memo(() => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    { name: "Sarah Johnson", rating: 5, text: "Excellent service and professional doctors!" },
    { name: "Michael Chen", rating: 5, text: "Quick appointments and great care quality." },
    { name: "Emily Davis", rating: 5, text: "Highly recommend for online consultations." }
  ]

  const features = [
    { icon: Users, text: "500+ Expert Doctors", color: "bg-blue-500" },
    { icon: Shield, text: "100% Secure Platform", color: "bg-green-500" },
    { icon: Clock, text: "24/7 Support Available", color: "bg-purple-500" }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleBookAppointment = useCallback(() => {
    const element = document.getElementById('speciality')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    
    // Track user interaction
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'engagement',
        event_label: 'header_book_appointment'
      })
    }
  }, [])

  const handleWatchDemo = useCallback(() => {
    // Handle demo video or modal
    console.log('Watch demo clicked')
  }, [])

  const handleGetStarted = useCallback(() => {
    navigate('/login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [navigate])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "PrescripX - Book Appointments with Trusted Doctors",
            "description": "Book appointments with 500+ trusted doctors. 24/7 support, secure platform, and personalized healthcare.",
            "url": "https://prescripx.com",
            "mainEntity": {
              "@type": "MedicalBusiness",
              "name": "PrescripX",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "12000"
              }
            }
          })
        }}
      />

      <header className="flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-primary via-primary to-blue-600 
                       rounded-lg mx-4 md:mx-10 my-8 relative overflow-hidden min-h-[600px] md:min-h-[700px]">
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600 opacity-90" />
        <div className="absolute top-0 right-0 w-80 md:w-96 h-80 md:h-96 bg-white/5 rounded-full blur-3xl 
                      transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 md:w-80 h-64 md:h-80 bg-blue-400/10 rounded-full blur-2xl 
                      transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />

        {/* Content Section */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start justify-center gap-6 py-10 px-6 md:px-10 
                      m-auto md:py-[8vw] md:mb-[-30px] relative z-10">
          
          {/* Trust Badge */}
          <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 
                         text-white/90 text-sm font-medium mb-2 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <CheckCircle className="w-4 h-4 text-green-300" />
            <span>Trusted Healthcare Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-bold leading-tight 
                        text-center md:text-left mb-4 transform transition-all duration-700 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Book Appointment <br />
            With{' '}
            <span className="relative">
              <span className="relative z-10">Trusted Doctors</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-white/20 rounded-full" />
            </span>
          </h1>

          {/* Description */}
          <p className={`text-white/90 text-base md:text-lg max-w-2xl leading-relaxed text-center md:text-left mb-6 
                       transform transition-all duration-700 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free, 
            and receive personalized care from certified medical professionals.
          </p>

          {/* Social Proof */}
          <div className={`flex flex-col md:flex-row items-center md:items-start gap-6 text-white text-sm 
                         font-light mb-8 transform transition-all duration-700 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="relative">
              <img
                className="w-32 rounded-full ring-4 ring-white/20"
                src={assets.group_profiles || "/placeholder.svg?height=128&width=128&query=happy patients group"}
                alt="Happy patients testimonials"
                loading="eager"
                width="128"
                height="128"
              />
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center 
                            ring-4 ring-white/20">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-3 text-center md:text-left">
              {/* Star Rating */}
              <div className="flex items-center justify-center md:justify-start gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-base font-semibold">4.9/5</span>
                <span className="text-white/70">(12,000+ reviews)</span>
              </div>

              {/* Rotating Testimonial */}
              <div className="min-h-[3rem] flex items-center">
                <div className="transition-all duration-500">
                  <p className="text-white/90 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    - {testimonials[currentTestimonial].name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 w-full md:w-auto transform transition-all duration-700 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <button
              onClick={handleBookAppointment}
              className="group flex items-center justify-center gap-3 bg-white px-8 py-4 rounded-full 
                       text-gray-700 font-semibold text-base hover:bg-gray-50 hover:scale-105 
                       transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none 
                       focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Book appointment with trusted doctors"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleWatchDemo}
              className="group flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm 
                       border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-base 
                       hover:bg-white/20 hover:border-white/30 transition-all duration-300 
                       focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Feature Pills */}
          <div className={`flex flex-wrap justify-center md:justify-start gap-3 mt-6 transform transition-all duration-700 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm"
                >
                  <div className={`w-6 h-6 ${feature.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-3 h-3 text-white" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 relative flex items-center justify-center p-6 md:p-10">
          <div className={`relative transform transition-all duration-700 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {/* Floating Info Cards */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-10 
                          animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">500+ Doctors</p>
                  <p className="text-xs text-gray-600">Available Now</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 md:bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-10 
                          animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">24/7 Support</p>
                  <p className="text-xs text-gray-600">Always Here</p>
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl 
                            transition-all duration-300" />
              <img
                className="relative w-full max-w-md mx-auto hover:scale-105 transition-transform duration-700 
                         shadow-2xl rounded-2xl"
                src={assets.header_img || "/placeholder.svg?height=500&width=400&query=professional healthcare team"}
                alt="Professional healthcare team ready to serve you"
                loading="eager"
                width="400"
                height="500"
              />
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </header>
    </>
  )
})

Header.displayName = 'Header'

export default Header
