const ZONA_HORARIA_BOLIVIA = "America/La_Paz";

export function obtenerFechaBoliviaInput(fecha: Date | string) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA_BOLIVIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(fecha));

  const year = partes.find((parte) => parte.type === "year")?.value;

  const month = partes.find((parte) => parte.type === "month")?.value;

  const day = partes.find((parte) => parte.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function formatearFechaHoraBolivia(fecha: Date | string) {
  return new Intl.DateTimeFormat("es-BO", {
    timeZone: ZONA_HORARIA_BOLIVIA,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));
}
