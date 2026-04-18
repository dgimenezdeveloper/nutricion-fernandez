import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, Heart, Pill, AlertCircle, FileText, ChevronDown } from 'lucide-react';

interface PacienteData {
  id?: string;
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
  obraSocial: string;
  numeroAfiliado: string;
  motivoConsulta: string;
  antecedentesPatologicos: string;
  medicacionActual: string;
  alergiasAlimentarias: string;
  intolerancias: string;
  historiaClinica?: string;
}

interface PacienteFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (paciente: PacienteData) => void;
  paciente?: PacienteData | null;
  mode?: 'crear' | 'editar';
}

const generos = ['Femenino', 'Masculino', 'Otro', 'Prefiero no decir'];

const motivosConsulta = [
  'Consulta inicial',
  'SIBO',
  'IMO',
  'Disbiosis intestinal',
  'Intolerancias alimentarias',
  'Plan alimentario personalizado',
  'Control de peso',
  'Síndrome de intestino irritable',
  'Enfermedad celíaca',
  'Dieta Low FODMAP',
  'Suplementación',
  'Otro',
];

const emptyForm: PacienteData = {
  nombre: '',
  fechaNacimiento: '',
  genero: '',
  telefono: '',
  email: '',
  obraSocial: '',
  numeroAfiliado: '',
  motivoConsulta: '',
  antecedentesPatologicos: '',
  medicacionActual: '',
  alergiasAlimentarias: '',
  intolerancias: '',
};

const PacienteFormModal: React.FC<PacienteFormModalProps> = ({ open, onClose, onSave, paciente, mode = 'crear' }) => {
  const [form, setForm] = useState<PacienteData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (paciente && mode === 'editar') {
      setForm({ ...emptyForm, ...paciente });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [paciente, mode, open]);

  if (!open) return null;

  const handleChange = (field: keyof PacienteData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    if (!form.genero) newErrors.genero = 'Seleccione un género';
    if (!form.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      id: form.id || Date.now().toString(),
    });
    setForm(emptyForm);
    onClose();
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 rounded-lg border ${errors[field] ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} focus:ring-2 focus:ring-brand-purple focus:border-brand-purple bg-white transition-colors`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative animate-fade-in border-t-4 border-brand-purple my-4" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-brand-purple text-2xl p-1 z-10">×</button>
        
        <div className="bg-brand-light rounded-t-2xl px-5 sm:px-8 py-5">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-purple">
            {mode === 'editar' ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Complete los datos del paciente</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Datos Personales */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-wide mb-3">
              <User size={16} /> Datos Personales
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">Nombre completo <span className="text-red-400">*</span></label>
                <input type="text" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} className={inputClass('nombre')} placeholder="Nombre y Apellido" />
                {errors.nombre && <span className="text-red-400 text-xs mt-1">{errors.nombre}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Fecha de nacimiento <span className="text-red-400">*</span></label>
                <input type="date" value={form.fechaNacimiento} onChange={e => handleChange('fechaNacimiento', e.target.value)} className={inputClass('fechaNacimiento')} />
                {errors.fechaNacimiento && <span className="text-red-400 text-xs mt-1">{errors.fechaNacimiento}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Género <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select value={form.genero} onChange={e => handleChange('genero', e.target.value)} className={`${inputClass('genero')} appearance-none pr-8`}>
                    <option value="">Seleccionar</option>
                    {generos.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                </div>
                {errors.genero && <span className="text-red-400 text-xs mt-1">{errors.genero}</span>}
              </div>
            </div>
          </fieldset>

          {/* Contacto */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-wide mb-3">
              <Phone size={16} /> Contacto
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Teléfono <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input type="tel" value={form.telefono} onChange={e => handleChange('telefono', e.target.value)} className={`${inputClass('telefono')} pl-9`} placeholder="+54 11 1234-5678" />
                </div>
                {errors.telefono && <span className="text-red-400 text-xs mt-1">{errors.telefono}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className={`${inputClass('email')} pl-9`} placeholder="paciente@email.com" />
                </div>
                {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email}</span>}
              </div>
            </div>
          </fieldset>

          {/* Obra Social */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-wide mb-3">
              <FileText size={16} /> Cobertura Médica
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Obra Social / Prepaga</label>
                <input type="text" value={form.obraSocial} onChange={e => handleChange('obraSocial', e.target.value)} className={inputClass('obraSocial')} placeholder="Nombre de la cobertura" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">N° de Afiliado</label>
                <input type="text" value={form.numeroAfiliado} onChange={e => handleChange('numeroAfiliado', e.target.value)} className={inputClass('numeroAfiliado')} placeholder="Número de afiliado" />
              </div>
            </div>
          </fieldset>

          {/* Motivo de Consulta */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-wide mb-3">
              <Calendar size={16} /> Motivo de Consulta
            </legend>
            <div className="relative">
              <select value={form.motivoConsulta} onChange={e => handleChange('motivoConsulta', e.target.value)} className={`${inputClass('motivoConsulta')} appearance-none pr-8`}>
                <option value="">Seleccionar motivo</option>
                {motivosConsulta.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
            </div>
          </fieldset>

          {/* Antecedentes */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-wide mb-3">
              <Heart size={16} /> Antecedentes de Salud
            </legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Antecedentes patológicos</label>
                <textarea value={form.antecedentesPatologicos} onChange={e => handleChange('antecedentesPatologicos', e.target.value)} className={`${inputClass('antecedentesPatologicos')} min-h-[80px]`} placeholder="Enfermedades previas, cirugías, condiciones crónicas..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Medicación actual</label>
                <div className="relative">
                  <Pill className="absolute left-3 top-3 text-gray-400" size={16} />
                  <textarea value={form.medicacionActual} onChange={e => handleChange('medicacionActual', e.target.value)} className={`${inputClass('medicacionActual')} min-h-[60px] pl-9`} placeholder="Medicamentos, dosis y frecuencia..." />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Alergias e Intolerancias */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-wide mb-3">
              <AlertCircle size={16} /> Alergias e Intolerancias
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Alergias alimentarias</label>
                <textarea value={form.alergiasAlimentarias} onChange={e => handleChange('alergiasAlimentarias', e.target.value)} className={`${inputClass('alergiasAlimentarias')} min-h-[60px]`} placeholder="Frutos secos, mariscos, lácteos..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Intolerancias</label>
                <textarea value={form.intolerancias} onChange={e => handleChange('intolerancias', e.target.value)} className={`${inputClass('intolerancias')} min-h-[60px]`} placeholder="Lactosa, gluten, fructosa..." />
              </div>
            </div>
          </fieldset>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-brand-purple hover:bg-brand-darkPurple text-white font-bold transition-colors shadow-md">
              {mode === 'editar' ? 'Guardar Cambios' : 'Registrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PacienteFormModal;
