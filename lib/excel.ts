import * as XLSX from "xlsx";

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

function crearHojaPedidos(
  pedidos: PedidoExcel[]
) {
  const datos = pedidos.map((pedido) => ({
    ID: pedido.id,
    Cliente: pedido.nombreCliente,
    Teléfono: pedido.telefonoCliente ?? "",
    Servicio: pedido.detallePrendas,
    "Monto Total": pedido.montoTotal,
    Adelanto: pedido.montoAdelanto,
    "Estado de Pago": pedido.estadoPago,
    "Estado del Servicio": pedido.estadoServicio,
    Fecha: pedido.createdAt,
  }));

  return XLSX.utils.json_to_sheet(datos);
}

function crearHojaGastos(
  gastos: GastoExcel[]
) {
  const datos = gastos.map((gasto) => ({
    ID: gasto.id,
    Concepto: gasto.concepto,
    Monto: gasto.monto,
    Categoría: gasto.categoria,
    Fecha: gasto.fecha,
  }));

  return XLSX.utils.json_to_sheet(datos);
}

export function exportarPedidosExcel(
  pedidos: PedidoExcel[]
) {
  const hoja = crearHojaPedidos(pedidos);

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    "Pedidos"
  );

  XLSX.writeFile(
    libro,
    "lavanderia-pedidos.xlsx"
  );
}

export function exportarGastosExcel(
  gastos: GastoExcel[]
) {
  const hoja = crearHojaGastos(gastos);

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    "Gastos"
  );

  XLSX.writeFile(
    libro,
    "lavanderia-gastos.xlsx"
  );
}

export function exportarTodoExcel(
  pedidos: PedidoExcel[],
  gastos: GastoExcel[]
) {
  const hojaPedidos =
    crearHojaPedidos(pedidos);

  const hojaGastos =
    crearHojaGastos(gastos);

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hojaPedidos,
    "Pedidos"
  );

  XLSX.utils.book_append_sheet(
    libro,
    hojaGastos,
    "Gastos"
  );

  XLSX.writeFile(
    libro,
    "lavanderia-completo.xlsx"
  );
}