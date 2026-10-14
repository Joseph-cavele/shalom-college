import Link from "next/link";
import {
  Inbox,
  Hourglass,
  GraduationCap,
  BookOpen,
  Mail,
  Trophy,
  ArrowRight,
  ClipboardList,
  MessageSquareReply,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";
import { Course } from "@/lib/models/Course";
import { Message } from "@/lib/models/Message";
import { StatCard } from "@/components/admin/StatCard";
import { PeriodSelect, PrintButton } from "@/components/admin/DashboardControls";
import { BarChart } from "@/components/admin/charts/BarChart";
import { DonutChart } from "@/components/admin/charts/DonutChart";
import { HBarChart } from "@/components/admin/charts/HBarChart";
import { Sparkline } from "@/components/admin/charts/Sparkline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn, formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

interface AppRow {
  _id: string;
  fullName: string;
  course: string;
  phone: string;
  status: ApplicationStatus;
  createdAt: string;
}

interface MsgRow {
  _id: string;
  name: string;
  subject: string;
  read: boolean;
  createdAt: string;
}

const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 1000) / 10 : 0);
const norm = (s: string) => (s || "").trim().toLowerCase();

async function getDashboardData(yearParam?: string) {
  await connectDB();
  const [appsRaw, coursesRaw, msgsRaw, unread, msgTotal] = await Promise.all([
    Application.find().select("fullName course phone status createdAt").sort({ createdAt: -1 }).lean(),
    Course.find().select("name category active").lean(),
    Message.find().select("name subject read createdAt").sort({ createdAt: -1 }).limit(5).lean(),
    Message.countDocuments({ read: false }),
    Message.countDocuments(),
  ]);
  const apps = JSON.parse(JSON.stringify(appsRaw)) as AppRow[];
  const courses = JSON.parse(JSON.stringify(coursesRaw)) as { name: string; category: string; active: boolean }[];
  const messages = JSON.parse(JSON.stringify(msgsRaw)) as MsgRow[];

  // ---- Period: rolling last 12 months, or a calendar year that has data ----
  const now = new Date();
  const years = Array.from(
    new Set(apps.map((a) => new Date(a.createdAt).getFullYear()).filter((y) => !isNaN(y)))
  ).sort((a, b) => b - a);
  const year = yearParam && years.includes(Number(yearParam)) ? Number(yearParam) : null;
  const start = year ? new Date(year, 0, 1) : new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const end = year ? new Date(year + 1, 0, 1) : new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const prevStart = year ? new Date(year - 1, 0, 1) : new Date(now.getFullYear(), now.getMonth() - 23, 1);
  const prevLabel = year ? String(year - 1) : "prev. 12 months";

  const inRange = (a: AppRow, from: Date, to: Date) => {
    const d = new Date(a.createdAt);
    return d >= from && d < to;
  };
  const current = apps.filter((a) => inRange(a, start, end));
  const previousCount = apps.filter((a) => inRange(a, prevStart, start)).length;

  // ---- Monthly buckets for the period ----
  const monthly = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-ZA", { month: "short" }),
      title: d.toLocaleString("en-ZA", { month: "long", year: "numeric" }),
      value: 0,
    };
  });
  const monthIndex = new Map(monthly.map((m, i) => [m.key, i]));
  const thisMonthIdx = monthIndex.get(`${now.getFullYear()}-${now.getMonth()}`) ?? -1;

  // ---- Status split ----
  const byStatus: Record<ApplicationStatus, number> = { Pending: 0, Contacted: 0, Registered: 0, Rejected: 0 };

  // ---- Per course (name as entered on the form) and per category ----
  const categoryOf = new Map(courses.map((c) => [norm(c.name), c.category]));
  const perCourse = new Map<
    string,
    { name: string; total: number; Registered: number; Pending: number; Rejected: number; trend: number[] }
  >();
  const perCategory = new Map<string, number>(
    Array.from(new Set(courses.filter((c) => c.active).map((c) => c.category))).map((c) => [c, 0])
  );

  for (const a of current) {
    const d = new Date(a.createdAt);
    const mi = monthIndex.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (mi !== undefined) monthly[mi].value++;
    if (a.status in byStatus) byStatus[a.status]++;

    const key = norm(a.course);
    let row = perCourse.get(key);
    if (!row) {
      row = { name: a.course, total: 0, Registered: 0, Pending: 0, Rejected: 0, trend: new Array(12).fill(0) };
      perCourse.set(key, row);
    }
    row.total++;
    if (a.status === "Registered" || a.status === "Pending" || a.status === "Rejected") row[a.status]++;
    if (mi !== undefined) row.trend[mi]++;

    const cat = categoryOf.get(key) || "Other";
    perCategory.set(cat, (perCategory.get(cat) || 0) + 1);
  }

  const courseRows = Array.from(perCourse.values()).sort((a, b) => b.total - a.total);
  const categories = Array.from(perCategory, ([label, value]) => ({ label, value })).sort(
    (a, b) => b.value - a.value || a.label.localeCompare(b.label)
  );

  return {
    years,
    year,
    prevLabel,
    total: current.length,
    previousCount,
    byStatus,
    monthly,
    thisMonthIdx,
    courseRows,
    categories,
    activeCourses: courses.filter((c) => c.active).length,
    activeCategories: new Set(courses.filter((c) => c.active).map((c) => c.category)).size,
    recentApps: apps.slice(0, 5),
    messages,
    unread,
    msgTotal,
  };
}

