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
      <div className="border border-he-negro/15 text-he-negro p-8 md:p-10 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-medium mb-4">
          <span className="he-highlight">Gracias por escribirnos.</span>
        </h2>
        <p className="text-base text-he-negro/70 leading-relaxed">
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
        value={formData.nombre}
        onChange={handleChange}
      />

      <Campo
        label="Email"
        name="email"
        type="email"
        required
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
          value={formData.localidad}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CampoProvincia
          label="Provincia de residencia"
          name="provincia"
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
          className="w-full px-4 py-3 bg-he-negro/5 border border-he-negro/20 rounded focus:border-he-celeste focus:outline-none text-base text-he-negro placeholder:text-he-negro/40 resize-none"
        />
      </div>

      {error && (
        <div className="text-sm text-he-rojo bg-he-rojo/10 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="bg-he-rojo hover:bg-he-rojo-light disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-4 rounded text-base font-medium transition-colors w-full md:w-auto"
      >
        {enviando ? "Enviando..." : "Dejar mi contacto"}
      </button>
    </form>
  );
}

const INPUT_CLASS =
  "w-full px-4 py-3 bg-he-negro/5 border border-he-negro/20 rounded focus:border-he-celeste focus:outline-none text-base text-he-negro placeholder:text-he-negro/40";

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
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-widest text-he-negro/55 mb-2"
      >
        {label} {required && "*"}
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
        className={INPUT_CLASS}
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
}: {
  label: string;
  name: string;
  opciones: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-widest text-he-negro/55 mb-2"
      >
        {label} *
      </label>
      <select
        id={name}
        name={name}
        required
        value={value}
        onChange={onChange}
        className={INPUT_CLASS}
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
