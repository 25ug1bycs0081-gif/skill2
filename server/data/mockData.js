export const mockUsers = [
  {
    id: 'u-admin',
    name: 'Super Admin',
    email: 'admin@pirateshms.com',
    password: 'pirates123',
    role: 'SUPER_ADMIN',
    department: 'Administration',
  },
  {
    id: 'u-hospital-admin',
    name: 'Hospital Admin',
    email: 'hospitaladmin@pirateshms.com',
    password: 'hospital123',
    role: 'HOSPITAL_ADMIN',
    department: 'Operations',
  },
  {
    id: 'u-reception',
    name: 'Reception Desk',
    email: 'reception@pirateshms.com',
    password: 'reception123',
    role: 'RECEPTIONIST',
    department: 'Front Desk',
  },
  {
    id: 'u-doctor',
    name: 'Dr. Aisha Kapoor',
    email: 'doctor@pirateshms.com',
    password: 'doctor123',
    role: 'DOCTOR',
    department: 'Cardiology',
  },
  {
    id: 'u-nurse',
    name: 'Nurse Sofia',
    email: 'nurse@pirateshms.com',
    password: 'nurse123',
    role: 'NURSE',
    department: 'ICU',
  },
  {
    id: 'u-pharmacist',
    name: 'Pharmacist Arjun',
    email: 'pharmacist@pirateshms.com',
    password: 'pharmacist123',
    role: 'PHARMACIST',
    department: 'Pharmacy',
  },
  {
    id: 'u-lab',
    name: 'Lab Officer',
    email: 'lab@pirateshms.com',
    password: 'lab123',
    role: 'LAB_STAFF',
    department: 'Lab',
  },
  {
    id: 'u-accountant',
    name: 'Accountant Nisha',
    email: 'accountant@pirateshms.com',
    password: 'accountant123',
    role: 'ACCOUNTANT',
    department: 'Finance',
  },
  {
    id: 'u-patient',
    name: 'Patient John',
    email: 'patient@pirateshms.com',
    password: 'patient123',
    role: 'PATIENT',
    department: 'General',
  },
];

export const mockDoctors = [
  { id: 'd1', name: 'Dr. Aisha Kapoor', specialty: 'Cardiology', department: 'Cardiology', available: true },
  { id: 'd2', name: 'Dr. Rahul Mehta', specialty: 'Neurology', department: 'Neurology', available: true },
  { id: 'd3', name: 'Dr. Nisha Verma', specialty: 'Pediatrics', department: 'Pediatrics', available: true },
  { id: 'd4', name: 'Dr. Arpita Sen', specialty: 'Orthopaedics', department: 'Orthopaedics', available: false },
];

export const mockPatients = [
  {
    id: 'p1',
    patientId: 'MC-1001',
    name: 'Aarav Sharma',
    dob: '1998-04-15',
    gender: 'Male',
    phone: '+91 98765 11111',
    email: 'aarav@example.com',
    address: 'Bengaluru, Karnataka',
    emergencyContact: '+91 99877 22334',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    medicalHistory: 'Asthma',
    status: 'active',
  },
  {
    id: 'p2',
    patientId: 'MC-1002',
    name: 'Maya Iyer',
    dob: '1994-09-03',
    gender: 'Female',
    phone: '+91 98765 22222',
    email: 'maya@example.com',
    address: 'Hyderabad, Telangana',
    emergencyContact: '+91 99877 44331',
    bloodGroup: 'AB-',
    allergies: 'None',
    medicalHistory: 'None',
    status: 'admitted',
  },
  {
    id: 'p3',
    patientId: 'MC-1003',
    name: 'Rohan Das',
    dob: '2002-02-22',
    gender: 'Male',
    phone: '+91 98765 33333',
    email: 'rohan@example.com',
    address: 'Pune, Maharashtra',
    emergencyContact: '+91 99877 55667',
    bloodGroup: 'A+',
    allergies: 'None',
    medicalHistory: 'Fracture history',
    status: 'follow-up',
  },
  {
    id: 'p4',
    patientId: 'MC-1004',
    name: 'Sana Khan',
    dob: '1988-11-10',
    gender: 'Female',
    phone: '+91 98765 44444',
    email: 'sana@example.com',
    address: 'Delhi',
    emergencyContact: '+91 99877 77665',
    bloodGroup: 'B+',
    allergies: 'Latex',
    medicalHistory: 'Hypertension',
    status: 'active',
  },
];

export const mockAppointments = [
  { id: 'a1', patientId: 'p1', doctorId: 'd1', department: 'Cardiology', scheduledAt: '2026-10-29T10:00:00.000Z', status: 'scheduled', reason: 'Cardiac consultation' },
  { id: 'a2', patientId: 'p2', doctorId: 'd2', department: 'Neurology', scheduledAt: '2026-10-29T12:30:00.000Z', status: 'completed', reason: 'Headache monitoring' },
  { id: 'a3', patientId: 'p3', doctorId: 'd3', department: 'Pediatrics', scheduledAt: '2026-10-30T09:00:00.000Z', status: 'scheduled', reason: 'Routine checkup' },
  { id: 'a4', patientId: 'p4', doctorId: 'd1', department: 'Cardiology', scheduledAt: '2026-10-31T15:00:00.000Z', status: 'pending', reason: 'Blood pressure review' },
];

export const mockBilling = [
  { id: 'b1', patientId: 'p1', amount: 4200, status: 'paid', invoiceNo: 'INV-1001' },
  { id: 'b2', patientId: 'p2', amount: 6800, status: 'pending', invoiceNo: 'INV-1002' },
  { id: 'b3', patientId: 'p4', amount: 5300, status: 'paid', invoiceNo: 'INV-1003' },
];

export const mockLabTests = [
  { id: 'l1', patientId: 'p1', testName: 'CBC', status: 'completed', result: 'Within normal range' },
  { id: 'l2', patientId: 'p2', testName: 'MRI Scan', status: 'pending', result: '' },
  { id: 'l3', patientId: 'p3', testName: 'X-ray', status: 'completed', result: 'Fracture healing' },
];

export const mockNotifications = [
  { id: 'n1', userId: 'u-admin', title: 'New patient registered', message: 'A patient was added to the system today.', read: false },
  { id: 'n2', userId: 'u-doctor', title: 'Lab results available', message: 'CBC report for Aarav Sharma is ready.', read: false },
  { id: 'n3', userId: 'u-patient', title: 'Appointment reminder', message: 'Your consultation is scheduled tomorrow at 10:00 AM.', read: true },
];
