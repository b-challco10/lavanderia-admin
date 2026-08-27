import AppShell from "@/components/layout/AppShell";
import DashboardPeriodSelector from "@/components/dashboard/DashboardPeriodSelector";
import { obtenerDashboard } from "@/lib/dashboard";
import { TrendingUp, TrendingDown, Wallet, PackageCheck } from "lucide-react";
interface DashboardPageProps {
  searchParams: Promise<{
    periodo?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  const periodo =
    params.periodo === "HOY" ||
    params.periodo === "SEMANA" ||
    params.periodo === "MES"
      ? params.periodo
      : "MES";

  const datos = await obtenerDashboard(periodo);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Encabezado */}
        <div
          className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
        >
          <div>
            <p
              className="
              text-sm
              font-medium
              text-blue-600
            "
            >
              Resumen financiero
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
              Dashboard
            </h1>

            <p
              className="
              mt-1
              text-sm
              text-slate-500
            "
            >
              Consulta el estado de tu lavandería.
            </p>
          </div>

          <DashboardPeriodSelector />
        </div>

        {/* Aquí van tus tarjetas */}

        <div
          className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
        >
          {/* INGRESOS */}
          <div
            className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-5
    shadow-sm
  "
          >
            <div className="flex items-center justify-between">
              <p
                className="
        text-sm
        font-medium
        text-slate-500
      "
              >
                Ingresos
              </p>

              <div
                className="
        rounded-xl
        bg-emerald-50
        p-2
        text-emerald-600
      "
              >
                <TrendingUp size={20} />
              </div>
            </div>

            <p
              className="
      mt-2
      text-2xl
      font-bold
      text-emerald-600
    "
            >
              Bs {datos.totalIngresos.toFixed(2)}
            </p>
          </div>
          {/* GASTOS */}
          <div
            className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-5
    shadow-sm
  "
          >
            <div className="flex items-center justify-between">
              <p
                className="
        text-sm
        font-medium
        text-slate-500
      "
              >
                Gastos
              </p>

              <div
                className="
        rounded-xl
        bg-red-50
        p-2
        text-red-500
      "
              >
                <TrendingDown size={20} />
              </div>
            </div>

            <p
              className="
      mt-2
      text-2xl
      font-bold
      text-red-500
    "
            >
              Bs {datos.totalGastos.toFixed(2)}
            </p>
          </div>

          {/* GANANCIA */}
          <div
            className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-5
    shadow-sm
  "
          >
            <div className="flex items-center justify-between">
              <p
                className="
        text-sm
        font-medium
        text-slate-500
      "
              >
                Ganancia neta
              </p>

              <div
                className={`
        rounded-xl
        p-2
        ${
          datos.gananciaNeta >= 0
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-500"
        }
      `}
              >
                <Wallet size={20} />
              </div>
            </div>

            <p
              className={`
      mt-2
      text-2xl
      font-bold
      ${datos.gananciaNeta >= 0 ? "text-emerald-600" : "text-red-500"}
    `}
            >
              Bs {datos.gananciaNeta.toFixed(2)}
            </p>
          </div>

          {/* PEDIDOS */}
          <div
            className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-5
    shadow-sm
  "
          >
            <div className="flex items-center justify-between">
              <p
                className="
        text-sm
        font-medium
        text-slate-500
      "
              >
                Pedidos pendientes
              </p>

              <div
                className="
        rounded-xl
        bg-blue-50
        p-2
        text-blue-600
      "
              >
                <PackageCheck size={20} />
              </div>
            </div>

            <p
              className="
      mt-2
      text-2xl
      font-bold
      text-blue-600
    "
            >
              {datos.pedidosPendientes}
            </p>

            <p
              className="
      mt-1
      text-xs
      text-slate-400
    "
            >
              {datos.pedidosListos} listos para entregar
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
