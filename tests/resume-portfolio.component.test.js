import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import reactPlugin from '@vitejs/plugin-react';
import { createServer } from 'vite';

let vite;
let App;

before(async () => {
  vite = await createServer({
    configFile: false,
    root: process.cwd(),
    plugins: [reactPlugin()],
    server: { middlewareMode: true },
    appType: 'custom',
  });
  ({ default: App } = await vite.ssrLoadModule('/src/App.jsx'));
});

after(async () => {
  await vite?.close();
});

test('resume portfolio renders profile, work history, projects, and skills', () => {
  const markup = renderToStaticMarkup(React.createElement(App));

  assert.match(markup, /<h1>Avery Johnson<\/h1>/);
  assert.match(markup, /Frontend Developer &amp; Product Designer/);
  assert.match(markup, /mailto:avery\.johnson\.dev@gmail\.com/);
  assert.match(markup, /Senior Frontend Developer/);
  assert.match(markup, /TaskFlow Pro/);
  assert.match(markup, /Core Skills/);
  assert.match(markup, /Download PDF/);
});

test('resume portfolio renders all repeated experience, project, and achievement entries', () => {
  const markup = renderToStaticMarkup(React.createElement(App));

  assert.equal((markup.match(/class="experience-item"/g) || []).length, 3);
  assert.equal((markup.match(/class="project-card"/g) || []).length, 3);
  assert.match(markup, /Improved average page speed score from 72 to 92/);
});
