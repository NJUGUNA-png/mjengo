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
  AuditLogEntry 
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'USR-001',
    name: 'Eng. Njuguna Njoroge',
    email: 'engbrian01@gmail.com',
    phone: '+254 712 345 678',
    role: 'Project Manager',
    department: 'Project Delivery & Construction',
    assignedProjectIds: ['PRJ-01', 'PRJ-02'],
    isActive: true,
    createdAt: '2025-01-10'
  },
  {
    id: 'USR-002',
    name: 'Arch. Faith Mutua',
    email: 'faith.mutua@siteflow.co.ke',
    phone: '+254 722 890 123',
    role: 'Company Administrator',
    department: 'Executive Management',
    assignedProjectIds: ['PRJ-01', 'PRJ-02', 'PRJ-03', 'PRJ-04'],
    isActive: true,
    createdAt: '2025-01-05'
  },
  {
    id: 'USR-003',
    name: 'David Kimani, PE',
    email: 'd.kimani@siteflow.co.ke',
    phone: '+254 733 456 789',
    role: 'Site Engineer',
    department: 'Civil & Structural Engineering',
    assignedProjectIds: ['PRJ-01'],
    isActive: true,
    createdAt: '2025-02-01'
  },
  {
    id: 'USR-004',
    name: 'Catherine Njeri, BQS',
    email: 'catherine.qs@siteflow.co.ke',
    phone: '+254 799 112 233',
    role: 'Quantity Surveyor',
    department: 'Cost & Commercial Management',
    assignedProjectIds: ['PRJ-01', 'PRJ-02', 'PRJ-03'],
    isActive: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'USR-005',
    name: 'Moses Kiprotich, CPA',
    email: 'm.kiprotich@siteflow.co.ke',
    phone: '+254 720 998 877',
    role: 'Finance Officer',
    department: 'Finance & Treasury',
    assignedProjectIds: ['PRJ-01', 'PRJ-02', 'PRJ-03', 'PRJ-04'],
    isActive: true,
    createdAt: '2025-01-12'
  },
  {
    id: 'USR-006',
    name: 'Hassan Omar',
    email: 'hassan.safety@siteflow.co.ke',
    phone: '+254 711 554 433',
    role: 'Safety Officer',
    department: 'Health, Safety & Environment',
    assignedProjectIds: ['PRJ-01', 'PRJ-02'],
    isActive: true,
    createdAt: '2025-02-10'
  },
  {
    id: 'USR-007',
    name: 'Samuel Mwangi',
    email: 's.mwangi@siteflow.co.ke',
    phone: '+254 721 334 455',
    role: 'Storekeeper',
    department: 'Logistics & Inventory',
    assignedProjectIds: ['PRJ-01'],
    isActive: true,
    createdAt: '2025-02-15'
  },
  {
    id: 'USR-008',
    name: 'Karanja Mwangi',
    email: 'apex.contractors@gmail.com',
    phone: '+254 728 443 210',
    role: 'Contractor',
    department: 'External Subcontractors',
    assignedProjectIds: ['PRJ-01'],
    isActive: true,
    createdAt: '2025-03-01'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-01',
    code: 'PRJ-NRB-101',
    name: 'Kilimani Heights Executive Commercial Plaza',
    client: 'Acacia Real Estate Holdings Ltd',
    location: 'Argwings Kodhek Rd, Kilimani, Nairobi',
    county: 'Nairobi County',
    category: 'Commercial',
    description: '14-storey Grade-A commercial complex with 3 basement parking levels, post-tensioned slabs, solar curtain facade, and VRF HVAC systems.',
    startDate: '2025-08-01',
    targetCompletionDate: '2026-12-15',
    status: 'Active',
    progress: 64,
    budgetKES: 485000000, // KES 485M
    spentKES: 312450000,  // KES 312.45M
    projectManager: 'Eng. Brian Ochieng',
    leadEngineer: 'David Kimani, PE',
    riskLevel: 'Medium',
    delayDays: 6,
    phases: [
      { id: 'PH-1', name: 'Site Preparation & Excavation', startDate: '2025-08-01', endDate: '2025-10-15', progress: 100, status: 'Completed', budgetAllocatedKES: 45000000 },
      { id: 'PH-2', name: 'Substructure & 3 Basements', startDate: '2025-10-16', endDate: '2026-02-28', progress: 100, status: 'Completed', budgetAllocatedKES: 130000000 },
      { id: 'PH-3', name: 'Superstructure Framing (Levels 1-14)', startDate: '2026-03-01', endDate: '2026-07-30', progress: 58, status: 'In Progress', budgetAllocatedKES: 195000000 },
      { id: 'PH-4', name: 'MEP Services & Facade Glazing', startDate: '2026-06-01', endDate: '2026-10-15', progress: 20, status: 'In Progress', budgetAllocatedKES: 75000000 },
      { id: 'PH-5', name: 'Finishes, Testing & Commissioning', startDate: '2026-09-01', endDate: '2026-12-15', progress: 0, status: 'Pending', budgetAllocatedKES: 40000000 },
    ],
    milestones: [
      { id: 'M-1', title: 'Deep Basement Retaining Wall Piling Sign-off', dueDate: '2025-10-10', completed: true, completionDate: '2025-10-08', phaseId: 'PH-1' },
      { id: 'M-2', title: 'Basement Level 1 Ground Slab Pour Completed', dueDate: '2026-02-20', completed: true, completionDate: '2026-02-18', phaseId: 'PH-2' },
      { id: 'M-3', title: 'Level 8 Suspended Slab Casting (50% Structural Height)', dueDate: '2026-05-15', completed: false, phaseId: 'PH-3' },
      { id: 'M-4', title: 'Top-out Ceremony (Floor 14 Roof Slab)', dueDate: '2026-07-30', completed: false, phaseId: 'PH-3' },
      { id: 'M-5', title: 'Practical Handover & Occupancy Permit (NCA/NCC)', dueDate: '2026-12-15', completed: false, phaseId: 'PH-5' }
    ]
  },
  {
    id: 'PRJ-02',
    code: 'PRJ-MBA-204',
    name: 'Mombasa Port Inland Container Depot Logistics Warehouse',
    client: 'Kenya Coastal Logistics Authority',
    location: 'Airport Road, Changamwe, Mombasa',
    county: 'Mombasa County',
    category: 'Industrial',
    description: 'Heavy-duty steel portal frame logistics warehouse of 28,000m² with laser-screed superflat fiber-reinforced industrial flooring and container hardstand yards.',
    startDate: '2025-11-15',
    targetCompletionDate: '2026-08-30',
    status: 'Active',
    progress: 78,
    budgetKES: 260000000,
    spentKES: 198200000,
    projectManager: 'Eng. Brian Ochieng',
    leadEngineer: 'Amina Kassim',
    riskLevel: 'Low',
    delayDays: 0,
    phases: [
      { id: 'PH-B1', name: 'Subgrade Stabilization & Earthworks', startDate: '2025-11-15', endDate: '2026-01-10', progress: 100, status: 'Completed', budgetAllocatedKES: 38000000 },
      { id: 'PH-B2', name: 'Structural Steel Erection & Gantry Rails', startDate: '2026-01-11', endDate: '2026-04-15', progress: 95, status: 'In Progress', budgetAllocatedKES: 110000000 },
      { id: 'PH-B3', name: 'Superflat Floor Slab & External Pavements', startDate: '2026-03-01', endDate: '2026-06-30', progress: 65, status: 'In Progress', budgetAllocatedKES: 72000000 },
      { id: 'PH-B4', name: 'Dock Levelers & Cold Storage Installation', startDate: '2026-06-01', endDate: '2026-08-30', progress: 10, status: 'Pending', budgetAllocatedKES: 40000000 },
    ],
    milestones: [
      { id: 'MB-1', title: 'Portal Trusses Erection Complete', dueDate: '2026-04-01', completed: true, completionDate: '2026-03-28', phaseId: 'PH-B2' },
      { id: 'MB-2', title: 'Laser Screed Bay 1-4 Slab Pour', dueDate: '2026-05-10', completed: false, phaseId: 'PH-B3' },
      { id: 'MB-3', title: 'Final Handover to Logistics Operator', dueDate: '2026-08-30', completed: false, phaseId: 'PH-B4' }
    ]
  },
  {
    id: 'PRJ-03',
    code: 'PRJ-NAI-089',
    name: 'Naivasha Geothermal Eco-Resort & Spa',
    client: 'Great Rift Escapes Ltd',
    location: 'Moi South Lake Rd, Naivasha',
    county: 'Nakuru County',
    category: 'Commercial',
    description: '45 luxury timber and natural volcanic stone villas, central reception clubhouse, heated geothermal infinity pools, and zero-discharge wastewater facility.',
    startDate: '2025-06-01',
    targetCompletionDate: '2026-04-30',
    status: 'Delayed',
    progress: 82,
    budgetKES: 175000000,
    spentKES: 161800000,
    projectManager: 'Peter Ndegwa',
    leadEngineer: 'Samuel Otieno',
    riskLevel: 'High',
    delayDays: 24,
    phases: [
      { id: 'PH-C1', name: 'Foundations & Geothermal Well Hookups', startDate: '2025-06-01', endDate: '2025-09-30', progress: 100, status: 'Completed', budgetAllocatedKES: 42000000 },
      { id: 'PH-C2', name: 'Villa Timber & Stone Superstructure', startDate: '2025-10-01', endDate: '2026-02-15', progress: 90, status: 'Completed', budgetAllocatedKES: 68000000 },
      { id: 'PH-C3', name: 'Geothermal Pool Piping & Interior Joinery', startDate: '2026-02-16', endDate: '2026-05-20', progress: 55, status: 'Delayed', budgetAllocatedKES: 65000000 },
    ],
    milestones: [
      { id: 'MC-1', title: 'Sample Villa 01 Furnishing Sign-off', dueDate: '2026-01-15', completed: true, completionDate: '2026-01-20', phaseId: 'PH-C2' },
      { id: 'MC-2', title: 'Geothermal Heat Exchanger Pressure Test', dueDate: '2026-03-30', completed: false, phaseId: 'PH-C3' }
    ]
  },
  {
    id: 'PRJ-04',
    code: 'PRJ-KSM-302',
    name: 'Kisumu Lakeside Trauma & Specialist Hospital',
    client: 'Lake Basin Health Trust',
    location: 'Milimani Estate, Kisumu',
    county: 'Kisumu County',
    category: 'Institutional',
    description: '120-bed hospital wing featuring 4 modern surgical theatres, ICU ward, oxygen generation plant, and radiology unit.',
    startDate: '2026-01-10',
    targetCompletionDate: '2027-03-31',
    status: 'Active',
    progress: 32,
    budgetKES: 340000000,
    spentKES: 98400000,
    projectManager: 'Dr. Joseph Nyaga',
    leadEngineer: 'Eng. Brian Ochieng',
    riskLevel: 'Low',
    delayDays: 0,
    phases: [
      { id: 'PH-D1', name: 'Substructure & Radiation Shielded Bunker', startDate: '2026-01-10', endDate: '2026-04-30', progress: 85, status: 'In Progress', budgetAllocatedKES: 85000000 },
      { id: 'PH-D2', name: 'Main Ward 4-Storey Framing', startDate: '2026-05-01', endDate: '2026-09-30', progress: 0, status: 'Pending', budgetAllocatedKES: 125000000 },
      { id: 'PH-D3', name: 'Medical Gases & Cleanroom MEP', startDate: '2026-09-01', endDate: '2027-01-15', progress: 0, status: 'Pending', budgetAllocatedKES: 95000000 },
      { id: 'PH-D4', name: 'Equipping & Commissioning', startDate: '2027-01-16', endDate: '2027-03-31', progress: 0, status: 'Pending', budgetAllocatedKES: 35000000 }
    ],
    milestones: [
      { id: 'MD-1', title: 'Linear Accelerator Heavy Concrete Shielding Verified', dueDate: '2026-04-15', completed: false, phaseId: 'PH-D1' }
    ]
  }
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'EXP-101',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-11-04',
    category: 'Materials',
    vendorPayee: 'Bamburi Cement PLC',
    description: 'Bulk delivery of 600 bags (30 Tonnes) PowerPlus 42.5N Cement for Level 8 Pour',
    amountKES: 492000,
    status: 'Approved',
    paymentMethod: 'Bank Transfer',
    invoiceRef: 'INV-BAM-8842',
    approvedBy: 'Moses Kiprotich, CPA'
  },
  {
    id: 'EXP-102',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-11-03',
    category: 'Equipment & Plant',
    vendorPayee: 'Simba Plant Hire Ltd',
    description: '14-day hire of Potain Tower Crane 50m jib and mobile concrete boom pump',
    amountKES: 840000,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    invoiceRef: 'SPH-CRN-991',
    approvedBy: 'Moses Kiprotich, CPA'
  },
  {
    id: 'EXP-103',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-11-02',
    category: 'Labour',
    vendorPayee: 'Site Casual Labour Payroll (Week 44)',
    description: 'Fortnightly muster roll disbursement for 84 direct artisans and helpers',
    amountKES: 1145000,
    status: 'Paid',
    paymentMethod: 'M-Pesa Business',
    invoiceRef: 'PAY-WK44-KLM',
    approvedBy: 'Eng. Brian Ochieng'
  },
  {
    id: 'EXP-104',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-11-01',
    category: 'Materials',
    vendorPayee: 'Devki Steel Mills Ltd',
    description: '45 Tonnes of D16 and D20 High-Yield Deformed Rebar for columns and beams',
    amountKES: 4725000,
    status: 'Approved',
    paymentMethod: 'Bank Transfer',
    invoiceRef: 'DVK-ST-3301',
    approvedBy: 'Moses Kiprotich, CPA'
  },
  {
    id: 'EXP-105',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-10-28',
    category: 'Subcontractor',
    vendorPayee: 'Apex Electrical & MEP Services Ltd',
    description: 'Interim Milestone 2: Conduit rough-in on Basements B1, B2 & Ground Floor',
    amountKES: 2650000,
    status: 'Pending Approval',
    paymentMethod: 'Bank Transfer',
    invoiceRef: 'APX-MEP-012',
    approvedBy: 'Catherine Njeri, BQS'
  },
  {
    id: 'EXP-106',
    projectId: 'PRJ-02',
    projectName: 'Mombasa Port Inland Container Depot Logistics Warehouse',
    date: '2026-11-02',
    category: 'Materials',
    vendorPayee: 'Tononoka Rolling Mills',
    description: 'Galvanized I-Beam structural sections and roof purlins',
    amountKES: 3400000,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    invoiceRef: 'TNK-9081'
  },
  {
    id: 'EXP-107',
    projectId: 'PRJ-03',
    projectName: 'Naivasha Geothermal Eco-Resort & Spa',
    date: '2026-10-30',
    category: 'Transport & Logistics',
    vendorPayee: 'Rift Freight Hauliers',
    description: 'Haulage of treated eucalyptus timber trusses from Eldoret timber yards',
    amountKES: 380000,
    status: 'Approved',
    paymentMethod: 'M-Pesa Business',
    invoiceRef: 'RFH-441'
  }
];

