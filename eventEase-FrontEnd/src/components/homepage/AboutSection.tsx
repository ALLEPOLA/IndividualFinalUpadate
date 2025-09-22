import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-3xl animate-bounce opacity-60" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 right-16 text-2xl animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-16 text-2xl animate-bounce opacity-60" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-3xl animate-bounce opacity-60" style={{ animationDelay: '2.5s' }}>⭐</div>
      <div className="absolute top-1/3 right-1/4 text-2xl animate-bounce opacity-60" style={{ animationDelay: '3s' }}>✨</div>
      <div className="absolute bottom-1/3 left-1/4 text-2xl animate-bounce opacity-60" style={{ animationDelay: '3.5s' }}>🌟</div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mb-6">
            About EventEase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Where dreams become reality and every celebration tells a story
          </p>
        </div>

        {/* Service Icons */}
        <div className="flex justify-center items-center space-x-12 mb-20">
          <div className="text-6xl hover:scale-110 transition-transform duration-300 cursor-pointer">🎉</div>
          <div className="text-6xl hover:scale-110 transition-transform duration-300 cursor-pointer">🏠</div>
          <div className="text-6xl hover:scale-110 transition-transform duration-300 cursor-pointer">🎵</div>
          <div className="text-6xl hover:scale-110 transition-transform duration-300 cursor-pointer">📸</div>
          <div className="text-6xl hover:scale-110 transition-transform duration-300 cursor-pointer">🍰</div>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-8 h-1 bg-purple-500 mr-4"></div>
              <h2 className="text-4xl font-bold text-purple-600">Our Story</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              EventEase was born from a simple yet powerful vision: to make event planning accessible, enjoyable, and stress-free for everyone. We understand that every celebration is unique, and every moment matters.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              What started as a small team of passionate event enthusiasts has grown into a comprehensive platform that connects thousands of customers with the finest vendors across the country. Our journey is marked by countless smiles, tears of joy, and unforgettable moments.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, we're proud to be the trusted partner for weddings, corporate events, birthday celebrations, and everything in between. Our commitment to excellence and customer satisfaction remains at the heart of everything we do.
            </p>
          </div>
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-purple-600 mb-4">The Beginning</h3>
                <p className="text-gray-600">Started with a dream to make event planning magical</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 text-3xl animate-bounce opacity-60" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}>🌟</div>
          </div>
        </div>

        {/* Mission & Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-purple-600 mb-8">Our Mission & Values</h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-12 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 mb-6 hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To connect people with exceptional event experiences that bring joy and lasting memories to every celebration.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 mb-6 hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Excellence, integrity, innovation, and customer satisfaction guide every decision we make and every service we provide.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-3xl p-8 mb-6 hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the world's most trusted platform for event planning, making every celebration extraordinary and every moment memorable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;