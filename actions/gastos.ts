"use server";

import { prisma } from "@/lib/prisma";

import { CategoriaGasto } from "@prisma/client";

import { revalidatePath } from "next/cache";

const categoriasValidas = [
  "INSUMOS",
  "SERVICIOS_BASICOS",
  "MANTENIMIENTO",
  "VARIOS",
];

export async function crearGasto(formData: FormData) {
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

  const gasto = await prisma.gasto.create({
    data: {
      concepto,
      monto,
      categoria,

      ...(fecha
        ? {
            fecha: new Date(`${fecha}T12:00:00`),
          }
        : {}),
    },
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
  const concepto = String(formData.get("concepto") ?? "").trim();

  const monto = Number(formData.get("monto") ?? 0);

  const categoria = String(formData.get("categoria") ?? "") as CategoriaGasto;

  const fecha = String(formData.get("fecha") ?? "");

  if (!id) {
    throw new Error("No se encontró el gasto.");
  }

  if (!concepto) {
    throw new Error("El concepto es obligatorio.");
  }

  if (!Number.isFinite(monto) || monto <= 0) {
    throw new Error("El monto debe ser mayor a 0.");
  }

  if (!categoriasValidas.includes(categoria)) {
    throw new Error("La categoría seleccionada no es válida.");
  }

  await prisma.gasto.update({
    where: {
      id,
    },

    data: {
      concepto,
      monto,
      categoria,

      ...(fecha
        ? {
            fecha: new Date(`${fecha}T12:00:00`),
          }
        : {}),
    },
  });

  revalidatePath("/gastos");
  revalidatePath("/dashboard");
  revalidatePath("/historial");

  return {
    success: true,
  };
}

export async function eliminarGasto(id: string) {
  if (!id) {
    throw new Error("No se encontró el gasto.");
  }

  await prisma.gasto.delete({
    where: {
      id,
    },
  });

  revalidatePath("/gastos");
  revalidatePath("/dashboard");
  revalidatePath("/historial");

  return {
    success: true,
  };
}
