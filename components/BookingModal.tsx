import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-darkPurple/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        
        <div className="bg-brand-purple p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold font-serif">Solicitar Turno</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input required name="name" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" name="email" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (WhatsApp)</label>
                <input required type="tel" name="phone" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Consulta</label>
                <select name="reason" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all">
                  <option>Consulta General</option>
                  <option>Tratamiento SIBO / IMO</option>
                  <option>Dieta Low FODMAPs</option>
                  <option>Otro</option>
                </select>
              </div>

              {status === BookingStatus.ERROR && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> Error al enviar. Intenta nuevamente.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === BookingStatus.SUBMITTING}
                className="w-full bg-brand-orange hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg mt-4 flex justify-center items-center"
              >
                {status === BookingStatus.SUBMITTING ? (
                   <span className="animate-pulse">Enviando...</span>
                ) : (
                  <> <Calendar size={18} className="mr-2" /> Solicitar Turno </>
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