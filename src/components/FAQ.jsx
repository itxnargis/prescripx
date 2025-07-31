import { useState, useCallback } from "react"
import { ChevronDown, HelpCircle, MessageCircle, Phone } from 'lucide-react'

const EnhancedFAQ = () => {
    const [openFaq, setOpenFaq] = useState(null)

    const toggleFaq = useCallback((index) => {
        setOpenFaq(openFaq === index ? null : index)
    }, [openFaq])

    const faqs = [
        {
            question: "How do I book an appointment?",
            answer: "You can book an appointment through our website by selecting your preferred doctor, choosing an available time slot, and completing the booking process. You can also call our 24/7 helpline or use our mobile app for quick booking.",
            icon: <MessageCircle className="w-5 h-5" />
        },
        {
            question: "What are your operating hours?",
            answer: "Our platform is available 24/7 for booking appointments and accessing services. Our customer support team is available Monday to Friday, 9 AM to 6 PM EST. For urgent medical matters, our emergency helpline operates round the clock.",
            icon: <Phone className="w-5 h-5" />
        },
        {
            question: "Do you accept insurance?",
            answer: "Yes, we work with most major insurance providers including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealth, and many others. You can check if your insurance is accepted by entering your details during the booking process or contacting our support team.",
            icon: <HelpCircle className="w-5 h-5" />
        },
        {
            question: "Can I cancel or reschedule my appointment?",
            answer: "Yes, you can easily cancel or reschedule your appointment up to 24 hours before the scheduled time through your patient portal, mobile app, or by calling our support line. Cancellations made less than 24 hours in advance may be subject to a cancellation fee.",
            icon: <MessageCircle className="w-5 h-5" />
        },
        {
            question: "Is telemedicine available?",
            answer: "Yes, we offer telemedicine consultations for many specialties. You can book virtual appointments through our platform and meet with your doctor via secure video call from the comfort of your home.",
            icon: <HelpCircle className="w-5 h-5" />
        },
        {
            question: "How do I access my medical records?",
            answer: "You can access your medical records, test results, and appointment history through your secure patient portal. Simply log in to your account and navigate to the 'Medical Records' section. You can also request physical copies if needed.",
            icon: <Phone className="w-5 h-5" />
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Got Questions? We've Got Answers
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Frequently Asked{" "}
                        <span className="bg-blue-700 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Find quick answers to the most common questions about our healthcare services and platform
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === index
                                    ? 'shadow-xl border-blue-200 ring-2 ring-blue-100'
                                    : 'shadow-sm border-gray-200 hover:shadow-md hover:border-gray-300'
                                }`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-0 transition-all duration-200"
                                aria-expanded={openFaq === index}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${openFaq === index
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                                        }`}>
                                        {faq.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 pr-4 leading-tight">
                                        {faq.question}
                                    </h3>
                                </div>

                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === index
                                        ? 'bg-blue-600 text-white rotate-180 shadow-lg'
                                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                    }`}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </button>

                            <div
                                id={`faq-answer-${index}`}
                                className={`transition-all duration-500 ease-in-out ${openFaq === index
                                        ? 'max-h-96 opacity-100'
                                        : 'max-h-0 opacity-0'
                                    }`}
                                aria-hidden={openFaq !== index}
                            >
                                <div className="px-8 pb-8">
                                    <div className="border-t border-gray-100 pt-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                                            <p className="text-gray-700 leading-relaxed text-base">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default EnhancedFAQ