import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET no está configurado.");
}

export type RolUsuario = "ADMINISTRADOR" | "EMPLEADO";

export async function crearSesion(
  usuarioId: string,
  rol: RolUsuario,
) {
  const token = await new SignJWT({
    usuarioId,
    rol,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();

  cookieStore.set("sesion", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function obtenerSesion() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sesion")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    if (
      typeof payload.usuarioId !== "string" ||
      (payload.rol !== "ADMINISTRADOR" &&
        payload.rol !== "EMPLEADO")
    ) {
      return null;
    }

    return {
      usuarioId: payload.usuarioId,
      rol: payload.rol as RolUsuario,
    };
  } catch {
    return null;
  }
}

export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete("sesion");
}