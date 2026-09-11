import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sucursal1 = await prisma.sucursal.create({
    data: {
      nombre: "Sucursal 1",
    },
  });

  const sucursal2 = await prisma.sucursal.create({
    data: {
      nombre: "Sucursal 2",
    },
  });

  console.log("Sucursales creadas correctamente.");
  console.log(sucursal1);
  console.log(sucursal2);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });