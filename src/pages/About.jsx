import { useState, useEffect, memo } from "react"
import { assets } from "../../public/assets/assets"
import { Zap, Users, Shield, Award, Heart } from 'lucide-react'

const About = memo(() => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((element) => observer.observe(element))

    return () => {
      elements.forEach((element) => observer.disconnect())
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Efficiency",
      description:
        "Streamlined appointment scheduling that fits into your busy lifestyle with real-time availability and instant confirmations.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Convenience",
      description:
        "Access to a comprehensive network of trusted healthcare professionals in your area, available 24/7 through our platform.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personalization",
      description:
        "AI-powered tailored recommendations and smart reminders to help you stay proactive about your health and wellness.",
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Patients", icon: "👥" },
    { number: "500+", label: "Certified Doctors", icon: "👨‍⚕️" },
    { number: "99.9%", label: "Platform Uptime", icon: "⚡" },
    { number: "24/7", label: "Support Available", icon: "🕐" },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "PrescripX",
            url: "https://prescripx.com/about",
            logo: "https://prescripx.com/logo.png",
            description:
              "PrescripX is a healthcare platform connecting patients with trusted doctors for seamless appointment booking and healthcare management.",
            foundingDate: "2023",
            founders: [
              {
                "@type": "Person",
                name: "PrescripX Team",
              },
            ],
            numberOfEmployees: {
              "@type": "QuantitativeValue",
              value: "50+",
            },
            sameAs: [
              "https://facebook.com/prescripx",
              "https://twitter.com/prescripx",
              "https://linkedin.com/company/prescripx",
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                Revolutionizing Healthcare Access
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                About{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  PrescripX
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your trusted partner in managing healthcare needs with cutting-edge technology, seamless user experience,
                and unwavering commitment to your well-being.
              </p>
            </div>
          </div>
        </section>

        <section className="animate-on-scroll py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-6 scale-105 opacity-30" />
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <img
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    src={assets.about_image || "/placeholder.svg?height=500&width=600&query=modern healthcare technology"}
                    alt="Modern healthcare technology and patient care at PrescripX"
                    loading="lazy"
                    width="600"
                    height="500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    Transforming Healthcare
                    <span className="block text-primary">One Connection at a Time</span>
                  </h2>
                  <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p className="text-lg">
                      Welcome to <strong className="text-primary">PrescripX</strong>, where innovation meets compassion
                      in healthcare delivery. We understand the complexities individuals face when scheduling doctor
                      appointments and managing health records in today's fast-paced world.
                    </p>
                    <p className="text-lg">
                      Our platform leverages advanced technology and user-centric design to eliminate healthcare
                      barriers, ensuring you receive the care you deserve when you need it most. From AI-powered matching
                      to seamless booking experiences, we're revolutionizing how you interact with healthcare providers.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-8 border border-primary/10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-primary rounded-full mr-3" />
                      Our Vision
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      To create a seamless, intelligent healthcare ecosystem that bridges the gap between patients and
                      providers. We envision a future where accessing quality healthcare is as simple as a few taps,
                      powered by cutting-edge technology and driven by human empathy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-primary">PrescripX</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience healthcare like never before with our innovative features designed for the modern patient
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 
                           hover:-translate-y-2 border border-gray-100 hover:border-primary/20 ${activeFeature === index ? "ring-2 ring-primary/30" : ""
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary mb-6 
                               group-hover:bg-primary group-hover:text-white transition-all duration-300 ${activeFeature === index ? "animate-pulse" : ""
                        }`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Heart className="w-4 h-4 mr-2" />
                Our Values
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Principles That <span className="text-primary">Guide Us</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our core values shape everything we do, from product development to customer service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Patient-Centered Care",
                  description:
                    "We put patients at the center of everything we do, ensuring their needs and preferences guide our decisions.",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Trust & Security",
                  description:
                    "We maintain the highest standards of data security and privacy, earning the trust of our users every day.",
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Excellence",
                  description:
                    "We strive for excellence in all aspects of our service, continuously improving to deliver the best experience.",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  )
})

About.displayName = "About"

export default About
