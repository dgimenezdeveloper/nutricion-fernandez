import React, { useState, useEffect, useMemo } from 'react';
import HistoriaClinicaModal from './HistoriaClinicaModal';
import { Users, CalendarCheck, FileText, LayoutDashboard, UserCircle, PlusCircle, Activity, Edit, Trash2, Info, Download, Menu, X, ChevronLeft, ChevronRight, Clock, Mail, Phone, Calendar, XCircle, RotateCcw, Send, CheckCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import TurnoModal from './TurnoModal';
import HistorialActividad from './HistorialActividad';
import PacienteFormModal from './PacienteFormModal';
import NotificationModal from './NotificationModal';

const pacientesDemo = [
  {
    id: '1', nombre: 'María González', fechaNacimiento: '1990-05-12', genero: 'Femenino',
    telefono: '+54 11 4567-8901', email: 'maria.gonzalez@email.com', obraSocial: 'OSDE', numeroAfiliado: '12345678',
    motivoConsulta: 'SIBO', antecedentesPatologicos: 'Gastritis crónica', medicacionActual: 'Omeprazol 20mg',
    alergiasAlimentarias: 'Mariscos', intolerancias: 'Lactosa',
    historiaClinica: JSON.stringify({ peso: '62', talla: '165', imc: '22.8', diagnosticoNutricional: 'Paciente con SIBO diagnosticado. Tratamiento funcional iniciado en 2024.', evolucionNotas: 'Mejoría notable en síntomas digestivos tras protocolo Low FODMAP.' })
  },
  {
    id: '2', nombre: 'Esteban Rodríguez', fechaNacimiento: '1985-11-23', genero: 'Masculino',
    telefono: '+54 11 5678-1234', email: 'esteban.r@email.com', obraSocial: 'Swiss Medical', numeroAfiliado: '87654321',
    motivoConsulta: 'Disbiosis intestinal', antecedentesPatologicos: '', medicacionActual: '',
    alergiasAlimentarias: '', intolerancias: 'Gluten',
    historiaClinica: JSON.stringify({ peso: '78', talla: '175', imc: '25.5', diagnosticoNutricional: 'Disbiosis intestinal. Dieta personalizada y suplementación.', evolucionNotas: 'Seguimiento mensual. Mejora gradual en marcadores.' })
  },
  {
    id: '3', nombre: 'Lucía Martínez', fechaNacimiento: '1997-03-08', genero: 'Femenino',
    telefono: '+54 11 3456-7890', email: 'lucia.m@email.com', obraSocial: 'Galeno', numeroAfiliado: '11223344',
    motivoConsulta: 'IMO', antecedentesPatologicos: 'Hipotiroidismo', medicacionActual: 'Levotiroxina 50mcg',
    alergiasAlimentarias: 'Frutos secos', intolerancias: 'Fructosa',
    historiaClinica: JSON.stringify({ peso: '55', talla: '160', imc: '21.5', diagnosticoNutricional: 'IMO. Protocolo Low FODMAP y control de síntomas.', evolucionNotas: 'Buena adherencia al plan alimentario.' })
  }
];

const turnosDemo: { id: string; pacienteId: string; fecha: string; hora: string; motivo: string; estado: string; nombreExterno?: string }[] = [
  { id: 't1', pacienteId: '1', fecha: '2025-12-15', hora: '08:30', motivo: 'Control SIBO', estado: 'confirmado' },
  { id: 't2', pacienteId: '2', fecha: '2025-12-16', hora: '09:00', motivo: 'Seguimiento disbiosis', estado: 'confirmado' },
  { id: 't3', pacienteId: '3', fecha: '2025-12-17', hora: '14:00', motivo: 'Consulta IMO', estado: 'confirmado' }
];

const STORAGE_KEYS = { pacientes: 'sistema_pacientes', turnos: 'sistema_turnos', cancelaciones: 'sistema_cancelaciones' };

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
};
const saveToStorage = (key: string, data: any) => { localStorage.setItem(key, JSON.stringify(data)); };

