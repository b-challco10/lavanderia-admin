import { Building2, MapPin } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { seleccionarSucursal } from "@/actions/sucursal";
import { obtenerSesion } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SeleccionarSucursalPage() {
  const sesion = await obtenerSesion();

  if (!sesion) {
    redirect("/login");
  }

  const sucursales = await prisma.sucursal.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 px-4 py-10">
      {/* Decoración de fondo */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      {/* Tarjeta */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-7 shadow-2xl backdrop-blur sm:p-9">
        {/* Marca */}
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <span className="text-2xl font-extrabold text-white">
              LB
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            LAUNDRY
          </h1>

          <p className="mt-1 text-[11px] font-bold tracking-[0.35em] text-blue-600">
            BURBUJAS
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Selecciona la sucursal con la que deseas trabajar
          </p>
        </div>

        {/* Título */}
        <div className="mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" />

          <h2 className="text-sm font-semibold text-slate-700">
            Sucursales disponibles
          </h2>
        </div>

        {/* Sucursales */}
        <div className="space-y-3">
          {sucursales.map((sucursal) => (
            <form
              key={sucursal.id}
              action={async () => {
                "use server";
                await seleccionarSucursal(sucursal.id);
              }}
            >
              <button
                type="submit"
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                  text-left
                  transition
                  hover:border-blue-300
                  hover:bg-blue-50
                  hover:shadow-md
                  active:scale-[0.99]
                "
              >
                {/* Ícono */}
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                    transition
                    group-hover:bg-blue-600
                    group-hover:text-white
                  "
                >
                  <Building2 size={22} />
                </div>

                {/* Información */}
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-slate-800">
                    {sucursal.nombre}
                  </p>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Entrar a esta sucursal
                  </p>
                </div>

                {/* Flecha */}
                <span className="text-xl font-medium text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </button>
            </form>
          ))}
        </div>

        {/* Sin sucursales */}
        {sucursales.length === 0 && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-700">
            No hay sucursales registradas.
          </div>
        )}

        {/* Pie */}
        <p className="mt-7 text-center text-xs text-slate-400">
          Sistema de administración
        </p>
      </div>
    </main>
  );
}

