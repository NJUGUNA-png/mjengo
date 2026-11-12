import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  Award, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileCheck, 
  FileWarning, 
  Search, 
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { QualityInspection, NonConformanceReport } from '../../types';

export const QualityModule: React.FC = () => {
  const { 
    qualityInspections, 
    addQualityInspection, 
    ncrs, 
    addNCR, 
    updateNCRStatus, 
    projects, 
    selectedProjectId,
    currentUser
  } = useSiteFlow();

  const [activeTab, setActiveTab] = useState<'inspections' | 'ncrs'>('inspections');
  const [searchTerm, setSearchTerm] = useState('');

  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showNCRModal, setShowNCRModal] = useState(false);

  // New Inspection State
  const [newInspection, setNewInspection] = useState({
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    elementChecked: 'Level 8 Beam B-12 Shuttering & Rebar Cover Check',
    inspectionDate: new Date().toISOString().substring(0, 10),
    result: 'Passed' as QualityInspection['result'],
    defectsNoted: 'All 25mm concrete cover blocks placed correctly. Approved for concrete pour.',
    reInspectionRequired: false
  });

  // New NCR State
  const [newNCR, setNewNCR] = useState({
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    dateRaised: new Date().toISOString().substring(0, 10),
    clauseOrSpec: 'BS 8110 - Clause 3.4 Concrete Honeycombing and Compaction',
    defectDescription: 'Minor aggregate segregation noted on north-west column base.',
    severity: 'Minor' as const,
    disposition: 'Rework' as const,
    correctiveActionDeadline: '2026-11-20',
    responsibleParty: 'SolidWorks Formwork Specialists'
  });

  const filteredInspections = qualityInspections.filter(i => {
    const matchesProj = selectedProjectId === 'ALL' || i.projectId === selectedProjectId;
    const matchesSearch = i.elementChecked.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.inspectionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.inspectorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProj && matchesSearch;
  });

  const filteredNCRs = ncrs.filter(n => {
    const matchesProj = selectedProjectId === 'ALL' || n.projectId === selectedProjectId;
    const matchesSearch = n.ncrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.defectDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.responsibleParty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProj && matchesSearch;
  });

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspection.elementChecked) return;

    addQualityInspection({
      ...newInspection,
      inspectorName: `${currentUser.name} (${currentUser.role})`,
      signOffEngineer: currentUser.name,
      defectsNoted: [newInspection.defectsNoted]
    });

    setShowInspectionModal(false);
  };

  const handleNCRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNCR.defectDescription) return;

    addNCR({
      ...newNCR,
      status: 'Open'
    });

    setShowNCRModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Quality Assurance & Quality Control (QA/QC)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Structural sign-offs, slump & cube testing audits, and Non-Conformance Reports (NCR).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowNCRModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
          >
            <FileWarning className="w-3.5 h-3.5" />
            <span>Raise NCR</span>
          </button>
          <button
            onClick={() => setShowInspectionModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record QA Inspection</span>
          </button>
        </div>
      </div>

      {/* 3 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Audits Logged
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {qualityInspections.length} Inspections
          </div>
          <div className="text-xs text-slate-400 mt-2">
            First-time pass rate: <strong className="text-emerald-500">92.4%</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Non-Conformance Reports</span>
            <span className="text-amber-500 font-bold tabular-nums">
              {ncrs.filter(n => n.status !== 'Verified & Closed').length} Active
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {ncrs.length} Recorded
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Rectification SLA: <strong className="text-slate-700 dark:text-slate-200">5 business days max</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Structural Concrete Testing
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500 tabular-nums">
            41.5 MPa Avg
          </div>
          <div className="text-xs text-slate-400 mt-2">
            All 28-day cube batches exceed Class C35/45 spec
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('inspections')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'inspections'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Quality Inspections Register ({filteredInspections.length})
        </button>
        <button
          onClick={() => setActiveTab('ncrs')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'ncrs'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Non-Conformance Reports (NCR) ({filteredNCRs.length})
        </button>
      </div>

      {/* Tab 1: Inspections */}
      {activeTab === 'inspections' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {filteredInspections.map((insp) => (
              <div 
                key={insp.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                        {insp.inspectionCode}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400 font-mono">{insp.inspectionDate}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {insp.elementChecked}
                    </h3>
                  </div>

                  <span className={`text-xs font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                    insp.result === 'Passed' ? 'bg-emerald-500/10 text-emerald-500' :
                    insp.result.includes('Conditional') ? 'bg-amber-500/10 text-amber-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {insp.result}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                    Defects & Verification Observations
                  </span>
                  <ul className="space-y-1">
                    {insp.defectsNoted.map((d, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Inspector: <strong>{insp.inspectorName}</strong></span>
                  <span className="text-emerald-500 font-semibold">Sign-off: {insp.signOffEngineer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Non-Conformance Reports (NCR) */}
      {activeTab === 'ncrs' && (
        <div className="space-y-4">
          {filteredNCRs.map((ncr) => (
            <div 
              key={ncr.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-500 text-xs">{ncr.ncrNumber}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{ncr.clauseOrSpec}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {ncr.defectDescription}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-500">
                    {ncr.severity}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    ncr.status === 'Verified & Closed' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {ncr.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Responsible Subcontractor</span>
                  <strong className="text-slate-900 dark:text-white">{ncr.responsibleParty}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Approved Disposition</span>
                  <strong className="text-slate-900 dark:text-white">{ncr.disposition}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rectification Deadline</span>
                  <strong className="text-amber-500 font-mono">{ncr.correctiveActionDeadline}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                {ncr.status !== 'Verified & Closed' && (
                  <button
                    onClick={() => updateNCRStatus(ncr.id, 'Verified & Closed')}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                  >
                    Verify & Close NCR
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Record QA Inspection */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Record Structural QA Inspection
              </h3>
              <button 
                onClick={() => setShowInspectionModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInspectionSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Structural Element Checked
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Floor 8 Slab Rebar Grid & Conduit Sleeve Clearance"
                  value={newInspection.elementChecked}
                  onChange={(e) => setNewInspection({ ...newInspection, elementChecked: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Inspection Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newInspection.inspectionDate}
                    onChange={(e) => setNewInspection({ ...newInspection, inspectionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Audit Result
                  </label>
                  <select
                    value={newInspection.result}
                    onChange={(e) => setNewInspection({ ...newInspection, result: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Conditional Pass (Rectify before pour)">Conditional Pass (Rectify before pour)</option>
                    <option value="Failed / Non-Conformance">Failed / Non-Conformance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Findings & Punch List Items
                </label>
                <textarea
                  rows={3}
                  required
                  value={newInspection.defectsNoted}
                  onChange={(e) => setNewInspection({ ...newInspection, defectsNoted: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Sign Off Quality Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Raise NCR */}
      {showNCRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-red-500">
                Raise Non-Conformance Report (NCR)
              </h3>
              <button 
                onClick={() => setShowNCRModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNCRSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Governing Specification / Standard Clause
                </label>
                <input
                  type="text"
                  required
                  value={newNCR.clauseOrSpec}
                  onChange={(e) => setNewNCR({ ...newNCR, clauseOrSpec: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Responsible Subcontractor / Trade
                </label>
                <input
                  type="text"
                  required
                  value={newNCR.responsibleParty}
                  onChange={(e) => setNewNCR({ ...newNCR, responsibleParty: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Defect Description & Deficiency
                </label>
                <textarea
                  rows={2}
                  required
                  value={newNCR.defectDescription}
                  onChange={(e) => setNewNCR({ ...newNCR, defectDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Disposition
                  </label>
                  <select
                    value={newNCR.disposition}
                    onChange={(e) => setNewNCR({ ...newNCR, disposition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Rework">Rework</option>
                    <option value="Reject & Demolish">Reject & Demolish</option>
                    <option value="Accept As Is with Engineer Concurrence">Accept As Is</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rectification Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={newNCR.correctiveActionDeadline}
                    onChange={(e) => setNewNCR({ ...newNCR, correctiveActionDeadline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNCRModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors"
                >
                  Issue Formal NCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
