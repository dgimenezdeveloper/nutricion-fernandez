import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import FreeResources from './components/FreeResources';
import About from './components/About';
import Footer from './components/Footer';
import LocationBlock from './components/LocationBlock';
import VideosSection from './components/VideosSection';
import BookingModal from './components/BookingModal';
// import AIChat from './components/AIChat';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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