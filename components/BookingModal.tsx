import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { User, Mail, Phone, ClipboardList } from 'lucide-react';
import { BookingStatus } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<BookingStatus>(BookingStatus.IDLE);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'Consulta General'
  });

  useEffect(() => {
    if (isOpen) setStatus(BookingStatus.IDLE);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(BookingStatus.SUBMITTING);

    // Simulate Backend API call
    setTimeout(() => {
      try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push({ ...formData, date: new Date().toISOString() });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        setStatus(BookingStatus.SUCCESS);
      } catch (err) {
        setStatus(BookingStatus.ERROR);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#a98fdc]/70 backdrop-blur-[4px] animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up relative my-auto">
        <div className="flex justify-between items-center px-5 sm:px-8 pt-5 sm:pt-7 pb-2">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-purple">Solicitar Turno</h2>
          <button onClick={onClose} className="text-brand-purple hover:bg-brand-light p-1 rounded-full transition-colors text-2xl">
            <X size={24} />
          </button>
        </div>
        <div className="p-5 sm:p-8 pt-2">
          {status === BookingStatus.SUCCESS ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Solicitud Enviada!</h3>
              <p className="text-gray-500 mb-6">Me pondré en contacto contigo a la brevedad para confirmar fecha y hora.</p>
              <button onClick={onClose} className="bg-brand-gray text-white px-6 py-2 rounded-full hover:bg-black transition-colors">
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-brand-gray">Nombre Completo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </span>
                  <input required name="name" onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all bg-brand-light placeholder:text-gray-400" placeholder="Tu nombre" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-brand-gray">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input required type="email" name="email" onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all bg-brand-light placeholder:text-gray-400" placeholder="tu@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-brand-gray">Teléfono (WhatsApp)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </span>
                  <input required type="tel" name="phone" onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all bg-brand-light placeholder:text-gray-400" placeholder="Tu número" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-brand-gray">Motivo de consulta</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <ClipboardList size={18} />
                  </span>
                  <select name="reason" onChange={handleChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none bg-brand-light text-gray-700">
                    <option>Consulta General</option>
                    <option>Tratamiento SIBO / IMO</option>
                    <option>Dieta Low FODMAPs</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>

              {status === BookingStatus.ERROR && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> Error al enviar. Intenta nuevamente.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === BookingStatus.SUBMITTING}
                className="w-full bg-brand-orange hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg mt-6 flex justify-center items-center text-lg gap-2"
              >
                {status === BookingStatus.SUBMITTING ? (
                   <span className="animate-pulse">Enviando...</span>
                ) : (
                  <>
                    <Calendar size={22} className="mr-2" /> Solicitar Turno
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;