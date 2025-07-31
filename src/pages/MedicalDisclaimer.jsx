import { Helmet } from "react-helmet"
import { AlertTriangle, Stethoscope, Heart } from "lucide-react"

export default function MedicalDisclaimerPage() {
  return (
    <>
      <Helmet>
        <title>Medical Disclaimer | PrescripX</title>
        <meta name="description" content="Important Medical Disclaimer for PrescripX platform users." />
        <link rel="canonical" href="https://prescripx.com/medical-disclaimer" />
      </Helmet>
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center gap-3">
            <AlertTriangle className="w-7 h-7 text-red-600" />
            Medical Disclaimer
          </h1>
          <p className="text-sm text-gray-500 text-center">Last updated: July 30, 2025</p>

          <section className="space-y-4 text-gray-700">
            <p>
              The information provided by PrescripX is for general informational purposes only and should not be
              considered medical advice.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              1. Not Medical Advice
            </h2>
            <p>
              Content on PrescripX is for informational purposes only. It is not a substitute for professional medical
              advice, diagnosis, or treatment. Always consult your doctor for health concerns.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              2. No Doctor-Patient Relationship
            </h2>
            <p>
              Using PrescripX does not create a doctor-patient relationship with PrescripX. This relationship is formed
              only during a direct consultation with a healthcare provider.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              3. Emergency Situations
            </h2>
            <p className="font-bold text-red-600">
              DO NOT USE PRESCRIPX FOR MEDICAL EMERGENCIES. Call your doctor or 911 immediately for emergencies.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">4. Accuracy of Information</h2>
            <p>
              While we strive for accuracy, medical information evolves. We do not guarantee the completeness or
              usefulness of all information. Your reliance on any information is at your own risk.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">5. Limitation of Liability</h2>
            <p>
              We are not liable for any loss or damage incurred from using the site or relying on its information. Your
              use is solely at your own risk.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">6. Consent & Updates</h2>
            <p>
              By using our website, you consent to this disclaimer. We may update this document, and changes will be
              posted here.
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