// Calendar helpers
const SCHEDULE: Record<number, { desde: string; hasta: string } | null> = {
  0: null, 1: null,
  2: { desde: '08:00', hasta: '12:00' },
  3: null,
  4: { desde: '08:00', hasta: '12:00' },
  5: { desde: '14:00', hasta: '18:00' },
  6: null,
};
const SLOT_DURATION_MIN = 30;
const DAY_NAMES_S = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES_S = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getMondayS(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function formatDateKeyS(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function generateSlotsS(desde: string, hasta: string): string[] {
  const slots: string[] = [];
  const [hS, mS] = desde.split(':').map(Number);
  const [hE, mE] = hasta.split(':').map(Number);
  let t = hS * 60 + mS;
  const end = hE * 60 + mE;
  while (t < end) { slots.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`); t += SLOT_DURATION_MIN; }
  return slots;
}

const menuItems = [
  { key: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { key: 'pacientes', label: 'Pacientes', icon: Users },
  { key: 'turnos', label: 'Turnos', icon: CalendarCheck },
  { key: 'historias', label: 'Historias Clínicas', icon: FileText }
];

const SistemaDashboard: React.FC = () => {
  const [view, setView] = useState('resumen');
  const [pacientes, setPacientes] = useState(() => loadFromStorage(STORAGE_KEYS.pacientes, pacientesDemo));
  const [turnos, setTurnos] = useState(() => loadFromStorage(STORAGE_KEYS.turnos, turnosDemo));
  const [cancelaciones, setCancelaciones] = useState<any[]>(() => loadFromStorage(STORAGE_KEYS.cancelaciones, []));
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [turnoTab, setTurnoTab] = useState<'hoy' | 'semana' | 'cancelaciones'>('hoy');
  const [turnoWeekStart, setTurnoWeekStart] = useState<Date>(() => getMondayS(new Date()));

  // Modals
  const [turnoModalOpen, setTurnoModalOpen] = useState(false);
  const [pacienteFormOpen, setPacienteFormOpen] = useState(false);
  const [pacienteFormMode, setPacienteFormMode] = useState<'crear' | 'editar'>('crear');
  const [editingPaciente, setEditingPaciente] = useState<any>(null);

  // Notification modal state
  const [notification, setNotification] = useState<{
    open: boolean; title: string; message: string;
    type: 'success' | 'warning' | 'info' | 'error';
    onConfirm?: () => void; showCancel?: boolean;
  }>({ open: false, title: '', message: '', type: 'info' });

  const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info', onConfirm?: () => void, showCancel = false) => {
    setNotification({ open: true, title, message, type, onConfirm, showCancel });
  };

  // Persist to localStorage
  useEffect(() => { saveToStorage(STORAGE_KEYS.pacientes, pacientes); }, [pacientes]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.turnos, turnos); }, [turnos]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.cancelaciones, cancelaciones); }, [cancelaciones]);

  const totalPacientes = pacientes.length;
  const totalTurnos = turnos.filter((t: any) => t.estado !== 'cancelado').length;
  const pacientesFiltrados = pacientes.filter((p: any) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  // === PACIENTE CRUD ===
  const handleAddPaciente = () => {
    setEditingPaciente(null);
    setPacienteFormMode('crear');
    setPacienteFormOpen(true);
  };

  const handleEditPaciente = (p: any) => {
    setEditingPaciente(p);
    setPacienteFormMode('editar');
    setPacienteFormOpen(true);
  };

  const handleSavePaciente = (data: any) => {
    if (pacienteFormMode === 'editar') {
      setPacientes((prev: any[]) => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
      showNotification('Paciente actualizado', `Los datos de ${data.nombre} se guardaron correctamente.`, 'success');
    } else {
      const newPaciente = { ...data, id: Date.now().toString(), historiaClinica: '' };
      setPacientes((prev: any[]) => [...prev, newPaciente]);
      showNotification('Paciente registrado', `${data.nombre} fue agregado/a exitosamente al sistema.`, 'success');
    }
  };

  const handleDeletePaciente = (p: any) => {
    showNotification(
      'Eliminar paciente',
      `¿Está segura que desea eliminar a ${p.nombre}? Se eliminarán también sus turnos asociados. Esta acción no se puede deshacer.`,
      'error',
      () => {
        setPacientes((prev: any[]) => prev.filter(pac => pac.id !== p.id));
        setTurnos((prev: any[]) => prev.filter(t => t.pacienteId !== p.id));
        showNotification('Paciente eliminado', `${p.nombre} fue eliminado/a del sistema.`, 'success');
      },
      true
    );
  };

  // === HISTORIA CLINICA ===
  const guardarHistoria = (historia: string) => {
    if (!selectedPaciente) return;
    setPacientes((prev: any[]) => prev.map(p => p.id === selectedPaciente.id ? { ...p, historiaClinica: historia } : p));
    setModalOpen(false);
    showNotification('Historia clínica guardada', `La historia clínica de ${selectedPaciente.nombre} se actualizó correctamente.`, 'success');
  };

  // === TURNOS ===
  const handleAddTurno = () => setTurnoModalOpen(true);

  const handleSubmitTurno = (data: any) => {
    const matchingPaciente = data.pacienteId
      ? pacientes.find((p: any) => p.id === data.pacienteId)
      : pacientes.find((p: any) => p.nombre.toLowerCase() === data.nombre.toLowerCase());
    const newTurno = {
      id: 't' + Date.now(),
      pacienteId: matchingPaciente?.id || '',
      fecha: data.fecha,
      hora: data.hora || '',
      motivo: data.motivo,
      estado: data.estado || 'confirmado',
      nombreExterno: matchingPaciente ? undefined : data.nombre,
    };
    setTurnos((prev: any[]) => [...prev, newTurno]);
    showNotification('Turno agendado', `Turno para ${matchingPaciente?.nombre || data.nombre} el ${data.fecha} a las ${data.hora || '-'} fue registrado exitosamente.`, 'success');
  };

  const handleDeleteTurno = (t: any) => {
    const paciente = pacientes.find((p: any) => p.id === t.pacienteId);
    showNotification(
      'Cancelar turno',
      `¿Desea cancelar el turno de ${paciente?.nombre || t.nombreExterno || 'paciente'} del ${t.fecha}${t.hora ? ' a las ' + t.hora : ''}?`,
      'warning',
      () => {
        setTurnos((prev: any[]) => prev.map(turno => turno.id === t.id ? { ...turno, estado: 'cancelado' } : turno));
        setCancelaciones((prev: any[]) => [...prev, {
          id: 'c' + Date.now(),
          turnoId: t.id,
          pacienteId: t.pacienteId,
          nombrePaciente: paciente?.nombre || t.nombreExterno || 'Paciente externo',
          email: paciente?.email || '',
          telefono: paciente?.telefono || '',
          fecha: t.fecha,
          hora: t.hora || '',
          motivo: t.motivo,
          fechaCancelacion: new Date().toISOString().split('T')[0],
          origen: 'admin',
          reprogramado: false,
        }]);
        showNotification('Turno cancelado', 'El turno fue cancelado y movido a la pestaña de cancelaciones.', 'success');
      },
      true
    );
  };

  // === EXPORT HC ===
  const handleExportHC = (p: any) => {
    try {
      let hcText = `HISTORIA CLÍNICA NUTRICIONAL\n${'='.repeat(40)}\nPaciente: ${p.nombre}\nFecha de nacimiento: ${p.fechaNacimiento}\n`;
      if (p.genero) hcText += `Género: ${p.genero}\n`;
      if (p.obraSocial) hcText += `Obra Social: ${p.obraSocial}\n`;
      if (p.motivoConsulta) hcText += `Motivo de consulta: ${p.motivoConsulta}\n`;
      if (p.antecedentesPatologicos) hcText += `Antecedentes: ${p.antecedentesPatologicos}\n`;
      if (p.medicacionActual) hcText += `Medicación: ${p.medicacionActual}\n`;
      if (p.alergiasAlimentarias) hcText += `Alergias: ${p.alergiasAlimentarias}\n`;
      if (p.intolerancias) hcText += `Intolerancias: ${p.intolerancias}\n`;
      hcText += `\n${'='.repeat(40)}\n`;
      if (p.historiaClinica) {
        try {
          const hcData = JSON.parse(p.historiaClinica);
          Object.entries(hcData).forEach(([key, value]) => {
            if (value) hcText += `${key}: ${value}\n`;
          });
        } catch {
          hcText += p.historiaClinica;
        }
      }
      const blob = new Blob([hcText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HC_${p.nombre.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Exportación exitosa', `La historia clínica de ${p.nombre} fue descargada.`, 'success');
    } catch {
      showNotification('Error', 'No se pudo exportar la historia clínica.', 'error');
    }
  };

  const navigateTo = (key: string) => {
    setView(key);
    setBusqueda('');
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-md flex items-center justify-between px-4 py-3">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-brand-light text-brand-gray" aria-label="Abrir menú">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white font-serif font-bold text-sm">SF</div>
          <span className="font-bold text-brand-gray text-sm">Sistema de Gestión</span>
        </div>
        <div className="w-10" />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-white shadow-xl flex flex-col p-6 gap-4 border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-brand-light text-brand-gray" aria-label="Cerrar menú">
          <X size={20} />
        </button>
        <div className="mb-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-brand-purple flex items-center justify-center text-white font-serif font-bold text-3xl mb-2 shadow-lg">SF</div>
          <div className="font-bold text-brand-gray text-lg tracking-wide">Sistema de Gestión</div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map(item => (
            <button key={item.key} onClick={() => navigateTo(item.key)} className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors min-h-[44px] ${view === item.key ? 'bg-brand-purple text-white shadow' : 'text-brand-gray hover:bg-brand-light'}`}>
              <item.icon size={20} className={view === item.key ? 'text-white' : 'text-brand-purple'} />
              {item.label}
            </button>
          ))}
        </nav>
        <a href="/" className="mt-auto text-sm text-brand-orange hover:underline py-2">Volver al sitio</a>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-10 pt-20 lg:pt-10 min-w-0">
        {/* ========== RESUMEN ========== */}
        {view === 'resumen' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2"><Activity className="text-brand-purple" /> Resumen General</h2>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <button className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center flex flex-col items-center hover:shadow-xl hover:ring-2 hover:ring-brand-purple transition-all group focus:outline-none" onClick={handleAddPaciente} title="Agregar Paciente">
                <Users size={28} className="text-brand-purple mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-purple">{totalPacientes}</div>
                <div className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Pacientes</div>
                <span className="mt-2 sm:mt-3 inline-flex items-center gap-1 text-xs text-brand-purple font-semibold bg-brand-light px-2 sm:px-3 py-1 rounded-full group-hover:bg-brand-purple group-hover:text-white transition-colors"><PlusCircle size={14}/> Agregar</span>
              </button>
              <button className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center flex flex-col items-center hover:shadow-xl hover:ring-2 hover:ring-brand-orange transition-all group focus:outline-none" onClick={handleAddTurno} title="Agregar Turno">
                <CalendarCheck size={28} className="text-brand-orange mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-orange">{totalTurnos}</div>
                <div className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Turnos activos</div>
                <span className="mt-2 sm:mt-3 inline-flex items-center gap-1 text-xs text-brand-orange font-semibold bg-orange-100 px-2 sm:px-3 py-1 rounded-full group-hover:bg-brand-orange group-hover:text-white transition-colors"><PlusCircle size={14}/> Agregar</span>
              </button>
              {/* KPIs de estados de turnos */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center flex flex-col items-center">
                <CheckCircle size={28} className="text-green-500 mb-2" />
                <div className="text-2xl font-extrabold text-green-600">{turnos.filter((t: any) => t.estado === 'confirmado').length}</div>
                <div className="text-gray-500 mt-1 text-sm">Confirmados</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center flex flex-col items-center">
                <XCircle size={28} className="text-red-500 mb-2" />
                <div className="text-2xl font-extrabold text-red-600">{turnos.filter((t: any) => t.estado === 'cancelado').length}</div>
                <div className="text-gray-500 mt-1 text-sm">Cancelados</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center flex flex-col items-center">
                <RotateCcw size={28} className="text-brand-purple mb-2" />
                <div className="text-2xl font-extrabold text-brand-purple">{cancelaciones.filter((c: any) => c.reprogramado).length}</div>
                <div className="text-gray-500 mt-1 text-sm">Reprogramados</div>
              </div>
            </div>
            {/* Accesos rápidos */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={handleAddTurno} className="bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-orange-500 transition-colors"><CalendarCheck size={18}/> Nuevo Turno</button>
              <button 
                onClick={() => {
                  setTurnoTab('semana');
                  setView('turnos');
                }}
                className="bg-brand-purple text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-brand-darkPurple transition-colors"
              >
                <Calendar size={18}/> Agenda semanal
              </button>
              <button onClick={handleAddPaciente} className="bg-brand-light text-brand-purple px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-brand-purple/10 transition-colors"><Users size={18}/> Nuevo Paciente</button>
            </div>
            {/* Próximos Turnos con color por estado */}
            <h3 className="font-bold text-lg mb-2">Próximos Turnos</h3>
            <ul className="bg-white rounded-xl shadow p-3 sm:p-4">
              {turnos.slice(0, 8).map((t: any) => {
                const paciente = pacientes.find((p: any) => p.id === t.pacienteId);
                const estado = t.estado || 'desconocido';
                let estadoColor = estado === 'confirmado' ? 'bg-green-100 text-green-700' : estado === 'cancelado' ? 'bg-red-100 text-red-600 line-through' : 'bg-brand-light text-brand-purple';
                let estadoLabel = typeof estado === 'string' ? (estado.charAt(0).toUpperCase() + estado.slice(1)) : 'Desconocido';
                return (
                  <li key={t.id} className={`py-3 border-b last:border-b-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 ${t.estado === 'cancelado' ? 'opacity-60' : ''}`}>
                    <span className="flex items-center gap-2 flex-wrap">
                      <UserCircle size={18} className="text-brand-purple flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">{paciente?.nombre || t.nombreExterno || 'Paciente externo'}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${estadoColor}`}>{t.fecha}{t.hora ? ` ${t.hora}` : ''}</span>
                    </span>
                    <span className="text-gray-500 text-sm font-medium pl-7 sm:pl-0">{t.motivo}</span>
                    <span className={`text-xs font-semibold ml-2 ${estadoColor}`}>{estadoLabel}</span>
                  </li>
                );
              })}
              {turnos.length === 0 && <li className="py-4 text-center text-gray-400">No hay turnos registrados.</li>}
            </ul>
            {/* Actividad reciente enriquecida */}
            <h3 className="font-bold text-lg mt-8 mb-2">Actividad Reciente</h3>
            <ul className="bg-white rounded-xl shadow p-3 sm:p-4 mb-8">
              {cancelaciones.slice(-5).reverse().map((c: any) => (
                <li key={c.id} className="py-3 border-b last:border-b-0 flex items-center gap-3">
                  {c.reprogramado ? <RotateCcw size={18} className="text-brand-purple" /> : <XCircle size={18} className="text-red-500" />}
                  <span className="font-semibold text-sm">{c.nombrePaciente}</span>
                  <span className="text-xs text-gray-500">{c.fecha} {c.hora}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-brand-light text-brand-purple">{c.reprogramado ? 'Reprogramado' : 'Cancelado'}</span>
                  <span className="text-xs text-gray-400 ml-auto">{c.fechaCancelacion}</span>
                </li>
              ))}
              {cancelaciones.length === 0 && <li className="py-4 text-center text-gray-400">Sin actividad reciente.</li>}
            </ul>
            <HistorialActividad />
          </div>
        )}

        {/* ========== PACIENTES ========== */}
        {view === 'pacientes' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><Users className="text-brand-purple" /> Pacientes</h2>
              <button onClick={handleAddPaciente} className="bg-brand-purple hover:bg-brand-darkPurple text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md text-sm">
                <PlusCircle size={18} /> Nuevo Paciente
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mb-4">
              <input type="text" placeholder="Buscar paciente..." className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-purple w-full sm:max-w-[300px]" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              <span className="text-gray-400 text-sm">{pacientesFiltrados.length} resultados</span>
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead><tr><th className="py-2 px-4 text-left">Paciente</th><th className="py-2 px-4 text-left">Edad</th><th className="py-2 px-4 text-left">Motivo</th><th className="py-2 px-4 text-left">Turnos</th><th className="py-2 px-4 text-left">Acciones</th></tr></thead>
                <tbody>
                  {pacientesFiltrados.map((p: any) => {
                    const color = ['bg-brand-purple','bg-brand-orange','bg-emerald-500','bg-blue-400','bg-pink-400'][parseInt(p.id)%5];
                    const iniciales = p.nombre.split(' ').map((n: string)=>n[0]).join('').toUpperCase().slice(0,2);
                    const edad = Math.floor((new Date().getTime() - new Date(p.fechaNacimiento).getTime()) / (1000*60*60*24*365.25));
                    const turnosPaciente = turnos.filter((t: any) => t.pacienteId === p.id);
                    return (
                      <tr key={p.id} className="border-t hover:bg-brand-light/50 transition-colors">
                        <td className="py-2 px-4 flex items-center gap-3"><span className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow ${color}`}>{iniciales}</span><span className="font-semibold">{p.nombre}</span></td>
                        <td className="py-2 px-4"><span className="inline-block bg-brand-light text-brand-purple px-2 py-0.5 rounded text-xs font-semibold">{edad} años</span></td>
                        <td className="py-2 px-4"><span className="text-gray-500 text-sm">{p.motivoConsulta || '-'}</span></td>
                        <td className="py-2 px-4"><span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">{turnosPaciente.length} turno{turnosPaciente.length!==1?'s':''}</span></td>
                        <td className="py-2 px-4 flex gap-2">
                          <button onClick={() => { setSelectedPaciente(p); setModalOpen(true); }} className="p-2 rounded-full bg-brand-light hover:bg-brand-purple/20 text-brand-purple" title="Ver/Editar HC"><Info size={18} /></button>
                          <button onClick={() => handleEditPaciente(p)} className="p-2 rounded-full bg-brand-light hover:bg-brand-orange/20 text-brand-orange" title="Editar paciente"><Edit size={18} /></button>
                          <button onClick={() => handleDeletePaciente(p)} className="p-2 rounded-full bg-brand-light hover:bg-red-100 text-red-500" title="Eliminar paciente"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                  {pacientesFiltrados.length === 0 && (<tr><td colSpan={5} className="text-center py-4 text-gray-400">No se encontraron pacientes.</td></tr>)}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {pacientesFiltrados.map((p: any) => {
                const color = ['bg-brand-purple','bg-brand-orange','bg-emerald-500','bg-blue-400','bg-pink-400'][parseInt(p.id)%5];
                const iniciales = p.nombre.split(' ').map((n: string)=>n[0]).join('').toUpperCase().slice(0,2);
                const edad = Math.floor((new Date().getTime() - new Date(p.fechaNacimiento).getTime()) / (1000*60*60*24*365.25));
                const turnosPaciente = turnos.filter((t: any) => t.pacienteId === p.id);
                return (
                  <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow flex-shrink-0 ${color}`}>{iniciales}</span>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.nombre}</div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <span className="inline-block bg-brand-light text-brand-purple px-2 py-0.5 rounded text-xs font-semibold">{edad} años</span>
                          <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">{turnosPaciente.length} turno{turnosPaciente.length!==1?'s':''}</span>
                          {p.motivoConsulta && <span className="inline-block bg-orange-100 text-brand-orange px-2 py-0.5 rounded text-xs font-semibold">{p.motivoConsulta}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setSelectedPaciente(p); setModalOpen(true); }} className="p-2.5 rounded-full bg-brand-light hover:bg-brand-purple/20 text-brand-purple" title="Ver/Editar HC"><Info size={18} /></button>
                      <button onClick={() => handleEditPaciente(p)} className="p-2.5 rounded-full bg-brand-light hover:bg-brand-orange/20 text-brand-orange" title="Editar"><Edit size={18} /></button>
                      <button onClick={() => handleDeletePaciente(p)} className="p-2.5 rounded-full bg-brand-light hover:bg-red-100 text-red-500" title="Eliminar"><Trash2 size={18} /></button>
                    </div>
                  </div>
                );
              })}
              {pacientesFiltrados.length === 0 && (<div className="text-center py-4 text-gray-400 bg-white rounded-xl shadow p-4">No se encontraron pacientes.</div>)}
            </div>
            <HistoriaClinicaModal paciente={selectedPaciente || {}} turnos={selectedPaciente ? turnos.filter((t: any) => t.pacienteId === selectedPaciente.id) : []} open={modalOpen} onClose={() => setModalOpen(false)} onSave={guardarHistoria} />
          </div>
        )}

        {/* ========== TURNOS ========== */}
        {view === 'turnos' && (() => {
          const todayKey = formatDateKeyS(new Date());
          const turnosActivos = turnos.filter((t: any) => t.estado !== 'cancelado');
          const turnosHoy = turnosActivos.filter((t: any) => t.fecha === todayKey).sort((a: any, b: any) => (a.hora || '').localeCompare(b.hora || ''));

          // Week calendar data
          const twDays: Date[] = [];
          for (let i = 0; i < 7; i++) { const d = new Date(turnoWeekStart); d.setDate(turnoWeekStart.getDate() + i); twDays.push(d); }
          const twEnd = twDays[6];
          const twLabel = `${twDays[0].getDate()} ${MONTH_NAMES_S[twDays[0].getMonth()].substring(0, 3)} - ${twEnd.getDate()} ${MONTH_NAMES_S[twEnd.getMonth()].substring(0, 3)}`;

          const handleReprogramar = (c: any) => {
            // Remove from cancelaciones and create new turno flow
            setCancelaciones((prev: any[]) => prev.map(canc => canc.id === c.id ? { ...canc, reprogramado: true } : canc));
            setTurnoModalOpen(true);
          };

          const handleContactWhatsApp = (c: any) => {
            const tel = (c.telefono || '').replace(/\D/g, '');
            const msg = encodeURIComponent(`Hola ${c.nombrePaciente}, te escribimos del consultorio de la Lic. Sabrina Fernandez. Tu turno del ${c.fecha}${c.hora ? ' a las ' + c.hora : ''} fue cancelado. ¿Podemos reprogramarlo?`);
            window.open(`https://wa.me/${tel}?text=${msg}`, '_blank');
          };

          const handleContactEmail = (c: any) => {
            const subject = encodeURIComponent('Reprogramación de turno - Lic. Sabrina Fernandez');
            const body = encodeURIComponent(`Estimado/a ${c.nombrePaciente},\n\nLe informamos que su turno del ${c.fecha}${c.hora ? ' a las ' + c.hora : ''} ha sido cancelado.\n\n¿Le gustaría reprogramar su cita?\n\nSaludos cordiales,\nLic. Sabrina B. Fernandez\nNutrición Funcional`);
            window.open(`mailto:${c.email}?subject=${subject}&body=${body}`, '_blank');
          };

          const handleDeleteCancelacion = (c: any) => {
            showNotification('Eliminar registro', `¿Eliminar el registro de cancelación de ${c.nombrePaciente}?`, 'warning',
              () => {
                setCancelaciones((prev: any[]) => prev.filter(canc => canc.id !== c.id));
                showNotification('Registro eliminado', 'El registro de cancelación fue eliminado.', 'success');
              }, true);
          };

          return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><CalendarCheck className="text-brand-orange" /> Turnos</h2>
              <button onClick={handleAddTurno} className="bg-brand-orange hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md text-sm">
                <PlusCircle size={18} /> Nuevo Turno
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
              <button onClick={() => setTurnoTab('hoy')} className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${turnoTab === 'hoy' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Clock size={16} /> Turnos del Día
                {turnosHoy.length > 0 && <span className="bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full">{turnosHoy.length}</span>}
              </button>
              <button onClick={() => setTurnoTab('semana')} className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${turnoTab === 'semana' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Calendar size={16} /> Calendario Semanal
              </button>
              <button onClick={() => setTurnoTab('cancelaciones')} className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${turnoTab === 'cancelaciones' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <XCircle size={16} /> Cancelaciones
                {cancelaciones.filter((c: any) => !c.reprogramado).length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{cancelaciones.filter((c: any) => !c.reprogramado).length}</span>}
              </button>
            </div>

            {/* TAB: Turnos del día */}
            {turnoTab === 'hoy' && (
              <div>
                <div className="bg-brand-purple/5 rounded-xl p-4 mb-4 flex items-center gap-3">
                  <Calendar size={20} className="text-brand-purple" />
                  <span className="font-semibold text-brand-gray">
                    Hoy, {new Date().getDate()} de {MONTH_NAMES_S[new Date().getMonth()]} de {new Date().getFullYear()}
                  </span>
                  <span className="text-sm text-gray-500 ml-auto">{turnosHoy.length} turno{turnosHoy.length !== 1 ? 's' : ''}</span>
                </div>
                {turnosHoy.length > 0 ? (
                  <div className="space-y-3">
                    {turnosHoy.map((t: any) => {
                      const paciente = pacientes.find((p: any) => p.id === t.pacienteId);
                      const color = ['bg-brand-purple','bg-brand-orange','bg-emerald-500','bg-blue-400','bg-pink-400'][parseInt(paciente?.id||'0')%5];
                      const iniciales = paciente?.nombre?.split(' ').map((n: string)=>n[0]).join('').toUpperCase().slice(0,2) || '??';
                      return (
                        <div key={t.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                          <div className="text-center bg-brand-purple text-white rounded-xl px-3 py-2 min-w-[60px]">
                            <div className="text-lg font-black">{t.hora || '--:--'}</div>
                            <div className="text-[10px] opacity-80">hs</div>
                          </div>
                          <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow flex-shrink-0 ${color}`}>{iniciales}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{paciente?.nombre || t.nombreExterno || 'Paciente externo'}</div>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              <span className="inline-block bg-orange-100 text-brand-orange px-2 py-0.5 rounded text-xs font-semibold">{t.motivo}</span>
                              {paciente?.telefono && <span className="text-xs text-gray-400 flex items-center gap-1"><Phone size={12} />{paciente.telefono}</span>}
                            </div>
                          </div>
                          <button onClick={() => handleDeleteTurno(t)} className="p-2 rounded-full bg-brand-light hover:bg-red-100 text-red-500 flex-shrink-0" title="Cancelar turno"><XCircle size={18} /></button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                    <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No hay turnos para hoy</p>
                    <p className="text-sm mt-1">Los turnos agendados para hoy aparecerán aquí</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Calendario semanal */}
            {turnoTab === 'semana' && (
              <div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button onClick={() => { const p = new Date(turnoWeekStart); p.setDate(p.getDate() - 7); setTurnoWeekStart(p); }}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-brand-light transition-colors"><ChevronLeft size={18} /></button>
                  <div className="bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <Calendar size={16} /> {twLabel}
                  </div>
                  <button onClick={() => { const n = new Date(turnoWeekStart); n.setDate(n.getDate() + 7); setTurnoWeekStart(n); }}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-brand-light transition-colors"><ChevronRight size={18} /></button>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="grid grid-cols-7 min-w-[700px] border border-gray-200 rounded-xl overflow-hidden">
                    {twDays.map((day, i) => {
                      const isToday = formatDateKeyS(day) === todayKey;
                      return (
                        <div key={i} className={`text-center py-2.5 border-b border-r last:border-r-0 font-bold text-sm ${isToday ? 'bg-brand-purple text-white' : 'bg-gray-50 text-brand-gray'}`}>
                          <div>{DAY_NAMES_S[day.getDay()]}</div>
                          <div className="text-xs font-normal mt-0.5 opacity-80">{day.getDate()} {MONTH_NAMES_S[day.getMonth()].substring(0, 3)}</div>
                        </div>
                      );
                    })}
                    {twDays.map((day, i) => {
                      const schedule = SCHEDULE[day.getDay()];
                      const dateKey = formatDateKeyS(day);
                      const dayTurnos = turnosActivos.filter((t: any) => t.fecha === dateKey);

                      if (!schedule) {
                        return (
                          <div key={`s-${i}`} className="border-r last:border-r-0 bg-gray-50/50 flex items-start justify-center pt-4 min-h-[180px]">
                            <span className="text-xs text-gray-300 font-medium bg-gray-100 px-3 py-1 rounded-full">No atiende</span>
                          </div>
                        );
                      }

                      const slots = generateSlotsS(schedule.desde, schedule.hasta);
                      return (
                        <div key={`s-${i}`} className="border-r last:border-r-0 flex flex-col">
                          {slots.map(time => {
                            const turnoEnSlot = dayTurnos.find((t: any) => t.hora === time);
                            const pacienteSlot = turnoEnSlot ? pacientes.find((p: any) => p.id === turnoEnSlot.pacienteId) : null;
                            return (
                              <div key={time} className={`py-2 px-1 text-xs border-b last:border-b-0 text-center ${
                                turnoEnSlot ? 'bg-brand-purple/10 text-brand-purple font-semibold' : 'text-gray-400'
                              }`}>
                                <div>{time}</div>
                                {turnoEnSlot && (
                                  <div className="text-[10px] truncate max-w-full mt-0.5" title={pacienteSlot?.nombre || turnoEnSlot.nombreExterno}>
                                    {pacienteSlot?.nombre?.split(' ')[0] || turnoEnSlot.nombreExterno?.split(' ')[0] || 'Ocupado'}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Cancelaciones */}
            {turnoTab === 'cancelaciones' && (
              <div>
                {cancelaciones.length > 0 ? (
                  <div className="space-y-3">
                    {cancelaciones.sort((a: any, b: any) => b.fechaCancelacion?.localeCompare(a.fechaCancelacion || '')).map((c: any) => (
                      <div key={c.id} className={`bg-white rounded-xl shadow p-4 border-l-4 ${c.reprogramado ? 'border-emerald-400' : 'border-red-400'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">{c.nombrePaciente}</span>
                              {c.reprogramado
                                ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Reprogramado</span>
                                : <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Cancelado</span>
                              }
                              <span className="text-xs text-gray-400">{c.origen === 'paciente' ? '(por paciente)' : '(por admin)'}</span>
                            </div>
                            <div className="flex gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1"><Calendar size={12} /> {c.fecha}{c.hora ? ` ${c.hora}` : ''}</span>
                              <span>{c.motivo}</span>
                              {c.motivoCancelacion && <span className="italic text-gray-400">"{c.motivoCancelacion}"</span>}
                            </div>
                            {(c.email || c.telefono) && (
                              <div className="flex gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                                {c.email && <span className="flex items-center gap-1"><Mail size={11} /> {c.email}</span>}
                                {c.telefono && <span className="flex items-center gap-1"><Phone size={11} /> {c.telefono}</span>}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {!c.reprogramado && (
                              <>
                                {c.telefono && (
                                  <button onClick={() => handleContactWhatsApp(c)} className="p-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600" title="Contactar por WhatsApp">
                                    <FaWhatsapp size={18} />
                                  </button>
                                )}
                                {c.email && (
                                  <button onClick={() => handleContactEmail(c)} className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600" title="Contactar por Email">
                                    <Mail size={18} />
                                  </button>
                                )}
                                <button onClick={() => handleReprogramar(c)} className="p-2.5 rounded-full bg-brand-light hover:bg-brand-purple/20 text-brand-purple" title="Reprogramar turno">
                                  <RotateCcw size={18} />
                                </button>
                              </>
                            )}
                            <button onClick={() => handleDeleteCancelacion(c)} className="p-2.5 rounded-full bg-brand-light hover:bg-red-100 text-red-500" title="Eliminar registro">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                    <XCircle size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No hay cancelaciones</p>
                    <p className="text-sm mt-1">Los turnos cancelados aparecerán aquí</p>
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })()}

        {/* ========== HISTORIAS CLÍNICAS ========== */}
        {view === 'historias' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2"><FileText className="text-brand-purple" /> Historias Clínicas</h2>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mb-4">
              <input type="text" placeholder="Buscar por nombre o diagnóstico..." className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-purple w-full sm:max-w-[300px]" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              <span className="text-gray-400 text-sm">{pacientes.filter((p: any) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.historiaClinica && p.historiaClinica.toLowerCase().includes(busqueda.toLowerCase()))).length} resultados</span>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead><tr><th className="py-2 px-4 text-left">Paciente</th><th className="py-2 px-4 text-left">Edad</th><th className="py-2 px-4 text-left">Estado HC</th><th className="py-2 px-4 text-left">Última act.</th><th className="py-2 px-4 text-left">Acciones</th></tr></thead>
                <tbody>
                  {pacientes.filter((p: any) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.historiaClinica && p.historiaClinica.toLowerCase().includes(busqueda.toLowerCase()))).map((p: any) => {
                    const color = ['bg-brand-purple','bg-brand-orange','bg-emerald-500','bg-blue-400','bg-pink-400'][parseInt(p.id)%5];
                    const iniciales = p.nombre.split(' ').map((n: string)=>n[0]).join('').toUpperCase().slice(0,2);
                    const edad = new Date().getFullYear() - new Date(p.fechaNacimiento).getFullYear();
                    const tieneHC = p.historiaClinica && p.historiaClinica.trim().length > 0;
                    const turnosCount = turnos.filter((t: any) => t.pacienteId === p.id).length;
                    return (
                      <tr key={p.id} className="border-t hover:bg-brand-light/50 transition-colors">
                        <td className="py-2 px-4 flex items-center gap-3"><span className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow ${color}`}>{iniciales}</span><span className="font-semibold">{p.nombre}</span></td>
                        <td className="py-2 px-4"><span className="text-gray-600">{edad} años</span></td>
                        <td className="py-2 px-4">{tieneHC ? (<span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">Completa</span>) : (<span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-semibold">Pendiente</span>)}</td>
                        <td className="py-2 px-4"><span className="inline-block bg-brand-light text-brand-purple px-2 py-0.5 rounded text-xs font-semibold">{turnosCount} turnos</span></td>
                        <td className="py-2 px-4 flex gap-2">
                          <button onClick={() => { setSelectedPaciente(p); setModalOpen(true); }} className="p-2 rounded-full bg-brand-light hover:bg-brand-purple/20 text-brand-purple" title="Ver/Editar HC"><FileText size={18} /></button>
                          <button onClick={() => handleExportHC(p)} className="p-2 rounded-full bg-brand-light hover:bg-brand-orange/20 text-brand-orange" title="Exportar HC"><Download size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                  {pacientes.filter((p: any) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.historiaClinica && p.historiaClinica.toLowerCase().includes(busqueda.toLowerCase()))).length === 0 && (<tr><td colSpan={5} className="text-center py-4 text-gray-400">No se encontraron historias clínicas.</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {pacientes.filter((p: any) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.historiaClinica && p.historiaClinica.toLowerCase().includes(busqueda.toLowerCase()))).map((p: any) => {
                const color = ['bg-brand-purple','bg-brand-orange','bg-emerald-500','bg-blue-400','bg-pink-400'][parseInt(p.id)%5];
                const iniciales = p.nombre.split(' ').map((n: string)=>n[0]).join('').toUpperCase().slice(0,2);
                const edad = new Date().getFullYear() - new Date(p.fechaNacimiento).getFullYear();
                const tieneHC = p.historiaClinica && p.historiaClinica.trim().length > 0;
                const turnosCount = turnos.filter((t: any) => t.pacienteId === p.id).length;
                return (
                  <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow flex-shrink-0 ${color}`}>{iniciales}</span>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.nombre}</div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <span className="text-gray-600 text-xs">{edad} años</span>
                          {tieneHC ? (<span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">HC Completa</span>) : (<span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-semibold">HC Pendiente</span>)}
                          <span className="inline-block bg-brand-light text-brand-purple px-2 py-0.5 rounded text-xs font-semibold">{turnosCount} turnos</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setSelectedPaciente(p); setModalOpen(true); }} className="p-2.5 rounded-full bg-brand-light hover:bg-brand-purple/20 text-brand-purple" title="Ver/Editar HC"><FileText size={18} /></button>
                      <button onClick={() => handleExportHC(p)} className="p-2.5 rounded-full bg-brand-light hover:bg-brand-orange/20 text-brand-orange" title="Exportar HC"><Download size={18} /></button>
                    </div>
                  </div>
                );
              })}
              {pacientes.filter((p: any) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.historiaClinica && p.historiaClinica.toLowerCase().includes(busqueda.toLowerCase()))).length === 0 && (<div className="text-center py-4 text-gray-400 bg-white rounded-xl shadow p-4">No se encontraron historias clínicas.</div>)}
            </div>
            <HistoriaClinicaModal paciente={selectedPaciente || {}} turnos={selectedPaciente ? turnos.filter((t: any) => t.pacienteId === selectedPaciente.id) : []} open={modalOpen} onClose={() => setModalOpen(false)} onSave={guardarHistoria} />
          </div>
        )}
      </main>

      {/* Modals */}
      <TurnoModal open={turnoModalOpen} onClose={() => setTurnoModalOpen(false)} onSubmit={handleSubmitTurno} pacientes={pacientes} turnos={turnos} />
      <PacienteFormModal open={pacienteFormOpen} onClose={() => setPacienteFormOpen(false)} onSave={handleSavePaciente} paciente={editingPaciente} mode={pacienteFormMode} />
      <NotificationModal
        open={notification.open}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onConfirm={notification.onConfirm}
        showCancel={notification.showCancel}
      />
    </div>
  );
};

export default SistemaDashboard;
