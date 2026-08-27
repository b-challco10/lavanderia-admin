"use client";

import { useRouter, useSearchParams } from "next/navigation";

const periodos = [
  {
    value: "HOY",
    label: "Hoy",
  },
  {
    value: "SEMANA",
    label: "Esta semana",
  },
  {
    value: "MES",
    label: "Este mes",
  },
] as const;

export default function DashboardPeriodSelector() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const periodo = searchParams.get("periodo") ?? "MES";

  function cambiarPeriodo(nuevoPeriodo: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("periodo", nuevoPeriodo);

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div
      className="
      flex
      w-full
      rounded-xl
      border
      border-slate-200
      bg-white
      p-1
      sm:w-auto
    "
    >
      {periodos.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => cambiarPeriodo(item.value)}
          className={`
            flex-1
            rounded-lg
            px-4
            py-2.5
            text-sm
            font-semibold
            transition
            sm:flex-none
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
  );
}
