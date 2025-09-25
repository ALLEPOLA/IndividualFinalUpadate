interface EventEaseLogoProps {
  className?: string;
}

export const EventEaseLogo = ({ className = "" }: EventEaseLogoProps) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-purple-700 text-white font-bold text-xl px-3 py-2 rounded-xl shadow-lg">
        EE
      </div>
      <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">EventEase</span>
    </div>
  );
};
