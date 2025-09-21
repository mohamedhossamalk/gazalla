'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import PlatformIllustration from '@/components/PlatformIllustration';

export default function AboutPage() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About GAZALLA</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Premium accessories crafted for the modern individual
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="lg:w-1/2 slide-up">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-gray-300 mb-6">
              Founded in 2023, GAZALLA emerged from a passion for exceptional craftsmanship and timeless design. 
              We believe that accessories are more than just functional items - they are expressions of personal style 
              and confidence.
            </p>
            <p className="text-gray-300 mb-6">
              Our journey began with a simple idea: to create luxury accessories that seamlessly blend elegance 
              with everyday practicality. Today, we continue to push boundaries in design and quality, 
              offering collections that cater to the discerning tastes of modern men and women.
            </p>
            <p className="text-gray-300">
              Each piece in our collection is meticulously crafted using premium materials and time-honored techniques, 
              ensuring that every accessory not only looks exceptional but also stands the test of time.
            </p>
          </div>
          
          <div className="lg:w-1/2 flex justify-center slide-up animate-delay-300">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-button-background rounded-full opacity-20 blur-xl animate-pulse"></div>
              <img 
                src="/image/WhatsApp_Image_2025-09-17_at_02.47.45_de6dbebb-removebg-preview.png" 
                alt="GAZALLA Logo" 
                className="relative w-64 h-64 object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-card-background rounded-xl p-8 mb-20 slide-up">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Quality Assurance</h3>
              <p className="text-gray-400">
                Every product undergoes rigorous quality checks to ensure it meets our high standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Timeless Design</h3>
              <p className="text-gray-400">
                Our designs transcend seasonal trends, ensuring your accessories remain stylish for years.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Sustainable Practices</h3>
              <p className="text-gray-400">
                We are committed to ethical sourcing and environmentally responsible manufacturing.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center slide-up">
          <h2 className="text-3xl font-bold text-foreground mb-6">Join Our Community</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Become part of a community that values quality, style, and authenticity. 
            Discover exclusive collections and be the first to know about new arrivals.
          </p>
          {user ? (
            <Link 
              href="/products" 
              className="bg-button-background text-white px-8 py-3 rounded-full font-semibold hover:bg-button-hover transition-all duration-300 transform hover:scale-105 glow-hover inline-block"
            >
              Explore Collections
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/register" 
                className="bg-button-background text-white px-8 py-3 rounded-full font-semibold hover:bg-button-hover transition-all duration-300 transform hover:scale-105 glow-hover"
              >
                Create Account
              </Link>
              <Link 
                href="/login" 
                className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 glow-hover"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}