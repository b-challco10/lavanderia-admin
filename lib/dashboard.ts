import { prisma } from "@/lib/prisma";

export type PeriodoDashboard = "HOY" | "SEMANA" | "MES";

function obtenerRango(periodo: PeriodoDashboard) {
  const ahora = new Date();
  const inicio = new Date(ahora);

  if (periodo === "HOY") {
    inicio.setHours(0, 0, 0, 0);
  }

  if (periodo === "SEMANA") {
    const dia = inicio.getDay();
    const diferencia = dia === 0 ? 6 : dia - 1;

    inicio.setDate(inicio.getDate() - diferencia);

    inicio.setHours(0, 0, 0, 0);
  }

  if (periodo === "MES") {
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
  }

  return {
    inicio,
    fin: ahora,
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

  const [ingresos, gastos, pedidosPendientes, pedidosListos] =
    await Promise.all([
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

      prisma.pedido.count({
        where: {
          ...rangoCreacion,
          estadoServicio: {
            in: ["RECIBIDO", "EN_PROCESO"],
          },
        },
      }),

      prisma.pedido.count({
        where: {
          ...rangoCreacion,
          estadoServicio: "LISTO_PARA_ENTREGAR",
        },
      }),
    ]);

  const totalIngresos = Number(ingresos._sum.montoTotal ?? 0);

  const totalGastos = Number(gastos._sum.monto ?? 0);

  const gananciaNeta = totalIngresos - totalGastos;

  return {
    totalIngresos,
    totalGastos,
    gananciaNeta,
    pedidosPendientes,
    pedidosListos,
  };
}
