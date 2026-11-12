import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Search, 
  FileCheck, 
  Receipt, 
  AlertTriangle, 
  Filter, 
  CreditCard,
  Building,
  CheckCircle2
} from 'lucide-react';
import { ExpenseCategory, ExpenseRecord, ContractorPaymentCertificate } from '../../types';

export const FinancialModule: React.FC = () => {
  const { 
    projects, 
    expenses, 
    addExpense, 
    updateExpenseStatus, 
    paymentCertificates, 
    addCertificate, 
    updateCertificateStatus, 
    formatCurrency, 
    selectedProjectId,
    currentUser
  } = useSiteFlow();

  const [activeTab, setActiveTab] = useState<'expenses' | 'certificates' | 'categories'>('expenses');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    date: new Date().toISOString().substring(0, 10),
    category: 'Materials' as ExpenseCategory,
    vendorPayee: '',
    description: '',
    amountKES: 500000,
    paymentMethod: 'Bank Transfer' as const,
    invoiceRef: `INV-${Date.now().toString().slice(-4)}`
  });

  // New IPC Certificate Form State
  const [newCert, setNewCert] = useState({
    certificateNo: `IPC-KLM-00${paymentCertificates.length + 1}`,
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    contractorName: '',
    trade: 'Mechanical & Plumbing',
    grossAmountKES: 2500000,
    retentionKES: 250000, // 10%
    taxDeductionKES: 125000, // 5% withholding
    issueDate: new Date().toISOString().substring(0, 10),
    dueDate: '2026-11-30',
    certifiedByQS: currentUser.name
  });

  // Filter projects & expenses
  const filteredProjects = selectedProjectId === 'ALL' 
    ? projects 
    : projects.filter(p => p.id === selectedProjectId);

  const totalBudget = filteredProjects.reduce((acc, p) => acc + p.budgetKES, 0);
  const totalSpent = filteredProjects.reduce((acc, p) => acc + p.spentKES, 0);
  const remainingBudget = totalBudget - totalSpent;
  const utilizationPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Filter expenses list
  const filteredExpenses = expenses.filter(exp => {
    const matchesProj = selectedProjectId === 'ALL' || exp.projectId === selectedProjectId;
    const matchesSearch = exp.vendorPayee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.invoiceRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || exp.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || exp.status === statusFilter;
    return matchesProj && matchesSearch && matchesCat && matchesStatus;
  });

  // Calculate expenses by category
  const categoriesList: ExpenseCategory[] = [
    'Materials', 
    'Labour', 
    'Equipment & Plant', 
    'Subcontractor', 
    'Transport & Logistics', 
    'Overheads & Misc'
  ];

  const categoryTotals = categoriesList.map(cat => {
    const sum = expenses
      .filter(e => (selectedProjectId === 'ALL' || e.projectId === selectedProjectId) && e.category === cat)
      .reduce((acc, e) => acc + e.amountKES, 0);
    return {
      category: cat,
      amountKES: sum,
      pct: totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0
    };
  });

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.vendorPayee || !newExpense.description) return;
    const proj = projects.find(p => p.id === newExpense.projectId);

    addExpense({
      ...newExpense,
      projectName: proj?.name || 'Site Project',
      status: 'Approved',
      approvedBy: currentUser.name
    });

    setShowExpenseModal(false);
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.contractorName) return;

    const netPayable = newCert.grossAmountKES - newCert.retentionKES - newCert.taxDeductionKES;
    addCertificate({
      ...newCert,
      netPayableKES: netPayable,
      status: 'Certified'
    });

    setShowCertModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial & Budget Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time expenditure tracking, contractor certificates, and cash-flow utilization in Kenyan Shillings (KES).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowCertModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Issue Payment Certificate</span>
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* 3 Core Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Allocated Budget
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(totalBudget)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Baseline budget for {filteredProjects.length} active project scope(s)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Actual Expenditure (Spent)</span>
            <span className="text-amber-500 font-bold tabular-nums">{utilizationPct}% Burn</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(totalSpent)}
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${utilizationPct > 90 ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(utilizationPct, 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Remaining Net Budget
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${remainingBudget < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {formatCurrency(remainingBudget)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Available liquidity before over-run contingency threshold
          </div>
        </div>
      </div>

      {/* Segmented Sub-Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'expenses'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Disbursements & Expenses ({filteredExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'certificates'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Contractor Payment Certificates ({paymentCertificates.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'categories'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Category Cost Breakdown
        </button>
      </div>

      {/* Tab 1: Expenses & Disbursements Ledger */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search payee, invoice number, or description..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Categories</option>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Approved">Approved</option>
                <option value="Pending Approval">Pending Approval</option>
              </select>
            </div>
          </div>

          {/* High-Density Data Grid */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Date / Ref</th>
                  <th className="py-3 px-4">Payee / Vendor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4 text-right">Amount (KES)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-slate-900 dark:text-white font-semibold">{exp.date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{exp.invoiceRef}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{exp.vendorPayee}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{exp.description}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{exp.category}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 max-w-[160px] truncate">
                      {exp.projectName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                      {formatCurrency(exp.amountKES)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        exp.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                        exp.status === 'Approved' ? 'bg-sky-500/10 text-sky-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {exp.status === 'Pending Approval' ? (
                        <button
                          onClick={() => updateExpenseStatus(exp.id, 'Approved')}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                        >
                          Approve
                        </button>
                      ) : exp.status === 'Approved' ? (
                        <button
                          onClick={() => updateExpenseStatus(exp.id, 'Paid')}
                          className="px-2 py-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 rounded transition-colors"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Contractor Interim Payment Certificates (IPC) */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Certificate No</th>
                  <th className="py-3 px-4">Subcontractor & Trade</th>
                  <th className="py-3 px-4 text-right">Gross Claimed</th>
                  <th className="py-3 px-4 text-right">Retention (10%)</th>
                  <th className="py-3 px-4 text-right">Withholding Tax (5%)</th>
                  <th className="py-3 px-4 text-right">Net Payable</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {paymentCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {cert.certificateNo}
                      <div className="text-[10px] text-slate-400 font-normal">QS: {cert.certifiedByQS}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{cert.contractorName}</div>
                      <div className="text-[11px] text-slate-400">{cert.trade}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500">
                      {formatCurrency(cert.grossAmountKES)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-red-400">
                      -{formatCurrency(cert.retentionKES)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                      -{formatCurrency(cert.taxDeductionKES)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(cert.netPayableKES)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                      {cert.dueDate}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cert.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                        cert.status === 'Approved' ? 'bg-sky-500/10 text-sky-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {cert.status === 'Certified' ? (
                        <button
                          onClick={() => updateCertificateStatus(cert.id, 'Approved')}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                        >
                          Approve
                        </button>
                      ) : cert.status === 'Approved' ? (
                        <button
                          onClick={() => updateCertificateStatus(cert.id, 'Paid')}
                          className="px-2 py-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 rounded transition-colors"
                        >
                          Disburse
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Disbursed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Category Cost Breakdown */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTotals.map((cat) => (
            <div 
              key={cat.category}
              className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {cat.category}
                </span>
                <span className="text-xs font-mono font-bold text-amber-500 tabular-nums">
                  {cat.pct}% of total
                </span>
              </div>

              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {formatCurrency(cat.amountKES)}
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${cat.pct}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                Total audited cumulative expenditures charged to {cat.category.toLowerCase()} across site ledgers.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Record Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Record Site Expense / Payment Voucher
              </h3>
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Charged Project
                </label>
                <select
                  value={newExpense.projectId}
                  onChange={(e) => setNewExpense({ ...newExpense, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expense Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {categoriesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Disbursement Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vendor / Payee Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Devki Steel Mills Ltd"
                    value={newExpense.vendorPayee}
                    onChange={(e) => setNewExpense({ ...newExpense, vendorPayee: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount in KES
                  </label>
                  <input
                    type="number"
                    required
                    step="1000"
                    value={newExpense.amountKES}
                    onChange={(e) => setNewExpense({ ...newExpense, amountKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newExpense.paymentMethod}
                    onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Bank Transfer">Bank Transfer (RTGS / EFT)</option>
                    <option value="M-Pesa Business">M-Pesa Paybill / Till</option>
                    <option value="Cheque">Corporate Cheque</option>
                    <option value="Petty Cash">Site Petty Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invoice / Receipt Ref
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpense.invoiceRef}
                    onChange={(e) => setNewExpense({ ...newExpense, invoiceRef: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item Description & Purpose
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. 50 Tonnes of ballast delivered for Level 8 slab casting..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Record Expense Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Contractor Payment Certificate */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Issue Interim Payment Certificate (IPC)
              </h3>
              <button 
                onClick={() => setShowCertModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCertSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Certificate No
                  </label>
                  <input
                    type="text"
                    required
                    value={newCert.certificateNo}
                    onChange={(e) => setNewCert({ ...newCert, certificateNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Trade / Package
                  </label>
                  <input
                    type="text"
                    required
                    value={newCert.trade}
                    onChange={(e) => setNewCert({ ...newCert, trade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subcontractor Company
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Electrical & MEP Services Ltd"
                  value={newCert.contractorName}
                  onChange={(e) => setNewCert({ ...newCert, contractorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gross Valuation (KES)
                  </label>
                  <input
                    type="number"
                    required
                    step="1000"
                    value={newCert.grossAmountKES}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNewCert({
                        ...newCert,
                        grossAmountKES: val,
                        retentionKES: Math.round(val * 0.10),
                        taxDeductionKES: Math.round(val * 0.05)
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Retention (10%)
                  </label>
                  <input
                    type="number"
                    required
                    value={newCert.retentionKES}
                    onChange={(e) => setNewCert({ ...newCert, retentionKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Withholding Tax (5%)
                  </label>
                  <input
                    type="number"
                    required
                    value={newCert.taxDeductionKES}
                    onChange={(e) => setNewCert({ ...newCert, taxDeductionKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">Calculated Net Payable:</span>
                <span className="font-mono font-bold text-amber-500 text-sm">
                  {formatCurrency(newCert.grossAmountKES - newCert.retentionKES - newCert.taxDeductionKES)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newCert.issueDate}
                    onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newCert.dueDate}
                    onChange={(e) => setNewCert({ ...newCert, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Issue Certified IPC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
