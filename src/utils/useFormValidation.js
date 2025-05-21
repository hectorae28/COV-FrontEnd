import { useEffect, useState } from 'react';
import { formatters, validateFormData } from '../utils/validation';

/**
 * Hook personalizado para manejar la validación de formularios
 * 
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {String} validationStep - Paso de validación (personalInfo, contactInfo, etc.)
 * @returns {Object} - Métodos y estados para manejar el formulario con validación
 */
const useFormValidation = (initialValues = {}, validationStep) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValid, setIsValid] = useState(false);

    // Actualizar valores cuando cambian los valores iniciales
    useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    // Validar el formulario cuando cambian los valores o cuando se intenta enviar
    useEffect(() => {
        if (validationStep && (isSubmitting || Object.keys(touched).length > 0)) {
            const validationErrors = validateFormData(values, validationStep);
            setErrors(validationErrors);
            setIsValid(Object.keys(validationErrors).length === 0);
        }
    }, [values, isSubmitting, touched, validationStep]);

    /**
     * Maneja cambios en los campos del formulario con procesamiento opcional
     * @param {Object|Event} event - Evento del cambio o objeto con name y value
     * @param {String} formatter - Nombre opcional del formateador a aplicar
     */
    const handleChange = (event, formatter = null) => {
        let name, value;

        // Determinar si estamos recibiendo un evento del DOM o un objeto {name, value}
        if (event && event.target) {
            name = event.target.name;
            value = event.target.value;
        } else if (typeof event === 'object') {
            // Si se pasa un objeto con actualizaciones
            const updates = event;

            // Actualizar todos los campos enviados
            setValues(prev => ({
                ...prev,
                ...updates
            }));

            // Marcar todos los campos como touched
            const newTouched = { ...touched };
            Object.keys(updates).forEach(field => {
                newTouched[field] = true;
            });
            setTouched(newTouched);

            return;
        } else {
            return;
        }

        // Aplicar formateador si se especifica
        if (formatter && formatters[formatter]) {
            value = formatters[formatter](value);
        }

        setValues(prev => ({
            ...prev,
            [name]: value
        }));

        // Marcar el campo como tocado
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    /**
     * Maneja el enfoque de los campos (para validación de tipo touched)
     * @param {Event} event - Evento del DOM
     */
    const handleBlur = (event) => {
        const { name } = event.target;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    /**
     * Valida el formulario completo
     * @returns {Boolean} - true si el formulario es válido
     */
    const validateForm = () => {
        setIsSubmitting(true);

        // Marcar todos los campos como touched
        const allTouched = {};
        Object.keys(values).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        return isValid;
    };

    /**
     * Reinicia el formulario a sus valores iniciales
     */
    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    };

    return {
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
        handleChange,
        handleBlur,
        setValues,
        validateForm,
        resetForm
    };
};

export default useFormValidation;