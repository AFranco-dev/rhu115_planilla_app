// INTERNAL DEPENDENCIES
const { catchAsync } = require("../utils/catchers");
const AppError = require("../utils/AppError");
const { empleadoSchema } = require("../validation/schemas");

// JOI SCHEMA MIDDLEWARE
const empleadoSchemaCheck = catchAsync(async (req, res, next) => {
  const { nombre, apellido, dui, salarioMensual, fechaIngreso } = req.body;
  const { error } = empleadoSchema.validate({
    empleado: {
      nombre,
      apellido,
      dui,
      salarioMensual,
      fechaIngreso,
    },
  });

  if (error) {
    const msg = error.details.map((x) => x.message).join(", ");
    return next(new AppError(msg, 400));
  } else {
    next();
  }
});

const isLoggedIn = (req, res, next) => {
  console.log("REQ.USER...", req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
  next();
};

module.exports = {
  isLoggedIn,
  storeReturnTo,
  empleadoSchemaCheck,
};
