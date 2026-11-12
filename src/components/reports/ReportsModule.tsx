import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Boxes, 
  Users2,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { 
    projects, 
    expenses, 
    materials, 
    workers, 
    safetyIncidents, 
    formatCurrency, 
    selectedProjectId,
    currentUser
  } = useSiteFlow();

  const [reportType, setReportType] = useState<'financial' | 'projects' | 'inventory' | 'safety'>('financial');
  const [selectedPeriod, setSelectedPeriod] = useState('Current Quarter (Q4 2026)');

  const filteredProjects = selectedProjectId === 'ALL' 
    ? projects 
    : projects.filter(p => p.id === selectedProjectId);

  const filteredExpenses = expenses.filter(e => 
    selectedProjectId === 'ALL' || e.projectId === selectedProjectId
  );

  const totalBudget = filteredProjects.reduce((acc, p) => acc + p.budgetKES, 0);
  const totalSpent = filteredProjects.reduce((acc, p) => acc + p.spentKES, 0);
  const totalStockValuation = materials.reduce((acc, m) => acc + (m.currentStock * m.unitPriceKES), 0);

  // CSV Export utility
  const exportToCSV = () => {
    let csvContent = '';
    let fileName = '';

    if (reportType === 'financial') {
      csvContent = 'Date,Payee,Category,InvoiceRef,Amount_KES,Status\n' +
        filteredExpenses.map(e => `"${e.date}","${e.vendorPayee}","${e.category}","${e.invoiceRef}",${e.amountKES},"${e.status}"`).join('\n');
      fileName = `SiteFlow_Financial_Report_${Date.now()}.csv`;
    } else if (reportType === 'projects') {
      csvContent = 'Code,ProjectName,Category,County,Progress_Pct,Budget_KES,Spent_KES,Status\n' +
        filteredProjects.map(p => `"${p.code}","${p.name}","${p.category}","${p.county}",${p.progress},${p.budgetKES},${p.spentKES},"${p.status}"`).join('\n');
      fileName = `SiteFlow_Projects_Summary_${Date.now()}.csv`;
    } else if (reportType === 'inventory') {
      csvContent = 'ItemCode,MaterialName,Category,Stock,Unit,UnitPrice_KES,Valuation_KES\n' +
        materials.map(m => `"${m.itemCode}","${m.name}","${m.category}",${m.currentStock},"${m.unit}",${m.unitPriceKES},${m.currentStock * m.unitPriceKES}`).join('\n');
      fileName = `SiteFlow_Inventory_Valuation_${Date.now()}.csv`;
    } else {
      csvContent = 'IncidentNumber,Date,Severity,Location,RootCause,Status\n' +
        safetyIncidents.map(i => `"${i.incidentNumber}","${i.date}","${i.severity}","${i.locationOnSite}","${i.rootCause}","${i.status}"`).join('\n');
      fileName = `SiteFlow_HSE_Safety_Report_${Date.now()}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reports & Executive Analytics Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Multi-dimensional reporting, CSV export engine, and printable executive summaries.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report View</span>
          </button>
        </div>
      </div>

      {/* Report Filter Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Report Domain:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            {(['financial', 'projects', 'inventory', 'safety'] as const).map(type => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                  reportType === type
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
          >
            <option value="Current Quarter (Q4 2026)">Current Quarter (Q4 2026)</option>
            <option value="Year-to-Date (FY 2026)">Year-to-Date (FY 2026)</option>
            <option value="Project Inception to Date">Project Inception to Date</option>
          </select>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-amber-500 text-lg">SiteFlow</span>
              <span className="text-slate-400">|</span>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                Official Construction Audit Document
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize mt-1">
              Executive {reportType} Status Report ({selectedPeriod})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compiled for Board of Directors, Project Sponsors & Financing Institutions
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono">
            <div>Generated: {new Date().toLocaleDateString('en-KE', { dateStyle: 'long' })}</div>
            <div>Prepared By: {currentUser.name}</div>
          </div>
        </div>

        {/* 4 Analytical KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Portfolio Budget</span>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalBudget)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Disbursements</span>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalSpent)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Stock Assets Held</span>
            <div className="text-base font-bold font-mono text-amber-500 tabular-nums">
              {formatCurrency(totalStockValuation)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Safety Benchmark</span>
            <div className="text-base font-bold font-mono text-emerald-500 tabular-nums">
              0 Incidents (182d)
            </div>
          </div>
        </div>

        {/* Dynamic Table Representation based on active report type */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Detailed Audit Data Table
          </h4>

          {reportType === 'financial' && (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Payee / Vendor</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Invoice Ref</th>
                    <th className="py-2.5 px-3 text-right">Amount (KES)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredExpenses.map(e => (
                    <tr key={e.id}>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{e.date}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{e.vendorPayee}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{e.category}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{e.invoiceRef}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(e.amountKES)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'projects' && (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Code / Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">County Location</th>
                    <th className="py-2.5 px-3 text-right">Physical Progress</th>
                    <th className="py-2.5 px-3 text-right">Budget (KES)</th>
                    <th className="py-2.5 px-3 text-right">Actual Spent (KES)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredProjects.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        <div>{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.code}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{p.category}</td>
                      <td className="py-2.5 px-3 text-slate-500">{p.county}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-500 tabular-nums">
                        {p.progress}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {formatCurrency(p.budgetKES)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {formatCurrency(p.spentKES)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-500">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'inventory' && (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Item Code / Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Physical Stock</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate (KES)</th>
                    <th className="py-2.5 px-3 text-right">Inventory Valuation (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {materials.map(m => (
                    <tr key={m.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        <div>{m.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.itemCode}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{m.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        {m.currentStock} {m.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-500">
                        {formatCurrency(m.unitPriceKES)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-emerald-500">
                        {formatCurrency(m.currentStock * m.unitPriceKES)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'safety' && (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Incident No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Root Cause</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {safetyIncidents.map(i => (
                    <tr key={i.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-red-500">{i.incidentNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{i.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{i.severity}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{i.locationOnSite}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{i.rootCause}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                          {i.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Official Signatures Strip */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-6 text-xs text-slate-500">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-6">Prepared By (Project Manager)</span>
            <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold text-slate-800 dark:text-slate-200">
              Eng. Brian Ochieng
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-6">Certified By (Quantity Surveyor)</span>
            <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold text-slate-800 dark:text-slate-200">
              Catherine Njeri, BQS
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-6">Approved By (Company Director)</span>
            <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold text-slate-800 dark:text-slate-200">
              Arch. Faith Mutua
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
