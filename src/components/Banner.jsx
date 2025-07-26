import { useState, useEffect, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Star, Shield, Clock, Users, CheckCircle } from 'lucide-react'
import { assets } from '../assets/assets'

const Banner = memo(() => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [currentStat, setCurrentStat] = useState(0)

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Patients", color: "text-blue-500" },
    { icon: Star, value: "4.9/5", label: "Rating", color: "text-yellow-500" },
    { icon: Shield, value: "100%", label: "Secure", color: "text-green-500" },
    { icon: Clock, value: "24/7", label: "Available", color: "text-purple-500" }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    const bannerElement = document.getElementById('hero-banner')
    if (bannerElement) {
      observer.observe(bannerElement)
    }

    return () => observer.disconnect()
  }, [])

  // Rotate stats every 3 seconds
  useEffect(() => {
    if (!isVisible) return
    
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isVisible, stats.length])

  const handleCreateAccount = useCallback(() => {
    // Track user interaction
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'engagement',
        event_label: 'hero_cta_click'
      })
    }
    
    navigate('/login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [navigate])

  const handleLearnMore = useCallback(() => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "PrescripX",
            "description": "Book appointments with 100+ trusted doctors. Quick, secure, and personalized healthcare consultations.",
            "url": "https://prescripx.com",
            "telephone": "+91-212-456-7890",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "$$",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "12000"
            }
          })
        }}
      />

      <section
        id="hero-banner"
        className="relative my-8 md:my-20 mx-4 md:mx-10 overflow-hidden"
        role="banner"
        aria-labelledby="banner-heading"
      >
        {/* Background with improved performance */}
        <div className="relative bg-gradient-to-r from-primary via-primary/95 to-primary/90 rounded-2xl 
                      shadow-2xl backdrop-blur-sm border border-white/10 min-h-[500px] md:min-h-[600px]">
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full 
                          blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full 
                          blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full 
                          blur-xl animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center px-4 sm:px-6 md:px-10 lg:px-12">
            {/* Content Section */}
            <div className="flex-1 py-8 md:py-16 lg:py-24 text-center lg:text-left">
              <div className={`transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full 
                              px-4 py-2 text-white/90 text-sm font-medium mb-6">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>Trusted by 10,000+ Patients</span>
                </div>

                <h1
                  id="banner-heading"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold 
                           text-white leading-tight mb-6"
                >
                  <span className="block mb-2 transform hover:scale-105 transition-transform duration-300">
                    Book Appointment
                  </span>
                  <span className="block text-white/90 font-semibold">
                    With 100+ Trusted Doctors
                  </span>
                </h1>

                <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed mb-8 mx-auto lg:mx-0">
                  Experience world-class healthcare with our network of certified medical professionals.
                  Quick booking, secure consultations, and personalized care tailored to your needs.
                </p>

                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 
                               transform transition-all duration-1000 delay-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <button
                    onClick={handleCreateAccount}
                    className="group relative bg-white text-primary px-8 py-4 rounded-full font-semibold 
                             text-base hover:bg-gray-50 hover:shadow-xl transform hover:scale-105 
                             transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 
                             focus:ring-offset-2 focus:ring-offset-primary active:scale-95"
                    aria-label="Create account to book appointments"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  </button>

                  <button
                    onClick={handleLearnMore}
                    className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 
                             px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 
                             hover:border-white/30 transition-all duration-300 focus:outline-none 
                             focus:ring-4 focus:ring-white/30"
                  >
                    Learn More
                  </button>
                </div>

                {/* Animated Stats */}
                <div className={`flex flex-wrap justify-center lg:justify-start gap-6 text-white/70 
                               transform transition-all duration-1000 delay-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon
                    const isActive = index === currentStat
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 transition-all duration-500 ${
                          isActive ? 'scale-110 text-white' : 'scale-100'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${isActive ? stat.color : 'text-white/60'}`} />
                        <div className="text-sm">
                          <span className="font-bold">{stat.value}</span>
                          <span className="ml-1">{stat.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative mt-8 lg:mt-0 lg:w-1/2 xl:w-[400px]">
              <div className={`transform transition-all duration-1000 delay-200 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl 
                                transition-all duration-300" />
                  
                  <img
                    className="relative w-full h-auto max-w-sm mx-auto lg:max-w-full transform 
                             group-hover:scale-105 transition-transform duration-500 filter drop-shadow-2xl"
                    src={assets.appointment_img || "/placeholder.svg?height=400&width=350&query=professional doctor consultation"}
                    alt="Professional doctor ready to provide healthcare consultation and medical appointments"
                    loading="eager"
                    width="350"
                    height="400"
                  />

                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 
                                animate-float">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3 
                                animate-float" style={{ animationDelay: '1s' }}>
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
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
      </section>
    </>
  )
})

Banner.displayName = 'Banner'

export default Banner
