import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET no está configurado.");
}

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);

const rutasProtegidas = [
  "/dashboard",
  "/pedidos",
  "/gastos",
  "/historial",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const necesitaLogin = rutasProtegidas.some(
    (ruta) =>
      pathname === ruta ||
      pathname.startsWith(`${ruta}/`),
  );

  if (!necesitaLogin) {
    return NextResponse.next();
  }

  const token = request.cookies.get("sesion")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    const rol = payload.rol;
    const sucursalId = payload.sucursalId;

    if (
      rol !== "ADMINISTRADOR" &&
      rol !== "EMPLEADO"
    ) {
      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }

    // Si todavía no seleccionó una sucursal
    if (typeof sucursalId !== "string") {
      return NextResponse.redirect(
        new URL("/seleccionar-sucursal", request.url),
      );
    }

    // El empleado NO puede entrar a Dashboard ni Gastos.
    if (
      rol === "EMPLEADO" &&
      (
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/") ||
        pathname === "/gastos" ||
        pathname.startsWith("/gastos/")
      )
    ) {
      return NextResponse.redirect(
        new URL("/pedidos", request.url),
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pedidos/:path*",
    "/gastos/:path*",
    "/historial/:path*",
  ],
};