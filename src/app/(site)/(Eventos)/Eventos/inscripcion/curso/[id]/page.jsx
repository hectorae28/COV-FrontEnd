import api from "@/api/api";
import DynamicForm from "../../Components/dynamicForm";
import Image from "next/image";

export default async function CourseShowcase({ params }) {
  const { id } = await params;
  const options = { method: "GET" };

  const res = await api.get(`/eventos/curso/${id}/`);
  const data = await res.data;
  const courseData = data;
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const formatDuration = (durationString) => {
    const [hours, minutes] = durationString.split(":");
    return `${hours} horas`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-18 md:mt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src={
              courseData.cover_url
                ? `${process.env.NEXT_PUBLIC_BACK_HOST}${courseData.cover_url}`
                : "/placeholder.svg"
            }
            alt={courseData.nombre}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {courseData.nombre}
              </h1>
              <p className="text-gray-600 mb-4">
                Impartido por:{" "}
                <span className="font-medium">{courseData.instructores}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end">
              {courseData.precio !== null && (
                <div className="bg-green-100 text-green-800 font-bold py-2 px-4 rounded-full text-xl mb-2">
                  {courseData.precio}$
                </div>
              )}
              <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm">
                {courseData.cupos} plazas disponibles
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1  gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Descripción
              </h2>
              <p className="text-gray-700">{courseData.descripcion}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Detalles del curso
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fechas</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(courseData.starts_at)}
                      {courseData.ends_at &&
                        " - " + formatDate(courseData.ends_at)}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Horario</p>
                    <p className="text-sm text-gray-600">
                      Comienza a las {formatTime(courseData.hora_inicio)}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Duración
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDuration(courseData.duracion)}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Ubicación
                    </p>
                    <p className="text-sm text-gray-600">{courseData.lugar}</p>
                  </div>
                </li>
              </ul>
            </div>

            <DynamicForm
              formulario={{
                ...data.formulario,
                evento: null,
                curso: id,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
