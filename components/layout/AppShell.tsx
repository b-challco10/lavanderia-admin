import { ReactNode } from "react";
import { LogOut, MapPin } from "lucide-react";
import Image from "next/image";
import AppSidebar from "./AppSidebar";
import MobileBottomNav from "./MobileBottomNav";
import { cerrarSesionAction } from "@/actions/cerrar-sesion";
import { obtenerSesion } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
interface AppShellProps {
  children: ReactNode;
}

export default async function AppShell({
  children,
}: AppShellProps) {
  const sesion = await obtenerSesion();

  let nombreSucursal = "";

  if (sesion?.sucursalId) {
    const sucursal = await prisma.sucursal.findUnique({
      where: {
        id: sesion.sucursalId,
      },
      select: {
        nombre: true,
      },
    });

    nombreSucursal = sucursal?.nombre ?? "";
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Sidebar Desktop */}
      <AppSidebar nombreSucursal={nombreSucursal} />

      {/* Barra superior Mobile */}
<div className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-white/10 bg-transparent px-4 shadow-sm backdrop-blur md:hidden">
  
<div className="flex items-center gap-3">
  <Image
    src="/lavadora.png"
    alt="Laundry Burbujas"
    width={42}
    height={42}
    className="object-contain"
  />

  <div className="flex flex-col leading-none">
    <span className="text-[22px] font-extrabold tracking-tight text-slate-800">
      LAUNDRY
    </span>

    <span className="mt-1 text-[9px] font-semibold tracking-[0.28em] text-blue-600">
      BURBUJAS
    </span>

    {nombreSucursal && (
      <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
        <MapPin size={11} />
        <span className="max-w-[130px] truncate">
          {nombreSucursal}
        </span>
      </div>
    )}
  </div>
</div>

  <form action={cerrarSesionAction}>
    <button
      type="submit"
      aria-label="Cerrar sesión"
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        text-slate-500
        shadow-sm
        transition
        hover:border-red-200
        hover:bg-red-50
        hover:text-red-500
        active:scale-95
      "
    >
      <LogOut size={19} strokeWidth={2} />
    </button>
  </form>

</div>

      {/* Contenido principal */}
      <main
        className="
          min-h-screen
          pb-24
          md:ml-64
          md:pb-0
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            p-4
            sm:p-6
            lg:p-8
          "
        >
          {children}
        </div>
      </main>

      {/* Bottom Navigation Mobile */}
      <MobileBottomNav />

    </div>
  );
}