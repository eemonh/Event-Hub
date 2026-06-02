const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-100",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-50 text-red-700 border-red-100",
  completed: "bg-blue-50 text-blue-700 border-blue-100",
};

interface StatusBadgeProps {
  status?: string;
}

export default function StatusBadge({ status = "draft" }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES["draft"];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
