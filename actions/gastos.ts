"use server";

import { prisma } from "@/lib/prisma";
import { CategoriaGasto } from "@prisma/client";
import { revalidatePath } from "next/cache";

const categoriasValidas: CategoriaGasto[] = [
  "INSUMOS",
  "SERVICIOS_BASICOS",
  "MANTENIMIENTO",
  "VARIOS",
];

function validarGasto(formData: FormData) {
  const concepto = String(formData.get("concepto") ?? "").trim();
  const monto = Number(formData.get("monto") ?? 0);
  const categoria = String(formData.get("categoria") ?? "") as CategoriaGasto;
  const fecha = String(formData.get("fecha") ?? "");

  if (!concepto) {
    throw new Error("El concepto es obligatorio.");
  }

  if (!Number.isFinite(monto) || monto <= 0) {
    throw new Error("El monto debe ser mayor a 0.");
  }

  if (!categoriasValidas.includes(categoria)) {
    throw new Error("La categoría seleccionada no es válida.");
  }

  const fechaConvertida = fecha ? new Date(`${fecha}T12:00:00`) : new Date();

  return {
    concepto,
    monto,
    categoria,
    fecha: fechaConvertida,
  };
}

export async function crearGasto(formData: FormData) {
  const datos = validarGasto(formData);

  const gasto = await prisma.gasto.create({
    data: datos,
  });

  revalidatePath("/gastos");
  revalidatePath("/dashboard");
  revalidatePath("/historial");

  return {
    success: true,
    id: gasto.id,
  };
}

export async function actualizarGasto(id: string, formData: FormData) {
  const datos = validarGasto(formData);

  const gastoExistente = await prisma.gasto.findUnique({
    where: { id },
  });

  if (!gastoExistente) {
    throw new Error("El gasto no existe.");
  }

  const gasto = await prisma.gasto.update({
    where: { id },
    data: datos,
  });

  revalidatePath("/", "layout");

  return {
    success: true,
    id: gasto.id,
  };
}

export async function eliminarGasto(id: string) {
  const gastoExistente = await prisma.gasto.findUnique({
    where: { id },
  });

  if (!gastoExistente) {
    throw new Error("El gasto no existe.");
  }

  await prisma.gasto.delete({
    where: { id },
  });

  revalidatePath("/", "layout");

  return {
    success: true,
  };
}
