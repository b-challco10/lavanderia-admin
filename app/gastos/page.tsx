import AppShell from "@/components/layout/AppShell";
import GastoForm from "@/components/gastos/GastoForm";
import GastoList from "@/components/gastos/GastoList";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function GastosPage() {
  const gastos = await prisma.gasto.findMany({
    orderBy: {
      fecha: "desc",
    },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Encabezado */}
        <div>
          <p
            className="
            text-sm
            font-medium
            text-red-500
          "
          >
            Control financiero
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
            Gastos y compras
          </h1>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
          "
          >
            Controla los egresos de tu lavandería.
          </p>
        </div>

        {/* Formulario */}
        <GastoForm />

        {/* Historial */}
        <div className="space-y-4">
          <h2
            className="
            text-lg
            font-semibold
            text-slate-800
          "
          >
            Gastos registrados
          </h2>

          <GastoList gastos={gastos} />
        </div>
      </div>
    </AppShell>
  );
}