function Panel({
  title,
  icon: Icon,
  action,
  className,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  action?: { href: string; label: string };
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-card", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-navy">
          {Icon && <Icon className="h-4 w-4 text-brand-gold" />}
          {title}
        </h3>
        {action && (
          <Link
            href={action.href}
            className="flex items-center gap-1 text-xs font-bold text-brand-green hover:underline print:hidden"
          >
            {action.label} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

const RANK_STYLES = [
  "bg-amber-400 text-white", // gold
  "bg-slate-300 text-slate-700", // silver
  "bg-orange-500 text-white", // bronze
];

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year: yearParam } = await searchParams;
  const d = await getDashboardData(yearParam);
  const periodLabel = d.year ? String(d.year) : "Last 12 months";

  const delta = d.previousCount ? Math.round(((d.total - d.previousCount) / d.previousCount) * 1000) / 10 : null;
  const totalNote =
    delta === null
      ? "No earlier data to compare"
      : `${delta >= 0 ? "+" : ""}${delta}% vs ${d.prevLabel}`;

  const donut = [
    { label: "Pending", value: d.byStatus.Pending, color: "#f59e0b" },
    { label: "Contacted", value: d.byStatus.Contacted, color: "#3b82f6" },
    { label: "Registered", value: d.byStatus.Registered, color: "#22c55e" },
    { label: "Rejected", value: d.byStatus.Rejected, color: "#f43f5e" },
  ];
  const topCourses = d.courseRows.slice(0, 5);
  const tableRows = d.courseRows.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Heading + filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-navy">Overview</h2>
          <span className="text-sm text-slate-500">Performance at a glance · {periodLabel}</span>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <PeriodSelect years={d.years} value={d.year ? String(d.year) : ""} />
          <PrintButton />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <StatCard
          tone="blue"
          icon={Inbox}
          label="Total Applications"
          value={d.total.toLocaleString("en-ZA")}
          note={totalNote}
          trend={delta === null ? null : delta >= 0 ? "up" : "down"}
        />
        <StatCard
          tone="orange"
          icon={Hourglass}
          label="New (Pending)"
          value={d.byStatus.Pending}
          note={`${pct(d.byStatus.Pending, d.total)}% awaiting follow-up`}
        />
        <StatCard
          tone="green"
          icon={GraduationCap}
          label="Registered"
          value={d.byStatus.Registered}
          note={`${pct(d.byStatus.Registered, d.total)}% registration rate`}
        />
        <StatCard
          tone="purple"
          icon={BookOpen}
          label="Active Courses"
          value={d.activeCourses}
          note={`Across ${d.activeCategories} categories`}
        />
        <StatCard
          tone="teal"
          icon={Mail}
          label="Unread Messages"
          value={d.unread}
          note={`${d.msgTotal} message${d.msgTotal === 1 ? "" : "s"} in total`}
        />
      </div>

      {/* Status · Monthly · Top courses */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[1fr_1.25fr_0.9fr]">
        <Panel title="Application Status">
          <DonutChart data={donut} />
        </Panel>

        <Panel title="Applications per Month">
          <BarChart data={d.monthly} highlight={d.year ? d.thisMonthIdx : undefined} />
        </Panel>

        <Panel title="Top Courses" icon={Trophy} className="lg:col-span-2 xl:col-span-1">
          {topCourses.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No applications in this period.</p>
          ) : (
            <ol className="divide-y divide-slate-100">
              {topCourses.map((c, i) => (
                <li key={c.name} className="flex items-center gap-3 py-2.5">
                  <span
                    className={cn(
                      "grid h-6 w-6 flex-none place-items-center rounded-full text-xs font-extrabold",
                      RANK_STYLES[i] || "bg-slate-100 text-slate-500"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-navy" title={c.name}>
                    {c.name}
                  </span>
                  <span className="flex-none text-right text-sm font-bold text-brand-green">
                    {c.total}
                    <span className="ml-1 text-xs font-semibold text-slate-400">({pct(c.total, d.total)}%)</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      {/* Course performance · Categories */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Panel title="Course Performance Overview" action={{ href: "/admin/applications", label: "Applications" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-lg text-sm">
              <thead>
                <tr className="bg-navy text-left text-[0.7rem] font-bold uppercase tracking-wide text-white">
                  <th className="px-3 py-3">Course</th>
                  <th className="px-3 py-3 text-right">Applications</th>
                  <th className="px-3 py-3 text-right">Registered</th>
                  <th className="px-3 py-3 text-right">Reg. Rate</th>
                  <th className="px-3 py-3 text-right">Pending</th>
                  <th className="px-3 py-3 text-right">Rejected</th>
                  <th className="px-3 py-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((c) => (
                  <tr key={c.name} className="border-b border-slate-100 even:bg-slate-50/70 hover:bg-slate-50">
                    <td className="max-w-[220px] truncate px-3 py-2.5 font-semibold text-navy" title={c.name}>
                      {c.name}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-navy">{c.total}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{c.Registered}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{pct(c.Registered, c.total)}%</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{c.Pending}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{c.Rejected}</td>
                    <td className="px-3 py-1.5">
                      <Sparkline values={c.trend} label={`Monthly applications for ${c.name}`} />
                    </td>
                  </tr>
                ))}
                {tableRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No applications in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Applications by Category">
          {d.categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No courses yet.</p>
          ) : (
            <HBarChart data={d.categories} />
          )}
        </Panel>
      </div>

      {/* Recent applications · Messages + quick actions */}
      <div className="grid items-start gap-6 xl:grid-cols-[2fr_1fr]">
        <Panel title="Recent Applications" action={{ href: "/admin/applications", label: "View all" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-2 py-3">Full Name</th>
                  <th className="px-2 py-3">Course</th>
                  <th className="px-2 py-3">Phone</th>
                  <th className="px-2 py-3">Date</th>
                  <th className="px-2 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {d.recentApps.map((a) => (
                  <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-2 py-3 font-semibold text-navy">{a.fullName}</td>
                    <td className="max-w-[220px] truncate px-2 py-3 text-slate-600">{a.course}</td>
                    <td className="px-2 py-3 text-slate-600">{a.phone}</td>
                    <td className="px-2 py-3 text-slate-500">{formatDate(a.createdAt)}</td>
                    <td className="px-2 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
                {d.recentApps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      No applications yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="flex min-w-0 flex-col gap-6">
          <Panel title="Recent Messages" action={{ href: "/admin/messages", label: "View all" }}>
            {d.messages.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {d.messages.map((m) => (
                  <li key={m._id} className="flex items-start gap-3 py-2.5">
                    <span
                      className={cn("mt-1.5 h-2 w-2 flex-none rounded-full", m.read ? "bg-slate-200" : "bg-brand-green")}
                      title={m.read ? "Read" : "Unread"}
                    />
                    <div className="min-w-0 flex-1">
                      <div className={cn("truncate text-sm text-navy", m.read ? "font-medium" : "font-bold")}>
                        {m.name}
                      </div>
                      <div className="truncate text-xs text-slate-500">{m.subject}</div>
                    </div>
                    <span className="flex-none text-xs text-slate-400">{formatDate(m.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-indigo-800 p-5 text-white shadow-card print:hidden">
            <span className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
            <h3 className="font-extrabold">Keep up the great work!</h3>
            <p className="mt-1 text-xs text-white/75">Quick actions for today.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/admin/applications"
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                <ClipboardList className="h-4 w-4" />
                Review pending applications
                <span className="ml-auto rounded-full bg-amber-400 px-2 text-xs font-extrabold text-navy">
                  {d.byStatus.Pending}
                </span>
              </Link>
              <Link
                href="/admin/messages"
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                <MessageSquareReply className="h-4 w-4" />
                Reply to messages
                <span className="ml-auto rounded-full bg-brand-green px-2 text-xs font-extrabold">{d.unread}</span>
              </Link>
              <Link
                href="/admin/courses"
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
                Add a course
              </Link>
            </div>
          </section>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Data updated as of {formatDate(new Date())} · Source: Shalom Training School applications database
      </p>
    </div>
  );
}
