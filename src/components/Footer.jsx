import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { Github, Twitter, Linkedin, User, MapPin, Mail, Phone, ExternalLink } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'All Doctors' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' }
  ]

  const socialLinks = [
    {
      href: "https://github.com/itxnargis",
      icon: Github,
      label: "Connect on Github",
      color: "hover:text-gray-900"
    },
    {
      href: "https://x.com/81283nargis?s=09",
      icon: Twitter,
      label: "Follow on Twitter",
      color: "hover:text-blue-500"
    },
    {
      href: "https://www.linkedin.com/in/nargis-khatun-4008ab2a9/",
      icon: Linkedin,
      label: "Connect on LinkedIn",
      color: "hover:text-blue-600"
    }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 border-t border-gray-200/50">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start space-x-3">
              <div className="relative h-8 flex">
                <img
                  className="h-16 object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
                  src={assets.prescripx_logo || "/placeholder.svg"}
                  alt="PrescripX - Healthcare Platform"
                  loading="lazy"
                  style={{
                    padding: 0,
                    margin: 0,
                    background: 'transparent',
                    display: 'block'
                  }}
                />
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-primary to-transparent"></div>
              <span className="text-sm font-medium text-gray-600">Healthcare Excellence</span>
            </div>

            <p className="text-gray-600 leading-relaxed max-w-md text-sm lg:text-base">
              PrescripX is committed to excellence in healthcare technology. We continuously strive to enhance our platform,
              integrating the latest advancements to improve user experience and deliver superior service.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Available 24/7</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="text-sm text-gray-500">Trusted by 10,000+ patients</div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
            </h3>
            <nav className="space-y-3">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex items-center text-gray-600 hover:text-primary transition-all duration-200"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 relative">
              Get In Touch
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-gray-600 text-sm">+91-212-456-7890</span>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
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
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
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
                        className={`w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200 hover:scale-110 ${social.color}`}
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

        <div className="border-t border-gray-200/50 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500">
              © {currentYear} PrescripX. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-gray-600 transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer