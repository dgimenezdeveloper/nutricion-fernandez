import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Clock, MapPin, User, Mail, Phone, ClipboardList, Shield } from 'lucide-react';
import { BookingStatus } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Configuración de agenda ---
// Días disponibles: 0=Dom,1=Lun,...6=Sab
// Horarios en formato { desde: 'HH:mm', hasta: 'HH:mm' }
const SCHEDULE: Record<number, { desde: string; hasta: string } | null> = {
  0: null, // Domingo
  1: null, // Lunes
  2: { desde: '08:00', hasta: '12:00' }, // Martes
  3: null, // Miércoles
  4: { desde: '08:00', hasta: '12:00' }, // Jueves
  5: { desde: '14:00', hasta: '18:00' }, // Viernes
  6: null, // Sábado
};

const SLOT_DURATION_MIN = 30; // minutos por turno

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Helpers
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

function getBookedSlots(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem('booked_slots') || '{}');
  } catch { return {}; }
}

function saveBookedSlot(dateKey: string, time: string) {
  const booked = getBookedSlots();
  if (!booked[dateKey]) booked[dateKey] = [];
  booked[dateKey].push(time);
  localStorage.setItem('booked_slots', JSON.stringify(booked));
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [status, setStatus] = useState<BookingStatus>(BookingStatus.IDLE);
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    obraSocial: '',
    reason: 'Consulta General',
    notas: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setStatus(BookingStatus.IDLE);
      setSelectedDate(null);
      setSelectedTime('');
      setWeekStart(getMonday(new Date()));
      setFormData({ name: '', email: '', phone: '', obraSocial: '', reason: 'Consulta General', notas: '' });
    }
  }, [isOpen]);

  const bookedSlots = useMemo(() => getBookedSlots(), [step]);

  // Generar los 7 días de la semana
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekEndDate = weekDays[6];
  const weekLabel = `Semana del ${weekDays[0].getDate()} de ${MONTH_NAMES[weekDays[0].getMonth()]} al ${weekEndDate.getDate()} de ${MONTH_NAMES[weekEndDate.getMonth()]}`;

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    if (prev >= getMonday(new Date())) setWeekStart(prev);
  };
  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    // Limitar a 8 semanas adelante
    const maxWeek = new Date();
    maxWeek.setDate(maxWeek.getDate() + 56);
    if (next <= maxWeek) setWeekStart(next);
  };

  const handleSelectSlot = (day: Date, time: string) => {
    setSelectedDate(day);
    setSelectedTime(time);
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setStatus(BookingStatus.SUBMITTING);

    setTimeout(() => {
      try {
        const dateKey = formatDateKey(selectedDate);
        saveBookedSlot(dateKey, selectedTime);
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push({
          ...formData,
          fecha: dateKey,
          hora: selectedTime,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        setStatus(BookingStatus.SUCCESS);
        setStep(3);
      } catch {
        setStatus(BookingStatus.ERROR);
      }
    }, 1200);
  };

  if (!isOpen) return null;

  const inputClass = "w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all bg-brand-light/50 placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-[3px] animate-fade-in overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative animate-scale-up my-2 flex flex-col max-h-[95vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 sm:px-8 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-purple flex items-center gap-2">
              <Calendar size={22} /> Reserva de Turno Online
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Lic. Sabrina B. Fernandez — Nutrición Funcional</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-purple p-1 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex gap-0 shrink-0">
          <div className={`flex-1 py-2.5 text-center text-xs sm:text-sm font-bold transition-colors ${
            step === 1 ? 'bg-brand-purple text-white' : step > 1 ? 'bg-brand-purple/20 text-brand-purple' : 'bg-gray-100 text-gray-400'
          }`}>
            1. Seleccioná un horario
          </div>
          <div className={`flex-1 py-2.5 text-center text-xs sm:text-sm font-bold transition-colors ${
            step === 2 ? 'bg-brand-orange text-white' : step > 2 ? 'bg-brand-orange/20 text-brand-orange' : 'bg-gray-100 text-gray-400'
          }`}>
            2. Confirmá tu cita
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* STEP 1: Calendar */}
          {step === 1 && (
            <div className="p-4 sm:p-6">
              {/* Week navigation */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <button
                  onClick={handlePrevWeek}
                  disabled={weekStart <= getMonday(new Date())}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Calendar size={16} />
                  {weekLabel}
                </div>
                <button
                  onClick={handleNextWeek}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-brand-light transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="grid grid-cols-7 min-w-[700px] border border-gray-200 rounded-xl overflow-hidden">
                  {/* Day headers */}
                  {weekDays.map((day, i) => {
                    const isToday = formatDateKey(day) === formatDateKey(new Date());
                    return (
                      <div key={i} className={`text-center py-3 border-b border-r last:border-r-0 font-bold text-sm ${
                        isToday ? 'bg-brand-purple text-white' : 'bg-gray-50 text-brand-gray'
                      }`}>
                        <div>{DAY_NAMES[day.getDay()]}</div>
                        <div className="text-xs font-normal mt-0.5 opacity-80">
                          {day.getDate()} {MONTH_NAMES[day.getMonth()].substring(0, 3)}
                        </div>
                      </div>
                    );
                  })}

                  {/* Slot columns */}
                  {weekDays.map((day, i) => {
                    const schedule = SCHEDULE[day.getDay()];
                    const isPast = day < today;
                    const dateKey = formatDateKey(day);
                    const dayBooked = bookedSlots[dateKey] || [];

                    if (!schedule || isPast) {
                      return (
                        <div key={`slots-${i}`} className="border-r last:border-r-0 bg-gray-50/50 flex items-start justify-center pt-6 min-h-[200px]">
                          <span className="text-xs text-gray-300 font-medium bg-gray-100 px-3 py-1.5 rounded-full">No atiende</span>
                        </div>
                      );
                    }

                    const slots = generateSlots(schedule.desde, schedule.hasta);
                    return (
                      <div key={`slots-${i}`} className="border-r last:border-r-0 flex flex-col">
                        {slots.map(time => {
                          const isBooked = dayBooked.includes(time);
                          const isNow = formatDateKey(day) === formatDateKey(new Date());
                          const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
                          const [sh, sm] = time.split(':').map(Number);
                          const slotMinutes = sh * 60 + sm;
                          const isPastSlot = isNow && slotMinutes <= nowMinutes;

                          return (
                            <button
                              key={time}
                              disabled={isBooked || isPastSlot}
                              onClick={() => handleSelectSlot(day, time)}
                              className={`py-2.5 px-1 text-sm border-b last:border-b-0 transition-all text-center ${
                                isBooked
                                  ? 'bg-red-50 text-red-300 line-through cursor-not-allowed'
                                  : isPastSlot
                                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                    : selectedDate && formatDateKey(selectedDate) === dateKey && selectedTime === time
                                      ? 'bg-brand-purple text-white font-bold'
                                      : 'hover:bg-brand-purple/10 text-gray-700 hover:text-brand-purple hover:font-semibold cursor-pointer'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-brand-purple/10 border border-brand-purple/30 inline-block"></span> Disponible</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50 border border-red-200 inline-block"></span> Ocupado</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 border border-gray-200 inline-block"></span> No atiende</span>
              </div>
            </div>
          )}

          {/* STEP 2: Confirm */}
          {step === 2 && selectedDate && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: appointment info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-brand-light rounded-xl p-5 border border-brand-purple/10">
                    <h3 className="font-bold text-brand-purple mb-3 flex items-center gap-2"><User size={16} /> Profesional</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold text-brand-gray">Lic. Sabrina B. Fernandez</span></p>
                      <p className="text-gray-500">Nutrición Funcional — SIBO / IMO</p>
                    </div>
                  </div>

                  <div className="bg-brand-light rounded-xl p-5 border border-brand-purple/10">
                    <h3 className="font-bold text-brand-purple mb-3 flex items-center gap-2"><MapPin size={16} /> Consultorio</h3>
                    <p className="text-sm text-gray-600">Adrogué, Provincia de Buenos Aires</p>
                    <p className="text-xs text-gray-400 mt-1">Consulta presencial y online</p>
                  </div>

                  <div className="bg-brand-purple rounded-xl p-5 text-white text-center">
                    <div className="text-sm font-medium opacity-80">{MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}</div>
                    <div className="text-lg font-bold mt-1">{DAY_NAMES_FULL[selectedDate.getDay()]}</div>
                    <div className="text-5xl font-black my-2">{selectedDate.getDate()}</div>
                    <div className="text-xl font-bold flex items-center justify-center gap-2">
                      <Clock size={18} /> {selectedTime} hs
                    </div>
                  </div>

                  <button
                    onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(''); }}
                    className="w-full text-sm text-brand-purple hover:underline font-medium flex items-center justify-center gap-1 py-2"
                  >
                    <ChevronLeft size={14} /> Elegir otro horario
                  </button>
                </div>

                {/* Right: patient form */}
                <div className="lg:col-span-3">
                  <h3 className="font-bold text-brand-gray mb-4 text-lg">Completá tus datos</h3>
                  <form onSubmit={handleConfirm} className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-brand-gray">Nombre Completo *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></span>
                        <input required name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Tu nombre completo" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-brand-gray">Email *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={16} /></span>
                          <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="tu@email.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-brand-gray">Teléfono (WhatsApp) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={16} /></span>
                          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Tu número" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-brand-gray">Obra Social / Prepaga</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Shield size={16} /></span>
                        <input name="obraSocial" value={formData.obraSocial} onChange={handleChange} className={inputClass} placeholder="Nombre de tu obra social (opcional)" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-brand-gray">Motivo de consulta *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><ClipboardList size={16} /></span>
                        <select required name="reason" value={formData.reason} onChange={handleChange} className={inputClass}>
                          <option>Consulta General</option>
                          <option>Tratamiento SIBO / IMO</option>
                          <option>Dieta Low FODMAPs</option>
                          <option>Nutrición Funcional</option>
                          <option>Salud Intestinal</option>
                          <option>Control / Seguimiento</option>
                          <option>Otro</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-brand-gray">Notas adicionales</label>
                      <textarea name="notas" value={formData.notas} onChange={handleChange} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all bg-brand-light/50 placeholder:text-gray-400" placeholder="¿Algo que quieras comentar antes de la consulta?" />
                    </div>

                    {status === BookingStatus.ERROR && (
                      <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle size={16} /> Error al confirmar. Intentá nuevamente.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === BookingStatus.SUBMITTING}
                      className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 flex justify-center items-center text-lg gap-2"
                    >
                      {status === BookingStatus.SUBMITTING ? (
                        <span className="animate-pulse">Confirmando...</span>
                      ) : (
                        <>
                          <CheckCircle size={20} /> Confirmar Turno
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && selectedDate && (
            <div className="p-6 sm:p-10">
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Turno Confirmado!</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Tu turno quedó reservado para el <strong>{DAY_NAMES_FULL[selectedDate.getDay()]} {selectedDate.getDate()} de {MONTH_NAMES[selectedDate.getMonth()]}</strong> a las <strong>{selectedTime} hs</strong>.
                  <br />Me pondré en contacto contigo para confirmación final.
                </p>
                <div className="bg-brand-light rounded-xl p-4 max-w-sm mx-auto mb-6 text-sm text-left space-y-1">
                  <p><span className="font-semibold text-brand-gray">Paciente:</span> {formData.name}</p>
                  <p><span className="font-semibold text-brand-gray">Email:</span> {formData.email}</p>
                  <p><span className="font-semibold text-brand-gray">Teléfono:</span> {formData.phone}</p>
                  <p><span className="font-semibold text-brand-gray">Motivo:</span> {formData.reason}</p>
                </div>
                <p className="text-xs text-gray-400 mb-4">¿Necesitás cancelar o reprogramar? <a href="/mi-turno" className="text-brand-purple hover:underline font-semibold">Gestioná tu turno acá</a></p>
                <button onClick={onClose} className="bg-brand-purple text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors font-bold">
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;