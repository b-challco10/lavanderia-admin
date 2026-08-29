import { prisma } from "@/lib/prisma";

import { fromZonedTime, toZonedTime } from "date-fns-tz";

export type PeriodoDashboard = "HOY" | "SEMANA" | "MES";

const ZONA_HORARIA_BOLIVIA = "America/La_Paz";

function obtenerRango(periodo: PeriodoDashboard) {
  const ahoraUTC = new Date();

  // Hora actual vista en Bolivia
  const ahoraBolivia = toZonedTime(ahoraUTC, ZONA_HORARIA_BOLIVIA);

  const inicioBolivia = new Date(ahoraBolivia);

  if (periodo === "HOY") {
    inicioBolivia.setHours(0, 0, 0, 0);
  }

  if (periodo === "SEMANA") {
    const dia = inicioBolivia.getDay();

    // Lunes = inicio de semana
    const diferencia = dia === 0 ? 6 : dia - 1;

    inicioBolivia.setDate(inicioBolivia.getDate() - diferencia);

    inicioBolivia.setHours(0, 0, 0, 0);
  }

  if (periodo === "MES") {
    inicioBolivia.setDate(1);

    inicioBolivia.setHours(0, 0, 0, 0);
  }

  // Convertimos el rango Bolivia -> UTC
  const inicio = fromZonedTime(inicioBolivia, ZONA_HORARIA_BOLIVIA);

  return {
    inicio,
    fin: ahoraUTC,
  };
}

export async function obtenerDashboard(periodo: PeriodoDashboard) {
  const { inicio, fin } = obtenerRango(periodo);

  const rangoCreacion = {
    createdAt: {
      gte: inicio,
      lte: fin,
    },
  };

  const rangoGasto = {
    fecha: {
      gte: inicio,
      lte: fin,
    },
  };

  const [ingresos, gastos, pedidosPorEstado] = await Promise.all([
    prisma.pedido.aggregate({
      _sum: {
        montoTotal: true,
      },
      where: rangoCreacion,
    }),

    prisma.gasto.aggregate({
      _sum: {
        monto: true,
      },
      where: rangoGasto,
    }),

    prisma.pedido.groupBy({
      by: ["estadoServicio"],
      _count: {
        id: true,
      },
      where: rangoCreacion,
    }),
  ]);

  const totalIngresos = Number(ingresos._sum.montoTotal ?? 0);

  const totalGastos = Number(gastos._sum.monto ?? 0);

  const pendientes = pedidosPorEstado
    .filter(
      (pedido) =>
        pedido.estadoServicio === "RECIBIDO" ||
        pedido.estadoServicio === "EN_PROCESO",
    )
    .reduce((total, pedido) => total + pedido._count.id, 0);

  const listos =
    pedidosPorEstado.find(
      (pedido) => pedido.estadoServicio === "LISTO_PARA_ENTREGAR",
    )?._count.id ?? 0;

  return {
    totalIngresos,
    totalGastos,
    gananciaNeta: totalIngresos - totalGastos,
    pedidosPendientes: pendientes,
    pedidosListos: listos,
  };
}
