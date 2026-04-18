import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import FreeResources from './components/FreeResources';
import About from './components/About';
import Footer from './components/Footer';
import LocationBlock from './components/LocationBlock';
import VideosSection from './components/VideosSection';
import BookingModal from './components/BookingModal';
import WhatsAppButton from './components/WhatsAppButton';
import Pacientes from './components/Pacientes';
import SistemaDashboard from './components/SistemaDashboard';
import MiTurno from './components/MiTurno';

const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [route, setRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (route === '/sistema') {
    return <SistemaDashboard />;
  }

  if (route === '/mi-turno') {
    return <MiTurno />;
  }

  return (
    <div className="font-sans text-brand-gray bg-white selection:bg-brand-purple selection:text-white">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
      <main>
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <FreeResources />
        <Services />
        <About />
        <LocationBlock />
        <VideosSection />
        
      </main>
      <Footer />
      {/* Floating Elements / Modals */}
      <WhatsAppButton />
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
};

export default App;