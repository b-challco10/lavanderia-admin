"use client";

import { useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { editarPedido } from "@/actions/pedidos";

interface EditPedidoModalProps {
  pedido: {
    id: string;
    nombreCliente: string;
    telefonoCliente: string | null;
    detallePrendas: string;
    montoTotal: unknown;
    montoAdelanto: unknown;
    estadoPago: string;
    estadoServicio: string;
  };

  onClose: () => void;
}

export default function EditPedidoModal({
  pedido,
  onClose,
}: EditPedidoModalProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [nombreCliente, setNombreCliente] = useState(pedido.nombreCliente);

  const [telefonoCliente, setTelefonoCliente] = useState(
    pedido.telefonoCliente ?? "",
  );

  const [detallePrendas, setDetallePrendas] = useState(pedido.detallePrendas);

  const [montoTotal, setMontoTotal] = useState(
    Number(pedido.montoTotal).toString(),
  );

  const [montoAdelanto, setMontoAdelanto] = useState(
    Number(pedido.montoAdelanto).toString(),
  );

  const [estadoPago, setEstadoPago] = useState(
    pedido.estadoPago as "PAGADO" | "PENDIENTE",
  );

  const [estadoServicio, setEstadoServicio] = useState(
    pedido.estadoServicio as
      | "RECIBIDO"
      | "EN_PROCESO"
      | "LISTO_PARA_ENTREGAR"
      | "ENTREGADO",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const total = Number(montoTotal);
    const adelanto = Number(montoAdelanto);

    if (!nombreCliente.trim()) {
      alert("El nombre del cliente es obligatorio.");
      return;
    }

    if (!detallePrendas.trim()) {
      alert("El detalle del servicio es obligatorio.");
      return;
    }

    if (Number.isNaN(total) || total < 0) {
      alert("Ingresa un monto total válido.");
      return;
    }

    if (Number.isNaN(adelanto) || adelanto < 0) {
      alert("Ingresa un adelanto válido.");
      return;
    }

    if (adelanto > total) {
      alert("El adelanto no puede ser mayor al monto total.");
      return;
    }

    setLoading(true);

    try {
      const resultado = await editarPedido({
        id: pedido.id,
        nombreCliente,
        telefonoCliente,
        detallePrendas,
        montoTotal: total,
        montoAdelanto: adelanto,
        estadoPago,
        estadoServicio,
      });

      if (!resultado.success) {
        alert(resultado.error || "No se pudo actualizar el pedido.");

        return;
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);

      alert("Ocurrió un error al actualizar el pedido.");
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
        p-3
        sm:items-center
        sm:p-6
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-2xl
          bg-white
          p-5
          shadow-2xl
          sm:p-6
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Editar registro</p>

            <h2 className="mt-1 text-xl font-bold text-slate-800">
              Editar pedido
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
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Nombre del cliente
              </label>

              <input
                value={nombreCliente}
                onChange={(event) => setNombreCliente(event.target.value)}
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  outline-none
                  transition
                  focus:border-blue-500
                "
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Teléfono
              </label>

              <input
                value={telefonoCliente}
                onChange={(event) => setTelefonoCliente(event.target.value)}
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  outline-none
                  transition
                  focus:border-blue-500
                "
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Detalle del servicio
            </label>

            <textarea
              value={detallePrendas}
              onChange={(event) => setDetallePrendas(event.target.value)}
              className="
                mt-2
                min-h-24
                w-full
                rounded-xl
                border
                border-slate-200
                p-4
                outline-none
                transition
                focus:border-blue-500
              "
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Monto total
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={montoTotal}
                onChange={(event) => setMontoTotal(event.target.value)}
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  outline-none
                  transition
                  focus:border-blue-500
                "
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Adelanto
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={montoAdelanto}
                onChange={(event) => setMontoAdelanto(event.target.value)}
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  outline-none
                  transition
                  focus:border-blue-500
                "
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Estado de pago
              </label>

              <select
                value={estadoPago}
                onChange={(event) =>
                  setEstadoPago(event.target.value as "PAGADO" | "PENDIENTE")
                }
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  outline-none
                  focus:border-blue-500
                "
              >
                <option value="PENDIENTE">Pendiente</option>

                <option value="PAGADO">Pagado</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Estado del servicio
              </label>

              <select
                value={estadoServicio}
                onChange={(event) =>
                  setEstadoServicio(
                    event.target.value as
                      | "RECIBIDO"
                      | "EN_PROCESO"
                      | "LISTO_PARA_ENTREGAR"
                      | "ENTREGADO",
                  )
                }
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  outline-none
                  focus:border-blue-500
                "
              >
                <option value="RECIBIDO">Recibido</option>

                <option value="EN_PROCESO">En proceso</option>

                <option value="LISTO_PARA_ENTREGAR">Listo para entregar</option>

                <option value="ENTREGADO">Entregado</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
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
                text-slate-700
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
                disabled:opacity-60
              "
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
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
