"use client";

import { useState } from "react";
import EditGastoModal from "./EditGastoModal";
import {
  ShoppingBasket,
  Droplets,
  Wrench,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { eliminarGasto } from "@/actions/gastos";

interface Gasto {
  id: string;
  concepto: string;
  monto: unknown;
  categoria: string;
  fecha: Date;
}

const configuracion: Record<
  string,
  {
    label: string;
    icon: typeof ShoppingBasket;
    className: string;
  }
> = {
  INSUMOS: {
    label: "Insumos",
    icon: ShoppingBasket,
    className: "bg-blue-50 text-blue-600",
  },

  SERVICIOS_BASICOS: {
    label: "Servicios Básicos",
    icon: Droplets,
    className: "bg-cyan-50 text-cyan-600",
  },

  MANTENIMIENTO: {
    label: "Mantenimiento",
    icon: Wrench,
    className: "bg-orange-50 text-orange-600",
  },

  VARIOS: {
    label: "Varios",
    icon: MoreHorizontal,
    className: "bg-slate-100 text-slate-600",
  },
};

export default function GastoList({ gastos }: { gastos: Gasto[] }) {
  const router = useRouter();

  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const [gastoEditando, setGastoEditando] = useState<Gasto | null>(null);

  async function handleEliminar(id: string) {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este gasto? Esta acción no se puede deshacer.",
    );

    if (!confirmar) {
      return;
    }

    setEliminandoId(id);

    try {
      await eliminarGasto(id);

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el gasto.",
      );
    } finally {
      setEliminandoId(null);
    }
  }

  if (gastos.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-white
          p-10
          text-center
        "
      >
        <p className="font-medium text-slate-700">No hay gastos registrados</p>

        <p className="mt-1 text-sm text-slate-400">
          Los gastos que registres aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {gastos.map((gasto) => {
          const config = configuracion[gasto.categoria];

          const Icon = config.icon;

          const eliminando = eliminandoId === gasto.id;

          return (
            <div
              key={gasto.id}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >
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
                {/* Información */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${config.className}
                    `}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        font-semibold
                        text-slate-800
                      "
                    >
                      {gasto.concepto}
                    </p>

                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <span className="text-xs text-slate-400">
                        {gasto.fecha.toLocaleDateString("es-BO")}
                      </span>

                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${config.className}
                        `}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monto y acciones */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    sm:justify-end
                  "
                >
                  <p
                    className="
                      whitespace-nowrap
                      text-lg
                      font-bold
                      text-red-500
                    "
                  >
                    - Bs {Number(gasto.monto).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Editar */}

                    <button
                      type="button"
                      onClick={() => setGastoEditando(gasto)}
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200
                        text-slate-500
                        transition
                        hover:border-blue-200
                        hover:bg-blue-50
                        hover:text-blue-600
                      "
                      title="Editar gasto"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Eliminar */}

                    <button
                      type="button"
                      onClick={() => handleEliminar(gasto.id)}
                      disabled={eliminando}
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-red-200
                        text-red-500
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                      title="Eliminar gasto"
                    >
                      {eliminando ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aquí conectaremos el modal de edición en el siguiente paso */}

      <EditGastoModal
  gasto={gastoEditando}
  onClose={() => setGastoEditando(null)}
/>
    </>
  );
}
