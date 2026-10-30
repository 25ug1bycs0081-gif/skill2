import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('hospital-index.html', root), 'utf8');
const script = await readFile(new URL('hospital-script.js', root), 'utf8');

function createPage() {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'http://localhost/',
  });
  dom.window.scrollTo = () => {};
  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom;
}

function submitAppointment(dom, { name, email, phone, department, date }) {
  const { document, Event } = dom.window;
  document.querySelector('[name="name"]').value = name;
  document.querySelector('[name="email"]').value = email;
  document.querySelector('[name="phone"]').value = phone;
  document.querySelector('[name="department"]').value = department;
  document.querySelector('[name="date"]').value = date;
  const form = document.getElementById('appointmentForm');
  form.reportValidity = () => false;
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  return {
    form,
    message: document.querySelector('.form-message'),
  };
}

test('initializes the displayed year and handles a valid appointment request', () => {
  const dom = createPage();
  const { form, message } = submitAppointment(dom, {
    name: 'Taylor Patient',
    email: 'taylor@example.com',
    phone: '+1 (415) 555-0192',
    department: 'Cardiology',
    date: '2026-11-15',
  });

  assert.equal(dom.window.document.getElementById('year').textContent, String(new Date().getFullYear()));
  assert.equal(message.textContent, 'Appointment request submitted successfully.');
  assert.equal(message.className, 'form-message success');
  assert.equal(form.querySelector('[name="name"]').value, '');
  dom.window.close();
});

test('shows an error and preserves entered values when required data is invalid', () => {
  const dom = createPage();
  const { form, message } = submitAppointment(dom, {
    name: 'Taylor Patient',
    email: 'not-an-email',
    phone: '12345',
    department: 'Cardiology',
    date: '2026-11-15',
  });

  assert.equal(message.textContent, 'Please fill in all required fields correctly.');
  assert.equal(message.className, 'form-message error');
  assert.equal(form.querySelector('[name="name"]').value, 'Taylor Patient');
  dom.window.close();
});

test('property: appointment submission accepts any phone with at least 10 digits', () => {
  fc.assert(
    fc.property(fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 10, maxLength: 24 }), (digits) => {
      const dom = createPage();
      const { message } = submitAppointment(dom, {
        name: 'Taylor Patient',
        email: 'taylor@example.com',
        phone: digits.join(''),
        department: 'Cardiology',
        date: '2026-11-15',
      });

      assert.equal(message.className, 'form-message success');
      dom.window.close();
    }),
    { numRuns: 30 },
  );
});

test('property: appointment submission rejects phone numbers with fewer than 10 digits', () => {
  fc.assert(
    fc.property(fc.array(fc.integer({ min: 0, max: 9 }), { maxLength: 9 }), (digits) => {
      const dom = createPage();
      const { message } = submitAppointment(dom, {
        name: 'Taylor Patient',
        email: 'taylor@example.com',
        phone: digits.join(''),
        department: 'Cardiology',
        date: '2026-11-15',
      });

      assert.equal(message.className, 'form-message error');
      dom.window.close();
    }),
    { numRuns: 30 },
  );
});
