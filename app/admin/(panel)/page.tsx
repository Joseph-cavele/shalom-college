import Link from "next/link";
import { Inbox, FilePlus2, BookOpen, GraduationCap } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";
import { Course } from "@/lib/models/Course";
import { StatCard } from "@/components/admin/StatCard";
import { LineChart } from "@/components/admin/charts/LineChart";
import { DonutChart } from "@/components/admin/charts/DonutChart";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Application as ApplicationT, ApplicationStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  await connectDB();
  const [appsRaw, courseCount] = await Promise.all([
    Application.find().sort({ createdAt: -1 }).lean(),
    Course.countDocuments({ active: true }),
  ]);
  const apps = JSON.parse(JSON.stringify(appsRaw)) as ApplicationT[];

  const byStatus = {
    Pending: apps.filter((a) => a.status === "Pending").length,
    Contacted: apps.filter((a) => a.status === "Contacted").length,
    Registered: apps.filter((a) => a.status === "Registered").length,
  };

  const now = new Date();
  const monthly = new Array(12).fill(0);
  let newThisMonth = 0;
  for (const a of apps) {
    const d = new Date(a.createdAt);
    if (isNaN(d.getTime())) continue;
    monthly[d.getMonth()]++;
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) newThisMonth++;
  }

  return { apps, courseCount, byStatus, monthly, newThisMonth };
}

export default async function DashboardPage() {
  const { apps, courseCount, byStatus, monthly, newThisMonth } = await getDashboardData();
  const recent = apps.slice(0, 5);

  const donut = [
    { label: "Pending", value: byStatus.Pending, color: "#f59e0b" },
    { label: "Contacted", value: byStatus.Contacted, color: "#3b82f6" },
    { label: "Registered", value: byStatus.Registered, color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard tone="blue" icon={Inbox} value={apps.length} label="Total Applications" />
        <StatCard tone="green" icon={FilePlus2} value={newThisMonth} label="New This Month" />
        <StatCard tone="purple" icon={BookOpen} value={courseCount} label="Active Courses" />
        <StatCard tone="orange" icon={GraduationCap} value={byStatus.Registered} label="Registered Students" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="card p-5">
          <h3 className="mb-3 font-bold text-navy">Applications Overview</h3>
          <LineChart monthly={monthly} />
        </div>
        <div className="card p-5">
          <h3 className="mb-4 font-bold text-navy">Applications by Status</h3>
          <DonutChart data={donut} />
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-navy">Recent Applications</h3>
          <Link href="/admin/applications" className="text-sm font-bold text-brand-green hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-2 py-3">#</th>
                <th className="px-2 py-3">Full Name</th>
                <th className="px-2 py-3">Course</th>
                <th className="px-2 py-3">Phone</th>
                <th className="px-2 py-3">Date</th>
                <th className="px-2 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a, i) => (
                <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-2 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-2 py-3 font-semibold text-navy">{a.fullName}</td>
                  <td className="px-2 py-3 text-slate-600">{a.course}</td>
                  <td className="px-2 py-3 text-slate-600">{a.phone}</td>
                  <td className="px-2 py-3 text-slate-500">{formatDate(a.createdAt)}</td>
                  <td className="px-2 py-3">
                    <StatusBadge status={a.status as ApplicationStatus} />
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
