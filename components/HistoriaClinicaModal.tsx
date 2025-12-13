import React from 'react';

interface Paciente {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  historiaClinica?: string;
}

interface Turno {
  id: string;
  pacienteId: string;
  fecha: string;
  motivo: string;
}

interface HistoriaClinicaModalProps {
  paciente: Paciente | Record<string, never>;
  turnos: Turno[];
  open: boolean;
  onClose: () => void;
  onSave: (historia: string) => void;
}

const HistoriaClinicaModal: React.FC<HistoriaClinicaModalProps> = ({ paciente, turnos, open, onClose, onSave }) => {
  const [historia, setHistoria] = React.useState(paciente.historiaClinica || '');

  React.useEffect(() => {
    setHistoria(paciente.historiaClinica || '');
  }, [paciente]);

  if (!open || !paciente.id) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-brand-purple text-2xl">×</button>
        <h2 className="text-2xl font-bold mb-2 text-brand-purple">Historia Clínica</h2>
        <div className="mb-2 text-lg font-semibold">{paciente.nombre || 'Sin nombre'}</div>
        <div className="mb-4 text-gray-500 text-sm">Fecha de nacimiento: {paciente.fechaNacimiento || 'No especificada'}</div>
        <label className="block mb-2 font-semibold">Notas y evolución:</label>
        <textarea
          className="w-full border rounded p-3 mb-4 min-h-[120px] focus:ring-2 focus:ring-brand-purple"
          value={historia}
          onChange={e => setHistoria(e.target.value)}
        />
        <div className="mb-4">
          <label className="block font-semibold mb-1">Turnos del paciente:</label>
          <ul className="bg-brand-light rounded p-3 text-sm">
            {turnos.length === 0 && <li className="text-gray-400">Sin turnos registrados.</li>}
            {turnos.map(t => (
              <li key={t.id} className="flex justify-between py-1 border-b last:border-b-0">
                <span>{t.fecha}</span>
                <span className="text-gray-500">{t.motivo}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
          <button onClick={() => onSave(historia)} className="px-6 py-2 rounded bg-brand-purple text-white font-bold hover:bg-brand-darkPurple">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default HistoriaClinicaModal;
