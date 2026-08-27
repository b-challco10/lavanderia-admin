import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  PackageCheck,
  CircleDollarSign,
  AlertCircle,
} from "lucide-react";

interface PedidoStatusBadgeProps {
  tipo: "servicio" | "pago";
  estado: string;
}

export default function PedidoStatusBadge({
  tipo,
  estado,
}: PedidoStatusBadgeProps) {
  if (tipo === "pago") {
    if (estado === "PAGADO") {
      return (
        <span
          className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-emerald-50
          px-3
          py-1.5
          text-xs
          font-semibold
          text-emerald-600
        "
        >
          <CircleDollarSign size={14} />
          PAGADO
        </span>
      );
    }

    return (
      <span
        className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        bg-red-50
        px-3
        py-1.5
        text-xs
        font-semibold
        text-red-600
      "
      >
        <AlertCircle size={14} />
        PENDIENTE
      </span>
    );
  }

  const estados = {
    RECIBIDO: {
      label: "RECIBIDO",
      icon: Clock3,
      className: "bg-slate-100 text-slate-600",
    },

    EN_PROCESO: {
      label: "EN PROCESO",
      icon: LoaderCircle,
      className: "bg-blue-50 text-blue-600",
    },

    LISTO_PARA_ENTREGAR: {
      label: "LISTO PARA ENTREGAR",
      icon: PackageCheck,
      className: "bg-emerald-50 text-emerald-600",
    },

    ENTREGADO: {
      label: "ENTREGADO",
      icon: CheckCircle2,
      className: "bg-purple-50 text-purple-600",
    },
  };

  const configuracion = estados[estado as keyof typeof estados];

  if (!configuracion) {
    return null;
  }

  const Icon = configuracion.icon;

  return (
    <span
      className={`
      inline-flex
      items-center
      gap-1.5
      rounded-full
      px-3
      py-1.5
      text-xs
      font-semibold
      ${configuracion.className}
    `}
    >
      <Icon size={14} />
      {configuracion.label}
    </span>
  );
}
