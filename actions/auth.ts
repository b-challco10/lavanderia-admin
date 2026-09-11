"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { crearSesion } from "@/lib/auth";

export async function iniciarSesion(
  usuario: string,
  password: string,
) {
  const usuarioLimpio = usuario.trim();

  if (!usuarioLimpio || !password) {
    return {
      success: false,
      error: "Usuario y contraseña son obligatorios.",
    };
  }

  const usuarioEncontrado = await prisma.usuario.findUnique({
    where: {
      usuario: usuarioLimpio,
    },
  });

  if (!usuarioEncontrado) {
    return {
      success: false,
      error: "Usuario o contraseña incorrectos.",
    };
  }

  const passwordCorrecta = await bcrypt.compare(
    password,
    usuarioEncontrado.password,
  );

  if (!passwordCorrecta) {
    return {
      success: false,
      error: "Usuario o contraseña incorrectos.",
    };
  }

  // Se crea la sesión sin sucursal seleccionada todavía.
  await crearSesion(
    usuarioEncontrado.id,
    usuarioEncontrado.rol,
  );

  redirect("/seleccionar-sucursal");
}