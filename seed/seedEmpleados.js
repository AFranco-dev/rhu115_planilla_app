const mongoose = require("mongoose");
const Empleado = require("../models/empleado"); // Asegúrate de que la ruta sea correcta
// MONGOOSE MODELS
const User = require("../models/user");

// Conexión a la base de datos
const dbPath = "mongodb://127.0.0.1:27017/planillaapp";
mongoose.connect(dbPath, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a la base de datos");
});

// Datos fijos para los empleados
const empleadosFijos = [
  {
    nombre: "Juan",
    apellido: "Pérez",
    dui: "12345678-1",
    salarioMensual: 800,
    fechaIngreso: new Date("2021-01-10"),
  },
  {
    nombre: "María",
    apellido: "García",
    dui: "12345678-2",
    salarioMensual: 900,
    fechaIngreso: new Date("2020-05-15"),
  },
  {
    nombre: "Carlos",
    apellido: "Martínez",
    dui: "12345678-3",
    salarioMensual: 750,
    fechaIngreso: new Date("2022-03-08"),
  },
  {
    nombre: "Ana",
    apellido: "López",
    dui: "12345678-4",
    salarioMensual: 1100,
    fechaIngreso: new Date("2019-12-21"),
  },
  {
    nombre: "Luis",
    apellido: "Hernández",
    dui: "12345678-5",
    salarioMensual: 950,
    fechaIngreso: new Date("2021-06-17"),
  },
  {
    nombre: "Sofía",
    apellido: "Gómez",
    dui: "12345678-6",
    salarioMensual: 1200,
    fechaIngreso: new Date("2018-09-30"),
  },
  {
    nombre: "Miguel",
    apellido: "Ruiz",
    dui: "12345678-7",
    salarioMensual: 600,
    fechaIngreso: new Date("2023-02-01"),
  },
  {
    nombre: "Elena",
    apellido: "Fernández",
    dui: "12345678-8",
    salarioMensual: 700,
    fechaIngreso: new Date("2021-04-25"),
  },
  {
    nombre: "David",
    apellido: "Torres",
    dui: "12345678-9",
    salarioMensual: 1300,
    fechaIngreso: new Date("2020-07-20"),
  },
  {
    nombre: "Laura",
    apellido: "Ramírez",
    dui: "12345678-0",
    salarioMensual: 850,
    fechaIngreso: new Date("2019-11-11"),
  },
  {
    nombre: "Jorge",
    apellido: "Flores",
    dui: "22345678-1",
    salarioMensual: 1000,
    fechaIngreso: new Date("2022-10-05"),
  },
  {
    nombre: "Isabel",
    apellido: "Sánchez",
    dui: "22345678-2",
    salarioMensual: 1150,
    fechaIngreso: new Date("2021-08-19"),
  },
  {
    nombre: "Daniel",
    apellido: "Jiménez",
    dui: "22345678-3",
    salarioMensual: 680,
    fechaIngreso: new Date("2020-06-07"),
  },
  {
    nombre: "Marta",
    apellido: "Reyes",
    dui: "22345678-4",
    salarioMensual: 770,
    fechaIngreso: new Date("2023-01-29"),
  },
  {
    nombre: "José",
    apellido: "Morales",
    dui: "22345678-5",
    salarioMensual: 1400,
    fechaIngreso: new Date("2018-03-15"),
  },
];

// Datos del usuario inicial
const usuarioInicial = {
  username: "admin", // Recuerda usar un hash de contraseña en producción
  email: "admin@tech.dev", // Asegúrate de que este campo coincida con tu modelo
};

// Función principal para eliminar y crear empleados
const seedEmpleados = async () => {
  try {
    // Elimina todos los empleados existentes
    await Empleado.deleteMany({});
    console.log("Todos los empleados han sido eliminados");

    // Inserta los empleados fijos
    await Empleado.insertMany(empleadosFijos);
    console.log("15 empleados fijos han sido creados");

    // Eliminar usuarios existentes
    await User.deleteMany({});
    console.log("Todos los usuarios han sido eliminados");

    // Crear usuario inicial
    const usuario = new User(usuarioInicial);
    await User.register(usuario, "admin");
    console.log("Usuario administrador inicial creado: admin/admin");
  } catch (error) {
    console.error("Error al crear empleados:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecuta la función principal
seedEmpleados();
