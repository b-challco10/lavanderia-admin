"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  WalletCards,
  History,
  WashingMachine,
  Plus,
} from "lucide-react";

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

export default function AppSidebar() {
  return (
    <aside className="
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
">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <WashingMachine size={22} />
        </div>

        <div>
          <h1 className="font-bold text-slate-800">Lavandería</h1>

          <p className="text-xs text-slate-400">Administración</p>
        </div>
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

      <div className="absolute bottom-6 left-4 right-4">
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
      </div>
    </aside>
  );
}
