import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  Users2, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Phone, 
  Calendar, 
  Briefcase,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { Worker, AttendanceRecord, AttendanceStatus } from '../../types';

export const WorkforceModule: React.FC = () => {
  const { 
    workers, 
    addWorker, 
    updateWorkerStatus, 
    attendance, 
    logAttendance, 
    projects, 
    formatCurrency, 
    selectedProjectId 
  } = useSiteFlow();

  const [activeTab, setActiveTab] = useState<'roster' | 'attendance' | 'payroll'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('ALL');
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showLogAttendanceModal, setShowLogAttendanceModal] = useState(false);

  // New Worker State
  const [newWorker, setNewWorker] = useState({
    employeeId: `SF-ART-10${workers.length + 1}`,
    name: '',
    phone: '+254 ',
    trade: 'Senior Mason',
    department: 'Civil Works' as Worker['department'],
    assignedProjectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    dailyRateKES: 2500,
    overtimeHourlyRateKES: 450,
    type: 'Direct Employee' as const,
    nationalId: '',
    emergencyContact: '',
    safetyInductionDate: new Date().toISOString().substring(0, 10)
  });

  // Log Attendance State
  const [attendanceForm, setAttendanceForm] = useState({
    workerId: workers[0]?.id || '',
    date: new Date().toISOString().substring(0, 10),
    status: 'Present' as AttendanceStatus,
    checkIn: '06:45',
    checkOut: '17:00',
    hoursWorked: 9,
    overtimeHours: 1,
    shift: 'Day Shift' as const
  });

  const filteredWorkers = workers.filter(w => {
    const matchesProj = selectedProjectId === 'ALL' || w.assignedProjectId === selectedProjectId;
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.phone.includes(searchTerm);
    const matchesTrade = tradeFilter === 'ALL' || w.department === tradeFilter;
    return matchesProj && matchesSearch && matchesTrade;
  });

  // Calculate today's muster roll
  const todayAttendance = attendance.filter(a => a.date === '2026-11-06');
  const presentCount = todayAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
  const totalSiteHours = todayAttendance.reduce((acc, a) => acc + a.hoursWorked, 0);

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.phone) return;

    addWorker({
      ...newWorker,
      activeStatus: 'Active'
    });
    setShowAddWorkerModal(false);
  };

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = workers.find(wrk => wrk.id === attendanceForm.workerId);
    if (!w) return;

    logAttendance({
      ...attendanceForm,
      workerName: w.name,
      projectId: w.assignedProjectId
    });
    setShowLogAttendanceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Workforce & Site Human Resources
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Artisan rosters, daily muster rolls, attendance telemetry, and payroll integration.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowLogAttendanceModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Clock Attendance</span>
          </button>
          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Operative</span>
          </button>
        </div>
      </div>

      {/* 3 Workforce Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Registered Site Workforce
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {filteredWorkers.length} <span className="text-xs font-normal text-slate-400">Artisans & Staff</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Direct employees: <strong className="text-slate-700 dark:text-slate-200">{filteredWorkers.filter(w => w.type === 'Direct Employee').length}</strong> · Contractors: <strong className="text-slate-700 dark:text-slate-200">{filteredWorkers.filter(w => w.type !== 'Direct Employee').length}</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Today's Muster Roll</span>
            <span className="text-emerald-500 font-bold tabular-nums">Normal</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {presentCount} <span className="text-xs font-normal text-slate-400">Present</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Late arrivals: <strong className="text-amber-500">{lateCount}</strong> · Absent: <strong className="text-red-400">{filteredWorkers.length - presentCount}</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Man-Hours Logged Today
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-500 tabular-nums">
            {totalSiteHours.toFixed(1)} hrs
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Productivity baseline: <strong className="text-emerald-500">96.4% target output</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'roster'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Artisan & Worker Roster ({filteredWorkers.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'attendance'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Daily Muster Attendance Log
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'payroll'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Payroll Estimation Preview
        </button>
      </div>

      {/* Tab 1: Worker Roster */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search worker by name, trade, ID, or phone..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={tradeFilter}
                onChange={(e) => setTradeFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Departments</option>
                <option value="Civil Works">Civil Works</option>
                <option value="Structural">Structural</option>
                <option value="MEP Services">MEP Services</option>
                <option value="Plant Operations">Plant Operations</option>
                <option value="Site Supervision">Site Supervision</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Operative ID / Name</th>
                  <th className="py-3 px-4">Trade & Department</th>
                  <th className="py-3 px-4">Assigned Project</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4 text-right">Daily Rate</th>
                  <th className="py-3 px-4 text-right">OT Rate / Hr</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredWorkers.map((w) => {
                  const proj = projects.find(p => p.id === w.assignedProjectId);
                  return (
                    <tr key={w.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{w.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{w.employeeId} · National ID: {w.nationalId}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-slate-800 dark:text-slate-200 font-semibold">{w.trade}</div>
                        <div className="text-[10px] text-slate-400">{w.department} · {w.type}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 max-w-[160px] truncate">
                        {proj?.name || 'Central Pool'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-400">
                        {w.phone}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                        {formatCurrency(w.dailyRateKES)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums whitespace-nowrap">
                        {formatCurrency(w.overtimeHourlyRateKES)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          w.activeStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                          w.activeStatus === 'On Leave' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {w.activeStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {w.activeStatus === 'Active' ? (
                          <button
                            onClick={() => updateWorkerStatus(w.id, 'On Leave')}
                            className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            Mark Leave
                          </button>
                        ) : (
                          <button
                            onClick={() => updateWorkerStatus(w.id, 'Active')}
                            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance Ledger */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Date / Shift</th>
                  <th className="py-3 px-4">Worker Name</th>
                  <th className="py-3 px-4">Check-In / Check-Out</th>
                  <th className="py-3 px-4 text-right">Hours Worked</th>
                  <th className="py-3 px-4 text-right">Overtime</th>
                  <th className="py-3 px-4 text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-900 dark:text-white">
                      {rec.date}
                      <div className="text-[10px] text-slate-400 font-normal">{rec.shift}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {rec.workerName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-300">
                      {rec.checkIn} - {rec.checkOut}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {rec.hoursWorked} hrs
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-500 tabular-nums">
                      {rec.overtimeHours > 0 ? `+${rec.overtimeHours} hrs` : '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rec.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500' :
                        rec.status === 'Late' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payroll Estimation Preview */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300">
            <strong>Payroll Integration Readiness:</strong> Automatically calculates estimated fortnightly wage entitlements based on logged muster roll days and overtime hours at certified statutory rates.
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Worker / Artisan</th>
                  <th className="py-3 px-4">Trade</th>
                  <th className="py-3 px-4 text-right">Standard Days</th>
                  <th className="py-3 px-4 text-right">Base Pay (KES)</th>
                  <th className="py-3 px-4 text-right">Overtime Pay (KES)</th>
                  <th className="py-3 px-4 text-right">Gross Pay (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {workers.map((w) => {
                  const estDays = 12; // 12-day fortnight muster
                  const estOT = 8; // 8 hrs overtime
                  const basePay = estDays * w.dailyRateKES;
                  const otPay = estOT * w.overtimeHourlyRateKES;
                  const grossPay = basePay + otPay;

                  return (
                    <tr key={w.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{w.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{w.employeeId}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {w.trade}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {estDays} days
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {formatCurrency(basePay)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-500 tabular-nums">
                        {formatCurrency(otPay)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-500">
                        {formatCurrency(grossPay)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Enroll Worker */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enroll Site Operative / Artisan
              </h3>
              <button 
                onClick={() => setShowAddWorkerModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWorkerSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorker.employeeId}
                    onChange={(e) => setNewWorker({ ...newWorker, employeeId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    National ID No
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 28910441"
                    value={newWorker.nationalId}
                    onChange={(e) => setNewWorker({ ...newWorker, nationalId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boniface Mwenda"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone (M-Pesa)
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorker.phone}
                    onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Trade / Job Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Certified Welder"
                    value={newWorker.trade}
                    onChange={(e) => setNewWorker({ ...newWorker, trade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={newWorker.department}
                    onChange={(e) => setNewWorker({ ...newWorker, department: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Civil Works">Civil Works</option>
                    <option value="Structural">Structural</option>
                    <option value="MEP Services">MEP Services</option>
                    <option value="Plant Operations">Plant Operations</option>
                    <option value="Site Supervision">Site Supervision</option>
                    <option value="Finishes">Finishes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Rate (KES)
                  </label>
                  <input
                    type="number"
                    required
                    step="100"
                    value={newWorker.dailyRateKES}
                    onChange={(e) => setNewWorker({ ...newWorker, dailyRateKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Overtime Hourly Rate (KES)
                  </label>
                  <input
                    type="number"
                    required
                    step="50"
                    value={newWorker.overtimeHourlyRateKES}
                    onChange={(e) => setNewWorker({ ...newWorker, overtimeHourlyRateKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Enroll Operative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Attendance */}
      {showLogAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Clock Daily Site Attendance
              </h3>
              <button 
                onClick={() => setShowLogAttendanceModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Operative
                </label>
                <select
                  value={attendanceForm.workerId}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, workerId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.trade} - {w.employeeId})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={attendanceForm.date}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Muster Status
                  </label>
                  <select
                    value={attendanceForm.status}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Absent">Absent</option>
                    <option value="Excused Leave">Excused Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Check-In Time
                  </label>
                  <input
                    type="time"
                    value={attendanceForm.checkIn}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Check-Out Time
                  </label>
                  <input
                    type="time"
                    value={attendanceForm.checkOut}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, checkOut: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Normal Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={attendanceForm.hoursWorked}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, hoursWorked: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={attendanceForm.overtimeHours}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, overtimeHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogAttendanceModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Confirm Muster Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
