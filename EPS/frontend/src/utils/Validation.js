/**
 * Valida los datos de un formulario basado en un conjunto de reglas.
 * @param {object} formData - Los datos actuales del formulario.
 * @param {object} rules - Un objeto donde cada clave es un campo del formulario
 * y su valor es una función que valida ese campo.
 * La función de validación debe retornar `true` si hay un error, `false` si no.
 * @returns {{errors: object, isValid: boolean}} - Un objeto con los errores (booleanos) y un booleano indicando validez.
 */
export const validateForm = (formData, rules) => {
  let isValid = true;
  const newErrors = {};

  for (const field in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, field)) {
      const rule = rules[field];
      // La regla retorna true si hay error (ej. campo vacío, formato incorrecto), false si está bien.
      if (rule(formData[field], formData)) { // Pasamos formData completo por si una regla depende de otros campos
        newErrors[field] = true; // Hay un error
        isValid = false;
      } else {
        newErrors[field] = false; // No hay error
      }
    }
  }
  return { errors: newErrors, isValid };
};