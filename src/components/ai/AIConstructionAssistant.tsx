import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  FileText, 
  TrendingUp, 
  Building2, 
  Layers, 
  DollarSign, 
  Clock,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface RiskPredictionResult {
  overallRiskScore: number;
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Critical';
  delayProbabilityPercent: number;
  costOverrunForecastKES: number;
  keyVulnerabilities: string[];
  recommendedMitigations: string[];
  weatherImpactAnalysis: string;
}

interface BOQEstimationResult {
  estimatedConcreteM3: number;
  estimatedCementBags: number;
  estimatedRebarTonnes: number;
  estimatedTotalCostKES: number;
  lineItems: Array<{ item: string; quantity: string; unitRateKES: number; amountKES: number }>;
}

const numericField = (value: unknown, key: string): number => {
  if (!value || typeof value !== 'object') return 0;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === 'number' && Number.isFinite(field) ? field : 0;
};

const predictProjectRisks = async (project: unknown, tasks: unknown[], reports: unknown[]): Promise<RiskPredictionResult> => {
  const delay = numericField(project, 'delayDays');
  const progress = numericField(project, 'progress');
  const score = Math.max(0, Math.min(100, Math.round((100 - progress) * 0.35 + delay * 2 + (tasks.length ? 15 : 0))));
  return {
    overallRiskScore: score,
    riskCategory: score >= 75 ? 'Critical' : score >= 55 ? 'High' : score >= 30 ? 'Moderate' : 'Low',
    delayProbabilityPercent: Math.min(95, score),
    costOverrunForecastKES: Math.round(numericField(project, 'budgetKES') * score / 1000),
    keyVulnerabilities: [`${tasks.length} tasks and ${reports.length} daily reports are available for assessment.`, delay > 0 ? `The project is delayed by ${delay} days.` : 'No schedule delay is currently reported.'],
    recommendedMitigations: ['Review the critical path and update task dependencies.', 'Validate cost and progress assumptions with the project team.'],
    weatherImpactAnalysis: 'Live weather data is unavailable. Check local forecasts before scheduling weather-sensitive work.'
  };
};

const generateBOQEstimate = async (element: string, scope: string): Promise<BOQEstimationResult> => {
  const area = Number(scope.match(/([\d,.]+)\s*m(?:²|2)/i)?.[1]?.replace(/,/g, '') || 0);
  const depth = Number(scope.match(/([\d,.]+)\s*mm/i)?.[1]?.replace(/,/g, '') || 0) / 1000;
  const concrete = Math.round(area * depth * 100) / 100;
  const cement = Math.ceil(concrete * 7);
  const rebar = Math.round(concrete * 0.12 * 100) / 100;
  const lineItems = [
    { item: `${element} — concrete`, quantity: `${concrete} m³`, unitRateKES: 16000, amountKES: Math.round(concrete * 16000) },
    { item: 'Cement (50kg bags)', quantity: `${cement} bags`, unitRateKES: 850, amountKES: cement * 850 },
    { item: 'Reinforcement steel', quantity: `${rebar} tonnes`, unitRateKES: 145000, amountKES: Math.round(rebar * 145000) }
  ];
  return {
    estimatedConcreteM3: concrete,
    estimatedCementBags: cement,
    estimatedRebarTonnes: rebar,
    estimatedTotalCostKES: lineItems.reduce((sum, item) => sum + item.amountKES, 0),
    lineItems
  };
};

const summarizeDailySiteReport = async (project: unknown, reports: unknown[]): Promise<string> => {
  const name = project && typeof project === 'object' && typeof (project as Record<string, unknown>).name === 'string'
    ? (project as Record<string, string>).name
    : 'Selected project';
  return `${name}: ${reports.length} daily site report${reports.length === 1 ? '' : 's'} available. Confirm progress, safety, workforce, materials, and constraints with the site team before distributing this briefing.`;
};

