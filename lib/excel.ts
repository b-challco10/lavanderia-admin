import * as XLSX from "xlsx";

const ZONA_HORARIA_BOLIVIA = "America/La_Paz";

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

function formatearFechaBolivia(fecha: string) {
  return new Intl.DateTimeFormat("es-BO", {
    timeZone: ZONA_HORARIA_BOLIVIA,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(fecha));
}

function formatearFechaHoraBolivia(fecha: string) {
  return new Intl.DateTimeFormat("es-BO", {
    timeZone: ZONA_HORARIA_BOLIVIA,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(fecha));
}

function crearHojaPedidos(pedidos: PedidoExcel[]) {
  const datos = pedidos.map((pedido) => ({
    ID: pedido.id,
    Cliente: pedido.nombreCliente,
    Teléfono: pedido.telefonoCliente ?? "",
    Servicio: pedido.detallePrendas,
    "Monto Total": pedido.montoTotal,
    Adelanto: pedido.montoAdelanto,
    "Estado de Pago": pedido.estadoPago,
    "Estado del Servicio": pedido.estadoServicio,

    // Fecha y hora real del registro en Bolivia
    Fecha: formatearFechaHoraBolivia(pedido.createdAt),
  }));

  return XLSX.utils.json_to_sheet(datos);
}

function crearHojaGastos(gastos: GastoExcel[]) {
  const datos = gastos.map((gasto) => ({
    ID: gasto.id,
    Concepto: gasto.concepto,
    Monto: gasto.monto,
    Categoría: gasto.categoria,

    // El gasto tiene una fecha seleccionada, normalmente solo mostramos el día
    Fecha: formatearFechaBolivia(gasto.fecha),
  }));

  return XLSX.utils.json_to_sheet(datos);
}

export function exportarPedidosExcel(pedidos: PedidoExcel[]) {
  const hoja = crearHojaPedidos(pedidos);

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(libro, hoja, "Pedidos");

  XLSX.writeFile(libro, "lavanderia-pedidos.xlsx");
}

export function exportarGastosExcel(gastos: GastoExcel[]) {
  const hoja = crearHojaGastos(gastos);

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(libro, hoja, "Gastos");

  XLSX.writeFile(libro, "lavanderia-gastos.xlsx");
}

export function exportarTodoExcel(
  pedidos: PedidoExcel[],
  gastos: GastoExcel[],
) {
  const hojaPedidos = crearHojaPedidos(pedidos);

  const hojaGastos = crearHojaGastos(gastos);

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(libro, hojaPedidos, "Pedidos");

  XLSX.utils.book_append_sheet(libro, hojaGastos, "Gastos");

  XLSX.writeFile(libro, "lavanderia-completo.xlsx");
}
