import dayjs from "dayjs";

export function formatFechaConOffset(fechaIso: string): string {
  return dayjs(fechaIso).add(3, "hour").format("DD/MM/YYYY HH:mm");
}