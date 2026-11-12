import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  CloudSun, 
  HardHat, 
  FileText,
  User,
  Filter
} from 'lucide-react';
import { SiteTask, TaskPriority, TaskStatus, DailySiteReport } from '../../types';

export const TasksModule: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    dailyReports, 
    addDailyReport, 
    projects, 
    workers, 
    selectedProjectId,
    currentUser
  } = useSiteFlow();

  const [activeTab, setActiveTab] = useState<'tasks' | 'diary'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // New Task Form State
  const [newTask, setNewTask] = useState({
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    title: '',
    description: '',
    assignedTo: 'Kennedy Oduor (Lead Steel Fixer)',
    priority: 'High' as TaskPriority,
    startDate: new Date().toISOString().substring(0, 10),
    dueDate: '2026-11-12',
    estimatedHours: 24,
    tags: 'Structural, Rebar'
  });

  // Daily Site Report Form State
  const [newReport, setNewReport] = useState({
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    date: new Date().toISOString().substring(0, 10),
    weather: 'Sunny & Clear (26°C)' as DailySiteReport['weather'],
    activeWorkersCount: 78,
    activeEquipmentCount: 6,
    workAccomplished: '',
    delaysAndIssues: 'None noted. Critical path running on schedule.',
    safetyIncidentsRecorded: 0,
    materialsDeliveredSummary: 'Received 600 bags Bamburi PowerPlus cement. Rebar inspected.'
  });

  const filteredTasks = tasks.filter(t => {
    const matchesProj = selectedProjectId === 'ALL' || t.projectId === selectedProjectId;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesProj && matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredReports = dailyReports.filter(r => 
    selectedProjectId === 'ALL' || r.projectId === selectedProjectId
  );

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const proj = projects.find(p => p.id === newTask.projectId);

    addTask({
      ...newTask,
      projectName: proj?.name || 'Site Project',
      status: 'Not Started',
      progressPercent: 0,
      actualHoursSpent: 0,
      tags: newTask.tags.split(',').map(tag => tag.trim())
    });

    setShowTaskModal(false);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.workAccomplished) return;
    const proj = projects.find(p => p.id === newReport.projectId);

    addDailyReport({
      ...newReport,
      projectName: proj?.name || 'Site Project',
      preparedBy: `${currentUser.name} (${currentUser.role})`,
      signedOffByResidentEngineer: true
    });

    setShowReportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Site Operations & Task Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Work assignment schedules, blocker tracking, critical path milestones, and Resident Engineer site diary.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Submit Daily Site Log</span>
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Site Task</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Task Operations Board ({filteredTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('diary')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'diary'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Daily Site Activity Logs ({filteredReports.length})
        </button>
      </div>

      {/* Tab 1: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks, descriptions, or assignee..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Quality Review">Quality Review</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((t) => (
              <div 
                key={t.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.priority === 'Critical' ? 'bg-red-500/10 text-red-500' :
                      t.priority === 'High' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-xs text-slate-400">{t.projectName}</span>
                  </div>

                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    t.status === 'Quality Review' ? 'bg-sky-500/10 text-sky-500' :
                    t.status === 'Blocked' ? 'bg-red-500/10 text-red-500' :
                    t.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.description}
                  </p>
                </div>

                {t.blockerReason && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500">
                    <strong>Critical Blocker:</strong> {t.blockerReason}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Task Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">{t.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${t.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.assignedTo}</span>
                  </div>
                  <span className="font-mono">Due: {t.dueDate}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {t.status !== 'Completed' && (
                    <button
                      onClick={() => updateTask(t.id, { status: 'Completed', progressPercent: 100 })}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                  {t.status === 'Not Started' && (
                    <button
                      onClick={() => updateTask(t.id, { status: 'In Progress', progressPercent: 25 })}
                      className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
                    >
                      Start Task
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Daily Site Activity Reports (Diary) */}
      {activeTab === 'diary' && (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div 
              key={report.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      {report.reportNumber}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{report.projectName}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Filed by {report.preparedBy}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CloudSun className="w-4 h-4 text-amber-500" />
                    <span>{report.weather}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HardHat className="w-4 h-4 text-sky-500" />
                    <span>{report.activeWorkersCount} Workers</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px] mb-1">
                    Work Accomplished During Shift
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    {report.workAccomplished}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-[11px] block mb-1">
                      Roadblocks & Weather Stoppages
                    </span>
                    <p className="text-slate-500 dark:text-slate-400">
                      {report.delaysAndIssues}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-[11px] block mb-1">
                      Materials & Staging Deliveries
                    </span>
                    <p className="text-slate-500 dark:text-slate-400">
                      {report.materialsDeliveredSummary}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Date: <strong className="text-slate-700 dark:text-slate-300 font-mono">{report.date}</strong></span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resident Engineer Signed Off
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Site Task */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Assign New Construction Task
              </h3>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project
                </label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shuttering & Propping of Level 9 Beams"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Operative / Trade
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specifications & Work Scope
                </label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Daily Site Activity Report */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Daily Site Activity Report (Diary)
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project
                  </label>
                  <select
                    value={newReport.projectId}
                    onChange={(e) => setNewReport({ ...newReport, projectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Report Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newReport.date}
                    onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Weather Conditions
                  </label>
                  <select
                    value={newReport.weather}
                    onChange={(e) => setNewReport({ ...newReport, weather: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Sunny & Clear (26°C)">Sunny & Clear (26°C)</option>
                    <option value="Overcast & Humid (22°C)">Overcast & Humid (22°C)</option>
                    <option value="Heavy Rainfall (Site Muddy)">Heavy Rainfall (Site Muddy)</option>
                    <option value="Windy / Dust Hazard">Windy / Dust Hazard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Active Workforce Count
                  </label>
                  <input
                    type="number"
                    required
                    value={newReport.activeWorkersCount}
                    onChange={(e) => setNewReport({ ...newReport, activeWorkersCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Accomplished Today
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail columns cast, rebar placed, square metres tiled..."
                  value={newReport.workAccomplished}
                  onChange={(e) => setNewReport({ ...newReport, workAccomplished: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delays, Equipment Breakdowns or Blockers
                </label>
                <input
                  type="text"
                  value={newReport.delaysAndIssues}
                  onChange={(e) => setNewReport({ ...newReport, delaysAndIssues: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Sign Off & File Site Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
