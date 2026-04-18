import React, { useState, useEffect } from 'react';
import { Ruler, Scale, Activity, Apple, Pill, FileText, Target, TrendingUp, Utensils, Droplets, Moon, Dumbbell } from 'lucide-react';

interface Paciente {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  genero?: string;
  telefono?: string;
  email?: string;
  obraSocial?: string;
  motivoConsulta?: string;
  antecedentesPatologicos?: string;
  medicacionActual?: string;
  alergiasAlimentarias?: string;
  intolerancias?: string;
  historiaClinica?: string;
}

interface Turno {
  id: string;
  pacienteId: string;
  fecha: string;
  motivo: string;
}

interface HistoriaClinicaData {
  peso: string;
  talla: string;
  imc: string;
  circunferenciaCintura: string;
  circunferenciaCadera: string;
  masaMuscular: string;
  masaGrasa: string;
  habitosAlimentarios: string;
  frecuenciaComidas: string;
  consumoAgua: string;
  restriccionesDieteticas: string;
  suplementacion: string;
  sintomasDigestivos: string;
  frecuenciaEvacuaciones: string;
  consistenciaDeposiciones: string;
  diagnosticoNutricional: string;
  patologiasDigestivas: string;
  planAlimentario: string;
  objetivosTerapeuticos: string;
  actividadFisica: string;
  horasSueno: string;
  nivelEstres: string;
  evolucionNotas: string;
}

const emptyHistoria: HistoriaClinicaData = {
  peso: '', talla: '', imc: '', circunferenciaCintura: '', circunferenciaCadera: '',
  masaMuscular: '', masaGrasa: '',
  habitosAlimentarios: '', frecuenciaComidas: '', consumoAgua: '', restriccionesDieteticas: '',
  suplementacion: '',
  sintomasDigestivos: '', frecuenciaEvacuaciones: '', consistenciaDeposiciones: '',
  diagnosticoNutricional: '', patologiasDigestivas: '',
  planAlimentario: '', objetivosTerapeuticos: '',
  actividadFisica: '', horasSueno: '', nivelEstres: '',
  evolucionNotas: '',
};

interface HistoriaClinicaModalProps {
  paciente: Paciente | Record<string, never>;
  turnos: Turno[];
  open: boolean;
  onClose: () => void;
  onSave: (historia: string) => void;
}

const calcularIMC = (peso: string, talla: string): string => {
  const p = parseFloat(peso);
  const t = parseFloat(talla) / 100;
  if (!p || !t || t <= 0) return '';
  return (p / (t * t)).toFixed(1);
};

const clasificarIMC = (imc: string): { label: string; color: string } => {
  const val = parseFloat(imc);
  if (!val) return { label: '', color: '' };
  if (val < 18.5) return { label: 'Bajo peso', color: 'text-blue-600 bg-blue-50' };
  if (val < 25) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50' };
  if (val < 30) return { label: 'Sobrepeso', color: 'text-yellow-600 bg-yellow-50' };
  return { label: 'Obesidad', color: 'text-red-600 bg-red-50' };
};

