"use client";

import {
  Download,
  FileSpreadsheet,
} from "lucide-react";

import {
  exportarPedidosExcel,
  exportarGastosExcel,
  exportarTodoExcel,
} from "@/lib/excel";

interface PedidoExcel {
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

interface GastoExcel {
  id: string;
  concepto: string;
  monto: number;
  categoria: string;
  fecha: string;
}

interface ExportExcelButtonsProps {
  pedidos: PedidoExcel[];
  gastos: GastoExcel[];
}

export default function ExportExcelButtons({
  pedidos,
  gastos,
}: ExportExcelButtonsProps) {
  return (
    <div className="
      flex
      flex-col
      gap-2
      sm:flex-row
      sm:flex-wrap
    ">

      {/* Pedidos */}
      <button
        type="button"
        onClick={() =>
          exportarPedidosExcel(pedidos)
        }
        className="
          flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-emerald-600
          px-4
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-emerald-700
        "
      >
        <FileSpreadsheet size={18} />
        Exportar pedidos
      </button>

      {/* Gastos */}
      <button
        type="button"
        onClick={() =>
          exportarGastosExcel(gastos)
        }
        className="
          flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-red-500
          px-4
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-red-600
        "
      >
        <FileSpreadsheet size={18} />
        Exportar gastos
      </button>

      {/* Todo */}
      <button
        type="button"
        onClick={() =>
          exportarTodoExcel(
            pedidos,
            gastos
          )
        }
        className="
          flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          text-sm
          font-semibold
          text-slate-700
          transition
          hover:bg-slate-50
        "
      >
        <Download size={18} />
        Exportar todo (.xlsx)
      </button>

    </div>
  );
}