export const INITIAL_PAYMENT_CERTIFICATES: ContractorPaymentCertificate[] = [
  {
    id: 'IPC-01',
    certificateNo: 'IPC-KLM-005',
    projectId: 'PRJ-01',
    contractorName: 'Apex Electrical & MEP Services Ltd',
    trade: 'Electrical & Fire Alarm Subcontractor',
    grossAmountKES: 3800000,
    retentionKES: 380000, // 10% retention
    taxDeductionKES: 190000, // 5% withholding
    netPayableKES: 3230000,
    issueDate: '2026-10-25',
    dueDate: '2026-11-20',
    status: 'Approved',
    certifiedByQS: 'Catherine Njeri, BQS'
  },
  {
    id: 'IPC-02',
    certificateNo: 'IPC-KLM-006',
    projectId: 'PRJ-01',
    contractorName: 'SolidWorks Formwork Specialists',
    trade: 'Specialized Formwork & Shoring',
    grossAmountKES: 5200000,
    retentionKES: 520000,
    taxDeductionKES: 260000,
    netPayableKES: 4420000,
    issueDate: '2026-11-01',
    dueDate: '2026-11-25',
    status: 'Certified',
    certifiedByQS: 'Catherine Njeri, BQS'
  },
  {
    id: 'IPC-03',
    certificateNo: 'IPC-MBA-003',
    projectId: 'PRJ-02',
    contractorName: 'Coastal Steel Erectors Ltd',
    trade: 'Structural Rigging & Cranage',
    grossAmountKES: 6800000,
    retentionKES: 680000,
    taxDeductionKES: 340000,
    netPayableKES: 5780000,
    issueDate: '2026-10-15',
    dueDate: '2026-11-10',
    status: 'Paid',
    certifiedByQS: 'Catherine Njeri, BQS'
  }
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'WRK-01',
    employeeId: 'SF-ART-101',
    name: 'Josephat Maina',
    phone: '+254 712 111 222',
    trade: 'Master Mason / Foreman',
    department: 'Civil Works',
    assignedProjectId: 'PRJ-01',
    dailyRateKES: 2500,
    overtimeHourlyRateKES: 450,
    type: 'Direct Employee',
    nationalId: '24891044',
    emergencyContact: 'Mary Wanjiku (+254 712 999 000)',
    activeStatus: 'Active',
    safetyInductionDate: '2025-08-02'
  },
  {
    id: 'WRK-02',
    employeeId: 'SF-ART-102',
    name: 'Kennedy Oduor',
    phone: '+254 723 333 444',
    trade: 'Lead Steel Fixer',
    department: 'Structural',
    assignedProjectId: 'PRJ-01',
    dailyRateKES: 2400,
    overtimeHourlyRateKES: 420,
    type: 'Direct Employee',
    nationalId: '29881122',
    emergencyContact: 'Florence Akoth (+254 723 888 777)',
    activeStatus: 'Active',
    safetyInductionDate: '2025-08-02'
  },
  {
    id: 'WRK-03',
    employeeId: 'SF-ART-103',
    name: 'Peter Waweru',
    phone: '+254 734 555 666',
    trade: 'Tower Crane Operator (Certified)',
    department: 'Plant Operations',
    assignedProjectId: 'PRJ-01',
    dailyRateKES: 4000,
    overtimeHourlyRateKES: 700,
    type: 'Direct Employee',
    nationalId: '22119043',
    emergencyContact: 'Grace Muthoni (+254 734 111 000)',
    activeStatus: 'Active',
    safetyInductionDate: '2025-08-05'
  },
  {
    id: 'WRK-04',
    employeeId: 'SF-ART-104',
    name: 'Wilson Cheruiyot',
    phone: '+254 715 777 888',
    trade: 'Site Surveyor / Levelling Tech',
    department: 'Site Supervision',
    assignedProjectId: 'PRJ-01',
    dailyRateKES: 3200,
    overtimeHourlyRateKES: 550,
    type: 'Direct Employee',
    nationalId: '31049921',
    emergencyContact: 'Beatrice Chepkoech (+254 715 444 333)',
    activeStatus: 'Active',
    safetyInductionDate: '2025-08-02'
  },
  {
    id: 'WRK-05',
    employeeId: 'SF-ART-105',
    name: 'Titus Mutiso',
    phone: '+254 726 999 000',
    trade: 'Carpentry & Formwork Chargehand',
    department: 'Structural',
    assignedProjectId: 'PRJ-01',
    dailyRateKES: 2200,
    overtimeHourlyRateKES: 380,
    type: 'Contract Labour',
    nationalId: '27743901',
    emergencyContact: 'Agnes Mumbua (+254 726 123 456)',
    activeStatus: 'Active',
    safetyInductionDate: '2025-09-01'
  },
  {
    id: 'WRK-06',
    employeeId: 'SF-ART-106',
    name: 'Ezekiel Omwamba',
    phone: '+254 717 222 333',
    trade: 'Heavy Excavator Operator',
    department: 'Plant Operations',
    assignedProjectId: 'PRJ-02',
    dailyRateKES: 3500,
    overtimeHourlyRateKES: 600,
    type: 'Direct Employee',
    nationalId: '26330911',
    emergencyContact: 'Jane Moraa (+254 717 654 321)',
    activeStatus: 'Active',
    safetyInductionDate: '2025-11-16'
  },
  {
    id: 'WRK-07',
    employeeId: 'SF-ART-107',
    name: 'Dennis Kiptoo',
    phone: '+254 728 555 111',
    trade: 'Plumber & Fire Pipe Fitter',
    department: 'MEP Services',
    assignedProjectId: 'PRJ-01',
    dailyRateKES: 2300,
    overtimeHourlyRateKES: 400,
    type: 'Contract Labour',
    nationalId: '32001945',
    emergencyContact: 'Gladys Jepchirchir (+254 728 987 654)',
    activeStatus: 'On Leave',
    safetyInductionDate: '2025-08-10'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'ATT-1',
    workerId: 'WRK-01',
    workerName: 'Josephat Maina',
    projectId: 'PRJ-01',
    date: '2026-11-06',
    status: 'Present',
    checkIn: '06:45',
    checkOut: '17:15',
    hoursWorked: 9.5,
    overtimeHours: 1.5,
    shift: 'Day Shift'
  },
  {
    id: 'ATT-2',
    workerId: 'WRK-02',
    workerName: 'Kennedy Oduor',
    projectId: 'PRJ-01',
    date: '2026-11-06',
    status: 'Present',
    checkIn: '06:50',
    checkOut: '17:00',
    hoursWorked: 9.0,
    overtimeHours: 1.0,
    shift: 'Day Shift'
  },
  {
    id: 'ATT-3',
    workerId: 'WRK-03',
    workerName: 'Peter Waweru',
    projectId: 'PRJ-01',
    date: '2026-11-06',
    status: 'Present',
    checkIn: '06:30',
    checkOut: '18:00',
    hoursWorked: 10.5,
    overtimeHours: 2.5,
    shift: 'Day Shift'
  },
  {
    id: 'ATT-4',
    workerId: 'WRK-04',
    workerName: 'Wilson Cheruiyot',
    projectId: 'PRJ-01',
    date: '2026-11-06',
    status: 'Present',
    checkIn: '07:10',
    checkOut: '16:45',
    hoursWorked: 8.5,
    overtimeHours: 0.5,
    shift: 'Day Shift'
  },
  {
    id: 'ATT-5',
    workerId: 'WRK-05',
    workerName: 'Titus Mutiso',
    projectId: 'PRJ-01',
    date: '2026-11-06',
    status: 'Late',
    checkIn: '08:15',
    checkOut: '17:00',
    hoursWorked: 7.75,
    overtimeHours: 0,
    shift: 'Day Shift'
  },
  {
    id: 'ATT-6',
    workerId: 'WRK-07',
    workerName: 'Dennis Kiptoo',
    projectId: 'PRJ-01',
    date: '2026-11-06',
    status: 'Excused Leave',
    checkIn: '-',
    checkOut: '-',
    hoursWorked: 0,
    overtimeHours: 0,
    shift: 'Day Shift'
  }
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 'MAT-01',
    itemCode: 'MAT-CEM-01',
    name: 'Bamburi PowerPlus 42.5N High Strength Cement',
    category: 'Cement & Binders',
    unit: 'Bags (50kg)',
    currentStock: 1450,
    minThreshold: 400,
    unitPriceKES: 820,
    reorderLevel: 500,
    warehouseLocation: 'Kilimani Site Store Bay A',
    lastRestocked: '2026-11-04'
  },
  {
    id: 'MAT-02',
    itemCode: 'MAT-STL-16',
    name: 'Devki D16 High-Yield Deformed Rebar BS 4449',
    category: 'Steel & Rebar',
    unit: 'Tonnes',
    currentStock: 14.2,
    minThreshold: 20.0, // Low stock trigger!
    unitPriceKES: 105000,
    reorderLevel: 25.0,
    warehouseLocation: 'Kilimani Central Rebar Yard',
    lastRestocked: '2026-10-24'
  },
  {
    id: 'MAT-03',
    itemCode: 'MAT-STL-20',
    name: 'Devki D20 Heavy Column Rebar BS 4449',
    category: 'Steel & Rebar',
    unit: 'Tonnes',
    currentStock: 32.5,
    minThreshold: 15.0,
    unitPriceKES: 106500,
    reorderLevel: 20.0,
    warehouseLocation: 'Kilimani Central Rebar Yard',
    lastRestocked: '2026-11-01'
  },
  {
    id: 'MAT-04',
    itemCode: 'MAT-SND-01',
    name: 'Clean River Sand (Machakos/Naivasha Grade 1)',
    category: 'Aggregates & Sand',
    unit: 'Tonnes',
    currentStock: 180,
    minThreshold: 60,
    unitPriceKES: 2200,
    reorderLevel: 80,
    warehouseLocation: 'Batching Plant Aggregate Bunker 1',
    lastRestocked: '2026-11-03'
  },
  {
    id: 'MAT-05',
    itemCode: 'MAT-BLT-20',
    name: 'Machine-Crushed Ballast 20mm Blue Metal',
    category: 'Aggregates & Sand',
    unit: 'Tonnes',
    currentStock: 240,
    minThreshold: 75,
    unitPriceKES: 2450,
    reorderLevel: 100,
    warehouseLocation: 'Batching Plant Aggregate Bunker 2',
    lastRestocked: '2026-11-02'
  },
  {
    id: 'MAT-06',
    itemCode: 'MAT-MSN-09',
    name: 'Ndarugu Machine Cut Quarry Stones 9"x9"',
    category: 'Masonry & Bricks',
    unit: 'Pieces',
    currentStock: 3800,
    minThreshold: 1200,
    unitPriceKES: 62,
    reorderLevel: 1500,
    warehouseLocation: 'Kilimani North Perimeter Staging',
    lastRestocked: '2026-10-29'
  },
  {
    id: 'MAT-07',
    itemCode: 'MAT-TMB-PLY',
    name: 'Marine Plywood 18mm Film-Faced Formwork Board',
    category: 'Timber & Formwork',
    unit: 'Pieces',
    currentStock: 280,
    minThreshold: 80,
    unitPriceKES: 3400,
    reorderLevel: 100,
    warehouseLocation: 'Joinery & Shoring Shed',
    lastRestocked: '2026-10-20'
  },
  {
    id: 'MAT-08',
    itemCode: 'MAT-ELC-CND',
    name: 'Heavy Duty PVC Electrical Conduit 25mm (3m)',
    category: 'Electrical & Conduits',
    unit: 'Pieces',
    currentStock: 950,
    minThreshold: 200,
    unitPriceKES: 190,
    reorderLevel: 300,
    warehouseLocation: 'MEP Secured Container B',
    lastRestocked: '2026-11-05'
  }
];

