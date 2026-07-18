/** Centered section heading with optional subtitle. */
export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center" data-reveal>
      <h2 className="text-3xl font-extrabold text-navy dark:text-slate-100">{title}</h2>
      {subtitle && <p className="mx-auto mt-1 max-w-2xl text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
