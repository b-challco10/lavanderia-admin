"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { crearPedido } from "@/actions/pedidos";

export default function PedidoForm() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function obtenerFechaActual() {
    const ahora = new Date();

    const año =
      ahora.getFullYear();

    const mes = String(
      ahora.getMonth() + 1,
    ).padStart(2, "0");

    const dia = String(
      ahora.getDate(),
    ).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData =
      new FormData(
        event.currentTarget,
      );

    try {
      await crearPedido(
        formData,
      );

      router.push("/pedidos");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo registrar el pedido.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Datos del cliente */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Datos del cliente
        </h2>

        {/* Número de orden */}
<div className="mt-4">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Nro. de orden *
  </label>

  <input
    name="numeroOrden"
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    required
    placeholder="Ej. 001120"
    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
  />
</div>

        {/* Cliente */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nombre del cliente *
            </label>

            <input
              name="nombreCliente"
              required
              placeholder="Ej. María López"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Teléfono{" "}
              <span className="text-xs font-normal text-slate-400">
                (opcional)
              </span>
            </label>

            <input
              name="telefonoCliente"
              type="tel"
              placeholder="Ej. 71234567"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Servicio */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Servicio
        </h2>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Detalle de prendas /
            servicio *
          </label>

          <textarea
            name="detallePrendas"
            required
            rows={3}
            placeholder="Ej. 2 edredones grandes"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Fecha */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Fecha *
          </label>

          <input
            name="fecha"
            type="date"
            required
            defaultValue={obtenerFechaActual()}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Pago */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Información de pago
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Monto total (Bs) *
            </label>

            <input
              name="montoTotal"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Adelanto (Bs)
            </label>

            <input
              name="montoAdelanto"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
              placeholder="0.00"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Estado de pago
          </label>

          <select
            name="estadoPago"
            defaultValue="PAGADO"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option value="PENDIENTE">
              Pendiente
            </option>

            <option value="PAGADO">
              Pagado
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Registrar */}
      <button
        type="submit"
        disabled={loading}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={20}
              className="animate-spin"
            />
            Registrando...
          </>
        ) : (
          <>
            <CheckCircle2 size={20} />
            Registrar pedido
          </>
        )}
      </button>
    </form>
  );
}