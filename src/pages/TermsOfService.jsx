"use client"

import { Helmet } from "react-helmet"
import { FileText, AlertTriangle, Mail, Phone } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | PrescripX</title>
        <meta name="description" content="PrescripX Terms of Service: Rules for using our platform." />
        <link rel="canonical" href="https://prescripx.com/terms-of-service" />
      </Helmet>
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center gap-3">
            <FileText className="w-7 h-7 text-blue-600" />
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 text-center">Last updated: July 30, 2025</p>

          <section className="space-y-4 text-gray-700">
            <p>
              These Terms of Service ("Terms") govern your use of the PrescripX platform. By using our Service, you
              agree to these Terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Our Service</h2>
            <p>
              PrescripX connects users with healthcare professionals for appointment booking and provides general health
              information.
            </p>
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900">Important: Not Medical Advice</h3>
                <p className="text-sm mt-1">
                  PrescripX does not provide medical advice, diagnosis, or treatment. Always consult a qualified
                  healthcare professional for health concerns.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">2. Your Responsibilities</h2>
            <p>
              You agree to provide accurate information, comply with laws, and not misuse the Service. You are
              responsible for your account security.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">3. Payments & Cancellations</h2>
            <p>
              You agree to pay all applicable fees. Cancellation policies are set by individual doctors; please review
              them before booking.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">4. Disclaimers & Liability</h2>
            <p>
              The Service is provided "as is." We do not guarantee uninterrupted or error-free service. PrescripX is not
              liable for any direct or indirect damages arising from your use of the Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">5. Changes to Terms</h2>
            <p>
              We may update these Terms. Material changes will be notified. Continued use after changes means you accept
              the new Terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">6. Contact Us</h2>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-600" />
              Email:{" "}
              <a href="mailto:support@prescripx.com" className="text-blue-600 hover:underline">
                support@prescripx.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-600" />
              Visit:{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                prescripx.com/contact
              </a>
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
