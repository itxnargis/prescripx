import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
      const navigate = useNavigate();
      const { doctors } = useContext(AppContext);
      const [hoveredCard, setHoveredCard] = useState(null);

      const handleDoctorClick = (doctorId) => {
            navigate(`/appointment/${doctorId}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      const handleViewAll = () => {
            navigate('/doctors');
            window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      return (
            <section
                  className='relative py-20 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20'
                  aria-labelledby="top-doctors-heading"
                  role="region"
            >
                  <div className='absolute inset-0 opacity-5'>
                        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]'></div>
                        <div className='absolute top-0 left-0 w-full h-full bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239CA3AF" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>
                  </div>

                  <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='text-center mb-16'>
                              <div className='inline-block mb-4'>
                                    <span className='inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium'>
                                          <svg className='w-4 h-4 mr-2' fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                          Featured Specialists
                                    </span>
                              </div>
                              <h1
                                    id="top-doctors-heading"
                                    className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'
                              >
                                    Top Doctors to{' '}
                                    <span className='relative inline-block'>
                                          <span className='relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                                                Book
                                          </span>
                                          <span className='absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-blue-200 to-indigo-200 -skew-x-12 transform origin-bottom-left'></span>
                                    </span>
                              </h1>
                              <p className='text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
                                    Discover and connect with our carefully curated network of{' '}
                                    <span className='font-semibold text-gray-800'>trusted medical professionals</span>{' '}
                                    who are ready to provide exceptional care.
                              </p>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16'>
                              {doctors.slice(0, 8).map((doctor, index) => (
                                    <article
                                          key={doctor._id}
                                          className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-[1.02] ${hoveredCard === doctor._id ? 'ring-2 ring-blue-500/20' : ''
                                                }`}
                                          onClick={() => handleDoctorClick(doctor._id)}
                                          onMouseEnter={() => setHoveredCard(doctor._id)}
                                          onMouseLeave={() => setHoveredCard(null)}
                                          role="button"
                                          tabIndex={0}
                                          aria-label={`Book appointment with Dr. ${doctor.name}, ${doctor.speciality}`}
                                          onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                      e.preventDefault();
                                                      handleDoctorClick(doctor._id);
                                                }
                                          }}
                                    >
                                          <div className='absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                                          <div className='relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 aspect-square'>
                                                <img
                                                      className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                                                      src={doctor.image}
                                                      alt={`Dr. ${doctor.name} - ${doctor.speciality}`}
                                                      loading={index < 4 ? 'eager' : 'lazy'}
                                                />

                                                <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 ${doctor.available
                                                            ? 'bg-green-500/90 text-white shadow-lg'
                                                            : 'bg-gray-500/90 text-white'
                                                      }`}>
                                                      <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-200' : 'bg-gray-300'
                                                            } animate-pulse`}></span>
                                                      {doctor.available ? 'Available' : 'Busy'}
                                                </div>

                                                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                                      <button className='bg-white/90 backdrop-blur-sm text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
                                                            Book Now
                                                            <svg className='w-4 h-4 ml-2 inline-block' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                      </button>
                                                </div>
                                          </div>

                                          <div className='p-6 space-y-3'>
                                                <div className='space-y-2'>
                                                      <h3 className='text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300'>
                                                            Dr. {doctor.name}
                                                      </h3>
                                                      <p className='text-gray-600 font-medium text-sm bg-gray-50 inline-block px-3 py-1 rounded-full'>
                                                            {doctor.speciality}
                                                      </p>
                                                </div>

                                                <div className='flex items-center gap-2 text-sm text-gray-500'>
                                                      <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                      </svg>
                                                      <span>Healthcare Professional</span>
                                                </div>
                                          </div>
                                    </article>
                              ))}
                        </div>

                        <div className='text-center'>
                              <button
                                    onClick={handleViewAll}
                                    className='group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-blue-200/50 hover:border-blue-300'
                                    aria-label="View all doctors"
                              >
                                    <span>View All Doctors</span>
                                    <svg className='w-5 h-5 transition-transform duration-300 group-hover:translate-x-1' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>

                                    <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                              </button>
                        </div>
                  </div>
            </section>
      )
}

export default TopDoctors