export const INITIAL_INVENTORY_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: 'TX-501',
    materialId: 'MAT-01',
    materialName: 'Bamburi PowerPlus 42.5N High Strength Cement',
    projectId: 'PRJ-01',
    date: '2026-11-04 14:30',
    type: 'Goods Received (GRN)',
    quantity: 600,
    unit: 'Bags (50kg)',
    unitCostKES: 820,
    totalCostKES: 492000,
    balanceAfter: 1450,
    referenceDoc: 'GRN-2026-089',
    initiatedBy: 'Samuel Mwangi (Storekeeper)'
  },
  {
    id: 'TX-502',
    materialId: 'MAT-02',
    materialName: 'Devki D16 High-Yield Deformed Rebar BS 4449',
    projectId: 'PRJ-01',
    date: '2026-11-05 09:15',
    type: 'Issued to Site',
    quantity: 6.5,
    unit: 'Tonnes',
    unitCostKES: 105000,
    totalCostKES: 682500,
    balanceAfter: 14.2,
    referenceDoc: 'SITE-REQ-301 (Level 8 Columns)',
    initiatedBy: 'Kennedy Oduor (Lead Steel Fixer)'
  },
  {
    id: 'TX-503',
    materialId: 'MAT-06',
    materialName: 'Ndarugu Machine Cut Quarry Stones 9"x9"',
    projectId: 'PRJ-01',
    date: '2026-11-05 16:00',
    type: 'Issued to Site',
    quantity: 500,
    unit: 'Pieces',
    unitCostKES: 62,
    totalCostKES: 31000,
    balanceAfter: 3800,
    referenceDoc: 'SITE-REQ-302 (Basement B1 Partitioning)',
    initiatedBy: 'Josephat Maina (Foreman)'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-01',
    code: 'SUP-BAM-01',
    name: 'Bamburi Cement PLC',
    contactPerson: 'David Kilonzo (Key Accounts)',
    email: 'commercial.sales@bamburi.lafarge.com',
    phone: '+254 722 201 000',
    address: 'Corporate Office, Kitui Road, Industrial Area, Nairobi',
    categories: ['Cement & Binders'],
    rating: 4.9,
    paymentTerms: '30 Days Net on LPO',
    activeContractsCount: 3
  },
  {
    id: 'SUP-02',
    code: 'SUP-DVK-02',
    name: 'Devki Steel Mills Ltd',
    contactPerson: 'Pritesh Shah (Commercial Director)',
    email: 'orders@devkigroup.com',
    phone: '+254 733 600 500',
    address: 'Ruiru Plant, Nairobi-Thika Superhighway',
    categories: ['Steel & Rebar'],
    rating: 4.8,
    paymentTerms: '50% Advance, 50% upon Mill Certificate Delivery',
    activeContractsCount: 4
  },
  {
    id: 'SUP-03',
    code: 'SUP-MK-03',
    name: 'Machakos River Sand & Aggregates Ltd',
    contactPerson: 'Boniface Mutua',
    email: 'sales@machakosaggregates.co.ke',
    phone: '+254 711 889 900',
    address: 'Mlolongo Depot, Mombasa Road',
    categories: ['Aggregates & Sand'],
    rating: 4.5,
    paymentTerms: 'Cash on Weighbridge Slip',
    activeContractsCount: 2
  },
  {
    id: 'SUP-04',
    code: 'SUP-CRW-04',
    name: 'Crown Paints Kenya PLC',
    contactPerson: 'Sylvia Wanjiku',
    email: 'projects@crownpaints.co.ke',
    phone: '+254 709 887 000',
    address: 'Likoni Road, Industrial Area, Nairobi',
    categories: ['Finishes & Paint'],
    rating: 4.7,
    paymentTerms: '45 Days Trade Credit',
    activeContractsCount: 1
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-01',
    poNumber: 'PO-2026-088',
    supplierId: 'SUP-02',
    supplierName: 'Devki Steel Mills Ltd',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    createdDate: '2026-11-05',
    expectedDeliveryDate: '2026-11-10',
    status: 'Approved',
    items: [
      {
        materialId: 'MAT-02',
        materialName: 'Devki D16 High-Yield Deformed Rebar BS 4449',
        quantity: 25,
        unit: 'Tonnes',
        unitPriceKES: 105000,
        lineTotalKES: 2625000
      },
      {
        materialId: 'MAT-03',
        materialName: 'Devki D20 Heavy Column Rebar BS 4449',
        quantity: 20,
        unit: 'Tonnes',
        unitPriceKES: 106500,
        lineTotalKES: 2130000
      }
    ],
    subtotalKES: 4755000,
    vatKES: 760800, // 16% VAT
    totalAmountKES: 5515800,
    requestedBy: 'Catherine Njeri, BQS',
    approvedBy: 'Moses Kiprotich, CPA',
    notes: 'Urgent re-order due to low rebar stock threshold before Level 9 slab casting.'
  },
  {
    id: 'PO-02',
    poNumber: 'PO-2026-087',
    supplierId: 'SUP-01',
    supplierName: 'Bamburi Cement PLC',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    createdDate: '2026-11-02',
    expectedDeliveryDate: '2026-11-04',
    status: 'Delivered',
    items: [
      {
        materialId: 'MAT-01',
        materialName: 'Bamburi PowerPlus 42.5N High Strength Cement',
        quantity: 600,
        unit: 'Bags (50kg)',
        unitPriceKES: 820,
        lineTotalKES: 492000
      }
    ],
    subtotalKES: 492000,
    vatKES: 78720,
    totalAmountKES: 570720,
    requestedBy: 'David Kimani, PE',
    approvedBy: 'Moses Kiprotich, CPA',
    notes: 'GRN-2026-089 issued on delivery.'
  }
];

