import { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const bannerElement = document.getElementById('hero-banner');
    if (bannerElement) {
      observer.observe(bannerElement);
    }

    return () => observer.disconnect();
  }, []);

  const handleCreateAccount = () => {
    navigate('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="hero-banner"
      className='relative my-20 md:mx-10 overflow-hidden'
      role="banner"
      aria-labelledby="banner-heading"
    >
      <div className='relative bg-gradient-to-r from-primary via-primary/95 to-primary/90 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10'>
        <div className='absolute inset-0 overflow-hidden rounded-2xl'>
          <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000'></div>
          <div className='absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-bounce delay-500'></div>
        </div>

        <div className='relative flex flex-col lg:flex-row items-center px-6 sm:px-10 md:px-14 lg:px-12'>
          <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
              <h1
                id="banner-heading"
                className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight'
              >
                <span className='block mb-2 transform hover:scale-105 transition-transform duration-300'>
                  Book Appointment
                </span>
                <span className='block text-white/90 font-semibold'>
                  With 100+ Trusted Doctors
                </span>
              </h1>

              <p className='mt-4 text-white/80 text-sm sm:text-base md:text-lg max-w-md leading-relaxed'>
                Experience world-class healthcare with our network of certified medical professionals.
                Quick booking, secure consultations, and personalized care.
              </p>

              <div className={`mt-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                <button
                  onClick={handleCreateAccount}
                  className='group relative bg-white text-primary px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base 
                           hover:bg-gray-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300 
                           focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-primary
                           active:scale-95'
                  aria-label="Create account to book appointments"
                >
                  <span className='relative z-10 flex items-center space-x-2'>
                    <span>Create Account</span>
                    <svg
                      className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200'
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>

                  <div className='absolute inset-0 bg-gradient-to-r from-white to-gray-50 opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-300 rounded-full'></div>
                </button>
              </div>

              <div className={`mt-8 flex items-center space-x-6 text-white/70 text-xs sm:text-sm transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                <div className='flex items-center space-x-2'>
                  <svg className='w-4 h-4 text-yellow-400' fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>4.9/5 Rating</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='w-4 h-4 text-green-400' fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% Secure</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='w-4 h-4 text-blue-400' fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </div>

          <div className='relative mt-8 lg:mt-0 lg:w-1/2 xl:w-[370px]'>
            <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}>
              <div className='relative group'>
                <div className='absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300'></div>
                <img
                  className='relative w-full h-auto max-w-md mx-auto lg:max-w-full transform group-hover:scale-105 
                           transition-transform duration-500 filter drop-shadow-2xl'
                  src={assets.appointment_img}
                  alt="Professional doctor ready to provide healthcare consultation and medical appointments"
                  loading="lazy"
                />

                <div className='absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 animate-float'>
                  <svg className='w-6 h-6 text-white' fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className='absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3 animate-float delay-1000'>
                  <svg className='w-6 h-6 text-white' fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Book Medical Appointment",
            "description": "Book appointments with 100+ trusted doctors. Quick, secure, and personalized healthcare consultations.",
            "url": window.location.href,
            "mainEntity": {
              "@type": "MedicalBusiness",
              "name": "PrescripX",
              "description": "Healthcare appointment booking platform",
              "serviceType": "Medical Consultation"
            }
          })
        }}
      />
    </section>
  )
}

export default Banner