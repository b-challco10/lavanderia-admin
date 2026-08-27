"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { actualizarEstadoPedido, eliminarPedido } from "@/actions/pedidos";
import PedidoStatusBadge from "./PedidoStatusBadge";
import EditPedidoModal from "./EditPedidoModal";
interface PedidoCardProps {
  pedido: {
    id: string;
    nombreCliente: string;
    telefonoCliente: string | null;
    detallePrendas: string;
    montoTotal: unknown;
    montoAdelanto: unknown;
    estadoPago: string;
    estadoServicio: string;
    createdAt: Date;
  };
}

const siguienteEstado: Record<string, string | null> = {
  RECIBIDO: "EN_PROCESO",
  EN_PROCESO: "LISTO_PARA_ENTREGAR",
  LISTO_PARA_ENTREGAR: "ENTREGADO",
  ENTREGADO: null,
};

const nombreSiguienteEstado: Record<string, string> = {
  RECIBIDO: "Pasar a proceso",
  EN_PROCESO: "Marcar como listo",
  LISTO_PARA_ENTREGAR: "Marcar entregado",
};

export default function PedidoCard({ pedido }: PedidoCardProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editando, setEditando] = useState(false);
  const siguiente = siguienteEstado[pedido.estadoServicio];
  async function avanzarEstado() {
    if (!siguiente) return;

    setLoading(true);

    try {
      await actualizarEstadoPedido(
        pedido.id,
        siguiente as
          | "RECIBIDO"
          | "EN_PROCESO"
          | "LISTO_PARA_ENTREGAR"
          | "ENTREGADO",
      );

      router.refresh();
    } finally {
      setLoading(false);
    }
  }
  async function borrarPedido() {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el pedido de ${pedido.nombreCliente}?`,
    );

    if (!confirmar) return;

    setDeleting(true);

    try {
      const resultado = await eliminarPedido(pedido.id);

      if (!resultado.success) {
        alert(resultado.error || "No se pudo eliminar el pedido.");

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Ocurrió un error al eliminar el pedido.");
    } finally {
      setDeleting(false);
    }
  }
  return (
    <>
      <article
        className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
    "
      >
        {/* Cabecera */}
        <div
          className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-start
        sm:justify-between
      "
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="
              text-lg
              font-bold
              text-slate-800
            "
              >
                {pedido.nombreCliente}
              </h2>

              <PedidoStatusBadge
                tipo="servicio"
                estado={pedido.estadoServicio}
              />
            </div>

            {pedido.telefonoCliente && (
              <p
                className="
              mt-1
              text-sm
              text-slate-400
            "
              >
                📞 {pedido.telefonoCliente}
              </p>
            )}
          </div>

          <div className="text-left sm:text-right">
            <p
              className="
            text-xl
            font-bold
            text-slate-800
          "
            >
              Bs {Number(pedido.montoTotal).toFixed(2)}
            </p>

            <p
              className="
            mt-1
            text-xs
            text-slate-400
          "
            >
              Adelanto: Bs {Number(pedido.montoAdelanto).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Detalle */}
        <div
          className="
        mt-4
        rounded-xl
        bg-slate-50
        p-4
      "
        >
          <p className="text-xs font-medium text-slate-400">SERVICIO</p>

          <p
            className="
          mt-1
          text-sm
          font-medium
          text-slate-700
        "
          >
            {pedido.detallePrendas}
          </p>
        </div>

        {/* Footer */}
        <div
          className="
    mt-4
    flex
    flex-col
    gap-3
  "
        >
          <div
            className="
      flex
      flex-col
      gap-3
      sm:flex-row
      sm:items-center
      sm:justify-between
    "
          >
            <PedidoStatusBadge tipo="pago" estado={pedido.estadoPago} />

            {siguiente && (
              <button
                type="button"
                onClick={avanzarEstado}
                disabled={loading || deleting}
                className="
          flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          px-5
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
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {nombreSiguienteEstado[pedido.estadoServicio]}

                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            )}
          </div>

          <div
            className="
      flex
      gap-3
      border-t
      border-slate-100
      pt-3
    "
          >
            <button
              type="button"
              disabled={deleting || loading}
              onClick={() => setEditando(true)}
              className="
    flex
    h-11
    flex-1
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-slate-200
    bg-white
    text-sm
    font-semibold
    text-slate-700
    transition
    hover:bg-slate-50
  "
            >
              <Pencil size={17} />
              Editar
            </button>

            <button
              type="button"
              onClick={borrarPedido}
              disabled={deleting || loading}
              className="
        flex
        h-11
        flex-1
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-red-50
        text-sm
        font-semibold
        text-red-600
        transition
        hover:bg-red-100
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
            >
              {deleting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Trash2 size={17} />
                  Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      {editando && (
        <EditPedidoModal pedido={pedido} onClose={() => setEditando(false)} />
      )}
    </>
  );
}