export const INITIAL_TASKS: SiteTask[] = [
  {
    id: 'TSK-101',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    title: 'Reinforcement Fixing & Spacing Inspection for Floor 8 Slab',
    description: 'Ensure double-layer mesh reinforcement satisfies structural drawing S-08/REV-C with 25mm concrete cover blocks in position.',
    assignedTo: 'Kennedy Oduor (Lead Steel Fixer)',
    priority: 'Critical',
    status: 'Quality Review',
    startDate: '2026-11-03',
    dueDate: '2026-11-07',
    progressPercent: 90,
    estimatedHours: 40,
    actualHoursSpent: 36,
    tags: ['Structural', 'Rebar', 'Sign-off']
  },
  {
    id: 'TSK-102',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    title: 'Post-Tension Tendons Duct Laying & Anchorage Blockout',
    description: 'Install PT flat ducts across grid lines A-F as per BBR VT International specification.',
    assignedTo: 'Apex Specialized Post-Tensioning',
    priority: 'High',
    status: 'In Progress',
    startDate: '2026-11-04',
    dueDate: '2026-11-08',
    progressPercent: 60,
    estimatedHours: 32,
    actualHoursSpent: 20,
    tags: ['PT Slabs', 'Specialized']
  },
  {
    id: 'TSK-103',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    title: 'Fire Protection Riser Pipe Hydrostatic Pressure Testing',
    description: 'Pressure test 100mm wet riser mains from Basement B3 up to Floor 6 at 15 bar for 2 hours.',
    assignedTo: 'Dennis Kiptoo (Plumbing)',
    priority: 'High',
    status: 'Blocked',
    startDate: '2026-11-02',
    dueDate: '2026-11-06',
    progressPercent: 40,
    estimatedHours: 24,
    actualHoursSpent: 12,
    blockerReason: 'Awaiting replacement of faulty calibrated test pressure gauge from supplier.',
    tags: ['MEP', 'Fire Safety', 'Inspection']
  },
  {
    id: 'TSK-104',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    title: 'Concrete Ready-Mix Slump & Cube Casting (C35/45)',
    description: 'Mobilize 18 transit mixers from Lafarge batching plant for continuous 180m³ pour starting 05:00 AM.',
    assignedTo: 'David Kimani, PE',
    priority: 'Critical',
    status: 'Not Started',
    startDate: '2026-11-08',
    dueDate: '2026-11-09',
    progressPercent: 0,
    estimatedHours: 16,
    actualHoursSpent: 0,
    tags: ['Concrete Pour', 'Quality Testing']
  },
  {
    id: 'TSK-105',
    projectId: 'PRJ-02',
    projectName: 'Mombasa Port Inland Container Depot Logistics Warehouse',
    title: 'Laser Screed Industrial Flooring Strip C Pouring',
    description: 'Placement of steel-fiber concrete with Somero S-22EZ laser screed with dry-shake quartz hardener.',
    assignedTo: 'Coastal Floor Systems',
    priority: 'High',
    status: 'Completed',
    startDate: '2026-10-30',
    dueDate: '2026-11-04',
    completedDate: '2026-11-04',
    progressPercent: 100,
    estimatedHours: 48,
    actualHoursSpent: 46,
    tags: ['Flooring', 'Industrial']
  }
];

