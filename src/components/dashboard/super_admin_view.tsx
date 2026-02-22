"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Stethoscope,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";

// Mock data — will be replaced with API data when backend endpoints are ready
const revenueData = [
  { name: "Jan", revenue: 42000 },
  { name: "Feb", revenue: 38000 },
  { name: "Mar", revenue: 51000 },
  { name: "Apr", revenue: 47000 },
  { name: "May", revenue: 53000 },
  { name: "Jun", revenue: 58000 },
];

const registrationsData = [
  { name: "Week 1", users: 85 },
  { name: "Week 2", users: 110 },
  { name: "Week 3", users: 125 },
  { name: "Week 4", users: 132 },
];

const supportTickets = [
  {
    id: "#78923",
    subject: "Billing issue with subscription",
    clinic: "Bright Smiles Dental",
    status: "Open",
    statusColor: "text-red-400 bg-red-400/10 border-red-500/20",
    date: "2026-02-20",
  },
  {
    id: "#78922",
    subject: "Cannot add new patient record",
    clinic: "Downtown Dentistry",
    status: "In Progress",
    statusColor: "text-yellow-400 bg-yellow-400/10 border-yellow-500/20",
    date: "2026-02-19",
  },
  {
    id: "#78921",
    subject: "Login problem for assistant account",
    clinic: "City Center Dental Care",
    status: "Closed",
    statusColor: "text-slate-400 bg-slate-400/10 border-slate-500/20",
    date: "2026-02-18",
  },
];

const pendingApprovals = [
  {
    name: "Sunrise Dental Clinic",
    plan: "Advanced Plan",
    amount: 299,
    cycle: "mo",
    date: "2026-02-21",
  },
  {
    name: "Pearl White Dentistry",
    plan: "Starter Plan",
    amount: 99,
    cycle: "mo",
    date: "2026-02-20",
  },
  {
    name: "SmileFirst Clinic",
    plan: "Advanced Plan",
    amount: 299,
    cycle: "mo",
    date: "2026-02-19",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const SuperAdminView = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading — replace with real fetch calls
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-400 font-bold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white">
          Super Admin Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Platform overview and management
        </p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total Clinics",
            value: "152",
            change: "+5%",
            up: true,
            icon: Building2,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
          },
          {
            label: "Active Doctors",
            value: "480",
            change: "+2.1%",
            up: true,
            icon: Stethoscope,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
          },
          {
            label: "Active Assistants",
            value: "620",
            change: "+3.5%",
            up: true,
            icon: Users,
            color: "text-violet-500",
            bgColor: "bg-violet-500/10",
          },
          {
            label: "Total Patients",
            value: "12,540",
            change: "+8.2%",
            up: true,
            icon: Activity,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
          },
          {
            label: "Monthly Revenue",
            value: currencyFormatter.format(85230),
            change: "+12.3%",
            up: true,
            icon: DollarSign,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={stat.color} size={20} />
              </div>
              <span
                className={`text-xs font-bold flex items-center gap-1 ${stat.up ? "text-green-500" : "text-red-500"}`}
              >
                {stat.up ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-white mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart — large */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 lg:p-8 rounded-[2rem]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Revenue</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white">
                  {currencyFormatter.format(523890)}
                </span>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  <TrendingUp size={12} /> +12.3%
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1">Last 6 months</p>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k EGP`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  }}
                  labelStyle={{ color: "#94a3b8", fontWeight: 700 }}
                  itemStyle={{ color: "#ea580c", fontWeight: 700 }}
                  formatter={(value) => [
                    currencyFormatter.format(Number(value)),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ea580c"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{
                    r: 5,
                    fill: "#ea580c",
                    stroke: "#0f172a",
                    strokeWidth: 3,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#ea580c",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New User Registrations — small */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 lg:p-8 rounded-[2rem]">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">
              New User Registrations
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">452</span>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                <TrendingUp size={12} /> +7.8%
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">Last 30 days</p>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  }}
                  labelStyle={{ color: "#94a3b8", fontWeight: 700 }}
                  itemStyle={{ color: "#3b82f6", fontWeight: 700 }}
                />
                <Bar
                  dataKey="users"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Pending Approvals + Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Clinic Approvals */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 lg:p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">
              Pending Clinic Approvals
            </h3>
            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
              {pendingApprovals.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((clinic, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800/50 gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center text-orange-500 font-bold shrink-0">
                    {clinic.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">
                      {clinic.name}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {clinic.plan} • {currencyFormatter.format(clinic.amount)}/{clinic.cycle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <button className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1">
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button className="bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Support Tickets */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 lg:p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">
              Recent Support Tickets
            </h3>
            <button className="text-xs font-bold text-orange-500 hover:text-orange-400 cursor-pointer flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">
                    Ticket ID
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">
                    Subject
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">
                    Clinic
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {supportTickets.map((ticket, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-4 text-sm font-bold text-slate-400">
                      {ticket.id}
                    </td>
                    <td className="py-4 text-sm text-white font-medium">
                      {ticket.subject}
                    </td>
                    <td className="py-4 text-sm text-slate-400">
                      {ticket.clinic}
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${ticket.statusColor}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-500">
                      {dateFormatter.format(new Date(ticket.date))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminView;
