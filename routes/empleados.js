// EXTERNAL DEPENDENCIES
const express = require("express");
const router = express.Router({ mergeParams: true });

// INTERNAL DEPENDENCIES
const { isLoggedIn, empleadoSchemaCheck } = require("../utils/middleware");
const {
  createEmpleado,
  showCreateEmpleadoForm,
  showEmpleadoIndex,
  showEmpleadoWithId,
  editEmpleadoWithId,
  showEditEmpleadoWithIdForm,
  deleteEmpleadoWithId,
  showCalculator,
} = require("../controllers/empleadoController");

// EMPLEADO OPERATIONS

// CREATE
// CREATE NEW EMPLEADO
router.post("", isLoggedIn, empleadoSchemaCheck, createEmpleado);
// SHOW CREATE NEW EMPLEADO FORM
router.get("/create", isLoggedIn, showCreateEmpleadoForm);

// READ
// SHOW ALL EMPLEADOS
router.get("", isLoggedIn, showEmpleadoIndex);
// SHOW ALL EMPLEADOS
router.get("/calculator", isLoggedIn, showCalculator);
// SHOW EMPLEADO WITH ID
router.get("/:id", isLoggedIn, showEmpleadoWithId);

// UPDATE
// EDIT EMPLEADO BY ID
router.put("/:id", isLoggedIn, empleadoSchemaCheck, editEmpleadoWithId);
// SHOW EDIT EMPLEADO BY ID FORM
router.get("/:id/edit", isLoggedIn, showEditEmpleadoWithIdForm);

// DELETE
// DELETE EMPLEADO BY ID
router.delete("/:id", isLoggedIn, deleteEmpleadoWithId);

module.exports = router;
