import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  Truck, 
  Plus, 
  Search, 
  Fuel, 
  Clock, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Calendar,
  Layers
} from 'lucide-react';
import { Equipment, EquipmentStatus } from '../../types';

export const EquipmentModule: React.FC = () => {
  const { 
    equipment, 
    addEquipment, 
    updateEquipmentStatus, 
    logEquipmentUsage, 
    projects, 
    formatCurrency, 
    selectedProjectId 
  } = useSiteFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);

  // New Equipment Form State
  const [newEq, setNewEq] = useState({
    assetCode: `PLANT-GEN-0${equipment.length + 1}`,
    name: '',
    category: 'Excavators & Earthmoving' as Equipment['category'],
    modelYear: '2022',
    assignedProjectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    hourlyRentalRateKES: 4500,
    dailyCostKES: 36000,
    operatorName: 'Certified Plant Operator',
    nextServiceDueDate: '2026-12-15'
  });

  // Log Usage State
  const [usageForm, setUsageForm] = useState({
    equipmentId: equipment[0]?.id || '',
    hours: 8,
    fuelLitres: 45
  });

  const filteredEquipment = equipment.filter(e => {
    const matchesProj = selectedProjectId === 'ALL' || e.assignedProjectId === selectedProjectId;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesCat = categoryFilter === 'ALL' || e.category === categoryFilter;
    return matchesProj && matchesSearch && matchesStatus && matchesCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEq.name) return;
    const proj = projects.find(p => p.id === newEq.assignedProjectId);

    addEquipment({
      ...newEq,
      projectName: proj?.name || 'Site Fleet',
      status: 'Operational',
      operatingHours: 0,
      fuelTodayLitres: 0,
      lastServiceDate: new Date().toISOString().substring(0, 10)
    });

    setShowAddModal(false);
  };

  const handleUsageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logEquipmentUsage(
      usageForm.equipmentId,
      Number(usageForm.hours),
      Number(usageForm.fuelLitres)
    );
    setShowUsageModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Equipment & Plant Fleet Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Tower cranes, earthmoving machinery, fuel consumption logs, and preventive maintenance intervals.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowUsageModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Fuel className="w-3.5 h-3.5 text-amber-500" />
            <span>Log Fuel & Operating Hours</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Plant Item</span>
          </button>
        </div>
      </div>

      {/* 3 Fleet Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Commissioned Fleet
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {filteredEquipment.length} <span className="text-xs font-normal text-slate-400">Plant Assets</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Operational: <strong className="text-emerald-500">{filteredEquipment.filter(e => e.status === 'Operational' || e.status === 'In Use').length}</strong> · In maintenance: <strong className="text-amber-500">{filteredEquipment.filter(e => e.status.includes('Maintenance') || e.status.includes('Service')).length}</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Fuel Consumed Today
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-500 tabular-nums">
            {filteredEquipment.reduce((acc, e) => acc + e.fuelTodayLitres, 0)} Litres
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Average diesel burn: <strong className="text-slate-700 dark:text-slate-200">14.2 L / engine hr</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Cumulative Operating Hours
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {filteredEquipment.reduce((acc, e) => acc + e.operatingHours, 0).toLocaleString()} hrs
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Utilization index: <strong className="text-emerald-500">88.5% plant uptime</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search equipment asset code, name, or operator..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance Required">Maintenance Required</option>
            <option value="Under Service">Under Service</option>
          </select>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEquipment.map((eq) => {
          const isServiceOverdue = new Date(eq.nextServiceDueDate) < new Date();
          return (
            <div 
              key={eq.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{eq.assetCode}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{eq.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {eq.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Deployed on: {eq.projectName}
                  </div>
                </div>

                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  eq.status === 'Operational' || eq.status === 'In Use' ? 'bg-emerald-500/10 text-emerald-500' :
                  eq.status === 'Maintenance Required' ? 'bg-red-500/10 text-red-500 animate-pulse' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {eq.status}
                </span>
              </div>

              {/* Machinery Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Operating Hours</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{eq.operatingHours} hrs</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Today's Fuel</span>
                  <strong className="font-mono text-amber-500">{eq.fuelTodayLitres} Litres</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rental / Day</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(eq.dailyCostKES)}</strong>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Certified Operator: <strong className="text-slate-700 dark:text-slate-300">{eq.operatorName}</strong></span>
                  <span className={`font-mono text-[11px] ${isServiceOverdue ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                    Next Service: {eq.nextServiceDueDate} {isServiceOverdue && '(OVERDUE)'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                {eq.status !== 'Operational' && (
                  <button
                    onClick={() => updateEquipmentStatus(eq.id, 'Operational')}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                  >
                    Clear for Operation
                  </button>
                )}
                {eq.status !== 'Maintenance Required' && (
                  <button
                    onClick={() => updateEquipmentStatus(eq.id, 'Maintenance Required')}
                    className="px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  >
                    Flag Maintenance
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Register Equipment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Register Heavy Machinery / Plant
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Plant Asset Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newEq.assetCode}
                    onChange={(e) => setNewEq({ ...newEq, assetCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newEq.category}
                    onChange={(e) => setNewEq({ ...newEq, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Excavators & Earthmoving">Excavators & Earthmoving</option>
                    <option value="Cranes & Hoists">Cranes & Hoists</option>
                    <option value="Concrete & Mixing">Concrete & Mixing</option>
                    <option value="Generators & Power">Generators & Power</option>
                    <option value="Haulage & Trucks">Haulage & Trucks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Equipment Make & Model
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Komatsu PC200-8 Hydraulic Excavator"
                  value={newEq.name}
                  onChange={(e) => setNewEq({ ...newEq, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Rental Rate (KES)
                  </label>
                  <input
                    type="number"
                    required
                    step="1000"
                    value={newEq.dailyCostKES}
                    onChange={(e) => setNewEq({ ...newEq, dailyCostKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Operator
                  </label>
                  <input
                    type="text"
                    required
                    value={newEq.operatorName}
                    onChange={(e) => setNewEq({ ...newEq, operatorName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Next Maintenance Due Date
                </label>
                <input
                  type="date"
                  required
                  value={newEq.nextServiceDueDate}
                  onChange={(e) => setNewEq({ ...newEq, nextServiceDueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Enroll Equipment Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Usage */}
      {showUsageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log Equipment Fuel & Operating Hours
              </h3>
              <button 
                onClick={() => setShowUsageModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUsageSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Plant Asset
                </label>
                <select
                  value={usageForm.equipmentId}
                  onChange={(e) => setUsageForm({ ...usageForm, equipmentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {equipment.map(e => (
                    <option key={e.id} value={e.id}>{e.assetCode} - {e.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hours Run Today
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={usageForm.hours}
                    onChange={(e) => setUsageForm({ ...usageForm, hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fuel Consumed (Litres)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={usageForm.fuelLitres}
                    onChange={(e) => setUsageForm({ ...usageForm, fuelLitres: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUsageModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Save Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
