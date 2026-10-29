import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { mockUsers, mockPatients, mockAppointments, mockDoctors, mockBilling, mockLabTests, mockNotifications } from './data/mockData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pirates-hms-secret';
const prisma = process.env.DATABASE_URL ? new PrismaClient() : null;
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/auth', rateLimit({ windowMs: 60 * 1000, max: 20, message: { message: 'Too many login attempts. Please try again later.' } }));

const demoUsers = mockUsers.map((user) => ({
  ...user,
  passwordHash: bcrypt.hashSync(user.password, 10),
}));

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

const requireAuth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied.' });
  }
  next();
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'PIRATES HMS API', hospital: 'PIRATES Hospital' });
});

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Please provide a valid email and password.' });
  }

  const { email, password } = parsed.data;
  const user = demoUsers.find((entry) => entry.email.toLowerCase() === String(email).toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = demoUsers.find((entry) => entry.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
});

app.get('/api/dashboard', requireAuth, async (req, res) => {
  const totalPatients = mockPatients.length;
  const totalDoctors = mockDoctors.length;
  const pendingAppointments = mockAppointments.filter((apt) => apt.status !== 'completed').length;
  const todayAppointments = mockAppointments.length;
  const totalRevenue = mockBilling.reduce((sum, bill) => sum + Number(bill.amount), 0);
  const pendingPayments = mockBilling.filter((bill) => bill.status === 'pending').length;

  const chartSeries = [
    { name: 'Jan', patients: 48, revenue: 12000 },
    { name: 'Feb', patients: 56, revenue: 15000 },
    { name: 'Mar', patients: 64, revenue: 19000 },
    { name: 'Apr', patients: 72, revenue: 21000 },
    { name: 'May', patients: 81, revenue: 24000 },
    { name: 'Jun', patients: 88, revenue: 26000 },
  ];

  const departmentStats = [
    { name: 'Cardiology', value: 28 },
    { name: 'Neurology', value: 18 },
    { name: 'Pediatrics', value: 24 },
    { name: 'Orthopaedics', value: 16 },
    { name: 'General', value: 34 },
  ];

  const recentPatients = mockPatients.slice(0, 4).map((patient) => ({
    id: patient.patientId,
    name: patient.name,
    status: patient.status,
    time: 'Today',
  }));

  const notifications = mockNotifications.filter((item) => item.userId === req.user.id || item.userId === 'u-admin');

  return res.json({
    stats: {
      totalPatients,
      totalDoctors,
      totalStaff: 120,
      todayAppointments,
      pendingAppointments,
      availableBeds: 112,
      occupiedBeds: 84,
      monthlyRevenue: totalRevenue,
      pendingPayments,
      pharmacyAlerts: 6,
    },
    chartSeries,
    departmentStats,
    recentPatients,
    notifications,
    userRole: req.user.role,
  });
});

app.get('/api/patients', requireAuth, (_req, res) => {
  res.json({ patients: mockPatients });
});

app.get('/api/doctors', requireAuth, (_req, res) => {
  res.json({ doctors: mockDoctors });
});

app.get('/api/appointments', requireAuth, (_req, res) => {
  const appointments = mockAppointments.map((appointment) => ({
    ...appointment,
    patient: mockPatients.find((patient) => patient.id === appointment.patientId),
    doctor: mockDoctors.find((doctor) => doctor.id === appointment.doctorId),
  }));

  res.json({ appointments });
});

app.get('/api/reports/overview', requireAuth, (_req, res) => {
  res.json({
    summary: {
      admissions: 129,
      discharges: 94,
      inPatients: 86,
      outPatients: 214,
    },
    revenueBreakdown: [
      { name: 'Consultation', value: 38 },
      { name: 'Diagnostics', value: 28 },
      { name: 'Pharmacy', value: 22 },
      { name: 'Procedures', value: 12 },
    ],
    labMetrics: [
      { name: 'CBC', value: 92 },
      { name: 'ECG', value: 82 },
      { name: 'MRI', value: 70 },
      { name: 'X-Ray', value: 88 },
    ],
  });
});

app.get('/api/billing', requireAuth, (_req, res) => {
  res.json({ billing: mockBilling });
});

app.get('/api/labs', requireAuth, (_req, res) => {
  res.json({ tests: mockLabTests });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`PIRATES HMS API listening on http://localhost:${PORT}`);
});
