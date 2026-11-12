import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Archive,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus } from '../../types';

export const ProjectsModule: React.FC = () => {
  const { projects, addProject, updateProject, archiveProject, formatCurrency, setSelectedProjectId } = useSiteFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    code: `PRJ-NRB-10${projects.length + 1}`,
    name: '',
    client: '',
    location: '',
    county: 'Nairobi County',
    category: 'Commercial' as ProjectCategory,
    description: '',
    startDate: new Date().toISOString().substring(0, 10),
    targetCompletionDate: '2027-06-30',
    budgetKES: 250000000,
    projectManager: 'Eng. Brian Ochieng',
    leadEngineer: 'David Kimani, PE',
    riskLevel: 'Low' as const
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client) return;

    addProject({
      ...newProject,
      status: 'Active',
      progress: 0,
      spentKES: 0,
      delayDays: 0,
      phases: [
        { id: `PH-NEW-1`, name: 'Site Preparation & Earthworks', startDate: newProject.startDate, endDate: '2026-06-30', progress: 0, status: 'In Progress', budgetAllocatedKES: Math.round(newProject.budgetKES * 0.15) },
        { id: `PH-NEW-2`, name: 'Substructure & Foundation Works', startDate: '2026-07-01', endDate: '2026-11-30', progress: 0, status: 'Pending', budgetAllocatedKES: Math.round(newProject.budgetKES * 0.35) },
        { id: `PH-NEW-3`, name: 'Superstructure Framing', startDate: '2026-12-01', endDate: '2027-04-30', progress: 0, status: 'Pending', budgetAllocatedKES: Math.round(newProject.budgetKES * 0.35) },
        { id: `PH-NEW-4`, name: 'MEP Services & Finishes', startDate: '2027-05-01', endDate: newProject.targetCompletionDate, progress: 0, status: 'Pending', budgetAllocatedKES: Math.round(newProject.budgetKES * 0.15) }
      ],
      milestones: [
        { id: `M-NEW-1`, title: 'Foundation Excavation & Blinding Sign-off', dueDate: '2026-08-15', completed: false, phaseId: 'PH-NEW-1' },
        { id: `M-NEW-2`, title: 'Final Handover & Practical Completion', dueDate: newProject.targetCompletionDate, completed: false, phaseId: 'PH-NEW-4' }
      ]
    });

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Construction Project Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Lifecycle monitoring, milestone tracking, phases, and schedule performance across Kenya sites.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name, code, client, or county..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Residential">Residential</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Institutional">Institutional</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Delayed">Delayed</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Projects Cards List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No projects found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new project.</p>
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const isExpanded = expandedProjectId === proj.id;
            const burnPct = Math.round((proj.spentKES / proj.budgetKES) * 100);

            return (
              <div 
                key={proj.id}
                className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
              >
                {/* Project Header Row */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {proj.code}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{proj.category}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {proj.location}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {proj.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>

                  {/* Status, Dates & Expand Action */}
                  <div className="flex flex-wrap items-center gap-4 lg:self-center shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(proj.budgetKES)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Spent: <span className="tabular-nums font-mono">{formatCurrency(proj.spentKES)}</span> ({burnPct}%)
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        proj.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                        proj.status === 'Delayed' ? 'bg-red-500/10 text-red-500' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {proj.status}
                      </span>

                      {proj.delayDays > 0 && (
                        <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          +{proj.delayDays}d
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand project phases'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Overall Progress Ribbon */}
                <div className="px-5 pb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Overall Physical Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Details: Phases, Milestones & Personnel */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 space-y-6">
                    {/* Personnel & Key Dates Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Client / Employer</span>
                        <strong className="text-slate-800 dark:text-slate-200">{proj.client}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Project Manager</span>
                        <strong className="text-slate-800 dark:text-slate-200">{proj.projectManager}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Lead Site Engineer</span>
                        <strong className="text-slate-800 dark:text-slate-200">{proj.leadEngineer}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Schedule Baseline</span>
                        <strong className="text-slate-800 dark:text-slate-200">{proj.startDate} → {proj.targetCompletionDate}</strong>
                      </div>
                    </div>

                    {/* Construction Phases Breakdown */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-500" />
                        <span>Construction Phases & Stage Budgets</span>
                      </h4>

                      <div className="space-y-2">
                        {proj.phases.map((phase) => (
                          <div 
                            key={phase.id}
                            className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {phase.name}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  phase.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                  phase.status === 'In Progress' ? 'bg-sky-500/10 text-sky-500' :
                                  phase.status === 'Delayed' ? 'bg-red-500/10 text-red-500' :
                                  'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                }`}>
                                  {phase.status}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {phase.startDate} to {phase.endDate} · Allocated: {formatCurrency(phase.budgetAllocatedKES)}
                              </div>
                            </div>

                            <div className="w-full sm:w-48 shrink-0 flex items-center gap-3">
                              <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                <div 
                                  className="h-full bg-amber-500 rounded-full"
                                  style={{ width: `${phase.progress}%` }}
                                />
                              </div>
                              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 font-bold shrink-0">
                                {phase.progress}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Milestones Checklist */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                        Key Contractual Milestones
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {proj.milestones.map((m) => (
                          <div 
                            key={m.id}
                            className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {m.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <span className={m.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}>
                                {m.title}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                              Due: {m.dueDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProjectId(proj.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        >
                          Filter System by This Project
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => archiveProject(proj.id)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archive Project</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create New Project */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Initialize New Construction Project
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.code}
                    onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value as ProjectCategory })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Residential">Residential</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Westlands Central Office Tower"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Client / Developer
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prime Urban Properties"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allocated Budget (KES)
                  </label>
                  <input
                    type="number"
                    required
                    step="1000000"
                    value={newProject.budgetKES}
                    onChange={(e) => setNewProject({ ...newProject, budgetKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chiromo Rd, Westlands"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    County
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.county}
                    onChange={(e) => setNewProject({ ...newProject, county: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Handover Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newProject.targetCompletionDate}
                    onChange={(e) => setNewProject({ ...newProject, targetCompletionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scope Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Details of structure, floors, technology, finishes..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
