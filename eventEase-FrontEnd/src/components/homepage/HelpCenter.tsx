import React, { useState } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    {
      icon: '❤️',
      title: 'All Categories',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: '🎉',
      title: 'For Event Creators',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: '🏢',
      title: 'For Service Providers',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: '🔧',
      title: 'Platform & Billing',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: '💬',
      title: 'Technical Support',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: '📞',
      title: 'Contact',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const articles: Article[] = [
    {
      id: 'ec1',
      title: 'How to Create Your First Event',
      content: `Log into your EventEase account and click "Create New Event" from your dashboard.
Fill in basic details: event title, date/time, location (venue address or virtual), and select appropriate category.
Write a compelling description including what attendees can expect, highlights, requirements, and parking information.
Set up pricing options (free/paid), ticket tiers (VIP, General, Early Bird), discounts, and upload high-quality cover photo.
Configure registration settings (required fields, capacity limits, deadline), preview your event, and publish when ready.`,
      category: 'For Event Creators',
      tags: ['getting started', 'event creation', 'step-by-step']
    },
    {
      id: 'sp1',
      title: 'Setting Up Your Service Provider Profile',
      content: `Complete your profile basics: business name, professional photo, contact information, and service area coverage.
Select relevant service categories (photography, catering, entertainment, decoration, venues) and write detailed descriptions.
Upload 10-20 high-quality portfolio images with descriptions, organize by event type, and update regularly.
Set transparent pricing information including starting prices, package deals, payment terms, and cancellation policies.
Keep availability calendar updated, upload certifications/licenses, encourage client reviews, and optimize with keywords.`,
      category: 'For Service Providers',
      tags: ['profile', 'setup', 'optimization']
    },
    {
      id: 'pb1',
      title: 'Understanding EventEase Fees',
      content: `Event Creators: Free events have no fees, paid events charge 3.5% + $0.99 per ticket plus 2.9% + $0.30 processing fee.
Service Providers: Basic plan is free (limited features), Professional plan $29/month, Premium plan $79/month.
All plans include secure payment processing, customer support, mobile app access, and analytics tools.
Payments processed 2-3 days after events, service providers paid upon completion, refunds within 5-7 days.
Annual payment discounts available (save 20%), 30-day money-back guarantee, no hidden charges or surprise costs.`,
      category: 'Platform & Billing',
      tags: ['fees', 'billing', 'pricing', 'transparency']
    },
    {
      id: 'ts1',
      title: 'Troubleshooting Login Issues',
      content: `Forgotten password: Click "Forgot Password", enter email, check inbox for reset link, create new password.
Account not found: Verify correct email address, check for typos, try username instead, contact support if needed.
Password not working: Turn off Caps Lock, check for extra spaces, verify special characters, clear saved passwords.
Browser issues: Clear cache/cookies, try incognito mode, disable extensions, update browser, or try different browser.
For persistent problems: Try different device, disable firewall temporarily, or contact support with error details.`,
      category: 'Technical Support',
      tags: ['login', 'troubleshooting', 'password', 'security']
    },
    {
      id: 'c1',
      title: 'How to Contact Support',
      content: `Live Chat: Available Mon-Fri 9AM-8PM EST, click chat bubble for immediate help with quick questions.
Email: support@eventease.com for complex issues, include account details and screenshots, response within 24 hours.
Phone: 1-800-EVENT-99 (Mon-Fri 8AM-6PM EST) for urgent billing or security issues, average wait 3-5 minutes.
Emergency: 1-800-EVENT-911 available 24/7 during active events for payment failures or system outages.
Help Center: 24/7 self-service with step-by-step guides, video tutorials, and searchable FAQ database.`,
      category: 'Contact',
      tags: ['support', 'contact', 'help', 'communication']
    }
  ];

  // Filter articles based on selected category and search query
  const filteredArticles = selectedCategory ? articles.filter(article => {
    const matchesCategory = selectedCategory === 'All Categories' || article.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }) : [];

  const handleCategoryClick = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    setSearchQuery(''); // Clear search when selecting a category
  };

  const handleBackToCategories = () => {
    setSelectedCategory('');
    setSearchQuery('');
  };


  return (
    <section id="help" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">Help Center</h1>
          <p className="text-gray-600 text-lg mb-8">Find answers to your questions about EventEase</p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Browse by Category */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.title)}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">{category.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Articles Section - Only show when a category is selected */}
        {selectedCategory && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCategory === 'All Categories' 
                  ? `All Articles (${filteredArticles.length})` 
                  : `${selectedCategory} (${filteredArticles.length})`
                }
              </h2>
              <button
                onClick={handleBackToCategories}
                className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Categories
              </button>
            </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No articles match your search "${searchQuery}"`
                  : `No articles available in ${selectedCategory}`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-102 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                      {article.title}
                    </h3>
                    <div className="ml-2 text-purple-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 text-sm mb-4 leading-relaxed space-y-1">
                    {article.content.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3">
                    <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        )}

      </div>
    </section>
  );
};

export default HelpCenter;
