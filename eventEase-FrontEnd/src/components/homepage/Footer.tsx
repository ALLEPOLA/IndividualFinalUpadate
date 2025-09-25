import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* EventEase Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">EventEase</h3>
            </div>
            <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-sm">
              Your complete event planning solution, designed to make every celebration extraordinary and memorable.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-sm">📧</span>
                </div>
                <span className="text-sm font-medium">Event Creation Tools</span>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm">🎯</span>
                </div>
                <span className="text-sm font-medium">Vendor Management</span>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">📊</span>
                </div>
                <span className="text-sm font-medium">Analytics & Insights</span>
              </div>
            </div>
          </div>

          {/* For Event Creators */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <h4 className="text-lg font-bold text-gray-800">For Event Creators</h4>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Event Planning Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Find & Book Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Budget Management
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Timeline & Scheduling
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Guest Management
                </a>
              </li>
            </ul>
          </div>

          {/* For Service Providers */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h4 className="text-lg font-bold text-gray-800">For Service Providers</h4>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Business Profile Setup
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Booking Management
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Client Communication
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Performance Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Payment Processing</a>
              </li>
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-3"></div>
              <h4 className="text-lg font-bold text-gray-800">Support & Company</h4>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  About EventEase
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#help" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Help Center & FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Contact Info */}
        <div className="border-t border-gray-200 pt-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                  <span className="text-blue-600 text-lg">📧</span>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors cursor-pointer">
                  <span className="text-green-600 text-lg">📱</span>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors cursor-pointer">
                  <span className="text-purple-600 text-lg">🌐</span>
                </div>
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center hover:bg-pink-200 transition-colors cursor-pointer">
                  <span className="text-pink-600 text-lg">💬</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-gray-700 font-medium text-sm">Get in Touch</p>
                <p className="text-gray-500 text-xs">prasannaellepola2000@gmail.com | +94757358093</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-2xl opacity-70">🎉</div>
              <div className="text-2xl opacity-70">✨</div>
              <div className="text-2xl opacity-70">🎊</div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-2 md:mb-0">
              © 2025 EventEase. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs">
              Connecting event creators with service providers, crafting moments of joy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;