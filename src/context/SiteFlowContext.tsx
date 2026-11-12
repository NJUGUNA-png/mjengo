import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  ExpenseRecord, 
  ContractorPaymentCertificate, 
  Worker, 
  AttendanceRecord, 
  MaterialItem, 
  InventoryTransaction, 
  Supplier, 
  PurchaseOrder, 
  SiteTask, 
  DailySiteReport, 
  Equipment, 
  SafetyIncident, 
  SafetyToolboxTalk, 
  QualityInspection, 
  NonConformanceReport, 
  ProjectDocument, 
  NotificationItem, 
  UserProfile, 
  AuditLogEntry, 
  CurrencyCode,
  UserRole
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_EXPENSES, 
  INITIAL_PAYMENT_CERTIFICATES, 
  INITIAL_WORKERS, 
  INITIAL_ATTENDANCE, 
  INITIAL_MATERIALS, 
  INITIAL_INVENTORY_TRANSACTIONS, 
  INITIAL_SUPPLIERS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_TASKS, 
  INITIAL_DAILY_REPORTS, 
  INITIAL_EQUIPMENT, 
  INITIAL_SAFETY_INCIDENTS, 
  INITIAL_TOOLBOX_TALKS, 
  INITIAL_QUALITY_INSPECTIONS, 
  INITIAL_NCRS, 
  INITIAL_DOCUMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

