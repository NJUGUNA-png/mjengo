import React from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  LayoutDashboard, 
  Building2, 
  DollarSign, 
  Users2, 
  Boxes, 
  ShoppingCart, 
  CheckSquare, 
  Truck, 
  ShieldAlert, 
  Award, 
  FolderArchive, 
  BarChart3, 
  BrainCircuit, 
  UserCheck,
  ChevronRight,
  HardHat
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, tasks, safetyIncidents, materials } = useSiteFlow();

  // Dynamic alert indicators
  const lowStockCount = materials.filter(m => m.currentStock <= m.minThreshold).length;
  const criticalTasksCount = tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed').length;
  const openIncidentsCount = safetyIncidents.filter(i => i.status !== 'Closed & Signed Off').length;

  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Site Control',
      items: [
        { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects & Milestones', icon: Building2 },
        { id: 'tasks', label: 'Tasks & Site Diary', icon: CheckSquare, badge: criticalTasksCount > 0 ? `${criticalTasksCount}` : undefined, badgeColor: 'bg-amber-500/20 text-amber-500' },
      ]
    },
    {
      title: 'Commercial & Logistics',
      items: [
        { id: 'financial', label: 'Financials & Budget (KES)', icon: DollarSign },
        { id: 'workforce', label: 'Workforce & Attendance', icon: Users2 },
        { id: 'inventory', label: 'Materials & Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined, badgeColor: 'bg-amber-500/20 text-amber-500' },
        { id: 'procurement', label: 'Procurement & Orders', icon: ShoppingCart },
        { id: 'equipment', label: 'Plant & Heavy Machinery', icon: Truck },
      ]
    },
    {
      title: 'Governance & Quality',
      items: [
        { id: 'safety', label: 'Health & Safety (HSE)', icon: ShieldAlert, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : undefined, badgeColor: 'bg-red-500/20 text-red-400' },
        { id: 'quality', label: 'QA / QC & Inspections', icon: Award },
        { id: 'documents', label: 'Drawing & Document Vault', icon: FolderArchive },
      ]
    },
    {
      title: 'Intelligence & Admin',
      items: [
        { id: 'reports', label: 'Reports & Export Center', icon: BarChart3 },
        { id: 'ai-assistant', label: 'AI Risk & BOQ Estimator', icon: BrainCircuit, badge: 'AI', badgeColor: 'bg-sky-500/20 text-sky-400' },
        { id: 'users', label: 'Access Control & Audit', icon: UserCheck },
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col justify-between overflow-y-auto">
      <div className="py-4">
        {/* Company Header Card */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-850 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <HardHat className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                Apex Construction Ltd
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                NCA 1 Registered Contractor
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 px-3">
          {sections.map((sec) => (
            <div key={sec.title}>
              <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all text-left ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 dark:text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isActive
                              ? 'bg-slate-950/20 text-slate-950'
                              : item.badgeColor || 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Operational Compliance Badge */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Safety Safe-Hours</span>
            <span className="tabular-nums font-mono">148,200 hrs</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Zero LTI recorded in 182 days
          </div>
        </div>
      </div>
    </aside>
  );
};
