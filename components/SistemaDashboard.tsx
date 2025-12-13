import React, { useState, useEffect } from 'react';
import HistoriaClinicaModal from './HistoriaClinicaModal';
import { Users, CalendarCheck, FileText, LayoutDashboard, UserCircle, PlusCircle, Activity, Edit, Trash2, Info, Download } from 'lucide-react';
import Fab from './Fab';
import HistorialActividad from './HistorialActividad';

const pacientesDemo = [
  {
    id: '1',
    nombre: 'María González',
    fechaNacimiento: '1990-05-12',
    historiaClinica: 'Paciente con antecedentes de SIBO. Tratamiento funcional iniciado en 2024. Mejoría notable en síntomas digestivos.'
  },
  {
    id: '2',
    nombre: 'Esteban Rodríguez',
    fechaNacimiento: '1985-11-23',
    historiaClinica: 'Consulta por disbiosis intestinal. Dieta personalizada y suplementación. Seguimiento mensual.'
  },
  {
    id: '3',
    nombre: 'Lucía Martínez',
    fechaNacimiento: '1997-03-08',
    historiaClinica: 'Paciente con diagnóstico de IMO. Protocolo Low FODMAP y control de síntomas.'
  }
];

const turnosDemo = [
  { id: 't1', pacienteId: '1', fecha: '2025-12-15', motivo: 'Control SIBO' },
  { id: 't2', pacienteId: '2', fecha: '2025-12-16', motivo: 'Seguimiento disbiosis' },
  { id: 't3', pacienteId: '3', fecha: '2025-12-17', motivo: 'Consulta IMO' }
];

