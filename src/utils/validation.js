export const formatters = {
    // Capitaliza la primera letra de cada palabra
    capitalizeWords: (text) => {
        if (!text) return "";
        return text
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    },

    // Formatea número de teléfono local (0212 123 4567)
    formatPhoneNumber: (value) => {
        if (!value) return '';
        // Eliminar todos los caracteres no numéricos
        const digits = value.replace(/\D/g, '');
        // Si tiene suficientes dígitos, formatear como 0212 123 4567
        if (digits.length >= 4) {
            const areaCode = digits.substring(0, 4);
            const firstPart = digits.substring(4, 7);
            const secondPart = digits.substring(7, 11);
            if (digits.length <= 4) {
                return areaCode;
            } else if (digits.length <= 7) {
                return `${areaCode} ${firstPart}`;
            } else {
                return `${areaCode} ${firstPart} ${secondPart}`;
            }
        }
        return digits;
    },

    // Permite solo números
    numbersOnly: (value) => value.replace(/\D/g, ''),

    // Para pasaportes (alfanuméricos en mayúscula)
    passportFormat: (value) => value.replace(/[^A-Za-z0-9]/g, "").toUpperCase(),
};

// Validadores comunes
export const validators = {
    // Valida email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Valida que el texto solo contenga letras, espacios y caracteres especiales permitidos en nombres
    isValidName: (value) => {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ'\s]+$/;
        return regex.test(value);
    },

    // Valida cédula (entre 7 y 8 dígitos)
    isValidIdCard: (value) => {
        return value.length >= 7 && value.length <= 8;
    },

    // Valida pasaporte (entre 4 y 15 caracteres)
    isValidPassport: (value) => {
        return value.length >= 4 && value.length <= 15;
    },

    // Valida que un campo tenga valor
    isNotEmpty: (value) => {
        return !!value && value.trim() !== '';
    },

    // Valida que la fecha corresponda a una persona mayor de edad (18+)
    isAdult: (birthDate) => {
        if (!birthDate) return false;

        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDifference = today.getMonth() - birthDateObj.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
        ) {
            age--;
        }

        return age >= 18;
    },

    // Calcula la edad basada en la fecha de nacimiento
    calculateAge: (birthDate) => {
        if (!birthDate) return '';

        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDifference = today.getMonth() - birthDateObj.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
        ) {
            age--;
        }

        return age.toString();
    }
};

// Sistema de reglas de validación por tipo de campo
export const validationRules = {
    // Reglas para campos de nombre
    name: {
        validator: validators.isValidName,
        formatter: formatters.capitalizeWords,
        errorMessage: "Solo se permiten letras y espacios"
    },

    // Reglas para cédula
    idCard: {
        validator: validators.isValidIdCard,
        formatter: formatters.numbersOnly,
        errorMessage: "La cédula debe tener entre 7 y 8 dígitos"
    },

    // Reglas para pasaporte
    passport: {
        validator: validators.isValidPassport,
        formatter: formatters.passportFormat,
        errorMessage: "El pasaporte debe tener entre 4 y 15 caracteres"
    },

    // Reglas para correo electrónico
    email: {
        validator: validators.isValidEmail,
        errorMessage: "Ingrese un correo electrónico válido"
    },

    // Reglas para teléfono
    phone: {
        formatter: formatters.formatPhoneNumber,
        errorMessage: "Ingrese un número de teléfono válido"
    },

    // Reglas para campos requeridos
    required: {
        validator: validators.isNotEmpty,
        errorMessage: "Este campo es obligatorio"
    },

    // Reglas para fecha de nacimiento (mayor de edad)
    birthDate: {
        validator: validators.isAdult,
        errorMessage: "Debe ser mayor de edad (18 años o más)"
    }
};

