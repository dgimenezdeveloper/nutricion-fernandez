import React from 'react';
import { Clock, UserCircle, CalendarCheck } from 'lucide-react';

const actividadDemo = [
  {
    tipo: 'turno',
    paciente: 'María González',
    fecha: '2025-12-15',
    detalle: 'Turno agendado para control SIBO.'
  },
  {
    tipo: 'historia',
    paciente: 'Esteban Rodríguez',
    fecha: '2025-12-10',
    detalle: 'Historia clínica actualizada.'
  },
  {
    tipo: 'turno',
    paciente: 'Lucía Martínez',
    fecha: '2025-12-09',
    detalle: 'Turno agendado para consulta IMO.'
  }
];

const iconos = {
  turno: <CalendarCheck size={18} className="text-brand-orange" />,
  historia: <UserCircle size={18} className="text-brand-purple" />
};

const HistorialActividad: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock className="text-brand-purple" /> Actividad Reciente</h3>
    <ul className="divide-y divide-gray-100">
      {actividadDemo.map((a, idx) => (
        <li key={idx} className="py-3 flex items-center gap-3">
          {iconos[a.tipo]}
          <span className="font-semibold text-brand-gray">{a.paciente}</span>
          <span className="text-xs bg-brand-light text-brand-purple px-2 py-0.5 rounded ml-2">{a.fecha}</span>
          <span className="text-gray-500 text-sm ml-2">{a.detalle}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default HistorialActividad;
