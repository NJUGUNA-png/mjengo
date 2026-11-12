import React from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  Building2, 
  TrendingUp, 
  Users2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  ArrowUpRight, 
  Calendar, 
  CheckCircle2, 
  AlertOctagon,
  FileSpreadsheet,
  Boxes,
  Plus
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const { 
    projects, 
    formatCurrency, 
    setActiveTab, 
    setSelectedProjectId,
    selectedProjectId,
    workers, 
    materials, 
    tasks, 
    dailyReports, 
    safetyIncidents,
    expenses
  } = useSiteFlow();

  // Scope: Filter by selected project or aggregate
  const filteredProjects = selectedProjectId === 'ALL' 
    ? projects 
    : projects.filter(p => p.id === selectedProjectId);

  const activeProjectsCount = filteredProjects.filter(p => p.status === 'Active').length;
  const delayedProjects = filteredProjects.filter(p => p.status === 'Delayed' || p.delayDays > 0);
  
  const totalBudget = filteredProjects.reduce((acc, p) => acc + p.budgetKES, 0);
  const totalSpent = filteredProjects.reduce((acc, p) => acc + p.spentKES, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const lowStockItems = materials.filter(m => m.currentStock <= m.minThreshold);
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const criticalTasks = tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed');
  const recentReport = dailyReports[0];

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Construction Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time project delivery, financial telemetry in KES, workforce metrics, and site compliance.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('tasks')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Site Diary</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Boxes className="w-3.5 h-3.5 text-slate-400" />
            <span>Issue Materials</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>AI Risk & BOQ</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delayed Project Alert Banner (if any) */}
      {delayedProjects.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Schedule Variance Alert: {delayedProjects.length} Project(s) Experiencing Delay
            </h4>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
              {delayedProjects.map(p => (
                <span key={p.id} className="flex items-center gap-1">
                  <strong>{p.name}</strong>: +{p.delayDays} days behind baseline target
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
          >
            Run AI Delay Analysis →
          </button>
        </div>
      )}

      {/* 4 Primary Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Budget & Expenditure */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Allocated Budget</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatCurrency(totalBudget)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Spent: <strong className="tabular-nums text-slate-700 dark:text-slate-200">{formatCurrency(totalSpent)}</strong></span>
            <span className={`tabular-nums font-semibold ${budgetUtilization > 85 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {budgetUtilization}% utilized
            </span>
          </div>
        </div>

        {/* Metric 2: Active Projects & Completion */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Site Projects</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {activeProjectsCount} <span className="text-xs font-normal text-slate-400">of {filteredProjects.length} total</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>On schedule: <strong className="text-emerald-500">{filteredProjects.filter(p => p.delayDays === 0).length}</strong></span>
            <span>Delayed: <strong className="text-amber-500">{delayedProjects.length}</strong></span>
          </div>
        </div>

        {/* Metric 3: Active Site Workforce */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Site Operatives & Labour</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {workers.filter(w => w.activeStatus === 'Active').length * 12}{' '}
            <span className="text-xs font-normal text-slate-400">deployed on sites</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Direct artisans: <strong className="text-slate-700 dark:text-slate-200">{workers.length}</strong></span>
            <span>Muster status: <strong className="text-emerald-500">Normal</strong></span>
          </div>
        </div>

        {/* Metric 4: Health & Safety (HSE) */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Safety & Zero LTI</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-500 tabular-nums tracking-tight">
            182 Days <span className="text-xs font-normal text-slate-400">without LTI</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Open incidents: <strong className="text-slate-700 dark:text-slate-200">{safetyIncidents.filter(i => i.status !== 'Closed & Signed Off').length}</strong></span>
            <span>PPE audit: <strong className="text-emerald-500">98% Compliant</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Delivery Pipeline + Site Operations Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Active Projects Detail & Progress Trackers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Active Projects Execution Status
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Physical completion, milestone progress, and budget burn rate
                </p>
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                View All Projects →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {filteredProjects.map((proj) => {
                const burnRate = Math.round((proj.spentKES / proj.budgetKES) * 100);
                return (
                  <div key={proj.id} className="py-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                            {proj.code}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{proj.category}</span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{proj.county}</span>
                        </div>
                        <h4 
                          onClick={() => {
                            setSelectedProjectId(proj.id);
                            setActiveTab('projects');
                          }}
                          className="text-sm font-bold text-slate-900 dark:text-white hover:text-amber-500 cursor-pointer mt-0.5"
                        >
                          {proj.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        {proj.delayDays > 0 ? (
                          <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            +{proj.delayDays}d Delay
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            On Target
                          </span>
                        )}

                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {proj.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Financial Metric Split */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          Physical Progress: <strong className="text-slate-900 dark:text-white tabular-nums">{proj.progress}%</strong>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          Budget Burn: <strong className="text-slate-900 dark:text-white tabular-nums">{burnRate}%</strong> ({formatCurrency(proj.spentKES)} of {formatCurrency(proj.budgetKES)})
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Active Phase Badge & PM */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div>
                        Current Phase:{' '}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {proj.phases.find(p => p.status === 'In Progress')?.name || 'Project Commissioning'}
                        </strong>
                      </div>
                      <div>
                        PM: <span className="text-slate-700 dark:text-slate-300 font-medium">{proj.projectManager}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Path Tasks Requiring Immediate Action */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Critical Path Site Operations ({pendingTasks.length} Pending)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Go to Task Board →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {pendingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        task.priority === 'Critical' ? 'bg-red-500/10 text-red-500' :
                        task.priority === 'High' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-400 truncate">{task.projectName}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Assigned to: {task.assignedTo} · Due {task.dueDate}
                    </div>
                    {task.blockerReason && (
                      <div className="text-[11px] text-red-500 font-medium mt-1">
                        Blocker: {task.blockerReason}
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                      {task.progressPercent}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {task.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Daily Site Diary Excerpt & Low Stock Alerts */}
        <div className="space-y-6">
          {/* Daily Site Diary Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Resident Engineer Site Log
              </h3>
              <span className="text-xs font-medium text-slate-400 font-mono">
                {recentReport?.date || 'Today'}
              </span>
            </div>

            {recentReport ? (
              <div className="mt-3 space-y-3">
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {recentReport.projectName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Weather: {recentReport.weather} · Active Workers: {recentReport.activeWorkersCount}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Work Accomplished Today
                  </strong>
                  {recentReport.workAccomplished}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Sign-off: {recentReport.preparedBy}</span>
                  <span className="text-emerald-500 font-semibold">Verified</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">No logs for today yet.</div>
            )}
          </div>

          {/* Low Material Stock Warnings */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Material Threshold Alerts
              </h3>
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Inventory →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Location: {item.warehouseLocation}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-amber-500 tabular-nums">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Min: {item.minThreshold} {item.unit}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-emerald-500">
                  All critical materials above safety buffer threshold.
                </div>
              )}
            </div>
          </div>

          {/* Quick Expense Overview in KES */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Disbursements
              </h3>
              <button
                onClick={() => setActiveTab('financial')}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Ledger →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {expenses.slice(0, 3).map((exp) => (
                <div key={exp.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="truncate max-w-[170px]">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {exp.vendorPayee}
                    </div>
                    <div className="text-[10px] text-slate-400">{exp.category} · {exp.date}</div>
                  </div>
                  <div className="text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {formatCurrency(exp.amountKES)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
