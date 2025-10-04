import React from 'react';

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: "🍽️",
      title: "Restaurant",
      description: "Catering and food services for events"
    },
    {
      icon: "📸",
      title: "Photography",
      description: "Professional photographers and videography services"
    },
    {
      icon: "🎵",
      title: "Entertainment",
      description: "Live music, DJs, and entertainment services"
    },
    {
      icon: "🌸",
      title: "Decoration",
      description: "Event decoration and floral services"
    },
    {
      icon: "🚗",
      title: "Transportation",
      description: "Logistics services"
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-purple-600 mb-6">
            Event Services
          </h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of premium event services, carefully curated to bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-800">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;