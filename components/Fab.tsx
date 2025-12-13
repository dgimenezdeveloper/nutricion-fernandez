import React from 'react';
import { Plus } from 'lucide-react';

interface FabProps {
  onAddPaciente: () => void;
  onAddTurno: () => void;
}

const Fab: React.FC<FabProps> = ({ onAddPaciente, onAddTurno }) => (
  <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 items-end">
    <button
      onClick={onAddTurno}
      className="flex items-center gap-2 bg-brand-orange hover:bg-orange-500 text-white px-5 py-3 rounded-full shadow-lg font-bold text-lg transition-all"
      title="Agregar Turno"
    >
      <Plus size={20} /> Turno
    </button>
    <button
      onClick={onAddPaciente}
      className="flex items-center gap-2 bg-brand-purple hover:bg-brand-darkPurple text-white px-5 py-3 rounded-full shadow-lg font-bold text-lg transition-all"
      title="Agregar Paciente"
    >
      <Plus size={20} /> Paciente
    </button>
  </div>
);

export default Fab;
