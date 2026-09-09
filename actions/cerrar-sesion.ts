"use server";

import { cerrarSesion } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function cerrarSesionAction() {
  await cerrarSesion();
  redirect("/login");
}