// Configura validaciones para cada paso del formulario
export const formStepValidations = {
    // Paso 1: Información Personal
    personalInfo: [
        { field: 'documentType', rules: ['required'] },
        {
            field: 'identityCard', rules: ['required'], conditionalRules: {
                documentType: {
                    'cedula': ['idCard'],
                    'pasaporte': ['passport']
                }
            }
        },
        { field: 'firstName', rules: ['required', 'name'] },
        { field: 'firstLastName', rules: ['required', 'name'] },
        { field: 'birthDate', rules: ['required', 'birthDate'] },
        { field: 'gender', rules: ['required'] },
        { field: 'maritalStatus', rules: ['required'] }
    ],

    // Paso 2: Información de Contacto
    contactInfo: [
        { field: 'email', rules: ['required', 'email'] },
        { field: 'phoneNumber', rules: ['required'] },
        { field: 'address', rules: ['required'] },
        { field: 'city', rules: ['required'] },
        { field: 'state', rules: ['required'] }
    ],

    // Paso 3: Información del Colegiado
    collegueInfo: [
        { field: 'tipo_profesion', rules: ['required'] },
        { field: 'graduateInstitute', rules: ['required'] },
        { field: 'universityTitle', rules: ['required'] },
        { field: 'mppsRegistrationNumber', rules: ['required'] },
        { field: 'mppsRegistrationDate', rules: ['required'] },
        { field: 'titleIssuanceDate', rules: ['required'] },
        // Condicional para odontólogos
        {
            field: 'mainRegistrationNumber', rules: [], conditionalRules: {
                tipo_profesion: {
                    'odontologo': ['required']
                }
            }
        },
        {
            field: 'mainRegistrationDate', rules: [], conditionalRules: {
                tipo_profesion: {
                    'odontologo': ['required']
                }
            }
        }
    ],

    // Paso 4: Información Laboral (solo si está laborando)
    laboralInfo: [
        { field: 'institutionName', rules: ['required'], condition: (formData) => formData.workStatus === 'labora' },
        { field: 'institutionAddress', rules: ['required'], condition: (formData) => formData.workStatus === 'labora' },
        { field: 'institutionPhone', rules: ['required'], condition: (formData) => formData.workStatus === 'labora' },
        { field: 'cargo', rules: ['required'], condition: (formData) => formData.workStatus === 'labora' },
        { field: 'institutionType', rules: ['required'], condition: (formData) => formData.workStatus === 'labora' }
    ],

    // Paso 5: Documentos Requeridos
    docsRequirements: [
        { field: 'ci', rules: ['required'] },
        { field: 'rif', rules: ['required'] },
        { field: 'titulo', rules: ['required'] },
        { field: 'mpps', rules: ['required'] },
        // Condicionales para técnicos e higienistas
        {
            field: 'fondo_negro_titulo_bachiller', rules: [], conditionalRules: {
                tipo_profesion: {
                    'tecnico': ['required'],
                    'higienista': ['required']
                }
            }
        },
        {
            field: 'fondo_negro_credencial', rules: [], conditionalRules: {
                tipo_profesion: {
                    'tecnico': ['required'],
                    'higienista': ['required']
                }
            }
        },
        {
            field: 'notas_curso', rules: [], conditionalRules: {
                tipo_profesion: {
                    'tecnico': ['required'],
                    'higienista': ['required']
                }
            }
        }
    ]
};

// Función principal de validación
export const validateFormData = (formData, stepName) => {
    const validations = formStepValidations[stepName];
    const errors = {};

    if (!validations) return errors;

    validations.forEach(validation => {
        const { field, rules, conditionalRules, condition } = validation;

        // Verificar si hay una condición para aplicar esta validación
        if (condition && !condition(formData)) {
            return;
        }

        // Obtener el valor del campo
        const value = formData[field];

        // Procesar reglas estándar
        if (rules && rules.length > 0) {
            for (const ruleName of rules) {
                const rule = validationRules[ruleName];

                if (rule && rule.validator && !rule.validator(value)) {
                    errors[field] = rule.errorMessage;
                    break;
                }
            }
        }

        // Procesar reglas condicionales basadas en valores de otros campos
        if (conditionalRules) {
            for (const condField in conditionalRules) {
                const condValue = formData[condField];
                const rulesForValue = conditionalRules[condField][condValue];

                if (rulesForValue) {
                    for (const ruleName of rulesForValue) {
                        const rule = validationRules[ruleName];

                        if (rule && rule.validator && !rule.validator(value)) {
                            errors[field] = rule.errorMessage;
                            break;
                        }
                    }
                }
            }
        }
    });

    return errors;
};