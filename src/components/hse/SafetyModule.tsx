import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  ShieldAlert, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Users2, 
  FileText, 
  Activity,
  HardHat,
  Search
} from 'lucide-react';
import { SafetyIncident, IncidentSeverity, SafetyToolboxTalk } from '../../types';

export const SafetyModule: React.FC = () => {
  const { 
    safetyIncidents, 
    addSafetyIncident, 
    updateSafetyIncidentStatus, 
    toolboxTalks, 
    addToolboxTalk, 
    projects, 
    selectedProjectId,
    currentUser
  } = useSiteFlow();

  const [activeTab, setActiveTab] = useState<'incidents' | 'talks' | 'ppe'>('incidents');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showTalkModal, setShowTalkModal] = useState(false);

  // Incident Form State
  const [newIncident, setNewIncident] = useState({
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    date: new Date().toISOString().substring(0, 10),
    time: '10:30 AM',
    severity: 'Near Miss' as IncidentSeverity,
    locationOnSite: '',
    description: '',
    injuredPerson: '',
    rootCause: '',
    immediateActionTaken: '',
    correctiveActionPlan: '',
    daysLost: 0
  });

  // Toolbox Talk Form State
  const [newTalk, setNewTalk] = useState({
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    date: new Date().toISOString().substring(0, 10),
    topic: 'Safe Working at Heights & Fall Arrest Systems',
    attendeesCount: 45,
    keyHazardsDiscussed: 'Full-body safety harness pre-inspection, 100% tie-off mandate, drop-zone exclusion barricades'
  });

  const filteredIncidents = safetyIncidents.filter(inc => {
    const matchesProj = selectedProjectId === 'ALL' || inc.projectId === selectedProjectId;
    const matchesSearch = inc.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.locationOnSite.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    return matchesProj && matchesSearch && matchesSeverity;
  });

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.description || !newIncident.locationOnSite) return;
    const proj = projects.find(p => p.id === newIncident.projectId);

    addSafetyIncident({
      ...newIncident,
      projectName: proj?.name || 'Site Project',
      investigator: `${currentUser.name} (${currentUser.role})`,
      status: 'Under Investigation'
    });

    setShowIncidentModal(false);
  };

  const handleTalkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTalk.topic) return;

    addToolboxTalk({
      ...newTalk,
      conductedBy: currentUser.name,
      keyHazardsDiscussed: newTalk.keyHazardsDiscussed.split(',').map(s => s.trim())
    });

    setShowTalkModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Health, Safety & Environmental (HSE) Compliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Zero-harm safety governance, Near Miss / LTI reporting, OSHA audits, and daily safety briefings.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowTalkModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Users2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Record Toolbox Talk</span>
          </button>
          <button
            onClick={() => setShowIncidentModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Report Safety Incident</span>
          </button>
        </div>
      </div>

      {/* 3 Core HSE Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Days Without Lost Time Injury (LTI)
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500 tabular-nums">
            182 Days
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Target benchmark: 365 Days zero-harm consecutive operation
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Safe Man-Hours Worked</span>
            <span className="text-emerald-500 font-bold tabular-nums">0.00 LTIFR</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            148,200 hrs
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Lost Time Injury Frequency Rate benchmark compliant
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Open Incidents / Inquiries
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${safetyIncidents.some(i => i.status !== 'Closed & Signed Off') ? 'text-amber-500' : 'text-emerald-500'}`}>
            {safetyIncidents.filter(i => i.status !== 'Closed & Signed Off').length} Open
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Corrective & Preventive Actions (CAPA) under active review
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'incidents'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Incident Register ({filteredIncidents.length})
        </button>
        <button
          onClick={() => setActiveTab('talks')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'talks'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Toolbox Safety Briefings ({toolboxTalks.length})
        </button>
        <button
          onClick={() => setActiveTab('ppe')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'ppe'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          PPE Compliance Matrix
        </button>
      </div>

      {/* Tab 1: Incident Register */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search incident ID, description, or site location..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Severities</option>
                <option value="Near Miss">Near Miss</option>
                <option value="Minor / First Aid">Minor / First Aid</option>
                <option value="Lost Time Injury (LTI)">Lost Time Injury (LTI)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredIncidents.map((inc) => (
              <div 
                key={inc.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-500 text-xs">{inc.incidentNumber}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{inc.projectName}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{inc.locationOnSite}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {inc.date} at {inc.time}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      inc.severity === 'Near Miss' ? 'bg-amber-500/10 text-amber-500' :
                      inc.severity === 'Minor / First Aid' ? 'bg-sky-500/10 text-sky-500' :
                      'bg-red-500/10 text-red-500 font-extrabold'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      inc.status === 'Closed & Signed Off' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Description:</strong> {inc.description}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Root Cause Analysis</span>
                    <p className="text-slate-700 dark:text-slate-300">{inc.rootCause}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Corrective Action Plan (CAPA)</span>
                    <p className="text-slate-700 dark:text-slate-300">{inc.correctiveActionPlan}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Investigator: <strong>{inc.investigator}</strong></span>
                  {inc.status !== 'Closed & Signed Off' && (
                    <button
                      onClick={() => updateSafetyIncidentStatus(inc.id, 'Closed & Signed Off')}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                    >
                      Sign Off & Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Toolbox Briefings */}
      {activeTab === 'talks' && (
        <div className="space-y-4">
          {toolboxTalks.map((talk) => (
            <div 
              key={talk.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400">{talk.date}</span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {talk.topic}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Conducted by: {talk.conductedBy}
                  </div>
                </div>

                <div className="bg-sky-500/10 text-sky-500 px-2.5 py-1 rounded text-xs font-bold font-mono">
                  {talk.attendeesCount} Operatives Attended
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                  Key Hazard Controls Discussed
                </span>
                <ul className="space-y-1">
                  {talk.keyHazardsDiscussed.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: PPE Compliance Checklist */}
      {activeTab === 'ppe' && (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Mandatory Site Personal Protective Equipment (PPE) Compliance Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { ppe: 'Class E Hard Hats (EN 397 Certified)', area: '100% Mandatory across entire site boundaries', status: 'Compliant' },
              { ppe: 'Steel-Toe Safety Boots with Puncture Plate (S3)', area: 'All operatives, supervisors and visitors', status: 'Compliant' },
              { ppe: 'High-Visibility Reflective Vests (Class 2)', area: 'Mandatory day & night shifts', status: 'Compliant' },
              { ppe: 'Full-Body Dual-Lanyard Safety Harness', area: 'Working at height above 2.0 metres', status: 'Compliant' },
              { ppe: 'Safety Goggles / Face Shield', area: 'Rebar cutting, grinding, and concrete chipping', status: 'Compliant' },
              { ppe: 'Heavy Duty Cut-Resistant Kevlar Sleeves & Gloves', area: 'Steel rebar bending and fixing yards', status: 'Compliant' }
            ].map((p, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{p.ppe}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{p.area}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Safety Incident */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-red-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Formal Safety Incident Notification</span>
              </h3>
              <button 
                onClick={() => setShowIncidentModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIncidentSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project
                  </label>
                  <select
                    value={newIncident.projectId}
                    onChange={(e) => setNewIncident({ ...newIncident, projectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Incident Severity
                  </label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Near Miss">Near Miss</option>
                    <option value="Minor / First Aid">Minor / First Aid</option>
                    <option value="Medical Treatment">Medical Treatment</option>
                    <option value="Lost Time Injury (LTI)">Lost Time Injury (LTI)</option>
                    <option value="Equipment Damage">Equipment Damage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Incident
                  </label>
                  <input
                    type="date"
                    required
                    value={newIncident.date}
                    onChange={(e) => setNewIncident({ ...newIncident, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Specific Site Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Level 8 Tower Crane radius"
                    value={newIncident.locationOnSite}
                    onChange={(e) => setNewIncident({ ...newIncident, locationOnSite: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Incident Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail factual chain of events..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Root Cause
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken hoist strap"
                    value={newIncident.rootCause}
                    onChange={(e) => setNewIncident({ ...newIncident, rootCause: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Immediate Action Taken
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Work stopped & cordoned"
                    value={newIncident.immediateActionTaken}
                    onChange={(e) => setNewIncident({ ...newIncident, immediateActionTaken: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Corrective Action Plan (CAPA)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Long-term controls to eliminate recurrence..."
                  value={newIncident.correctiveActionPlan}
                  onChange={(e) => setNewIncident({ ...newIncident, correctiveActionPlan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors"
                >
                  Submit Incident File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Toolbox Talk */}
      {showTalkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Record Safety Toolbox Talk (TBT)
              </h3>
              <button 
                onClick={() => setShowTalkModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTalkSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Hazard Subject
                </label>
                <input
                  type="text"
                  required
                  value={newTalk.topic}
                  onChange={(e) => setNewTalk({ ...newTalk, topic: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date Conducted
                  </label>
                  <input
                    type="date"
                    required
                    value={newTalk.date}
                    onChange={(e) => setNewTalk({ ...newTalk, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Attendees Count
                  </label>
                  <input
                    type="number"
                    required
                    value={newTalk.attendeesCount}
                    onChange={(e) => setNewTalk({ ...newTalk, attendeesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Discussion Points (comma-separated)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newTalk.keyHazardsDiscussed}
                  onChange={(e) => setNewTalk({ ...newTalk, keyHazardsDiscussed: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTalkModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  File Toolbox Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
