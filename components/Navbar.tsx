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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-serif font-bold text-xl">
             S
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-brand-gray text-lg leading-tight">Lic. Sabrina B. Fernandez</span>
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

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-gray" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 flex flex-col items-center gap-6 animate-fade-in">
          <a href="#inicio" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'inicio')} className="text-brand-gray font-medium text-lg">Inicio</a>
          <a href="#servicios" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'servicios')} className="text-brand-gray font-medium text-lg">Especialidades</a>
          <a href="#sobre-mi" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, 'sobre-mi')} className="text-brand-gray font-medium text-lg">Sobre Mí</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-purple font-medium">
            <Send size={20} /> Instagram
          </a>
          <a href="/sistema" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-md">Acceso Sistema</a>
          <button 
            onClick={() => {
              onOpenBooking();
              setIsMobileMenuOpen(false);
            }}
            className="bg-brand-orange text-white px-8 py-3 rounded-full font-bold shadow-md"
          >
            Reservar Turno
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;