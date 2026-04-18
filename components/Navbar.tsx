import React, { useState, useEffect } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { INSTAGRAM_URL } from '../constants';

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleBooking = () => {
    onOpenBooking();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-serif font-bold text-xl">
             S
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-brand-gray text-base sm:text-lg leading-tight">Lic. Sabrina B. Fernandez</span>
             <span className="text-xs text-brand-orange font-semibold tracking-wider">NUTRICIÓN FUNCIONAL</span>
           </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#inicio" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'inicio')} className="text-brand-gray hover:text-brand-purple transition-colors font-medium">Inicio</a>
          <a href="#servicios" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'servicios')} className="text-brand-gray hover:text-brand-purple transition-colors font-medium">Especialidades</a>
          <a href="#sobre-mi" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'sobre-mi')} className="text-brand-gray hover:text-brand-purple transition-colors font-medium">Sobre Mí</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-brand-gray hover:text-brand-purple transition-colors">
            <Send size={20} />
          </a>
          <a href="/sistema" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg ml-2 transition-colors">Acceso Sistema</a>
          <button 
            onClick={onOpenBooking}
            className="bg-brand-purple text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-darkPurple transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Reservar Turno
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-brand-gray p-2 rounded-lg hover:bg-brand-light transition-colors" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <aside className={`fixed md:hidden inset-y-0 right-0 z-50 w-72 bg-white shadow-xl flex flex-col p-6 gap-4 border-l border-gray-100 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-brand-light text-brand-gray" 
          aria-label="Cerrar menú"
        >
          <X size={24} />
        </button>

        <div className="mb-8 flex flex-col items-center mt-4">
          <div className="w-14 h-14 rounded-full bg-brand-purple flex items-center justify-center text-white font-serif font-bold text-3xl mb-2 shadow-lg">S</div>
          <div className="text-center">
            <div className="font-bold text-brand-gray text-lg tracking-wide">Lic. Sabrina B. Fernandez</div>
            <div className="text-xs text-brand-orange font-semibold tracking-wider">NUTRICIÓN FUNCIONAL</div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <a 
            href="#inicio" 
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'inicio')} 
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors text-brand-gray hover:bg-brand-light min-h-[44px]"
          >
            Inicio
          </a>
          <a 
            href="#servicios" 
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'servicios')} 
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors text-brand-gray hover:bg-brand-light min-h-[44px]"
          >
            Especialidades
          </a>
          <a 
            href="#sobre-mi" 
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'sobre-mi')} 
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors text-brand-gray hover:bg-brand-light min-h-[44px]"
          >
            Sobre Mí
          </a>
          <a 
            href={INSTAGRAM_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors text-brand-purple hover:bg-brand-light min-h-[44px]"
          >
            <Send size={20} /> Instagram
          </a>
        </nav>

        <div className="flex flex-col gap-3">
          <a href="/sistema" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-md text-center transition-colors">Acceso Sistema</a>
          <button 
            onClick={handleBooking}
            className="bg-brand-orange hover:bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-md transition-colors"
          >
            Reservar Turno
          </button>
        </div>
      </aside>
    </nav>
  );
};

export default Navbar;