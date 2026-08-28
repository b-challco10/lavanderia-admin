import AppShell from "@/components/layout/AppShell";
import PedidoCard from "@/components/pedidos/PedidoCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link"; // <-- Importamos Link

// Forzar a Vercel a consultar la BD en cada carga (evita caché viejo)
export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Operaciones
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#1E293B] sm:text-3xl">
              Pedidos
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Gestiona las prendas recibidas.
            </p>
          </div>

          {/* Cambiado <a> por <Link> para mantener la SPA fluida */}
          <Link
            href="/pedidos/nuevo"
            className="flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Nuevo pedido
          </Link>
        </div>

        {/* Lista */}
        {pedidos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">
              No hay pedidos registrados
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Registra el primer pedido de la lavandería.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pedidos.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}