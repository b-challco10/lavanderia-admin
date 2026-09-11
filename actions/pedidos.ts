"use server";

import { prisma } from "@/lib/prisma";
import { EstadoPago, EstadoServicio } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { obtenerSesion } from "@/lib/auth";
export async function crearPedido(formData: FormData) {
const numeroOrden = String(
  formData.get("numeroOrden") ?? "",
).trim();

  const nombreCliente = String(
    formData.get("nombreCliente") ?? "",
  ).trim();

  const telefonoCliente = String(
    formData.get("telefonoCliente") ?? "",
  ).trim();

  const detallePrendas = String(
    formData.get("detallePrendas") ?? "",
  ).trim();

  const montoTotal = Number(
    formData.get("montoTotal") ?? 0,
  );

  const montoAdelanto = Number(
    formData.get("montoAdelanto") ?? 0,
  );

  const estadoPago = String(
    formData.get("estadoPago") ?? "PENDIENTE",
  ) as EstadoPago;

  const fecha = String(
    formData.get("fecha") ?? "",
  );

  // Número de orden obligatorio para pedidos nuevos
 if (!numeroOrden) {
  throw new Error(
    "El número de orden es obligatorio.",
  );
}

if (!/^\d+$/.test(numeroOrden)) {
  throw new Error(
    "El número de orden solo puede contener números.",
  );
}

  if (!nombreCliente) {
    throw new Error(
      "El nombre del cliente es obligatorio.",
    );
  }

  if (!detallePrendas) {
    throw new Error(
      "Debes indicar el detalle del servicio.",
    );
  }

  if (
    !Number.isFinite(montoTotal) ||
    montoTotal <= 0
  ) {
    throw new Error(
      "El monto total debe ser mayor a 0.",
    );
  }

  if (
    !Number.isFinite(montoAdelanto) ||
    montoAdelanto < 0 ||
    montoAdelanto > montoTotal
  ) {
    throw new Error(
      "El adelanto debe estar entre 0 y el monto total.",
    );
  }

  if (!fecha) {
    throw new Error(
      "La fecha del pedido es obligatoria.",
    );
  }

  const fechaConvertida = new Date(
    `${fecha}T12:00:00`,
  );

  if (
    Number.isNaN(
      fechaConvertida.getTime(),
    )
  ) {
    throw new Error(
      "La fecha del pedido no es válida.",
    );
  }
const sesion = await obtenerSesion();

if (!sesion) {
  throw new Error("No hay una sesión activa.");
}

if (!sesion.sucursalId) {
  throw new Error("No hay una sucursal seleccionada.");
}
const pedido = await prisma.pedido.create({
  data: {
    numeroOrden,
    nombreCliente,
    telefonoCliente: telefonoCliente || null,
    detallePrendas,
    montoTotal,
    montoAdelanto,
    estadoPago,
    fecha: fechaConvertida,

    sucursal: {
      connect: {
        id: sesion.sucursalId,
      },
    },
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
  const pedido =
    await prisma.pedido.update({
      where: { id },
      data: {
        estadoServicio,
      },
    });

  revalidatePath("/pedidos");
  revalidatePath("/dashboard");
  revalidatePath("/historial");

  return {
    success: true,
    estadoServicio:
      pedido.estadoServicio,
  };
}

export async function eliminarPedido(
  id: string,
) {
  try {
    await prisma.pedido.delete({
      where: { id },
    });

    revalidatePath("/pedidos");
    revalidatePath("/dashboard");
    revalidatePath("/historial");

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Error al eliminar pedido:",
      error,
    );

    return {
      success: false,
      error:
        "No se pudo eliminar el pedido.",
    };
  }
}

export async function editarPedido(data: {
  id: string;
  numeroOrden: string | null;
  nombreCliente: string;
  telefonoCliente: string;
  detallePrendas: string;
  montoTotal: number;
  montoAdelanto: number;
  estadoPago:
    | "PAGADO"
    | "PENDIENTE";
  estadoServicio:
    | "RECIBIDO"
    | "EN_PROCESO"
    | "LISTO_PARA_ENTREGAR"
    | "ENTREGADO";
  fecha: string;
}) {
  try {
    // Si tiene número de orden,
    // solamente permitimos números.
    if (
      data.numeroOrden !== null &&
      !/^\d+$/.test(
        data.numeroOrden,
      )
    ) {
      return {
        success: false,
        error:
          "El número de orden solo puede contener números.",
      };
    }

    if (!data.fecha) {
      return {
        success: false,
        error:
          "La fecha del pedido es obligatoria.",
      };
    }

    if (!data.nombreCliente.trim()) {
      return {
        success: false,
        error:
          "El nombre del cliente es obligatorio.",
      };
    }

    if (!data.detallePrendas.trim()) {
      return {
        success: false,
        error:
          "El detalle del servicio es obligatorio.",
      };
    }

    if (
      !Number.isFinite(
        data.montoTotal,
      ) ||
      data.montoTotal <= 0
    ) {
      return {
        success: false,
        error:
          "El monto total debe ser mayor a 0.",
      };
    }

    if (
      !Number.isFinite(
        data.montoAdelanto,
      ) ||
      data.montoAdelanto < 0 ||
      data.montoAdelanto >
        data.montoTotal
    ) {
      return {
        success: false,
        error:
          "El adelanto debe estar entre 0 y el monto total.",
      };
    }

    const fechaConvertida =
      new Date(
        `${data.fecha}T12:00:00`,
      );

    if (
      Number.isNaN(
        fechaConvertida.getTime(),
      )
    ) {
      return {
        success: false,
        error:
          "La fecha del pedido no es válida.",
      };
    }

    await prisma.pedido.update({
      where: {
        id: data.id,
      },
      data: {
        numeroOrden:
          data.numeroOrden,
        nombreCliente:
          data.nombreCliente.trim(),
        telefonoCliente:
          data.telefonoCliente.trim() ||
          null,
        detallePrendas:
          data.detallePrendas.trim(),
        montoTotal:
          data.montoTotal,
        montoAdelanto:
          data.montoAdelanto,
        estadoPago:
          data.estadoPago,
        estadoServicio:
          data.estadoServicio,
        fecha: fechaConvertida,
      },
    });

    revalidatePath("/pedidos");
    revalidatePath("/dashboard");
    revalidatePath("/historial");

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Error al editar pedido:",
      error,
    );

    return {
      success: false,
      error:
        "No se pudo actualizar el pedido.",
    };
  }
}