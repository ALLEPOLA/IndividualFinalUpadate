interface EventEaseLogoProps {
  className?: string;
}

export const EventEaseLogo = ({ className = "" }: EventEaseLogoProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="bg-blue-600 text-white font-bold text-xl px-3 py-2 rounded-lg">
        EE
      </div>
      <span className="text-xl font-semibold text-gray-800">EventEase</span>
    </div>
  );
};
