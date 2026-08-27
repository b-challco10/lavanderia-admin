import AppShell from "@/components/layout/AppShell";
import HistorialClient from "@/components/historial/HistorialClient";
import ExportExcelButtons from "@/components/historial/ExportExcelButtons";
import { prisma } from "@/lib/prisma";

export default async function HistorialPage() {
  const [pedidos, gastos] = await Promise.all([
    prisma.pedido.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.gasto.findMany({
      orderBy: {
        fecha: "desc",
      },
    }),
  ]);

  const pedidosData = pedidos.map((pedido) => ({
    id: pedido.id,
    nombreCliente: pedido.nombreCliente,
    telefonoCliente: pedido.telefonoCliente,
    detallePrendas: pedido.detallePrendas,
    montoTotal: Number(pedido.montoTotal),
    montoAdelanto: Number(pedido.montoAdelanto),
    estadoPago: pedido.estadoPago,
    estadoServicio: pedido.estadoServicio,
    createdAt: pedido.createdAt.toISOString(),
  }));

  const gastosData = gastos.map((gasto) => ({
    id: gasto.id,
    concepto: gasto.concepto,
    monto: Number(gasto.monto),
    categoria: gasto.categoria,
    fecha: gasto.fecha.toISOString(),
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p
            className="
            text-sm
            font-medium
            text-blue-600
          "
          >
            Registro histórico
          </p>

          <h1
            className="
            mt-1
            text-2xl
            font-bold
            text-[#1E293B]
            sm:text-3xl
          "
          >
            Historial
          </h1>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
          "
          >
            Consulta pedidos y gastos registrados.
          </p>
        </div>

        <div className="space-y-5">

  <div className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-5
    shadow-sm
  ">

    <div className="
      flex
      flex-col
      gap-4
      lg:flex-row
      lg:items-center
      lg:justify-between
    ">

      <div>
        <h2 className="
          font-semibold
          text-slate-800
        ">
          Exportar información
        </h2>

        <p className="
          mt-1
          text-sm
          text-slate-500
        ">
          Descarga tus registros en formato Excel.
        </p>
      </div>

      <ExportExcelButtons
        pedidos={pedidosData}
        gastos={gastosData}
      />

    </div>

  </div>

  <HistorialClient
    pedidos={pedidosData}
    gastos={gastosData}
  />

</div>
      </div>
    </AppShell>
  );
}
