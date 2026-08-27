"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";

import { crearGasto } from "@/actions/gastos";

export default function GastoForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function obtenerFechaActual() {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");

    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  }

async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setLoading(true);
  setError("");

  const form = event.currentTarget;

  const formData = new FormData(form);

  try {
    await crearGasto(formData);

    form.reset();

    router.refresh();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "No se pudo registrar el gasto."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <h2
        className="
        text-lg
        font-semibold
        text-slate-800
      "
      >
        Registrar gasto
      </h2>

      <p
        className="
        mt-1
        text-sm
        text-slate-500
      "
      >
        Registra compras y otros egresos del negocio.
      </p>

      <div
        className="
        mt-5
        grid
        gap-4
        sm:grid-cols-2
      "
      >
        {/* Concepto */}
        <div className="sm:col-span-2">
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
          "
          >
            Concepto *
          </label>

          <input
            name="concepto"
            required
            placeholder="Ej. Compra detergente 10L"
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
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
          "
          >
            Monto (Bs) *
          </label>

          <input
            name="monto"
            type="number"
            min="0.01"
            step="0.01"
            required
            placeholder="0.00"
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
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
          "
          >
            Categoría *
          </label>

          <select
            name="categoria"
            required
            defaultValue="INSUMOS"
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
          >
            <option value="INSUMOS">Insumos</option>

            <option value="SERVICIOS_BASICOS">Servicios Básicos</option>

            <option value="MANTENIMIENTO">Mantenimiento</option>

            <option value="VARIOS">Varios</option>
          </select>
        </div>

        {/* Fecha */}
        <div className="sm:col-span-2">
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
          "
          >
            Fecha
          </label>

          <input
            name="fecha"
            type="date"
            defaultValue={obtenerFechaActual()}
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
      </div>

      {/* Error */}
      {error && (
        <div
          className="
          mt-4
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

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="
          mt-5
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-red-500
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-red-600
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <PlusCircle size={18} />
            Registrar gasto
          </>
        )}
      </button>
    </form>
  );
}
