import { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.about-content');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Efficiency",
      description: "Streamlined appointment scheduling that fits into your busy lifestyle with real-time availability and instant confirmations."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Convenience",
      description: "Access to a comprehensive network of trusted healthcare professionals in your area, available 24/7 through our platform."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "Personalization",
      description: "AI-powered tailored recommendations and smart reminders to help you stay proactive about your health and wellness."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Patients", icon: "👥" },
    { number: "500+", label: "Certified Doctors", icon: "👨‍⚕️" },
    { number: "99.9%", label: "Platform Uptime", icon: "⚡" },
    { number: "24/7", label: "Support Available", icon: "🕐" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              Revolutionizing Healthcare Access
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">PrescripX</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in managing healthcare needs with cutting-edge technology,
              seamless user experience, and unwavering commitment to your well-being.
            </p>
          </div>
        </div>
      </section>

      <section className="about-content py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-6 scale-105 opacity-30"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img
                  className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  src={assets.about_image}
                  alt="Modern healthcare technology and patient care at PrescripX"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Transforming Healthcare
                  <span className="block text-primary">One Connection at a Time</span>
                </h2>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    Welcome to <strong className="text-primary">PrescripX</strong>, where innovation meets compassion in healthcare delivery.
                    We understand the complexities individuals face when scheduling doctor appointments and managing health records in today's fast-paced world.
                  </p>

                  <p className="text-lg">
                    Our platform leverages advanced technology and user-centric design to eliminate healthcare barriers,
                    ensuring you receive the care you deserve when you need it most. From AI-powered matching to seamless booking experiences,
                    we're revolutionizing how you interact with healthcare providers.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-8 border border-primary/10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-3"></span>
                    Our Vision
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To create a seamless, intelligent healthcare ecosystem that bridges the gap between patients and providers.
                    We envision a future where accessing quality healthcare is as simple as a few taps,
                    powered by cutting-edge technology and driven by human empathy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-2xl mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary">PrescripX</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare like never before with our innovative features designed for the modern patient
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-primary/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary/5 via-blue-500/5 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied patients who trust PrescripX for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center">
              <span>Get Started Today</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About