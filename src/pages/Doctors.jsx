import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoctor, setFilterDoctor] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const specialties = [
    { name: 'General Physician', icon: '🩺' },
    { name: 'Gynaecologist', icon: '👩‍⚕️' },
    { name: 'Dermatologist', icon: '🧴' },
    { name: 'Pediatricians', icon: '👶' },
    { name: 'Neurologist', icon: '🧠' },
    { name: 'Gastroenterologist', icon: '🫀' }
  ]

  const applyFilter = () => {
    if (speciality) {
      setFilterDoctor(doctors.filter(doctor => doctor.speciality === speciality))
    } else {
      setFilterDoctor(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  const handleSpecialityClick = (specialtyName) => {
    if (speciality === specialtyName) {
      navigate('/doctors')
    } else {
      navigate(`/doctors/${specialtyName}`)
    }
    setShowFilter(false)
  }

  const handleDoctorClick = (doctorId) => {
    navigate(`/appointment/${doctorId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20'>
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]'></div>
        <div className='absolute top-0 left-0 w-full h-full bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239CA3AF" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-12'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center'>
              <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                {speciality ? `${speciality} Specialists` : 'All Doctors'}
              </h1>
              <p className='text-lg text-gray-600 max-w-2xl'>
                {speciality
                  ? `Find and book appointments with experienced ${speciality.toLowerCase()} specialists in your area.`
                  : 'Browse through our comprehensive directory of medical specialists and healthcare professionals.'
                }
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 text-sm text-gray-500 mb-8'>
            <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>
              {filterDoctor.length} {filterDoctor.length === 1 ? 'doctor' : 'doctors'}
              {speciality && ` specializing in ${speciality}`}
            </span>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='lg:w-80 flex-shrink-0'>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`lg:hidden w-full mb-6 flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${showFilter
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-500 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
            >
              <span className='font-semibold'>Filter Specialties</span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`space-y-3 ${showFilter ? 'block' : 'hidden lg:block'}`}>
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-blue-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Specialties
                </h3>

                <div className='space-y-2'>
                  <button
                    onClick={() => handleSpecialityClick(null)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${!speciality
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                  >
                    <span className='text-lg'>👨‍⚕️</span>
                    <span className='font-medium'>All Doctors</span>
                    <span className='ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                      {doctors.length}
                    </span>
                  </button>

                  {specialties.map((specialty) => {
                    const isActive = speciality === specialty.name
                    const count = doctors.filter(doc => doc.speciality === specialty.name).length

                    return (
                      <button
                        key={specialty.name}
                        onClick={() => handleSpecialityClick(specialty.name)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${isActive
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                      >
                        <span className='text-lg'>{specialty.icon}</span>
                        <span className='font-medium'>{specialty.name}</span>
                        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className='flex-1'>
            {filterDoctor.length === 0 ? (
              <div className='text-center py-16'>
                <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className='w-12 h-12 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>No doctors found</h3>
                <p className='text-gray-500 mb-6'>
                  {speciality
                    ? `No doctors found in ${speciality}. Try browsing all doctors or select a different specialty.`
                    : 'No doctors available at the moment. Please try again later.'
                  }
                </p>
                <button
                  onClick={() => navigate('/doctors')}
                  className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200'
                >
                  View All Doctors
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filterDoctor.map((doctor, index) => (
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
                        e.preventDefault()
                        handleDoctorClick(doctor._id)
                      }
                    }}
                  >
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                    <div className='relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 aspect-square'>
                      <img
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                        src={doctor.image}
                        alt={`Dr. ${doctor.name} - ${doctor.speciality}`}
                        loading={index < 6 ? 'eager' : 'lazy'}
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors