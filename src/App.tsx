import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HospitalFinderPage from './pages/HospitalFinderPage';

// Global flag to track if Google Maps script is already loaded
let isGoogleMapsScriptLoaded = false;

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already available
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      // Check if we've already started loading the script
      if (isGoogleMapsScriptLoaded) {
        // Wait for the existing script to load
        const checkLoaded = () => {
          if (window.google && window.google.maps) {
            setIsGoogleMapsLoaded(true);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // Check if script already exists in DOM
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        isGoogleMapsScriptLoaded = true;
        const checkLoaded = () => {
          if (window.google && window.google.maps) {
            setIsGoogleMapsLoaded(true);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // Load the script for the first time
      isGoogleMapsScriptLoaded = true;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps API. Please check your API key and billing settings.');
        isGoogleMapsScriptLoaded = false; // Reset flag on error
        setIsGoogleMapsLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'hospitals':
        if (!isGoogleMapsLoaded) {
          return (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Google Maps...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Note: You'll need a valid Google Maps API key for full functionality
                </p>
              </div>
            </div>
          );
        }
        return <HospitalFinderPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}

export default App;