export const INITIAL_DAILY_REPORTS: DailySiteReport[] = [
  {
    id: 'DSR-01',
    reportNumber: 'DSR-2026-145',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-11-05',
    weather: 'Sunny & Clear (26°C)',
    activeWorkersCount: 78,
    activeEquipmentCount: 6,
    workAccomplished: 'Completed shuttering and formwork propping for Level 8 North Wing slab. Rebar fixers placed 85% of top and bottom mats. Electrical subcontractor installed 140 conduit drop points.',
    delaysAndIssues: 'Minor 1-hour delay in morning due to traffic snarl on Argwings Kodhek road delaying ready-mix truck clearance.',
    safetyIncidentsRecorded: 0,
    materialsDeliveredSummary: 'Received 600 bags Bamburi PowerPlus cement. Rebar stock inspected and accepted.',
    preparedBy: 'David Kimani, PE (Resident Engineer)',
    signedOffByResidentEngineer: true
  },
  {
    id: 'DSR-02',
    reportNumber: 'DSR-2026-144',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-11-04',
    weather: 'Overcast & Humid (22°C)',
    activeWorkersCount: 82,
    activeEquipmentCount: 6,
    workAccomplished: 'Cast 8 columns on Floor 7. Stripped soffit formwork from Floor 5 after 14-day compressive strength cube confirmation of 38.2 MPa.',
    delaysAndIssues: 'None. Work on critical path running on target.',
    safetyIncidentsRecorded: 0,
    materialsDeliveredSummary: '20 Tonnes 20mm aggregates delivered by Machakos hauliers.',
    preparedBy: 'David Kimani, PE (Resident Engineer)',
    signedOffByResidentEngineer: true
  }
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'EQ-01',
    assetCode: 'PLANT-CRN-01',
    name: 'Potain MDT 219 J10 Topless Tower Crane (50m Jib)',
    category: 'Cranes & Hoists',
    modelYear: '2022',
    assignedProjectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    status: 'Operational',
    operatingHours: 2410,
    fuelTodayLitres: 0, // Electric powered
    hourlyRentalRateKES: 4500,
    lastServiceDate: '2026-10-10',
    nextServiceDueDate: '2026-12-10',
    operatorName: 'Peter Waweru',
    dailyCostKES: 36000
  },
  {
    id: 'EQ-02',
    assetCode: 'PLANT-EXC-03',
    name: 'Caterpillar 320D Hydraulic Heavy Excavator',
    category: 'Excavators & Earthmoving',
    modelYear: '2021',
    assignedProjectId: 'PRJ-02',
    projectName: 'Mombasa Port Inland Container Depot Logistics Warehouse',
    status: 'In Use',
    operatingHours: 4180,
    fuelTodayLitres: 140,
    hourlyRentalRateKES: 5800,
    lastServiceDate: '2026-10-28',
    nextServiceDueDate: '2026-11-28',
    operatorName: 'Ezekiel Omwamba',
    dailyCostKES: 46400
  },
  {
    id: 'EQ-03',
    assetCode: 'PLANT-MXR-02',
    name: 'Winget 500L Hydraulic Reversible Drum Mixer',
    category: 'Concrete & Mixing',
    modelYear: '2023',
    assignedProjectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    status: 'Operational',
    operatingHours: 890,
    fuelTodayLitres: 35,
    hourlyRentalRateKES: 1800,
    lastServiceDate: '2026-10-15',
    nextServiceDueDate: '2026-11-15',
    operatorName: 'Paul Githinji',
    dailyCostKES: 14400
  },
  {
    id: 'EQ-04',
    assetCode: 'PLANT-GEN-01',
    name: 'Perkins 150kVA Silent Diesel Backup Generator',
    category: 'Generators & Power',
    modelYear: '2022',
    assignedProjectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    status: 'Operational',
    operatingHours: 1240,
    fuelTodayLitres: 48,
    hourlyRentalRateKES: 2200,
    lastServiceDate: '2026-09-20',
    nextServiceDueDate: '2026-11-20',
    operatorName: 'Site Electrical Team',
    dailyCostKES: 17600
  },
  {
    id: 'EQ-05',
    assetCode: 'PLANT-TRK-05',
    name: 'Mercedes-Benz Actros 3340 20-Tonne Tipper Truck',
    category: 'Haulage & Trucks',
    modelYear: '2020',
    assignedProjectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    status: 'Maintenance Required',
    operatingHours: 6320,
    fuelTodayLitres: 0,
    hourlyRentalRateKES: 3500,
    lastServiceDate: '2026-08-12',
    nextServiceDueDate: '2026-11-05', // Overdue service!
    operatorName: 'James Kariuki',
    dailyCostKES: 28000
  }
];

