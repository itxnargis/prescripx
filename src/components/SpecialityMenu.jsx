import { useState, useEffect, useRef } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
      const [activeIndex, setActiveIndex] = useState(null)
      const [isVisible, setIsVisible] = useState(false)
      const [hoveredIndex, setHoveredIndex] = useState(null)
      const sectionRef = useRef(null)
      const scrollContainerRef = useRef(null)
      const [canScrollLeft, setCanScrollLeft] = useState(false)
      const [canScrollRight, setCanScrollRight] = useState(true)


      useEffect(() => {
            const observer = new IntersectionObserver(
                  ([entry]) => {
                        setIsVisible(entry.isIntersecting)
                  },
                  { threshold: 0.1, rootMargin: '50px' }
            )

            if (sectionRef.current) {
                  observer.observe(sectionRef.current)
            }

            return () => observer.disconnect()
      }, [])

      const scrollToSection = (direction) => {
            const container = scrollContainerRef.current
            if (!container) return

            const scrollAmount = 280
            const currentScroll = container.scrollLeft
            const targetScroll = direction === 'left'
                  ? currentScroll - scrollAmount
                  : currentScroll + scrollAmount

            container.scrollTo({
                  left: targetScroll,
                  behavior: 'smooth'
            })
      }

      const handleSpecialtyClick = (speciality, index) => {
            setActiveIndex(index)
            const specialitySection = document.getElementById('speciality')
            if (specialitySection) {
                  specialitySection.scrollIntoView({ behavior: 'smooth' })
            }
      }

      useEffect(() => {
            const container = scrollContainerRef.current;
            if (!container) return;

            const handleScroll = () => {
                  const { scrollLeft, scrollWidth, clientWidth } = container;
                  setCanScrollLeft(scrollLeft > 0);
                  setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
            };

            container.addEventListener('scroll', handleScroll);
            handleScroll();

            return () => container.removeEventListener('scroll', handleScroll);
      }, []);


      return (
            <section
                  ref={sectionRef}
                  className='relative py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden'
                  id='speciality'
                  aria-labelledby='speciality-heading'
            >
                  <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                        <div className='absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse'></div>
                        <div className='absolute bottom-10 right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000'></div>
                        <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500'></div>
                  </div>

                  <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                              }`}>
                              <div className='inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-4'>
                                    <svg className='w-4 h-4 text-primary mr-2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className='text-primary text-sm font-medium'>Trusted Specialists</span>
                              </div>

                              <h1
                                    id='speciality-heading'
                                    className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6'
                              >
                                    Find by Speciality
                              </h1>

                              <p className='max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed'>
                                    Connect with world-class medical professionals across various specialties.
                                    <span className='font-medium text-gray-800'> Schedule your appointment hassle-free</span>
                                    and receive personalized care from trusted doctors.
                              </p>
                        </div>

                        <div className='flex justify-center items-center mb-8'>
                              <div className='flex items-center space-x-4'>
                                    <button
                                          onClick={() => scrollToSection('left')}
                                          disabled={!canScrollLeft}
                                          className={`group p-3 rounded-full border transition-all duration-300 hover:scale-105
            ${canScrollLeft
                                                      ? 'bg-white shadow-lg hover:shadow-xl border-gray-200 hover:border-primary/30'
                                                      : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                                                }`}
                                          aria-label="Scroll specialities left"
                                    >
                                          <svg
                                                className={`w-5 h-5 transition-colors duration-300 
                  ${canScrollLeft ? 'text-gray-600 group-hover:text-primary' : 'text-gray-400'}
            `}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                          </svg>
                                    </button>


                                    <div className='flex space-x-2'>
                                          {Array.from({ length: Math.ceil(specialityData.length / 4) }).map((_, index) => (
                                                <div key={index} className='w-2 h-2 rounded-full bg-gray-300 hover:bg-primary transition-colors duration-300 cursor-pointer'></div>
                                          ))}
                                    </div>

                                    <button
                                          onClick={() => scrollToSection('right')}
                                          disabled={!canScrollRight}
                                          className={`group p-3 rounded-full border transition-all duration-300 hover:scale-105
            ${canScrollRight
                                                      ? 'bg-white shadow-lg hover:shadow-xl border-gray-200 hover:border-primary/30'
                                                      : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                                                }`}
                                          aria-label="Scroll specialities right"
                                    >
                                          <svg
                                                className={`w-5 h-5 transition-colors duration-300 
                  ${canScrollRight ? 'text-gray-600 group-hover:text-primary' : 'text-gray-400'}
            `}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                    </button>

                              </div>
                        </div>

                        <div className='relative'>
                              <div
                                    ref={scrollContainerRef}
                                    className='flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4'
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                              >
                                    {specialityData.map((item, index) => (
                                          <Link
                                                key={index}
                                                to={`/doctors/${item.speciality}`}
                                                onClick={() => {
                                                      handleSpecialtyClick(item.speciality, index);
                                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                onMouseEnter={() => setHoveredIndex(index)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                                className={`group relative flex-shrink-0 w-64 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                                      } ${hoveredIndex === index ? 'scale-105 z-10' : 'hover:scale-105'
                                                      }`}
                                                style={{ transitionDelay: `${index * 100}ms` }}
                                                aria-label={`Browse ${item.speciality} specialists`}
                                          >
                                                <div className={`relative p-8 rounded-2xl bg-white border-2 transition-all duration-300 ${activeIndex === index
                                                      ? 'border-primary shadow-2xl shadow-primary/20'
                                                      : 'border-gray-200 hover:border-primary/50 hover:shadow-xl'
                                                      }`}>
                                                      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                                                      <div className='relative z-10 flex flex-col items-center text-center'>
                                                            <div className='relative mb-6 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-300'>
                                                                  <img
                                                                        className='w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110'
                                                                        src={item.image}
                                                                        alt={`${item.speciality} specialist icon`}
                                                                        loading="lazy"
                                                                  />
                                                                  <div className='absolute inset-0 rounded-2xl border-2 border-primary/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500'></div>
                                                            </div>

                                                            <h3 className='text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 mb-2'>
                                                                  {item.speciality}
                                                            </h3>

                                                            <p className='text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 mb-4'>
                                                                  Expert Care & Treatment
                                                            </p>

                                                            <div className='flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
                                                                  <span>Browse Doctors</span>
                                                                  <svg className='w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                  </svg>
                                                            </div>
                                                      </div>

                                                      {activeIndex === index && (
                                                            <div className='absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse'></div>
                                                      )}
                                                </div>
                                          </Link>
                                    ))}
                              </div>

                              <div className='absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10'></div>
                              <div className='absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10'></div>
                        </div>
                  </div>
            </section>
      )
}

export default SpecialityMenu