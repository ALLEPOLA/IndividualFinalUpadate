import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // EmailJS configuration
      const serviceId = 'service_jhx0o9f';
      const templateId = 'template_icyfgkl'; // Your template ID
      const publicKey = 'OIshGcizfrCj47MEG';

      // Initialize EmailJS
      emailjs.init(publicKey);

      // Template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      };

      // Send email using EmailJS
      const result = await emailjs.send(serviceId, templateId, templateParams);
      
      if (result.status === 200) {
        setSubmitMessage('✅ Thank you for your message! Your email has been sent successfully to prasannaellepola2000@gmail.com');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send email');
      }

    } catch (error) {
      console.error('Error sending email:', error);
      
      // Fallback: Show instructions to user
      setSubmitMessage(`❌ Direct email sending is not configured yet. Please contact us directly at prasannaellepola2000@gmail.com with your message:

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Message: ${formData.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I book a service?",
      answer: "Simply browse our services, select what you need from the list, then click the 'book now' button. You can also contact us directly for personalized assistance."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, PayPal, and bank transfers. Payment plans are also available for larger events."
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer: "Yes, you can cancel or reschedule your booking up to 48 hours before the event. Please contact our support team for assistance."
    },
    {
      question: "Do you provide services outside your main area?",
      answer: "Yes, we can provide service at most locations. Contact us to discuss your specific location requirements."
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <span className="text-4xl mr-2">✨</span>
            <h2 className="text-5xl font-bold text-purple-600">
              Get In Touch
            </h2>
            <span className="text-4xl ml-2">✨</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Let's make your event dreams come true together.
          </p>
        </div>


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-8 h-1 bg-purple-500 mr-4"></div>
              <h3 className="text-3xl font-bold text-purple-600">Let's Connect</h3>
            </div>

            <div className="space-y-6">
              {/*  needdd */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Email Us</h4>
                </div>
                <p className="text-gray-600 mb-1">info@eventease.com</p>
                <p className="text-gray-500 text-sm">support@eventease.com</p>
              </div>

              {/* Call Us */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Call Us</h4>
                </div>
                <p className="text-gray-600 mb-1">+94 757358093</p>
                <p className="text-gray-500 text-sm">Mon-Fri 9AM - 6PM</p>
              </div>

              {/* Visit Us */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Visit Us</h4>
                </div>
                <p className="text-gray-600 mb-1">184,galle road,Colombo</p>
          
              </div>

              {/* Live Chat */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Live Chat</h4>
                </div>
                <p className="text-gray-600 mb-1">Available 24/7</p>
                <p className="text-gray-500 text-sm">Get instant help</p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-purple-600 mb-2">Send us a Message</h3>
              <p className="text-gray-500 mb-6">Fill out the form below</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="wedding">Wedding Planning</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about your event or message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    submitMessage.includes('✅') 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    <div className="whitespace-pre-line text-sm">
                      {submitMessage}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-purple-600 mb-4">Frequently Asked Questions</h3>
            <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-purple-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-purple-600 font-bold text-lg">?</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-purple-600 transform transition-transform duration-200 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-6">
                    <div className="pl-12">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;