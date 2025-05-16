"use client";

import { useEffect, useState } from "react";
import EventCardWrapper from "@/app/(Site)/(Eventos)/Eventos/page";
import api from "@/api/api";

export default function DashboardEventos() {
  const [eventos, setEventos] = useState([]);
  const [eventoEditando, setEventoEditando] = useState(null);

  const [formValues, setFormValues] = useState({
    title: "",
    date: "",
    hora_inicio: "",
    location: "",
    image: "",
    link: "#",
  });

  const cargarEventos = async () => {
    try {
      const res = await api.get("/eventos/evento/");
      setEventos(res.data);
    } catch (err) {
      console.error("Error cargando eventos", err);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventoEditando) {
        await api.patch(`/eventos/evento/${eventoEditando.id}/`, formValues);
      } else {
        await api.post("/eventos/evento/", formValues);
      }
      setFormValues({ title: "", date: "", hora_inicio: "", location: "", image: "", link: "#" });
      setEventoEditando(null);
      cargarEventos();
    } catch (err) {
      console.error("Error guardando evento", err);
    }
  };

  const handleEditar = (evento) => {
    setEventoEditando(evento);
    setFormValues({
      title: evento.title || evento.nombre,
      date: evento.date || evento.fecha,
      hora_inicio: evento.hora_inicio || "",
      location: evento.location || evento.lugar,
      image: evento.image || evento.cover_url,
      link: evento.link || evento.link || "#",
    });
  };

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/eventos/evento/${id}/`);
      cargarEventos();
    } catch (err) {
      console.error("Error eliminando evento", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-28">
      <h1 className="text-3xl font-bold text-[#C40180] mb-6">Panel de Administración de Eventos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          {[
            { label: "Título", name: "title" },
            { label: "Fecha", name: "date", type: "date" },
            { label: "Hora de Inicio", name: "hora_inicio", type: "time" },
            { label: "Ubicación", name: "location" },
            { label: "URL de Imagen", name: "image" },
            { label: "Link de Inscripción", name: "link" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formValues[name] || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md font-semibold text-white bg-[#C40180] hover:bg-[#a80166]"
          >
            {eventoEditando ? "Actualizar Evento" : "Crear Evento"}
          </button>
        </form>

        {/* Vista previa */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vista previa</h2>
          <EventCardWrapper {...formValues} />
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <div key={evento.id} className="relative group">
            <EventCardWrapper
              title={evento.title || evento.nombre}
              date={evento.date || evento.fecha}
              hora_inicio={evento.hora_inicio}
              location={evento.location || evento.lugar}
              image={evento.image || evento.cover_url}
              link={evento.link}
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => handleEditar(evento)}
                className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(evento.id)}
                className="bg-red-500 text-white px-2 py-1 text-sm rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}