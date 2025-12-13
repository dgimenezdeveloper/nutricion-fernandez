import React, { useState } from 'react';
import { Calendar, Mail, Phone, User, ChevronDown, Send } from 'lucide-react';

interface TurnoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const motivos = [
  'Consulta inicial',
  'Control SIBO',
  'Seguimiento disbiosis',
  'Consulta IMO',
  'Plan nutricional',
  'Otro'
];

const TurnoModal: React.FC<TurnoModalProps> = ({ open, onClose, onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, email, telefono, motivo, fecha });
    setNombre(''); setEmail(''); setTelefono(''); setMotivo(''); setFecha('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in border-t-8 border-brand-orange">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-brand-purple text-2xl">×</button>
        <h2 className="text-2xl font-bold mb-6 text-brand-purple">Solicitar Turno</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)}
                className="pl-10 pr-3 py-2 rounded border w-full focus:ring-2 focus:ring-brand-purple bg-brand-light placeholder:text-gray-400" placeholder="Tu nombre" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="pl-10 pr-3 py-2 rounded border w-full focus:ring-2 focus:ring-brand-purple bg-brand-light placeholder:text-gray-400" placeholder="tu@email.com" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="tel" required value={telefono} onChange={e => setTelefono(e.target.value)}
                  className="pl-10 pr-3 py-2 rounded border w-full focus:ring-2 focus:ring-brand-purple bg-brand-light placeholder:text-gray-400" placeholder="Tu número" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Motivo de consulta</label>
            <div className="relative">
              <select required value={motivo} onChange={e => setMotivo(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded border w-full focus:ring-2 focus:ring-brand-purple bg-brand-light text-gray-700">
                <option value="">Selecciona un motivo</option>
                {motivos.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Fecha preferida (tentativa)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="date" required value={fecha} onChange={e => setFecha(e.target.value)}
                className="pl-10 pr-3 py-2 rounded border w-full focus:ring-2 focus:ring-brand-orange bg-brand-light text-gray-700" placeholder="dd/mm/aaaa" />
            </div>
          </div>
          <button type="submit" className="mt-2 bg-brand-orange hover:bg-orange-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-lg shadow-lg transition-all">
            Solicitar Turno <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TurnoModal;
