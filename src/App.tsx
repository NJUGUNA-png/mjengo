/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SiteFlowProvider, useSiteFlow } from './context/SiteFlowContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ProjectsModule } from './components/projects/ProjectsModule';
import { FinancialModule } from './components/financial/FinancialModule';
import { WorkforceModule } from './components/workforce/WorkforceModule';
import { InventoryModule } from './components/inventory/InventoryModule';
import { ProcurementModule } from './components/procurement/ProcurementModule';
import { TasksModule } from './components/tasks/TasksModule';
import { EquipmentModule } from './components/equipment/EquipmentModule';
import { SafetyModule } from './components/hse/SafetyModule';
import { QualityModule } from './components/qa/QualityModule';
import { DocumentsModule } from './components/documents/DocumentsModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { AIConstructionAssistant } from './components/ai/AIConstructionAssistant';
import { UserAccessModule } from './components/admin/UserAccessModule';

const MainLayout: React.FC = () => {
  const { activeTab } = useSiteFlow();

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverviewDashboard />;
      case 'projects':
        return <ProjectsModule />;
      case 'financial':
        return <FinancialModule />;
      case 'workforce':
        return <WorkforceModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'procurement':
        return <ProcurementModule />;
      case 'tasks':
        return <TasksModule />;
      case 'equipment':
        return <EquipmentModule />;
      case 'safety':
        return <SafetyModule />;
      case 'quality':
        return <QualityModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'reports':
        return <ReportsModule />;
      case 'ai-assistant':
        return <AIConstructionAssistant />;
      case 'users':
        return <UserAccessModule />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SiteFlowProvider>
      <MainLayout />
    </SiteFlowProvider>
  );
}
