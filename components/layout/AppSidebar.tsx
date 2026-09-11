"use client";

import Link from "next/link";
import Image from "next/image";

import {
  LayoutDashboard,
  ClipboardList,
  WalletCards,
  History,
  Plus,
  LogOut,
  MapPin,
} from "lucide-react";

import { cerrarSesionAction } from "@/actions/cerrar-sesion";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Pedidos",
    href: "/pedidos",
    icon: ClipboardList,
  },
  {
    name: "Gastos",
    href: "/gastos",
    icon: WalletCards,
  },
  {
    name: "Historial",
    href: "/historial",
    icon: History,
  },
];

interface AppSidebarProps {
  nombreSucursal: string;
}

export default function AppSidebar({
  nombreSucursal,
}: AppSidebarProps) {
  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        w-64
        border-r
        border-slate-200
        bg-white
        md:block
      "
    >
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/lavadora.png"
            alt="Laundry Burbujas"
            width={44}
            height={44}
            className="object-contain"
          />

          <div className="flex flex-col leading-none">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
              LAUNDRY
            </h1>

            <p className="mt-1 text-[9px] font-bold tracking-[0.28em] text-blue-600">
              BURBUJAS
            </p>
          </div>
        </div>

        {nombreSucursal && (
          <div className="mt-4 rounded-xl bg-blue-50 px-3 py-3">
            <div className="flex items-center gap-2">
              <MapPin
                size={17}
                className="shrink-0 text-blue-600"
              />

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Sucursal
                </p>

                <p className="truncate text-sm font-bold text-slate-700">
                  {nombreSucursal}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                text-slate-600
                transition
                hover:bg-blue-50
                hover:text-blue-600
              "
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4 space-y-2">
        <Link
          href="/pedidos/nuevo"
          className="
            flex
            h-12
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
          "
        >
          <Plus size={20} />
          Nuevo pedido
        </Link>

        <form action={cerrarSesionAction}>
          <button
            type="submit"
            className="
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              text-sm
              font-medium
              text-slate-600
              transition
              hover:bg-slate-50
              hover:text-slate-900
            "
          >
            <LogOut size={19} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
