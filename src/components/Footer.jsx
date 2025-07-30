"use client"

import { memo, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Github, Twitter, Linkedin, User, MapPin, Mail, Phone, ExternalLink, Heart, Shield, Award } from 'lucide-react'
import { assets } from '../../public/assets/assets'

const Footer = memo(() => {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { to: '/', label: 'Home', description: 'Return to homepage' },
    { to: '/doctors', label: 'All Doctors', description: 'Browse our medical professionals' },
    { to: '/about', label: 'About Us', description: 'Learn about our mission' },
    { to: '/contact', label: 'Contact Us', description: 'Get in touch with us' }
  ]

  const legalLinks = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/disclaimer', label: 'Medical Disclaimer' }
  ]

  const socialLinks = [
    {
      href: "https://github.com/itxnargis",
      icon: Github,
      label: "Connect on Github",
      color: "hover:text-gray-900 hover:bg-gray-100"
    },
    {
      href: "https://x.com/81283nargis?s=09",
      icon: Twitter,
      label: "Follow on Twitter",
      color: "hover:text-blue-500 hover:bg-blue-50"
    },
    {
      href: "https://www.linkedin.com/in/nargis-khatun-4008ab2a9/",
      icon: Linkedin,
      label: "Connect on LinkedIn",
      color: "hover:text-blue-600 hover:bg-blue-50"
    }
  ]

  const trustIndicators = [
    { icon: Shield, text: "HIPAA Compliant", color: "text-green-600" },
    { icon: Award, text: "ISO 27001 Certified", color: "text-blue-600" },
    { icon: Heart, text: "Patient First", color: "text-red-500" }
  ]

  const handleNavigation = useCallback((path) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [navigate])

  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') 
    
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    // Add your newsletter subscription logic here
  }, [])

  return (
    <>
      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PrescripX",
            "url": "https://prescripx.com",
            "logo": "https://prescripx.com/logo.png",
            "description": "Leading healthcare platform connecting patients with trusted medical professionals",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-212-456-7890",
              "contactType": "customer service",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://github.com/itxnargis",
              "https://x.com/81283nargis?s=09",
              "https://www.linkedin.com/in/nargis-khatun-4008ab2a9/"
            ]
          })
        }}
      />

      <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 border-t border-gray-200/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter Section */}
          <div className="py-12 border-b border-gray-200/50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Stay Updated with Health Tips & News
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Get the latest healthcare insights, wellness tips, and updates about our services 
                delivered straight to your inbox.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 
                           transition-colors duration-200 font-medium focus:outline-none focus:ring-2 
                           focus:ring-primary/20 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 py-16">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-start space-x-3">
                <img
                  className="h-12 object-contain hover:scale-105 transition-transform duration-200"
                  src={assets.prescripx_logo || "/placeholder.svg?height=48&width=120&query=PrescripX healthcare logo"}
                  alt="PrescripX - Healthcare Platform"
                  loading="lazy"
                  width="120"
                  height="48"
                />
              </div>
              
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                PrescripX is committed to excellence in healthcare technology. We continuously strive 
                to enhance our platform, integrating the latest advancements to improve user experience 
                and deliver superior service.
              </p>

              {/* Trust Indicators */}
              <div className="space-y-3">
                {trustIndicators.map((indicator, index) => {
                  const IconComponent = indicator.icon
                  return (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                      <span className="text-gray-600">{indicator.text}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Available 24/7</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="text-sm text-gray-500">Trusted by 10,000+ patients</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 relative">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
              </h3>
              <nav className="space-y-3">
                {navigationLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => handleNavigation(link.to)}
                    className="group flex items-center text-gray-600 hover:text-primary transition-all duration-200"
                    title={link.description}
                  >
                    <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 relative">
                Get In Touch
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center 
                                group-hover:bg-primary/20 transition-colors duration-200">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <a
                    href="tel:+91-212-456-7890"
                    className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm"
                    aria-label="Call us"
                  >
                    +91-212-456-7890
                  </a>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center 
                                group-hover:bg-primary/20 transition-colors duration-200">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <a
                    href="mailto:itxnargiskhatun@gmail.com"
                    className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm"
                    aria-label="Send email"
                  >
                    itxnargiskhatun@gmail.com
                  </a>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center 
                                group-hover:bg-primary/20 transition-colors duration-200">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <a
                    href="https://nargis-khatun.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm"
                    aria-label="View portfolio"
                  >
                    View Portfolio
                  </a>
                </div>

                {/* Social Links */}
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Follow Us</p>
                  <div className="flex items-center space-x-3">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon
                      return (
                        <a
                          key={social.href}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center 
                                   text-gray-600 transition-all duration-200 hover:scale-110 ${social.color}`}
                          aria-label={social.label}
                        >
                          <IconComponent className="w-4 h-4" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200/50 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-sm text-gray-500 text-center md:text-left">
                © {currentYear} PrescripX. All rights reserved. Made with ❤️ for better healthcare.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
                {legalLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => handleNavigation(link.to)}
                    className="hover:text-gray-600 transition-colors duration-200"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
})

Footer.displayName = 'Footer'

export default Footer
