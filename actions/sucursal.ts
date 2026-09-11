"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  crearSesion,
  obtenerSesion,
} from "@/lib/auth";

export async function seleccionarSucursal(
  sucursalId: string,
) {
  const sesion = await obtenerSesion();

  if (!sesion) {
    redirect("/login");
  }

  const sucursal = await prisma.sucursal.findUnique({
    where: {
      id: sucursalId,
    },
  });

  if (!sucursal) {
    throw new Error("La sucursal no existe.");
  }

  await crearSesion(
    sesion.usuarioId,
    sesion.rol,
    sucursal.id,
  );

  if (sesion.rol === "ADMINISTRADOR") {
    redirect("/dashboard");
  }

  redirect("/pedidos");
}