export const INITIAL_SAFETY_INCIDENTS: SafetyIncident[] = [
  {
    id: 'INC-01',
    incidentNumber: 'INC-2026-008',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-10-22',
    time: '11:15 AM',
    severity: 'Near Miss',
    locationOnSite: 'Level 6 South Façade perimeter scaffold',
    description: 'A 2-meter steel scaffold clamp slipped from a subcontractor worker hand and dropped 3 floors down, landing inside the netted catch barrier.',
    injuredPerson: 'None (Safe catch)',
    rootCause: 'Failure to use tethered wrist lanyards for hand tools when working at height above 2 meters.',
    immediateActionTaken: 'Work stopped on Level 6 scaffold. Catch net inspected for tear. All workers re-briefed on tool lanyard mandates.',
    correctiveActionPlan: 'Procured 60 elasticated tool lanyards. Daily toolbox talk on tethering tools enforced before scaffold access.',
    investigator: 'Hassan Omar (Safety Officer)',
    status: 'Closed & Signed Off',
    daysLost: 0
  },
  {
    id: 'INC-02',
    incidentNumber: 'INC-2026-009',
    projectId: 'PRJ-01',
    projectName: 'Kilimani Heights Executive Commercial Plaza',
    date: '2026-10-29',
    time: '15:40 PM',
    severity: 'Minor / First Aid',
    locationOnSite: 'Rebar Cutting & Bending Yard',
    description: 'Steel fixer suffered a superficial puncture wound on right forearm from a burred D16 rebar cut end during manual handling.',
    injuredPerson: 'Kennedy Oduor (Lead Steel Fixer)',
    rootCause: 'Cut-resistant Kevlar sleeves were not worn; standard cotton overalls offered insufficient barrier.',
    immediateActionTaken: 'Site nurse washed and dressed wound with antiseptic. Tetanus toxoid booster administered at nearby clinic.',
    correctiveActionPlan: 'Issued mandatory heavy-duty Kevlar sleeves to all 18 steel fixing crew members.',
    investigator: 'Hassan Omar (Safety Officer)',
    status: 'Closed & Signed Off',
    daysLost: 0
  }
];