const menu = [
  { key: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { key: 'pacientes', label: 'Pacientes', icon: Users },
  { key: 'turnos', label: 'Turnos', icon: CalendarCheck },
  { key: 'historias', label: 'Historias Clínicas', icon: FileText }
];

const SistemaDashboard: React.FC = () => {
  const [view, setView] = useState('resumen');
  const [pacientes, setPacientes] = useState(pacientesDemo);
  const [turnos, setTurnos] = useState(turnosDemo);
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Resumen simple
  const totalPacientes = pacientes.length;
  const totalTurnos = turnos.length;

  // Filtrado de pacientes
  const pacientesFiltrados = pacientes.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  // Guardar historia clínica
  const guardarHistoria = (historia: string) => {
    if (!selectedPaciente) return;
    setPacientes(pacientes.map(p => p.id === selectedPaciente.id ? { ...selectedPaciente, historiaClinica: historia } : p));
    setModalOpen(false);
  };

  // Handlers para agregar paciente y turno (simulados)
  const handleAddPaciente = () => {
    alert('Funcionalidad de agregar paciente próximamente.');
  };
  const handleAddTurno = () => {
    alert('Funcionalidad de agregar turno próximamente.');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col p-6 gap-4 border-r border-gray-100">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-brand-purple flex items-center justify-center text-white font-serif font-bold text-3xl mb-2 shadow-lg">SF</div>
          <div className="font-bold text-brand-gray text-lg tracking-wide">Sistema de Gestión</div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {menu.map(item => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`flex items-center gap-3 text-left px-4 py-2 rounded-lg font-semibold transition-colors ${view === item.key ? 'bg-brand-purple text-white shadow' : 'text-brand-gray hover:bg-brand-light'}`}
            >
              <item.icon size={20} className={view === item.key ? 'text-white' : 'text-brand-purple'} />
              {item.label}
            </button>
          ))}
        </nav>
        <a href="/" className="mt-auto text-sm text-brand-orange hover:underline">Volver al sitio</a>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-10">
        {view === 'resumen' && (
          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2"><Activity className="text-brand-purple" /> Resumen General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col items-center">
                <Users size={32} className="text-brand-purple mb-2" />
                <div className="text-4xl font-extrabold text-brand-purple">{totalPacientes}</div>
                <div className="text-gray-500 mt-2">Pacientes</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col items-center">
                <CalendarCheck size={32} className="text-brand-orange mb-2" />
                <div className="text-4xl font-extrabold text-brand-orange">{totalTurnos}</div>
                <div className="text-gray-500 mt-2">Turnos</div>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">Próximos Turnos</h3>
            <ul className="bg-white rounded-xl shadow p-4">
              {turnos.map(t => {
                const paciente = pacientes.find(p => p.id === t.pacienteId);
                return (
                  <li key={t.id} className="py-2 border-b last:border-b-0 flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <UserCircle size={18} className="text-brand-purple" />
                      <span className="font-semibold">{paciente?.nombre}</span>
                      <span className="ml-2 text-xs bg-brand-light text-brand-purple px-2 py-0.5 rounded">{t.fecha}</span>
                    </span>
                    <span className="text-gray-500 text-sm font-medium">{t.motivo}</span>
                  </li>
                );
              })}
            </ul>
            <HistorialActividad />
          </div>
        )}
        {view === 'pacientes' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="text-brand-purple" /> Pacientes</h2>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-brand-purple"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{maxWidth: 300}}
              />
              <span className="text-gray-400 text-sm">{pacientesFiltrados.length} resultados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">Paciente</th>
                    <th className="py-2 px-4 text-left">Edad</th>
                    <th className="py-2 px-4 text-left">Turnos</th>
                    <th className="py-2 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.map(p => {
                    // Avatar automático con iniciales y color
                    const color = ['bg-brand-purple','bg-brand-orange','bg-emerald-500','bg-blue-400','bg-pink-400'][parseInt(p.id)%5];
                    const iniciales = p.nombre.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
                    // Edad
                    const edad = Math.floor((new Date().getTime() - new Date(p.fechaNacimiento).getTime()) / (1000*60*60*24*365.25));
                    // Turnos
                    const turnosPaciente = turnos.filter(t => t.pacienteId === p.id);
                    return (
                      <tr key={p.id} className="border-t hover:bg-brand-light/50 transition-colors">
                        <td className="py-2 px-4 flex items-center gap-3">
                          <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow ${color}`}>{iniciales}</span>
                          <span className="font-semibold">{p.nombre}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="inline-block bg-brand-light text-brand-purple px-2 py-0.5 rounded text-xs font-semibold">{edad} años</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">{turnosPaciente.length} turno{turnosPaciente.length!==1?'s':''}</span>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button
                            onClick={() => { setSelectedPaciente(p); setModalOpen(true); }}
                            className="p-2 rounded-full bg-brand-light hover:bg-brand-purple/20 text-brand-purple"
                            title="Ver/Editar historia clínica"
                          >
                            <Info size={18} />
                          </button>
                          <button
                            onClick={() => alert('Funcionalidad de editar próximamente.')}
                            className="p-2 rounded-full bg-brand-light hover:bg-brand-orange/20 text-brand-orange"
                            title="Editar paciente"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => alert('Funcionalidad de eliminar próximamente.')}
                            className="p-2 rounded-full bg-brand-light hover:bg-red-100 text-red-500"
                            title="Eliminar paciente"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {pacientesFiltrados.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-4 text-gray-400">No se encontraron pacientes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <HistoriaClinicaModal
              paciente={selectedPaciente || {}}
              turnos={selectedPaciente ? turnos.filter(t => t.pacienteId === selectedPaciente.id) : []}
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSave={guardarHistoria}
            />
          </div>
        )}
        {view === 'turnos' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CalendarCheck className="text-brand-orange" /> Turnos</h2>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Buscar por paciente, fecha o motivo..."
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-brand-purple"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{maxWidth: 300}}
              />
              <span className="text-gray-400 text-sm">{turnos.filter(t => {
                const paciente = pacientes.find(p => p.id === t.pacienteId);
                return (
                  paciente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                  t.fecha.includes(busqueda) ||
                  t.motivo.toLowerCase().includes(busqueda.toLowerCase())
                );
              }).length} resultados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">Paciente</th>
                    <th className="py-2 px-4 text-left">Fecha</th>
                    <th className="py-2 px-4 text-left">Motivo</th>
                    <th className="py-2 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {turnos.filter(t => {
                    const paciente = pacientes.find(p => p.id === t.pacienteId);
                    return (
                      paciente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                      t.fecha.includes(busqueda) ||
                      t.motivo.toLowerCase().includes(busqueda.toLowerCase())
                    );
                  }).map(t => {
                    const paciente = pacientes.find(p => p.id === t.pacienteId);
                    const color = ['bg-brand-purple','bg-brand-orange','bg-emerald-500','bg-blue-400','bg-pink-400'][parseInt(paciente?.id||'0')%5];
                    const iniciales = paciente?.nombre.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
                    return (
                      <tr key={t.id} className="border-t hover:bg-brand-light/50 transition-colors">
                        <td className="py-2 px-4 flex items-center gap-3">
                          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow ${color}`}>{iniciales}</span>
                          <span className="font-semibold">{paciente?.nombre}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="inline-block bg-brand-light text-brand-purple px-2 py-0.5 rounded text-xs font-semibold">{t.fecha}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="inline-block bg-orange-100 text-brand-orange px-2 py-0.5 rounded text-xs font-semibold">{t.motivo}</span>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button
                            onClick={() => alert('Funcionalidad de ver detalles próximamente.')}
                            className="p-2 rounded-full bg-brand-light hover:bg-brand-purple/20 text-brand-purple"
                            title="Ver detalles"
                          >
                            <Info size={18} />
                          </button>
                          <button
                            onClick={() => alert('Funcionalidad de editar turno próximamente.')}
                            className="p-2 rounded-full bg-brand-light hover:bg-brand-orange/20 text-brand-orange"
                            title="Editar turno"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => alert('Funcionalidad de eliminar turno próximamente.')}
                            className="p-2 rounded-full bg-brand-light hover:bg-red-100 text-red-500"
                            title="Eliminar turno"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {turnos.filter(t => {
                    const paciente = pacientes.find(p => p.id === t.pacienteId);
                    return (
                      paciente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                      t.fecha.includes(busqueda) ||
                      t.motivo.toLowerCase().includes(busqueda.toLowerCase())
                    );
                  }).length === 0 && (
                    <tr><td colSpan={4} className="text-center py-4 text-gray-400">No se encontraron turnos.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {view === 'historias' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FileText className="text-brand-purple" /> Historias Clínicas</h2>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre o diagnóstico..."
                className="px-4 py-2 border rounded focus:ring-2 focus:ring-brand-purple"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{maxWidth: 300}}
              />
              <span className="text-gray-400 text-sm">{pacientes.filter(p => 
                p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                (p.historiaClinica && p.historiaClinica.toLowerCase().includes(busqueda.toLowerCase()))
              ).length} resultados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">Paciente</th>
                    <th className="py-2 px-4 text-left">Edad</th>
                    <th className="py-2 px-4 text-left">Estado HC</th>
                    <th className="py-2 px-4 text-left">Última actualización</th>
                    <th className="py-2 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.filter(p => 
                    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                    (p.historiaClinica && p.historiaClinica.toLowerCase().includes(busqueda.toLowerCase()))
                  ).map(p => {
                    const color = ['bg-brand-purple','bg-brand-orange','bg-emerald-500','bg-blue-400','bg-pink-400'][parseInt(p.id)%5];
                    const iniciales = p.nombre.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
                    const edad = new Date().getFullYear() - new Date(p.fechaNacimiento).getFullYear();
                    const tieneHC = p.historiaClinica && p.historiaClinica.trim().length > 0;
                    const turnosCount = turnos.filter(t => t.pacienteId === p.id).length;
                    return (
                      <tr key={p.id} className="border-t hover:bg-brand-light/50 transition-colors">
                        <td className="py-2 px-4 flex items-center gap-3">
                          <span className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow ${color}`}>{iniciales}</span>
                          <span className="font-semibold">{p.nombre}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="text-gray-600">{edad} años</span>
                        </td>
                        <td className="py-2 px-4">
                          {tieneHC ? (
                            <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">Completa</span>
                          ) : (
                            <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-semibold">Pendiente</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          <span className="inline-block bg-brand-light text-brand-purple px-2 py-0.5 rounded text-xs font-semibold">{turnosCount} turnos</span>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedPaciente(p);
                              setModalOpen(true);
                            }}
                            className="p-2 rounded-full bg-brand-light hover:bg-brand-purple/20 text-brand-purple"
                            title="Ver/Editar historia clínica"
                          >
                            <FileText size={18} />
                          </button>
                          <button
                            onClick={() => alert('Funcionalidad de exportar HC próximamente.')}
                            className="p-2 rounded-full bg-brand-light hover:bg-brand-orange/20 text-brand-orange"
                            title="Exportar historia clínica"
                          >
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {pacientes.filter(p => 
                    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                    (p.historiaClinica && p.historiaClinica.toLowerCase().includes(busqueda.toLowerCase()))
                  ).length === 0 && (
                    <tr><td colSpan={5} className="text-center py-4 text-gray-400">No se encontraron historias clínicas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Fab onAddPaciente={handleAddPaciente} onAddTurno={handleAddTurno} />
    </div>
  );
};

export default SistemaDashboard;
