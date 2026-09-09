import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function preguntar(pregunta: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pregunta, (respuesta) => {
      resolve(respuesta.trim());
    });
  });
}

async function main() {
  const nombre = await preguntar("Nombre del empleado: ");
  const usuario = await preguntar("Usuario: ");
  const password = await preguntar("Contraseña: ");

  if (!nombre || !usuario || !password) {
    console.log("Todos los campos son obligatorios.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const empleado = await prisma.usuario.create({
    data: {
      nombre,
      usuario,
      password: passwordHash,
      rol: "EMPLEADO",
    },
  });

  console.log("\nEmpleado creado correctamente.");
  console.log(`Nombre: ${empleado.nombre}`);
  console.log(`Usuario: ${empleado.usuario}`);
  console.log(`Rol: ${empleado.rol}`);
}

main()
  .catch((error) => {
    console.error("\nError al crear el empleado:", error);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });