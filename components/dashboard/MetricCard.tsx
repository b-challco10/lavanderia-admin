import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  variant?: "blue" | "green" | "red" | "orange";
}

const variants = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
  orange: "bg-orange-50 text-orange-600",
};

export default function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "blue",
}: MetricCardProps) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
    "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-[#1E293B]">{value}</p>

          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>

        <div
          className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          ${variants[variant]}
        `}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
