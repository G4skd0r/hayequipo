"use client";

import { useState } from "react";

const PROVINCIAS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

// Para lugar de nacimiento sumamos exterior: hay gente que nació fuera del país.
const PROVINCIAS_NACIMIENTO = [...PROVINCIAS, "Fuera de Argentina"];

export default function FormularioSumate() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    edad: "",
    localidad: "",
    provincia: "",
    provinciaNacimiento: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar el formulario.");
      }

      setEnviado(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado.";
      setError(msg);
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div
        className="he-reveal border border-he-negro/15 text-he-negro p-8 md:p-10 rounded-lg"
        role="status"
      >
        <h2 className="he-h3 text-2xl md:text-3xl font-medium mb-4">
          <span className="he-highlight">Gracias por escribirnos.</span>
        </h2>
        <p className="he-body text-base text-he-negro/70 leading-relaxed">
          Ya tenemos tus datos. Nos vamos a poner en contacto con vos para
          contarte más y conocerte mejor. Tené en cuenta que puede demorar un
          poco.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Campo
        label="Nombre y apellido"
        name="nombre"
        required
        autoComplete="name"
        value={formData.nombre}
        onChange={handleChange}
      />

      <Campo
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Campo
          label="Edad"
          name="edad"
          type="number"
          inputMode="numeric"
          min={14}
          max={99}
          required
          value={formData.edad}
          onChange={handleChange}
        />

        <Campo
          label="Localidad donde vivís"
          name="localidad"
          required
          autoComplete="address-level2"
          value={formData.localidad}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CampoProvincia
          label="Provincia de residencia"
          name="provincia"
          autoComplete="address-level1"
          opciones={PROVINCIAS}
          value={formData.provincia}
          onChange={handleChange}
        />

        <CampoProvincia
          label="Provincia de nacimiento"
          name="provinciaNacimiento"
          opciones={PROVINCIAS_NACIMIENTO}
          value={formData.provinciaNacimiento}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="block text-xs uppercase tracking-widest text-he-negro/55 mb-2"
        >
          Contanos brevemente sobre vos
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="A qué te dedicás, qué te interesa de Hay Equipo, qué te gustaría saber..."
          className="he-field resize-none"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="he-reveal text-sm text-he-rojo bg-he-rojo/10 px-4 py-3 rounded"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        aria-busy={enviando}
        className="he-press bg-he-rojo hover:bg-he-rojo-light disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-4 rounded text-base font-medium w-full md:w-auto md:min-w-[220px]"
      >
        {/* El ancho queda fijo y el texto se funde con blur: sin esto el botón
            cambia de tamaño en el peor momento, justo al enviar. */}
        <span className="he-swap inline-block" data-busy={enviando}>
          {enviando ? "Enviando..." : "Dejar mi contacto"}
        </span>
      </button>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  inputMode,
  min,
  max,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: "numeric";
  min?: number;
  max?: number;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-widest text-he-negro/55 mb-2"
      >
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        min={min}
        max={max}
        autoComplete={autoComplete}
        className="he-field"
      />
    </div>
  );
}

function CampoProvincia({
  label,
  name,
  opciones,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  name: string;
  opciones: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-widest text-he-negro/55 mb-2"
      >
        {label} <span aria-hidden="true">*</span>
      </label>
      <select
        id={name}
        name={name}
        required
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="he-field he-select"
      >
        <option value="">Seleccioná una provincia</option>
        {opciones.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
