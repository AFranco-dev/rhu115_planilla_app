// MONGOOSE MODELS
const Empleado = require("../models/empleado");
// INTERNAL DEPENDENCIES
const { catchAsync, catchSync } = require("../utils/catchers");

// Crear un nuevo empleado
const createEmpleado = catchAsync(async (req, res, next) => {
  const { nombre, apellido, dui, salarioMensual, fechaIngreso } = req.body;
  const nuevoEmpleado = new Empleado({
    nombre,
    apellido,
    dui,
    salarioMensual,
    fechaIngreso,
  });
  await nuevoEmpleado.save();
  req.flash("success", "¡Empleado creado exitosamente!");
  res.redirect(`/empleados/${nuevoEmpleado._id}`);
});

// Mostrar el formulario de creación de empleado
const showCreateEmpleadoForm = catchSync((req, res, next) => {
  res.render("empleado/create", {
    name: "Crear Nuevo Empleado",
  });
});

// Mostrar todos los empleados
const showEmpleadoIndex = catchAsync(async (req, res, next) => {
  const empleados = await Empleado.find();
  res.render("empleado/index", { empleados, name: "Empleados" });
});

// Mostrar calculadora de salarios
const showCalculator = catchAsync(async (req, res, next) => {
  const empleados = await Empleado.find();
  res.render("empleado/calculator", { empleados, name: "Calculadora" });
});

// Mostrar detalles de un empleado específico
const showEmpleadoWithId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const empleado = await Empleado.findById(id);
  if (!empleado) {
    req.flash("error", "No se pudo encontrar ese empleado");
    return res.redirect("/empleados");
  }
  res.render("empleado/details", {
    empleado,
    name: `${empleado.nombre} ${empleado.apellido}`,
  });
});

// Editar un empleado específico
const editEmpleadoWithId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { nombre, apellido, dui, salarioMensual, fechaIngreso } = req.body;
  const empleadoEditado = await Empleado.findByIdAndUpdate(
    id,
    { nombre, apellido, dui, salarioMensual, fechaIngreso },
    { runValidators: true, new: true }
  );
  if (!empleadoEditado) {
    req.flash("error", "No se pudo encontrar ese empleado");
    return res.redirect("/empleados");
  }
  req.flash("success", "¡Empleado editado exitosamente!");
  res.redirect(`/empleados/${empleadoEditado._id}`);
});

// Mostrar formulario de edición de empleado
const showEditEmpleadoWithIdForm = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const empleado = await Empleado.findById(id);
  if (!empleado) {
    req.flash("error", "No se pudo encontrar ese empleado");
    return res.redirect("/empleados");
  }
  res.render("empleado/edit", {
    empleado,
    name: `Editar ${empleado.nombre} ${empleado.apellido}`,
  });
});

// Eliminar un empleado específico
const deleteEmpleadoWithId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const empleadoEliminado = await Empleado.findByIdAndDelete(id);
  if (empleadoEliminado) {
    req.flash(
      "success",
      `¡Empleado ${empleadoEliminado.nombre} ${empleadoEliminado.apellido} eliminado exitosamente!`
    );
    res.redirect("/empleados");
  } else {
    req.flash("error", "No se pudo encontrar ese empleado");
    res.redirect("/empleados");
  }
});

module.exports = {
  createEmpleado,
  showCreateEmpleadoForm,
  showEmpleadoIndex,
  showEmpleadoWithId,
  editEmpleadoWithId,
  showEditEmpleadoWithIdForm,
  deleteEmpleadoWithId,
  showCalculator,
};
