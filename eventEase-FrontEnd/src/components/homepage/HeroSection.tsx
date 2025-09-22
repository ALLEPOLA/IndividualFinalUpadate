import React, { useState, useEffect } from 'react';

// Placeholder images - replace with actual images in public/assets/ folder
const weddingFlowers = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop';
const gardenWedding = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop';
const weddingCatering = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop';
const weddingDJ = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: weddingFlowers,
      alt: 'Wedding Flowers'
    },
    {
      image: gardenWedding,
      alt: 'Garden Wedding'
    },
    {
      image: weddingCatering,
      alt: 'Wedding Catering'
    },
    {
      image: weddingDJ,
      alt: 'Wedding DJ Service'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 text-white text-sm font-medium z-20">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-20"
        aria-label="Previous slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-20"
        aria-label="Next slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 max-w-5xl leading-tight">
          Plan Your Perfect Event
        </h1>
        
        {/* Purple Underline */}
        <div className="w-32 h-1 bg-purple-500 mx-auto rounded-full mb-8"></div>
        
        {/* Subheading */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 max-w-3xl">
          Create Unforgettable Moments
        </h2>
        
        {/* Description */}
        <p className="text-lg md:text-xl lg:text-2xl mb-6 max-w-4xl leading-relaxed">
          Connect with the best vendors for restaurants, photography, entertainment, decoration, and transportation.
        </p>

        {/* Bottom Section with Quote and Features */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
          {/* Why Choose EventEase Header */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-xl">✨</span>
            <h3 className="text-xl md:text-2xl font-bold mx-3">Why Choose EventEase?</h3>
            <span className="text-xl">✨</span>
          </div>
          
          {/* Quote */}
          <p className="text-base md:text-lg italic mb-6 max-w-3xl mx-auto leading-relaxed">
            "Where dreams become reality and every celebration tells a story. EventEase brings together the finest artisans, the most talented performers, and the most dedicated professionals to transform your vision into an extraordinary experience that will be remembered for a lifetime."
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-green-500/80 px-4 py-2 rounded-full text-white font-medium text-sm">
              Premium Vendors
            </span>
            <span className="bg-purple-500/80 px-4 py-2 rounded-full text-white font-medium text-sm">
              Seamless Planning
            </span>
            <span className="bg-yellow-500/80 px-4 py-2 rounded-full text-white font-medium text-sm">
              Unforgettable Memories
            </span>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;