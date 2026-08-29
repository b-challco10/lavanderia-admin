import { prisma } from "@/lib/prisma";
import {
  fromZonedTime,
  toZonedTime,
} from "date-fns-tz";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
} from "date-fns";

export type PeriodoDashboard = "HOY" | "SEMANA" | "MES";

const ZONA_HORARIA = "America/La_Paz";

function obtenerRango(periodo: PeriodoDashboard) {
  const ahoraUTC = new Date();

  // Convertimos la hora actual a la zona horaria de Bolivia
  const ahoraBolivia = toZonedTime(
    ahoraUTC,
    ZONA_HORARIA,
  );

  let inicioBolivia: Date;

  if (periodo === "HOY") {
    inicioBolivia = startOfDay(ahoraBolivia);
  } else if (periodo === "SEMANA") {
    inicioBolivia = startOfWeek(ahoraBolivia, {
      weekStartsOn: 1,
    });
  } else {
    inicioBolivia = startOfMonth(ahoraBolivia);
  }

  // Convertimos los límites nuevamente a UTC
  // para consultar correctamente PostgreSQL/Supabase
  const inicio = fromZonedTime(
    inicioBolivia,
    ZONA_HORARIA,
  );

  return {
    inicio,
    fin: ahoraUTC,
  };
}

export async function obtenerDashboard(
  periodo: PeriodoDashboard,
) {
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

  const [ingresos, gastos, pedidosPorEstado] =
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

      prisma.pedido.groupBy({
        by: ["estadoServicio"],
        _count: {
          id: true,
        },
        where: rangoCreacion,
      }),
    ]);

  const totalIngresos = Number(
    ingresos._sum.montoTotal ?? 0,
  );

  const totalGastos = Number(
    gastos._sum.monto ?? 0,
  );

  const pedidosPendientes = pedidosPorEstado
    .filter(
      (pedido) =>
        pedido.estadoServicio === "RECIBIDO" ||
        pedido.estadoServicio === "EN_PROCESO",
    )
    .reduce(
      (total, pedido) =>
        total + pedido._count.id,
      0,
    );

  const pedidosListos =
    pedidosPorEstado.find(
      (pedido) =>
        pedido.estadoServicio ===
        "LISTO_PARA_ENTREGAR",
    )?._count.id ?? 0;

  return {
    totalIngresos,
    totalGastos,
    gananciaNeta:
      totalIngresos - totalGastos,
    pedidosPendientes,
    pedidosListos,
  };
}