export const INITIAL_TOOLBOX_TALKS: SafetyToolboxTalk[] = [
  {
    id: 'TBT-01',
    projectId: 'PRJ-01',
    date: '2026-11-05',
    topic: 'Working at Heights & Dual-Lanyard Safety Harness Inspection',
    attendeesCount: 54,
    conductedBy: 'Hassan Omar (Safety Officer)',
    keyHazardsDiscussed: [
      'Scaffold deck load limits',
      '100% tie-off requirement to certified anchor points',
      'Exclusion zone marking underneath lifting radii'
    ]
  },
  {
    id: 'TBT-02',
    projectId: 'PRJ-01',
    date: '2026-10-30',
    topic: 'Dust Suppression, Eye Protection & Silica Hazard Awareness',
    attendeesCount: 62,
    conductedBy: 'Hassan Omar (Safety Officer)',
    keyHazardsDiscussed: [
      'Wet-cutting diamond blades for masonry',
      'FFP3 particulate respirator masks',
      'Eye wash station locations'
    ]
  }
];

export const INITIAL_QUALITY_INSPECTIONS: QualityInspection[] = [
  {
    id: 'QA-01',
    inspectionCode: 'QA-KLM-088',
    projectId: 'PRJ-01',
    elementChecked: 'Level 7 Columns Concrete Compressive Cube Strength (28-day)',
    inspectionDate: '2026-11-04',
    inspectorName: 'David Kimani, PE (Resident Engineer)',
    result: 'Passed',
    defectsNoted: ['Average 28-day cube strength recorded at 41.5 MPa against C35/45 specification.'],
    reInspectionRequired: false,
    signOffEngineer: 'David Kimani, PE'
  },
  {
    id: 'QA-02',
    inspectionCode: 'QA-KLM-089',
    projectId: 'PRJ-01',
    elementChecked: 'Floor 8 Suspended Slab Formwork & Rebar Spacing Grid',
    inspectionDate: '2026-11-05',
    inspectorName: 'David Kimani, PE',
    result: 'Conditional Pass (Rectify before pour)',
    defectsNoted: [
      'Concrete spacer blocks missing in two bays along Grid D-E',
      'Sawdust and tie wire offcuts in bottom of beam box B-14 require air-compressor blow out'
    ],
    reInspectionRequired: true,
    signOffEngineer: 'David Kimani, PE'
  }
];

