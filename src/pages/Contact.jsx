import { useState, useEffect, useCallback, memo } from "react"
import { assets } from "../../public/assets/assets"
import { ChevronDown, ChevronUp, Clock, Send, CheckCircle } from 'lucide-react'

const Contact = memo(() => {
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
  const [formErrors, setFormErrors] = useState({})

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

  const validateForm = useCallback(() => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.subject) {
      errors.subject = "Please select a subject"
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }, [formErrors])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_submission", {
        event_category: "engagement",
        event_label: "contact_form",
      })
    }

    setIsSubmitting(true)

    try {
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

      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error("Form submission error:", error)
      setIsSubmitting(false)
    }
  }, [validateForm])

  const toggleFaq = useCallback((index) => {
    setOpenFaq(openFaq === index ? null : index)
  }, [openFaq])

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact PrescripX",
            description: "Get in touch with our team for any questions, support, or feedback.",
            mainEntity: {
              "@type": "Organization",
              name: "PrescripX",
              telephone: "(415) 555-3455",
              email: "itxnargiskhatun@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "54098 Wills Station, Suite 350",
                addressLocality: "Washington",
                addressRegion: "DC",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "(415) 555-3455",
                contactType: "customer service",
                availableLanguage: ["English"],
              },
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
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

        <section className="contact-content py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid lg:grid-cols-2 gap-16 items-start transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <div className="space-y-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-6 scale-105 opacity-30" />
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <img
                      className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                      src={assets.contact_image || "/placeholder.svg?height=400&width=600&query=modern office building"}
                      alt="PrescripX office building and modern healthcare facility"
                      loading="lazy"
                      width="600"
                      height="400"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
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
                        <span className="font-medium text-green-600">24/7 Available</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-8 border border-primary/10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-3" />
                    Careers at PrescripX
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Join our innovative team and help shape the future of healthcare technology. We're always looking for
                    passionate individuals who share our vision of making healthcare accessible to everyone.
                  </p>
                  <button
                    className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 
                             hover:shadow-lg transform hover:scale-105 transition-all duration-300 
                             inline-flex items-center"
                  >
                    <span>Explore Opportunities</span>
                    <Send className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

                {submitted && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Message sent successfully!</h4>
                      <p className="text-green-700 text-sm">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.name
                            ? "border-red-300 bg-red-50 focus:ring-red-500"
                            : "border-gray-300 focus:border-primary focus:ring-primary/20"
                          } transition-all duration-300 outline-none focus:ring-2`}
                        placeholder="Enter your full name"
                        aria-describedby={formErrors.name ? "name-error" : undefined}
                      />
                      {formErrors.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-600">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.email
                            ? "border-red-300 bg-red-50 focus:ring-red-500"
                            : "border-gray-300 focus:border-primary focus:ring-primary/20"
                          } transition-all duration-300 outline-none focus:ring-2`}
                        placeholder="Enter your email"
                        aria-describedby={formErrors.email ? "email-error" : undefined}
                      />
                      {formErrors.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-600">
                          {formErrors.email}
                        </p>
                      )}
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
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.subject
                            ? "border-red-300 bg-red-50 focus:ring-red-500"
                            : "border-gray-300 focus:border-primary focus:ring-primary/20"
                          } transition-all duration-300 outline-none focus:ring-2`}
                        aria-describedby={formErrors.subject ? "subject-error" : undefined}
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Question</option>
                        <option value="partnership">Partnership</option>
                        <option value="career">Career Opportunity</option>
                      </select>
                      {formErrors.subject && (
                        <p id="subject-error" className="mt-1 text-sm text-red-600">
                          {formErrors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.message
                          ? "border-red-300 bg-red-50 focus:ring-red-500"
                          : "border-gray-300 focus:border-primary focus:ring-primary/20"
                        } transition-all duration-300 outline-none focus:ring-2 resize-none`}
                      placeholder="Tell us how we can help you..."
                      aria-describedby={formErrors.message ? "message-error" : undefined}
                    />
                    {formErrors.message && (
                      <p id="message-error" className="mt-1 text-sm text-red-600">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5">
                      <input
                        id="privacy"
                        type="checkbox"
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        required
                      />
                    </div>
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and consent to the processing of my personal data.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 
                             hover:shadow-lg transform hover:scale-105 transition-all duration-300 
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
                             flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
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
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    <div
                      className={`flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center 
                                transition-all duration-300 ${openFaq === index ? "bg-primary text-white rotate-180" : "text-primary"
                        }`}
                    >
                      {openFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    aria-hidden={openFaq !== index}
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

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Visit our office for in-person consultations and support
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[400px] border border-gray-100">
              <iframe
                title="PrescripX Office Location"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96714.68291250926!2d-77.08467941438363!3d38.89370533459272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c6de5af6e45b%3A0xc2524522d4885d2a!2sWashington%2C%20DC!5e0!3m2!1sen!2sus!4v1656543891074!5m2!1sen!2sus"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

      </div>
    </>
  )
})

Contact.displayName = "Contact"

export default Contact
