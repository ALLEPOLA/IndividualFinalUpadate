export const Analytics = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen relative">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 right-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      <div className="relative z-10 animate-fadeIn">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3">
          📊 Business Analytics
        </h2>
        <p className="text-gray-600 text-lg">
          Track your business performance with detailed analytics. View booking trends,
          revenue reports, customer satisfaction metrics, and other key performance indicators.
          Make data-driven decisions to grow your business and improve your services.
        </p>
      </div>
    </div>
  );
};