import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import {
  mockAppointments,
  mockBilling,
  mockDoctors,
  mockLabTests,
  mockPatients,
} from '../server/data/mockData.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const serverFile = fileURLToPath(new URL('../server/index.js', import.meta.url));
const testSecret = 'unit-test-only-jwt-secret';
let child;
let baseUrl;
let childLogs = '';

async function findAvailablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitForHealth(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Hospital API stopped before becoming ready.\n${childLogs}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // The server may not have bound its port yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Hospital API did not become ready in time.\n${childLogs}`);
}

before(async () => {
  const port = await findAvailablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  const env = { ...process.env, PORT: String(port), JWT_SECRET: testSecret, NODE_ENV: 'test' };
  delete env.DATABASE_URL;

  child = spawn(process.execPath, [serverFile], {
    cwd: projectRoot,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.setEncoding('utf8').on('data', (data) => { childLogs += data; });
  child.stderr.setEncoding('utf8').on('data', (data) => { childLogs += data; });
  await waitForHealth();
}, { timeout: 20000 });

after(async () => {
  if (!child || child.exitCode !== null) return;

  const exited = new Promise((resolve) => child.once('exit', resolve));
  child.kill();
  await exited;
});

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
}

async function login() {
  const { response, body } = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@pirateshms.com', password: 'pirates123' }),
  });
  assert.equal(response.status, 200);
  const cookie = response.headers.get('set-cookie');
  assert.ok(cookie?.includes('token='));
  return { user: body.user, cookie };
}

test('health endpoint returns service metadata without authentication', async () => {
  const { response, body } = await request('/api/health');

  assert.equal(response.status, 200);
  assert.deepEqual(body, {
    status: 'ok',
    service: 'PIRATES HMS API',
    hospital: 'PIRATES Hospital',
  });
});

test('malformed JSON request bodies are rejected as client errors', async () => {
  const { response, body } = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });

  assert.equal(response.status, 400);
  assert.equal(body.message, 'Invalid request body.');
});

test('login validates inputs, rejects bad credentials, and matches email case-insensitively', async () => {
  for (const invalidBody of [
    {},
    { email: 'invalid-email', password: 'long-enough' },
    { email: 'admin@pirateshms.com', password: 'short' },
  ]) {
    const { response, body } = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(invalidBody),
    });
    assert.equal(response.status, 400);
    assert.equal(body.message, 'Please provide a valid email and password.');
  }

  const wrongPassword = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@pirateshms.com', password: 'incorrect' }),
  });
  assert.equal(wrongPassword.response.status, 401);

  const mixedCaseLogin = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'ADMIN@PIRATESHMS.COM', password: 'pirates123' }),
  });
  assert.equal(mixedCaseLogin.response.status, 200);
  assert.equal(mixedCaseLogin.body.user.email, 'admin@pirateshms.com');
  assert.equal(Object.hasOwn(mixedCaseLogin.body.user, 'password'), false);
});

test('protected API endpoints reject missing and invalid credentials', async () => {
  const endpoints = [
    '/api/auth/me',
    '/api/dashboard',
    '/api/patients',
    '/api/doctors',
    '/api/appointments',
    '/api/reports/overview',
    '/api/billing',
    '/api/labs',
  ];

  for (const endpoint of endpoints) {
    const unauthenticated = await request(endpoint);
    assert.equal(unauthenticated.response.status, 401, endpoint);
    assert.equal(unauthenticated.body.message, 'Authentication required.', endpoint);

    const invalid = await request(endpoint, {
      headers: { authorization: 'Bearer invalid-token' },
    });
    assert.equal(invalid.response.status, 401, endpoint);
    assert.equal(invalid.body.message, 'Invalid or expired token.', endpoint);
  }
});

test('authenticated profile and collection routes return expected records', async () => {
  const { cookie, user } = await login();
  assert.equal(user.role, 'SUPER_ADMIN');
  assert.equal(Object.hasOwn(user, 'password'), false);

  const profile = await request('/api/auth/me', { headers: { cookie } });
  assert.equal(profile.response.status, 200);
  assert.equal(profile.body.user.id, user.id);

  const bearerToken = cookie.match(/token=([^;]+)/)?.[1];
  assert.ok(bearerToken);
  const bearerProfile = await request('/api/auth/me', {
    headers: { authorization: `Bearer ${bearerToken}` },
  });
  assert.equal(bearerProfile.response.status, 200);
  assert.equal(bearerProfile.body.user.id, user.id);

  const patients = await request('/api/patients', { headers: { cookie } });
  assert.deepEqual(patients.body.patients.map((item) => item.id), mockPatients.map((item) => item.id));

  const doctors = await request('/api/doctors', { headers: { cookie } });
  assert.deepEqual(doctors.body.doctors.map((item) => item.id), mockDoctors.map((item) => item.id));

  const appointments = await request('/api/appointments', { headers: { cookie } });
  assert.equal(appointments.body.appointments.length, mockAppointments.length);
  assert.ok(appointments.body.appointments.every((item) => item.patient && item.doctor));

  const billing = await request('/api/billing', { headers: { cookie } });
  assert.deepEqual(billing.body.billing, mockBilling);

  const labs = await request('/api/labs', { headers: { cookie } });
  assert.deepEqual(labs.body.tests, mockLabTests);
});

test('valid tokens for users absent from the demo data return not found', async () => {
  const token = jwt.sign({ id: 'missing-user' }, testSecret, { expiresIn: '1h' });
  const { response, body } = await request('/api/auth/me', {
    headers: { authorization: `Bearer ${token}` },
  });

  assert.equal(response.status, 404);
  assert.deepEqual(body, { message: 'User not found.' });
});

test('dashboard statistics are consistent with the demo data', async () => {
  const { cookie } = await login();
  const { response, body } = await request('/api/dashboard', { headers: { cookie } });

  assert.equal(response.status, 200);
  assert.equal(body.stats.totalPatients, mockPatients.length);
  assert.equal(body.stats.totalDoctors, mockDoctors.length);
  assert.equal(body.stats.pendingAppointments, mockAppointments.filter((item) => item.status !== 'completed').length);
  assert.equal(body.stats.monthlyRevenue, mockBilling.reduce((sum, item) => sum + item.amount, 0));
  assert.equal(body.stats.pendingPayments, mockBilling.filter((item) => item.status === 'pending').length);
  assert.equal(body.userRole, 'SUPER_ADMIN');
});

test('reports overview returns the expected summary and chart series', async () => {
  const { cookie } = await login();
  const { response, body } = await request('/api/reports/overview', { headers: { cookie } });

  assert.equal(response.status, 200);
  assert.deepEqual(body.summary, {
    admissions: 129,
    discharges: 94,
    inPatients: 86,
    outPatients: 214,
  });
  assert.deepEqual(body.revenueBreakdown.map((item) => item.value), [38, 28, 22, 12]);
  assert.deepEqual(body.labMetrics.map((item) => item.value), [92, 82, 70, 88]);
});

test('logout clears the session cookie', async () => {
  const { cookie } = await login();
  const { response, body } = await request('/api/auth/logout', {
    method: 'POST',
    headers: { cookie },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(body, { success: true });
  assert.match(response.headers.get('set-cookie'), /token=;/);
});
