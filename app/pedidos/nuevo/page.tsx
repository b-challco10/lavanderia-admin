import AppShell from "@/components/layout/AppShell";
import PedidoForm from "@/components/pedidos/PedidoForm";

export default function NuevoPedidoPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium text-blue-600">Recepción rápida</p>

          <h1 className="mt-1 text-2xl font-bold text-[#1E293B] sm:text-3xl">
            Nuevo pedido
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Registra las prendas y el pago del cliente.
          </p>
        </div>

        <PedidoForm />
      </div>
    </AppShell>
  );
}