export const INITIAL_NCRS: NonConformanceReport[] = [
  {
    id: 'NCR-01',
    ncrNumber: 'NCR-2026-014',
    projectId: 'PRJ-01',
    dateRaised: '2026-10-18',
    clauseOrSpec: 'BS 8110 Part 1 - Concrete Cover Requirements (Clause 3.3)',
    defectDescription: 'Ground level planter retaining wall showed minor honeycombing over an area of 0.8m² after shutter stripping due to inadequate pencil vibrator penetration.',
    severity: 'Minor',
    disposition: 'Rework',
    correctiveActionDeadline: '2026-10-25',
    responsibleParty: 'SolidWorks Formwork Specialists',
    status: 'Verified & Closed'
  }
];

export const INITIAL_DOCUMENTS: ProjectDocument[] = [
  {
    id: 'DOC-01',
    projectId: 'PRJ-01',
    title: 'Architectural Working Drawings - Set 04 (Levels 6-12)',
    category: 'Architectural Drawings',
    fileName: 'KLM-ARC-DWG-REV04.dwg.pdf',
    version: 'v4.2 - Approved For Construction',
    fileSize: '24.8 MB',
    uploadedDate: '2026-09-15',
    uploadedBy: 'Arch. Faith Mutua',
    status: 'Current',
    accessLevel: 'All Project Team'
  },
  {
    id: 'DOC-02',
    projectId: 'PRJ-01',
    title: 'Structural General Arrangement & Rebar Schedules (Floor 8-10)',
    category: 'Structural Drawings',
    fileName: 'KLM-STR-S08-S10-REVC.pdf',
    version: 'v3.0 - Signed by Lead Structural Eng.',
    fileSize: '18.4 MB',
    uploadedDate: '2026-10-02',
    uploadedBy: 'David Kimani, PE',
    status: 'Current',
    accessLevel: 'Consultants & Engineers'
  },
  {
    id: 'DOC-03',
    projectId: 'PRJ-01',
    title: 'Bills of Quantities (BOQ) - Section 04: Reinforced Concrete Superstructure',
    category: 'Bills of Quantities (BOQ)',
    fileName: 'KLM-BOQ-SEC4-SUPERSTRUCTURE.xlsx.pdf',
    version: 'v1.4 - Contract Document',
    fileSize: '8.2 MB',
    uploadedDate: '2025-08-01',
    uploadedBy: 'Catherine Njeri, BQS',
    status: 'Current',
    accessLevel: 'Management Only'
  },
  {
    id: 'DOC-04',
    projectId: 'PRJ-01',
    title: 'National Construction Authority (NCA) Compliance Certificate',
    category: 'Statutory Permits (NCA/NEMA/County)',
    fileName: 'NCA-CERT-2025-REG-98012.pdf',
    version: 'v1.0 - Active Validated',
    fileSize: '2.1 MB',
    uploadedDate: '2025-07-28',
    uploadedBy: 'Eng. Brian Ochieng',
    status: 'Current',
    accessLevel: 'All Project Team'
  },
  {
    id: 'DOC-05',
    projectId: 'PRJ-01',
    title: 'NEMA Environmental Impact Assessment License',
    category: 'Statutory Permits (NCA/NEMA/County)',
    fileName: 'NEMA-EIA-LIC-004921.pdf',
    version: 'v1.0',
    fileSize: '3.4 MB',
    uploadedDate: '2025-06-15',
    uploadedBy: 'Hassan Omar (Safety Officer)',
    status: 'Current',
    accessLevel: 'All Project Team'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    type: 'Inventory',
    title: 'Low Stock Alert: 16mm High-Yield Rebar',
    message: 'Current stock of Devki D16 Rebar is at 14.2 Tonnes, below minimum threshold of 20.0 Tonnes. Re-order PO-2026-088 approved.',
    timestamp: '15 mins ago',
    isRead: false,
    severity: 'warning',
    linkTarget: 'inventory'
  },
  {
    id: 'NOTIF-02',
    type: 'Task',
    title: 'Critical Path Quality Review Due',
    message: 'Floor 8 Slab Rebar Spacing inspection is scheduled for re-inspection before concrete pour.',
    timestamp: '1 hour ago',
    isRead: false,
    severity: 'info',
    linkTarget: 'tasks'
  },
  {
    id: 'NOTIF-03',
    type: 'Procurement',
    title: 'Purchase Order Approved: Devki Steel',
    message: 'PO-2026-088 for KES 5,515,800 has been certified by QS and approved by Finance.',
    timestamp: '3 hours ago',
    isRead: false,
    severity: 'success',
    linkTarget: 'procurement'
  },
  {
    id: 'NOTIF-04',
    type: 'Budget',
    title: 'Subcontractor IPC Certificate Ready for Review',
    message: 'SolidWorks Formwork Specialists submitted Interim Certificate IPC-KLM-006 (KES 4,420,000 net).',
    timestamp: '5 hours ago',
    isRead: true,
    severity: 'info',
    linkTarget: 'financial'
  },
  {
    id: 'NOTIF-05',
    type: 'Safety',
    title: 'Service Overdue: Mercedes Tipper Truck',
    message: 'Plant Asset PLANT-TRK-05 has exceeded scheduled service operating hours interval.',
    timestamp: 'Yesterday',
    isRead: true,
    severity: 'critical',
    linkTarget: 'equipment'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-11-06 08:30:15',
    userName: 'Moses Kiprotich, CPA',
    userRole: 'Finance Officer',
    action: 'Approved Purchase Order',
    module: 'Procurement',
    details: 'Authorized PO-2026-088 to Devki Steel Mills Ltd for KES 5,515,800'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-11-06 07:15:00',
    userName: 'Samuel Mwangi',
    userRole: 'Storekeeper',
    action: 'Logged Daily Attendance',
    module: 'Workforce',
    details: 'Recorded attendance check-in for 78 site operatives on PRJ-01'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-11-05 16:45:22',
    userName: 'David Kimani, PE',
    userRole: 'Site Engineer',
    action: 'Submitted Daily Site Report',
    module: 'Site Operations',
    details: 'Submitted DSR-2026-145 for Kilimani Heights Project'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-11-05 14:10:04',
    userName: 'Hassan Omar',
    userRole: 'Safety Officer',
    action: 'Completed Safety Toolbox Talk',
    module: 'Health & Safety',
    details: 'Conducted working at heights safety briefing with 54 attendees'
  }
];
