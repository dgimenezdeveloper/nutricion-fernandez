import React, { useState, useEffect } from 'react';

interface Turno {
  id: string;
  nombre: string;
  fecha: string;
  motivo: string;
  historiaClinica: string;
}

const getTurnos = (): Turno[] => {
  const data = localStorage.getItem('turnos');
  return data ? JSON.parse(data) : [];
};

const saveTurnos = (turnos: Turno[]) => {
  localStorage.setItem('turnos', JSON.stringify(turnos));
};

const Pacientes: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [selected, setSelected] = useState<Turno | null>(null);
  const [historia, setHistoria] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTurnos(getTurnos());
  }, []);

  const agendarTurno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !fecha || !motivo) return;
    const nuevo: Turno = {
      id: Date.now().toString(),
      nombre,
      fecha,
      motivo,
      historiaClinica: '',
    };
    const nuevos = [...turnos, nuevo];
    setTurnos(nuevos);
    saveTurnos(nuevos);
    setNombre(''); setFecha(''); setMotivo('');
  };

  const abrirHistoria = (turno: Turno) => {
    setSelected(turno);
    setHistoria(turno.historiaClinica || '');
    setShowModal(true);
  };

  const guardarHistoria = () => {
    if (!selected) return;
    const nuevos = turnos.map(t => t.id === selected.id ? { ...t, historiaClinica: historia } : t);
    setTurnos(nuevos);
    saveTurnos(nuevos);
    setShowModal(false);
  };

  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-brand-gray mb-8 text-center">Gestión de Pacientes</h2>
        <form onSubmit={agendarTurno} className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre y Apellido" className="px-4 py-2 rounded border" required />
          <input value={fecha} onChange={e => setFecha(e.target.value)} type="date" className="px-4 py-2 rounded border" required />
          <input value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Motivo de consulta" className="px-4 py-2 rounded border" required />
          <button type="submit" className="bg-brand-purple text-white px-6 py-2 rounded font-bold hover:bg-brand-darkPurple">Agendar</button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Motivo</th>
                <th className="py-2 px-4">Historia Clínica</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map(turno => (
                <tr key={turno.id} className="border-t">
                  <td className="py-2 px-4">{turno.nombre}</td>
                  <td className="py-2 px-4">{turno.fecha}</td>
                  <td className="py-2 px-4">{turno.motivo}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => abrirHistoria(turno)} className="text-brand-orange underline">Ver/Editar</button>
                  </td>
                </tr>
              ))}
              {turnos.length === 0 && (
                <tr><td colSpan={4} className="text-center py-4 text-gray-400">No hay turnos agendados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {showModal && selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
              <h3 className="font-bold text-xl mb-4">Historia Clínica de {selected.nombre}</h3>
              <textarea value={historia} onChange={e => setHistoria(e.target.value)} rows={8} className="w-full border rounded p-2 mb-4" placeholder="Escribe la historia clínica..." />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
                <button onClick={guardarHistoria} className="px-4 py-2 rounded bg-brand-purple text-white font-bold">Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pacientes;
