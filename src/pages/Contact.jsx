import { useState, useEffect } from "react"
import { assets } from "../assets/assets"
import { ChevronDown, ChevronUp, Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react"

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.querySelector(".contact-content")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })

    setTimeout(() => setSubmitted(false), 3000)
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Our Office",
      details: ["54098 Wills Station", "Suite 350, Washington, USA"],
      action: "Get Directions",
      color: "bg-blue-500",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["(415) 555-3455", "Available 24/7"],
      action: "Call Now",
      color: "bg-green-500",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["itxnargiskhatun@gmail.com", "Quick response guaranteed"],
      action: "Send Email",
      color: "bg-purple-500",
    },
  ]

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "You can book an appointment through our website by selecting your preferred doctor, choosing an available time slot, and completing the booking process. You can also call our 24/7 helpline or use our mobile app for quick booking.",
    },
    {
      question: "What are your operating hours?",
      answer:
        "Our platform is available 24/7 for booking appointments and accessing services. Our customer support team is available Monday to Friday, 9 AM to 6 PM EST. For urgent medical matters, our emergency helpline operates round the clock.",
    },
    {
      question: "Do you accept insurance?",
      answer:
        "Yes, we work with most major insurance providers including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealth, and many others. You can check if your insurance is accepted by entering your details during the booking process or contacting our support team.",
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Yes, you can easily cancel or reschedule your appointment up to 24 hours before the scheduled time through your patient portal, mobile app, or by calling our support line. Cancellations made less than 24 hours in advance may be subject to a cancellation fee.",
    },
    {
      question: "Is telemedicine available?",
      answer:
        "Yes, we offer telemedicine consultations for many specialties. You can book virtual appointments through our platform and meet with your doctor via secure video call from the comfort of your home.",
    },
    {
      question: "How do I access my medical records?",
      answer:
        "You can access your medical records, test results, and appointment history through your secure patient portal. Simply log in to your account and navigate to the 'Medical Records' section. You can also request physical copies if needed.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
              We're Here to Help
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Contact{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our team for any questions, support, or feedback. We're committed to providing you with
              exceptional service and quick responses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 ${info.color} rounded-2xl text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {info.icon}
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  {info.title}
                </h3>
                <div className="space-y-2 mb-6">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {detail}
                    </p>
                  ))}
                </div>
                <button className="w-full bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-300 group-hover:bg-primary/10">
                  {info.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-content py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid lg:grid-cols-2 gap-16 items-start transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-6 scale-105 opacity-30"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <img
                    className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    src={assets.contact_image || "/placeholder.svg"}
                    alt="PrescripX office building and modern healthcare facility"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Office Hours</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-gray-900">Emergency Only</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Emergency Line</span>
                      <span className="font-medium text-red-600">24/7 Available</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-8 border border-primary/10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-primary rounded-full mr-3"></span>
                  Careers at PrescripX
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Join our innovative team and help shape the future of healthcare technology. We're always looking for
                  passionate individuals who share our vision of making healthcare accessible to everyone.
                </p>
                <button className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center">
                  <span>Explore Opportunities</span>
                  <Send className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center">
                  <div className="w-5 h-5 text-green-600 mr-3">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-green-800 font-medium">
                    Message sent successfully! We'll get back to you soon.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="career">Career Opportunity</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">Quick answers to common questions about our services</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-2xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <div
                    className={`flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === index ? "bg-primary text-white rotate-180" : "text-primary"
                      }`}
                  >
                    {openFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary/5 via-blue-500/5 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Need Immediate Assistance?</h2>
          <p className="text-xl text-gray-600 mb-8">Our support team is available 24/7 to help with urgent matters</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>Call Emergency Line</span>
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 inline-flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              <span>Live Chat Support</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
