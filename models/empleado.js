// DEPENDENCIAS
const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmpleadoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  dui: {
    type: String,
    required: true,
  },
  salarioMensual: {
    type: Number,
    required: true,
  },
  fechaIngreso: {
    type: Date,
    required: true,
  },
});

//---------------------------
//-----CAMPOS CALCULADOS-----
//---------------------------

// Función para calcular el salario diario
EmpleadoSchema.virtual("salarioDiario").get(function () {
  return parseFloat((this.salarioMensual / 30).toFixed(2));
});

// Cálculo ISSS patronal y empleado
EmpleadoSchema.methods.isssPatronal = function () {
  const topeISSS = 1000;
  const tasaISSSPatronal = 0.075;
  const salarioBase = Math.min(this.salarioMensual, topeISSS);
  return parseFloat((salarioBase * tasaISSSPatronal).toFixed(2));
};

EmpleadoSchema.methods.isssEmpleado = function () {
  const topeISSS = 1000;
  const tasaISSSEmpleado = 0.03;
  const salarioBase = Math.min(this.salarioMensual, topeISSS);
  return parseFloat((salarioBase * tasaISSSEmpleado).toFixed(2));
};

// Cálculo AFP patronal y afiliado
EmpleadoSchema.methods.afpPatronal = function () {
  const tasaAFPPatronal = 0.0875;
  return parseFloat((this.salarioMensual * tasaAFPPatronal).toFixed(2));
};

EmpleadoSchema.methods.afpAfiliado = function () {
  const tasaAFPAfiliado = 0.0725;
  return parseFloat((this.salarioMensual * tasaAFPAfiliado).toFixed(2));
};

// Cálculo del bono por vacaciones
EmpleadoSchema.methods.bonoVacaciones = function (diasVacaciones = 0) {
  const salarioDiario = this.salarioDiario;
  const bonoPorDia = salarioDiario * 0.3;
  diasVacaciones = Math.min(diasVacaciones, 15);
  return parseFloat((bonoPorDia * diasVacaciones).toFixed(2));
};

// Salario antes de la renta
EmpleadoSchema.methods.salarioAntesRenta = function () {
  const isssEmpleado = this.isssEmpleado();
  const afpEmpleado = this.afpAfiliado();
  return parseFloat(
    (this.salarioMensual - isssEmpleado - afpEmpleado).toFixed(2)
  );
};

// Cálculo de la renta
EmpleadoSchema.methods.renta = function () {
  const salarioAntesRenta = this.salarioAntesRenta(); // Ajustar según los días de vacaciones
  let renta = 0;
  if (salarioAntesRenta > 0 && salarioAntesRenta <= 472.0) {
    renta = 0;
  } else if (salarioAntesRenta > 472.0 && salarioAntesRenta <= 895.24) {
    renta = (salarioAntesRenta - 472.0) * 0.1 + 17.67;
  } else if (salarioAntesRenta > 895.24 && salarioAntesRenta <= 2038.1) {
    renta = (salarioAntesRenta - 895.24) * 0.2 + 60.0;
  } else if (salarioAntesRenta > 2038.1) {
    renta = (salarioAntesRenta - 2038.1) * 0.3 + 288.57;
  }
  return parseFloat(renta.toFixed(2));
};

// Cálculo del aguinaldo
EmpleadoSchema.methods.aguinaldo = function (pagoAguinaldo) {
  if (pagoAguinaldo) {
    const salarioDiario = this.salarioDiario;
    const fechaActual = new Date();
    const antiguedadEnAnios =
      fechaActual.getFullYear() - this.fechaIngreso.getFullYear();
    const mesesTrabajados =
      fechaActual.getMonth() -
      this.fechaIngreso.getMonth() +
      antiguedadEnAnios * 12;

    let diasAguinaldo;
    if (antiguedadEnAnios < 1) {
      diasAguinaldo = 15 * (mesesTrabajados / 12);
    } else if (antiguedadEnAnios >= 1 && antiguedadEnAnios < 3) {
      diasAguinaldo = 15;
    } else if (antiguedadEnAnios >= 3 && antiguedadEnAnios < 10) {
      diasAguinaldo = 19;
    } else {
      diasAguinaldo = 21;
    }

    return parseFloat((salarioDiario * diasAguinaldo).toFixed(2));
  } else {
    return 0;
  }
};

// Cálculo del salario líquido
EmpleadoSchema.methods.salarioLiquido = function (pagoAguinaldo) {
  const salarioAntesRenta = this.salarioAntesRenta();
  const renta = this.renta();
  const aguinaldo = this.aguinaldo(pagoAguinaldo);
  return parseFloat((salarioAntesRenta - renta + aguinaldo).toFixed(2));
};

const Empleado = mongoose.model("Empleado", EmpleadoSchema);

module.exports = Empleado;
