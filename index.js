const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "1234",
  database: "alwaysmusic",
  port: 5432
};

const pool = new Pool(config);

// manejo del process.argv
const argumentos = process.argv.slice(2);
// posicion 0 funcion a usar
const funcion = argumentos[0];

// resto de posiciones los otros campos
const rut = argumentos[1];
const nombre = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

console.log("**********");
console.log("Funcion: " + funcion);
console.log("Nombre: " + nombre);
console.log("Rut: " + rut);
console.log("Curso: " + curso);
console.log("Nivel: " + nivel);
console.log("**********");

// Función para agregar un nuevo alumno
const nuevoAlumno = async ({ rut, nombre, curso, nivel }) => {
  try {
    const res = await pool.query(
      `INSERT INTO alumnos (rut, nombre, curso, nivel) VALUES ($1,$2,$3,$4) RETURNING *`,
      [rut, nombre, curso, nivel]
    );
    console.log(`Alumno ${nombre} ${rut} agregado con éxito`);
    console.log("Alumno Agregado: ", res.rows[0]);
  } catch (error) {
    console.error("Error al agregar el alumno:", error.message);
  }
};

// Función para consultar alumno por rut
const consultaRut = async ({ rut }) => {
  try {
    const res = await pool.query(
      `SELECT * FROM alumnos WHERE rut=$1`,
      [rut]
    );
    if (res.rows.length > 0) {
      console.log("Alumno consultado: ", res.rows[0]);
    } else {
      console.log(`No se encontró ningún alumno con el rut ${rut}`);
    }
  } catch (error) {
    console.error("Error al consultar por rut:", error.message);
  }
};

// Función para consultar todos los alumnos registrados
const getAlumno = async () => {
  try {
    const res = await pool.query("SELECT * FROM alumnos");
    if (res.rows.length > 0) {
      console.log("Alumnos registrados:", res.rows);
    } else {
      console.log("No hay alumnos registrados en la base de datos.");
    }
  } catch (error) {
    console.error("Error al obtener todos los alumnos:", error.message);
  }
};

// Función para actualizar un alumno por su rut
const actualizarAlumno = async ({ rut, nombre, curso, nivel }) => {
  try {
    const res = await pool.query(
      `UPDATE alumnos SET nombre=$2, curso=$3, nivel=$4 WHERE rut=$1 RETURNING *`,
      [rut, nombre, curso, nivel]
    );
    if (res.rows.length > 0) {
      console.log(`Alumno con rut ${rut} actualizado con éxito`);
      console.log("Alumno Actualizado: ", res.rows[0]);
    } else {
      console.log(`No hay ningún Alumno con el rut ${rut}`);
    }
  } catch (error) {
    console.error("Error al actualizar el Alumno:", error.message);
  }
};

// Función para eliminar un alumno por su rut
const eliminarAlumno = async ({ rut }) => {
  try {
    const res = await pool.query(
      `DELETE FROM alumnos WHERE rut=$1 RETURNING *`,
      [rut]
    );
    if (res.rows.length > 0) {
      console.log(`Alumno con rut ${rut} Eliminado con éxito`);
      console.log("Alumno Eliminado: ", res.rows[0]);
    } else {
      console.log(`No hay ningún Alumno con el rut ${rut}`);
    }
  } catch (error) {
    console.error("Error al eliminar el Alumno:", error.message);
  }
};

// Función IIFE que recibe de la línea de comando y llama funciones asíncronas internas
(async () => {
  try {
    // recibir funciones y campos de la línea de comando
    switch (funcion) {
      case 'agregar':
        await nuevoAlumno({ rut, nombre, curso, nivel });
        break;
      case 'rut':
        await consultaRut({ rut });
        break;
      case 'consulta':
        await getAlumno();
        break;
      case 'actualizar':
        await actualizarAlumno({ rut, nombre, curso, nivel });
        break;
      case 'eliminar':
        await eliminarAlumno({ rut });
        break;
      default:
        console.log("Funcion: " + funcion + " no es válida");
        break;
    }
  } catch (error) {
    console.error("Error en la ejecución del programa:", error.message);
  } finally {
    pool.end();
  }
})();




// instrucciones de uso;
// consultar todos: node index consulta
// consultar por rut: node index rut 5555864
// ingresar datos: node index agregar 5555864 Abraham trompeta 5
// actualizar datos: node index actualizar 5555864 piano 6
// eliminar datos: node index eliminar 5555864

