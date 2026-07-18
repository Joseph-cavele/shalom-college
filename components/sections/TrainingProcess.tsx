import { BookOpen, FileText, MailCheck, Users, GraduationCap, Briefcase, type LucideIcon } from "lucide-react";

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: BookOpen, title: "Choose Course", text: "Select the course that's right for you." },
  { icon: FileText, title: "Submit Application", text: "Fill in the application form online." },
  { icon: MailCheck, title: "Receive Confirmation", text: "We will confirm your application." },
  { icon: Users, title: "Attend Training", text: "Join practical and theoretical classes." },
  { icon: GraduationCap, title: "Graduate", text: "Complete your training and assessments." },
  { icon: Briefcase, title: "Start Your Career", text: "Step into the industry with confidence." },
];

/** Six-step application-to-career process. */
export function TrainingProcess() {
  return (
    <section className="py-20">
      <div className="container-x">
        <h2 className="text-center text-3xl font-extrabold text-navy dark:text-slate-100" data-reveal>Our Training Process</h2>
        <div className="mx-auto mt-2 h-1 w-16 rounded bg-brand-green" />

        <ol className="relative mt-12 grid gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {/* connecting line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-slate-200 dark:bg-white/10 lg:block" />
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              data-reveal-delay={String(i * 80)}
              className="relative flex flex-col items-center px-2 text-center"
            >
              <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 border-brand-green bg-white text-brand-green transition hover:scale-110 dark:bg-navy-800">
                <s.icon className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-navy text-[0.65rem] font-bold text-white dark:bg-brand-green">
                  {i + 1}
                </span>
              </span>
              <h4 className="mt-4 font-bold text-navy dark:text-slate-100">{s.title}</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
