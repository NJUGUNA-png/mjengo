/**
 * SiteFlow - Core Enterprise Types & Domain Models
 * Kenyan Shillings (KES) default with multi-currency readiness
 */

export type CurrencyCode = 'KES' | 'USD' | 'EUR' | 'GBP';

export type UserRole = 
  | 'System Administrator'
  | 'Company Administrator'
  | 'Project Manager'
  | 'Site Manager'
  | 'Site Engineer'
  | 'Quantity Surveyor'
  | 'Finance Officer'
  | 'Procurement Officer'
  | 'Storekeeper'
  | 'Safety Officer'
  | 'Contractor'
  | 'General Worker';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  department: string;
  assignedProjectIds: string[];
  isActive: boolean;
  createdAt: string;
}

export type ProjectStatus = 'Planning' | 'Active' | 'Delayed' | 'On Hold' | 'Completed' | 'Archived';
export type ProjectCategory = 'Commercial' | 'Residential' | 'Infrastructure' | 'Industrial' | 'Institutional';

export interface ProjectPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  budgetAllocatedKES: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completionDate?: string;
  phaseId: string;
}

export interface Project {
  id: string;
  code: string; // e.g. "PRJ-NRB-101"
  name: string;
  client: string;
  location: string;
  county: string; // e.g. "Nairobi County", "Mombasa", "Nakuru"
  category: ProjectCategory;
  description: string;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  status: ProjectStatus;
  progress: number; // 0-100%
  budgetKES: number;
  spentKES: number;
  projectManager: string;
  leadEngineer: string;
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  delayDays: number;
  thumbnailUrl?: string;
}

export type ExpenseCategory = 'Materials' | 'Labour' | 'Equipment & Plant' | 'Subcontractor' | 'Transport & Logistics' | 'Overheads & Misc';

export interface ExpenseRecord {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  category: ExpenseCategory;
  vendorPayee: string;
  description: string;
  amountKES: number;
  status: 'Approved' | 'Pending Approval' | 'Rejected' | 'Paid';
  paymentMethod: 'Bank Transfer' | 'M-Pesa Business' | 'Cheque' | 'Petty Cash';
  invoiceRef: string;
  approvedBy?: string;
  receiptAttachment?: string;
}

export interface ContractorPaymentCertificate {
  id: string;
  certificateNo: string; // IPC-004
  projectId: string;
  contractorName: string;
  trade: string;
  grossAmountKES: number;
  retentionKES: number; // 5-10%
  taxDeductionKES: number; // e.g. 5% withholding
  netPayableKES: number;
  issueDate: string;
  dueDate: string;
  status: 'Certified' | 'Approved' | 'Paid' | 'Disputed';
  certifiedByQS: string;
}

export interface Worker {
  id: string;
  employeeId: string; // e.g. "EMP-504"
  name: string;
  phone: string;
  trade: string; // "Senior Mason", "Steel Fixer", "Electrician", "Crane Operator", "Surveyor", "Site Clerk"
  department: 'Civil Works' | 'Structural' | 'MEP Services' | 'Plant Operations' | 'Site Supervision' | 'Finishes';
  assignedProjectId: string;
  dailyRateKES: number;
  overtimeHourlyRateKES: number;
  type: 'Direct Employee' | 'Contract Labour' | 'Subcontractor Staff';
  nationalId: string;
  emergencyContact: string;
  activeStatus: 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
  safetyInductionDate: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Excused Leave';

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  projectId: string;
  date: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  overtimeHours: number;
  shift: 'Day Shift' | 'Night Shift';
}

export type MaterialCategory = 
  | 'Cement & Binders' 
  | 'Steel & Rebar' 
  | 'Aggregates & Sand' 
  | 'Masonry & Bricks' 
  | 'Plumbing & Drainage' 
  | 'Electrical & Conduits' 
  | 'Timber & Formwork' 
  | 'Finishes & Paint';

export interface MaterialItem {
  id: string;
  itemCode: string; // e.g. "MAT-CEM-01"
  name: string;
  category: MaterialCategory;
  unit: 'Bags (50kg)' | 'Tonnes' | 'Cubic Metres (m³)' | 'Pieces' | 'Meters' | 'Litres' | 'Rolls';
  currentStock: number;
  minThreshold: number;
  unitPriceKES: number;
  reorderLevel: number;
  warehouseLocation: string; // e.g. "Main Yard Bay 3", "Site Container A"
  lastRestocked: string;
}

export type InventoryTransactionType = 'Goods Received (GRN)' | 'Issued to Site' | 'Return to Store' | 'Scrap / Damaged';

export interface InventoryTransaction {
  id: string;
  materialId: string;
  materialName: string;
  projectId: string;
  date: string;
  type: InventoryTransactionType;
  quantity: number;
  unit: string;
  unitCostKES: number;
  totalCostKES: number;
  balanceAfter: number;
  referenceDoc: string; // e.g. "GRN-2026-104", "SITE-REQ-412"
  initiatedBy: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: MaterialCategory[];
  rating: number; // 1-5
  paymentTerms: string; // e.g. "30 Days Net", "50% Advance, Balance on Delivery"
  activeContractsCount: number;
}

