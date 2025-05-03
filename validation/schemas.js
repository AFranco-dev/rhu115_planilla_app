const Joi = require("joi");

const empleadoSchema = Joi.object({
  empleado: Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    dui: Joi.string()
      .pattern(/^\d{8}-\d$/)
      .required(), // Ejemplo de validación de formato para DUI
    salarioMensual: Joi.number().min(0).required(),
    fechaIngreso: Joi.date().required(),
  }).required(),
});

module.exports = { empleadoSchema };
