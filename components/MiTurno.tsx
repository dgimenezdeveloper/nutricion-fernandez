import React, { useState } from 'react';
import { Search, Calendar, Clock, XCircle, RotateCcw, CheckCircle, ChevronLeft, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';

// Schedule config (same as BookingModal)
const SCHEDULE: Record<number, { desde: string; hasta: string } | null> = {
  0: null, 1: null,
  2: { desde: '08:00', hasta: '12:00' },
  3: null,
  4: { desde: '08:00', hasta: '12:00' },
  5: { desde: '14:00', hasta: '18:00' },
  6: null,
};
const SLOT_DURATION_MIN = 30;
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function generateSlots(desde: string, hasta: string): string[] {
  const slots: string[] = [];
  const [hS, mS] = desde.split(':').map(Number);
  const [hE, mE] = hasta.split(':').map(Number);
  let t = hS * 60 + mS;
  const end = hE * 60 + mE;
  while (t < end) { slots.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`); t += SLOT_DURATION_MIN; }
  return slots;
}

const MiTurno: React.FC = () => {
  const [step, setStep] = useState<'buscar' | 'resultados' | 'cancelar' | 'reprogramar' | 'exito'>('buscar');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [foundTurnos, setFoundTurnos] = useState<any[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [exitoMsg, setExitoMsg] = useState('');

  // Reprogramar state
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newTime, setNewTime] = useState('');

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const bookings: any[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    const turnos: any[] = JSON.parse(localStorage.getItem('sistema_turnos') || '[]');
    const pacientes: any[] = JSON.parse(localStorage.getItem('sistema_pacientes') || '[]');

    // Search in bookings (from BookingModal)
    const matchBookings = bookings.filter((b: any) =>
      b.email?.toLowerCase() === email.toLowerCase() &&
      b.name?.toLowerCase().includes(nombre.toLowerCase())
    ).map((b: any) => ({
      id: 'b_' + b.createdAt,
      source: 'booking',
      nombre: b.name,
      email: b.email,
      telefono: b.phone,
      fecha: b.fecha,
      hora: b.hora || '',
      motivo: b.reason,
      estado: 'confirmado',
      raw: b,
    }));

    // Search in sistema_turnos (from admin)
    const matchTurnos = turnos.filter((t: any) => {
      const pac = pacientes.find((p: any) => p.id === t.pacienteId);
      return pac &&
        pac.email?.toLowerCase() === email.toLowerCase() &&
        pac.nombre?.toLowerCase().includes(nombre.toLowerCase()) &&
        t.estado !== 'cancelado';
    }).map((t: any) => {
      const pac = pacientes.find((p: any) => p.id === t.pacienteId);
      return {
        id: t.id,
        source: 'sistema',
        nombre: pac?.nombre || '',
        email: pac?.email || '',
        telefono: pac?.telefono || '',
        fecha: t.fecha,
        hora: t.hora || '',
        motivo: t.motivo,
        estado: t.estado || 'confirmado',
        pacienteId: t.pacienteId,
        raw: t,
      };
    });

    const all = [...matchBookings, ...matchTurnos].filter(t => t.estado !== 'cancelado');

    if (all.length === 0) {
      setError('No se encontraron turnos con esos datos. Verificá tu nombre y email.');
      return;
    }

    setFoundTurnos(all);
    setStep('resultados');
  };

  const handleCancelar = () => {
    if (!selectedTurno) return;

    if (selectedTurno.source === 'booking') {
      // Mark in bookings
      const bookings: any[] = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updated = bookings.filter((b: any) => 'b_' + b.createdAt !== selectedTurno.id);
      localStorage.setItem('bookings', JSON.stringify(updated));
      // Free the slot
      const bookedSlots: Record<string, string[]> = JSON.parse(localStorage.getItem('booked_slots') || '{}');
      if (bookedSlots[selectedTurno.fecha]) {
        bookedSlots[selectedTurno.fecha] = bookedSlots[selectedTurno.fecha].filter((s: string) => s !== selectedTurno.hora);
        localStorage.setItem('booked_slots', JSON.stringify(bookedSlots));
      }
    } else {
      // Mark in sistema_turnos
      const turnos: any[] = JSON.parse(localStorage.getItem('sistema_turnos') || '[]');
      const updated = turnos.map((t: any) => t.id === selectedTurno.id ? { ...t, estado: 'cancelado' } : t);
      localStorage.setItem('sistema_turnos', JSON.stringify(updated));
    }

    // Add to cancelaciones
    const cancelaciones: any[] = JSON.parse(localStorage.getItem('sistema_cancelaciones') || '[]');
    cancelaciones.push({
      id: 'c' + Date.now(),
      turnoId: selectedTurno.id,
      pacienteId: selectedTurno.pacienteId || '',
      nombrePaciente: selectedTurno.nombre,
      email: selectedTurno.email,
      telefono: selectedTurno.telefono,
      fecha: selectedTurno.fecha,
      hora: selectedTurno.hora,
      motivo: selectedTurno.motivo,
      motivoCancelacion,
      fechaCancelacion: new Date().toISOString().split('T')[0],
      origen: 'paciente',
      reprogramado: false,
    });
    localStorage.setItem('sistema_cancelaciones', JSON.stringify(cancelaciones));

    setExitoMsg('Tu turno ha sido cancelado exitosamente. La profesional será notificada.');
    setStep('exito');
  };

  const handleReprogramar = () => {
    if (!selectedTurno || !newDate || !newTime) return;

    const newDateKey = formatDateKey(newDate);

    // Cancel old turno
    if (selectedTurno.source === 'booking') {
      const bookings: any[] = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updated = bookings.map((b: any) =>
        'b_' + b.createdAt === selectedTurno.id ? { ...b, fecha: newDateKey, hora: newTime } : b
      );
      localStorage.setItem('bookings', JSON.stringify(updated));
      // Update booked slots
      const bookedSlots: Record<string, string[]> = JSON.parse(localStorage.getItem('booked_slots') || '{}');
      if (bookedSlots[selectedTurno.fecha]) {
        bookedSlots[selectedTurno.fecha] = bookedSlots[selectedTurno.fecha].filter((s: string) => s !== selectedTurno.hora);
      }
      if (!bookedSlots[newDateKey]) bookedSlots[newDateKey] = [];
      bookedSlots[newDateKey].push(newTime);
      localStorage.setItem('booked_slots', JSON.stringify(bookedSlots));
    } else {
      const turnos: any[] = JSON.parse(localStorage.getItem('sistema_turnos') || '[]');
      const updated = turnos.map((t: any) =>
        t.id === selectedTurno.id ? { ...t, fecha: newDateKey, hora: newTime } : t
      );
      localStorage.setItem('sistema_turnos', JSON.stringify(updated));
    }

    // Add to cancelaciones as reprogrammed
    const cancelaciones: any[] = JSON.parse(localStorage.getItem('sistema_cancelaciones') || '[]');
    cancelaciones.push({
      id: 'c' + Date.now(),
      turnoId: selectedTurno.id,
      pacienteId: selectedTurno.pacienteId || '',
      nombrePaciente: selectedTurno.nombre,
      email: selectedTurno.email,
      telefono: selectedTurno.telefono,
      fecha: selectedTurno.fecha,
      hora: selectedTurno.hora,
      motivo: selectedTurno.motivo,
      motivoCancelacion: `Reprogramado a ${newDateKey} ${newTime}`,
      fechaCancelacion: new Date().toISOString().split('T')[0],
      origen: 'paciente',
      reprogramado: true,
    });
    localStorage.setItem('sistema_cancelaciones', JSON.stringify(cancelaciones));

    setExitoMsg(`Tu turno fue reprogramado para el ${DAY_NAMES_FULL[newDate.getDay()]} ${newDate.getDate()} de ${MONTH_NAMES[newDate.getMonth()]} a las ${newTime} hs.`);
    setStep('exito');
  };

  // Calendar for reprogramar
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); weekDays.push(d); }
  const weekEnd = weekDays[6];
  const weekLabel = `${weekDays[0].getDate()} ${MONTH_NAMES[weekDays[0].getMonth()].substring(0, 3)} - ${weekEnd.getDate()} ${MONTH_NAMES[weekEnd.getMonth()].substring(0, 3)}`;

  // Get all occupied slots
  const getOccupied = (): Record<string, string[]> => {
    const occupied: Record<string, string[]> = {};
    const bookedSlots: Record<string, string[]> = JSON.parse(localStorage.getItem('booked_slots') || '{}');
    Object.entries(bookedSlots).forEach(([k, v]) => { occupied[k] = [...(v as string[])]; });
    const turnos: any[] = JSON.parse(localStorage.getItem('sistema_turnos') || '[]');
    turnos.filter((t: any) => t.estado !== 'cancelado' && t.hora).forEach((t: any) => {
      if (!occupied[t.fecha]) occupied[t.fecha] = [];
      if (!occupied[t.fecha].includes(t.hora)) occupied[t.fecha].push(t.hora);
    });
    return occupied;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-serif font-bold text-lg shadow">SF</div>
            <div>
              <div className="font-bold text-brand-gray">Lic. Sabrina B. Fernandez</div>
              <div className="text-xs text-gray-400">Nutrición Funcional</div>
            </div>
          </div>
          <a href="/" className="text-sm text-brand-purple hover:underline flex items-center gap-1"><ArrowLeft size={14} /> Volver al sitio</a>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-purple text-center mb-2">Gestión de Mi Turno</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Cancelá o reprogramá tu turno de forma rápida y sencilla</p>

        {/* STEP: Buscar */}
        {step === 'buscar' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-gray mb-4 flex items-center gap-2"><Search size={20} className="text-brand-purple" /> Buscá tu turno</h2>
            <p className="text-sm text-gray-500 mb-6">Ingresá el nombre y email con el que reservaste tu turno para encontrarlo.</p>
            <form onSubmit={handleBuscar} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-brand-gray">Nombre completo</label>
                <input required type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none bg-brand-light/50 placeholder:text-gray-400"
                  placeholder="El nombre con el que reservaste" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-brand-gray">Email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none bg-brand-light/50 placeholder:text-gray-400"
                  placeholder="tu@email.com" />
              </div>
              {error && (
                <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <button type="submit" className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 text-lg">
                <Search size={20} /> Buscar mi turno
              </button>
            </form>
          </div>
        )}

        {/* STEP: Resultados */}
        {step === 'resultados' && (
          <div className="space-y-4">
            <button onClick={() => { setStep('buscar'); setFoundTurnos([]); }}
              className="text-sm text-brand-purple hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft size={14} /> Volver a buscar
            </button>
            <h2 className="text-lg font-bold text-brand-gray mb-2">Tus turnos encontrados ({foundTurnos.length})</h2>
            {foundTurnos.map(t => (
              <div key={t.id} className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-brand-purple">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-brand-gray">{t.nombre}</div>
                    <div className="flex gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {t.fecha}</span>
                      {t.hora && <span className="flex items-center gap-1"><Clock size={14} /> {t.hora} hs</span>}
                      <span className="bg-orange-100 text-brand-orange px-2 py-0.5 rounded text-xs font-semibold">{t.motivo}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedTurno(t); setStep('reprogramar'); setNewDate(null); setNewTime(''); setWeekStart(getMonday(new Date())); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-purple text-white font-semibold text-sm hover:bg-purple-700 transition-colors">
                      <RotateCcw size={16} /> Reprogramar
                    </button>
                    <button onClick={() => { setSelectedTurno(t); setMotivoCancelacion(''); setStep('cancelar'); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors">
                      <XCircle size={16} /> Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP: Cancelar */}
        {step === 'cancelar' && selectedTurno && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <button onClick={() => setStep('resultados')} className="text-sm text-brand-purple hover:underline flex items-center gap-1 mb-4">
              <ArrowLeft size={14} /> Volver
            </button>
            <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2"><XCircle size={20} /> Cancelar turno</h2>
            <div className="bg-red-50 rounded-xl p-4 mb-4">
              <div className="font-semibold">{selectedTurno.nombre}</div>
              <div className="text-sm text-gray-600 mt-1">
                {selectedTurno.fecha}{selectedTurno.hora ? ` a las ${selectedTurno.hora} hs` : ''} — {selectedTurno.motivo}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1 text-brand-gray">Motivo de cancelación (opcional)</label>
              <textarea value={motivoCancelacion} onChange={e => setMotivoCancelacion(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-400 outline-none bg-red-50/50 placeholder:text-gray-400"
                rows={3} placeholder="¿Por qué cancelás tu turno?" />
            </div>
            <button onClick={handleCancelar}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 text-lg">
              <XCircle size={20} /> Confirmar cancelación
            </button>
          </div>
        )}

        {/* STEP: Reprogramar */}
        {step === 'reprogramar' && selectedTurno && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <button onClick={() => setStep('resultados')} className="text-sm text-brand-purple hover:underline flex items-center gap-1 mb-4">
              <ArrowLeft size={14} /> Volver
            </button>
            <h2 className="text-lg font-bold text-brand-purple mb-2 flex items-center gap-2"><RotateCcw size={20} /> Reprogramar turno</h2>
            <div className="bg-brand-light rounded-xl p-3 mb-4 text-sm">
              <span className="font-semibold">Turno actual:</span> {selectedTurno.fecha}{selectedTurno.hora ? ` ${selectedTurno.hora}` : ''} — {selectedTurno.motivo}
            </div>

            <p className="text-sm text-gray-500 mb-3">Seleccioná un nuevo horario:</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <button onClick={() => { const p = new Date(weekStart); p.setDate(p.getDate() - 7); if (p >= getMonday(new Date())) setWeekStart(p); }}
                disabled={weekStart <= getMonday(new Date())}
                className="p-2 rounded-lg border border-gray-200 hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>
              <div className="bg-brand-purple text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                <Calendar size={14} /> {weekLabel}
              </div>
              <button onClick={() => { const n = new Date(weekStart); n.setDate(n.getDate() + 7); const max = new Date(); max.setDate(max.getDate() + 56); if (n <= max) setWeekStart(n); }}
                className="p-2 rounded-lg border border-gray-200 hover:bg-brand-light transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              {(() => {
                const occupied = getOccupied();
                return (
                  <div className="grid grid-cols-7 min-w-[600px] border border-gray-200 rounded-xl overflow-hidden">
                    {weekDays.map((day, i) => {
                      const isToday = formatDateKey(day) === formatDateKey(new Date());
                      return (
                        <div key={i} className={`text-center py-2 border-b border-r last:border-r-0 font-bold text-xs ${isToday ? 'bg-brand-purple text-white' : 'bg-gray-50 text-brand-gray'}`}>
                          <div>{DAY_NAMES[day.getDay()]}</div>
                          <div className="font-normal mt-0.5 opacity-80">{day.getDate()}</div>
                        </div>
                      );
                    })}
                    {weekDays.map((day, i) => {
                      const schedule = SCHEDULE[day.getDay()];
                      const isPast = day < today;
                      const dateKey = formatDateKey(day);
                      const dayOcc = occupied[dateKey] || [];

                      if (!schedule || isPast) {
                        return (
                          <div key={`s-${i}`} className="border-r last:border-r-0 bg-gray-50/50 flex items-start justify-center pt-3 min-h-[140px]">
                            <span className="text-[10px] text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full">No atiende</span>
                          </div>
                        );
                      }

                      const slots = generateSlots(schedule.desde, schedule.hasta);
                      return (
                        <div key={`s-${i}`} className="border-r last:border-r-0 flex flex-col">
                          {slots.map(time => {
                            const isOcc = dayOcc.includes(time);
                            const isNow = formatDateKey(day) === formatDateKey(new Date());
                            const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
                            const [sh, sm] = time.split(':').map(Number);
                            const isPastSlot = isNow && sh * 60 + sm <= nowMin;
                            const isSelected = newDate && formatDateKey(newDate) === dateKey && newTime === time;

                            return (
                              <button key={time} disabled={isOcc || isPastSlot}
                                onClick={() => { setNewDate(day); setNewTime(time); }}
                                className={`py-2 px-1 text-xs border-b last:border-b-0 transition-all text-center ${
                                  isSelected ? 'bg-brand-purple text-white font-bold' :
                                  isOcc ? 'bg-red-50 text-red-300 line-through cursor-not-allowed' :
                                  isPastSlot ? 'bg-gray-50 text-gray-300 cursor-not-allowed' :
                                  'hover:bg-brand-purple/10 text-gray-700 cursor-pointer'
                                }`}>
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {newDate && newTime && (
              <div className="mt-4 bg-brand-light rounded-xl p-4 text-center">
                <p className="text-sm text-brand-gray">
                  Nuevo horario: <strong>{DAY_NAMES_FULL[newDate.getDay()]} {newDate.getDate()} de {MONTH_NAMES[newDate.getMonth()]}</strong> a las <strong>{newTime} hs</strong>
                </p>
                <button onClick={handleReprogramar}
                  className="mt-3 bg-brand-purple hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex mx-auto items-center gap-2">
                  <CheckCircle size={20} /> Confirmar reprogramación
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP: Éxito */}
        {step === 'exito' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">¡Listo!</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{exitoMsg}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/" className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                Volver al sitio
              </a>
              <button onClick={() => { setStep('buscar'); setEmail(''); setNombre(''); setFoundTurnos([]); }}
                className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Gestionar otro turno
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t py-4 text-center text-xs text-gray-400 mt-auto">
        Lic. Sabrina B. Fernandez — Nutrición Funcional © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default MiTurno;
