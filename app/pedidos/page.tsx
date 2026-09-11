import AppShell from "@/components/layout/AppShell";
import PedidoCard from "@/components/pedidos/PedidoCard";
import { prisma } from "@/lib/prisma";
import { obtenerSesion } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const sesion = await obtenerSesion();

  if (!sesion) {
    redirect("/login");
  }

  if (!sesion.sucursalId) {
    redirect("/seleccionar-sucursal");
  }

  const pedidos = await prisma.pedido.findMany({
    where: {
      sucursalId: sesion.sucursalId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pedidosFormateados = pedidos.map((pedido) => ({
    ...pedido,
    montoTotal: Number(pedido.montoTotal),
    montoAdelanto: Number(pedido.montoAdelanto),
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Encabezado */}
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p className="text-sm font-medium text-blue-600">Operaciones</p>

            <h1
              className="
                mt-1
                text-2xl
                font-bold
                text-[#1E293B]
                sm:text-3xl
              "
            >
              Pedidos
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Gestiona las prendas recibidas.
            </p>
          </div>

          {/* Nuevo pedido */}
          <Link
            href="/pedidos/nuevo"
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            + Nuevo pedido
          </Link>
        </div>

        {/* Lista */}
        {pedidos.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-10
              text-center
            "
          >
            <p className="font-medium text-slate-700">
              No hay pedidos registrados
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Registra el primer pedido de la lavandería.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pedidosFormateados.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} rol={sesion?.rol} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
