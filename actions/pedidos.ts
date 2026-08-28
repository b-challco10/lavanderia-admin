"use server";

import { prisma } from "@/lib/prisma";
import { EstadoPago, EstadoServicio } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function crearPedido(formData: FormData) {
  const nombreCliente = String(formData.get("nombreCliente") ?? "").trim();
  const telefonoCliente = String(formData.get("telefonoCliente") ?? "").trim();
  const detallePrendas = String(formData.get("detallePrendas") ?? "").trim();
  const montoTotal = Number(formData.get("montoTotal") ?? 0);
  const montoAdelanto = Number(formData.get("montoAdelanto") ?? 0);
  const estadoPago = String(
    formData.get("estadoPago") ?? "PENDIENTE",
  ) as EstadoPago;

  if (!nombreCliente) {
    throw new Error("El nombre del cliente es obligatorio.");
  }

  if (!detallePrendas) {
    throw new Error("Debes indicar el detalle del servicio.");
  }

  if (!Number.isFinite(montoTotal) || montoTotal <= 0) {
    throw new Error("El monto total debe ser mayor a 0.");
  }

  if (
    !Number.isFinite(montoAdelanto) ||
    montoAdelanto < 0 ||
    montoAdelanto > montoTotal
  ) {
    throw new Error("El adelanto debe estar entre 0 y el monto total.");
  }

  const pedido = await prisma.pedido.create({
    data: {
      nombreCliente,
      telefonoCliente: telefonoCliente || null,
      detallePrendas,
      montoTotal,
      montoAdelanto,
      estadoPago,
    },
  });

  revalidatePath("/pedidos");
  revalidatePath("/dashboard");
  revalidatePath("/historial");

  return {
    success: true,
    id: pedido.id,
  };
}

export async function actualizarEstadoPedido(
  id: string,
  estadoServicio: EstadoServicio,
) {
  const pedido = await prisma.pedido.update({
    where: { id },
    data: { estadoServicio },
  });

  revalidatePath("/", "layout");

  return {
    success: true,
    estadoServicio: pedido.estadoServicio,
  };
}

export async function eliminarPedido(id: string) {
  try {
    await prisma.pedido.delete({
      where: { id },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error al eliminar pedido:", error);

    return {
      success: false,
      error: "No se pudo eliminar el pedido.",
    };
  }
}

export async function editarPedido(data: {
  id: string;
  nombreCliente: string;
  telefonoCliente: string;
  detallePrendas: string;
  montoTotal: number;
  montoAdelanto: number;
  estadoPago: "PAGADO" | "PENDIENTE";
  estadoServicio:
    | "RECIBIDO"
    | "EN_PROCESO"
    | "LISTO_PARA_ENTREGAR"
    | "ENTREGADO";
}) {
  try {
    await prisma.pedido.update({
      where: { id: data.id },
      data: {
        nombreCliente: data.nombreCliente.trim(),
        telefonoCliente: data.telefonoCliente.trim() || null,
        detallePrendas: data.detallePrendas.trim(),
        montoTotal: data.montoTotal,
        montoAdelanto: data.montoAdelanto,
        estadoPago: data.estadoPago,
        estadoServicio: data.estadoServicio,
      },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error al editar pedido:", error);

    return {
      success: false,
      error: "No se pudo actualizar el pedido.",
    };
  }
}