// Currency exchange rates relative to KES
const RATES: Record<CurrencyCode, number> = {
  KES: 1,
  USD: 1 / 130,
  EUR: 1 / 140,
  GBP: 1 / 165
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  KES: 'KES',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

interface SiteFlowContextType {
  // Navigation & Project Scope
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  currentProject: Project | undefined;
  
  // Theme & Currency
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatCurrency: (amountKES: number) => string;
  
  // Auth & RBAC
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  users: UserProfile[];
  toggleUserActive: (userId: string) => void;
  addUser: (user: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  
  // Data State
  projects: Project[];
  addProject: (p: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  archiveProject: (id: string) => void;
  
  expenses: ExpenseRecord[];
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  updateExpenseStatus: (id: string, status: ExpenseRecord['status']) => void;
  
  paymentCertificates: ContractorPaymentCertificate[];
  addCertificate: (cert: Omit<ContractorPaymentCertificate, 'id'>) => void;
  updateCertificateStatus: (id: string, status: ContractorPaymentCertificate['status']) => void;
  
  workers: Worker[];
  addWorker: (w: Omit<Worker, 'id'>) => void;
  updateWorkerStatus: (id: string, status: Worker['activeStatus']) => void;
  
  attendance: AttendanceRecord[];
  logAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  
  materials: MaterialItem[];
  addMaterial: (m: Omit<MaterialItem, 'id'>) => void;
  issueMaterialToSite: (materialId: string, quantity: number, projectId: string, refDoc: string) => { success: boolean; message: string };
  receiveStockGRN: (materialId: string, quantity: number, unitCostKES: number, grnRef: string) => void;
  inventoryTransactions: InventoryTransaction[];
  
  suppliers: Supplier[];
  addSupplier: (s: Omit<Supplier, 'id'>) => void;
  
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber'>) => void;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => void;
  
  tasks: SiteTask[];
  addTask: (t: Omit<SiteTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<SiteTask>) => void;
  
  dailyReports: DailySiteReport[];
  addDailyReport: (r: Omit<DailySiteReport, 'id' | 'reportNumber'>) => void;
  
  equipment: Equipment[];
  addEquipment: (e: Omit<Equipment, 'id'>) => void;
  updateEquipmentStatus: (id: string, status: Equipment['status']) => void;
  logEquipmentUsage: (id: string, hours: number, fuelLitres: number) => void;
  
  safetyIncidents: SafetyIncident[];
  addSafetyIncident: (inc: Omit<SafetyIncident, 'id' | 'incidentNumber'>) => void;
  updateSafetyIncidentStatus: (id: string, status: SafetyIncident['status']) => void;
  toolboxTalks: SafetyToolboxTalk[];
  addToolboxTalk: (talk: Omit<SafetyToolboxTalk, 'id'>) => void;
  
  qualityInspections: QualityInspection[];
  addQualityInspection: (insp: Omit<QualityInspection, 'id' | 'inspectionCode'>) => void;
  ncrs: NonConformanceReport[];
  addNCR: (ncr: Omit<NonConformanceReport, 'id' | 'ncrNumber'>) => void;
  updateNCRStatus: (id: string, status: NonConformanceReport['status']) => void;
  
  documents: ProjectDocument[];
  addDocument: (doc: Omit<ProjectDocument, 'id'>) => void;
  
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  auditLogs: AuditLogEntry[];
}

const SiteFlowContext = createContext<SiteFlowContextType | null>(null);

export const SiteFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currency, setCurrency] = useState<CurrencyCode>('KES');
  
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Eng. Brian Ochieng (PM)
  
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [paymentCertificates, setPaymentCertificates] = useState<ContractorPaymentCertificate[]>(INITIAL_PAYMENT_CERTIFICATES);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(INITIAL_INVENTORY_TRANSACTIONS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [tasks, setTasks] = useState<SiteTask[]>(INITIAL_TASKS);
  const [dailyReports, setDailyReports] = useState<DailySiteReport[]>(INITIAL_DAILY_REPORTS);
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [safetyIncidents, setSafetyIncidents] = useState<SafetyIncident[]>(INITIAL_SAFETY_INCIDENTS);
  const [toolboxTalks, setToolboxTalks] = useState<SafetyToolboxTalk[]>(INITIAL_TOOLBOX_TALKS);
  const [qualityInspections, setQualityInspections] = useState<QualityInspection[]>(INITIAL_QUALITY_INSPECTIONS);
  const [ncrs, setNcrs] = useState<NonConformanceReport[]>(INITIAL_NCRS);
  const [documents, setDocuments] = useState<ProjectDocument[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Sync theme with DOM document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const logAction = (action: string, module: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const formatCurrency = (amountKES: number): string => {
    const rate = RATES[currency];
    const converted = amountKES * rate;
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (currency === 'KES') {
      return `KES ${Math.round(converted).toLocaleString()}`;
    }
    return `${symbol} ${Math.round(converted).toLocaleString()}`;
  };

  const currentProject = selectedProjectId === 'ALL' 
    ? undefined 
    : projects.find(p => p.id === selectedProjectId);

  const switchUserRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      logAction('Role Switched', 'Authentication', `Switched active profile to ${matched.name} (${role})`);
    } else {
      // Mock switch if no exact user exists
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      logAction('Role Simulated', 'Authentication', `Switched active role to ${role}`);
    }
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      logAction('User Switched', 'Authentication', `Signed in as ${user.name} (${user.role})`);
    }
  };

  const toggleUserActive = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    logAction('User Status Changed', 'User Management', `Toggled active state for User ID ${userId}`);
  };

  const addUser = (newUser: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const user: UserProfile = {
      ...newUser,
      id: `USR-00${users.length + 1}`,
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setUsers(prev => [...prev, user]);
    logAction('User Registered', 'User Management', `Created account for ${user.name} (${user.role})`);
  };

  const addProject = (p: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...p,
      id: `PRJ-0${projects.length + 1}`
    };
    setProjects(prev => [newProj, ...prev]);
    logAction('Project Created', 'Projects', `Initialized new project: ${newProj.name} (${newProj.code})`);
    addNotification({
      type: 'System',
      title: 'New Project Initialized',
      message: `${newProj.name} has been set up with KES ${newProj.budgetKES.toLocaleString()} budget.`,
      severity: 'info',
      linkTarget: 'projects'
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logAction('Project Updated', 'Projects', `Updated project attributes for Project ID: ${id}`);
  };

  const archiveProject = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'Archived' } : p));
    logAction('Project Archived', 'Projects', `Archived project ID: ${id}`);
  };

  const addExpense = (expense: Omit<ExpenseRecord, 'id'>) => {
    const newExpense: ExpenseRecord = {
      ...expense,
      id: `EXP-${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);

    // Automatically update actual spent in project
    setProjects(prev => prev.map(p => {
      if (p.id === expense.projectId) {
        const newSpent = p.spentKES + expense.amountKES;
        // Check overspending
        if (newSpent > p.budgetKES) {
          addNotification({
            type: 'Budget',
            title: `Budget Overrun Alert: ${p.name}`,
            message: `Actual expenditure (KES ${newSpent.toLocaleString()}) has exceeded allocated budget (KES ${p.budgetKES.toLocaleString()}).`,
            severity: 'critical',
            linkTarget: 'financial'
          });
        }
        return { ...p, spentKES: newSpent };
      }
      return p;
    }));

    logAction('Expense Logged', 'Finance', `Recorded expense of KES ${expense.amountKES.toLocaleString()} to ${expense.vendorPayee}`);
  };

  const updateExpenseStatus = (id: string, status: ExpenseRecord['status']) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status, approvedBy: currentUser.name } : e));
    logAction('Expense Status Updated', 'Finance', `Expense ${id} marked as ${status} by ${currentUser.name}`);
  };

  const addCertificate = (cert: Omit<ContractorPaymentCertificate, 'id'>) => {
    const newCert: ContractorPaymentCertificate = {
      ...cert,
      id: `IPC-${Date.now()}`
    };
    setPaymentCertificates(prev => [newCert, ...prev]);
    logAction('Payment Certificate Issued', 'Finance', `Issued Interim Payment Certificate ${cert.certificateNo} for ${cert.contractorName}`);
  };

  const updateCertificateStatus = (id: string, status: ContractorPaymentCertificate['status']) => {
    setPaymentCertificates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    logAction('Certificate Status Updated', 'Finance', `Payment certificate ${id} marked as ${status}`);
  };

  const addWorker = (w: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...w,
      id: `WRK-0${workers.length + 1}`
    };
    setWorkers(prev => [...prev, newWorker]);
    logAction('Worker Registered', 'Workforce', `Enrolled operative: ${w.name} (${w.trade})`);
  };

  const updateWorkerStatus = (id: string, status: Worker['activeStatus']) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, activeStatus: status } : w));
    logAction('Worker Status Updated', 'Workforce', `Worker ID ${id} status set to ${status}`);
  };

  const logAttendance = (rec: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...rec,
      id: `ATT-${Date.now()}`
    };
    setAttendance(prev => [newRecord, ...prev]);
    logAction('Attendance Logged', 'Workforce', `Marked ${rec.status} for ${rec.workerName}`);
  };

  const addMaterial = (m: Omit<MaterialItem, 'id'>) => {
    const newMat: MaterialItem = {
      ...m,
      id: `MAT-0${materials.length + 1}`
    };
    setMaterials(prev => [...prev, newMat]);
    logAction('Material Catalogued', 'Inventory', `Registered material ${m.name} (${m.itemCode})`);
  };

  const issueMaterialToSite = (materialId: string, quantity: number, projId: string, refDoc: string) => {
    const item = materials.find(m => m.id === materialId);
    if (!item) return { success: false, message: 'Material item not found' };

    // Prevent negative stock!
    if (item.currentStock < quantity) {
      return { 
        success: false, 
        message: `Insufficient inventory: requested ${quantity} ${item.unit}, but only ${item.currentStock} ${item.unit} available in store.` 
      };
    }

    const newStock = Math.round((item.currentStock - quantity) * 100) / 100;
    
    // Update materials list
    setMaterials(prev => prev.map(m => m.id === materialId ? { ...m, currentStock: newStock } : m));

    // Record auditable inventory ledger transaction
    const tx: InventoryTransaction = {
      id: `TX-${Date.now()}`,
      materialId: item.id,
      materialName: item.name,
      projectId: projId,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'Issued to Site',
      quantity,
      unit: item.unit,
      unitCostKES: item.unitPriceKES,
      totalCostKES: quantity * item.unitPriceKES,
      balanceAfter: newStock,
      referenceDoc: refDoc,
      initiatedBy: currentUser.name
    };
    setInventoryTransactions(prev => [tx, ...prev]);

    // Check low stock alert
    if (newStock <= item.minThreshold) {
      addNotification({
        type: 'Inventory',
        title: `Low Stock Warning: ${item.name}`,
        message: `Stock level fell to ${newStock} ${item.unit} (Threshold: ${item.minThreshold} ${item.unit}). Reorder recommended.`,
        severity: 'warning',
        linkTarget: 'inventory'
      });
    }

    logAction('Material Issued', 'Inventory', `Issued ${quantity} ${item.unit} of ${item.name} to project ID ${projId}`);
    return { success: true, message: `Successfully issued ${quantity} ${item.unit}. Balance remaining: ${newStock} ${item.unit}.` };
  };

  const receiveStockGRN = (materialId: string, quantity: number, unitCostKES: number, grnRef: string) => {
    const item = materials.find(m => m.id === materialId);
    if (!item) return;

    const newStock = Math.round((item.currentStock + quantity) * 100) / 100;
    setMaterials(prev => prev.map(m => m.id === materialId ? { 
      ...m, 
      currentStock: newStock, 
      unitPriceKES: unitCostKES || m.unitPriceKES,
      lastRestocked: new Date().toISOString().substring(0, 10)
    } : m));

    const tx: InventoryTransaction = {
      id: `TX-${Date.now()}`,
      materialId: item.id,
      materialName: item.name,
      projectId: selectedProjectId === 'ALL' ? 'PRJ-01' : selectedProjectId,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'Goods Received (GRN)',
      quantity,
      unit: item.unit,
      unitCostKES,
      totalCostKES: quantity * unitCostKES,
      balanceAfter: newStock,
      referenceDoc: grnRef,
      initiatedBy: currentUser.name
    };
    setInventoryTransactions(prev => [tx, ...prev]);

    logAction('Goods Received', 'Inventory', `Received ${quantity} ${item.unit} of ${item.name} under ${grnRef}`);
  };

  const addSupplier = (s: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...s,
      id: `SUP-0${suppliers.length + 1}`
    };
    setSuppliers(prev => [...prev, newSup]);
    logAction('Supplier Registered', 'Procurement', `Added supplier: ${s.name}`);
  };

  const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    const poNum = `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 89).padStart(3, '0')}`;
    const newPO: PurchaseOrder = {
      ...po,
      id: `PO-${Date.now()}`,
      poNumber: poNum
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    logAction('PO Created', 'Procurement', `Generated Purchase Order ${poNum} for ${po.supplierName}`);
    addNotification({
      type: 'Procurement',
      title: `Purchase Order Created: ${poNum}`,
      message: `Total value KES ${po.totalAmountKES.toLocaleString()} submitted for authorization.`,
      severity: 'info',
      linkTarget: 'procurement'
    });
  };

  const updatePOStatus = (id: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, status, approvedBy: currentUser.name } : p));
    logAction('PO Status Updated', 'Procurement', `Purchase Order ${id} updated to ${status}`);
  };

  const addTask = (t: Omit<SiteTask, 'id'>) => {
    const newTask: SiteTask = {
      ...t,
      id: `TSK-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    logAction('Task Scheduled', 'Site Operations', `Created task: ${t.title} (Priority: ${t.priority})`);
  };

  const updateTask = (id: string, updates: Partial<SiteTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    logAction('Task Updated', 'Site Operations', `Updated task ID ${id}`);
  };

  const addDailyReport = (r: Omit<DailySiteReport, 'id' | 'reportNumber'>) => {
    const reportNum = `DSR-${new Date().getFullYear()}-${String(dailyReports.length + 146).padStart(3, '0')}`;
    const newReport: DailySiteReport = {
      ...r,
      id: `DSR-${Date.now()}`,
      reportNumber: reportNum
    };
    setDailyReports(prev => [newReport, ...prev]);
    logAction('Daily Site Report Filed', 'Site Operations', `Submitted ${reportNum} for ${r.projectName}`);
  };

  const addEquipment = (e: Omit<Equipment, 'id'>) => {
    const newEq: Equipment = {
      ...e,
      id: `EQ-0${equipment.length + 1}`
    };
    setEquipment(prev => [...prev, newEq]);
    logAction('Equipment Commissioned', 'Machinery', `Registered plant item: ${e.name} (${e.assetCode})`);
  };

  const updateEquipmentStatus = (id: string, status: Equipment['status']) => {
    setEquipment(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    logAction('Plant Status Changed', 'Machinery', `Asset ${id} status set to ${status}`);
  };

  const logEquipmentUsage = (id: string, hours: number, fuelLitres: number) => {
    setEquipment(prev => prev.map(e => e.id === id ? {
      ...e,
      operatingHours: e.operatingHours + hours,
      fuelTodayLitres: e.fuelTodayLitres + fuelLitres
    } : e));
    logAction('Plant Log Recorded', 'Machinery', `Logged ${hours} hrs and ${fuelLitres}L fuel for asset ${id}`);
  };

  const addSafetyIncident = (inc: Omit<SafetyIncident, 'id' | 'incidentNumber'>) => {
    const incNum = `INC-${new Date().getFullYear()}-${String(safetyIncidents.length + 10).padStart(3, '0')}`;
    const newInc: SafetyIncident = {
      ...inc,
      id: `INC-${Date.now()}`,
      incidentNumber: incNum
    };
    setSafetyIncidents(prev => [newInc, ...prev]);
    logAction('Safety Incident Logged', 'HSE', `Reported ${inc.severity} incident ${incNum}`);
    addNotification({
      type: 'Safety',
      title: `Safety Incident Logged: ${incNum}`,
      message: `${inc.severity} - ${inc.description.substring(0, 75)}...`,
      severity: inc.severity === 'Near Miss' ? 'warning' : 'critical',
      linkTarget: 'safety'
    });
  };

  const updateSafetyIncidentStatus = (id: string, status: SafetyIncident['status']) => {
    setSafetyIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    logAction('Incident Status Updated', 'HSE', `Incident ${id} updated to ${status}`);
  };

  const addToolboxTalk = (talk: Omit<SafetyToolboxTalk, 'id'>) => {
    const newTalk: SafetyToolboxTalk = {
      ...talk,
      id: `TBT-${Date.now()}`
    };
    setToolboxTalks(prev => [newTalk, ...prev]);
    logAction('Toolbox Talk Conducted', 'HSE', `Held briefing on "${talk.topic}" with ${talk.attendeesCount} attendees`);
  };

  const addQualityInspection = (insp: Omit<QualityInspection, 'id' | 'inspectionCode'>) => {
    const inspCode = `QA-KLM-${String(qualityInspections.length + 90).padStart(3, '0')}`;
    const newInsp: QualityInspection = {
      ...insp,
      id: `QA-${Date.now()}`,
      inspectionCode: inspCode
    };
    setQualityInspections(prev => [newInsp, ...prev]);
    logAction('QA Inspection Logged', 'Quality', `Recorded QA audit ${inspCode}: ${insp.result}`);
  };

  const addNCR = (ncr: Omit<NonConformanceReport, 'id' | 'ncrNumber'>) => {
    const ncrNum = `NCR-${new Date().getFullYear()}-${String(ncrs.length + 15).padStart(3, '0')}`;
    const newNcr: NonConformanceReport = {
      ...ncr,
      id: `NCR-${Date.now()}`,
      ncrNumber: ncrNum
    };
    setNcrs(prev => [newNcr, ...prev]);
    logAction('NCR Raised', 'Quality', `Raised Non-Conformance Report ${ncrNum} for ${ncr.responsibleParty}`);
  };

  const updateNCRStatus = (id: string, status: NonConformanceReport['status']) => {
    setNcrs(prev => prev.map(n => n.id === id ? { ...n, status } : n));
    logAction('NCR Status Updated', 'Quality', `NCR ${id} set to ${status}`);
  };

  const addDocument = (doc: Omit<ProjectDocument, 'id'>) => {
    const newDoc: ProjectDocument = {
      ...doc,
      id: `DOC-${Date.now()}`
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAction('Document Uploaded', 'Documents', `Uploaded ${doc.title} (${doc.version})`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <SiteFlowContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedProjectId,
      setSelectedProjectId,
      currentProject,
      theme,
      toggleTheme,
      currency,
      setCurrency,
      formatCurrency,
      currentUser,
      switchUserRole,
      switchUser,
      users,
      toggleUserActive,
      addUser,
      projects,
      addProject,
      updateProject,
      archiveProject,
      expenses,
      addExpense,
      updateExpenseStatus,
      paymentCertificates,
      addCertificate,
      updateCertificateStatus,
      workers,
      addWorker,
      updateWorkerStatus,
      attendance,
      logAttendance,
      materials,
      addMaterial,
      issueMaterialToSite,
      receiveStockGRN,
      inventoryTransactions,
      suppliers,
      addSupplier,
      purchaseOrders,
      addPurchaseOrder,
      updatePOStatus,
      tasks,
      addTask,
      updateTask,
      dailyReports,
      addDailyReport,
      equipment,
      addEquipment,
      updateEquipmentStatus,
      logEquipmentUsage,
      safetyIncidents,
      addSafetyIncident,
      updateSafetyIncidentStatus,
      toolboxTalks,
      addToolboxTalk,
      qualityInspections,
      addQualityInspection,
      ncrs,
      addNCR,
      updateNCRStatus,
      documents,
      addDocument,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      auditLogs
    }}>
      {children}
    </SiteFlowContext.Provider>
  );
};

export const useSiteFlow = () => {
  const context = useContext(SiteFlowContext);
  if (!context) {
    throw new Error('useSiteFlow must be used within a SiteFlowProvider');
  }
  return context;
};