const HistoriaClinicaModal: React.FC<HistoriaClinicaModalProps> = ({ paciente, turnos, open, onClose, onSave }) => {
  const [data, setData] = useState<HistoriaClinicaData>(emptyHistoria);
  const [activeTab, setActiveTab] = useState<string>('antropometria');

  useEffect(() => {
    if (paciente.historiaClinica) {
      try {
        const parsed = JSON.parse(paciente.historiaClinica);
        setData({ ...emptyHistoria, ...parsed });
      } catch {
        setData({ ...emptyHistoria, evolucionNotas: paciente.historiaClinica || '' });
      }
    } else {
      setData(emptyHistoria);
    }
    setActiveTab('antropometria');
  }, [paciente]);

  if (!open || !paciente.id) return null;

  const handleChange = (field: keyof HistoriaClinicaData, value: string) => {
    setData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'peso' || field === 'talla') {
        updated.imc = calcularIMC(
          field === 'peso' ? value : prev.peso,
          field === 'talla' ? value : prev.talla
        );
      }
      return updated;
    });
  };

  const handleSave = () => {
    onSave(JSON.stringify(data));
  };

  const edad = paciente.fechaNacimiento
    ? Math.floor((new Date().getTime() - new Date(paciente.fechaNacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  const imcInfo = clasificarIMC(data.imc);

  const tabs = [
    { key: 'antropometria', label: 'Antropometría', icon: Ruler },
    { key: 'nutricion', label: 'Nutrición', icon: Apple },
    { key: 'digestivo', label: 'Digestivo', icon: Activity },
    { key: 'diagnostico', label: 'Diagnóstico', icon: FileText },
    { key: 'plan', label: 'Plan', icon: Target },
    { key: 'estilo', label: 'Estilo de vida', icon: Dumbbell },
    { key: 'evolucion', label: 'Evolución', icon: TrendingUp },
  ];

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple bg-white transition-colors";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative animate-fade-in my-2" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-brand-purple text-2xl p-1 z-10">×</button>

        <div className="bg-brand-light rounded-t-2xl px-4 sm:px-8 py-4 sm:py-5 border-b border-brand-purple/20">
          <h2 className="text-lg sm:text-2xl font-bold text-brand-purple flex items-center gap-2">
            <FileText size={22} /> Historia Clínica Nutricional
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="font-semibold text-brand-gray">{paciente.nombre}</span>
            {edad !== null && <span className="text-xs bg-white text-brand-purple px-2 py-0.5 rounded-full font-semibold">{edad} años</span>}
            {(paciente as any).genero && <span className="text-xs bg-white text-gray-500 px-2 py-0.5 rounded-full">{(paciente as any).genero}</span>}
            {(paciente as any).motivoConsulta && <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-full font-semibold">{(paciente as any).motivoConsulta}</span>}
          </div>
        </div>

        <div className="flex overflow-x-auto border-b bg-gray-50 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-brand-purple text-brand-purple bg-white'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 max-h-[55vh] overflow-y-auto">
          {activeTab === 'antropometria' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Scale size={14} /> Peso (kg)</label>
                  <input type="number" step="0.1" value={data.peso} onChange={e => handleChange('peso', e.target.value)} className={inputClass} placeholder="70.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Ruler size={14} /> Talla (cm)</label>
                  <input type="number" step="0.1" value={data.talla} onChange={e => handleChange('talla', e.target.value)} className={inputClass} placeholder="165" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">IMC</label>
                  <div className="flex items-center gap-2">
                    <input type="text" value={data.imc} readOnly className={`${inputClass} bg-gray-50`} placeholder="Auto" />
                    {imcInfo.label && <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${imcInfo.color}`}>{imcInfo.label}</span>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Cintura (cm)</label>
                  <input type="number" step="0.1" value={data.circunferenciaCintura} onChange={e => handleChange('circunferenciaCintura', e.target.value)} className={inputClass} placeholder="80" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Cadera (cm)</label>
                  <input type="number" step="0.1" value={data.circunferenciaCadera} onChange={e => handleChange('circunferenciaCadera', e.target.value)} className={inputClass} placeholder="95" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Masa muscular (%)</label>
                  <input type="number" step="0.1" value={data.masaMuscular} onChange={e => handleChange('masaMuscular', e.target.value)} className={inputClass} placeholder="35" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Masa grasa (%)</label>
                  <input type="number" step="0.1" value={data.masaGrasa} onChange={e => handleChange('masaGrasa', e.target.value)} className={inputClass} placeholder="25" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nutricion' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Utensils size={14} /> Hábitos alimentarios</label>
                <textarea value={data.habitosAlimentarios} onChange={e => handleChange('habitosAlimentarios', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="Describa los hábitos alimentarios del paciente..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Frecuencia de comidas</label>
                  <input type="text" value={data.frecuenciaComidas} onChange={e => handleChange('frecuenciaComidas', e.target.value)} className={inputClass} placeholder="Ej: 4 comidas + 2 colaciones" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Droplets size={14} /> Consumo de agua</label>
                  <input type="text" value={data.consumoAgua} onChange={e => handleChange('consumoAgua', e.target.value)} className={inputClass} placeholder="Ej: 2 litros" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Restricciones dietéticas</label>
                <textarea value={data.restriccionesDieteticas} onChange={e => handleChange('restriccionesDieteticas', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="Vegetariano, vegano, sin TACC..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Pill size={14} /> Suplementación</label>
                <textarea value={data.suplementacion} onChange={e => handleChange('suplementacion', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="Probióticos, prebióticos, vitaminas..." />
              </div>
            </div>
          )}

          {activeTab === 'digestivo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Síntomas digestivos</label>
                <textarea value={data.sintomasDigestivos} onChange={e => handleChange('sintomasDigestivos', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="Distensión abdominal, dolor, gases, reflujo..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Frecuencia de evacuaciones</label>
                  <input type="text" value={data.frecuenciaEvacuaciones} onChange={e => handleChange('frecuenciaEvacuaciones', e.target.value)} className={inputClass} placeholder="Ej: 1-2 veces por día" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Consistencia (Escala de Bristol)</label>
                  <select value={data.consistenciaDeposiciones} onChange={e => handleChange('consistenciaDeposiciones', e.target.value)} className={inputClass}>
                    <option value="">Seleccionar</option>
                    <option value="Tipo 1 - Trozos duros separados">Tipo 1 - Trozos duros</option>
                    <option value="Tipo 2 - Forma de salchicha con grumos">Tipo 2 - Salchicha con grumos</option>
                    <option value="Tipo 3 - Salchicha con grietas">Tipo 3 - Salchicha con grietas</option>
                    <option value="Tipo 4 - Suave y lisa">Tipo 4 - Suave y lisa (ideal)</option>
                    <option value="Tipo 5 - Trozos blandos">Tipo 5 - Trozos blandos</option>
                    <option value="Tipo 6 - Pastosa">Tipo 6 - Pastosa</option>
                    <option value="Tipo 7 - Líquida">Tipo 7 - Líquida</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diagnostico' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Diagnóstico nutricional</label>
                <textarea value={data.diagnosticoNutricional} onChange={e => handleChange('diagnosticoNutricional', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="Diagnóstico nutricional y estado de nutrición..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Patologías digestivas</label>
                <textarea value={data.patologiasDigestivas} onChange={e => handleChange('patologiasDigestivas', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="SIBO, IMO, disbiosis, SII, enfermedad celíaca..." />
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Target size={14} /> Objetivos terapéuticos</label>
                <textarea value={data.objetivosTerapeuticos} onChange={e => handleChange('objetivosTerapeuticos', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Objetivos a corto y largo plazo..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Apple size={14} /> Plan alimentario</label>
                <textarea value={data.planAlimentario} onChange={e => handleChange('planAlimentario', e.target.value)} className={`${inputClass} min-h-[150px]`} placeholder="Protocolo alimentario, fases, alimentos permitidos y restringidos..." />
              </div>
            </div>
          )}

          {activeTab === 'estilo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Dumbbell size={14} /> Actividad física</label>
                <textarea value={data.actividadFisica} onChange={e => handleChange('actividadFisica', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Tipo, frecuencia, duración, intensidad..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Moon size={14} /> Horas de sueño</label>
                  <input type="text" value={data.horasSueno} onChange={e => handleChange('horasSueno', e.target.value)} className={inputClass} placeholder="Ej: 7-8 horas" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Nivel de estrés</label>
                  <select value={data.nivelEstres} onChange={e => handleChange('nivelEstres', e.target.value)} className={inputClass}>
                    <option value="">Seleccionar</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Alto">Alto</option>
                    <option value="Muy alto">Muy alto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evolucion' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><TrendingUp size={14} /> Notas de evolución</label>
                <textarea value={data.evolucionNotas} onChange={e => handleChange('evolucionNotas', e.target.value)} className={`${inputClass} min-h-[200px]`} placeholder="Registro de evolución, cambios observados, ajustes al tratamiento..." />
              </div>
              {turnos.length > 0 && (
                <div>
                  <label className="block font-semibold mb-2 text-sm">Turnos del paciente</label>
                  <ul className="bg-brand-light rounded-lg p-3 text-sm space-y-1">
                    {turnos.map(t => (
                      <li key={t.id} className="flex justify-between py-1.5 border-b last:border-b-0 border-brand-purple/10">
                        <span className="font-medium text-brand-purple">{t.fecha}</span>
                        <span className="text-gray-500">{t.motivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-0 border-t">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-lg bg-brand-purple hover:bg-brand-darkPurple text-white font-bold transition-colors shadow-md">
            Guardar Historia Clínica
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriaClinicaModal;
