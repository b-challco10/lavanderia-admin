"use server";

import { prisma } from "@/lib/prisma";

export type Periodo = "hoy" | "semana" | "mes";

function obtenerFechaInicio(periodo: Periodo) {
  const ahora = new Date();

  if (periodo === "hoy") {
    return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  }

  if (periodo === "semana") {
    const fecha = new Date(ahora);
    const dia = fecha.getDay();

    const diferencia = dia === 0 ? 6 : dia - 1;

    fecha.setDate(fecha.getDate() - diferencia);
    fecha.setHours(0, 0, 0, 0);

    return fecha;
  }

  return new Date(ahora.getFullYear(), ahora.getMonth(), 1);
}

export async function obtenerDashboard(periodo: Periodo = "hoy") {
  const fechaInicio = obtenerFechaInicio(periodo);

  const [pedidos, gastos, pedidosPendientes, pedidosListos] = await Promise.all(
    [
      prisma.pedido.aggregate({
        _sum: {
          montoTotal: true,
        },
        where: {
          createdAt: {
            gte: fechaInicio,
          },
        },
      }),

      prisma.gasto.aggregate({
        _sum: {
          monto: true,
        },
        where: {
          fecha: {
            gte: fechaInicio,
          },
        },
      }),

      prisma.pedido.count({
        where: {
          estadoServicio: {
            in: ["RECIBIDO", "EN_PROCESO"],
          },
        },
      }),

      prisma.pedido.count({
        where: {
          estadoServicio: "LISTO_PARA_ENTREGAR",
        },
      }),
    ],
  );

  const ingresos = Number(pedidos._sum.montoTotal ?? 0);
  const gastosTotal = Number(gastos._sum.monto ?? 0);

  return {
    ingresos,
    gastos: gastosTotal,
    ganancia: ingresos - gastosTotal,
    pedidosPendientes,
    pedidosListos,
  };
}