export type PurchaseOrderStatus = 'Draft' | 'Submitted' | 'Approved' | 'In Transit' | 'Delivered' | 'Completed' | 'Cancelled';

export interface PurchaseOrderItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPriceKES: number;
  lineTotalKES: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. "PO-2026-088"
  supplierId: string;
  supplierName: string;
  projectId: string;
  projectName: string;
  createdDate: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotalKES: number;
  vatKES: number; // 16% in Kenya
  totalAmountKES: number;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
}

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Quality Review' | 'Completed' | 'Blocked';

export interface SiteTask {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  phaseId?: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  progressPercent: number;
  estimatedHours: number;
  actualHoursSpent: number;
  blockerReason?: string;
  tags: string[];
}

export interface DailySiteReport {
  id: string;
  reportNumber: string; // e.g. "DSR-2026-145"
  projectId: string;
  projectName: string;
  date: string;
  weather: 'Sunny & Clear (26°C)' | 'Overcast & Humid (22°C)' | 'Heavy Rainfall (Site Muddy)' | 'Windy / Dust Hazard';
  activeWorkersCount: number;
  activeEquipmentCount: number;
  workAccomplished: string;
  delaysAndIssues: string;
  safetyIncidentsRecorded: number;
  materialsDeliveredSummary: string;
  preparedBy: string;
  signedOffByResidentEngineer: boolean;
}

export type EquipmentStatus = 'Operational' | 'In Use' | 'Maintenance Required' | 'Under Service' | 'Breakdown / Down';

export interface Equipment {
  id: string;
  assetCode: string; // e.g. "PLANT-EXC-03"
  name: string;
  category: 'Excavators & Earthmoving' | 'Cranes & Hoists' | 'Concrete & Mixing' | 'Generators & Power' | 'Haulage & Trucks' | 'Compaction';
  modelYear: string;
  assignedProjectId: string;
  projectName: string;
  status: EquipmentStatus;
  operatingHours: number;
  fuelTodayLitres: number;
  hourlyRentalRateKES: number;
  lastServiceDate: string;
  nextServiceDueDate: string;
  operatorName: string;
  dailyCostKES: number;
}

export type IncidentSeverity = 'Near Miss' | 'Minor / First Aid' | 'Medical Treatment' | 'Lost Time Injury (LTI)' | 'Environmental Spill' | 'Equipment Damage';

export interface SafetyIncident {
  id: string;
  incidentNumber: string; // e.g. "INC-2026-012"
  projectId: string;
  projectName: string;
  date: string;
  time: string;
  severity: IncidentSeverity;
  locationOnSite: string;
  description: string;
  injuredPerson?: string;
  rootCause: string;
  immediateActionTaken: string;
  correctiveActionPlan: string;
  investigator: string;
  status: 'Under Investigation' | 'Corrective Action Pending' | 'Closed & Signed Off';
  daysLost: number;
}

export interface SafetyToolboxTalk {
  id: string;
  projectId: string;
  date: string;
  topic: string;
  attendeesCount: number;
  conductedBy: string;
  keyHazardsDiscussed: string[];
}

export interface QualityInspection {
  id: string;
  inspectionCode: string; // e.g. "QA-SLAB-204"
  projectId: string;
  elementChecked: string; // e.g. "Floor 4 Suspended Slab Rebar Spacing & Concrete Cover"
  inspectionDate: string;
  inspectorName: string;
  result: 'Passed' | 'Conditional Pass (Rectify before pour)' | 'Failed / Non-Conformance';
  defectsNoted: string[];
  reInspectionRequired: boolean;
  signOffEngineer: string;
}

export interface NonConformanceReport {
  id: string;
  ncrNumber: string; // e.g. "NCR-2026-031"
  projectId: string;
  dateRaised: string;
  clauseOrSpec: string; // e.g. "BS 8110 Clause 3.12 - Concrete Compressive Strength @ 28 Days"
  defectDescription: string;
  severity: 'Major' | 'Minor';
  disposition: 'Rework' | 'Reject & Demolish' | 'Accept As Is with Engineer Concurrence';
  correctiveActionDeadline: string;
  responsibleParty: string;
  status: 'Open' | 'Rectification in Progress' | 'Verified & Closed';
}

export type DocumentCategory = 
  | 'Architectural Drawings' 
  | 'Structural Drawings' 
  | 'MEP Engineering' 
  | 'Bills of Quantities (BOQ)' 
  | 'Statutory Permits (NCA/NEMA/County)' 
  | 'Contracts & Guarantees' 
  | 'Inspection Reports & QA' 
  | 'Site Photos';

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  category: DocumentCategory;
  fileName: string;
  version: string;
  fileSize: string;
  uploadedDate: string;
  uploadedBy: string;
  status: 'Current' | 'Superseded' | 'Draft';
  accessLevel: 'All Project Team' | 'Management Only' | 'Consultants & Engineers';
}

export interface NotificationItem {
  id: string;
  type: 'Budget' | 'Safety' | 'Task' | 'Inventory' | 'Procurement' | 'System';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: 'info' | 'warning' | 'critical' | 'success';
  linkTarget?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
}
