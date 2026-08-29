"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Save } from "lucide-react";
import { actualizarGasto } from "@/actions/gastos";

interface Gasto {
  id: string;
  concepto: string;
  monto: unknown;
  categoria: string;
  fecha: Date;
}

interface EditGastoModalProps {
  gasto: Gasto | null;
  onClose: () => void;
}

export default function EditGastoModal({
  gasto,
  onClose,
}: EditGastoModalProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("INSUMOS");
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    if (!gasto) return;

    const fechaFormateada = new Date(gasto.fecha)
      .toISOString()
      .split("T")[0];

    setConcepto(gasto.concepto);
    setMonto(String(Number(gasto.monto)));
    setCategoria(gasto.categoria);
    setFecha(fechaFormateada);
    setError("");
  }, [gasto]);

  if (!gasto) {
    return null;
  }

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  // Validación para asegurar que gasto existe
  if (!gasto) return;

  setLoading(true);
  setError("");

  const formData = new FormData();
  formData.append("concepto", concepto);
  formData.append("monto", monto);
  formData.append("categoria", categoria);
  formData.append("fecha", fecha);

  try {
    await actualizarGasto(gasto.id, formData); // TypeScript ya no marcará error aquí

    onClose();
    router.refresh();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "No se pudo actualizar el gasto.",
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-slate-900/40
        p-0
        sm:items-center
        sm:p-4
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          overflow-y-auto
          rounded-t-3xl
          bg-white
          p-5
          shadow-xl
          sm:max-w-xl
          sm:rounded-2xl
        "
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-500">
              Modificar registro
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-800">
              Editar gasto
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-100
            "
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Concepto */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Concepto *
            </label>

            <input
              value={concepto}
              onChange={(event) =>
                setConcepto(event.target.value)
              }
              required
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                outline-none
                transition
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Monto */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Monto (Bs) *
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={(event) =>
                setMonto(event.target.value)
              }
              required
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                outline-none
                transition
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Categoría *
            </label>

            <select
              value={categoria}
              onChange={(event) =>
                setCategoria(event.target.value)
              }
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                outline-none
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="INSUMOS">Insumos</option>
              <option value="SERVICIOS_BASICOS">
                Servicios Básicos
              </option>
              <option value="MANTENIMIENTO">
                Mantenimiento
              </option>
              <option value="VARIOS">Varios</option>
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Fecha
            </label>

            <input
              type="date"
              value={fecha}
              onChange={(event) =>
                setFecha(event.target.value)
              }
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                outline-none
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-4
                text-sm
                text-red-600
              "
            >
              {error}
            </div>
          )}

          {/* Botones */}
          <div
            className="
              flex
              flex-col-reverse
              gap-3
              pt-2
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                h-12
                rounded-xl
                border
                border-slate-200
                px-5
                text-sm
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-6
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}