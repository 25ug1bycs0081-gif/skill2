import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import {
  mockAppointments,
  mockBilling,
  mockDoctors,
  mockLabTests,
  mockNotifications,
  mockPatients,
  mockUsers,
} from '../server/data/mockData.js';

const collections = {
  users: mockUsers,
  patients: mockPatients,
  doctors: mockDoctors,
  appointments: mockAppointments,
  billing: mockBilling,
  labTests: mockLabTests,
  notifications: mockNotifications,
};

test('all mock records have unique, non-empty identifiers', () => {
  for (const [collectionName, records] of Object.entries(collections)) {
    const ids = records.map((record) => record.id);

    assert.ok(ids.every((id) => typeof id === 'string' && id.length > 0), collectionName);
    assert.equal(new Set(ids).size, ids.length, collectionName);
  }
});

test('mock appointments, bills, lab tests, and notifications reference existing records', () => {
  const patientIds = new Set(mockPatients.map((patient) => patient.id));
  const doctorIds = new Set(mockDoctors.map((doctor) => doctor.id));
  const userIds = new Set(mockUsers.map((user) => user.id));

  assert.ok(mockAppointments.every((appointment) =>
    patientIds.has(appointment.patientId) && doctorIds.has(appointment.doctorId)));
  assert.ok(mockBilling.every((bill) => patientIds.has(bill.patientId)));
  assert.ok(mockLabTests.every((labTest) => patientIds.has(labTest.patientId)));
  assert.ok(mockNotifications.every((notification) => userIds.has(notification.userId)));
});

test('mock users have valid login credentials and unique case-insensitive emails', () => {
  const normalizedEmails = mockUsers.map((user) => user.email.toLowerCase());

  assert.ok(mockUsers.every((user) => user.email.includes('@') && user.password.length >= 6));
  assert.equal(new Set(normalizedEmails).size, normalizedEmails.length);
});

test('property: all generated indexes into a record collection stay in bounds', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...Object.values(collections)),
      fc.nat(),
      (records, candidateIndex) => {
        const index = candidateIndex % records.length;
        assert.ok(records[index]);
        assert.ok(records[index].id);
      },
    ),
    { numRuns: 300 },
  );
});
