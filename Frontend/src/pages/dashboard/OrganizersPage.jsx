import { useEffect } from "react";
import { Users } from "lucide-react";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";

export default function DashboardOrganizers() {
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Organizers"]);
  }, [setBreadcrumbs]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <section className="space-y-2">
        <h1 className="font-[Poppins] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Organizers
        </h1>
        <p className="text-base text-slate-500">
          Browse and manage event organizers.
        </p>
      </section>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
        <Users size={48} className="text-slate-300" />
        <p className="mt-4 text-lg font-medium text-slate-500">No organizers yet</p>
        <p className="text-sm text-slate-400">Organizers will appear here once added.</p>
      </div>
    </div>
  );
}
