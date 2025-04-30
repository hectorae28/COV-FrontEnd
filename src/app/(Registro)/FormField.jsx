
// Componente reutilizable para campos de formulario
export default function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    error = false,
    options,
    children,
    ...props
}) {
    // Para campos select con opciones
    if (type === "select" && options) {
        return (
            <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                    <select
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        className={`w-full px-4 py-3 border ${error ? "border-red-500 bg-red-50" : "border-gray-200"
                            } rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
            appearance-none text-gray-700`}
                        {...props}
                    >
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
                )}
            </div>
        );
    }

    // Para campos de fecha
    if (type === "date") {
        return (
            <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                    <input
                        type="date"
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        className={`w-full px-4 py-3 border ${error ? "border-gray-500 bg-gray-50" : "border-gray-200"
                            } rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
            text-gray-700`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
                )}
            </div>
        );
    }

    // Para campos de archivo
    if (type === "file") {
        return (
            <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">{children}</div>
                {error && (
                    <p className="mt-1 text-xs text-red-500">
                        Este documento es obligatorio
                    </p>
                )}
            </div>
        );
    }

    // Para textarea
    if (type === "textarea") {
        return (
            <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <textarea
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className={`w-full px-4 py-3 border ${error ? "border-gray-500 bg-gray-50" : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] min-h-[100px]`}
                    placeholder={placeholder}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
                )}
            </div>
        );
    }

    // Para campos de texto estándar (default)
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                className={`w-full px-4 py-3 border ${error ? "border-gray-500 bg-gray-50" : "border-gray-200"
                    } rounded-xl 
        focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                placeholder={placeholder}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
            )}
        </div>
    );
}
