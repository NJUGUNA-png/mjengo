import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Star, 
  Phone, 
  Mail,
  FileText
} from 'lucide-react';
import { PurchaseOrder, Supplier, MaterialCategory } from '../../types';

export const ProcurementModule: React.FC = () => {
  const { 
    purchaseOrders, 
    addPurchaseOrder, 
    updatePOStatus, 
    suppliers, 
    addSupplier, 
    materials, 
    projects, 
    formatCurrency, 
    selectedProjectId,
    currentUser
  } = useSiteFlow();

  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showPOModal, setShowPOModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // New PO State
  const [newPO, setNewPO] = useState({
    supplierId: suppliers[0]?.id || '',
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    expectedDeliveryDate: '2026-11-15',
    materialId: materials[0]?.id || '',
    quantity: 50,
    notes: 'Urgent site delivery required for scheduled slab casting.'
  });

  // New Supplier State
  const [newSupplier, setNewSupplier] = useState({
    code: `SUP-GEN-0${suppliers.length + 1}`,
    name: '',
    contactPerson: '',
    email: '',
    phone: '+254 ',
    address: 'Nairobi, Kenya',
    categories: ['Cement & Binders'] as MaterialCategory[],
    rating: 4.8,
    paymentTerms: '30 Days Net on LPO'
  });

  const filteredOrders = purchaseOrders.filter(po => {
    const matchesProj = selectedProjectId === 'ALL' || po.projectId === selectedProjectId;
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          po.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesProj && matchesSearch && matchesStatus;
  });

  const handlePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === newPO.supplierId);
    const proj = projects.find(p => p.id === newPO.projectId);
    const mat = materials.find(m => m.id === newPO.materialId);

    if (!sup || !proj || !mat) return;

    const lineTotal = newPO.quantity * mat.unitPriceKES;
    const vat = Math.round(lineTotal * 0.16);
    const total = lineTotal + vat;

    addPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      projectId: proj.id,
      projectName: proj.name,
      createdDate: new Date().toISOString().substring(0, 10),
      expectedDeliveryDate: newPO.expectedDeliveryDate,
      status: 'Submitted',
      items: [
        {
          materialId: mat.id,
          materialName: mat.name,
          quantity: newPO.quantity,
          unit: mat.unit,
          unitPriceKES: mat.unitPriceKES,
          lineTotalKES: lineTotal
        }
      ],
      subtotalKES: lineTotal,
      vatKES: vat,
      totalAmountKES: total,
      requestedBy: currentUser.name,
      notes: newPO.notes
    });

    setShowPOModal(false);
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name) return;

    addSupplier({
      ...newSupplier,
      activeContractsCount: 1
    });

    setShowSupplierModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Procurement & Supplier Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Purchase Requisitions (PR), Official Purchase Orders (LPO), supplier ratings, and fulfillment workflows.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowSupplierModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Add Supplier</span>
          </button>
          <button
            onClick={() => setShowPOModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Purchase Order</span>
          </button>
        </div>
      </div>

      {/* 3 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Procurement Commitment
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(purchaseOrders.reduce((acc, po) => acc + po.totalAmountKES, 0))}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Active purchase orders across certified supplier contracts
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Pending Approvals</span>
            <span className="text-amber-500 font-bold tabular-nums">
              {purchaseOrders.filter(po => po.status === 'Submitted').length} POs
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {purchaseOrders.filter(po => po.status === 'Approved' || po.status === 'In Transit').length} Active
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Orders currently in transit or approved for dispatch
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Vetted Kenyan Suppliers
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500 tabular-nums">
            {suppliers.length} Approved
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Average fulfillment SLA: <strong className="text-slate-700 dark:text-slate-200">4.8 / 5.0 Star Rating</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Purchase Orders ({filteredOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'suppliers'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Approved Suppliers Directory ({suppliers.length})
        </button>
      </div>

      {/* Tab 1: Purchase Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search PO Number, supplier, or project..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All PO Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 dark:bg-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">PO Number / Date</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Order Items</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">Total (Inc. VAT)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-amber-600 dark:text-amber-400">{po.poNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{po.createdDate}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {po.supplierName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[160px] truncate">
                      {po.projectName}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {po.items.map(i => `${i.quantity} ${i.unit} of ${i.materialName}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                      {formatCurrency(po.subtotalKES)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(po.totalAmountKES)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        po.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                        po.status === 'In Transit' ? 'bg-sky-500/10 text-sky-500' :
                        po.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {po.status === 'Submitted' ? (
                        <button
                          onClick={() => updatePOStatus(po.id, 'Approved')}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                        >
                          Approve LPO
                        </button>
                      ) : po.status === 'Approved' ? (
                        <button
                          onClick={() => updatePOStatus(po.id, 'In Transit')}
                          className="px-2 py-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 rounded transition-colors"
                        >
                          Dispatch
                        </button>
                      ) : po.status === 'In Transit' ? (
                        <button
                          onClick={() => updatePOStatus(po.id, 'Delivered')}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                        >
                          Confirm Delivery
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Fulfilled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Suppliers Directory */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((sup) => (
            <div 
              key={sup.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{sup.code}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{sup.categories.join(', ')}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {sup.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-xs font-bold font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{sup.rating}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{sup.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{sup.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sup.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Terms: <strong>{sup.paymentTerms}</strong></span>
                <span>Active Contracts: <strong>{sup.activeContractsCount}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Generate Purchase Order */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Generate Official Purchase Order (LPO)
              </h3>
              <button 
                onClick={() => setShowPOModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePOSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Supplier
                  </label>
                  <select
                    value={newPO.supplierId}
                    onChange={(e) => setNewPO({ ...newPO, supplierId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Charge to Project
                  </label>
                  <select
                    value={newPO.projectId}
                    onChange={(e) => setNewPO({ ...newPO, projectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Material Item
                  </label>
                  <select
                    value={newPO.materialId}
                    onChange={(e) => setNewPO({ ...newPO, materialId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({formatCurrency(m.unitPriceKES)}/{m.unit})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Order Quantity
                  </label>
                  <input
                    type="number"
                    required
                    step="1"
                    min="1"
                    value={newPO.quantity}
                    onChange={(e) => setNewPO({ ...newPO, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  required
                  value={newPO.expectedDeliveryDate}
                  onChange={(e) => setNewPO({ ...newPO, expectedDeliveryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Special Instructions / Staging Bay
                </label>
                <textarea
                  rows={2}
                  value={newPO.notes}
                  onChange={(e) => setNewPO({ ...newPO, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Submit PO for QS Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Supplier */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Register Approved Supplier
              </h3>
              <button 
                onClick={() => setShowSupplierModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSupplierSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supplier Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Athi River Mining (ARM) Cement"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Kariuki"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="orders@supplier.co.ke"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    required
                    value={newSupplier.paymentTerms}
                    onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Rating (1-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newSupplier.rating}
                    onChange={(e) => setNewSupplier({ ...newSupplier, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Register Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
