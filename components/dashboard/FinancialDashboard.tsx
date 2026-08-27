"use client";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useState } from "react";

import MetricCard from "./MetricCard";
import { obtenerDashboard, type Periodo } from "@/actions/dashboard";

interface DashboardData {
  ingresos: number;
  gastos: number;
  ganancia: number;
  pedidosPendientes: number;
  pedidosListos: number;
}

const periodos: {
  value: Periodo;
  label: string;
}[] = [
  {
    value: "hoy",
    label: "Hoy",
  },
  {
    value: "semana",
    label: "Esta semana",
  },
  {
    value: "mes",
    label: "Este mes",
  },
];

export default function FinancialDashboard() {
  const [periodo, setPeriodo] = useState<Periodo>("hoy");

  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      setLoading(true);

      const resultado = await obtenerDashboard(periodo);

      setData(resultado);

      setLoading(false);
    }

    cargar();
  }, [periodo]);

  const dinero = (valor: number) => `Bs ${valor.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div
        className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
      >
        <div>
          <p className="text-sm font-medium text-blue-600">
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

          <p className="mt-1 text-sm text-slate-500">
            Control de tu lavandería en tiempo real.
          </p>
        </div>

        {/* Filtros */}
        <div
          className="
          flex
          rounded-xl
          border
          border-slate-200
          bg-white
          p-1
        "
        >
          {periodos.map((item) => (
            <button
              key={item.value}
              onClick={() => setPeriodo(item.value)}
              className={`
                rounded-lg
                px-3
                py-2
                text-xs
                font-medium
                transition
                sm:px-4
                sm:text-sm
                ${
                  periodo === item.value
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas */}
      <div
        className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-5
      "
      >
        <MetricCard
          title="Ingresos"
          value={loading ? "..." : dinero(data?.ingresos ?? 0)}
          icon={TrendingUp}
          description="Total de pedidos"
          variant="blue"
        />

        <MetricCard
          title="Gastos"
          value={loading ? "..." : dinero(data?.gastos ?? 0)}
          icon={TrendingDown}
          description="Egresos registrados"
          variant="red"
        />

        <MetricCard
          title="Ganancia neta"
          value={loading ? "..." : dinero(data?.ganancia ?? 0)}
          icon={Wallet}
          description="Ingresos − gastos"
          variant="green"
        />

        <MetricCard
          title="Pendientes"
          value={loading ? "..." : String(data?.pedidosPendientes ?? 0)}
          icon={Clock3}
          description="Pedidos en proceso"
          variant="orange"
        />

        <MetricCard
          title="Listos"
          value={loading ? "..." : String(data?.pedidosListos ?? 0)}
          icon={CheckCircle2}
          description="Esperando entrega"
          variant="green"
        />
      </div>

      {/* Estado */}
      <div
        className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
      >
        <h2 className="font-semibold text-slate-800">Estado del negocio</h2>

        <p className="mt-2 text-sm text-slate-500">
          Los datos mostrados provienen directamente de la base de datos.
        </p>
      </div>
    </div>
  );
}
