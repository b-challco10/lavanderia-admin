"use client";

import { useMemo, useState } from "react";
import { Search, Package, Receipt } from "lucide-react";

import PedidoStatusBadge from "@/components/pedidos/PedidoStatusBadge";
import { formatearFechaHoraBolivia } from "@/lib/fecha";

interface PedidoHistorial {
  id: string;
  nombreCliente: string;
  telefonoCliente: string | null;
  detallePrendas: string;
  montoTotal: number;
  montoAdelanto: number;
  estadoPago: string;
  estadoServicio: string;
  createdAt: string;
}

interface GastoHistorial {
  id: string;
  concepto: string;
  monto: number;
  categoria: string;
  fecha: string;
}

interface HistorialClientProps {
  pedidos: PedidoHistorial[];
  gastos: GastoHistorial[];
}

type Filtro = "pedidos" | "gastos";

export default function HistorialClient({
  pedidos,
  gastos,
}: HistorialClientProps) {
  const [filtro, setFiltro] = useState<Filtro>("pedidos");

  const [busqueda, setBusqueda] = useState("");

  const pedidosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return pedidos;

    return pedidos.filter((pedido) =>
      [
        pedido.nombreCliente,
        pedido.telefonoCliente ?? "",
        pedido.detallePrendas,
        pedido.estadoPago,
        pedido.estadoServicio,
      ]
        .join(" ")
        .toLowerCase()
        .includes(texto),
    );
  }, [pedidos, busqueda]);

  const gastosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return gastos;

    return gastos.filter((gasto) =>
      [gasto.concepto, gasto.categoria].join(" ").toLowerCase().includes(texto),
    );
  }, [gastos, busqueda]);

  return (
    <div className="space-y-5">
      {/* Selector */}
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
        <button
          type="button"
          onClick={() => {
            setFiltro("pedidos");
            setBusqueda("");
          }}
          className={`
            flex
            flex-1
            items-center
            justify-center
            gap-2
            rounded-lg
            px-4
            py-3
            text-sm
            font-semibold
            transition
            ${
              filtro === "pedidos"
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }
          `}
        >
          <Package size={18} />
          Pedidos
        </button>

        <button
          type="button"
          onClick={() => {
            setFiltro("gastos");
            setBusqueda("");
          }}
          className={`
            flex
            flex-1
            items-center
            justify-center
            gap-2
            rounded-lg
            px-4
            py-3
            text-sm
            font-semibold
            transition
            ${
              filtro === "gastos"
                ? "bg-red-500 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }
          `}
        >
          <Receipt size={18} />
          Gastos
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search
          size={20}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder={
            filtro === "pedidos"
              ? "Buscar cliente, teléfono o servicio..."
              : "Buscar concepto o categoría..."
          }
          className="
            h-12
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            pl-12
            pr-4
            text-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </div>

      {/* Contador */}
      <p className="text-sm text-slate-500">
        {filtro === "pedidos"
          ? `${pedidosFiltrados.length} pedido${
              pedidosFiltrados.length === 1 ? "" : "s"
            }`
          : `${gastosFiltrados.length} gasto${
              gastosFiltrados.length === 1 ? "" : "s"
            }`}
      </p>

      {/* Pedidos */}
      {filtro === "pedidos" && (
        <div className="space-y-3">
          {pedidosFiltrados.length === 0 ? (
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
              <p className="font-medium text-slate-700">
                No se encontraron pedidos
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Prueba con otro término de búsqueda.
              </p>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => (
              <div
                key={pedido.id}
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
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
                >
                  <div className="min-w-0">
                    <div
                      className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                    >
                      <h2
                        className="
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

                    <p
                      className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                    >
                      {pedido.detallePrendas}
                    </p>

                    <div
                      className="
                      mt-2
                      flex
                      flex-wrap
                      gap-x-4
                      gap-y-1
                      text-xs
                      text-slate-400
                    "
                    >
                      <span>{formatearFechaHoraBolivia(pedido.createdAt)}</span>

                      {pedido.telefonoCliente && (
                        <span>📞 {pedido.telefonoCliente}</span>
                      )}
                    </div>
                  </div>

                  <div
                    className="
                    flex
                    flex-col
                    items-start
                    gap-2
                    lg:items-end
                  "
                  >
                    <p
                      className="
                      text-lg
                      font-bold
                      text-slate-800
                    "
                    >
                      Bs {pedido.montoTotal.toFixed(2)}
                    </p>

                    <p
                      className="
                      text-xs
                      text-slate-400
                    "
                    >
                      Adelanto: Bs {pedido.montoAdelanto.toFixed(2)}
                    </p>

                    <PedidoStatusBadge tipo="pago" estado={pedido.estadoPago} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Gastos */}
      {filtro === "gastos" && (
        <div className="space-y-3">
          {gastosFiltrados.length === 0 ? (
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
              <p className="font-medium text-slate-700">
                No se encontraron gastos
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Prueba con otro término de búsqueda.
              </p>
            </div>
          ) : (
            gastosFiltrados.map((gasto) => (
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
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
                >
                  <div>
                    <h2
                      className="
                      font-semibold
                      text-slate-800
                    "
                    >
                      {gasto.concepto}
                    </h2>

                    <div
                      className="
                      mt-2
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                    >
                      <span
                        className="
                        rounded-full
                        bg-red-50
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-red-600
                      "
                      >
                        {gasto.categoria.replaceAll("_", " ")}
                      </span>

                      <span
                        className="
                        text-xs
                        text-slate-400
                      "
                      >
                        {formatearFechaHoraBolivia(gasto.fecha)}
                      </span>
                    </div>
                  </div>

                  <p
                    className="
                    text-lg
                    font-bold
                    text-red-500
                  "
                  >
                    - Bs {gasto.monto.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
