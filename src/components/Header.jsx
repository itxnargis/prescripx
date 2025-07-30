import { useState, useEffect } from 'react'
import { assets } from '../../public/assets/assets'

const Header = () => {
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
            setIsVisible(true);
      }, []);

      const handleBookAppointment = () => {
            const element = document.getElementById('speciality');
            if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
            }
      };

      return (
            <header className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 relative overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600 opacity-90'></div>
                  <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2'></div>
                  <div className='absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2'></div>
                  <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] relative z-10'>
                        <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-2 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                              <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                              <span>Trusted Healthcare Platform</span>
                        </div>

                        <h1 className={`text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight md:leading-tight lg:leading-tight mb-2 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                              Book Appointment <br /> 
                              With <span className='relative'>
                                    <span className='relative z-10'>Trusted Doctors</span>
                                    <span className='absolute bottom-1 left-0 w-full h-3 bg-white/20 rounded-full'></span>
                              </span>
                        </h1>

                        <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 text-white text-sm font-light mb-6 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                              <div className='relative'>
                                    <img className='w-28 rounded-full' src={assets.group_profiles} alt="Happy patients" />
                                    <div className='absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                                          <svg className='w-3 h-3 text-white' fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                    </div>
                              </div>
                              <div className='space-y-2'>
                                    <div className='flex items-center gap-1'>
                                          {[...Array(5)].map((_, i) => (
                                                <svg key={i} className='w-4 h-4 text-yellow-400 fill-current' viewBox="0 0 20 20">
                                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                          ))}
                                          <span className='ml-2 text-sm'>4.9/5 (12,000+ reviews)</span>
                                    </div>
                                    <p className='text-white/90'>Simply browse through our extensive list of trusted doctors,<br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
                              </div>
                        </div>

                        <button 
                              onClick={handleBookAppointment}
                              className={`group flex items-center gap-2 bg-white px-8 py-4 rounded-full text-gray-700 font-semibold text-sm m-auto md:m-0 hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                              style={{transitionDelay: '600ms'}}
                              aria-label="Book appointment with trusted doctors"
                        >
                              <span>Book Appointment</span>
                              <img className='w-3 transition-transform duration-300 group-hover:translate-x-1' src={assets.arrow_icon} alt="" />
                        </button>
                  </div>

                  <div className='md:w-1/2 relative flex items-center justify-center'>
                        <div className={`relative transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                              <div className='absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg z-10'>
                                    <div className='flex items-center gap-2'>
                                          <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                                                <svg className='w-4 h-4 text-white' fill="currentColor" viewBox="0 0 20 20">
                                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                          </div>
                                          <div>
                                                <p className='text-xs font-bold text-gray-900'>500+ Doctors</p>
                                                <p className='text-xs text-gray-600'>Available Now</p>
                                          </div>
                                    </div>
                              </div>

                              <div className='absolute bottom-20 md:bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg z-10'>
                                    <div className='flex items-center gap-2'>
                                          <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                                                <svg className='w-4 h-4 text-white' fill="currentColor" viewBox="0 0 20 20">
                                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                          </div>
                                          <div>
                                                <p className='text-xs font-bold text-gray-900'>24/7 Support</p>
                                                <p className='text-xs text-gray-600'>Always Here</p>
                                          </div>
                                    </div>
                              </div>

                              <img 
                                    className='w-full relative hover:scale-105 transition-transform duration-700 shadow-2xl' 
                                    src={assets.header_img} 
                                    alt="Professional healthcare team ready to serve you" 
                                    loading="eager"
                              />
                        </div>
                  </div>
            </header>
      )
}

export default Header