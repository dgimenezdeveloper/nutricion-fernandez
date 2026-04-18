import React, { useState, useMemo } from 'react';
import { Calendar, User, ChevronDown, Send, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';

interface TurnoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  pacientes?: any[];
  turnos?: any[];
}

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
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const motivos = ['Consulta inicial', 'Control SIBO', 'Seguimiento disbiosis', 'Consulta IMO', 'Plan nutricional', 'Control / Seguimiento', 'Otro'];

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
  const [hStart, mStart] = desde.split(':').map(Number);
  const [hEnd, mEnd] = hasta.split(':').map(Number);
  let totalStart = hStart * 60 + mStart;
  const totalEnd = hEnd * 60 + mEnd;
  while (totalStart < totalEnd) {
    const h = Math.floor(totalStart / 60);
    const m = totalStart % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    totalStart += SLOT_DURATION_MIN;
  }
  return slots;
}

const TurnoModal: React.FC<TurnoModalProps> = ({ open, onClose, onSubmit, pacientes = [], turnos = [] }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [nombreManual, setNombreManual] = useState('');
  const [motivo, setMotivo] = useState('');
  const [usarExistente, setUsarExistente] = useState(true);

  // Build occupied slots from existing turnos
  const occupiedSlots: Record<string, string[]> = {};
  turnos.forEach((t: any) => {
    if (t.fecha && t.hora && t.estado !== 'cancelado') {
      if (!occupiedSlots[t.fecha]) occupiedSlots[t.fecha] = [];
      occupiedSlots[t.fecha].push(t.hora);
    }
  });

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const resetAndClose = () => {
    setStep(1); setSelectedDate(null); setSelectedTime('');
    setPacienteId(''); setNombreManual(''); setMotivo('');
    onClose();
  };

  if (!open) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekEndDate = weekDays[6];
  const weekLabel = `${weekDays[0].getDate()} ${MONTH_NAMES[weekDays[0].getMonth()].substring(0, 3)} - ${weekEndDate.getDate()} ${MONTH_NAMES[weekEndDate.getMonth()].substring(0, 3)}`;

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    if (prev >= getMonday(new Date())) setWeekStart(prev);
  };
  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    const maxWeek = new Date(); maxWeek.setDate(maxWeek.getDate() + 56);
    if (next <= maxWeek) setWeekStart(next);
  };

  const handleSelectSlot = (day: Date, time: string) => {
    setSelectedDate(day);
    setSelectedTime(time);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    const nombre = usarExistente
      ? pacientes.find((p: any) => p.id === pacienteId)?.nombre || ''
      : nombreManual;
    if (!nombre) return;

    onSubmit({
      nombre,
      pacienteId: usarExistente ? pacienteId : '',
      fecha: formatDateKey(selectedDate),
      hora: selectedTime,
      motivo,
      estado: 'confirmado',
    });
    resetAndClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto" onClick={resetAndClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative animate-fade-in flex flex-col max-h-[95vh] my-2" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center px-5 sm:px-8 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-purple flex items-center gap-2">
              <Calendar size={22} /> Agendar Turno
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Panel administrativo</p>
          </div>
          <button onClick={resetAndClose} className="text-gray-400 hover:text-brand-purple p-1 rounded-full transition-colors"><X size={22} /></button>
        </div>

        {/* Steps */}
        <div className="flex gap-0 shrink-0">
          <div className={`flex-1 py-2 text-center text-xs sm:text-sm font-bold transition-colors ${step === 1 ? 'bg-brand-purple text-white' : 'bg-brand-purple/20 text-brand-purple'}`}>
            1. Seleccionar horario
          </div>
          <div className={`flex-1 py-2 text-center text-xs sm:text-sm font-bold transition-colors ${step === 2 ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400'}`}>
            2. Datos del turno
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* STEP 1: Calendar */}
          {step === 1 && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <button onClick={handlePrevWeek} disabled={weekStart <= getMonday(new Date())} className="p-2 rounded-lg border border-gray-200 hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <div className="bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Calendar size={16} /> {weekLabel}
                </div>
                <button onClick={handleNextWeek} className="p-2 rounded-lg border border-gray-200 hover:bg-brand-light transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="grid grid-cols-7 min-w-[700px] border border-gray-200 rounded-xl overflow-hidden">
                  {weekDays.map((day, i) => {
                    const isToday = formatDateKey(day) === formatDateKey(new Date());
                    return (
                      <div key={i} className={`text-center py-2.5 border-b border-r last:border-r-0 font-bold text-sm ${isToday ? 'bg-brand-purple text-white' : 'bg-gray-50 text-brand-gray'}`}>
                        <div>{DAY_NAMES[day.getDay()]}</div>
                        <div className="text-xs font-normal mt-0.5 opacity-80">{day.getDate()} {MONTH_NAMES[day.getMonth()].substring(0, 3)}</div>
                      </div>
                    );
                  })}
                  {weekDays.map((day, i) => {
                    const schedule = SCHEDULE[day.getDay()];
                    const isPast = day < today;
                    const dateKey = formatDateKey(day);
                    const dayOccupied = occupiedSlots[dateKey] || [];

                    if (!schedule || isPast) {
                      return (
                        <div key={`s-${i}`} className="border-r last:border-r-0 bg-gray-50/50 flex items-start justify-center pt-4 min-h-[180px]">
                          <span className="text-xs text-gray-300 font-medium bg-gray-100 px-3 py-1 rounded-full">No atiende</span>
                        </div>
                      );
                    }

                    const slots = generateSlots(schedule.desde, schedule.hasta);
                    return (
                      <div key={`s-${i}`} className="border-r last:border-r-0 flex flex-col">
                        {slots.map(time => {
                          const isOccupied = dayOccupied.includes(time);
                          const isNow = formatDateKey(day) === formatDateKey(new Date());
                          const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
                          const [sh, sm] = time.split(':').map(Number);
                          const isPastSlot = isNow && sh * 60 + sm <= nowMin;
                          // Find patient name for occupied slot
                          const occupiedTurno = isOccupied ? turnos.find((t: any) => t.fecha === dateKey && t.hora === time && t.estado !== 'cancelado') : null;
                          const occupiedPaciente = occupiedTurno ? pacientes.find((p: any) => p.id === occupiedTurno.pacienteId) : null;

                          return (
                            <button key={time} disabled={isOccupied || isPastSlot}
                              onClick={() => handleSelectSlot(day, time)}
                              className={`py-2 px-1 text-xs border-b last:border-b-0 transition-all text-center ${
                                isOccupied ? 'bg-brand-purple/10 text-brand-purple cursor-not-allowed font-semibold' :
                                isPastSlot ? 'bg-gray-50 text-gray-300 cursor-not-allowed' :
                                'hover:bg-brand-purple/10 text-gray-700 hover:text-brand-purple hover:font-semibold cursor-pointer'
                              }`}
                              title={occupiedPaciente ? occupiedPaciente.nombre : undefined}
                            >
                              {isOccupied ? (
                                <span className="flex flex-col items-center">
                                  <span>{time}</span>
                                  <span className="text-[10px] truncate max-w-full">{occupiedPaciente?.nombre?.split(' ')[0] || 'Ocupado'}</span>
                                </span>
                              ) : time}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-gray-200 inline-block"></span> Disponible</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-brand-purple/10 border border-brand-purple/30 inline-block"></span> Ocupado</span>
              </div>
            </div>
          )}

          {/* STEP 2: Patient & motive */}
          {step === 2 && selectedDate && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: date info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-brand-purple rounded-xl p-5 text-white text-center">
                    <div className="text-sm font-medium opacity-80">{MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}</div>
                    <div className="text-lg font-bold mt-1">{DAY_NAMES_FULL[selectedDate.getDay()]}</div>
                    <div className="text-5xl font-black my-2">{selectedDate.getDate()}</div>
                    <div className="text-xl font-bold flex items-center justify-center gap-2">
                      <Clock size={18} /> {selectedTime} hs
                    </div>
                  </div>
                  <button onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(''); }}
                    className="w-full text-sm text-brand-purple hover:underline font-medium flex items-center justify-center gap-1 py-2">
                    <ChevronLeft size={14} /> Elegir otro horario
                  </button>
                </div>

                {/* Right: form */}
                <div className="lg:col-span-3">
                  <h3 className="font-bold text-brand-gray mb-4 text-lg">Datos del turno</h3>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Toggle */}
                    <div className="flex gap-2 mb-2">
                      <button type="button" onClick={() => setUsarExistente(true)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${usarExistente ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        Paciente existente
                      </button>
                      <button type="button" onClick={() => setUsarExistente(false)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${!usarExistente ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        Paciente nuevo
                      </button>
                    </div>

                    {usarExistente ? (
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-brand-gray">Seleccionar paciente *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <select required value={pacienteId} onChange={e => setPacienteId(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-purple bg-brand-light/50 appearance-none">
                            <option value="">Seleccionar paciente</option>
                            {pacientes.map((p: any) => (
                              <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-brand-gray">Nombre del paciente *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input required type="text" value={nombreManual} onChange={e => setNombreManual(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-purple bg-brand-light/50 placeholder:text-gray-400"
                            placeholder="Nombre completo" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold mb-1 text-brand-gray">Motivo de consulta *</label>
                      <div className="relative">
                        <select required value={motivo} onChange={e => setMotivo(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2.5 focus:ring-2 focus:ring-brand-purple bg-brand-light/50 appearance-none">
                          <option value="">Seleccionar motivo</option>
                          {motivos.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    </div>

                    <button type="submit"
                      className="w-full bg-brand-orange hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-4 flex justify-center items-center text-lg gap-2">
                      <Send size={20} /> Agendar Turno
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnoModal;
