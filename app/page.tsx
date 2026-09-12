import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth";

export default async function Home() {
  const sesion = await obtenerSesion();

  if (!sesion) {
    redirect("/login");
  }

  if (!sesion.sucursalId) {
    redirect("/seleccionar-sucursal");
  }

  if (sesion.rol === "EMPLEADO") {
    redirect("/pedidos");
  }

  redirect("/dashboard");
}