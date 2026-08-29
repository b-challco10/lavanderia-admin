export const ZONA_HORARIA_BOLIVIA = "America/La_Paz";

export function formatearFechaBolivia(fecha: Date | string) {
  return new Intl.DateTimeFormat("es-BO", {
    timeZone: ZONA_HORARIA_BOLIVIA,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(fecha));
}

export function formatearFechaHoraBolivia(fecha: Date | string) {
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
