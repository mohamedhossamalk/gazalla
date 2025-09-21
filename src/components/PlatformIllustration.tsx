import React from 'react';

interface PlatformIllustrationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PlatformIllustration({ 
  size = 'md',
  className = '' 
}: PlatformIllustrationProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main platform illustration */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-20 animate-pulse"></div>
        
        {/* Middle circle */}
        <div className="absolute inset-4 rounded-full border-4 border-white border-opacity-30 animate-pulse animate-delay-500"></div>
        
        {/* Inner circle */}
        <div className="absolute inset-8 rounded-full border-4 border-white border-opacity-40 animate-pulse animate-delay-1000"></div>
        
        {/* Central platform */}
        <div className="absolute inset-12 rounded-full bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 md:w-16 md:h-16 mx-auto mb-2" />
            <span className="text-white font-bold text-base md:text-lg">GAZALLA</span>
          </div>
        </div>
        
        {/* Floating elements around the platform */}
        <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-8 h-8 md:w-12 md:h-12 rounded-full bg-accent bg-opacity-50 flex items-center justify-center float-animation">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        
        <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-8 h-8 md:w-12 md:h-12 rounded-full bg-button-background bg-opacity-50 flex items-center justify-center float-animation animate-delay-1000">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 md:-top-6 w-8 h-8 md:w-12 md:h-12 rounded-full bg-purple-500 bg-opacity-50 flex items-center justify-center float-animation animate-delay-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}