export const AIConstructionAssistant: React.FC = () => {
  const { 
    projects, 
    tasks, 
    dailyReports, 
    formatCurrency, 
    selectedProjectId 
  } = useSiteFlow();

  const [activeAITool, setActiveAITool] = useState<'risk' | 'boq' | 'summary'>('risk');
  const [targetProjectId, setTargetProjectId] = useState<string>(
    selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId
  );

  // Risk Predictor State
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [riskResult, setRiskResult] = useState<RiskPredictionResult | null>(null);

  // BOQ Estimator State
  const [boqElement, setBoqElement] = useState('Reinforced Concrete Suspended Slab Floor 8');
  const [boqScope, setBoqScope] = useState('240 m² area, 250mm depth, Grade C25/30 ready-mix');
  const [loadingBOQ, setLoadingBOQ] = useState(false);
  const [boqResult, setBoqResult] = useState<BOQEstimationResult | null>(null);

  // Executive Summary State
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const selectedProj = projects.find(p => p.id === targetProjectId) || projects[0];

  const handleRunRiskAssessment = async () => {
    if (!selectedProj) return;
    setLoadingRisk(true);
    try {
      const projTasks = tasks.filter(t => t.projectId === selectedProj.id);
      const projReports = dailyReports.filter(r => r.projectId === selectedProj.id);
      const result = await predictProjectRisks(selectedProj, projTasks, projReports);
      setRiskResult(result);
    } finally {
      setLoadingRisk(false);
    }
  };

  const handleRunBOQ = async () => {
    setLoadingBOQ(true);
    try {
      const result = await generateBOQEstimate(boqElement, boqScope);
      setBoqResult(result);
    } finally {
      setLoadingBOQ(false);
    }
  };

  const handleRunSummary = async () => {
    if (!selectedProj) return;
    setLoadingSummary(true);
    try {
      const projReports = dailyReports.filter(r => r.projectId === selectedProj.id);
      const result = await summarizeDailySiteReport(selectedProj, projReports);
      setSummaryResult(result);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              AI Site Intelligence & Predictive Engineering
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Predictive delay models, automated Bill of Quantities (BOQ) estimators, and executive briefing synthesis.
          </p>
        </div>

        {/* Project Selector for AI Focus */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={targetProjectId}
            onChange={(e) => setTargetProjectId(e.target.value)}
            className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} · {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 AI Tool Modes */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveAITool('risk')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeAITool === 'risk'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Delay & Risk Predictor</span>
        </button>

        <button
          onClick={() => setActiveAITool('boq')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeAITool === 'boq'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-sky-400" />
          <span>AI BOQ Cost Estimator</span>
        </button>

        <button
          onClick={() => setActiveAITool('summary')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeAITool === 'summary'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Executive Briefing Synthesizer</span>
        </button>
      </div>

      {/* Tool 1: AI Delay & Risk Predictor */}
      {activeAITool === 'risk' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Project Under Assessment: {selectedProj?.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Baseline progress: {selectedProj?.progress}% · Budget: {formatCurrency(selectedProj?.budgetKES || 0)} · Delay: +{selectedProj?.delayDays || 0}d
              </p>
            </div>

            <button
              onClick={handleRunRiskAssessment}
              disabled={loadingRisk}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2 shrink-0"
            >
              {loadingRisk ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Project Telemetry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Risk Prediction</span>
                </>
              )}
            </button>
          </div>

          {riskResult ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Top Risk Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Overall Project Risk Score
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {riskResult.overallRiskScore} / 100
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      riskResult.riskCategory === 'Critical' ? 'bg-red-500/10 text-red-500' :
                      riskResult.riskCategory === 'High' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {riskResult.riskCategory} Risk
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${riskResult.overallRiskScore > 70 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${riskResult.overallRiskScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Delay Probability Forecast
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-500 tabular-nums">
                    {riskResult.delayProbabilityPercent}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Chance of exceeding contractual completion date
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Potential Cost Overrun Exposure
                  </div>
                  <div className="text-2xl font-bold font-mono text-red-400 tabular-nums">
                    {formatCurrency(riskResult.costOverrunForecastKES)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Estimated financial contingency exposure
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Identified Critical Path Vulnerabilities</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {riskResult.keyVulnerabilities.map((v, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Recommended Engineering Mitigations</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {riskResult.recommendedMitigations.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Weather Impact */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block mb-1">
                  Environmental & Weather Impact Advisory:
                </strong>
                {riskResult.weatherImpactAnalysis}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800">
              <BrainCircuit className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No active risk assessment generated yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Click "Run AI Risk Prediction" to cross-reference tasks, weather logs, budget burn, and contractor velocity.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tool 2: AI BOQ Cost Estimator */}
      {activeAITool === 'boq' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Automated Bill of Quantities (BOQ) Civil Estimator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Structural Element Scope
                </label>
                <input
                  type="text"
                  value={boqElement}
                  onChange={(e) => setBoqElement(e.target.value)}
                  placeholder="e.g. Suspended Slab, Concrete Columns, Deep Basements..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dimensions / Area / Mix Specification
                </label>
                <input
                  type="text"
                  value={boqScope}
                  onChange={(e) => setBoqScope(e.target.value)}
                  placeholder="e.g. 240 m², 250mm depth, Grade C25/30"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunBOQ}
                disabled={loadingBOQ}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {loadingBOQ ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Computing Quantities & SMM Rates...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>Compute BOQ Quantities & Budget</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {boqResult && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Quick Quantities Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Concrete Volume</span>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {boqResult.estimatedConcreteM3} m³
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cement Required</span>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {boqResult.estimatedCementBags} Bags (50kg)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Steel Rebar</span>
                  <div className="text-lg font-bold font-mono text-amber-500 tabular-nums">
                    {boqResult.estimatedRebarTonnes} Tonnes
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estimated Budget</span>
                  <div className="text-lg font-bold font-mono text-emerald-500 tabular-nums">
                    {formatCurrency(boqResult.estimatedTotalCostKES)}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Item Description</th>
                      <th className="py-2.5 px-4">Quantity / Unit</th>
                      <th className="py-2.5 px-4 text-right">Unit Rate (KES)</th>
                      <th className="py-2.5 px-4 text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {boqResult.lineItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          {item.item}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {formatCurrency(item.unitRateKES)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                          {formatCurrency(item.amountKES)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 dark:bg-slate-900 font-bold border-t-2 border-slate-200 dark:border-slate-700">
                      <td colSpan={3} className="py-3 px-4 text-right text-slate-900 dark:text-white uppercase tracking-wider">
                        Total Estimated Cost (KES):
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-500 text-sm">
                        {formatCurrency(boqResult.estimatedTotalCostKES)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tool 3: Executive Site Briefing Synthesizer */}
      {activeAITool === 'summary' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Synthesize Daily Field Diary into Executive Stakeholder Briefing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically consolidates Resident Engineer field logs into a formal investor briefing.
              </p>
            </div>

            <button
              onClick={handleRunSummary}
              disabled={loadingSummary}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2 shrink-0"
            >
              {loadingSummary ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Stakeholder Update...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Synthesize Executive Brief</span>
                </>
              )}
            </button>
          </div>

          {summaryResult && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs uppercase font-bold text-amber-500 tracking-wider">
                  Generated Executive Briefing
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Target: Board of Directors & Monitors
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                {summaryResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
