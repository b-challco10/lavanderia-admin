import { PrismaClient, RolUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function preguntar(texto: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(texto, resolve);
  });
}

async function main() {
  console.log("\n=== CREAR ADMINISTRADOR ===\n");

  const nombre = (await preguntar("Nombre: ")).trim();
  const usuario = (await preguntar("Usuario: ")).trim();
  const password = (await preguntar("Contraseña: ")).trim();

  if (!nombre || !usuario || !password) {
    throw new Error("Todos los campos son obligatorios.");
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { usuario },
  });

  if (usuarioExistente) {
    throw new Error(`El usuario "${usuario}" ya existe.`);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const administrador = await prisma.usuario.create({
    data: {
      nombre,
      usuario,
      password: passwordHash,
      rol: RolUsuario.ADMINISTRADOR,
    },
  });

  console.log("\nAdministrador creado correctamente.");
  console.log(`Nombre: ${administrador.nombre}`);
  console.log(`Usuario: ${administrador.usuario}`);
  console.log(`Rol: ${administrador.rol}\n`);
}

main()
  .catch((error) => {
    console.error("\nError:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    rl.close();
  });