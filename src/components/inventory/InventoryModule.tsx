import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  Boxes, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Plus, 
  Search, 
  AlertTriangle, 
  PackageCheck, 
  History, 
  Building2,
  DollarSign
} from 'lucide-react';
import { MaterialItem, MaterialCategory } from '../../types';

export const InventoryModule: React.FC = () => {
  const { 
    materials, 
    addMaterial, 
    issueMaterialToSite, 
    receiveStockGRN, 
    inventoryTransactions, 
    projects, 
    formatCurrency, 
    selectedProjectId 
  } = useSiteFlow();

  const [activeTab, setActiveTab] = useState<'catalog' | 'transactions'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Issue Stock Form State
  const [issueForm, setIssueForm] = useState({
    materialId: materials[0]?.id || '',
    quantity: 10,
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    refDoc: `SITE-REQ-${Date.now().toString().slice(-4)}`
  });

  // Receive Stock Form State
  const [receiveForm, setReceiveForm] = useState({
    materialId: materials[0]?.id || '',
    quantity: 100,
    unitCostKES: 850,
    grnRef: `GRN-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`
  });

  // Add Material Form State
  const [newMaterial, setNewMaterial] = useState({
    itemCode: `MAT-GEN-0${materials.length + 1}`,
    name: '',
    category: 'Cement & Binders' as MaterialCategory,
    unit: 'Bags (50kg)' as MaterialItem['unit'],
    currentStock: 100,
    minThreshold: 25,
    unitPriceKES: 850,
    reorderLevel: 50,
    warehouseLocation: 'Main Site Container 1'
  });

  const categoriesList: MaterialCategory[] = [
    'Cement & Binders',
    'Steel & Rebar',
    'Aggregates & Sand',
    'Masonry & Bricks',
    'Plumbing & Drainage',
    'Electrical & Conduits',
    'Timber & Formwork',
    'Finishes & Paint'
  ];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalInventoryValuationKES = materials.reduce((acc, m) => acc + (m.currentStock * m.unitPriceKES), 0);
  const lowStockCount = materials.filter(m => m.currentStock <= m.minThreshold).length;

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const result = issueMaterialToSite(
      issueForm.materialId, 
      Number(issueForm.quantity), 
      issueForm.projectId, 
      issueForm.refDoc
    );

    if (!result.success) {
      setActionError(result.message);
    } else {
      setActionSuccess(result.message);
      setShowIssueModal(false);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    receiveStockGRN(
      receiveForm.materialId,
      Number(receiveForm.quantity),
      Number(receiveForm.unitCostKES),
      receiveForm.grnRef
    );
    setShowReceiveModal(false);
    setActionSuccess(`Successfully processed ${receiveForm.grnRef}. Stock updated.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.name) return;

    addMaterial({
      ...newMaterial,
      lastRestocked: new Date().toISOString().substring(0, 10)
    });
    setShowAddMaterialModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Materials & Site Inventory Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time stock quantities, negative stock prevention, Goods Received Notes (GRN), and site issuances.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setActionError(null);
              setShowIssueModal(true);
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <ArrowUpFromLine className="w-3.5 h-3.5 text-amber-500" />
            <span>Issue to Site</span>
          </button>
          <button
            onClick={() => setShowReceiveModal(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-500" />
            <span>Receive Stock (GRN)</span>
          </button>
          <button
            onClick={() => setShowAddMaterialModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Material</span>
          </button>
        </div>
      </div>

      {/* Success / Error Feedback Toast Banner */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <PackageCheck className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Inventory Valuation
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(totalInventoryValuationKES)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Cumulative physical stock asset value on site ledgers
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Catalogued Materials</span>
            <span className="text-sky-500 font-bold tabular-nums">{materials.length} SKUs</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {categoriesList.length} Categories
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Standardized construction bill of material items
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Low Stock Threshold Alerts
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${lowStockCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {lowStockCount} Items
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {lowStockCount > 0 ? 'Requires immediate replenishment to avert site idle time' : 'All buffer inventories above safety thresholds'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'catalog'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Material Stock Catalog ({filteredMaterials.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'transactions'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Inventory Movement Ledger ({inventoryTransactions.length})
        </button>
      </div>

      {/* Tab 1: Material Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search material by name, item code, or warehouse bay..."
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
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Item Code & Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Warehouse Location</th>
                  <th className="py-3 px-4 text-right">Available Stock</th>
                  <th className="py-3 px-4 text-right">Min Buffer</th>
                  <th className="py-3 px-4 text-right">Unit Rate (KES)</th>
                  <th className="py-3 px-4 text-right">Total Valuation</th>
                  <th className="py-3 px-4 text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredMaterials.map((m) => {
                  const isLow = m.currentStock <= m.minThreshold;
                  const totalVal = m.currentStock * m.unitPriceKES;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.itemCode} · Restocked: {m.lastRestocked}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {m.category}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {m.warehouseLocation}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap text-slate-900 dark:text-white">
                        {m.currentStock} <span className="text-[10px] text-slate-400 font-normal">{m.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap text-slate-400">
                        {m.minThreshold} {m.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {formatCurrency(m.unitPriceKES)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap text-slate-900 dark:text-white">
                        {formatCurrency(totalVal)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isLow ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {isLow ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Movement Ledger */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Material Item</th>
                  <th className="py-3 px-4">Transaction Type</th>
                  <th className="py-3 px-4">Reference Document</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4 text-right">Value (KES)</th>
                  <th className="py-3 px-4 text-right">Balance After</th>
                  <th className="py-3 px-4">Handled By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {inventoryTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {tx.materialName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tx.type === 'Goods Received (GRN)' ? 'bg-emerald-500/10 text-emerald-500' :
                        tx.type === 'Issued to Site' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {tx.referenceDoc}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap text-slate-900 dark:text-white">
                      {tx.type === 'Issued to Site' ? `-${tx.quantity}` : `+${tx.quantity}`} {tx.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {formatCurrency(tx.totalCostKES)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap text-slate-900 dark:text-white">
                      {tx.balanceAfter} {tx.unit}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {tx.initiatedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Issue Material to Site */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Issue Material to Construction Site
              </h3>
              <button 
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Material SKU
                </label>
                <select
                  value={issueForm.materialId}
                  onChange={(e) => setIssueForm({ ...issueForm, materialId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Stock: {m.currentStock} {m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quantity to Issue
                  </label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0.1"
                    value={issueForm.quantity}
                    onChange={(e) => setIssueForm({ ...issueForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destination Project
                  </label>
                  <select
                    value={issueForm.projectId}
                    onChange={(e) => setIssueForm({ ...issueForm, projectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Site Requisition Slip / Ref Document
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. REQ-SLAB-POUR-08"
                  value={issueForm.refDoc}
                  onChange={(e) => setIssueForm({ ...issueForm, refDoc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-slate-600 dark:text-slate-300">
                <strong>Zero-Negative Guard:</strong> The system enforces store balance validation. Issuances exceeding physical stock will be rejected.
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Authorize Stock Issuance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Receive Stock (GRN) */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Goods Received Note (GRN) Inward Entry
              </h3>
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReceiveSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivered Material Item
                </label>
                <select
                  value={receiveForm.materialId}
                  onChange={(e) => setReceiveForm({ ...receiveForm, materialId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Delivered Quantity
                  </label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    value={receiveForm.quantity}
                    onChange={(e) => setReceiveForm({ ...receiveForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Unit Cost (KES)
                  </label>
                  <input
                    type="number"
                    required
                    step="10"
                    value={receiveForm.unitCostKES}
                    onChange={(e) => setReceiveForm({ ...receiveForm, unitCostKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GRN / Delivery Note Number
                </label>
                <input
                  type="text"
                  required
                  value={receiveForm.grnRef}
                  onChange={(e) => setReceiveForm({ ...receiveForm, grnRef: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReceiveModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-sm transition-colors"
                >
                  Confirm Goods Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Material Registration */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Register New Material in Catalog
              </h3>
              <button 
                onClick={() => setShowAddMaterialModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Item Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newMaterial.itemCode}
                    onChange={(e) => setNewMaterial({ ...newMaterial, itemCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newMaterial.category}
                    onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {categoriesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Material Name & Specification
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TMT High-Yield Rebar D12"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit of Measurement
                  </label>
                  <select
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Bags (50kg)">Bags (50kg)</option>
                    <option value="Tonnes">Tonnes</option>
                    <option value="Cubic Metres (m³)">Cubic Metres (m³)</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Meters">Meters</option>
                    <option value="Litres">Litres</option>
                    <option value="Rolls">Rolls</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newMaterial.currentStock}
                    onChange={(e) => setNewMaterial({ ...newMaterial, currentStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Alert Threshold
                  </label>
                  <input
                    type="number"
                    required
                    value={newMaterial.minThreshold}
                    onChange={(e) => setNewMaterial({ ...newMaterial, minThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit Price (KES)
                  </label>
                  <input
                    type="number"
                    required
                    step="10"
                    value={newMaterial.unitPriceKES}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unitPriceKES: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Warehouse Staging Bay
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Yard Shed C"
                  value={newMaterial.warehouseLocation}
                  onChange={(e) => setNewMaterial({ ...newMaterial, warehouseLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Add Material to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
