"use client";

import Link from "next/link";
import {
  Home,
  ClipboardList,
  Plus,
  WalletCards,
  History,
} from "lucide-react";

export default function MobileBottomNav() {
  return (
    <nav className="
  fixed
  bottom-0
  left-0
  right-0
  z-50
  border-t
  border-slate-200
  bg-white
  px-2
  py-2
  shadow-lg
  md:hidden
">

      <div className="flex items-center justify-around">

        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 p-2 text-slate-500"
        >
          <Home size={21} />
          <span className="text-[10px]">Inicio</span>
        </Link>

        <Link
          href="/pedidos"
          className="flex flex-col items-center gap-1 p-2 text-slate-500"
        >
          <ClipboardList size={21} />
          <span className="text-[10px]">Pedidos</span>
        </Link>

        <Link
          href="/pedidos/nuevo"
          className="
            -mt-7
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-white
            shadow-lg
          "
        >
          <Plus size={27} />
        </Link>

        <Link
          href="/gastos"
          className="flex flex-col items-center gap-1 p-2 text-slate-500"
        >
          <WalletCards size={21} />
          <span className="text-[10px]">Gastos</span>
        </Link>

        <Link
          href="/historial"
          className="flex flex-col items-center gap-1 p-2 text-slate-500"
        >
          <History size={21} />
          <span className="text-[10px]">Historial</span>
        </Link>

      </div>

    </nav>
  );
}