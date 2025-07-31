import { Helmet } from "react-helmet"
import { Shield, Mail, Phone } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | PrescripX</title>
        <meta
          name="description"
          content="PrescripX Privacy Policy: How we collect, use, and protect your personal information."
        />
        <link rel="canonical" href="https://prescripx.com/privacy-policy" />
      </Helmet>
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center gap-3">
            <Shield className="w-7 h-7 text-blue-600" />
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 text-center">Last updated: July 30, 2025</p>

          <section className="space-y-4 text-gray-700">
            <p>
              At PrescripX, we are committed to protecting your privacy. This policy outlines how we handle your
              personal information.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Information We Collect</h2>
            <p>
              We collect information you provide directly (e.g., name, email, health data for appointments) and data
              collected automatically (e.g., IP address, usage patterns).
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">2. How We Use Your Information</h2>
            <p>
              Your information is used to provide and improve our services, process appointments, communicate with you,
              and ensure platform security.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">3. How We Share Your Information</h2>
            <p>
              We share relevant information with healthcare providers for your appointments, with service providers
              assisting us, and when legally required. We do not sell your personal data.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">4. Data Security</h2>
            <p>
              We implement security measures to protect your data, but no system is 100% secure. Please use strong,
              unique passwords.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">5. Your Rights</h2>
            <p>
              You have rights regarding your data, including access, correction, and deletion. Contact us to exercise
              these rights.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">6. Changes to This Policy</h2>
            <p>
              We may update this policy periodically. We will notify you of significant changes by posting the new
              policy on this page.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">7. Contact Us</h2>
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
